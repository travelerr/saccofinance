'use server';
import {redirect} from 'next/navigation';
import {saveSignupResearchPreference} from '@/lib/email/signup-preference';
import {premiumAccess} from '@/lib/premium-access';
import {purchaseForBrowser,sendPurchaseWelcome} from '@/lib/billing/purchases';
import {billingServices,authOrigin} from '@/lib/billing/server';
import {createSupabaseServerClient} from '@/lib/supabase/server';
export async function resendWelcome(){
 const access=await premiumAccess();if(!access.user||!access.allowed)redirect('/premium/login');
 if(!access.user.is_anonymous)redirect('/premium/set-password');
 try{
  const purchase=await purchaseForBrowser(access.user.id);if(!purchase)throw new Error('NO_PURCHASE');
  const {admin}=await billingServices();
  // Avoid repeatedly invalidating single-use links or sending duplicate messages.
  if(purchase.welcome_sent_at&&Date.now()-Date.parse(purchase.welcome_sent_at)<120000)throw new Error('WELCOME_COOLDOWN');
  const {error}=await admin.from('billing_purchase_claims').update({welcome_sent_at:null}).eq('id',purchase.id).is('claimed_user_id',null);if(error)throw new Error('BILLING_DATABASE');
  await sendPurchaseWelcome({...purchase,welcome_sent_at:null});
 }catch(error){redirect('/premium/account/setup?'+(error instanceof Error&&error.message==='WELCOME_COOLDOWN'?'sent=1':'error=email'));}
 redirect('/premium/account/setup?sent=1');
}
export async function savePurchaseLogin(form:FormData){
 const purchaseId=String(form.get('purchase')||'');const token=String(form.get('token_hash')||'');
 if(!/^[0-9a-f-]{36}$/i.test(purchaseId)||!token||token.length>512)redirect('/premium/login?error=expired');
 const client=await createSupabaseServerClient();if(!client)redirect('/premium/login?error=unavailable');
 const {data,error}=await client.auth.verifyOtp({token_hash:token,type:'email'});
 if(error||!data.user)redirect('/premium/login?error=expired');
 try{
  const {claimPurchase}=await import('@/lib/billing/purchases');await claimPurchase(purchaseId,data.user.id);
 }catch{redirect('/premium/account/setup?error=claim');}
 let preferenceFailed=false;
 try{await saveSignupResearchPreference(client,data.user,form.get('research_notifications')==='on',form.get('research_offered')==='1');}catch{preferenceFailed=true;}
 redirect(new URL('/premium/set-password'+(preferenceFailed?'?research=failed':''),authOrigin()).toString());
}

export async function changeWelcomeEmail(form:FormData){
 const access=await premiumAccess();if(!access.user?.is_anonymous||!access.allowed)redirect('/premium/login');
 const email=String(form.get('email')||'').trim().toLowerCase();
 if(email.length>254||!/^\S+@\S+\.\S+$/.test(email))redirect('/premium/account/setup?error=email');
 try{
  const purchase=await purchaseForBrowser(access.user.id);if(!purchase)throw new Error('NO_PURCHASE');
  const {admin}=await billingServices();
  const {data,error}=await admin.from('billing_purchase_claims').update({email,welcome_sent_at:null}).eq('id',purchase.id).eq('original_user_id',access.user.id).is('claimed_user_id',null).select('id');
  if(error||!data?.length)throw new Error('CLAIM_UNAVAILABLE');
  await sendPurchaseWelcome({...purchase,email,welcome_sent_at:null});
 }catch{redirect('/premium/account/setup?error=email');}
 redirect('/premium/account/setup?sent=1');
}
