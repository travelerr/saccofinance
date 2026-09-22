create table public.research_email_suppressions (
 email_hash text primary key check(email_hash ~ '^[a-f0-9]{64}$'),
 reason text not null check(reason in ('email.bounced','email.complained','email.suppressed')),
 created_at timestamptz not null default now()
);
create table public.research_email_webhook_receipts (
 event_id text primary key,
 event_type text not null,
 created_at timestamptz not null default now()
);
alter table public.research_email_suppressions enable row level security;
alter table public.research_email_webhook_receipts enable row level security;
revoke all on public.research_email_suppressions,public.research_email_webhook_receipts from anon,authenticated;
grant all on public.research_email_suppressions,public.research_email_webhook_receipts to service_role;
create function public.record_research_suppression(p_event text,p_type text,p_hashes text[]) returns boolean
language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if p_type not in ('email.bounced','email.complained','email.suppressed') or p_type is null or coalesce(cardinality(p_hashes),0) not between 1 and 100 then raise exception 'INVALID_EVENT'; end if;
 insert into research_email_webhook_receipts(event_id,event_type) values(p_event,p_type) on conflict do nothing;
 if not found then return false; end if;
 insert into research_email_suppressions(email_hash,reason) select distinct unnest(p_hashes),p_type
 on conflict(email_hash) do nothing;
 return true;
end $$;
revoke all on function public.record_research_suppression(text,text,text[]) from public,anon,authenticated;
grant execute on function public.record_research_suppression(text,text,text[]) to service_role;
