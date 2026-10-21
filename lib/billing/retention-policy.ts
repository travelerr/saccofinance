import type Stripe from 'stripe';
export const cancellationReasons = {
 too_expensive: 'Too expensive',
 unused: 'Not using it enough',
 not_enough_research: 'Not enough new research or opportunities',
 not_expected: 'Not what I expected',
 technical_issues: 'Technical or website issues',
 other: 'Other',
 prefer_not_to_say: 'Prefer not to say',
} as const;
export type CancellationReason = keyof typeof cancellationReasons;
export function cancellationInput(reason:unknown, feedback:unknown){
 if(typeof reason!=='string'||!Object.hasOwn(cancellationReasons,reason))throw Error('CANCELLATION_REASON_REQUIRED');
 if(typeof feedback!=='string'||feedback.length>1000)throw Error('CANCELLATION_FEEDBACK_INVALID');
 return {reason:reason as CancellationReason,feedback:feedback.trim()};
}
export function assertRetentionSubscription(s:Stripe.Subscription,live:boolean,prices:string[],customers:string[]){
 const customer=typeof s.customer==='string'?s.customer:s.customer.id;
 if(s.livemode!==live||!customers.includes(customer))throw Error('BILLING_OWNER');
 if(s.items.data.length!==1||s.items.data[0].quantity!==1||!prices.includes(s.items.data[0].price.id)||s.schedule||s.pause_collection)throw Error('SUBSCRIPTION_UNSUPPORTED');
 if(!['active','trialing','past_due'].includes(s.status))throw Error('SUBSCRIPTION_ENDED');
}
export function stripeCancellationEnd(s:Stripe.Subscription){
 return s.cancel_at || (s.cancel_at_period_end ? s.items.data[0]?.current_period_end : null) || null;
}
export function reminderDue(end:number|null,now=Date.now()){
 return Boolean(end&&end*1000>now&&end*1000-now<=3*86400000);
}
