-- Local development only. Deliberately outside production migrations.
create table if not exists public.developer_email_test_log (
 id uuid primary key default gen_random_uuid(),
 event_key text not null unique,
 subject text not null,
 status text not null default 'reserved' check(status in ('reserved','accepted','failed_or_uncertain')),
 created_at timestamptz not null default now(),
 completed_at timestamptz,
 provider_ids jsonb not null default '[]'::jsonb
);
alter table public.developer_email_test_log enable row level security;
revoke all on public.developer_email_test_log from anon,authenticated;
grant all on public.developer_email_test_log to service_role;
create or replace function public.reserve_developer_email_test(p_event text,p_subject text)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare result uuid;
begin
 perform pg_advisory_xact_lock(928145,1);
 if exists(select 1 from developer_email_test_log where event_key=p_event) then raise exception 'TEST_ALREADY_RESERVED'; end if;
 if (select count(*) from developer_email_test_log where created_at>now()-interval '24 hours')>=10 then raise exception 'TEST_DAILY_LIMIT'; end if;
 if (select count(*) from developer_email_test_log where created_at>now()-interval '30 days')>=100 then raise exception 'TEST_MONTHLY_LIMIT'; end if;
 if exists(select 1 from developer_email_test_log where created_at>now()-interval '2 seconds') then raise exception 'TEST_RATE_LIMIT'; end if;
 insert into developer_email_test_log(event_key,subject) values(p_event,p_subject) returning id into result;
 return result;
end; $$;
revoke all on function public.reserve_developer_email_test(text,text) from public,anon,authenticated;
grant execute on function public.reserve_developer_email_test(text,text) to service_role;
