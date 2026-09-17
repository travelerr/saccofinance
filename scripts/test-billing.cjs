const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');const assert=require('node:assert/strict');const{test}=require('node:test');const{PGlite}=require('@electric-sql/pglite');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
const m=require('../lib/billing/model.ts');
const base={stripe_subscription_id:'sub_test',mode:'test',status:'active',plan:'monthly',paid_through:'2026-10-01T00:00:00Z',current_period_end:'2026-10-01T00:00:00Z',cancel_at_period_end:false,first_failure_at:null,failed_invoice_id:null};
test('paid access requires payment evidence and a valid paid period',()=>{
 const now=Date.parse('2026-09-17T00:00:00Z');assert.equal(m.hasPaidAccess(base,now),true);
 for(const status of ['incomplete','incomplete_expired','trialing','canceled','unpaid','paused'])assert.equal(m.hasPaidAccess({...base,status},now),false);
 assert.equal(m.hasPaidAccess({...base,paid_through:null},now),false);
 assert.equal(m.hasPaidAccess({...base,paid_through:'bad'},now),false);
 assert.equal(m.hasPaidAccess(base,Date.parse(base.paid_through)),false);
});
test('renewal failure grants exactly seven days; failed first payments get none',()=>{
 const failure='2026-10-01T12:00:00Z';const record={...base,status:'past_due',first_failure_at:failure};
 assert.equal(m.graceEnds(record),'2026-10-08T12:00:00.000Z');
 assert.equal(m.hasPaidAccess(record,Date.parse(failure)+m.GRACE_MS-1),true);
 assert.equal(m.hasPaidAccess(record,Date.parse(failure)+m.GRACE_MS),false);
 assert.equal(m.hasPaidAccess({...record,paid_through:null},Date.parse(failure)),false);
});
test('cancellation at period end preserves access; delinquent subscriptions block duplicate purchase',()=>{
 assert.equal(m.hasPaidAccess({...base,cancel_at_period_end:true},Date.parse('2026-09-17')),true);
 for(const status of ['active','past_due','unpaid','incomplete','paused','trialing'])assert.equal(m.blocksNewSubscription(status),true);
 for(const status of ['canceled','incomplete_expired'])assert.equal(m.blocksNewSubscription(status),false);
});
test('PostgreSQL migrations enforce retry safety, event ordering, checkout reservation and member isolation',async()=>{
 const db=new PGlite();
 const user='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222';
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;insert into auth.users values('${user}'),('${other}');`);
 await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations/202609160001_premium_memberships.sql'),'utf8'));
 await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations/202609170001_premium_billing.sql'),'utf8'));
 await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations/202609170003_scheduled_cancellation.sql'),'utf8'));
 await db.query("insert into premium_memberships(user_id,enabled,access_source) values($1,true,'manual')",[user]);
 const reserve=async(id,mode,plan)=>(await db.query('select * from reserve_premium_checkout($1,$2,$3)',[id,mode,plan])).rows[0];
 const checkout=await reserve(user,'test','monthly');const again=await reserve(user,'test','annual');assert.equal(checkout.checkout_token,again.checkout_token);assert.equal(again.checkout_plan,'monthly');
 await reserve(other,'test','annual');await reserve(user,'live','annual');
 const apply=async(event,record)=>db.query('select apply_premium_billing_event($1,$2,$3::jsonb)',[event,record.mode,JSON.stringify(record)]);
 const snapshot={...base,user_id:user,observed_at:'2026-09-17T00:00:00Z'};
 await apply('evt_paid',snapshot);
 const cancelAt='2026-09-25T00:00:00Z';
 await apply('evt_schedule',{...snapshot,cancel_at:cancelAt,cancel_at_period_end:false,observed_at:'2026-09-17T00:10:00Z'});
 assert.equal(Date.parse((await db.query('select cancel_at from billing_subscriptions')).rows[0].cancel_at),Date.parse(cancelAt));
 await apply('evt_resume',{...snapshot,cancel_at:null,observed_at:'2026-09-17T00:20:00Z'});
 await apply('evt_schedule_stale',{...snapshot,cancel_at:cancelAt,observed_at:'2026-09-17T00:10:00Z'});
 assert.equal((await db.query('select cancel_at from billing_subscriptions')).rows[0].cancel_at,null);
 const failed={...snapshot,status:'past_due',paid_through:null,first_failure_at:'2026-10-01T12:00:00Z',failed_invoice_id:'in_failure',observed_at:'2026-10-01T12:00:00Z'};
 await apply('evt_failure',failed);await apply('evt_retry',{...failed,first_failure_at:'2026-10-03T12:00:00Z',observed_at:'2026-10-03T12:00:00Z'});
 let row=(await db.query('select * from billing_subscriptions')).rows[0];assert.equal(Date.parse(row.first_failure_at),Date.parse(failed.first_failure_at));assert.equal(Date.parse(row.paid_through),Date.parse(base.paid_through));
 await apply('evt_retry',{...failed,status:'active',observed_at:'2026-10-04T12:00:00Z'}); // duplicate event can't mutate state
 await apply('evt_old_snapshot',{...snapshot,observed_at:'2026-09-18T00:00:00Z'}); // stale reconciliation can't undo failure
 row=(await db.query('select * from billing_subscriptions')).rows[0];assert.equal(row.status,'past_due');
 await apply('evt_recovered',{...snapshot,paid_through:'2026-11-01T00:00:00Z',current_period_end:'2026-11-01T00:00:00Z',observed_at:'2026-10-04T12:00:00Z'});
 row=(await db.query('select * from billing_subscriptions')).rows[0];assert.equal(row.status,'active');assert.equal(row.first_failure_at,null);
 await apply('evt_canceled',{...snapshot,status:'canceled',observed_at:'2026-10-05T12:00:00Z'});
 const manual=(await db.query('select * from premium_memberships')).rows[0];assert.equal(manual.enabled,true);assert.equal(manual.access_expires_at,null);assert.equal(manual.access_source,'manual');
 await assert.rejects(apply('evt_bad',{...snapshot,user_id:'33333333-3333-4333-8333-333333333333',stripe_subscription_id:'sub_bad'}));assert.equal((await db.query("select count(*)::int as n from billing_webhook_events where event_id='evt_bad'")).rows[0].n,0);
 await db.exec(`set role authenticated;set request.jwt.claim.sub='${other}';`);
 assert.equal((await db.query('select * from billing_subscriptions')).rows.length,0);assert.equal((await db.query('select * from billing_customers')).rows.length,1);
 await assert.rejects(db.query("update billing_customers set stripe_customer_id='cus_hijacked'"));await assert.rejects(db.query('select * from billing_webhook_events'));await assert.rejects(reserve(other,'test','monthly'));await assert.rejects(apply('evt_forged',snapshot));
 await db.close();
});

test('current Stripe invoice parent references prove the correct subscription payment only',()=>{
 const e=require('../lib/billing/evidence.ts');
 const line={amount:1000,period:{end:1792238101},pricing:{price_details:{price:'price_test'}},parent:{subscription_item_details:{subscription:'sub_test'}}};
 assert.equal(e.linePaidPeriod(line,'sub_test','price_test'),1792238101);
 assert.equal(e.linePaidPeriod(line,'sub_other','price_test'),null);
 assert.equal(e.linePaidPeriod(line,'sub_test','price_other'),null);
 assert.equal(e.linePaidPeriod({...line,amount:-1000},'sub_test','price_test'),null);
 assert.equal(e.invoiceSubscriptionId({parent:{subscription_details:{subscription:'sub_test'}}}),'sub_test');
 assert.equal(e.invoiceSubscriptionId({subscription:'sub_legacy'}),'sub_legacy');
});

test('scheduled cancellation dates display nonrenewal and cap access without removing the paid period early',()=>{
 const record={...base,cancel_at:'2026-09-25T00:00:00Z',cancel_at_period_end:false};
 const before=Date.parse('2026-09-17T00:00:00Z');
 assert.equal(m.cancellationScheduled(record),true);
 assert.equal(m.membershipStatus(record,before),'Canceled — access continues');
 assert.equal(m.hasPaidAccess(record,before),true);
 assert.equal(m.paidAccessEnds(record),'2026-09-25T00:00:00.000Z');
 assert.equal(m.hasPaidAccess(record,Date.parse(record.cancel_at)),false);
 assert.equal(m.membershipStatus(record,Date.parse(record.cancel_at)),'Access ended');
 assert.equal(m.cancellationScheduled({...base,cancel_at:null}),false);
 assert.equal(m.membershipStatus({...base,cancel_at:null},before),'active');
 assert.equal(m.paidAccessEnds({...record,cancel_at:'2026-11-01T00:00:00Z'}),'2026-10-01T00:00:00.000Z');
 assert.equal(m.cancellationScheduled({...base,cancel_at_period_end:true}),true);
 assert.equal(m.hasPaidAccess({...base,cancel_at_period_end:true},before),true);
 assert.equal(m.membershipStatus({...record,status:'canceled'},before),'Ended');
 assert.equal(m.hasPaidAccess({...record,paid_through:null},before),false);
});
