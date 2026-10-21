begin;
-- New accounts default ON; existing saved choices are never overwritten.
create function public.default_signup_email_preference() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if new.is_anonymous is not true and new.email is not null then
  insert into research_email_preferences(user_id,enabled) values(new.id,true) on conflict(user_id) do nothing;
 end if;
 return new;
end;$$;
create trigger default_signup_email_preference after insert on auth.users for each row execute function public.default_signup_email_preference();
create trigger default_converted_email_preference after update of is_anonymous on auth.users for each row when(old.is_anonymous is true and new.is_anonymous is not true) execute function public.default_signup_email_preference();
revoke all on function public.default_signup_email_preference() from public,anon,authenticated;

-- Preserve the original first-week clock when a guest verifies and claims their purchase.
create or replace function public.enroll_member_onboarding() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare original public.member_onboarding;
begin
 if new.access_owner_id is not null and
 ((new.status='active' and new.paid_through>now()) or (new.status='trialing' and new.trial_end>now())) then
  select * into original from member_onboarding where subscription_id=new.stripe_subscription_id and mode=new.mode order by started_at limit 1;
  insert into member_onboarding(user_id,mode,subscription_id,started_at,eligible)
   values(new.access_owner_id,new.mode,new.stripe_subscription_id,coalesce(original.started_at,now()),coalesce(original.eligible,true)) on conflict do nothing;
 end if;
 return new;
end;$$;
-- Guests receive Day 0 through the combined authentication/welcome email, never the worker.
create or replace function public.claim_member_onboarding_email(p_mode text,p_send_mode text)
returns setof public.member_onboarding_emails language plpgsql security definer set search_path=public,pg_temp as $$
declare retry_id uuid;
begin
 if p_mode not in ('test','live') or p_send_mode not in ('dry-run','live') then raise exception 'Invalid mode';end if;
 select id into retry_id from member_onboarding_emails where mode=p_mode and send_mode=p_send_mode and status='claimed' and claimed_at<now()-interval '5 minutes' order by claimed_at for update skip locked limit 1;
 if retry_id is not null then
  return query update member_onboarding_emails set claimed_at=now(),lease_token=gen_random_uuid() where id=retry_id returning *;return;
 end if;
 return query insert into member_onboarding_emails(user_id,mode,step,send_mode)
 select m.user_id,m.mode,days.step,p_send_mode from member_onboarding m
 join research_email_preferences p on p.user_id=m.user_id and p.enabled
 join auth.users u on u.id=m.user_id and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
 cross join (values(0,2),(2,5),(5,7)) days(step,expires)
 where m.mode=p_mode and m.eligible
 and (days.step<>0 or not exists(select 1 from billing_purchase_claims c where c.mode=m.mode and (c.original_user_id=m.user_id or c.claimed_user_id=m.user_id))) and now()>=m.started_at+make_interval(days=>days.step)
 and now()<m.started_at+make_interval(days=>days.expires)
 and not exists(select 1 from member_onboarding_emails e where e.user_id=m.user_id and e.mode=m.mode and e.step=days.step and e.send_mode=p_send_mode)
 order by m.started_at,m.user_id limit 1 on conflict do nothing returning *;
end;$$;
commit;
