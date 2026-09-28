import {NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {analyticsMode,MEASUREMENT_ID} from '@/lib/analytics/policy';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {isResearchAdmin} from '@/lib/email/policy';
export const dynamic='force-dynamic';
export async function GET(){
 const respond=(value:object)=>NextResponse.json(value,{headers:{'Cache-Control':'private, no-store','Vary':'Cookie'}});
 const mode=analyticsMode(process.env);
 if(mode==='disabled')return respond({mode});
 if(mode==='preview')return respond({mode,userId:null});
 try{
  const client=await createSupabaseServerClient();if(!client)return respond({mode:'disabled'});
  const {data:{user},error}=await client.auth.getUser();
  if(error&&error.name!=='AuthSessionMissingError')return respond({mode:'disabled'});
  if(isResearchAdmin(user,process.env.RESEARCH_ADMIN_USER_IDS||''))return respond({mode:'disabled'});
  return respond({mode,measurementId:MEASUREMENT_ID,userId:user&&!user.is_anonymous?createHash('sha256').update('sacco-analytics:'+user.id).digest('hex'):null});
 }catch{return respond({mode:'disabled'});}
}
