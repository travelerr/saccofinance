const fs=require('node:fs'),Module=require('node:module'),ts=require('typescript');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {PGlite}=require('@electric-sql/pglite');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const original=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};return original.call(this,id,...args)};
const policy=require('../lib/billing/retention-policy.ts');
const template=require('../lib/email/access-reminder-template.ts');
const sub={id:'sub_a',customer:'cus_a',livemode:false,status:'active',start_date:1700000000,items:{data:[{quantity:1,price:{id:'price_a'},current_period_end:2000000000}]},cancel_at:null,cancel_at_period_end:false};
test('required reasons, optional feedback, and maximum length are enforced on server',()=>{
 for(const reason of Object.keys(policy.cancellationReasons))assert.deepEqual(policy.cancellationInput(reason,'  fine  '),{reason,feedback:'fine'});
 for(const reason of ['',null,'toString','__proto__','wrong'])assert.throws(()=>policy.cancellationInput(reason,''));
 assert.equal(policy.cancellationInput('other','').feedback,'');
 assert.throws(()=>policy.cancellationInput('other','a'.repeat(1001)));assert.throws(()=>policy.cancellationInput('other',{}));
});
test('subscription guards reject wrong customer, mode, price, quantities and ended subscriptions',()=>{
 policy.assertRetentionSubscription(sub,false,['price_a'],['cus_a']);
 for(const change of [{customer:'cus_b'},{livemode:true},{status:'canceled'},{status:'unpaid'},{schedule:'sched_a'},{pause_collection:{}},{items:{data:[]}},{items:{data:[{quantity:2,price:{id:'price_a'}}]}},{items:{data:[{quantity:1,price:{id:'price_b'}}]}}])assert.throws(()=>policy.assertRetentionSubscription({...sub,...change},false,['price_a'],['cus_a']));
});
test('reminder window excludes expired dates, includes exactly 72 hours, respects custom cancellation date',()=>{
 const now=1800000000000;
 assert.equal(policy.reminderDue(null,now),false);assert.equal(policy.reminderDue(now/1000,now),false);
 assert.equal(policy.reminderDue(now/1000+259200,now),true);assert.equal(policy.reminderDue(now/1000+259201,now),false);
 assert.equal(policy.stripeCancellationEnd({...sub,cancel_at_period_end:true}),2000000000);
 assert.equal(policy.stripeCancellationEnd({...sub,cancel_at_period_end:true,cancel_at:1900000000}),1900000000);
 assert.equal(policy.stripeCancellationEnd(sub),null);
});
test('reminder links to account without renewing and explains nonaction accurately',()=>{
 const e=template.renderAccessReminder('https://saccofinancial.com','2026-10-23T18:00:00Z');
 assert.equal(e.url,'https://saccofinancial.com/premium/account');assert.match(e.text,/October 23, 2026/);assert.match(e.text,/no action is needed/);assert.match(e.html,/max-width:600px/);assert.doesNotMatch(e.html,/<form|action=|trial offer/i);assert.throws(()=>template.renderAccessReminder('javascript:alert(1)','2026-10-23'));
});
test('database deduplication, window, retries, mode isolation and private audit',async()=>{
 const db=new PGlite();
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);insert into auth.users values('11111111-1111-4111-8111-111111111111');create table billing_subscriptions(stripe_subscription_id text,access_owner_id uuid,mode text,status text,cancel_at_period_end boolean,cancel_at timestamptz,current_period_end timestamptz,trial_end timestamptz,paid_through timestamptz);`);
 await db.exec(fs.readFileSync('supabase/migrations/202610200001_billing_retention.sql','utf8'));
 await db.exec(fs.readFileSync('supabase/migrations/202610200002_billing_cancellation_reasons.sql','utf8'));
 const add=async(id,days,status='active',cancel=true,mode='test')=>db.query(`insert into billing_subscriptions values($1,'11111111-1111-4111-8111-111111111111',$2,$3,$4,null,now()+$5::interval,now()+$5::interval,now()+$5::interval)`,[id,mode,status,cancel,days+' days']);
 const claim=async(mode='test',send='dry-run')=>(await db.query('select * from claim_billing_access_reminder($1,$2)',[mode,send])).rows;
 await add('future',4);await add('expired',-1);await add('resumed',2,'active',false);await add('ended',2,'canceled');assert.equal((await claim()).length,0);
 await add('due',2);const first=(await claim())[0];assert.equal(first.subscription_id,'due');assert.equal((await claim()).length,0);
 await db.exec("update billing_access_reminders set claimed_at=now()-interval '6 minutes'");const retry=(await claim())[0];assert.equal(retry.id,first.id);assert.notEqual(retry.lease_token,first.lease_token);
 await db.exec("update billing_access_reminders set status='dispatching',claimed_at=now()-interval '6 minutes'");assert.equal((await claim()).length,0);
 assert.equal((await claim('test','live')).length,1); // Dry-run does not consume live delivery.
 await add('live',2,'active',true,'live');assert.equal((await claim('live'))[0].subscription_id,'live');
 await add('trial',1,'trialing');assert.equal((await claim())[0].subscription_id,'trial');
 await assert.rejects(db.exec("insert into billing_retention_events(id,user_id,mode,subscription_id,action,subscription_started_at,status) values(gen_random_uuid(),'11111111-1111-4111-8111-111111111111','test','due','cancel',now(),'requested')"));
 await db.exec('set role authenticated');await assert.rejects(db.exec('select * from billing_retention_events'));await assert.rejects(claim());await db.close();
});

test('cancellation banner covers all scheduled cancellations and respects continuing access',()=>{
 const {cancellationBannerEnd}=require('../lib/billing/cancellation-banner.ts');
 const now=Date.parse('2026-10-20T12:00:00Z');
 const end='2026-11-20T12:00:00.000Z';
 const s={stripe_subscription_id:'sub_banner',mode:'test',status:'active',plan:'monthly',paid_through:end,current_period_end:end,cancel_at_period_end:true,cancel_at:null,first_failure_at:null,failed_invoice_id:null};
 assert.equal(cancellationBannerEnd([s],false,now),end);
 assert.equal(cancellationBannerEnd([s],true,now),null);
 assert.equal(cancellationBannerEnd([{...s,cancel_at_period_end:false}],false,now),null);
 assert.equal(cancellationBannerEnd([s,{...s,cancel_at_period_end:false}],false,now),null);
 assert.equal(cancellationBannerEnd([{...s,status:'canceled'}],false,now),null);
 assert.equal(cancellationBannerEnd([s],false,Date.parse(end)),null);
 assert.equal(cancellationBannerEnd([{...s,status:'trialing',trial_end:end}],false,now),end);
 assert.equal(cancellationBannerEnd([{...s,cancel_at:'2026-10-25T12:00:00Z'}],false,now),'2026-10-25T12:00:00.000Z');
 assert.equal(cancellationBannerEnd([],false,now),null);
});
