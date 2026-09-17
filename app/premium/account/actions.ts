'use server';
import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {premiumAccess} from '@/lib/premium-access';
import {checkoutUrl,portalUrl} from '@/lib/billing/checkout';
import type {BillingPlan} from '@/lib/billing/model';
async function member(){const client=await createSupabaseServerClient();const result=client?await client.auth.getUser():null;if(!result?.data.user)redirect('/premium/login?next=/premium/account');return result.data.user;}
export async function manageSubscription(form:FormData){const user=await member();let url:string;try{url=await portalUrl(user.id,String(form.get('subscription')||'')||undefined);}catch{redirect('/premium/account?error=billing');}redirect(url);}
export async function subscribe(form:FormData){
 const user=await member();const plan=String(form.get('plan')) as BillingPlan;
 if(!['monthly','annual'].includes(plan))redirect('/premium/account?error=billing');
 const access=await premiumAccess();if(access.manualAllowed)redirect('/premium/account');
 let url:string;
 try{url=await checkoutUrl(user,plan);}catch(error){redirect('/premium/account?error='+(error instanceof Error&&error.message==='CHECKOUT_PENDING'?'pending':'billing'));}
 redirect(url);
}
