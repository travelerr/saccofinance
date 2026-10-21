// Persistent, disposable local UI fixture backed by real Stripe TEST objects.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const {appEnv,runtime,localDir}=require('./local-environment.cjs');
Object.assign(process.env,appEnv(runtime()));
if(process.env.NEXT_PUBLIC_SUPABASE_URL!=='http://127.0.0.1:54321'||!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')||process.env.STRIPE_MODE!=='test')throw Error('Local database and Stripe sandbox required');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,f);
const load=Module._load;Module._load=function(id,...args){if(id==='server-only')return {};return load.call(this,id,...args)};
(async()=>{
 const {billingServices}=require('../lib/billing/server.ts');const {reconcileBillingEvent}=require('../lib/billing/reconcile.ts');
 const {stripe,admin}=await billingServices();
 const file=path.join(localDir,'credentials.json'),credentials=JSON.parse(fs.readFileSync(file,'utf8'));
 const email='billing@sacco.test';
 const users=await admin.auth.admin.listUsers({perPage:1000});if(users.error)throw users.error;
 let user=users.data.users.find(u=>u.email===email);
 if(!user){const r=await admin.auth.admin.createUser({email,password:credentials.password,email_confirm:true,user_metadata:{local_retention_fixture:true}});if(r.error)throw r.error;user=r.data.user;}
 if(!user.user_metadata.local_retention_fixture)throw Error('Existing account is not this script’s fixture');
 const lookup=await admin.from('billing_customers').select('stripe_customer_id').eq('user_id',user.id).eq('mode','test').maybeSingle();if(lookup.error)throw lookup.error;
 let customer=lookup.data?.stripe_customer_id;
 if(!customer){const c=await stripe.customers.create({email,metadata:{sacco_user_id:user.id,test_purpose:'local_retention_ui'}},{idempotencyKey:'local-retention-customer-'+user.id});customer=c.id;const r=await admin.from('billing_customers').insert({user_id:user.id,mode:'test',stripe_customer_id:customer});if(r.error)throw r.error;}
 const subscriptions=await stripe.subscriptions.list({customer,status:'all',limit:100});
 let subscription=subscriptions.data.find(s=>['active','trialing','past_due'].includes(s.status));
 if(!subscription){
  const card=await stripe.paymentMethods.attach('pm_card_visa',{customer});await stripe.customers.update(customer,{invoice_settings:{default_payment_method:card.id}});
  subscription=await stripe.subscriptions.create({customer,items:[{price:process.env.STRIPE_MONTHLY_PRICE_ID}],metadata:{sacco_user_id:user.id,test_purpose:'local_retention_ui'}});
 }
 await reconcileBillingEvent({id:'retention-ui-'+Date.now(),type:'customer.subscription.updated',livemode:false,data:{object:{id:subscription.id}}});
 // A dedicated test-only portal leaves all existing portal configurations untouched.
 const configFile=path.join(localDir,'stripe-sandbox.json'),config=JSON.parse(fs.readFileSync(configFile,'utf8'));
 let portal=await stripe.billingPortal.configurations.retrieve(config.STRIPE_PORTAL_CONFIGURATION_ID);
 if(portal.features.subscription_cancel.enabled){
  portal=await stripe.billingPortal.configurations.create({business_profile:{headline:'Sacco Premium — local billing test'},features:{customer_update:{enabled:true,allowed_updates:['email','address']},invoice_history:{enabled:true},payment_method_update:{enabled:true},subscription_cancel:{enabled:false},subscription_update:{enabled:false}},metadata:{purpose:'local_retention_ui'}});
  config.STRIPE_PORTAL_CONFIGURATION_ID=portal.id;fs.writeFileSync(configFile,JSON.stringify(config,null,2)+'\n',{mode:0o600});
 }
 // Confirm that Stripe will issue a portal session, without opening or charging anything.
 await stripe.billingPortal.sessions.create({customer,configuration:portal.id,return_url:'http://localhost:3082/premium/account?billing=return'});
 if(!credentials.users.some(u=>u.id===user.id)){credentials.users.push({email,id:user.id,description:'Real Stripe sandbox subscription — use for cancellation and keep-subscription UI tests'});fs.writeFileSync(file,JSON.stringify(credentials,null,2)+'\n',{mode:0o600});}
 console.log('billing@sacco.test is ready. Use the shared password in .local-development/credentials.json. Restart the local app to load the dedicated sandbox portal. No live billing or email changes.');
})().catch(e=>{console.error('Local fixture setup failed:',e.message);process.exitCode=1});
