-- Local rollout: settings default OFF, test and live are independent.
begin;
create table public.premium_trial_settings(mode text primary key check(mode in ('test','live')),enabled boolean not null default false,updated_at timestamptz not null default now(),updated_by uuid);
insert into public.premium_trial_settings(mode) values('test'),('live');
create table public.premium_trial_claims(mode text not null,email text not null,user_id uuid not null,checkout_token uuid not null,expires_at timestamptz not null,used boolean not null default false,primary key(mode,email));
alter table public.premium_trial_settings enable row level security;
alter table public.premium_trial_claims enable row level security;
revoke all on public.premium_trial_settings,public.premium_trial_claims from public,anon,authenticated;
grant all on public.premium_trial_settings,public.premium_trial_claims to service_role;
alter table public.billing_subscriptions add column trial_end timestamptz;
alter table public.billing_customers add column checkout_trial_days integer not null default 0 check(checkout_trial_days in (0,30)),add column checkout_email text;
create function public.reserve_premium_offer(p_user uuid,p_mode text,p_plan text,p_email text,p_prior_customer boolean)
returns public.billing_customers language plpgsql security definer set search_path=public,pg_temp as $$
declare old_exp timestamptz; result public.billing_customers; normalized text:=lower(trim(p_email)); offer boolean; prior_claim public.premium_trial_claims;
begin
 insert into billing_customers(user_id,mode) values(p_user,p_mode) on conflict do nothing;
 select checkout_expires_at into old_exp from billing_customers where user_id=p_user and mode=p_mode for update;
 select * into result from reserve_premium_checkout(p_user,p_mode,p_plan);
 if old_exp>now() then return result; end if;
 select enabled into offer from premium_trial_settings where mode=p_mode for share;
 if not found then raise exception 'OFFER_UNAVAILABLE'; end if;
 update billing_customers set checkout_trial_days=0,checkout_email=normalized where user_id=p_user and mode=p_mode returning * into result;
 if offer and p_plan='monthly' and not p_prior_customer then
  if normalized is null or normalized !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then raise exception 'TRIAL_EMAIL_REQUIRED'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_mode||':'||normalized,0));
  select * into prior_claim from premium_trial_claims where mode=p_mode and email=normalized;
  if prior_claim.used or prior_claim.expires_at>now() then raise exception 'TRIAL_UNAVAILABLE'; end if;
  if exists(select 1 from billing_subscriptions s left join auth.users u on u.id=s.access_owner_id where s.mode=p_mode and (s.user_id=p_user or s.access_owner_id=p_user or lower(trim(u.email))=normalized))
   or exists(select 1 from billing_purchase_claims where mode=p_mode and lower(trim(email))=normalized)
   or exists(select 1 from premium_memberships m join auth.users u on u.id=m.user_id where m.enabled and m.access_source='manual' and (m.user_id=p_user or lower(trim(u.email))=normalized)) then raise exception 'TRIAL_UNAVAILABLE'; end if;
  insert into premium_trial_claims(mode,email,user_id,checkout_token,expires_at) values(p_mode,normalized,p_user,result.checkout_token,result.checkout_expires_at+interval '10 minutes')
  on conflict(mode,email) do update set user_id=excluded.user_id,checkout_token=excluded.checkout_token,expires_at=excluded.expires_at;
  update billing_customers set checkout_trial_days=30 where user_id=p_user and mode=p_mode returning * into result;
 end if;
 return result;
