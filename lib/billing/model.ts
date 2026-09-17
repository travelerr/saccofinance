export const GRACE_MS=7*24*60*60*1000;
export type BillingMode='test'|'live';
export type BillingPlan='monthly'|'annual';
export type SubscriptionRecord={stripe_subscription_id:string;mode:BillingMode;status:string;plan:BillingPlan;paid_through:string|null;current_period_end:string|null;cancel_at_period_end:boolean;cancel_at?:string|null;first_failure_at:string|null;failed_invoice_id:string|null;observed_at?:string};
export function billingMode():BillingMode{return process.env.STRIPE_MODE==='live'?'live':'test';}
export function billingEnabled(){return process.env.STRIPE_BILLING_ENABLED==='true';}
export function dateMs(value:string|null){const n=value?Date.parse(value):NaN;return Number.isFinite(n)?n:0;}
export function graceEnds(record:SubscriptionRecord){const n=dateMs(record.first_failure_at);return n?new Date(n+GRACE_MS).toISOString():null;}
export function hasPaidAccess(record:SubscriptionRecord,now=Date.now()):boolean{
 if(!dateMs(record.paid_through))return false; // No grace for a failed first payment.
 if(record.status==='active')return dateMs(paidAccessEnds(record))>now;
 if(record.status==='past_due'){const grace=dateMs(graceEnds(record));const cancel=dateMs(record.cancel_at||null);return (cancel?Math.min(grace,cancel):grace)>now;}
 return false;
}
export function blocksNewSubscription(status:string){return !['canceled','incomplete_expired'].includes(status);}

export function cancellationScheduled(record:SubscriptionRecord){return record.cancel_at_period_end||Boolean(dateMs(record.cancel_at||null));}
export function paidAccessEnds(record:SubscriptionRecord){
 const paid=dateMs(record.paid_through);const cancel=dateMs(record.cancel_at||null);
 return paid?new Date(cancel?Math.min(paid,cancel):paid).toISOString():null;
}
export function membershipStatus(record:SubscriptionRecord,now=Date.now()){
 if(record.status==='active'&&cancellationScheduled(record))return hasPaidAccess(record,now)?'Canceled — access continues':'Access ended';
 if(record.status==='canceled')return 'Ended';
 return record.status.replaceAll('_',' ');
}
