-- Apply in the Supabase SQL Editor. Access is denied unless explicitly enabled.
create table if not exists public.premium_memberships (
 user_id uuid primary key references auth.users(id) on delete cascade,
 enabled boolean not null default false,
 access_expires_at timestamptz,
 access_source text not null default 'manual' check (access_source in ('manual','stripe')),
 created_at timestamptz not null default now()
);
alter table public.premium_memberships enable row level security;
revoke all on public.premium_memberships from anon, authenticated;
grant select on public.premium_memberships to authenticated;
create policy "Members can read their own access" on public.premium_memberships
 for select to authenticated using ((select auth.uid()) = user_id);
-- No client insert/update/delete policies: only the project administrator can grant access.
