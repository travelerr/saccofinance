begin;
-- One first-week sequence per member and billing mode, not per renewal or plan change.
create table public.member_onboarding (
 user_id uuid not null references auth.users(id) on delete cascade,
 mode text not null check(mode in ('test','live')),
 subscription_id text not null,
 started_at timestamptz not null default now(),
 eligible boolean not null default true,
 primary key(user_id,mode)
);
-- Existing members are deliberately excluded from a retroactive welcome campaign.
insert into public.member_onboarding(user_id,mode,subscription_id,eligible)
 select distinct on(access_owner_id,mode) access_owner_id,mode,stripe_subscription_id,false
 from public.billing_subscriptions where access_owner_id is not null order by access_owner_id,mode,stripe_subscription_id;
create function public.enroll_member_onboarding() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if new.access_owner_id is not null and
 ((new.status='active' and new.paid_through>now()) or (new.status='trialing' and new.trial_end>now())) then
  insert into member_onboarding(user_id,mode,subscription_id) values(new.access_owner_id,new.mode,new.stripe_subscription_id) on conflict do nothing;
 end if;
 return new;
end;$$;
create trigger enroll_member_onboarding after insert or update on public.billing_subscriptions for each row execute function public.enroll_member_onboarding();
create table public.member_onboarding_emails (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null,
 mode text not null,
 step integer not null check(step in (0,2,5)),
 send_mode text not null check(send_mode in ('dry-run','live')),
 status text not null default 'claimed' check(status in ('claimed','skipped','dry_run','dispatching','sent','uncertain')),
 claimed_at timestamptz not null default now(),
 lease_token uuid not null default gen_random_uuid(),
 provider_id text,
 foreign key(user_id,mode) references public.member_onboarding(user_id,mode) on delete cascade,
 unique(user_id,mode,step,send_mode)
);
create function public.claim_member_onboarding_email(p_mode text,p_send_mode text)
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
 where m.mode=p_mode and m.eligible and now()>=m.started_at+make_interval(days=>days.step)
 and now()<m.started_at+make_interval(days=>days.expires)
 and not exists(select 1 from member_onboarding_emails e where e.user_id=m.user_id and e.mode=m.mode and e.step=days.step and e.send_mode=p_send_mode)
 order by m.started_at,m.user_id limit 1 on conflict do nothing returning *;
end;$$;
alter table public.member_onboarding enable row level security;
alter table public.member_onboarding_emails enable row level security;
revoke all on public.member_onboarding,public.member_onboarding_emails from public,anon,authenticated;
grant select,insert,update on public.member_onboarding,public.member_onboarding_emails to service_role;
revoke all on function public.enroll_member_onboarding(),public.claim_member_onboarding_email(text,text) from public,anon,authenticated;
grant execute on function public.claim_member_onboarding_email(text,text) to service_role;
commit;
