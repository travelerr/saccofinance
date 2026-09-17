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
 const subscription=await stripe.subscriptions.retrieve(row.stripe_subscription_id);
 const customer=typeof subscription.customer==='string'?subscription.customer:subscription.customer.id;
 if(!owned.includes(customer))throw new Error('BILLING_OWNER');
 const session=await stripe.billingPortal.sessions.create({customer,configuration:process.env.STRIPE_PORTAL_CONFIGURATION_ID,return_url:authOrigin()+'/premium/account?billing=return'});
 return session.url;
}
export async function checkoutUrl(user:User,plan:BillingPlan){
 const {stripe,admin,mode}=await billingServices();await checkedPrice(stripe,plan);
 if(user.is_anonymous){const {data,error}=await admin.from('billing_purchase_claims').select('claimed_user_id').eq('original_user_id',user.id).eq('mode',mode).not('claimed_user_id','is',null).maybeSingle();if(error)throw new Error('BILLING_DATABASE');if(data)throw new Error('GUEST_CLAIMED');}
 const owned=await ownedBillingCustomers(user.id);
 for(const customer of owned){
  const subscriptions=await stripe.subscriptions.list({customer,status:'all',limit:100});
  if(subscriptions.has_more)throw new Error('BILLING_UNAVAILABLE');
  if(subscriptions.data.some(s=>blocksNewSubscription(s.status)&&s.items.data.some(i=>[priceId('monthly'),priceId('annual')].includes(i.price.id))))return portalUrl(user.id);
  const open=await stripe.checkout.sessions.list({customer,status:'open',limit:100});
  if(open.has_more)throw new Error('BILLING_UNAVAILABLE');
  const existing=open.data.find(s=>s.mode==='subscription'&&s.metadata?.sacco_user_id===user.id);if(existing?.url)return existing.url;
 }
 const {data:record,error}=await admin.rpc('reserve_premium_checkout',{p_user:user.id,p_mode:mode,p_plan:plan});
 if(error||!record)throw new Error('BILLING_DATABASE');
 let customer=record.stripe_customer_id as string|null;
 if(!customer){
  const created=await stripe.customers.create({...(user.email?{email:user.email}:{}),metadata:{sacco_user_id:user.id}},{idempotencyKey:`sacco-customer-${mode}-${user.id}`});
  const {error:saveError}=await admin.from('billing_customers').update({stripe_customer_id:created.id}).eq('user_id',user.id).eq('mode',mode);
  if(saveError)throw new Error('BILLING_DATABASE');customer=created.id;
 }
 const selected=record.checkout_plan as BillingPlan;if(selected!==plan)throw new Error('CHECKOUT_PENDING');
 const guest=user.is_anonymous===true;
 const metadata={sacco_user_id:user.id,...(guest?{guest_checkout:'true'}:{})};
 const session=await stripe.checkout.sessions.create({mode:'subscription',customer,client_reference_id:user.id,line_items:[{price:priceId(selected),quantity:1}],payment_method_types:['card'],allow_promotion_codes:false,metadata,subscription_data:{metadata},success_url:authOrigin()+(guest?'/premium/welcome?session_id={CHECKOUT_SESSION_ID}':'/premium/account?checkout=success'),cancel_url:authOrigin()+(guest?'/premium/join?checkout=canceled':'/premium/account?checkout=canceled')},{idempotencyKey:`sacco-checkout-${mode}-${record.checkout_token}`});
 if(!session.url)throw new Error('BILLING_UNAVAILABLE');return session.url;
}
