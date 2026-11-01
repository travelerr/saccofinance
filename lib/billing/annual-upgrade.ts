import 'server-only';
import type Stripe from 'stripe';
import {localDevelopment} from '../local-development';
import {billingServices,checkedPrice,priceId,authOrigin} from './server';
import {ownedBillingCustomers} from './ownership';
import {assertRetentionSubscription,stripeCancellationEnd} from './retention-policy';

export function assertAnnualUpgrade(s:Stripe.Subscription,live:boolean,monthly:string,customers:string[]){
 assertRetentionSubscription(s,live,[monthly],customers);
 const invoice=typeof s.latest_invoice==='object'?s.latest_invoice:null;
 if(s.status!=='active'||s.cancel_at_period_end||stripeCancellationEnd(s)||s.pending_update||invoice?.status!=='paid')throw Error('UPGRADE_NOT_ELIGIBLE');
}
export function assertUpgradePortal(portal:Stripe.BillingPortal.Configuration,live:boolean,annual:string){
 const update=portal.features.subscription_update;
 if(!portal.active||portal.livemode!==live||portal.features.subscription_cancel.enabled||!update.enabled||!update.default_allowed_updates.includes('price')||update.proration_behavior!=='always_invoice'||!update.products?.some(p=>p.prices.includes(annual))||update.schedule_at_period_end.conditions.length)throw Error('UPGRADE_CONFIGURATION');
}
/** Creates a confirmation session only. Stripe updates the existing subscription after member confirmation. */
export async function annualUpgradeUrl(userId:string,id:string){
 const {stripe,admin,mode}=await billingServices();
 const {data:row,error}=await admin.from('billing_subscriptions').select('stripe_subscription_id').eq('stripe_subscription_id',id).eq('access_owner_id',userId).eq('mode',mode).maybeSingle();
 if(error||!row)throw Error('BILLING_OWNER');
 if(localDevelopment()&&id.startsWith('sub_local_'))throw Error('LOCAL_BILLING_FIXTURE');
 const s=await stripe.subscriptions.retrieve(id,{expand:['latest_invoice']});
 assertAnnualUpgrade(s,mode==='live',priceId('monthly'),await ownedBillingCustomers(userId));
 await checkedPrice(stripe,'monthly');await checkedPrice(stripe,'annual');
 const configuration=process.env.STRIPE_UPGRADE_PORTAL_CONFIGURATION_ID;
 if(!configuration)throw Error('UPGRADE_CONFIGURATION');
 assertUpgradePortal(await stripe.billingPortal.configurations.retrieve(configuration,{expand:['features.subscription_update.products']}),mode==='live',priceId('annual'));
 const return_url=authOrigin()+'/premium/account?billing=return';
 const session=await stripe.billingPortal.sessions.create({customer:typeof s.customer==='string'?s.customer:s.customer.id,configuration,return_url,flow_data:{type:'subscription_update_confirm',subscription_update_confirm:{subscription:s.id,items:[{id:s.items.data[0].id,price:priceId('annual'),quantity:1}]},after_completion:{type:'redirect',redirect:{return_url}}}});
 return session.url;
}
