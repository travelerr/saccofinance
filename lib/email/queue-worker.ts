import 'server-only';
import {createHash} from 'node:crypto';
import {emailDatabase} from './database';
import {emailSecrets} from './secrets';
import {researchSendMode} from './policy';
import {resolveResearchRecipientRecords,type ResearchRecipient} from './recipient-resolution';
import {createResearchUnsubscribeBatch} from './unsubscribe';
import {personalizeEmailSnapshot,validateEmailSnapshot} from './snapshot';
import {resendPersonalizedWithTransport} from './resend-client';
import {executeEmailJob,type EmailJob} from './queue-runner';
export const audienceSignature=(rows:ResearchRecipient[])=>JSON.stringify([...rows].sort((a,b)=>a.userId.localeCompare(b.userId)).map(r=>[r.userId,r.email]));
export async function processNextResearchEmail(){
 const mode=researchSendMode({...process.env,...await emailSecrets()});
 const db=await emailDatabase();
 const {data,error}=await db.rpc('claim_research_email',{p_mode:mode});if(error)throw Error('QUEUE_UNAVAILABLE');
 const job=data?.[0] as (EmailJob&{event_snapshot:{key:string;subject:string;delivery?:unknown};recipients:ResearchRecipient[];origin:string;sender:string})|undefined;if(!job)return null;
 const result=await executeEmailJob(job,{
  transition:async(action,ids=[],code)=>{const {data,error}=await db.rpc('transition_research_email',{p_id:job.id,p_lease:job.lease_token,p_action:action,p_ids:ids,p_error:code||null});if(error)throw Error('QUEUE_UNAVAILABLE');return data===true;},
  prepare:async()=>{
   const snapshot=job.event_snapshot.delivery;
   validateEmailSnapshot(snapshot,job.origin);
   if(job.event_snapshot.key!==job.event_key||snapshot.subject!==job.event_snapshot.subject||job.origin!==(process.env.AUTH_SITE_URL||'http://localhost:3082')||job.sender!==(process.env.RESEARCH_EMAIL_FROM||''))throw Error('PREVIEW_CHANGED');
   const recipients=await resolveResearchRecipientRecords(db);
   if(audienceSignature(recipients)!==audienceSignature(job.recipients))throw Error('PREVIEW_CHANGED');
   const links=await createResearchUnsubscribeBatch(db,recipients.map(r=>r.userId),job.origin);
   const messages=recipients.map((r,i)=>({to:r.email,email:personalizeEmailSnapshot(snapshot,job.origin,links[i])}));
   const secrets=await emailSecrets();if(researchSendMode({...process.env,...secrets})!==job.mode)throw Error('PREVIEW_CHANGED');
   const finalRecipients=await resolveResearchRecipientRecords(db);
   if(audienceSignature(finalRecipients)!==audienceSignature(recipients))throw Error('PREVIEW_CHANGED');
   const {data:limits,error}=await db.from('research_email_limits').select('paused').eq('singleton',true).single();
   if(error||!limits)throw Error('LIMIT_LOOKUP_FAILED');if(limits.paused)throw Error('EMAIL_PAUSED');
   return {messages,secrets};
  },
  deliver:({messages,secrets})=>resendPersonalizedWithTransport({from:job.sender,apiKey:secrets.RESEND_API_KEY!,key:createHash('sha256').update('research-live:'+job.event_key).digest('hex'),messages},fetch)
 });
 return {id:job.id,status:result};
}
