import type Stripe from 'stripe';
export function objectId(value:string|{id:string}|null|undefined){return typeof value==='string'?value:value?.id||null;}
export function invoiceSubscriptionId(invoice:Stripe.Invoice){return objectId(invoice.parent?.subscription_details?.subscription||(invoice as unknown as {subscription?:string}).subscription);}
export function linePaidPeriod(line:Stripe.InvoiceLineItem,subscriptionId:string,priceId:string):number|null{
 const subscription=objectId(line.parent?.subscription_item_details?.subscription||line.parent?.invoice_item_details?.subscription||line.subscription);
 if(subscription!==subscriptionId||line.pricing?.price_details?.price!==priceId||line.amount<0||!Number.isFinite(line.period.end))return null;
 return line.period.end;
}
