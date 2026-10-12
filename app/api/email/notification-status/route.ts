import {aggregateEmailJobs} from '@/lib/email/queue-progress';
import {requireResearchAdmin} from '@/lib/email/admin';
import {emailDatabase} from '@/lib/email/database';
import {researchSendMode} from '@/lib/email/policy';
import {emailSecrets} from '@/lib/email/secrets';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 try{await requireResearchAdmin();}catch{return new Response(null,{status:404});}
 try{
  const key=new URL(request.url).searchParams.get('event');if(!key||key.length>250)return new Response(null,{status:400});
  const db=await emailDatabase(),mode=researchSendMode({...process.env,...await emailSecrets()});
  const [job,log]=await Promise.all([db.from('research_email_jobs').select('status,attempts,prepared_count,updated_at,lease_until,error_code').eq('event_key',key).eq('mode',mode).order('batch_index'),db.from('research_notification_log').select('status,created_at,recipient_count,error_code').eq('event_key',key).eq('mode',mode).maybeSingle()]);
  if(job.error||log.error)throw Error();return Response.json({job:aggregateEmailJobs(job.data||[]),log:log.data},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Status unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
