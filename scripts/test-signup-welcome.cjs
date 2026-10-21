// Full local guest-claim/welcome test. Captures mail only in loopback Mailpit; Stripe TEST only.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript'),assert=require('node:assert/strict'),crypto=require('node:crypto');
if(!process.argv.includes('--run'))throw Error('Pass --run for local signup validation.');
Object.assign(process.env,require('./local-environment.cjs').appEnv(require('./local-environment.cjs').runtime()));
if(process.env.NEXT_PUBLIC_SUPABASE_URL!=='http://127.0.0.1:54321'||process.env.STRIPE_MODE!=='test'||!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')||process.env.EMAIL_SEND_MODE!=='dry-run')throw Error('Local sandbox required');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const load=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};if(id.startsWith('@/'))id=path.join(process.cwd(),id.slice(2));return load.call(this,id,...args)};
const {createClient}=require('@supabase/supabase-js');
const {billingServices}=require('../lib/billing/server.ts');
const {reconcileBillingEvent}=require('../lib/billing/reconcile.ts');
const {sendPurchaseWelcome,claimPurchase}=require('../lib/billing/purchases.ts');
const {saveSignupResearchPreference}=require('../lib/email/signup-preference.ts');
const {processNextOnboardingEmail}=require('../lib/email/onboarding.ts');
const options={auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}};
const check=r=>{if(r.error)throw r.error;return r.data;};
(async()=>{
 const {stripe,admin}=await billingServices();let guest,member,customer,sub;
 const email='welcome-check-'+Date.now()+'@sacco.test';
 const mail=async()=>{const all=await (await fetch('http://127.0.0.1:54324/api/v1/messages')).json();return (all.messages||[]).filter(m=>m.To?.some(t=>t.Address===email));};
 try{
  const browser=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,options);
  guest=check(await browser.auth.signInAnonymously()).user;
  customer=await stripe.customers.create({email,metadata:{sacco_user_id:guest.id,test_purpose:'local_combined_welcome_validation'}});
  const card=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:card.id}});
  check(await admin.from('billing_customers').insert({user_id:guest.id,mode:'test',stripe_customer_id:customer.id}));
  sub=await stripe.subscriptions.create({customer:customer.id,items:[{price:process.env.STRIPE_MONTHLY_PRICE_ID}],metadata:{sacco_user_id:guest.id}});
  await reconcileBillingEvent({id:'welcome-test-'+sub.id,type:'customer.subscription.created',livemode:false,data:{object:{id:sub.id}}});
  const purchase=check(await admin.from('billing_purchase_claims').insert({original_user_id:guest.id,mode:'test',stripe_customer_id:customer.id,email}).select('*').single());
  await sendPurchaseWelcome(purchase);await sendPurchaseWelcome(purchase);
  let messages=[];for(let i=0;i<10;i++){messages=await mail();if(messages.length)break;await new Promise(r=>setTimeout(r,250));}
  assert.equal(messages.length,1,'Exactly one combined welcome');
  const detail=await (await fetch('http://127.0.0.1:54324/api/v1/message/'+messages[0].ID)).json();
  const html=detail.HTML;assert.match(html,/Welcome to Sacco Premium/);assert.match(html,/First, save your login and set your password/);assert.match(html,/Weekly Market Outlook/);
  assert.ok(html.indexOf('First, save your login')<html.indexOf('First, thank you'));
  const link=html.match(/href="([^"]*token_hash=[^"]+)"/)[1].replaceAll('&amp;','&');
  const url=new URL(link);assert.equal(url.origin,'http://localhost:3082');assert.equal(url.pathname,'/premium/auth/claim/'+purchase.id);
  const identity=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,options);
  member=check(await identity.auth.verifyOtp({type:'email',token_hash:url.searchParams.get('token_hash')})).user;
  assert.equal(check(await admin.from('research_email_preferences').select('enabled').eq('user_id',member.id).single()).enabled,true);
  await claimPurchase(purchase.id,member.id);await saveSignupResearchPreference(identity,member,false,false);
  assert.equal(check(await admin.from('billing_subscriptions').select('access_owner_id').eq('stripe_subscription_id',sub.id).single()).access_owner_id,member.id);
  const password=crypto.randomBytes(24).toString('base64url');check(await identity.auth.updateUser({password}));await identity.auth.signOut();check(await identity.auth.signInWithPassword({email,password}));
  await processNextOnboardingEmail();assert.equal((await mail()).length,1,'No separate Day 0 after claim');
  const cohort=check(await admin.from('member_onboarding').select('started_at').eq('user_id',member.id).single());
  assert.equal(cohort.started_at,check(await admin.from('member_onboarding').select('started_at').eq('user_id',guest.id).single()).started_at);
  check(await admin.from('member_onboarding').update({started_at:new Date(Date.now()-2*86400000-1000).toISOString()}).eq('user_id',member.id));
  for(let i=0;i<15;i++){await processNextOnboardingEmail();messages=await mail();if(messages.length===2)break;await new Promise(r=>setTimeout(r,250));}
  assert.equal(messages.length,2,'Day 2 reaches local inbox');
  const day2=messages.find(m=>m.Subject.includes('feature'));assert.ok(day2);
  const body=await (await fetch('http://127.0.0.1:54324/api/v1/message/'+day2.ID)).json();
  const unsubscribe=new URL(body.HTML.match(/href="([^"]*\/email\/unsubscribe\?token=[^"]+)"/)[1].replaceAll('&amp;','&'));assert.equal(unsubscribe.origin,'http://localhost:3082');
  const response=await fetch(unsubscribe,{method:'POST',body:new URLSearchParams({'List-Unsubscribe':'One-Click'})});assert.equal(response.status,200);
  assert.equal(check(await admin.from('research_email_preferences').select('enabled').eq('user_id',member.id).single()).enabled,false);
  await saveSignupResearchPreference(identity,member,false,false); // Never reset an existing opt-out.
  assert.equal(check(await admin.from('research_email_preferences').select('enabled').eq('user_id',member.id).single()).enabled,false);
  check(await admin.from('member_onboarding').update({started_at:new Date(Date.now()-5*86400000-1000).toISOString()}).eq('user_id',member.id));
  await processNextOnboardingEmail();assert.equal((await mail()).length,2,'Day 5 blocked after unsubscribe');
  fs.writeFileSync('.local-development/combined-welcome-preview.html',html.replaceAll(/token_hash=[a-f0-9]+/g,'token_hash=REDACTED'));
  console.log('PASS: one combined welcome; password link first; default ON; verified purchase claim; password login; no duplicate Day 0; Day 2 local inbox; unsubscribe blocks Day 5 and preserves OFF. No external email sent.');
 }finally{
  if(sub)await stripe.subscriptions.cancel(sub.id);
  if(customer)await stripe.customers.del(customer.id);
  if(guest){check(await admin.from('billing_purchase_claims').delete().eq('original_user_id',guest.id));check(await admin.auth.admin.deleteUser(guest.id));}
  if(member)check(await admin.auth.admin.deleteUser(member.id));
 }
})().catch(e=>{console.error('Signup welcome test failed:',e.message);process.exitCode=1;});
