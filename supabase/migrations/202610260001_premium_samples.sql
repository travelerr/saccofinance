-- Prospects are separate from auth users and paid-member notification preferences.
create table public.premium_sample_leads (
 id uuid primary key default gen_random_uuid(),
 email text not null unique check (email=lower(trim(email))),
 email_hash text not null,
 token_hash text not null unique,
 unsubscribe_hash text not null unique,
 snapshot jsonb not null,
 marketing_requested boolean not null default false,
 consent_version text not null default 'premium-sample-v1',
 confirmed_at timestamptz,
 unsubscribed_at timestamptz,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '30 days',
 email_status text not null default 'reserved' check(email_status in ('reserved','sent','uncertain')),
 provider_id text
);
create table public.premium_sample_limits (
 bucket text primary key,
 requests integer not null default 1,
 created_at timestamptz not null default now()
);
alter table public.premium_sample_leads enable row level security;
alter table public.premium_sample_limits enable row level security;
revoke all on public.premium_sample_leads,public.premium_sample_limits from public,anon,authenticated;
grant select,insert,update,delete on public.premium_sample_leads,public.premium_sample_limits to service_role;

create function public.reserve_premium_sample(p_email text,p_email_hash text,p_token_hash text,p_unsubscribe_hash text,p_snapshot jsonb,p_marketing boolean,p_ip_hash text)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare n integer; lead_id uuid;
begin
 if length(p_email)>254 or p_email<>lower(trim(p_email)) or p_email !~ '^[^[:space:]<>@,;]+@[^[:space:]<>@,;]+\.[^[:space:]<>@,;]+$' or p_ip_hash !~ '^[a-f0-9]{64}$' or p_token_hash !~ '^[a-f0-9]{64}$' or p_unsubscribe_hash !~ '^[a-f0-9]{64}$' then raise exception 'INVALID_SAMPLE_REQUEST'; end if;
 -- Serial, durable budgets also cover duplicate and suppressed requests.
 delete from premium_sample_limits where created_at<now()-interval '2 days';
 insert into premium_sample_limits(bucket) values('global:'||to_char(now() at time zone 'UTC','YYYY-MM-DD-HH')) on conflict(bucket) do update set requests=premium_sample_limits.requests+1 returning requests into n;
 if n>100 then return null; end if;
 insert into premium_sample_limits(bucket) values(p_ip_hash||':'||to_char(now() at time zone 'UTC','YYYY-MM-DD-HH')) on conflict(bucket) do update set requests=premium_sample_limits.requests+1 returning requests into n;
 if n>5 then return null; end if;
 if exists(select 1 from research_email_suppressions where email_hash=p_email_hash) then return null; end if;
 -- Never replace an earlier issue, re-enable an opt-out, or send weekly samples.
 insert into premium_sample_leads(email,email_hash,token_hash,unsubscribe_hash,snapshot,marketing_requested)
 values(p_email,p_email_hash,p_token_hash,p_unsubscribe_hash,p_snapshot,p_marketing)
 on conflict(email) do nothing returning id into lead_id;
 return lead_id;
end $$;
create function public.confirm_premium_sample(p_hash text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
 update premium_sample_leads set confirmed_at=coalesce(confirmed_at,now()) where token_hash=p_hash and expires_at>now();
 return found;
end $$;
create function public.unsubscribe_premium_sample(p_hash text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
 update premium_sample_leads set unsubscribed_at=coalesce(unsubscribed_at,now()) where unsubscribe_hash=p_hash;
 return found;
end $$;
revoke all on function public.reserve_premium_sample(text,text,text,text,jsonb,boolean,text),public.confirm_premium_sample(text),public.unsubscribe_premium_sample(text) from public,anon,authenticated;
grant execute on function public.reserve_premium_sample(text,text,text,text,jsonb,boolean,text),public.confirm_premium_sample(text),public.unsubscribe_premium_sample(text) to service_role;
