import {localDevelopment,localStripeEnabled} from '../local-development';
import 'server-only';
import {createClient} from '@supabase/supabase-js';
import {authConfig} from '@/lib/supabase/config';
import {billingServices,authOrigin,priceId} from './server';
import {completedGuestCheckout} from './guest-session';
import {objectId} from './evidence';
import {hasPaidAccess,type SubscriptionRecord} from './model';
export type Purchase={id:string;original_user_id:string;mode:string;stripe_customer_id:string;email:string;claimed_user_id:string|null;welcome_sent_at:string|null};
export async function purchaseForBrowser(userId:string){
 const {admin,mode}=await billingServices();
 const {data,error}=await admin.from('billing_purchase_claims').select('id,original_user_id,mode,stripe_customer_id,email,claimed_user_id,welcome_sent_at').eq('original_user_id',userId).eq('mode',mode).is('claimed_user_id',null).maybeSingle();
 if(error)throw new Error('BILLING_DATABASE');return data as Purchase|null;
}
export async function sendPurchaseWelcome(purchase:Purchase){
 const {admin,mode}=await billingServices();if(purchase.mode!==mode)throw new Error('BILLING_MODE');
 const {data:reserved,error}=await admin.rpc('reserve_purchase_welcome',{p_purchase:purchase.id});if(error)throw new Error('BILLING_DATABASE');if(!reserved)return;
 try{
  const config=authConfig();if(!config)throw new Error('AUTH_UNAVAILABLE');
  const auth=createClient(config.url,config.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {error:emailError}=await auth.auth.signInWithOtp({email:purchase.email,options:{shouldCreateUser:true,emailRedirectTo:authOrigin()+'/premium/auth/claim/'+purchase.id}});
  if(emailError)throw new Error('WELCOME_UNAVAILABLE');
  const {error:saveError}=await admin.from('billing_purchase_claims').update({welcome_sent_at:new Date().toISOString(),welcome_lease_at:null}).eq('id',purchase.id);
  if(saveError)throw new Error('BILLING_DATABASE');
 }catch(error){await admin.from('billing_purchase_claims').update({welcome_lease_at:null}).eq('id',purchase.id);throw error;}
}
export async function completeGuestCheckout(sessionId:string){
 const {stripe,admin,mode}=await billingServices();
 const session=await stripe.checkout.sessions.retrieve(sessionId,{expand:['line_items']});
 if(!completedGuestCheckout(session,mode))return null;
 const original=session.metadata?.sacco_user_id;const customer=objectId(session.customer);const subscription=objectId(session.subscription);
 const items=session.line_items?.data||[];
 if(!original||!customer||!subscription||items.length!==1||items[0].quantity!==1||![priceId('monthly'),priceId('annual')].includes(objectId(items[0].price)||''))return null;
 const {data:mapping,error:mappingError}=await admin.from('billing_customers').select('user_id').eq('stripe_customer_id',customer).eq('mode',mode).maybeSingle();
 if(mappingError)throw new Error('BILLING_DATABASE');if(mapping?.user_id!==original)throw new Error('BILLING_OWNER');
 const {data:row,error:rowError}=await admin.from('billing_subscriptions').select('*').eq('stripe_subscription_id',subscription).eq('user_id',original).eq('mode',mode).maybeSingle();
 if(rowError)throw new Error('BILLING_DATABASE');if(!row||!hasPaidAccess(row as SubscriptionRecord))return null;
 const email=session.customer_details?.email?.trim().toLowerCase();if(!email)throw new Error('PURCHASE_EMAIL');
 // Do not attach an email identity to the browser account or impersonate an existing member.
 const {error:insertError}=await admin.from('billing_purchase_claims').upsert({original_user_id:original,mode,stripe_customer_id:customer,email},{onConflict:'stripe_customer_id',ignoreDuplicates:true});
 if(insertError)throw new Error('BILLING_DATABASE');
 const {data:purchase,error}=await admin.from('billing_purchase_claims').select('*').eq('stripe_customer_id',customer).eq('mode',mode).single();
 if(error||!purchase)throw new Error('BILLING_DATABASE');
 if(!purchase.claimed_user_id)await sendPurchaseWelcome(purchase as Purchase);
 return purchase as Purchase;
}
export async function claimPurchase(purchaseId:string,memberId:string){
 const {admin}=await billingServices();const {error}=await admin.rpc('claim_premium_purchase',{p_purchase:purchaseId,p_member:memberId});
 if(error)throw new Error('CLAIM_UNAVAILABLE');
}

export async function claimVerifiedPurchases(memberId:string){
 if(localDevelopment()&&!localStripeEnabled())return; // Local users are already explicitly seeded; no external purchase claims.
 const {admin,mode}=await billingServices();const {data,error}=await admin.auth.admin.getUserById(memberId);
 const user=data.user;if(error||!user||user.is_anonymous||!user.email_confirmed_at||!user.email)return;
 const {data:pending,error:pendingError}=await admin.from('billing_purchase_claims').select('id').eq('mode',mode).eq('email',user.email.trim().toLowerCase()).is('claimed_user_id',null);
 if(pendingError)throw new Error('BILLING_DATABASE');
 for(const purchase of pending||[])await claimPurchase(purchase.id,user.id);
}
