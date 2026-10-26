'use server';
import {recordSampleCheckout} from '@/lib/sample/attribution';
import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {premiumAccess} from '@/lib/premium-access';
import {billingEnabled,type BillingPlan} from '@/lib/billing/model';
import {billingServices,checkedPrice} from '@/lib/billing/server';
import {checkoutUrl} from '@/lib/billing/checkout';
export async function beginCheckout(form:FormData){return runCheckout(form,false);}
export async function beginDirectCheckout(form:FormData){return runCheckout(form,true);}
async function runCheckout(form:FormData,direct:boolean){
 if(!billingEnabled())redirect('/premium/login');
 const plan=String(form.get('plan')) as BillingPlan;
 if(!['monthly','annual'].includes(plan)||(!direct&&!form.get('terms')))redirect('/premium/join?error=details');
 const client=await createSupabaseServerClient();if(!client)redirect('/premium/join?error=billing');
 const access=await premiumAccess();if(access.allowed)redirect('/premium/dashboard');
 let url:string;
 try{
  const {stripe,admin}=await billingServices();await checkedPrice(stripe,plan);
  // Fail before creating a temporary login if the new migration isn't installed.
  const {error}=await admin.from('billing_purchase_claims').select('id').limit(0);if(error)throw new Error('BILLING_DATABASE');
  let user=access.user;
  if(!user){const result=await client.auth.signInAnonymously();if(result.error||!result.data.user)throw new Error('GUEST_AUTH_UNAVAILABLE');user=result.data.user;}
  url=await checkoutUrl(user,plan,String(form.get('email')||''),direct);
 }catch(error){const reason=error instanceof Error?error.message:'';if(reason==='CHECKOUT_LEGACY')redirect('/premium/join?plan='+plan);if(reason==='GUEST_CLAIMED')redirect('/premium/login?next=/premium/account');redirect('/premium/join?error='+(reason==='GUEST_AUTH_UNAVAILABLE'?'guest':reason==='TRIAL_UNAVAILABLE'?'trial':reason==='CHECKOUT_PENDING'?'pending':'billing'));}
 if(url.startsWith('https://checkout.stripe.com/')){try{await recordSampleCheckout();}catch{/* Optional attribution cannot interrupt checkout. */}}
 redirect(url);
}
