-- Apply with the email worker paused; upload the batch-aware worker before resuming.
begin;
alter table public.research_notification_log drop constraint research_notification_log_recipient_count_check;
alter table public.research_notification_log add check(recipient_count between 1 and 50000);
alter table public.research_email_jobs drop constraint research_email_jobs_event_key_mode_key;
alter table public.research_email_jobs add column batch_index integer not null default 0 check(batch_index>=0);
alter table public.research_email_jobs add column provider_ids jsonb not null default '[]';
alter table public.research_email_jobs add unique(event_key,mode,batch_index);
-- Preserve provider receipts for existing one-batch jobs.
update public.research_email_jobs j set provider_ids=l.provider_ids from public.research_notification_log l where j.event_key=l.event_key and j.mode=l.mode and j.status='sent';
create or replace function public.reserve_research_notification(p_event text,p_type text,p_entity text,p_update text,p_subject text,p_count integer,p_mode text,p_actor uuid)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare limits public.research_email_limits; used bigint;
begin
 perform pg_advisory_xact_lock(928146,1);
 if p_mode not in ('dry-run','live') or p_mode is null then raise exception 'INVALID_MODE'; end if;
 if p_count is null or p_count<1 or p_count>50000 then raise exception 'RECIPIENT_LIMIT'; end if;
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

create function public.refresh_research_broadcast(p_event text,p_mode text)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare state text; ids jsonb; problem text;
begin
 -- Parent row lock serializes concurrent completions before reading child results.
 perform 1 from research_notification_log where event_key=p_event and mode=p_mode for update;
 select case when bool_and(status='sent') then 'sent'
 when bool_and(status='dry_run') then 'dry_run'
 when bool_or(status in ('queued','preparing','sending')) then 'reserved' else 'failed' end
 into state from research_email_jobs where event_key=p_event and mode=p_mode;
 select coalesce(jsonb_agg(receipt.value order by j.batch_index,receipt.ordinality),'[]'::jsonb) into ids
 from research_email_jobs j cross join lateral jsonb_array_elements(j.provider_ids) with ordinality receipt(value,ordinality)
 where j.event_key=p_event and j.mode=p_mode;
 select error_code into problem from research_email_jobs where event_key=p_event and mode=p_mode and status in ('failed','uncertain','cancelled') order by batch_index limit 1;
 update research_notification_log set status=state,provider_ids=ids,error_code=problem,
 completed_at=case when state='reserved' then null else now() end where event_key=p_event and mode=p_mode;
end $$;
revoke all on function public.refresh_research_broadcast(text,text) from public,anon,authenticated;
grant execute on function public.refresh_research_broadcast(text,text) to service_role;

create or replace function public.enqueue_research_email(p_event jsonb,p_recipients jsonb,p_mode text,p_actor uuid,p_origin text,p_sender text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare n integer;
begin
 if jsonb_typeof(p_recipients) is distinct from 'array' then raise exception 'INVALID_RECIPIENTS'; end if;
 n:=jsonb_array_length(p_recipients);
 if exists(select 1 from jsonb_array_elements(p_recipients) r where coalesce(r->>'userId','')='' or coalesce(r->>'email','')='')
 or (select count(distinct r->>'userId') from jsonb_array_elements(p_recipients) r)<>n
 or (select count(distinct lower(trim(r->>'email'))) from jsonb_array_elements(p_recipients) r)<>n then raise exception 'INVALID_RECIPIENTS'; end if;
 if not reserve_research_notification(p_event->>'key',p_event->>'type',p_event->>'entityId',p_event->>'updateId',p_event->>'subject',n,p_mode,p_actor) then return false; end if;
 insert into research_email_jobs(event_key,mode,event_snapshot,recipients,origin,sender,batch_index)
 select p_event->>'key',p_mode,p_event,jsonb_agg(r.value order by r.ordinality),p_origin,p_sender,((r.ordinality-1)/100)::integer
 from jsonb_array_elements(p_recipients) with ordinality r(value,ordinality) group by ((r.ordinality-1)/100)::integer;
 return true;
end $$;
create or replace function public.claim_research_email(p_mode text)
returns setof public.research_email_jobs language plpgsql security definer set search_path=public,pg_temp as $$
declare target uuid;
begin
 update research_email_jobs set status='uncertain',error_code='DISPATCH_INTERRUPTED',updated_at=now()
 where mode=p_mode and status='sending' and lease_until<now();
 update research_email_jobs set status=case when attempts<3 then 'queued' else 'failed' end,
 error_code='PREPARATION_INTERRUPTED',updated_at=now(),lease_token=null,lease_until=null
 where mode=p_mode and status='preparing' and lease_until<now();
 perform refresh_research_broadcast(j.event_key,j.mode) from (select distinct event_key,mode from research_email_jobs where mode=p_mode and status in ('failed','uncertain')) j;
 select id into target from research_email_jobs where mode=p_mode and status='queued' and available_at<=now()
 order by available_at,batch_index for update skip locked limit 1;
 if target is null then return; end if;
 return query update research_email_jobs set status='preparing',attempts=attempts+1,
 lease_token=gen_random_uuid(),lease_until=now()+interval '5 minutes',updated_at=now()
 where id=target returning *;
end $$;

create or replace function public.transition_research_email(p_id uuid,p_lease uuid,p_action text,p_ids jsonb default '[]',p_error text default null)
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
 update research_email_jobs set status=next_status,error_code=p_error,updated_at=now(),provider_ids=case when next_status='sent' then p_ids else provider_ids end,
 prepared_count=case when next_status in ('sent','dry_run') then jsonb_array_length(recipients) else prepared_count end,
 available_at=now()+interval '30 seconds',lease_token=null,lease_until=null where id=p_id;
 perform refresh_research_broadcast(job.event_key,job.mode);
 return true;
end $$;

create or replace function public.retry_research_email_preparation(p_event text,p_mode text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
 update research_email_jobs set status='queued',attempts=0,available_at=now(),updated_at=now(),error_code=null
 where event_key=p_event and mode=p_mode and status='failed' and dispatch_started_at is null;
 if not found then return false; end if;
 perform refresh_research_broadcast(p_event,p_mode);
 return true;
end $$;
commit;
