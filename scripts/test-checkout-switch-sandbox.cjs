// Opt-in: creates an isolated local user and Stripe TEST checkout, then expires the checkout.
const fs=require('node:fs'),Module=require('node:module'),ts=require('typescript'),assert=require('node:assert/strict');
const local=require('./local-environment.cjs');Object.assign(process.env,local.appEnv(local.runtime()));
if(process.argv[2]!=='--sandbox'||process.env.STRIPE_MODE!=='test'||!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')||process.env.NEXT_PUBLIC_SUPABASE_URL!=='http://127.0.0.1:54321')throw Error('Explicit local sandbox required');
const load=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};if(id==='@/lib/analytics/server')return {checkoutAnalytics:async()=>({})};return load.call(this,id,...args);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
(async()=>{const {billingServices}=require('../lib/billing/server.ts');const {checkoutUrl}=require('../lib/billing/checkout.ts');const {admin,stripe}=await billingServices();
const {data,error}=await admin.auth.admin.createUser({email:'switch-smoke-'+Date.now()+'@example.invalid',email_confirm:true});assert.ifError(error);const user=data.user;let customer;
try{
 let prior;
 for(const plan of ['monthly','annual','monthly']){
  const url=await checkoutUrl(user,plan,undefined,true);assert.ok(url.startsWith('https://checkout.stripe.com/'));
  const {data:row}=await admin.from('billing_customers').select('*').eq('user_id',user.id).eq('mode','test').single();customer=row.stripe_customer_id;assert.equal(row.checkout_plan,plan);
  const sessions=await stripe.checkout.sessions.list({customer,status:'open',limit:100});assert.equal(sessions.data.length,1);const current=sessions.data[0];assert.equal(current.livemode,false);
  const items=await stripe.checkout.sessions.listLineItems(current.id);assert.equal(items.data[0].price.id,process.env[plan==='annual'?'STRIPE_ANNUAL_PRICE_ID':'STRIPE_MONTHLY_PRICE_ID']);
  if(prior)assert.equal((await stripe.checkout.sessions.retrieve(prior)).status,'expired');
  assert.equal(await checkoutUrl(user,plan,undefined,true),url);prior=current.id;console.log('PASS:',plan,'correct price, one open session, retry reuses checkout');
 }
}finally{if(customer){const sessions=await stripe.checkout.sessions.list({customer,status:'open'});for(const session of sessions.data)await stripe.checkout.sessions.expire(session.id);}}
console.log('PASS: real Stripe sandbox monthly → annual → monthly; no payment submitted.');
})().catch(e=>{console.error('Sandbox test failed:',e.message);process.exitCode=1});
