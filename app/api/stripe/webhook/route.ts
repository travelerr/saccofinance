import {NextResponse} from 'next/server';
import type Stripe from 'stripe';
import {billingServices} from '@/lib/billing/server';
import {completeGuestCheckout} from '@/lib/billing/purchases';
import {reconcileBillingEvent} from '@/lib/billing/reconcile';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const handled=new Set(['checkout.session.completed','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','customer.subscription.paused','customer.subscription.resumed','invoice.paid','invoice.payment_failed','invoice.payment_action_required']);
export async function POST(request:Request){
 const signature=request.headers.get('stripe-signature');if(!signature)return NextResponse.json({error:'Signature required'},{status:400});
 let services:Awaited<ReturnType<typeof billingServices>>;
 try{services=await billingServices();}catch{return NextResponse.json({error:'Billing unavailable'},{status:503});}
 if(!services.secrets.STRIPE_WEBHOOK_SECRET)return NextResponse.json({error:'Webhook unavailable'},{status:503});
 const body=await request.text();if(Buffer.byteLength(body)>1048576)return NextResponse.json({error:'Payload too large'},{status:413});
 let event:Stripe.Event;
 try{event=services.stripe.webhooks.constructEvent(body,signature,services.secrets.STRIPE_WEBHOOK_SECRET);}catch{return NextResponse.json({error:'Invalid signature'},{status:400});}
 if(handled.has(event.type)){try{await reconcileBillingEvent(event);if(event.type==='checkout.session.completed')await completeGuestCheckout((event.data.object as Stripe.Checkout.Session).id);}catch{console.error('Stripe webhook processing failed; event will be retried.',event.id);return NextResponse.json({error:'Processing failed'},{status:500});}}
 return NextResponse.json({received:true},{headers:{'Cache-Control':'no-store'}});
}
