import 'server-only';
import {createHash} from 'node:crypto';
import {billingServices,priceId,authOrigin} from '../billing/server';
import {assertRetentionSubscription,reminderDue,stripeCancellationEnd} from '../billing/retention-policy';
import {hasPaidAccess} from '../billing/model';
import {ownedBillingCustomers} from '../billing/ownership';
import {emailSecrets} from './secrets';
import {researchSendMode,researchPilotRecipient} from './policy';
import {excludeSuppressed} from './suppression';
import {renderAccessReminder} from './access-reminder-template';
import {resendPersonalizedWithTransport} from './resend-client';
/** One reminder per subscription/end date. No automatic retry after a dispatch attempt. */
export async function processNextAccessReminder(){
 if(process.env.BILLING_REMINDERS_ENABLED!=='true')return null;
 const secrets=await emailSecrets();
 const sendMode=researchSendMode({...process.env,...secrets});
 const {stripe,admin,mode}=await billingServices();
 if(sendMode==='live'&&mode!=='live')throw Error('REMINDER_MODE_MISMATCH');
 const {data:limits,error:limitsError}=await admin.from('research_email_limits').select('paused').eq('singleton',true).single();
 if(limitsError||!limits)throw Error('LIMIT_LOOKUP_FAILED');if(limits.paused)return null;
 const {data,error}=await admin.rpc('claim_billing_access_reminder',{p_mode:mode,p_send_mode:sendMode});
 if(error)throw Error('REMINDER_QUEUE_UNAVAILABLE');
 const job=data?.[0];if(!job)return null;
 const finish=async(status:string,providerId?:string)=>{const {data,error}=await admin.from('billing_access_reminders').update({status,provider_id:providerId||null}).eq('id',job.id).eq('lease_token',job.lease_token).select('id').maybeSingle();if(error||!data)throw Error('REMINDER_LEDGER_UNAVAILABLE');return {id:job.id,status};};
 const {data:row,error:rowError}=await admin.from('billing_subscriptions').select('*').eq('stripe_subscription_id',job.subscription_id).eq('mode',mode).eq('access_owner_id',job.user_id).maybeSingle();
 if(rowError)throw Error('BILLING_DATABASE');
 if(!row||!hasPaidAccess(row))return finish('skipped');
 const {data:identity,error:identityError}=await admin.auth.admin.getUserById(job.user_id);
 if(identityError)throw Error('IDENTITY_UNAVAILABLE');
 const user=identity.user;
 if(!user?.email||!user.email_confirmed_at||user.is_anonymous||(user.banned_until&&Date.parse(user.banned_until)>Date.now()))return finish('skipped');
 const email=user.email.trim().toLowerCase(),pilot=researchPilotRecipient(process.env);
 if(pilot&&pilot!==email)return finish('skipped');
 if(!(await excludeSuppressed(admin,[{email}])).length)return finish('skipped');
 // Do not say all access ends when a complimentary grant or a different subscription keeps it active.
 const [{data:grant,error:grantError},{data:others,error:otherError}]=await Promise.all([
  admin.from('premium_memberships').select('*').eq('user_id',job.user_id).maybeSingle(),
  admin.from('billing_subscriptions').select('*').eq('access_owner_id',job.user_id).eq('mode',mode).neq('stripe_subscription_id',job.subscription_id)
 ]);
 if(grantError||otherError)throw Error('BILLING_DATABASE');
 const ends=Date.parse(job.ends_at);
 if((grant?.enabled&&grant.access_source==='manual'&&(!grant.access_expires_at||Date.parse(grant.access_expires_at)>ends))||others?.some(s=>hasPaidAccess(s,ends)))return finish('skipped');
 const subscription=await stripe.subscriptions.retrieve(job.subscription_id).catch(error=>{if(error?.code==='resource_missing')return null;throw error;});
 if(!subscription)return finish('skipped');
 if(!['active','trialing'].includes(subscription.status))return finish('skipped');
 assertRetentionSubscription(subscription,mode==='live',[priceId('monthly'),priceId('annual')],await ownedBillingCustomers(job.user_id));
 const end=stripeCancellationEnd(subscription);
 if(!['active','trialing'].includes(subscription.status)||!reminderDue(end)||end!*1000!==ends)return finish('skipped');
 const {data:finalLimits,error:finalLimitError}=await admin.from('research_email_limits').select('paused').eq('singleton',true).single();
 if(finalLimitError||!finalLimits||finalLimits.paused)throw Error('REMINDER_PAUSED_OR_UNAVAILABLE');
 const message=renderAccessReminder(authOrigin(),job.ends_at);
 if(sendMode==='dry-run')return finish('dry_run');
 // Durable dispatch marker is written before the provider call. A timeout is uncertain, never auto-retried.
 await finish('dispatching');
 try{
  const ids=await resendPersonalizedWithTransport({from:process.env.RESEARCH_EMAIL_FROM!,apiKey:secrets.RESEND_API_KEY!,key:createHash('sha256').update('access-reminder:'+job.mode+':'+job.subscription_id+':'+job.ends_at).digest('hex'),messages:[{to:email,email:message}]},fetch);
  return await finish('sent',ids[0]);
 }catch{await finish('uncertain');throw Error('REMINDER_DELIVERY_UNCERTAIN');}
}
