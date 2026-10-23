-- Account-owned getting-started progress. Independent of analytics consent.
create table if not exists public.premium_start_here_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 step text not null check (step in ('sector-gauge','opportunity','outlook')),
 completed_at timestamptz not null default now(),
 primary key (user_id,step)
);
alter table public.premium_start_here_progress enable row level security;
revoke all on public.premium_start_here_progress from anon,authenticated;
grant select,insert on public.premium_start_here_progress to authenticated;
grant all on public.premium_start_here_progress to service_role;
create policy "Read own getting started progress" on public.premium_start_here_progress for select to authenticated using ((select auth.uid())=user_id);
create policy "Record own getting started progress" on public.premium_start_here_progress for insert to authenticated with check ((select auth.uid())=user_id);
