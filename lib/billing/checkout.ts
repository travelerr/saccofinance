import {localDevelopment} from '../local-development';
import {checkoutAnalytics} from '@/lib/analytics/server';
import 'server-only';
import type {User} from '@supabase/supabase-js';
import {billingServices,checkedPrice,priceId,authOrigin} from './server';
import {blocksNewSubscription,type BillingPlan} from './model';
import {ownedBillingCustomers} from './ownership';
export async function portalUrl(userId:string,subscriptionId?:string){
 const {stripe,admin,mode}=await billingServices();
 const owned=await ownedBillingCustomers(userId);
 const {data,error}=await admin.from('billing_subscriptions').select('stripe_subscription_id,status').eq('access_owner_id',userId).eq('mode',mode).order('observed_at',{ascending:false});
 if(error)throw new Error('BILLING_DATABASE');
 const row=data?.find(r=>blocksNewSubscription(r.status)&&(!subscriptionId||r.stripe_subscription_id===subscriptionId));if(!row)throw new Error('NO_SUBSCRIPTION');
 if(localDevelopment()&&row.stripe_subscription_id.startsWith('sub_local_'))throw Error('LOCAL_BILLING_FIXTURE');
 const subscription=await stripe.subscriptions.retrieve(row.stripe_subscription_id);
 const customer=typeof subscription.customer==='string'?subscription.customer:subscription.customer.id;
 if(!owned.includes(customer))throw new Error('BILLING_OWNER');
 const configuration=process.env.STRIPE_PORTAL_CONFIGURATION_ID;
 if(!configuration)throw Error('PORTAL_CONFIGURATION_REQUIRED');
 const portal=await stripe.billingPortal.configurations.retrieve(configuration);
 // Cancellation belongs to the site's required-reason flow; payment/invoice management remains in Stripe.
 if(!portal.active||portal.features.subscription_cancel.enabled)throw Error('PORTAL_CANCELLATION_MUST_BE_DISABLED');
 const session=await stripe.billingPortal.sessions.create({customer,configuration,return_url:authOrigin()+'/premium/account?billing=return'});
 return session.url;
}
export async function checkoutUrl(user:User,plan:BillingPlan,trialEmail?:string,direct=false){
 const {stripe,admin,mode}=await billingServices();await checkedPrice(stripe,plan);
 const analytics=await checkoutAnalytics(user);
 if(user.is_anonymous){const {data,error}=await admin.from('billing_purchase_claims').select('claimed_user_id').eq('original_user_id',user.id).eq('mode',mode).not('claimed_user_id','is',null).maybeSingle();if(error)throw new Error('BILLING_DATABASE');if(data)throw new Error('GUEST_CLAIMED');}
 const owned=await ownedBillingCustomers(user.id);
 let priorCustomer=false;
 const email=(user.email||trialEmail||'').trim().toLowerCase();
 for(const customer of owned){
  const subscriptions=await stripe.subscriptions.list({customer,status:'all',limit:100});
  if(subscriptions.data.length)priorCustomer=true;
  if(subscriptions.has_more)throw new Error('BILLING_UNAVAILABLE');
  if(subscriptions.data.some(s=>blocksNewSubscription(s.status)&&s.items.data.some(i=>[priceId('monthly'),priceId('annual')].includes(i.price.id))))return portalUrl(user.id);
  const open=await stripe.checkout.sessions.list({customer,status:'open',limit:100});
  if(open.has_more)throw new Error('BILLING_UNAVAILABLE');
  const existing=open.data.find(s=>s.mode==='subscription'&&s.metadata?.sacco_user_id===user.id);if(existing?.url){const items=await stripe.checkout.sessions.listLineItems(existing.id,{limit:2});if(items.data.length!==1||items.data[0].price?.id!==priceId(plan))throw new Error('CHECKOUT_PENDING');if(direct&&existing.consent_collection?.terms_of_service!=='required')throw new Error('CHECKOUT_LEGACY');try{await stripe.checkout.sessions.update(existing.id,{metadata:analytics});}catch{/* Analytics cannot block checkout. */}return existing.url;}
 }
 // Also check prior Stripe customers by email before granting a new trial.
 if(email){const customers=await stripe.customers.list({email,limit:100});if(customers.has_more)throw Error('BILLING_UNAVAILABLE');for(const c of customers.data){const previous=await stripe.subscriptions.list({customer:c.id,status:'all',limit:1});if(previous.data.length)priorCustomer=true;}}
 const {data:record,error}=await admin.rpc('reserve_premium_offer',{p_user:user.id,p_mode:mode,p_plan:plan,p_email:email,p_prior_customer:priorCustomer});
 if(error||!record)throw new Error(error?.message.includes('TRIAL_')?'TRIAL_UNAVAILABLE':'BILLING_DATABASE');
 let customer=record.stripe_customer_id as string|null;
 if(!customer){
  const created=await stripe.customers.create({...(record.checkout_email?{email:record.checkout_email}:{}),metadata:{sacco_user_id:user.id}},{idempotencyKey:`sacco-customer-${mode}-${user.id}`});
  const {error:saveError}=await admin.from('billing_customers').update({stripe_customer_id:created.id}).eq('user_id',user.id).eq('mode',mode);
  if(saveError)throw new Error('BILLING_DATABASE');customer=created.id;
 }
 const selected=record.checkout_plan as BillingPlan;if(selected!==plan)throw new Error('CHECKOUT_PENDING');
 const guest=user.is_anonymous===true;
 const trial=record.checkout_trial_days===30;
 if(trial)await stripe.customers.update(customer,{email:record.checkout_email});
 const metadata={sacco_user_id:user.id,sacco_plan:selected,sacco_trial_days:trial?'30':'0',...(guest?{guest_checkout:'true'}:{})};
 const session=await stripe.checkout.sessions.create({mode:'subscription',...(direct?{consent_collection:{terms_of_service:'required' as const},custom_text:{terms_of_service_acceptance:{message:`I agree to the [Terms](https://saccofinancial.com/terms) and acknowledge the [Privacy Policy](https://saccofinancial.com/privacy).`}}}:{}),customer,client_reference_id:user.id,line_items:[{price:priceId(selected),quantity:1}],payment_method_types:['card'],allow_promotion_codes:false,metadata,payment_method_collection:'always',expires_at:Math.floor(new Date(record.checkout_expires_at).getTime()/1000),subscription_data:{metadata,...(trial?{trial_period_days:30,trial_settings:{end_behavior:{missing_payment_method:'cancel' as const}}}:{})},success_url:authOrigin()+(guest?'/premium/welcome?session_id={CHECKOUT_SESSION_ID}':'/premium/account?checkout=success'),cancel_url:authOrigin()+(guest?(direct?'/premium#pricing':'/premium/join?checkout=canceled'):'/premium/account?checkout=canceled')},{idempotencyKey:`sacco-checkout-${mode}-${record.checkout_token}${direct?'-direct':''}`});
 if(!session.url)throw new Error('BILLING_UNAVAILABLE');
 // Keep optional telemetry out of Stripe's idempotent create payload.
 try{await stripe.checkout.sessions.update(session.id,{metadata:analytics});}catch{/* Analytics cannot block checkout. */}
 return session.url;
}
