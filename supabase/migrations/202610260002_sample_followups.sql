alter table public.premium_sample_leads
 add column analytics_allowed boolean not null default false,
 add column mode text not null default 'live' check(mode in ('test','live')),
 add column checkout_started_at timestamptz,
 add column subscriber_at timestamptz,
 add column paid_at timestamptz,
 add column preexisting_member boolean not null default false,
 add column conversion_subscription_id text,
 add column conversion_invoice_id text,
 add column conversion_amount integer,
 add column conversion_checked_at timestamptz;
create table public.premium_sample_followups (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.premium_sample_leads(id) on delete cascade,
 step integer not null check(step in (2,4)),
 status text not null default 'claimed' check(status in ('claimed','dispatching','sent','dry_run','skipped','uncertain')),
 claimed_at timestamptz not null default now(),
 sent_at timestamptz,
 provider_id text,
 unique(lead_id,step)
);
create table public.premium_sample_unsubscribe_tokens (
 token_hash text primary key,
 lead_id uuid not null references public.premium_sample_leads(id) on delete cascade
);
alter table public.premium_sample_followups enable row level security;
alter table public.premium_sample_unsubscribe_tokens enable row level security;
revoke all on public.premium_sample_followups,public.premium_sample_unsubscribe_tokens from public,anon,authenticated;
grant select,insert,update,delete on public.premium_sample_followups,public.premium_sample_unsubscribe_tokens to service_role;
create index premium_sample_sync on public.premium_sample_leads(mode,conversion_checked_at);
create or replace function public.unsubscribe_premium_sample(p_hash text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
 update premium_sample_leads set unsubscribed_at=coalesce(unsubscribed_at,now())
 where unsubscribe_hash=p_hash or id in(select lead_id from premium_sample_unsubscribe_tokens where token_hash=p_hash);
 return found;
end $$;
-- Unique reservation is permanent: crashes and uncertain sends never auto-resend.
create function public.claim_premium_sample_followup(p_mode text,p_email text default null)
returns setof public.premium_sample_followups language plpgsql security definer set search_path=public,pg_temp as $$
declare chosen uuid; chosen_step integer;
begin
 select l.id,case when l.confirmed_at>now()-interval '4 days' then 2 else 4 end into chosen,chosen_step
 from premium_sample_leads l
 where l.mode=p_mode and (p_email is null or l.email=p_email) and l.email_status='sent' and l.confirmed_at<=now()-interval '2 days'
 and l.confirmed_at>now()-interval '8 days' and l.marketing_requested and l.unsubscribed_at is null
 and l.subscriber_at is null and not l.preexisting_member
 and not exists(select 1 from research_email_suppressions s where s.email_hash=l.email_hash)
 and not exists(select 1 from premium_sample_followups f where f.lead_id=l.id and f.step=case when l.confirmed_at>now()-interval '4 days' then 2 else 4 end)
 and not exists(select 1 from premium_sample_followups f where f.lead_id=l.id and f.claimed_at>now()-interval '24 hours')
 order by l.confirmed_at for update skip locked limit 1;
 if chosen is null then return; end if;
 return query insert into premium_sample_followups(lead_id,step) values(chosen,chosen_step) on conflict(lead_id,step) do nothing returning *;
end $$;
revoke all on function public.claim_premium_sample_followup(text,text) from public,anon,authenticated;
grant execute on function public.claim_premium_sample_followup(text,text) to service_role;

create function public.sample_has_manual_access(p_email text)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select exists(select 1 from auth.users u join premium_memberships m on m.user_id=u.id
 where lower(trim(u.email))=p_email and m.enabled and (m.access_expires_at is null or m.access_expires_at>now()));
$$;
revoke all on function public.sample_has_manual_access(text) from public,anon,authenticated;
grant execute on function public.sample_has_manual_access(text) to service_role;
create function public.sample_customer_ids(p_email text,p_mode text)
returns table(customer_id text) language sql stable security definer set search_path=public,pg_temp as $$
 select distinct c.stripe_customer_id from billing_customers c left join auth.users u on u.id=c.user_id
 left join billing_purchase_claims p on p.stripe_customer_id=c.stripe_customer_id and p.mode=c.mode
 where c.mode=p_mode and c.stripe_customer_id is not null and (lower(trim(u.email))=p_email or lower(trim(p.email))=p_email);
$$;
revoke all on function public.sample_customer_ids(text,text) from public,anon,authenticated;
grant execute on function public.sample_customer_ids(text,text) to service_role;
