import 'server-only';
import {createHash} from 'node:crypto';
import {requireResearchAdmin} from './admin';
import {emailDatabase} from './database';
import {researchEvents} from './events';
import {weeklyOutlooks,opportunities,opportunityUpdates} from '../premium-opportunities';
import {renderResearchEmail} from './templates';
import {resolveResearchRecipientRecords} from './recipient-resolution';
import {emailSecrets} from './secrets';
import {researchSendMode} from './policy';
export const availableResearchEvents=()=>researchEvents(weeklyOutlooks,opportunities,opportunityUpdates);
export function notificationTemplate(key:string){
 const event=availableResearchEvents().find(e=>e.key===key);if(!event)throw new Error('PUBLISHED_EVENT_REQUIRED');
 return {event,email:renderResearchEmail(event,process.env.AUTH_SITE_URL||'http://localhost:3082')};
}
export async function notificationPreview(key:string){
 await requireResearchAdmin();
 const {event,email}=notificationTemplate(key);
 const mode=researchSendMode({...process.env,...await emailSecrets()});const db=await emailDatabase();
 const [records,logResult,jobResult,limitsResult]=await Promise.all([
  resolveResearchRecipientRecords(db),
  db.from('research_notification_log').select('status,created_at,recipient_count,error_code').eq('event_key',key).eq('mode',mode).maybeSingle(),
  db.from('research_email_jobs').select('status,attempts,prepared_count,updated_at,lease_until,error_code').eq('event_key',key).eq('mode',mode).maybeSingle(),
  db.from('research_email_limits').select('daily_limit,monthly_limit,paused').eq('singleton',true).single()
 ]);
 if(logResult.error||jobResult.error||limitsResult.error)throw new Error('LOG_UNAVAILABLE');
 const fingerprint=createHash('sha256').update(JSON.stringify({event,email,mode,recipients:records.map(r=>[r.userId,r.email]).sort((a,b)=>a[0].localeCompare(b[0]))})).digest('hex');
 return {event,email,mode,count:records.length,records,log:logResult.data,job:jobResult.data,limits:limitsResult.data,fingerprint};
}
export async function runResearchNotification(key:string,fingerprint:string,materialConfirmed:boolean){
 const actor=await requireResearchAdmin();const preview=await notificationPreview(key);
 if(preview.fingerprint!==fingerprint)throw new Error('PREVIEW_CHANGED');
 if(preview.event.type==='OPPORTUNITY_MATERIAL_UPDATE'&&!materialConfirmed)throw new Error('MATERIAL_CONFIRMATION_REQUIRED');
 if(preview.count===0)throw Error('NO_RECIPIENTS');if(preview.count>100)throw Error('RECIPIENT_LIMIT');
 const db=await emailDatabase();
 const {data,error}=await db.rpc('enqueue_research_email',{p_event:preview.event,p_recipients:preview.records,p_mode:preview.mode,p_actor:actor.id,p_origin:process.env.AUTH_SITE_URL||'http://localhost:3082',p_sender:process.env.RESEARCH_EMAIL_FROM||''});
 if(error){const code=['EMAIL_PAUSED','DAILY_LIMIT','MONTHLY_LIMIT','RATE_LIMIT','RECIPIENT_LIMIT'].find(code=>error.message.includes(code));throw Error(code||'QUEUE_UNAVAILABLE');}
 if(data!==true)throw Error('ALREADY_RECORDED');return 'queued';
}
