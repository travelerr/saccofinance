-- Apply once in SQL Editor. Manual lifetime grants are untouched.
create table public.billing_customers (
 user_id uuid not null references auth.users(id) on delete cascade,
 mode text not null check (mode in ('test','live')),
 stripe_customer_id text unique,
 checkout_token uuid,
 checkout_plan text check (checkout_plan in ('monthly','annual')),
 checkout_expires_at timestamptz,
 primary key (user_id,mode)
);
create table public.billing_subscriptions (
 stripe_subscription_id text primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 mode text not null check (mode in ('test','live')),
 status text not null,
 plan text not null check (plan in ('monthly','annual')),
 paid_through timestamptz,
 current_period_end timestamptz,
 cancel_at_period_end boolean not null default false,
 first_failure_at timestamptz,
 failed_invoice_id text,
 observed_at timestamptz not null,
 foreign key (user_id,mode) references public.billing_customers(user_id,mode)
);
create index billing_subscriptions_member on public.billing_subscriptions(user_id,mode);
create table public.billing_webhook_events (
 event_id text primary key,
 mode text not null,
 processed_at timestamptz not null default now()
);
alter table public.billing_customers enable row level security;
alter table public.billing_subscriptions enable row level security;
alter table public.billing_webhook_events enable row level security;
revoke all on public.billing_customers,public.billing_subscriptions,public.billing_webhook_events from anon,authenticated;
grant select on public.billing_customers,public.billing_subscriptions to authenticated;
create policy "Read own billing customer" on public.billing_customers for select to authenticated using ((select auth.uid())=user_id);
create policy "Read own subscription" on public.billing_subscriptions for select to authenticated using ((select auth.uid())=user_id);
-- No member write policies. The server alone uses these functions.
create function public.reserve_premium_checkout(p_user uuid,p_mode text,p_plan text)
returns public.billing_customers language plpgsql security definer set search_path=public,pg_temp as $$
declare result public.billing_customers;
begin
 insert into billing_customers(user_id,mode) values(p_user,p_mode) on conflict do nothing;
 select * into result from billing_customers where user_id=p_user and mode=p_mode for update;
 if result.checkout_expires_at is null or result.checkout_expires_at<=now() then
  update billing_customers set checkout_token=gen_random_uuid(),checkout_plan=p_plan,checkout_expires_at=now()+interval '31 minutes' where user_id=p_user and mode=p_mode returning * into result;
 end if;
 return result;
end; $$;
revoke all on function public.reserve_premium_checkout(uuid,text,text) from public,anon,authenticated;
grant execute on function public.reserve_premium_checkout(uuid,text,text) to service_role;

create function public.apply_premium_billing_event(p_event text,p_mode text,p_snapshot jsonb)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare prior public.billing_subscriptions; failure timestamptz; invoice_id text;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_snapshot->>'stripe_subscription_id',0));
 if exists(select 1 from billing_webhook_events where event_id=p_event) then return; end if;
 select * into prior from billing_subscriptions where stripe_subscription_id=p_snapshot->>'stripe_subscription_id';
 if prior.observed_at is null or prior.observed_at<=(p_snapshot->>'observed_at')::timestamptz then
  invoice_id=p_snapshot->>'failed_invoice_id';
  failure=(p_snapshot->>'first_failure_at')::timestamptz;
  if p_snapshot->>'status'='past_due' and prior.failed_invoice_id=invoice_id then
   failure=least(prior.first_failure_at,failure);
  end if;
  insert into billing_subscriptions(stripe_subscription_id,user_id,mode,status,plan,paid_through,current_period_end,cancel_at_period_end,first_failure_at,failed_invoice_id,observed_at)
  values(p_snapshot->>'stripe_subscription_id',(p_snapshot->>'user_id')::uuid,p_mode,p_snapshot->>'status',p_snapshot->>'plan',greatest(prior.paid_through,(p_snapshot->>'paid_through')::timestamptz),(p_snapshot->>'current_period_end')::timestamptz,(p_snapshot->>'cancel_at_period_end')::boolean,failure,invoice_id,(p_snapshot->>'observed_at')::timestamptz)
  on conflict(stripe_subscription_id) do update set status=excluded.status,plan=excluded.plan,paid_through=excluded.paid_through,current_period_end=excluded.current_period_end,cancel_at_period_end=excluded.cancel_at_period_end,first_failure_at=excluded.first_failure_at,failed_invoice_id=excluded.failed_invoice_id,observed_at=excluded.observed_at;
 end if;
 insert into billing_webhook_events(event_id,mode) values(p_event,p_mode);
end; $$;
revoke all on function public.apply_premium_billing_event(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.apply_premium_billing_event(text,text,jsonb) to service_role;
