-- Preserve the exact Stripe scheduled-cancellation date. No subscriptions or grants are deleted.
begin;
alter table public.billing_subscriptions add column cancel_at timestamptz;
create or replace function public.apply_premium_billing_event(p_event text,p_mode text,p_snapshot jsonb)
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
  insert into billing_subscriptions(stripe_subscription_id,user_id,mode,status,plan,paid_through,current_period_end,cancel_at_period_end,cancel_at,first_failure_at,failed_invoice_id,observed_at)
  values(p_snapshot->>'stripe_subscription_id',(p_snapshot->>'user_id')::uuid,p_mode,p_snapshot->>'status',p_snapshot->>'plan',greatest(prior.paid_through,(p_snapshot->>'paid_through')::timestamptz),(p_snapshot->>'current_period_end')::timestamptz,(p_snapshot->>'cancel_at_period_end')::boolean,(p_snapshot->>'cancel_at')::timestamptz,failure,invoice_id,(p_snapshot->>'observed_at')::timestamptz)
  on conflict(stripe_subscription_id) do update set status=excluded.status,plan=excluded.plan,paid_through=excluded.paid_through,current_period_end=excluded.current_period_end,cancel_at_period_end=excluded.cancel_at_period_end,cancel_at=excluded.cancel_at,first_failure_at=excluded.first_failure_at,failed_invoice_id=excluded.failed_invoice_id,observed_at=excluded.observed_at;
 end if;
 insert into billing_webhook_events(event_id,mode) values(p_event,p_mode);
end; $$;
revoke all on function public.apply_premium_billing_event(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.apply_premium_billing_event(text,text,jsonb) to service_role;

commit;
