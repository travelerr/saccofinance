import 'server-only';
import {randomBytes,createHash} from 'node:crypto';
import {billingServices,priceId,authOrigin} from '../billing/server';
import {emailSecrets} from '../email/secrets';
import {researchSendMode,researchPilotRecipient} from '../email/policy';
import {excludeSuppressed} from '../email/suppression';
import {deliverLocalInbox,localInboxEnabled} from '../email/local-inbox';
import {resendPersonalizedWithTransport} from '../email/resend-client';
import {syncSampleConversion} from './conversion';
import {renderSampleFollowup} from './followup-content';
export async function processNextSampleFollowup(){
 if(process.env.PREMIUM_SAMPLE_FOLLOWUPS_ENABLED!=='true')return null;
 const secrets=await emailSecrets(),sendMode=researchSendMode({...process.env,...secrets});
 if(sendMode==='dry-run'&&!localInboxEnabled())return null; // Preview mode must not consume production prospects.
 const {admin:db,stripe,mode}=await billingServices();
 if(sendMode==='live'&&mode!=='live')throw Error('SAMPLE_MODE_MISMATCH');
 const unpaused=async()=>{const {data,error}=await db.from('research_email_limits').select('paused').eq('singleton',true).single();if(error||!data)throw Error('SAMPLE_LIMITS_UNAVAILABLE');return !data.paused;};
 if(!await unpaused())return null;
 const prices=[priceId('monthly'),priceId('annual')];
 // Bounded reconciliation also catches people who purchase on another device.
 const {data:leads,error:leadError}=await db.from('premium_sample_leads').select('id,email,created_at,mode,analytics_allowed').eq('mode',mode).is('paid_at',null).eq('preexisting_member',false).or('conversion_checked_at.is.null,conversion_checked_at.lt.'+new Date(Date.now()-3600000).toISOString()).order('conversion_checked_at',{nullsFirst:true}).limit(5);
 if(leadError)throw Error('SAMPLE_LEADS_UNAVAILABLE');
 for(const lead of leads||[])await syncSampleConversion(db,stripe,lead,prices);
 const {data,error}=await db.rpc('claim_premium_sample_followup',{p_mode:mode,p_email:researchPilotRecipient(process.env)||null});if(error)throw Error('SAMPLE_QUEUE_UNAVAILABLE');
 const job=data?.[0];if(!job)return leads?.length?{status:'sample_conversions_checked',count:leads.length}:null;
 const finish=async(status:string,providerId?:string)=>{const {error}=await db.from('premium_sample_followups').update({status,...(providerId?{provider_id:providerId,sent_at:new Date().toISOString()}:{})}).eq('id',job.id);if(error)throw Error('SAMPLE_LEDGER_UNAVAILABLE');return {id:job.id,status};};
 try{
  const {data:lead,error}=await db.from('premium_sample_leads').select('*').eq('id',job.lead_id).eq('mode',mode).single();if(error||!lead)throw Error('SAMPLE_LEAD_UNAVAILABLE');
  if((await syncSampleConversion(db,stripe,lead,prices)).subscriber)return finish('skipped');
  const manual=await db.rpc('sample_has_manual_access',{p_email:lead.email});if(manual.error)throw Error('SAMPLE_MEMBERSHIP_UNAVAILABLE');if(manual.data)return finish('skipped');
  const unsubscribe=randomBytes(32).toString('hex');const {error:tokenError}=await db.from('premium_sample_unsubscribe_tokens').insert({token_hash:createHash('sha256').update(unsubscribe).digest('hex'),lead_id:lead.id});if(tokenError)throw Error('SAMPLE_UNSUBSCRIBE_UNAVAILABLE');
  const message=renderSampleFollowup(job.step,authOrigin(),authOrigin()+'/email/unsubscribe?token='+unsubscribe);
  // Re-read preferences immediately before dispatch; confirmation never reverses opt-out.
  const {data:fresh,error:freshError}=await db.from('premium_sample_leads').select('*').eq('id',lead.id).single();if(freshError||!fresh)throw Error('SAMPLE_LEAD_UNAVAILABLE');
  const age=(Date.now()-Date.parse(fresh.confirmed_at))/86400000;
  if(!fresh.marketing_requested||!fresh.confirmed_at||fresh.unsubscribed_at||fresh.subscriber_at||fresh.preexisting_member||!(age>=job.step&&age<(job.step===2?4:8))||!(await excludeSuppressed(db,[{email:lead.email}])).length)return finish('skipped');
  if(!await unpaused())return finish('skipped');
  if(sendMode==='dry-run'&&!localInboxEnabled())return finish('dry_run');
  await finish('dispatching');
  if(sendMode==='dry-run')return finish('dry_run',await deliverLocalInbox(lead.email,message));
  const [id]=await resendPersonalizedWithTransport({from:process.env.RESEARCH_EMAIL_FROM!,apiKey:secrets.RESEND_API_KEY!,key:'premium-sample-followup-'+job.id,messages:[{to:lead.email,email:message}]},fetch);
  return finish('sent',id);
 }catch{await finish('uncertain');throw Error('SAMPLE_FOLLOWUP_UNCERTAIN');}
}
