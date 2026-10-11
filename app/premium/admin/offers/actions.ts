'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {billingServices} from '@/lib/billing/server';
import {requireOffersAdmin} from './access';
export async function saveTrialOffer(form:FormData){
 const user=await requireOffersAdmin();const enabled=form.get('enabled')==='on';
 const {admin,mode}=await billingServices();
 const {data,error}=await admin.from('premium_trial_settings').update({enabled,updated_at:new Date().toISOString(),updated_by:user.id}).eq('mode',mode).select('mode').single();
 if(error||!data)throw Error('Offer could not be saved. Check the trial migration.');
 for(const path of ['/premium','/premium/join','/premium/account','/premium/admin/offers'])revalidatePath(path);
 redirect('/premium/admin/offers?saved=1');
}
