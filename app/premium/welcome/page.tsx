import {redirect} from 'next/navigation';
import type Stripe from 'stripe';
import AuthShell from '@/components/premium/auth-shell';
import PaymentPending from '@/components/premium/payment-pending';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {premiumAccess} from '@/lib/premium-access';
import {guestCheckoutBelongsTo} from '@/lib/billing/guest-session';
import {billingServices} from '@/lib/billing/server';
import {reconcileBillingEvent} from '@/lib/billing/reconcile';
import {completeGuestCheckout} from '@/lib/billing/purchases';
export const dynamic='force-dynamic';
export const metadata={title:'Welcome to Premium | Sacco Financial',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{session_id?:string}>}){
 const client=await createSupabaseServerClient();const result=client?await client.auth.getUser():null;
 if(!result?.data.user)redirect('/premium/login?next=/premium/account');
 const params=await searchParams;let invalid=false;
 if(params.session_id){
  try{
   const {stripe,mode}=await billingServices();const session=await stripe.checkout.sessions.retrieve(params.session_id);
   if(!guestCheckoutBelongsTo(session,result.data.user.id,mode))invalid=true;
   else if(session.status==='complete'&&session.payment_status==='paid'){
    // A success URL alone grants nothing: retrieve Stripe's session and paid invoice first.
    await reconcileBillingEvent({id:'checkout-return-'+session.id,type:'checkout.session.completed',livemode:session.livemode,created:Math.floor(Date.now()/1000),data:{object:session}} as unknown as Stripe.Event);
    try{await completeGuestCheckout(session.id);}catch{console.error('Premium welcome email pending.');}
   }
  }catch{console.error('Premium checkout verification pending.');}
 }
 if(invalid)return <AuthShell title="CHECK YOUR SESSION." description="This checkout belongs to another browser session. Use the welcome email to save your login and access your membership.">{null}</AuthShell>;
 const access=await premiumAccess();if(access.allowed)redirect('/premium/dashboard');
 return <AuthShell title="WELCOME TO PREMIUM." description="We’re confirming your subscription before opening the dashboard."><PaymentPending/></AuthShell>;
}
