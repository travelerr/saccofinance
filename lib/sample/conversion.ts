import 'server-only';
import type Stripe from 'stripe';
import type {SupabaseClient} from '@supabase/supabase-js';
/** Match the sample's email to Stripe billing identity, independently of browser cookies. */
export async function syncSampleConversion(db:SupabaseClient,stripe:Stripe,lead:{id:string;email:string;created_at:string;mode:string;analytics_allowed?:boolean},prices:string[]){
 const customers=await stripe.customers.list({email:lead.email,limit:100});
 if(customers.has_more)throw Error('SAMPLE_CUSTOMER_LIMIT');
 const mapped=await db.rpc('sample_customer_ids',{p_email:lead.email,p_mode:lead.mode});if(mapped.error)throw Error('SAMPLE_CUSTOMER_LOOKUP');
 const ids=new Set(customers.data.map(c=>c.id));for(const row of mapped.data||[]){if(ids.has(row.customer_id))continue;const c=await stripe.customers.retrieve(row.customer_id);if(!c.deleted){customers.data.push(c);ids.add(c.id);}}
 let subscriberAt:string|undefined,paidAt:string|undefined,subscriptionId:string|undefined,invoiceId:string|undefined,amount:number|undefined,preexisting=false;
 for(const customer of customers.data){
  if(customer.livemode!==(lead.mode==='live'))throw Error('SAMPLE_MODE_MISMATCH');
  const subs=await stripe.subscriptions.list({customer:customer.id,status:'all',limit:100});if(subs.has_more)throw Error('SAMPLE_SUBSCRIPTION_LIMIT');
  for(const sub of subs.data){
   if(!sub.items.data.some(i=>prices.includes(i.price.id)))continue;
   if(['incomplete','incomplete_expired'].includes(sub.status))continue;
   const start=new Date(sub.created*1000).toISOString();
   if(Date.parse(start)<Date.parse(lead.created_at)){preexisting=true;continue;}
   if(!subscriberAt||start<subscriberAt)subscriberAt=start;
   if(!lead.analytics_allowed)continue;
   const invoices=await stripe.invoices.list({subscription:sub.id,status:'paid',limit:100});if(invoices.has_more)throw Error('SAMPLE_INVOICE_LIMIT');
   for(const invoice of invoices.data){const paid=invoice.status_transitions.paid_at;if(invoice.amount_paid<=0||invoice.currency!=='usd'||!paid)continue;const at=new Date(paid*1000).toISOString();if(at<lead.created_at)continue;if(!paidAt||at<paidAt){paidAt=at;invoiceId=invoice.id;subscriptionId=sub.id;amount=invoice.amount_paid;}}
  }
 }
 const patch:Record<string,unknown>={conversion_checked_at:new Date().toISOString()};
 if(preexisting)patch.preexisting_member=true;
 if(subscriberAt)patch.subscriber_at=subscriberAt;
 if(paidAt)Object.assign(patch,{paid_at:paidAt,conversion_subscription_id:subscriptionId,conversion_invoice_id:invoiceId,conversion_amount:amount});
 const {error}=await db.from('premium_sample_leads').update(patch).eq('id',lead.id).eq('mode',lead.mode);if(error)throw Error('SAMPLE_CONVERSION_SAVE');
 return {subscriber:preexisting||Boolean(subscriberAt)};
}
