import 'server-only';
import {billingServices} from './server';
// A verified member can own a paid guest purchase alongside an existing customer.
// Stripe metadata keeps the original browser UUID; ownership is never inferred from email.
export async function ownedBillingCustomers(userId:string){
 const {admin,mode}=await billingServices();
 const [direct,claimed]=await Promise.all([
  admin.from('billing_customers').select('stripe_customer_id').eq('user_id',userId).eq('mode',mode),
  admin.from('billing_purchase_claims').select('stripe_customer_id').eq('claimed_user_id',userId).eq('mode',mode)
 ]);
 if(direct.error||claimed.error)throw new Error('BILLING_DATABASE');
 const ids=[...(direct.data||[]),...(claimed.data||[])].map(r=>r.stripe_customer_id).filter((id):id is string=>Boolean(id));
 // Exclude purchases claimed away from a temporary browser account.
 if(!ids.length)return [];
 const {data,error}=await admin.from('billing_purchase_claims').select('stripe_customer_id,claimed_user_id').in('stripe_customer_id',ids).eq('mode',mode);
 if(error)throw new Error('BILLING_DATABASE');
 const moved=new Set((data||[]).filter(r=>r.claimed_user_id&&r.claimed_user_id!==userId).map(r=>r.stripe_customer_id));
 return [...new Set(ids)].filter(id=>!moved.has(id));
}
