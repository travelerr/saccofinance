import 'server-only';
import {createHash,randomBytes} from 'node:crypto';
import type {SupabaseClient} from '@supabase/supabase-js';
export const unsubscribeTokenHash=(token:string)=>{
 if(!/^[a-f0-9]{64}$/.test(token))throw new Error('INVALID_UNSUBSCRIBE_TOKEN');
 return createHash('sha256').update(token).digest('hex');
};
export async function createResearchUnsubscribe(db:SupabaseClient,userId:string,origin:string){
 const base=new URL(origin);
 if(base.username||base.password||!(base.protocol==='https:'||(base.protocol==='http:'&&['localhost','127.0.0.1'].includes(base.hostname))))throw new Error('INVALID_ORIGIN');
 const token=randomBytes(32).toString('hex');
 const {error}=await db.from('research_unsubscribe_tokens').insert({token_hash:unsubscribeTokenHash(token),user_id:userId});
 if(error)throw new Error('UNSUBSCRIBE_UNAVAILABLE');
 return new URL('/email/unsubscribe?token='+token,base.origin).href;
}
