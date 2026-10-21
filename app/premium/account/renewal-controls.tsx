import type {SubscriptionRecord} from '@/lib/billing/model';
import {cancellationScheduled,hasPaidAccess} from '@/lib/billing/model';
import {cancellationReasons} from '@/lib/billing/retention-policy';
import {cancelSubscription,keepSubscription} from './actions';
import Submit from '@/components/premium/submit';
export default function RenewalControls({subscription:s}:{subscription:SubscriptionRecord}){
 if(!['active','trialing','past_due'].includes(s.status))return null;
 const label=s.plan==='annual'?'annual':'monthly';
 if(cancellationScheduled(s))return hasPaidAccess(s)&&['active','trialing'].includes(s.status)?<section className="renewal-controls" aria-label={`Keep ${label} subscription`}>
  <h3>Want to keep your subscription?</h3><p>Your {label} subscription is scheduled to end. You can turn renewal back on before access ends.</p>
  <form action={keepSubscription} className="premium-auth-form"><input type="hidden" name="subscription" value={s.stripe_subscription_id}/>
   <label className="renewal-confirm"><input type="checkbox" name="confirm" value="yes" required/> Keep my current plan and resume automatic renewal at its existing price on the next billing date. This does not purchase a new subscription.</label>
   <Submit>Keep my subscription</Submit>
  </form></section>:null;
 return <details className="renewal-controls"><summary>Cancel {label} subscription</summary><p>Cancellation stops future renewals. Your existing access continues until its scheduled end. Any outstanding balance is still due.</p>
  <form action={cancelSubscription} className="premium-auth-form"><input type="hidden" name="subscription" value={s.stripe_subscription_id}/>
   <fieldset><legend>What made you decide to cancel? (Required)</legend>{Object.entries(cancellationReasons).map(([value,label])=><label key={value} className="renewal-choice"><input type="radio" name="reason" value={value} required/>{label}</label>)}</fieldset>
   <label>Anything else you’d like to share? (Optional)<textarea name="feedback" maxLength={1000} rows={4}/></label>
   <p>No feedback text is required, including when you choose “Other.”</p><Submit>Confirm cancellation</Submit>
  </form></details>;
}
