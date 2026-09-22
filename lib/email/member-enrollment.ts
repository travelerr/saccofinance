import 'server-only';
import {createHash} from 'node:crypto';
import type {SupabaseClient} from '@supabase/supabase-js';
import {sessionPremiumAccess} from '../premium-session-access';
import {researchEligible} from './policy';
import {excludeSuppressed} from './suppression';
export async function enrollmentCandidates(db:SupabaseClient){
 const candidates:{userId:string;email:string}[]=[];
 for(let page=1;;page++){
  const {data,error}=await db.auth.admin.listUsers({page,perPage:100});
  if(error)throw new Error('ENROLLMENT_LOOKUP_FAILED');
  for(const user of data.users){
   if(!researchEligible(user,true,{allowed:true,unavailable:false}))continue;
   const {data:preference,error:preferenceError}=await db.from('research_email_preferences').select('user_id').eq('user_id',user.id).maybeSingle();
   if(preferenceError)throw new Error('ENROLLMENT_LOOKUP_FAILED');
   if(preference)continue; // Includes saved OFF choices; never overwrite them.
   const access=await sessionPremiumAccess(db,user.id);
   if(access.unavailable)throw new Error('ACCESS_LOOKUP_FAILED');
   if(access.allowed)candidates.push({userId:user.id,email:user.email!.trim().toLowerCase()});
  }
  if(data.users.length<100)break;
 }
 return (await excludeSuppressed(db,candidates)).sort((a,b)=>a.userId.localeCompare(b.userId));
}
export const enrollmentFingerprint=(rows:{userId:string;email:string}[])=>createHash('sha256').update(JSON.stringify(rows)).digest('hex');
export async function enrollMissingPreferences(db:SupabaseClient,expectedFingerprint:string){
 const rows=await enrollmentCandidates(db);
 if(enrollmentFingerprint(rows)!==expectedFingerprint)throw new Error('ENROLLMENT_PREVIEW_CHANGED');
 let count=0;
 for(let offset=0;offset<rows.length;offset+=100){
  const {data,error}=await db.from('research_email_preferences').upsert(rows.slice(offset,offset+100).map(row=>({user_id:row.userId,enabled:true,updated_at:new Date().toISOString()})),{onConflict:'user_id',ignoreDuplicates:true}).select('user_id');
  // ON CONFLICT DO NOTHING preserves an OFF preference saved since the preview.
  if(error)throw new Error('ENROLLMENT_SAVE_FAILED');
  count+=(data||[]).length;
 }
 return count;
}
