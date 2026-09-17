-- Payment-first browser sessions. Apply after 202609170001_premium_billing.sql.
-- Subscription payment/customer records retain their original Stripe ownership.
-- Only verified email ownership can claim a purchase into a permanent login.
create table public.billing_purchase_claims (
 id uuid primary key default gen_random_uuid(),
 original_user_id uuid not null references auth.users(id),
 mode text not null check (mode in ('test','live')),
 stripe_customer_id text not null unique references public.billing_customers(stripe_customer_id),
 email text not null,
 claimed_user_id uuid references auth.users(id),
 welcome_sent_at timestamptz,
 welcome_lease_at timestamptz,
 created_at timestamptz not null default now(),
 foreign key (original_user_id,mode) references public.billing_customers(user_id,mode)
);
create index billing_purchase_email_pending on public.billing_purchase_claims(email,mode) where claimed_user_id is null;
alter table public.billing_purchase_claims enable row level security;
revoke all on public.billing_purchase_claims from anon,authenticated;
grant all on public.billing_purchase_claims to service_role;
alter table public.billing_subscriptions add column access_owner_id uuid references auth.users(id);
update public.billing_subscriptions set access_owner_id=user_id;
alter table public.billing_subscriptions alter column access_owner_id set not null;
create index billing_subscriptions_access_owner on public.billing_subscriptions(access_owner_id,mode);
create function public.set_billing_access_owner() returns trigger
language plpgsql security definer set search_path=public,pg_temp as $$
declare owner_id uuid;
begin
 select p.claimed_user_id into owner_id from billing_purchase_claims p join billing_customers c on c.stripe_customer_id=p.stripe_customer_id where c.user_id=new.user_id and c.mode=new.mode and p.mode=new.mode for share of p;
 new.access_owner_id=coalesce(owner_id,new.user_id);
 return new;
end; $$;
revoke all on function public.set_billing_access_owner() from public,anon,authenticated;
create trigger billing_access_owner before insert or update on public.billing_subscriptions for each row execute function public.set_billing_access_owner();
drop policy "Read own subscription" on public.billing_subscriptions;
create policy "Read own subscription" on public.billing_subscriptions for select to authenticated using ((select auth.uid())=access_owner_id);
create function public.owns_billing_customer(p_customer text,p_original uuid,p_mode text) returns boolean
language sql stable security definer set search_path=public,pg_temp as $$
 select auth.uid()=coalesce((select claimed_user_id from billing_purchase_claims where stripe_customer_id=p_customer and mode=p_mode),p_original);
$$;
revoke all on function public.owns_billing_customer(text,uuid,text) from public,anon;
grant execute on function public.owns_billing_customer(text,uuid,text) to authenticated,service_role;
drop policy "Read own billing customer" on public.billing_customers;
create policy "Read own billing customer" on public.billing_customers for select to authenticated using (public.owns_billing_customer(stripe_customer_id,user_id,mode));
create function public.claim_premium_purchase(p_purchase uuid,p_member uuid) returns void
language plpgsql security definer set search_path=public,pg_temp as $$
declare purchase public.billing_purchase_claims; member_email text;
begin
 select * into purchase from billing_purchase_claims where id=p_purchase for update;
 if purchase.id is null then raise exception 'Purchase unavailable'; end if;
 select lower(trim(email)) into member_email from auth.users where id=p_member and email_confirmed_at is not null and is_anonymous is not true;
 if member_email is null or member_email<>lower(trim(purchase.email)) then raise exception 'Verified email required'; end if;
 if purchase.claimed_user_id is not null and purchase.claimed_user_id<>p_member then raise exception 'Purchase already claimed'; end if;
 -- A server cannot use this function to move a normal member account.
 if not exists(select 1 from auth.users where id=purchase.original_user_id and is_anonymous is true) then raise exception 'Guest purchase required'; end if;
 if not exists(select 1 from billing_subscriptions where user_id=purchase.original_user_id and mode=purchase.mode and paid_through is not null) then raise exception 'Paid purchase required'; end if;
 update billing_purchase_claims set claimed_user_id=p_member where id=p_purchase;
 -- The ownership trigger also preserves this owner on all future webhook retries.
 update billing_subscriptions set access_owner_id=p_member where user_id=purchase.original_user_id and mode=purchase.mode;
end; $$;
revoke all on function public.claim_premium_purchase(uuid,uuid) from public,anon,authenticated;
grant execute on function public.claim_premium_purchase(uuid,uuid) to service_role;
create function public.reserve_purchase_welcome(p_purchase uuid) returns boolean
language plpgsql security definer set search_path=public,pg_temp as $$
begin
 update billing_purchase_claims set welcome_lease_at=now() where id=p_purchase and welcome_sent_at is null and (welcome_lease_at is null or welcome_lease_at<now()-interval '2 minutes');
 return found;
end; $$;
revoke all on function public.reserve_purchase_welcome(uuid) from public,anon,authenticated;
grant execute on function public.reserve_purchase_welcome(uuid) to service_role;
