'use server';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {assertResearchInfrastructure} from '@/lib/email/policy';
export type PreferenceResult={status:'idle'|'saved'|'error';message:string};
export async function saveResearchPreference(_previous:PreferenceResult,form:FormData):Promise<PreferenceResult>{
 try{
  assertResearchInfrastructure(process.env);
  const client=await createSupabaseServerClient();const result=client?await client.auth.getUser():null;
  const user=result?.data.user;
  if(!client||result?.error||!user||user.is_anonymous||!user.email_confirmed_at)return {status:'error',message:'Please sign in again before saving your email preference.'};
  const enabled=form.get('enabled')==='on';
  const {error}=await client.from('research_email_preferences').upsert({user_id:user.id,enabled,updated_at:new Date().toISOString()});
  if(error)return {status:'error',message:'We couldn’t save your preference. Please try again.'};
  return {status:'saved',message:`Email preference saved. Research notifications are ${enabled?'ON':'OFF'}.`};
 }catch{
  return {status:'error',message:'Email preferences are temporarily unavailable. Please try again.'};
 }
}
