import type Stripe from 'stripe';
import type {BillingMode} from './model';
export function guestCheckoutBelongsTo(session:Stripe.Checkout.Session,userId:string,mode:BillingMode){
 return Boolean(userId&&session.mode==='subscription'&&session.livemode===(mode==='live')&&session.metadata?.guest_checkout==='true'&&session.metadata.sacco_user_id===userId&&session.client_reference_id===userId);
}
export function completedGuestCheckout(session:Stripe.Checkout.Session,mode:BillingMode){
 return guestCheckoutBelongsTo(session,session.metadata?.sacco_user_id||'',mode)&&session.status==='complete'&&(session.payment_status==='paid'||(session.payment_status==='no_payment_required'&&session.metadata?.sacco_trial_days==='30'))&&Boolean(session.customer&&session.subscription);
}
