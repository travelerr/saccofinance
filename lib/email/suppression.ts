import 'server-only';
import {createHash} from 'node:crypto';
import type {SupabaseClient} from '@supabase/supabase-js';
export function researchAddressHash(email:string){
 const normalized=email.trim().toLowerCase();
 if(!/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(normalized))throw new Error('INVALID_EMAIL');
 return createHash('sha256').update(normalized).digest('hex');
}
export async function excludeSuppressed<T extends {email:string}>(db:SupabaseClient,recipients:T[]):Promise<T[]>{
 const blocked=new Set<string>();
 for(let i=0;i<recipients.length;i+=100){
  const hashes=recipients.slice(i,i+100).map(r=>researchAddressHash(r.email));
  const {data,error}=await db.from('research_email_suppressions').select('email_hash').in('email_hash',hashes);
  if(error)throw new Error('SUPPRESSION_LOOKUP_FAILED');
  for(const row of data||[])blocked.add(row.email_hash);
 }
 return recipients.filter(r=>!blocked.has(researchAddressHash(r.email)));
}
