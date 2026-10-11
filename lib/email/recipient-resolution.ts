import 'server-only';
import type {SupabaseClient} from '@supabase/supabase-js';
import {hasPremiumAccess} from '../premium-membership';
import {billingEnabled,billingMode,hasPaidAccess} from '../billing/model';
import {excludeSuppressed} from './suppression';
import {researchEligible,researchPilotRecipient} from './policy';
import {mapLimited} from './concurrency';
export type ResearchRecipient={userId:string;email:string};
export async function resolveResearchRecipientRecords(db:SupabaseClient){
 const emails=new Map<string,ResearchRecipient>();
 for(let offset=0;;offset+=100){
  const {data,error}=await db.from('research_email_preferences').select('user_id').eq('enabled',true).order('user_id').range(offset,offset+99);
  if(error)throw new Error('RECIPIENT_LOOKUP_FAILED');
  const ids=(data||[]).map(r=>r.user_id);if(!ids.length)break;
  const [grants,subscriptions]=await Promise.all([
   db.from('premium_memberships').select('user_id,enabled,access_expires_at,access_source').in('user_id',ids),
   billingEnabled()?db.from('billing_subscriptions').select('*').in('access_owner_id',ids).eq('mode',billingMode()):Promise.resolve({data:[],error:null})
  ]);
  if(grants.error||subscriptions.error)throw new Error('ACCESS_LOOKUP_FAILED');
  const rows=await mapLimited(ids,6,async userId=>{
   const {data:identity,error:identityError}=await db.auth.admin.getUserById(userId);
   if(identityError)throw new Error('RECIPIENT_LOOKUP_FAILED');
   const grant=grants.data?.find(g=>g.user_id===userId);
   const allowed=Boolean(grant?.access_source==='manual'&&hasPremiumAccess(grant))||Boolean(subscriptions.data?.some(s=>s.access_owner_id===userId&&hasPaidAccess(s)));
   return identity.user&&researchEligible(identity.user,true,{allowed,unavailable:false})?{userId,email:identity.user.email!.trim().toLowerCase()}:null;
  });
  for(const row of rows)if(row&&!emails.has(row.email))emails.set(row.email,row);
  if(ids.length<100)break;
 }
 const pilot=researchPilotRecipient(process.env);
 return excludeSuppressed(db,[...emails.values()].filter(r=>!pilot||r.email===pilot));
}
export async function resolveResearchRecipients(db:SupabaseClient){return (await resolveResearchRecipientRecords(db)).map(r=>r.email);}
