'use server';
import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {premiumAccess} from '@/lib/premium-access';
import {billingEnabled,type BillingPlan} from '@/lib/billing/model';
import {billingServices,checkedPrice} from '@/lib/billing/server';
import {checkoutUrl} from '@/lib/billing/checkout';
export async function beginCheckout(form:FormData){
 if(!billingEnabled())redirect('/premium/login');
 const plan=String(form.get('plan')) as BillingPlan;
 if(!['monthly','annual'].includes(plan)||!form.get('terms'))redirect('/premium/join?error=details');
 const client=await createSupabaseServerClient();if(!client)redirect('/premium/join?error=billing');
 const access=await premiumAccess();if(access.allowed)redirect('/premium/dashboard');
 let url:string;
 try{
  const {stripe,admin}=await billingServices();await checkedPrice(stripe,plan);
  // Fail before creating a temporary login if the new migration isn't installed.
  const {error}=await admin.from('billing_purchase_claims').select('id').limit(0);if(error)throw new Error('BILLING_DATABASE');
  let user=access.user;
  if(!user){const result=await client.auth.signInAnonymously();if(result.error||!result.data.user)throw new Error('GUEST_AUTH_UNAVAILABLE');user=result.data.user;}
  url=await checkoutUrl(user,plan);
 }catch(error){const reason=error instanceof Error?error.message:'';if(reason==='GUEST_CLAIMED')redirect('/premium/login?next=/premium/account');redirect('/premium/join?error='+(reason==='GUEST_AUTH_UNAVAILABLE'?'guest':reason==='CHECKOUT_PENDING'?'pending':'billing'));}
 redirect(url);
}
