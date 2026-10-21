// Explicit opt-in. Creates/deletes only its own Stripe TEST objects and loopback DB fixtures.
const fs=require('node:fs'),Module=require('node:module'),ts=require('typescript'),assert=require('node:assert/strict');
if(!process.argv.includes('--run'))throw Error('Pass --run to test with local Supabase and Stripe sandbox.');
Object.assign(process.env,require('./local-environment.cjs').appEnv(require('./local-environment.cjs').runtime()));
if(process.env.NEXT_PUBLIC_SUPABASE_URL!=='http://127.0.0.1:54321'||process.env.STRIPE_MODE!=='test'||!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')||process.env.EMAIL_SEND_MODE!=='dry-run')throw Error('Sandbox required');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,f);
process.env.LOCAL_ONBOARDING_INBOX='false'; // Automated timing tests remain dry-run only.
const load=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};return load.call(this,id,...args)};
const {billingServices}=require('../lib/billing/server.ts');
const {changeRenewal}=require('../lib/billing/retention.ts');
const {syncMemberBilling}=require('../lib/billing/sync.ts');
const {reconcileBillingEvent}=require('../lib/billing/reconcile.ts');
const {processNextOnboardingEmail}=require('../lib/email/onboarding.ts');
const {processNextAccessReminder}=require('../lib/email/access-reminders.ts');
(async()=>{
 const {stripe,admin}=await billingServices();let user,customer;const subscriptions=[];
 try{
  const created=await admin.auth.admin.createUser({email:'retention-'+Date.now()+'@example.com',email_confirm:true});if(created.error)throw created.error;user=created.data.user;
  customer=await stripe.customers.create({email:user.email,metadata:{sacco_user_id:user.id,test_purpose:'local_retention_validation'}});
  const card=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:card.id}});
  const saved=await admin.from('billing_customers').insert({user_id:user.id,mode:'test',stripe_customer_id:customer.id});if(saved.error)throw saved.error;
  for(const [plan,trial] of [['monthly',false],['annual',false],['monthly',true]]){
   const s=await stripe.subscriptions.create({customer:customer.id,items:[{price:process.env[plan==='monthly'?'STRIPE_MONTHLY_PRICE_ID':'STRIPE_ANNUAL_PRICE_ID']}],metadata:{sacco_user_id:user.id},...(trial?{trial_period_days:2}:{})});subscriptions.push(s.id);
   await reconcileBillingEvent({id:'retention-test-'+s.id,type:'customer.subscription.created',livemode:false,data:{object:{id:s.id}}});
   if(plan==='monthly'&&!trial){
    process.env.MEMBER_ONBOARDING_ENABLED='true';
    const pref=await admin.from('research_email_preferences').upsert({user_id:user.id,enabled:true});if(pref.error)throw pref.error;
    for(const day of [0,2,5]){
     const shifted=await admin.from('member_onboarding').update({started_at:new Date(Date.now()-day*86400000-1000).toISOString()}).eq('user_id',user.id).eq('mode','test');if(shifted.error)throw shifted.error;
     let own;for(let i=0;i<20;i++){const r=await processNextOnboardingEmail();if(!r)break;const {data:j}=await admin.from('member_onboarding_emails').select('*').eq('id',r.id).single();if(j?.user_id===user.id){own=j;break;}}
     assert.equal(own?.step,day);assert.equal(own?.status,'dry_run');
     await processNextOnboardingEmail();
    }
    const receipts=await admin.from('member_onboarding_emails').select('id').eq('user_id',user.id);if(receipts.error)throw receipts.error;assert.equal(receipts.data.length,3);
    console.log('Onboarding: Day 0 / Day 2 / Day 5 each processed once in dry-run; no emails sent.');
   }
   await assert.rejects(changeRenewal(user.id,s.id,'cancel','',''));
   await changeRenewal(user.id,s.id,'cancel','not_enough_research','Sandbox validation');
   let latest=await stripe.subscriptions.retrieve(s.id);assert.equal(latest.cancel_at_period_end,true);assert.equal(latest.cancellation_details.feedback,'other');
   await changeRenewal(user.id,s.id,'cancel','other','');
   await changeRenewal(user.id,s.id,'keep');latest=await stripe.subscriptions.retrieve(s.id);assert.equal(latest.cancel_at_period_end,false);assert.equal(latest.cancel_at,null);
   assert.equal(latest.items.data[0].current_period_end,s.items.data[0].current_period_end);assert.equal(latest.latest_invoice,s.latest_invoice);
   if(plan==='monthly'&&!trial){
    await stripe.subscriptions.update(s.id,{cancel_at:s.items.data[0].current_period_end});
    await changeRenewal(user.id,s.id,'keep');
    const resumed=await stripe.subscriptions.retrieve(s.id);assert.equal(resumed.cancel_at,null);assert.equal(resumed.latest_invoice,s.latest_invoice);
    await assert.rejects(changeRenewal('00000000-0000-4000-8000-000000000000',s.id,'cancel','other',''));
   }
   if(trial){
    process.env.BILLING_REMINDERS_ENABLED='true';
    await syncMemberBilling(user.id);
    await processNextAccessReminder();
    const resumed=await admin.from('billing_access_reminders').select('id').eq('subscription_id',s.id);
    if(resumed.error)throw resumed.error;assert.equal(resumed.data.length,0);
    await changeRenewal(user.id,s.id,'cancel','unused','');await syncMemberBilling(user.id);
    process.env.BILLING_REMINDERS_ENABLED='true';
    // Earlier test subscriptions are canceled below, so the trial is the only active access.
    let result;for(let i=0;i<20;i++){const r=await processNextAccessReminder();if(!r)break;const {data:j}=await admin.from('billing_access_reminders').select('*').eq('id',r.id).single();if(j?.subscription_id===s.id){result=r;break;}}
    assert.equal(result?.status,'dry_run');
    await processNextAccessReminder();
    const receipts=await admin.from('billing_access_reminders').select('ends_at,status').eq('subscription_id',s.id);
    if(receipts.error)throw receipts.error;assert.equal(receipts.data.length,1);assert.equal(receipts.data[0].status,'dry_run');
    fs.writeFileSync(require('node:path').join(require('./local-environment.cjs').localDir,'retention-reminder-evidence.json'),JSON.stringify({checkedAt:new Date().toISOString(),endsAt:receipts.data[0].ends_at,resumedSkipped:true,receiptCount:1,mode:'dry-run'},null,2)+'\n',{mode:0o600});
    console.log('Reminder checks: resumed subscription skipped; eligible reminder processed once; second run created no duplicate.');
   }
   await stripe.subscriptions.cancel(s.id);await syncMemberBilling(user.id);
   await assert.rejects(changeRenewal(user.id,s.id,'keep'));
   console.log(plan+(trial?' trial':' paid')+': cancel / duplicate / keep / ended guard passed'+(trial?'; reminder dry-run passed':''));
  }
 }finally{
  for(const id of subscriptions){const s=await stripe.subscriptions.retrieve(id);if(s.status!=='canceled')await stripe.subscriptions.cancel(id);}
  if(customer)await stripe.customers.del(customer.id);
  if(user){await admin.from('billing_access_reminders').delete().eq('user_id',user.id);const deleted=await admin.auth.admin.deleteUser(user.id);if(deleted.error)throw deleted.error;}
 }
})().catch(e=>{console.error('Sandbox validation failed:',e.message);process.exitCode=1});
