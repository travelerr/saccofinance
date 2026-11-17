// Creates and expires a Stripe TEST checkout; never submits a payment or sends email.
const fs=require('node:fs'),Module=require('node:module'),ts=require('typescript'),assert=require('node:assert/strict');
const local=require('./local-environment.cjs');Object.assign(process.env,local.appEnv(local.runtime()));
if(process.argv[2]!=='--sandbox'||!process.argv[3]||process.env.STRIPE_MODE!=='test'||!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')||process.env.NEXT_PUBLIC_SUPABASE_URL!=='http://127.0.0.1:54321')throw Error('Explicit local sandbox and invitation URL file required');
const offer=new URL(fs.readFileSync(process.argv[3],'utf8').trim()).searchParams.get('offer');
const load=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};if(id==='@/lib/analytics/server')return {checkoutAnalytics:async()=>({})};return load.call(this,id,...args);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
(async()=>{const {billingServices}=require('../lib/billing/server.ts'),{checkoutUrl}=require('../lib/billing/checkout.ts');const {admin,stripe}=await billingServices();const {data:setting,error}=await admin.from('premium_trial_settings').select('enabled,trial_days,private_offer_enabled').eq('mode','test').single();assert.ifError(error);let session;
try{
 const {error:offError}=await admin.from('premium_trial_settings').update({enabled:false,private_offer_enabled:true}).eq('mode','test');assert.ifError(offError);
 const {data,error}=await admin.auth.admin.createUser({email:'private-trial-smoke-'+Date.now()+'@example.invalid',email_confirm:true});assert.ifError(error);
 const url=await checkoutUrl(data.user,'monthly',undefined,false,offer);assert.ok(url.startsWith('https://checkout.stripe.com/'));
 const {data:row,error:rowError}=await admin.from('billing_customers').select('*').eq('user_id',data.user.id).eq('mode','test').single();assert.ifError(rowError);assert.equal(row.checkout_trial_days,30);
 session=(await stripe.checkout.sessions.list({customer:row.stripe_customer_id,status:'open',limit:1})).data[0];assert.equal(session.livemode,false);assert.equal(session.metadata.sacco_trial_days,'30');assert.equal(session.payment_method_collection,'always');assert.equal(session.amount_total,0);assert.equal(new URL(session.cancel_url).searchParams.get('offer'),offer);
 assert.equal(await checkoutUrl(data.user,'monthly',undefined,false,offer),url);
 const off=await admin.from('premium_trial_settings').update({private_offer_enabled:false}).eq('mode','test');assert.ifError(off.error);
 await assert.rejects(checkoutUrl(data.user,'monthly',undefined,false,offer),/TRIAL_UNAVAILABLE/);
 const on=await admin.from('premium_trial_settings').update({private_offer_enabled:true}).eq('mode','test');assert.ifError(on.error);
 assert.equal(await checkoutUrl(data.user,'monthly',undefined,false,offer),url);
 assert.equal((await admin.from('premium_trial_settings').select('enabled').eq('mode','test').single()).data.enabled,false);
 console.log('PASS: private 30-day Stripe test checkout, $0 today, card required, retry stable, public offer OFF. No payment submitted.');
}finally{if(session)await stripe.checkout.sessions.expire(session.id);const {error}=await admin.from('premium_trial_settings').update(setting).eq('mode','test');assert.ifError(error);}
})().catch(e=>{console.error('Sandbox test failed:',e.code||e.type||e.name);process.exitCode=1});
