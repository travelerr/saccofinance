-- LOCAL ONLY: apply to a disposable local Supabase/Postgres database for review.
create table public.research_email_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 enabled boolean not null default false,
 updated_at timestamptz not null default now()
);
alter table public.research_email_preferences enable row level security;
revoke all on public.research_email_preferences from anon,authenticated;
grant select,insert,update on public.research_email_preferences to authenticated;
grant all on public.research_email_preferences to service_role;
create policy "Read own research preference" on public.research_email_preferences for select to authenticated using (auth.uid()=user_id);
create policy "Create own research preference" on public.research_email_preferences for insert to authenticated with check (auth.uid()=user_id);
create policy "Change own research preference" on public.research_email_preferences for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create table public.research_notification_log (
 id uuid primary key default gen_random_uuid(),
 event_key text not null,
 notification_type text not null check(notification_type in ('WEEKLY_OUTLOOK_PUBLISHED','OPPORTUNITY_PUBLISHED','OPPORTUNITY_MATERIAL_UPDATE')),
 entity_id text not null,
 update_id text,
 subject text not null,
 recipient_count integer not null check(recipient_count between 1 and 100),
 mode text not null check(mode in ('dry-run','live')),
 status text not null check(status in ('reserved','dry_run','sent','failed')),
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 completed_at timestamptz,
 provider_ids jsonb not null default '[]'::jsonb,
 error_code text,
 unique(event_key,mode),
 check ((notification_type='OPPORTUNITY_MATERIAL_UPDATE')=(update_id is not null))
);
alter table public.research_notification_log enable row level security;
revoke all on public.research_notification_log from anon,authenticated;
grant all on public.research_notification_log to service_role;
-- No client policies or admin self-enrollment. Admin IDs are server configuration only.
