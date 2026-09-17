const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');const assert=require('node:assert/strict');const{test}=require('node:test');const{PGlite}=require('@electric-sql/pglite');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
test('a success URL, another browser, an unpaid checkout or the wrong Stripe mode cannot authorize guest access',()=>{
 const {guestCheckoutBelongsTo,completedGuestCheckout}=require('../lib/billing/guest-session.ts');
 const session={mode:'subscription',livemode:false,status:'complete',payment_status:'paid',customer:'cus_test',subscription:'sub_test',client_reference_id:'buyer',metadata:{guest_checkout:'true',sacco_user_id:'buyer'}};
 assert.equal(guestCheckoutBelongsTo(session,'buyer','test'),true);assert.equal(guestCheckoutBelongsTo(session,'other','test'),false);
 for(const change of [{livemode:true},{mode:'payment'},{status:'open'},{payment_status:'unpaid'},{customer:null},{subscription:null},{client_reference_id:'other'},{metadata:{guest_checkout:'true'}},{metadata:{sacco_user_id:'buyer'}}])assert.equal(completedGuestCheckout({...session,...change},'test'),false);
 assert.equal(completedGuestCheckout(session,'test'),true);
});
test('verified purchase claiming keeps payment history, isolates browser access, preserves grants and survives webhook retries',async()=>{
 const db=new PGlite();
 const guest='11111111-1111-4111-8111-111111111111',member='22222222-2222-4222-8222-222222222222',other='33333333-3333-4333-8333-333333333333',unverified='44444444-4444-4444-8444-444444444444';
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,is_anonymous boolean default false);create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;insert into auth.users(id,email,email_confirmed_at,is_anonymous) values('${guest}',null,null,true),('${member}','buyer@example.invalid',now(),false),('${other}','other@example.invalid',now(),false),('${unverified}','buyer@example.invalid',null,false);`);
 for(const file of ['202609160001_premium_memberships.sql','202609170001_premium_billing.sql','202609170002_payment_first.sql','202609170003_scheduled_cancellation.sql'])await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations',file),'utf8'));
 await db.query("insert into premium_memberships(user_id,enabled,access_source) values($1,true,'manual')",[member]);
 await db.query("insert into billing_customers(user_id,mode,stripe_customer_id) values($1,'test','cus_guest'),($2,'test','cus_existing')",[guest,member]);
 const snapshot={stripe_subscription_id:'sub_guest',user_id:guest,status:'active',plan:'monthly',paid_through:'2026-10-17T00:00:00Z',current_period_end:'2026-10-17T00:00:00Z',cancel_at_period_end:false,failed_invoice_id:null,first_failure_at:null,observed_at:'2026-09-17T01:00:00Z'};
 const apply=(event,data)=>db.query("select apply_premium_billing_event($1,'test',$2::jsonb)",[event,JSON.stringify(data)]);
 await apply('evt_paid',snapshot);
 const purchase=(await db.query("insert into billing_purchase_claims(original_user_id,mode,stripe_customer_id,email) values($1,'test','cus_guest','buyer@example.invalid') returning id",[guest])).rows[0].id;
 const claim=user=>db.query('select claim_premium_purchase($1,$2)',[purchase,user]);
 await assert.rejects(claim(other));await assert.rejects(claim(unverified));await assert.rejects(claim(guest));
 assert.equal((await db.query('select access_owner_id from billing_subscriptions')).rows[0].access_owner_id,guest);
 // Welcome requests acquire a lease, so concurrent webhook/return requests do not duplicate emails.
 assert.equal((await db.query('select reserve_purchase_welcome($1) as reserved',[purchase])).rows[0].reserved,true);
 assert.equal((await db.query('select reserve_purchase_welcome($1) as reserved',[purchase])).rows[0].reserved,false);
 await db.query('update billing_purchase_claims set welcome_sent_at=now(),welcome_lease_at=null where id=$1',[purchase]);
 assert.equal((await db.query('select reserve_purchase_welcome($1) as reserved',[purchase])).rows[0].reserved,false);
 // The existing member's canonical customer stays intact; no payment data is moved or invented.
 await claim(member);await claim(member);
 let row=(await db.query('select * from billing_subscriptions')).rows[0];assert.equal(row.user_id,guest);assert.equal(row.access_owner_id,member);
 assert.equal((await db.query("select stripe_customer_id from billing_customers where user_id=$1",[member])).rows[0].stripe_customer_id,'cus_existing');
 await apply('evt_updated',{...snapshot,cancel_at_period_end:true,observed_at:'2026-09-17T02:00:00Z'});
 row=(await db.query('select * from billing_subscriptions')).rows[0];assert.equal(row.access_owner_id,member);assert.equal(row.cancel_at_period_end,true);
 assert.equal((await db.query('select enabled,access_expires_at from premium_memberships where user_id=$1',[member])).rows[0].enabled,true);
 await db.exec(`set role authenticated;set request.jwt.claim.sub='${guest}';`);
 assert.equal((await db.query('select * from billing_subscriptions')).rows.length,0);assert.equal((await db.query('select * from billing_customers')).rows.length,0);
 await assert.rejects(db.query('select * from billing_purchase_claims'));await assert.rejects(claim(member));
 await db.exec(`set request.jwt.claim.sub='${member}';`);
 assert.equal((await db.query('select * from billing_subscriptions')).rows.length,1);assert.equal((await db.query('select * from billing_customers')).rows.length,2);
 await assert.rejects(db.query("update billing_subscriptions set access_owner_id=$1",[other]));
 await db.exec(`set request.jwt.claim.sub='${other}';`);assert.equal((await db.query('select * from billing_subscriptions')).rows.length,0);
 await db.close();
});
