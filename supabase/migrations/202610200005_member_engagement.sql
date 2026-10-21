begin;
create table public.member_engagement_config(id boolean primary key default true check(id),started_at timestamptz not null default now());
insert into public.member_engagement_config(id) values(true);
create table public.member_engagement_days(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 mode text not null check(mode in ('test','live')),
 day_index integer not null check(day_index between 0 and 6),
 activity text not null check(activity in ('visit','dashboard','opportunity','sector_view','sector_use')),
 recorded_at timestamptz not null default now(),
 unique(user_id,mode,day_index,activity)
);
alter table public.member_engagement_config enable row level security;
alter table public.member_engagement_days enable row level security;
revoke all on public.member_engagement_config,public.member_engagement_days from public,anon,authenticated;
grant select on public.member_engagement_config to service_role;
grant select,insert on public.member_engagement_days to service_role;
-- Server supplies authenticated identity; the browser cannot choose a member or timestamp.
create function public.record_member_engagement(p_user uuid,p_mode text,p_activity text) returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if p_activity not in ('visit','dashboard','opportunity','sector_view','sector_use') or p_mode not in ('test','live') then raise exception 'Invalid activity';end if;
 insert into member_engagement_days(user_id,mode,day_index,activity)
 select m.user_id,m.mode,floor(extract(epoch from(now()-m.started_at))/86400)::integer,p_activity
 from member_onboarding m join auth.users u on u.id=m.user_id
 where m.user_id=p_user and m.mode=p_mode and m.eligible and not coalesce(u.is_anonymous,false)
 and m.started_at>=(select started_at from member_engagement_config where id)
 and now()>=m.started_at and now()<m.started_at+interval '7 days'
 on conflict do nothing;
end;$$;
revoke all on function public.record_member_engagement(uuid,text,text) from public,anon,authenticated;
grant execute on function public.record_member_engagement(uuid,text,text) to service_role;
commit;
