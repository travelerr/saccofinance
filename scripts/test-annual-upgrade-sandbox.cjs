// Creates only isolated Stripe TEST objects and local Supabase fixtures. Never loads live billing files.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript'),assert=require('node:assert/strict');
if(!process.argv.includes('--run'))throw Error('Pass --run for sandbox validation');
const local=require('./local-environment.cjs');Object.assign(process.env,local.appEnv(local.runtime()));
if(process.env.STRIPE_MODE!=='test'||!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')||process.env.NEXT_PUBLIC_SUPABASE_URL!=='http://127.0.0.1:54321'||process.env.EMAIL_SEND_MODE!=='dry-run')throw Error('Sandbox required');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,f);
const load=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};return load.call(this,id,...args)};
const {billingServices,checkedPrice}=require('../lib/billing/server.ts');
const {annualUpgradeUrl}=require('../lib/billing/annual-upgrade.ts');
const {reconcileBillingEvent}=require('../lib/billing/reconcile.ts');
const {hasPaidAccess}=require('../lib/billing/model.ts');
(async()=>{
 const {stripe,admin}=await billingServices();let user,customer,sub;
 try{
  const annual=await checkedPrice(stripe,'annual');await checkedPrice(stripe,'monthly');
  if(!process.env.STRIPE_UPGRADE_PORTAL_CONFIGURATION_ID){
   const config=await stripe.billingPortal.configurations.create({business_profile:{headline:'Sacco Premium — annual upgrade'},features:{subscription_cancel:{enabled:false},subscription_update:{enabled:true,default_allowed_updates:['price'],proration_behavior:'always_invoice',products:[{product:typeof annual.product==='string'?annual.product:annual.product.id,prices:[annual.id]}]},payment_method_update:{enabled:true},invoice_history:{enabled:true}},metadata:{purpose:'local_annual_upgrade'}});
   assert.equal(config.livemode,false);
   const file=path.join(local.localDir,'stripe-sandbox.json');const saved=JSON.parse(fs.readFileSync(file));saved.STRIPE_UPGRADE_PORTAL_CONFIGURATION_ID=config.id;fs.writeFileSync(file,JSON.stringify(saved,null,2)+'\n',{mode:0o600});process.env.STRIPE_UPGRADE_PORTAL_CONFIGURATION_ID=config.id;
  }
  const created=await admin.auth.admin.createUser({email:'annual-upgrade-'+Date.now()+'@example.com',email_confirm:true});if(created.error)throw created.error;user=created.data.user;
  customer=await stripe.customers.create({email:user.email,metadata:{sacco_user_id:user.id,test_purpose:'local_annual_upgrade'}});
  const pm=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:pm.id}});
  const saved=await admin.from('billing_customers').insert({user_id:user.id,mode:'test',stripe_customer_id:customer.id});if(saved.error)throw saved.error;
  sub=await stripe.subscriptions.create({customer:customer.id,items:[{price:process.env.STRIPE_MONTHLY_PRICE_ID}],metadata:{sacco_user_id:user.id}});
  const reconcile=async(type)=>reconcileBillingEvent({id:'upgrade-test-'+Date.now()+'-'+type,type,livemode:false,data:{object:{id:sub.id}}});
  await reconcile('customer.subscription.created');
  const url=await annualUpgradeUrl(user.id,sub.id);assert.match(url,/^https:\/\/billing.stripe.com\//);
  assert.equal((await stripe.subscriptions.retrieve(sub.id)).items.data[0].price.id,process.env.STRIPE_MONTHLY_PRICE_ID);
  console.log('Stripe hosted confirmation session created; opening upgrade leaves monthly subscription unchanged.');
  // API-driven simulation of the confirmed change; hosted confirmation itself remains a manual browser check.
  console.log('Preparing declined-payment scenario');
  const declined=await stripe.paymentMethods.attach('pm_card_chargeCustomerFail',{customer:customer.id});
  await stripe.subscriptions.update(sub.id,{default_payment_method:declined.id});
  console.log('Requesting sandbox annual update with pending-if-incomplete');
  const pending=await stripe.subscriptions.update(sub.id,{items:[{id:sub.items.data[0].id,price:annual.id,quantity:1}],proration_behavior:'always_invoice',payment_behavior:'pending_if_incomplete',expand:['latest_invoice']});
  assert.ok(pending.pending_update,'Failed annual payment must leave change pending');
  assert.equal(pending.items.data[0].price.id,process.env.STRIPE_MONTHLY_PRICE_ID);
  await reconcile('customer.subscription.updated');
  const before=await admin.from('billing_subscriptions').select('*').eq('stripe_subscription_id',sub.id).single();assert.equal(before.data.plan,'monthly');assert.equal(hasPaidAccess(before.data),true);
  await assert.rejects(annualUpgradeUrl(user.id,sub.id));
  await stripe.invoices.pay(pending.latest_invoice.id,{payment_method:pm.id});
  const updated=await stripe.subscriptions.retrieve(sub.id,{expand:['latest_invoice']});
  console.log('Declined annual payment preserves monthly plan and access; pending upgrade blocks another attempt.');
  assert.equal(updated.id,sub.id);assert.equal(updated.items.data[0].price.id,annual.id);assert.equal(updated.latest_invoice.status,'paid');
  const lines=[];for await(const line of stripe.invoices.listLineItems(updated.latest_invoice.id,{limit:100}))lines.push(line);
  assert.ok(lines.some(l=>l.amount<0),'Unused monthly time credited');assert.ok(lines.some(l=>l.amount===10000),'Annual price billed');
  await reconcile('customer.subscription.updated');
  const {data:record,error}=await admin.from('billing_subscriptions').select('*').eq('stripe_subscription_id',sub.id).single();if(error)throw error;assert.equal(record.plan,'annual');assert.equal(record.status,'active');assert.equal(hasPaidAccess(record),true);
  assert.equal((await stripe.subscriptions.list({customer:customer.id,status:'all'})).data.length,1);
  await assert.rejects(annualUpgradeUrl(user.id,sub.id));
  console.log('Paid annual update: unused-time credit, same subscription, annual plan, access preserved, repeat upgrade rejected.');
 }finally{
  if(sub)await stripe.subscriptions.cancel(sub.id);
  if(customer)await stripe.customers.del(customer.id);
  if(user)await admin.auth.admin.deleteUser(user.id);
 }
})().catch(e=>{console.error('Sandbox validation failed:',e.message);process.exitCode=1});
