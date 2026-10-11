-- Durable email work. No historical reservations are unlocked by this migration.
create table public.research_email_jobs (
 id uuid primary key default gen_random_uuid(),
 event_key text not null, mode text not null check(mode in ('dry-run','live')),
 event_snapshot jsonb not null, recipients jsonb not null,
 origin text not null, sender text not null,
 status text not null default 'queued' check(status in ('queued','preparing','sending','sent','dry_run','failed','uncertain','cancelled')),
 attempts integer not null default 0, prepared_count integer not null default 0,
 lease_token uuid, lease_until timestamptz, available_at timestamptz not null default now(),
 dispatch_started_at timestamptz, error_code text, updated_at timestamptz not null default now(),
 unique(event_key,mode),
 foreign key(event_key,mode) references public.research_notification_log(event_key,mode),
 check(jsonb_typeof(recipients)='array' and jsonb_array_length(recipients) between 1 and 100)
);
alter table public.research_email_jobs enable row level security;
revoke all on public.research_email_jobs from public,anon,authenticated;
grant all on public.research_email_jobs to service_role;
create index research_email_jobs_pending on public.research_email_jobs(mode,status,available_at);

create function public.enqueue_research_email(p_event jsonb,p_recipients jsonb,p_mode text,p_actor uuid,p_origin text,p_sender text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if not reserve_research_notification(p_event->>'key',p_event->>'type',p_event->>'entityId',p_event->>'updateId',p_event->>'subject',jsonb_array_length(p_recipients),p_mode,p_actor) then return false; end if;
 insert into research_email_jobs(event_key,mode,event_snapshot,recipients,origin,sender)
 values(p_event->>'key',p_mode,p_event,p_recipients,p_origin,p_sender);
 return true;
end $$;

-- Claiming and transitions are fenced by a unique lease. A late worker can never dispatch.
create function public.claim_research_email(p_mode text)
returns setof public.research_email_jobs language plpgsql security definer set search_path=public,pg_temp as $$
declare target uuid;
begin
 update research_email_jobs set status='uncertain',error_code='DISPATCH_INTERRUPTED',updated_at=now()
 where mode=p_mode and status='sending' and lease_until<now();
 update research_email_jobs set status=case when attempts<3 then 'queued' else 'failed' end,
 error_code='PREPARATION_INTERRUPTED',updated_at=now(),lease_token=null,lease_until=null
 where mode=p_mode and status='preparing' and lease_until<now();
 update research_notification_log l set status='failed',error_code=j.error_code,completed_at=now()
 from research_email_jobs j where l.event_key=j.event_key and l.mode=j.mode and j.mode=p_mode
 and j.status in ('failed','uncertain') and l.status='reserved';
 select id into target from research_email_jobs where mode=p_mode and status='queued' and available_at<=now()
 order by available_at for update skip locked limit 1;
 if target is null then return; end if;
 return query update research_email_jobs set status='preparing',attempts=attempts+1,
 lease_token=gen_random_uuid(),lease_until=now()+interval '5 minutes',updated_at=now()
 where id=target returning *;
end $$;

create function public.transition_research_email(p_id uuid,p_lease uuid,p_action text,p_ids jsonb default '[]',p_error text default null)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare job research_email_jobs; next_status text;
begin
 select * into job from research_email_jobs where id=p_id for update;
 if not found or job.lease_token is distinct from p_lease or job.lease_until<=now() then return false; end if;
 if p_action='dispatch' and job.status='preparing' then
  update research_email_jobs set status='sending',prepared_count=jsonb_array_length(recipients),dispatch_started_at=now(),updated_at=now() where id=p_id;
  return true;
 elsif p_action='retry' and job.status='preparing' then
  next_status:=case when job.attempts<3 then 'queued' else 'failed' end;
 elsif p_action='cancelled' and job.status='preparing' then next_status:='cancelled';
 elsif p_action='dry_run' and job.status='preparing' and job.mode='dry-run' then next_status:='dry_run';
 elsif p_action='sent' and job.status='sending' and job.mode='live' then
  if jsonb_typeof(p_ids)<>'array' or jsonb_array_length(p_ids)<>jsonb_array_length(job.recipients) then raise exception 'PROVIDER_IDS_REQUIRED'; end if;
  next_status:='sent';
 elsif p_action='uncertain' and job.status='sending' then next_status:='uncertain';
 else return false;
 end if;
 update research_email_jobs set status=next_status,error_code=p_error,updated_at=now(),
 prepared_count=case when next_status in ('sent','dry_run') then jsonb_array_length(recipients) else prepared_count end,
 available_at=now()+interval '30 seconds',lease_token=null,lease_until=null where id=p_id;
 if next_status in ('sent','dry_run','failed','cancelled','uncertain') then
  update research_notification_log set status=case when next_status in ('sent','dry_run') then next_status else 'failed' end,
  provider_ids=p_ids,error_code=p_error,completed_at=now() where event_key=job.event_key and mode=job.mode;
 end if;
 return true;
end $$;
revoke all on function public.enqueue_research_email(jsonb,jsonb,text,uuid,text,text) from public,anon,authenticated;
revoke all on function public.claim_research_email(text) from public,anon,authenticated;
revoke all on function public.transition_research_email(uuid,uuid,text,jsonb,text) from public,anon,authenticated;
grant execute on function public.enqueue_research_email(jsonb,jsonb,text,uuid,text,text) to service_role;
grant execute on function public.claim_research_email(text) to service_role;
grant execute on function public.transition_research_email(uuid,uuid,text,jsonb,text) to service_role;

create function public.retry_research_email_preparation(p_event text,p_mode text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
 update research_email_jobs set status='queued',attempts=0,available_at=now(),updated_at=now(),error_code=null
 where event_key=p_event and mode=p_mode and status='failed' and dispatch_started_at is null;
 if not found then return false; end if;
 update research_notification_log set status='reserved',completed_at=null,error_code=null where event_key=p_event and mode=p_mode;
 return true;
end $$;
revoke all on function public.retry_research_email_preparation(text,text) from public,anon,authenticated;
grant execute on function public.retry_research_email_preparation(text,text) to service_role;