end $$;
revoke all on function public.reserve_premium_offer(uuid,text,text,text,boolean) from public,anon,authenticated;
grant execute on function public.reserve_premium_offer(uuid,text,text,text,boolean) to service_role;
create or replace function public.apply_premium_billing_event(p_event text,p_mode text,p_snapshot jsonb)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare prior public.billing_subscriptions; failure timestamptz; invoice_id text;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_snapshot->>'stripe_subscription_id',0));
 if exists(select 1 from billing_webhook_events where event_id=p_event) then return; end if;
 select * into prior from billing_subscriptions where stripe_subscription_id=p_snapshot->>'stripe_subscription_id';
 if prior.observed_at is null or prior.observed_at<=(p_snapshot->>'observed_at')::timestamptz then
  invoice_id=p_snapshot->>'failed_invoice_id';
  failure=(p_snapshot->>'first_failure_at')::timestamptz;
  if p_snapshot->>'status'='past_due' and prior.failed_invoice_id=invoice_id then
   failure=least(prior.first_failure_at,failure);
  end if;
  insert into billing_subscriptions(stripe_subscription_id,user_id,mode,status,plan,paid_through,trial_end,current_period_end,cancel_at_period_end,cancel_at,first_failure_at,failed_invoice_id,observed_at)
  values(p_snapshot->>'stripe_subscription_id',(p_snapshot->>'user_id')::uuid,p_mode,p_snapshot->>'status',p_snapshot->>'plan',greatest(prior.paid_through,(p_snapshot->>'paid_through')::timestamptz),(p_snapshot->>'trial_end')::timestamptz,(p_snapshot->>'current_period_end')::timestamptz,(p_snapshot->>'cancel_at_period_end')::boolean,(p_snapshot->>'cancel_at')::timestamptz,failure,invoice_id,(p_snapshot->>'observed_at')::timestamptz)
  on conflict(stripe_subscription_id) do update set status=excluded.status,plan=excluded.plan,paid_through=excluded.paid_through,trial_end=excluded.trial_end,current_period_end=excluded.current_period_end,cancel_at_period_end=excluded.cancel_at_period_end,cancel_at=excluded.cancel_at,first_failure_at=excluded.first_failure_at,failed_invoice_id=excluded.failed_invoice_id,observed_at=excluded.observed_at;
 end if;
 update premium_trial_claims set used=true where mode=p_mode and user_id=(p_snapshot->>'user_id')::uuid and (p_snapshot->>'trial_end') is not null;
 insert into billing_webhook_events(event_id,mode) values(p_event,p_mode);
end; $$;
revoke all on function public.apply_premium_billing_event(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.apply_premium_billing_event(text,text,jsonb) to service_role;

create or replace function public.claim_premium_purchase(p_purchase uuid,p_member uuid) returns void
language plpgsql security definer set search_path=public,pg_temp as $$
declare purchase public.billing_purchase_claims; member_email text;
begin
 select * into purchase from billing_purchase_claims where id=p_purchase for update;
 if purchase.id is null then raise exception 'Purchase unavailable'; end if;
 select lower(trim(email)) into member_email from auth.users where id=p_member and email_confirmed_at is not null and is_anonymous is not true;
 if member_email is null or member_email<>lower(trim(purchase.email)) then raise exception 'Verified email required'; end if;
 if purchase.claimed_user_id is not null and purchase.claimed_user_id<>p_member then raise exception 'Purchase already claimed'; end if;
 -- A server cannot use this function to move a normal member account.
 if not exists(select 1 from auth.users where id=purchase.original_user_id and is_anonymous is true) then raise exception 'Guest purchase required'; end if;
 if not exists(select 1 from billing_subscriptions where user_id=purchase.original_user_id and mode=purchase.mode and (paid_through is not null or (status='trialing' and trial_end>now()))) then raise exception 'Verified subscription required'; end if;
 update billing_purchase_claims set claimed_user_id=p_member where id=p_purchase;
 -- The ownership trigger also preserves this owner on all future webhook retries.
 update billing_subscriptions set access_owner_id=p_member where user_id=purchase.original_user_id and mode=purchase.mode;
end; $$;
revoke all on function public.claim_premium_purchase(uuid,uuid) from public,anon,authenticated;
grant execute on function public.claim_premium_purchase(uuid,uuid) to service_role;

commit;
