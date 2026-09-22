import {localDevelopment} from '../local-development';
import 'server-only';
import {randomUUID} from 'node:crypto';
import type Stripe from 'stripe';
import {billingServices} from './server';
import {reconcileBillingEvent} from './reconcile';
export async function syncMemberBilling(userId:string){
 if(localDevelopment())return; // Read seeded payment evidence without contacting Stripe.
 const {admin,mode}=await billingServices();
 const {data,error}=await admin.from('billing_subscriptions').select('stripe_subscription_id').eq('access_owner_id',userId).eq('mode',mode).order('observed_at',{ascending:false}).limit(11);
 if(error||!data||data.length>10)throw new Error('BILLING_DATABASE');
 // IDs come exclusively from server-owned records, never from a redirect parameter.
 for(const row of data)await reconcileBillingEvent({id:'account-sync-'+randomUUID(),type:'customer.subscription.updated',livemode:mode==='live',data:{object:{id:row.stripe_subscription_id}}} as unknown as Stripe.Event);
}
