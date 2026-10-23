'use server';
import {requirePremium} from '@/lib/premium-access';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {revalidatePath} from 'next/cache';
export async function completeStartHereStep(step:string){
 const user=await requirePremium();
 if(!['sector-gauge','opportunity','outlook'].includes(step))return {saved:false};
 const client=await createSupabaseServerClient();
 if(!client)return {saved:false};
 const {error}=await client.from('premium_start_here_progress').upsert({user_id:user.id,step},{onConflict:'user_id,step',ignoreDuplicates:true});
 if(error)return {saved:false};
 revalidatePath('/premium/dashboard');
 return {saved:true};
}
