import 'server-only';
import {createHash} from 'node:crypto';
import {requireResearchAdmin} from './admin';
import {emailDatabase} from './database';
import {researchEvents} from './events';
import {weeklyOutlooks,opportunities,opportunityUpdates} from '../premium-opportunities';
import {renderResearchEmail} from './templates';
import {resolveResearchRecipients,resolveResearchRecipientRecords} from './recipient-resolution';
import {createResearchUnsubscribe} from './unsubscribe';
import {executeNotification} from './notification-run';
import {emailSecrets} from './secrets';
import {researchSendMode} from './policy';
import {deliverResearchBatch,resendPersonalizedWithTransport} from './resend-client';
export const availableResearchEvents=()=>researchEvents(weeklyOutlooks,opportunities,opportunityUpdates);
export async function notificationPreview(key:string){
 await requireResearchAdmin();
 const event=availableResearchEvents().find(e=>e.key===key);if(!event)throw new Error('PUBLISHED_EVENT_REQUIRED');
 const mode=researchSendMode({...process.env,...await emailSecrets()});
 const db=await emailDatabase();
 const recipients=await resolveResearchRecipients(db);
 const {data:log,error}=await db.from('research_notification_log').select('status,created_at,recipient_count').eq('event_key',key).eq('mode',mode).maybeSingle();
 if(error)throw new Error('LOG_UNAVAILABLE');
 const email=renderResearchEmail(event,process.env.AUTH_SITE_URL||'http://127.0.0.1:3082');
 const fingerprint=createHash('sha256').update(JSON.stringify({event,email,mode,recipients:[...recipients].sort()})).digest('hex');
 return {event,email,mode,count:recipients.length,log,fingerprint};
}
export async function runResearchNotification(key:string,fingerprint:string,materialConfirmed:boolean){
 const actor=await requireResearchAdmin();
 const preview=await notificationPreview(key);
 if(preview.fingerprint!==fingerprint)throw new Error('PREVIEW_CHANGED');
 if(preview.event.type==='OPPORTUNITY_MATERIAL_UPDATE'&&!materialConfirmed)throw new Error('MATERIAL_CONFIRMATION_REQUIRED');
 const mode=preview.mode;
 const db=await emailDatabase();const recipients=await resolveResearchRecipients(db);
 if(createHash('sha256').update(JSON.stringify({event:preview.event,email:preview.email,mode,recipients:[...recipients].sort()})).digest('hex')!==fingerprint)throw new Error('PREVIEW_CHANGED');
 return executeNotification(preview.event,recipients,{
  async reserve(event,count){
   const {data,error}=await db.rpc('reserve_research_notification',{p_event:event.key,p_type:event.type,p_entity:event.entityId,p_update:event.updateId??null,p_subject:event.subject,p_count:count,p_mode:mode,p_actor:actor.id});
   if(error){const code=['EMAIL_PAUSED','DAILY_LIMIT','MONTHLY_LIMIT','RATE_LIMIT','RECIPIENT_LIMIT'].find(code=>error.message.includes(code));throw new Error(code||'LOG_UNAVAILABLE');}
   return data===true;
  },
  async finish(key,status,ids,errorCode){const {error}=await db.from('research_notification_log').update({status,provider_ids:ids,error_code:errorCode,completed_at:new Date().toISOString()}).eq('event_key',key).eq('mode',mode);if(error)throw new Error('LOG_UNAVAILABLE');}
 },async()=>{
  // Prepare unique opt-out links, then recheck eligibility and the pause switch before dispatch.
  const current=await resolveResearchRecipientRecords(db);
  if(JSON.stringify(current.map(r=>r.email).sort())!==JSON.stringify([...recipients].sort()))throw new Error('PREVIEW_CHANGED');
  const messages=[];
  for(const recipient of current){
   const unsubscribe=await createResearchUnsubscribe(db,recipient.userId,process.env.AUTH_SITE_URL||'http://localhost:3082');
   messages.push({to:recipient.email,email:renderResearchEmail(preview.event,process.env.AUTH_SITE_URL||'http://localhost:3082',unsubscribe)});
  }
  if(researchSendMode({...process.env,...await emailSecrets()})!==mode)throw new Error('PREVIEW_CHANGED');
  const finalRecipients=await resolveResearchRecipients(db);
  if(JSON.stringify([...finalRecipients].sort())!==JSON.stringify([...recipients].sort()))throw new Error('PREVIEW_CHANGED');
  const {data:limits,error:limitsError}=await db.from('research_email_limits').select('paused').eq('singleton',true).single();
  if(limitsError||!limits||limits.paused)throw new Error('EMAIL_PAUSED');
  if(mode==='live'){
   const secrets=await emailSecrets();
   researchSendMode({...process.env,...secrets});
   const providerIds=await resendPersonalizedWithTransport({from:process.env.RESEARCH_EMAIL_FROM!,apiKey:secrets.RESEND_API_KEY!,key:createHash('sha256').update('research-live:'+preview.event.key).digest('hex'),messages},fetch);
   return {status:'sent',providerIds};
  }
  return deliverResearchBatch({mode:'dry-run',emails:recipients,email:preview.email,key:preview.event.key});
 });
}
