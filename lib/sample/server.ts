import 'server-only';
import {cookies,headers} from 'next/headers';
import {analyticsAllowed,CONSENT_COOKIE} from '../analytics/policy';
import {createHash,randomBytes} from 'node:crypto';
import {emailDatabase} from '@/lib/email/database';
import {researchPilotRecipient} from '@/lib/email/policy';
import {emailSecrets} from '@/lib/email/secrets';
import {deliverLocalInbox,localInboxEnabled} from '@/lib/email/local-inbox';
import {resendPersonalizedWithTransport} from '@/lib/email/resend-client';
import {excludeSuppressed,researchAddressHash} from '@/lib/email/suppression';
import {renderResearchEmail} from '@/lib/email/templates';
import {weeklyOutlooks,getWeeklyOutlookOpportunities} from '@/lib/premium-opportunities';
import {localDevelopment} from '@/lib/local-development';
import {latestSample,normalizeSampleEmail} from './content';
export const sampleEnabled=()=>localDevelopment()||process.env.PREMIUM_SAMPLE_ENABLED==='true';
export function sampleHash(token:string){if(!/^[a-f0-9]{64}$/.test(token))throw Error('INVALID_TOKEN');return createHash('sha256').update(token).digest('hex');}
export async function requestSample(rawEmail:unknown,marketing:boolean,ip:string){
 if(!sampleEnabled())throw Error('SAMPLE_DISABLED');
 const local=localDevelopment();
 if(!local&&process.env.EMAIL_SEND_MODE!=='live')throw Error('SAMPLE_TRANSPORT_DISABLED');
 const email=normalizeSampleEmail(rawEmail);const pilot=researchPilotRecipient(process.env);if(!local&&pilot&&email!==pilot)return;const db=await emailDatabase();
 const token=randomBytes(32).toString('hex');const unsubscribe=randomBytes(32).toString('hex');const snapshot=latestSample(weeklyOutlooks);snapshot.opportunities=getWeeklyOutlookOpportunities(snapshot.outlook);
 const {data:id,error}=await db.rpc('reserve_premium_sample',{p_email:email,p_email_hash:researchAddressHash(email),p_token_hash:sampleHash(token),p_unsubscribe_hash:sampleHash(unsubscribe),p_snapshot:snapshot,p_marketing:marketing,p_ip_hash:createHash('sha256').update('premium-sample:'+ip).digest('hex')});
 if(error)throw Error('SAMPLE_DATABASE_UNAVAILABLE');if(!id)return;
 const {error:modeError}=await db.from('premium_sample_leads').update({mode:local?'test':'live',analytics_allowed:analyticsAllowed((await cookies()).get(CONSENT_COOKIE)?.value,(await headers()).get('sec-gpc')==='1')}).eq('id',id);if(modeError)throw Error('SAMPLE_DATABASE_UNAVAILABLE');
 const origin=local?'http://localhost:3082':'https://saccofinancial.com';
 const message=renderResearchEmail({type:'PREMIUM_SAMPLE',entityId:snapshot.issueId,label:'YOUR ONE-TIME PREMIUM SAMPLE',subject:'Your Sacco Premium sample is ready',headline:snapshot.title,preview:'One complete past Weekly Outlook. No membership required.',summary:`Thanks for taking a look at Sacco Premium. Open your private link below to confirm your email and read the complete Weekly Outlook for the week of ${snapshot.weekOf}.\n\nThis is a one-time sample, not a free weekly subscription. Your link stays available for 30 days and always opens this same sample.${marketing?'\n\nYour sample signup includes occasional Premium updates and offers. Confirming your email below activates those emails. You can unsubscribe at any time.':'\n\nYou have not signed up for marketing emails.'}`,details:[],cta:'Confirm email & read my sample',path:'/premium/sample/'+token,disclosure:'Educational and informational research, not personalized investment advice. Investing involves risk, including loss of principal.',audience:'prospect'},origin,origin+'/email/unsubscribe?token='+unsubscribe);
 try{
  if(!(await excludeSuppressed(db,[{email}])).length)throw Error('SAMPLE_SUPPRESSED');
  let providerId:string;
  if(local){if(!localInboxEnabled())throw Error('LOCAL_INBOX_DISABLED');providerId=await deliverLocalInbox(email,message);}
  else{const secrets=await emailSecrets();const sender=process.env.RESEARCH_EMAIL_FROM;if(!secrets.RESEND_API_KEY?.startsWith('re_')||!sender||/[\r\n]/.test(sender))throw Error('SAMPLE_TRANSPORT_UNAVAILABLE');const {data:limits,error}=await db.from('research_email_limits').select('paused').eq('singleton',true).single();if(error||!limits||limits.paused)throw Error('EMAIL_PAUSED');[providerId]=await resendPersonalizedWithTransport({from:sender,apiKey:secrets.RESEND_API_KEY,key:'premium-sample-'+id,messages:[{to:email,email:message}]},fetch);}
  const {error}=await db.from('premium_sample_leads').update({email_status:'sent',provider_id:providerId}).eq('id',id);if(error)throw Error('SAMPLE_STATUS_UNCERTAIN');
 }catch{await db.from('premium_sample_leads').update({email_status:'uncertain'}).eq('id',id);throw Error('SAMPLE_DELIVERY_UNCERTAIN');}
}
