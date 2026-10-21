-- Additive audit and delivery ledger. Service-role only; never changes membership access.
begin;
create table public.billing_retention_events (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 mode text not null check(mode in ('test','live')),
 subscription_id text not null,
 action text not null check(action in ('cancel','keep')),
 reason text check(reason in ('too_expensive','unused','research_fit','other')),
 feedback text check(length(feedback)<=1000),
 subscription_started_at timestamptz not null,
 requested_at timestamptz not null default now(),
 effective_end timestamptz,
 status text not null check(status in ('requested','confirmed')),
 check(action<>'cancel' or reason is not null)
);
create index on public.billing_retention_events(subscription_id,requested_at desc);
create table public.billing_access_reminders (
 id uuid primary key default gen_random_uuid(),
 subscription_id text not null,
 user_id uuid not null references auth.users(id) on delete cascade,
 mode text not null check(mode in ('test','live')),
 send_mode text not null check(send_mode in ('dry-run','live')),
 ends_at timestamptz not null,
 status text not null default 'claimed' check(status in ('claimed','skipped','dry_run','dispatching','sent','uncertain')),
 created_at timestamptz not null default now(),
 claimed_at timestamptz not null default now(),
 lease_token uuid not null default gen_random_uuid(),
 provider_id text,
 unique(subscription_id,mode,send_mode,ends_at)
);
alter table public.billing_retention_events enable row level security;
alter table public.billing_access_reminders enable row level security;
revoke all on public.billing_retention_events,public.billing_access_reminders from public,anon,authenticated;
grant select,insert,update on public.billing_retention_events,public.billing_access_reminders to service_role;
-- Atomic insert prevents concurrent workers claiming the same subscription/end date.
create function public.claim_billing_access_reminder(p_mode text,p_send_mode text)
returns setof public.billing_access_reminders language plpgsql security definer set search_path=public,pg_temp as $$
declare retry_id uuid;
begin
 if p_mode not in ('test','live') or p_send_mode not in ('dry-run','live') then raise exception 'Invalid mode';end if;
 select id into retry_id from billing_access_reminders
 where mode=p_mode and send_mode=p_send_mode and status='claimed'
 and claimed_at<now()-interval '5 minutes' and ends_at>now()
 order by claimed_at for update skip locked limit 1;
 if retry_id is not null then
  return query update billing_access_reminders set claimed_at=now(),lease_token=gen_random_uuid() where id=retry_id returning *;
  return;
 end if;
 return query
 insert into billing_access_reminders(subscription_id,user_id,mode,send_mode,ends_at)
 select s.stripe_subscription_id,s.access_owner_id,s.mode,p_send_mode,e.ends_at
 from billing_subscriptions s
 cross join lateral (select least(coalesce(s.cancel_at,s.current_period_end),case when s.status='trialing' then s.trial_end else s.paid_through end) as ends_at) e
 where s.mode=p_mode and s.access_owner_id is not null and s.status in ('active','trialing')
 and (s.cancel_at_period_end or s.cancel_at is not null)
 and (case when s.status='trialing' then s.trial_end else s.paid_through end)>now()
 and e.ends_at>now() and e.ends_at<=now()+interval '3 days'
 and not exists(select 1 from billing_access_reminders r where r.subscription_id=s.stripe_subscription_id and r.mode=p_mode and r.send_mode=p_send_mode and r.ends_at=e.ends_at)
 order by e.ends_at,s.stripe_subscription_id limit 1
 on conflict do nothing returning *;
end;$$;
revoke all on function public.claim_billing_access_reminder(text,text) from public,anon,authenticated;
grant execute on function public.claim_billing_access_reminder(text,text) to service_role;
commit;
