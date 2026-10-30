-- Preserve current ON/OFF settings and existing 30-day reservations. No subscriptions are changed.
begin;
alter table public.premium_trial_settings add column if not exists trial_days integer not null default 30 check (trial_days in (7,30));
alter table public.billing_customers drop constraint if exists billing_customers_checkout_trial_days_check;
alter table public.billing_customers add constraint billing_customers_checkout_trial_days_check check (checkout_trial_days in (0,7,30));
create or replace function public.reserve_premium_offer(p_user uuid,p_mode text,p_plan text,p_email text,p_prior_customer boolean)
returns public.billing_customers language plpgsql security definer set search_path=public,pg_temp as $$
declare old_exp timestamptz; result public.billing_customers; normalized text:=lower(trim(p_email)); offer boolean; offer_days integer; prior_claim public.premium_trial_claims;
begin
 insert into billing_customers(user_id,mode) values(p_user,p_mode) on conflict do nothing;
 select checkout_expires_at into old_exp from billing_customers where user_id=p_user and mode=p_mode for update;
 select * into result from reserve_premium_checkout(p_user,p_mode,p_plan);
 if old_exp>now() then return result; end if;
 select enabled,trial_days into offer,offer_days from premium_trial_settings where mode=p_mode for share;
 if not found then raise exception 'OFFER_UNAVAILABLE'; end if;
 update billing_customers set checkout_trial_days=0,checkout_email=normalized where user_id=p_user and mode=p_mode returning * into result;
 if offer and p_plan='monthly' and not p_prior_customer then
  if normalized is null or normalized !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then raise exception 'TRIAL_EMAIL_REQUIRED'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_mode||':'||normalized,0));
  select * into prior_claim from premium_trial_claims where mode=p_mode and email=normalized;
  if prior_claim.used or prior_claim.expires_at>now() then raise exception 'TRIAL_UNAVAILABLE'; end if;
  if exists(select 1 from billing_subscriptions s left join auth.users u on u.id=s.access_owner_id where s.mode=p_mode and (s.user_id=p_user or s.access_owner_id=p_user or lower(trim(u.email))=normalized))
   or exists(select 1 from billing_purchase_claims where mode=p_mode and lower(trim(email))=normalized)
   or exists(select 1 from premium_memberships m join auth.users u on u.id=m.user_id where m.enabled and m.access_source='manual' and (m.user_id=p_user or lower(trim(u.email))=normalized)) then raise exception 'TRIAL_UNAVAILABLE'; end if;
  insert into premium_trial_claims(mode,email,user_id,checkout_token,expires_at) values(p_mode,normalized,p_user,result.checkout_token,result.checkout_expires_at+interval '10 minutes')
  on conflict(mode,email) do update set user_id=excluded.user_id,checkout_token=excluded.checkout_token,expires_at=excluded.expires_at;
  update billing_customers set checkout_trial_days=offer_days where user_id=p_user and mode=p_mode returning * into result;
 end if;
 return result;
end $$;
revoke all on function public.reserve_premium_offer(uuid,text,text,text,boolean) from public,anon,authenticated;
grant execute on function public.reserve_premium_offer(uuid,text,text,text,boolean) to service_role;

commit;
