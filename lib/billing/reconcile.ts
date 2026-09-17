import 'server-only';
import type Stripe from 'stripe';
import {billingServices,priceId} from './server';
import {objectId,invoiceSubscriptionId,linePaidPeriod} from './evidence';
function iso(seconds:number|undefined|null){return seconds?new Date(seconds*1000).toISOString():null;}
export async function reconcileBillingEvent(event:Stripe.Event){
 const {stripe,admin,mode}=await billingServices();
 if(event.livemode!==(mode==='live'))return;
 const {data:receipt,error:receiptError}=await admin.from('billing_webhook_events').select('event_id').eq('event_id',event.id).maybeSingle();
 if(receiptError)throw new Error('BILLING_DATABASE');if(receipt)return;
 let subscriptionId:string|null=null;let invoiceId:string|null=null;
 if(event.type.startsWith('customer.subscription.'))subscriptionId=(event.data.object as Stripe.Subscription).id;
 else if(event.type.startsWith('invoice.')){const invoice=event.data.object as Stripe.Invoice;invoiceId=invoice.id;subscriptionId=invoiceSubscriptionId(invoice);}
 else if(event.type==='checkout.session.completed'){const session=event.data.object as Stripe.Checkout.Session;if(session.mode==='subscription')subscriptionId=objectId(session.subscription);}
 if(!subscriptionId)return;
 const observedAt=new Date().toISOString();
 const subscription=await stripe.subscriptions.retrieve(subscriptionId,{expand:['latest_invoice']});
 const supported=subscription.items.data.filter(item=>[priceId('monthly'),priceId('annual')].includes(item.price.id));
 if(supported.length!==1||subscription.items.data.length!==1||supported[0].quantity!==1||!subscription.metadata.sacco_user_id)return; // Ignore Systeme.io and unrelated subscriptions.
 const customerId=objectId(subscription.customer);
 const{data:customer,error}=await admin.from('billing_customers').select('user_id').eq('stripe_customer_id',customerId).eq('mode',mode).maybeSingle();
 if(error)throw new Error('BILLING_CUSTOMER');if(!customer)return; // Unmapped/deleted accounts never receive access.
 if(customer.user_id!==subscription.metadata.sacco_user_id)throw new Error('BILLING_OWNER');
 let paidThrough:number|null=null;
 const latest=typeof subscription.latest_invoice==='object'?subscription.latest_invoice:null;
 const invoices:Stripe.Invoice[]=[];
 if(latest?.status==='paid')invoices.push(latest);
 if(event.type==='invoice.paid'&&invoiceId){const paid=await stripe.invoices.retrieve(invoiceId);if(invoiceSubscriptionId(paid)===subscription.id&&objectId(paid.customer)===customerId&&paid.status==='paid')invoices.push(paid);}
 for(const invoice of invoices){
  // Paginate invoice lines so payment evidence isn't lost on larger invoices.
  for await(const line of stripe.invoices.listLineItems(invoice.id,{limit:100})){
   const end=linePaidPeriod(line,subscription.id,supported[0].price.id);if(end)paidThrough=Math.max(paidThrough||0,end);
  }
 }
 const delinquent=subscription.status==='past_due';
 const failedInvoice=delinquent?latest?.id||objectId(subscription.latest_invoice):null;
 const failureAt=delinquent&&invoiceId===failedInvoice&&['invoice.payment_failed','invoice.payment_action_required'].includes(event.type)?iso(event.created):null;
 const snapshot={stripe_subscription_id:subscription.id,user_id:customer.user_id,status:subscription.pause_collection?'paused':subscription.status,plan:supported[0].price.id===priceId('monthly')?'monthly':'annual',paid_through:iso(paidThrough),current_period_end:iso(supported[0].current_period_end),cancel_at_period_end:subscription.cancel_at_period_end,cancel_at:iso(subscription.cancel_at),failed_invoice_id:failedInvoice,first_failure_at:failureAt,observed_at:observedAt};
 const{error:applyError}=await admin.rpc('apply_premium_billing_event',{p_event:event.id,p_mode:mode,p_snapshot:snapshot});
 if(applyError)throw new Error('BILLING_DATABASE');
}
