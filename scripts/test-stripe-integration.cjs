const fs=require('node:fs');const assert=require('node:assert/strict');const{randomUUID,randomBytes}=require('node:crypto');const Stripe=require('stripe');const{createClient}=require('@supabase/supabase-js');const{createServerClient}=require('@supabase/ssr');
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false}});const origin='http://127.0.0.1:3082';const testPlan=process.env.BILLING_TEST_PLAN==='annual'?'annual':'monthly';const testPrice=process.env[testPlan==='annual'?'STRIPE_ANNUAL_PRICE_ID':'STRIPE_MONTHLY_PRICE_ID'];
let uid,customerId,subscriptionId;let jar=[];
function assertDb(result){if(result.error)throw new Error('Database test operation failed: '+result.error.code);return result.data;}
async function poll(check){for(let n=0;n<30;n++){const data=await check();if(data)return data;await new Promise(r=>setTimeout(r,1000));}throw new Error('Timed out waiting for a sandbox webhook.');}
async function read(route,options={}){return fetch(origin+route,{...options,redirect:'manual',headers:{Cookie:jar.map(c=>c.name+'='+c.value).join('; '),...options.headers}});}
(async()=>{
 if(!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))throw Error('Test credentials required');
 const password=randomBytes(24).toString('base64url');
 const created=await admin.auth.admin.createUser({email:'billing-test-'+randomUUID()+'@example.invalid',password,email_confirm:true});if(created.error)throw Error('Test account setup failed');uid=created.data.user.id;
 const auth=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{cookies:{getAll:()=>jar,setAll(values){for(const c of values){jar=jar.filter(x=>x.name!==c.name);jar.push(c);}}}});
 const signed=await auth.auth.signInWithPassword({email:created.data.user.email,password});if(signed.error)throw Error('Test login failed');
 let res=await read('/premium/account');assert.equal(res.status,200);let html=await res.text();assert.ok(html.includes('Choose monthly'));assert.ok(html.includes('Sandbox billing'));console.log('Unpaid authenticated account can open Account & Billing and see sandbox plans.');
 res=await read('/premium/dashboard');assert.equal(res.status,307);assert.ok(res.headers.get('location').includes('/premium/access'));
 // Exercise the actual Next.js checkout server action with a valid session.
 const checkoutForm=Array.from(html.matchAll(/<form[^>]*>([\s\S]*?)<\/form>/g)).find(m=>m[1].includes('value="'+testPlan+'"'));assert.ok(checkoutForm);const action=checkoutForm[1].match(/name="(\$ACTION_ID_[^"]+)"/);assert.ok(action);
 const form=new FormData();form.set(action[1],'');form.set('plan',testPlan);
 res=await read('/premium/account',{method:'POST',headers:{Origin:origin},body:form});assert.equal(res.status,303);assert.ok(res.headers.get('location').startsWith('https://checkout.stripe.com/'));
 const customerRow=assertDb(await admin.from('billing_customers').select('stripe_customer_id').eq('user_id',uid).eq('mode','test').single());customerId=customerRow.stripe_customer_id;
 let sessions=await stripe.checkout.sessions.list({customer:customerId,status:'open'});assert.equal(sessions.data.length,1);assert.equal(sessions.data[0].mode,'subscription');
 const lines=await stripe.checkout.sessions.listLineItems(sessions.data[0].id);assert.equal(lines.data[0].price.id,testPrice);
 res=await read('/premium/account',{method:'POST',headers:{Origin:origin},body:form});assert.equal(res.status,303);sessions=await stripe.checkout.sessions.list({customer:customerId,status:'open'});assert.equal(sessions.data.length,1);console.log(testPlan+' checkout server action creates the correct sandbox price and reuses repeat requests.');
 await stripe.checkout.sessions.expire(sessions.data[0].id);
 const pm=await stripe.paymentMethods.attach('pm_card_visa',{customer:customerId});
 const sub=await stripe.subscriptions.create({customer:customerId,items:[{price:testPrice}],default_payment_method:pm.id,metadata:{sacco_user_id:uid}});subscriptionId=sub.id;
 const row=await poll(async()=>{const data=assertDb(await admin.from('billing_subscriptions').select('*').eq('stripe_subscription_id',sub.id).maybeSingle());return data?.status==='active'&&data.paid_through?data:null;});assert.ok(Date.parse(row.paid_through)>Date.now());console.log('Real Stripe sandbox invoice payment reaches the webhook and grants paid access.');
 res=await read('/premium/dashboard');assert.equal(res.status,200);res=await read('/api/market-strength');assert.equal(res.status,200);res=await read('/api/premium/chart/zs-2026-09-16');assert.equal(res.status,200);
 await stripe.subscriptions.update(sub.id,{cancel_at_period_end:true});await poll(async()=>{const data=assertDb(await admin.from('billing_subscriptions').select('*').eq('stripe_subscription_id',sub.id).single());return data.cancel_at_period_end?data:null;});res=await read('/premium/dashboard');assert.equal(res.status,200);console.log('Cancellation scheduled at period end retains paid access.');
 res=await read('/premium/account');html=await res.text();assert.ok(html.includes('Manage Subscription'));assert.ok(html.includes('Your access continues until'));const portalForm=Array.from(html.matchAll(/<form[^>]*>([\s\S]*?)<\/form>/g)).find(m=>m[1].includes('Manage Subscription'));const portalAction=portalForm?.[1].match(/name="(\$ACTION_ID_[^"]+)"/);assert.ok(portalAction);res=await read('/premium/account',{method:'POST',headers:{Origin:origin},body:(()=>{const f=new FormData();f.set(portalAction[1],'');return f;})()});assert.equal(res.status,303);assert.ok(res.headers.get('location').startsWith('https://billing.stripe.com/'));console.log('Account management opens the configured Stripe sandbox customer portal.');
 await stripe.subscriptions.cancel(sub.id);await poll(async()=>{const data=assertDb(await admin.from('billing_subscriptions').select('*').eq('stripe_subscription_id',sub.id).single());return data.status==='canceled'?data:null;});res=await read('/premium/dashboard');assert.equal(res.status,307);res=await read('/premium/account');assert.equal(res.status,200);console.log('Ended subscription denies Premium but preserves Account & Billing access.');
 const bad=await stripe.paymentMethods.attach('pm_card_chargeCustomerFail',{customer:customerId});
 const unpaid=await stripe.subscriptions.create({customer:customerId,items:[{price:testPrice}],default_payment_method:bad.id,metadata:{sacco_user_id:uid},payment_behavior:'allow_incomplete'});subscriptionId=unpaid.id;
 await poll(async()=>{const data=assertDb(await admin.from('billing_subscriptions').select('*').eq('stripe_subscription_id',unpaid.id).maybeSingle());return data?.status==='incomplete'?data:null;});
 res=await read('/premium/dashboard');assert.equal(res.status,307);console.log('Actual sandbox first-payment decline grants no Premium access.');
 assertDb(await admin.from('premium_memberships').insert({user_id:uid,enabled:true,access_source:'manual',access_expires_at:null}));res=await read('/premium/dashboard');assert.equal(res.status,200);res=await read('/premium/account');html=await res.text();assert.ok(html.includes('Complimentary lifetime access'));assert.ok(!html.includes('Choose monthly'));console.log('Lifetime grant remains independent of a canceled Stripe subscription.');
 const bogus=await fetch(origin+'/api/stripe/webhook',{method:'POST',body:'{}',headers:{'stripe-signature':'invalid'}});assert.equal(bogus.status,400);console.log('Forged webhook rejected.');
})().catch(error=>{console.error('Sandbox integration check failed:',error.message);process.exitCode=1;}).finally(async()=>{
 if(subscriptionId){try{await stripe.subscriptions.cancel(subscriptionId);}catch{}}
 if(customerId){try{const sessions=await stripe.checkout.sessions.list({customer:customerId,status:'open'});for(const session of sessions.data)await stripe.checkout.sessions.expire(session.id);await stripe.customers.del(customerId);}catch{}}
 if(uid){const result=await admin.auth.admin.deleteUser(uid);if(result.error){console.error('Temporary test account cleanup failed.');process.exitCode=1;}}
 console.log('Temporary sandbox/customer/account fixtures cleaned up.');
});
