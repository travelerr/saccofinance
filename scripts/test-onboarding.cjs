const fs=require('node:fs'),Module=require('node:module'),ts=require('typescript');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {PGlite}=require('@electric-sql/pglite');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {renderOnboardingEmail,onboardingWindow}=require('../lib/email/onboarding-template.ts');
test('onboarding timing boundaries and real destinations with unsubscribe headers',()=>{
 const start='2026-10-20T12:00:00Z',epoch=Date.parse(start);
 for(const [step,last] of [[0,2],[2,5],[5,7]]){
  assert.equal(onboardingWindow(step,start,epoch+step*86400000),true);
  assert.equal(onboardingWindow(step,start,epoch+last*86400000),false);
  assert.equal(onboardingWindow(step,start,epoch+step*86400000-1),false);
  const email=renderOnboardingEmail(step,'https://saccofinancial.com','https://saccofinancial.com/email/unsubscribe?token='+'a'.repeat(64));
  assert.match(email.html,/Unsubscribe/);assert.match(email.html,/max-width:600px/);
  assert.equal(email.headers['List-Unsubscribe-Post'],'List-Unsubscribe=One-Click');
  assert.equal(new URL(email.url).pathname,step===2?'/premium/opportunities':'/premium/dashboard');
 }
});
test('cohorts exclude existing members, enroll once on paid access, and claim correct steps without duplicates',async()=>{
 const db=new PGlite();
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz default now(),is_anonymous boolean default false);create table research_email_preferences(user_id uuid primary key,enabled boolean);insert into auth.users(id) values('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');create table billing_subscriptions(stripe_subscription_id text,access_owner_id uuid,mode text,status text,paid_through timestamptz,trial_end timestamptz);insert into billing_subscriptions values('old','11111111-1111-4111-8111-111111111111','test','active',now()+interval '1 month',null);`);
 await db.exec(fs.readFileSync('supabase/migrations/202610200003_member_onboarding.sql','utf8'));
 const claim=async(send='dry-run')=>(await db.query("select * from claim_member_onboarding_email('test',$1)",[send])).rows;
 assert.equal((await claim()).length,0);
 await db.exec(`insert into billing_subscriptions values('new','22222222-2222-4222-8222-222222222222','test','incomplete',null,null);`);
 assert.equal((await claim()).length,0);
 await db.exec("update billing_subscriptions set status='active',paid_through=now()+interval '1 month' where stripe_subscription_id='new'");
 assert.equal((await claim()).length,0); // Wait for opt-in instead of consuming the welcome step.
 await db.exec("insert into research_email_preferences values('22222222-2222-4222-8222-222222222222',true)");
 const first=(await claim())[0];assert.equal(first.step,0);assert.equal((await claim()).length,0);
 await db.exec("update member_onboarding_emails set claimed_at=now()-interval '6 minutes'");
 const retry=(await claim())[0];assert.equal(retry.id,first.id);assert.notEqual(retry.lease_token,first.lease_token);
 await db.exec("update member_onboarding_emails set status='uncertain',claimed_at=now()-interval '6 minutes'");assert.equal((await claim()).length,0);
 assert.equal((await claim('live'))[0].step,0);
 await db.exec("update member_onboarding_emails set status='sent';update member_onboarding set started_at=now()-interval '2 days' where eligible");assert.equal((await claim())[0].step,2);
 await db.exec("update member_onboarding_emails set status='sent';update member_onboarding set started_at=now()-interval '5 days' where eligible");assert.equal((await claim())[0].step,5);
 await db.exec("update member_onboarding_emails set status='sent';update member_onboarding set started_at=now()-interval '8 days' where eligible;update billing_subscriptions set paid_through=now()+interval '2 months'");assert.equal((await claim()).length,0);
 assert.equal((await db.query('select count(*)::int n from member_onboarding')).rows[0].n,2);
 await db.exec('create table billing_purchase_claims(id uuid,mode text,original_user_id uuid,claimed_user_id uuid)');
 await db.exec(fs.readFileSync('supabase/migrations/202610200004_signup_welcome.sql','utf8'));
 await db.exec(`insert into auth.users(id,email,is_anonymous) values('33333333-3333-4333-8333-333333333333',null,true),('44444444-4444-4444-8444-444444444444','new@example.test',false);`);
 assert.equal((await db.query("select enabled from research_email_preferences where user_id='44444444-4444-4444-8444-444444444444'")).rows[0].enabled,true);
 await db.exec(`insert into billing_subscriptions values('guest','33333333-3333-4333-8333-333333333333','test','active',now()+interval '1 month',null);
 insert into billing_purchase_claims values(gen_random_uuid(),'test','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444');
 update billing_subscriptions set access_owner_id='44444444-4444-4444-8444-444444444444' where stripe_subscription_id='guest';`);
 assert.equal((await claim()).length,0); // Combined auth welcome replaces guest Day 0.
 const clocks=(await db.query("select started_at from member_onboarding where subscription_id='guest'")).rows;assert.equal(clocks.length,2);assert.equal(String(clocks[0].started_at),String(clocks[1].started_at));
 await db.exec("update research_email_preferences set enabled=false where user_id='44444444-4444-4444-8444-444444444444';update auth.users set email='changed@example.test' where id='44444444-4444-4444-8444-444444444444'");
 assert.equal((await db.query("select enabled from research_email_preferences where user_id='44444444-4444-4444-8444-444444444444'")).rows[0].enabled,false);
 await db.exec('set role authenticated');await assert.rejects(db.exec('select * from member_onboarding'));await assert.rejects(claim());await db.close();
});
let state;
const end=new Date(Date.now()+86400000).toISOString();
function reset(){state={claimed:false,job:{id:'j',lease_token:'l',user_id:'u',mode:'test',step:0},cohort:{eligible:true,started_at:new Date().toISOString(),subscription_id:'sub'},row:{status:'active',paid_through:end,cancel_at_period_end:false},sub:{id:'sub',customer:'cus',status:'active',livemode:false,items:{data:[{quantity:1,price:{id:'p'}}]}},sendMode:'dry-run',mode:'test',recipients:[{userId:'u',email:'member@example.com'}],sends:0};}
const admin={from(table){let body;const q={select(){return q},eq(){return q},or(){return q},limit(){return q},update(v){body=v;return q},single(){return q},maybeSingle(){return q},then(resolve,reject){return Promise.resolve().then(()=>{
 if(table==='billing_purchase_claims')return {data:state.guest?[{id:'purchase'}]:[],error:null};
 if(table==='research_email_limits')return {data:{paused:state.paused},error:null};
 if(table==='member_onboarding')return {data:state.cohort,error:null};
 if(table==='billing_subscriptions')return {data:state.row,error:null};
 if(table==='member_onboarding_emails'){if(state.lostLease)return {data:null,error:null};Object.assign(state.job,body);return {data:{id:'j'},error:null};}throw Error(table);
 }).then(resolve,reject)}};return q;},rpc:async()=>{if(state.claimed)return {data:[],error:null};state.claimed=true;return {data:[state.job],error:null};}};
const load=Module._load;Module._load=function(id,...args){
 if(id==='server-only')return {};
 if(id==='../billing/server')return {billingServices:async()=>({admin,mode:state.mode,stripe:{subscriptions:{retrieve:async()=>state.sub}}}),priceId:()=> 'p',authOrigin:()=> 'https://saccofinancial.com'};
 if(id==='../billing/ownership')return {ownedBillingCustomers:async()=>['cus']};
 if(id==='./secrets')return {emailSecrets:async()=>({})};
 if(id==='./policy')return {researchSendMode:()=>state.sendMode};
 if(id==='./recipient-resolution')return {resolveResearchRecipientRecords:async()=>state.recipients};
 if(id==='./unsubscribe')return {createResearchUnsubscribe:async()=> 'https://saccofinancial.com/email/unsubscribe?token='+'a'.repeat(64)};
 if(id==='./resend-client')return {resendPersonalizedWithTransport:async()=>{state.sends++;if(state.failSend)throw Error('timeout');return ['provider'];}};
 return load.call(this,id,...args);
};
const {processNextOnboardingEmail}=require('../lib/email/onboarding.ts');process.env.MEMBER_ONBOARDING_ENABLED='true';
test('onboarding skips canceled, ended, opted-out, suppressed/unverified resolution, old cohorts and wrong ownership',async()=>{
 for(const change of [()=>state.guest=true,()=>state.row.cancel_at_period_end=true,()=>state.sub.cancel_at_period_end=true,()=>state.sub.status='canceled',()=>state.row=null,()=>state.recipients=[],()=>state.cohort.eligible=false,()=>state.cohort.started_at='2020-01-01']){
 reset();change();assert.equal((await processNextOnboardingEmail()).status,'skipped');assert.equal(state.sends,0);
 }
 reset();state.sub.customer='wrong';await assert.rejects(processNextOnboardingEmail(),/OWNER/);assert.equal(state.sends,0);
});
test('onboarding disabled and paused gates, dry run, uncertain delivery and deduplication',async()=>{
 reset();process.env.MEMBER_ONBOARDING_ENABLED='false';assert.equal(await processNextOnboardingEmail(),null);assert.equal(state.claimed,false);process.env.MEMBER_ONBOARDING_ENABLED='true';
 reset();state.paused=true;assert.equal(await processNextOnboardingEmail(),null);assert.equal(state.claimed,false);
 reset();assert.equal((await processNextOnboardingEmail()).status,'dry_run');assert.equal(state.sends,0);
 for(const fail of [false,true]){reset();state.mode='live';state.sub.livemode=true;state.sendMode='live';state.failSend=fail;
 if(fail){await assert.rejects(processNextOnboardingEmail(),/UNCERTAIN/);assert.equal(state.job.status,'uncertain');}else assert.equal((await processNextOnboardingEmail()).status,'sent');
 assert.equal(state.sends,1);assert.equal(await processNextOnboardingEmail(),null);assert.equal(state.sends,1);
 }
 reset();state.lostLease=true;await assert.rejects(processNextOnboardingEmail(),/LEDGER/);assert.equal(state.sends,0);
 reset();state.sendMode='live';await assert.rejects(processNextOnboardingEmail(),/MODE_MISMATCH/);assert.equal(state.claimed,false);
});
