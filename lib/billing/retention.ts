import {localDevelopment} from '../local-development';
import 'server-only';
import {randomUUID} from 'node:crypto';
import {billingServices,priceId} from './server';
import {ownedBillingCustomers} from './ownership';
import {assertRetentionSubscription,cancellationInput,cancellationReasons,stripeCancellationEnd} from './retention-policy';
/** Authorize from our ownership ledger AND Stripe; never trust a submitted customer ID. */
export async function changeRenewal(userId:string,id:string,action:'cancel'|'keep',reason?:unknown,feedback?:unknown){
 const input=action==='cancel'?cancellationInput(reason,feedback):null;
 const {stripe,admin,mode}=await billingServices();
 const {data:row,error}=await admin.from('billing_subscriptions').select('stripe_subscription_id').eq('stripe_subscription_id',id).eq('access_owner_id',userId).eq('mode',mode).maybeSingle();
 if(error||!row)throw Error('BILLING_OWNER');
 if(localDevelopment()&&id.startsWith('sub_local_'))throw Error('LOCAL_BILLING_FIXTURE');
 const current=await stripe.subscriptions.retrieve(id);
 assertRetentionSubscription(current,mode==='live',[priceId('monthly'),priceId('annual')],await ownedBillingCustomers(userId));
 const end=stripeCancellationEnd(current);
 if(action==='cancel'&&end)return; // Repeated cancellation must not extend the existing end date.
 if(action==='keep'&&!end)return;
 if(action==='keep'&&(!end||end*1000<=Date.now()||!['active','trialing'].includes(current.status)))throw Error('SUBSCRIPTION_ENDED');
 const requestId=randomUUID();
 const {error:saveError}=await admin.from('billing_retention_events').insert({id:requestId,user_id:userId,mode,subscription_id:id,action,reason:input?.reason||null,feedback:input?.feedback||null,subscription_started_at:new Date(current.start_date*1000).toISOString(),status:'requested'});
 if(saveError)throw Error('BILLING_DATABASE');
 // Feedback remains in our audit history even after Stripe clears cancellation_details on resumption.
 const updated=await stripe.subscriptions.update(id,action==='cancel'?{
  cancel_at_period_end:true,
  cancellation_details:{feedback:input!.reason==='too_expensive'?'too_expensive':input!.reason==='unused'?'unused':'other',comment:[cancellationReasons[input!.reason],input!.feedback].filter(Boolean).join(': ')},
 }:{...(current.cancel_at_period_end?{cancel_at_period_end:false}:{cancel_at:''}),proration_behavior:'none'}, {idempotencyKey:'retention-'+requestId});
 const expected=action==='cancel'?Boolean(stripeCancellationEnd(updated)):!stripeCancellationEnd(updated);
 if(!expected)throw Error('BILLING_UPDATE_UNCONFIRMED');
 const {error:finishError}=await admin.from('billing_retention_events').update({status:'confirmed',effective_end:stripeCancellationEnd(updated)?new Date(stripeCancellationEnd(updated)!*1000).toISOString():null}).eq('id',requestId);
 if(finishError)throw Error('BILLING_DATABASE');
 // Account page and existing webhooks re-fetch Stripe and reconcile access through the established path.
}
