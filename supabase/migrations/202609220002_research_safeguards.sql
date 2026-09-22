-- Local review first. Research budgets do not meter external SMTP or other Resend clients.
create table public.research_email_limits (
 singleton boolean primary key default true check(singleton),
 daily_limit integer not null default 80 check(daily_limit between 1 and 10000),
 monthly_limit integer not null default 2000 check(monthly_limit between 1 and 100000),
 paused boolean not null default false
);
insert into public.research_email_limits(singleton) values(true);
alter table public.research_email_limits enable row level security;
revoke all on public.research_email_limits from anon,authenticated;
grant all on public.research_email_limits to service_role;
create function public.reserve_research_notification(p_event text,p_type text,p_entity text,p_update text,p_subject text,p_count integer,p_mode text,p_actor uuid)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare limits public.research_email_limits; used bigint;
begin
 perform pg_advisory_xact_lock(928146,1);
 if p_mode not in ('dry-run','live') or p_mode is null then raise exception 'INVALID_MODE'; end if;
 if p_count is null or p_count<1 or p_count>100 then raise exception 'RECIPIENT_LIMIT'; end if;
 if exists(select 1 from research_notification_log where event_key=p_event and mode=p_mode) then return false; end if;
 select * into strict limits from research_email_limits where singleton;
 if limits.paused then raise exception 'EMAIL_PAUSED'; end if;
 select coalesce(sum(recipient_count),0) into used from research_notification_log where mode=p_mode and created_at>now()-interval '24 hours';
 if used+p_count>limits.daily_limit then raise exception 'DAILY_LIMIT'; end if;
 select coalesce(sum(recipient_count),0) into used from research_notification_log where mode=p_mode and created_at>now()-interval '30 days';
 if used+p_count>limits.monthly_limit then raise exception 'MONTHLY_LIMIT'; end if;
 if exists(select 1 from research_notification_log where mode=p_mode and created_at>now()-interval '2 seconds') then raise exception 'RATE_LIMIT'; end if;
 insert into research_notification_log(event_key,notification_type,entity_id,update_id,subject,recipient_count,mode,status,created_by)
 values(p_event,p_type,p_entity,p_update,p_subject,p_count,p_mode,'reserved',p_actor);
 return true;
end $$;
revoke all on function public.reserve_research_notification(text,text,text,text,text,integer,text,uuid) from public,anon,authenticated;
grant execute on function public.reserve_research_notification(text,text,text,text,text,integer,text,uuid) to service_role;
create table public.research_unsubscribe_tokens (
 token_hash text primary key check(token_hash ~ '^[a-f0-9]{64}$'),
 user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.research_unsubscribe_tokens enable row level security;
revoke all on public.research_unsubscribe_tokens from anon,authenticated;
grant all on public.research_unsubscribe_tokens to service_role;
create function public.unsubscribe_research(p_hash text) returns boolean
language plpgsql security definer set search_path=public,pg_temp as $$
declare target uuid;
begin
 select user_id into target from research_unsubscribe_tokens where token_hash=p_hash;
 if target is null then return false; end if;
 insert into research_email_preferences(user_id,enabled) values(target,false)
 on conflict(user_id) do update set enabled=false,updated_at=now();
 return true;
end $$;
revoke all on function public.unsubscribe_research(text) from public,anon,authenticated;
grant execute on function public.unsubscribe_research(text) to service_role;
