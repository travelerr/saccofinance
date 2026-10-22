-- Account-owned manual learning progress. No video telemetry or automatic completion.
create table if not exists public.premium_lesson_completions (
 user_id uuid not null references auth.users(id) on delete cascade,
 lesson_id text not null check (lesson_id ~ '^lesson-[1-9][0-9]*$'),
 completed_at timestamptz not null default now(),
 primary key (user_id, lesson_id)
);
alter table public.premium_lesson_completions enable row level security;
revoke all on public.premium_lesson_completions from anon, authenticated;
grant select, insert on public.premium_lesson_completions to authenticated;
grant all on public.premium_lesson_completions to service_role;
create policy "Read own lesson completion" on public.premium_lesson_completions for select to authenticated using ((select auth.uid()) = user_id);
create policy "Record own lesson completion" on public.premium_lesson_completions for insert to authenticated with check ((select auth.uid()) = user_id);
