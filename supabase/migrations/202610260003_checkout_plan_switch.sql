-- Serialize checkout creation and plan switching across application instances.
begin;
create table public.billing_checkout_locks (
 user_id uuid not null, mode text not null check(mode in ('test','live')),
 token uuid not null, expires_at timestamptz not null, primary key(user_id,mode)
);
alter table public.billing_checkout_locks enable row level security;
revoke all on public.billing_checkout_locks from public,anon,authenticated;
grant select,insert,update,delete on public.billing_checkout_locks to service_role;
create function public.acquire_billing_checkout_lock(p_user uuid,p_mode text,p_token uuid)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
 insert into billing_checkout_locks values(p_user,p_mode,p_token,now()+interval '5 minutes')
 on conflict(user_id,mode) do update set token=excluded.token,expires_at=excluded.expires_at
 where billing_checkout_locks.expires_at<=now();
 return found;
end $$;
revoke all on function public.acquire_billing_checkout_lock(uuid,text,uuid) from public,anon,authenticated;
grant execute on function public.acquire_billing_checkout_lock(uuid,text,uuid) to service_role;
commit;
