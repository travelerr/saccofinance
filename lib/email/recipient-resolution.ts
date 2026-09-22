import 'server-only';
import type {SupabaseClient} from '@supabase/supabase-js';
import {sessionPremiumAccess} from '../premium-session-access';
import {excludeSuppressed} from './suppression';
import {researchEligible,researchPilotRecipient} from './policy';
export async function resolveResearchRecipientRecords(db:SupabaseClient){
 const emails=new Map<string,{userId:string;email:string}>();
 for(let offset=0;;offset+=100){
  const {data,error}=await db.from('research_email_preferences').select('user_id').eq('enabled',true).order('user_id').range(offset,offset+99);
  if(error)throw new Error('RECIPIENT_LOOKUP_FAILED');
  for(const row of data||[]){
   const {data:identity,error:identityError}=await db.auth.admin.getUserById(row.user_id);
   if(identityError)throw new Error('RECIPIENT_LOOKUP_FAILED');
   const access=await sessionPremiumAccess(db,row.user_id);
   if(access.unavailable)throw new Error('ACCESS_LOOKUP_FAILED');
   if(identity.user&&researchEligible(identity.user,true,access)){const email=identity.user.email!.trim().toLowerCase();if(!emails.has(email))emails.set(email,{userId:row.user_id,email});}
  }
  if((data||[]).length<100)break;
 }
 const pilot=researchPilotRecipient(process.env);
 return excludeSuppressed(db,[...emails.values()].filter(r=>!pilot||r.email===pilot));
}

export async function resolveResearchRecipients(db:SupabaseClient){return (await resolveResearchRecipientRecords(db)).map(r=>r.email);}
