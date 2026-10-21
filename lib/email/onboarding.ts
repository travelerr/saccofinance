import 'server-only';
import {localInboxEnabled,deliverLocalInbox} from './local-inbox';
import {createHash} from 'node:crypto';
import {billingServices,priceId,authOrigin} from '../billing/server';
import {hasPaidAccess,cancellationScheduled} from '../billing/model';
import {assertRetentionSubscription,stripeCancellationEnd} from '../billing/retention-policy';
import {ownedBillingCustomers} from '../billing/ownership';
import {emailSecrets} from './secrets';
import {researchSendMode} from './policy';
import {resolveResearchRecipientRecords} from './recipient-resolution';
import {createResearchUnsubscribe} from './unsubscribe';
import {renderOnboardingEmail,onboardingWindow,type OnboardingStep} from './onboarding-template';
import {resendPersonalizedWithTransport} from './resend-client';
/** Nonessential onboarding follows existing research opt-in and suppression rules. */
export async function processNextOnboardingEmail(){
 if(process.env.MEMBER_ONBOARDING_ENABLED!=='true')return null;
 const secrets=await emailSecrets(),sendMode=researchSendMode({...process.env,...secrets});
 const {stripe,admin,mode}=await billingServices();
 if(sendMode==='live'&&mode!=='live')throw Error('ONBOARDING_MODE_MISMATCH');
 const unpaused=async()=>{const {data,error}=await admin.from('research_email_limits').select('paused').eq('singleton',true).single();if(error||!data)throw Error('LIMIT_LOOKUP_FAILED');return !data.paused;};
 if(!await unpaused())return null;
 const {data,error}=await admin.rpc('claim_member_onboarding_email',{p_mode:mode,p_send_mode:sendMode});
 if(error)throw Error('ONBOARDING_QUEUE_UNAVAILABLE');
 const job=data?.[0];if(!job)return null;
 const finish=async(status:string,providerId?:string)=>{const {data,error}=await admin.from('member_onboarding_emails').update({status,provider_id:providerId||null}).eq('id',job.id).eq('lease_token',job.lease_token).select('id').maybeSingle();if(error||!data)throw Error('ONBOARDING_LEDGER_UNAVAILABLE');return {id:job.id,status};};
 const {data:cohort,error:cohortError}=await admin.from('member_onboarding').select('*').eq('user_id',job.user_id).eq('mode',mode).single();
 if(cohortError)throw Error('ONBOARDING_COHORT_UNAVAILABLE');
 if(!cohort.eligible||![0,2,5].includes(job.step)||!onboardingWindow(job.step as OnboardingStep,cohort.started_at))return finish('skipped');
 const {data:row,error:rowError}=await admin.from('billing_subscriptions').select('*').eq('stripe_subscription_id',cohort.subscription_id).eq('access_owner_id',job.user_id).eq('mode',mode).maybeSingle();
 if(rowError)throw Error('BILLING_DATABASE');
 if(!row||!hasPaidAccess(row)||cancellationScheduled(row))return finish('skipped');
 if(job.step===0){
  const {data:purchase,error:purchaseError}=await admin.from('billing_purchase_claims').select('id').eq('mode',mode).or('original_user_id.eq.'+job.user_id+',claimed_user_id.eq.'+job.user_id).limit(1);
  if(purchaseError)throw Error('PURCHASE_LOOKUP_FAILED');
  if(purchase?.length)return finish('skipped');
 }
 const subscription=await stripe.subscriptions.retrieve(cohort.subscription_id).catch(error=>{if(error?.code==='resource_missing')return null;throw error;});
 if(!subscription||!['active','trialing'].includes(subscription.status)||subscription.cancel_at_period_end||stripeCancellationEnd(subscription))return finish('skipped');
 assertRetentionSubscription(subscription,mode==='live',[priceId('monthly'),priceId('annual')],await ownedBillingCustomers(job.user_id));
 // Recheck preferences, identity, access and suppression immediately before delivery.
 const recipients=await resolveResearchRecipientRecords(admin,[job.user_id]);
 if(!recipients.length)return finish('skipped');
 if(!await unpaused())throw Error('ONBOARDING_PAUSED');
 const unsubscribe=await createResearchUnsubscribe(admin,job.user_id,authOrigin());
 const message=renderOnboardingEmail(job.step,authOrigin(),unsubscribe);
 if(sendMode==='dry-run'){
  if(!localInboxEnabled())return finish('dry_run');
  await finish('dispatching');
  try{return await finish('dry_run',await deliverLocalInbox(recipients[0].email,message));}
  catch{await finish('uncertain');throw Error('LOCAL_ONBOARDING_CAPTURE_UNCERTAIN');}
 }
 await finish('dispatching');
 try{
  const ids=await resendPersonalizedWithTransport({from:process.env.RESEARCH_EMAIL_FROM!,apiKey:secrets.RESEND_API_KEY!,key:createHash('sha256').update('onboarding:'+mode+':'+job.user_id+':'+job.step).digest('hex'),messages:[{to:recipients[0].email,email:message}]},fetch);
  return await finish('sent',ids[0]);
 }catch{await finish('uncertain');throw Error('ONBOARDING_DELIVERY_UNCERTAIN');}
}
