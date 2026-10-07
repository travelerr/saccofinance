import 'server-only';
import {cookies,headers} from 'next/headers';
import {analyticsAllowed,analyticsMode,CONSENT_COOKIE,CONTEXT_COOKIE,MEASUREMENT_ID,parseContext} from './policy';
import {purchaseEvent} from './purchase';
import {isResearchAdmin} from '@/lib/email/policy';
/** Analytics must never prevent authentication, payment, or membership access. */
export async function checkoutAnalytics(user:{id:string;email_confirmed_at?:string|null;is_anonymous?:boolean}){
 try{
  if(analyticsMode(process.env)!=='live'||isResearchAdmin(user,process.env.RESEARCH_ADMIN_USER_IDS||''))return {sf_ga_context:''};
  const store=await cookies();if(!analyticsAllowed(store.get(CONSENT_COOKIE)?.value,(await headers()).get('sec-gpc')==='1'))return {sf_ga_context:''};
  const context=parseContext(store.get(CONTEXT_COOKIE)?.value);
  // Stripe limits each metadata value to 500 characters. Keep only source/medium
  // and campaign here; detailed content placement stays in the browser events.
  if(context){context.attribution.first.content='';context.attribution.last.content='';}
  const raw=context?JSON.stringify(context):'';
  return {sf_ga_context:raw.length<=500?raw:''};
 }catch{return {sf_ga_context:''};}
}
export async function reportPurchase(session:Parameters<typeof purchaseEvent>[0],secret:string|undefined){
 if(analyticsMode(process.env)!=='live'||!secret)return;
 const payload=purchaseEvent(session);if(!payload)return;
 try{
  const url=new URL('https://www.google-analytics.com/mp/collect');url.searchParams.set('measurement_id',MEASUREMENT_ID);url.searchParams.set('api_secret',secret);
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(2000),cache:'no-store'});
  if(!response.ok)console.warn('Analytics purchase delivery unavailable. Stripe remains the payment source of truth.');
 }catch{console.warn('Analytics purchase delivery unavailable. Stripe remains the payment source of truth.');}
}

/** Verified milestones run after the response and cannot delay login or preference saves. */
export async function reportMemberMilestone(user:{id:string;email_confirmed_at?:string|null;is_anonymous?:boolean},name:'login'|'account_claimed'|'notification_preference_saved',enabled?:boolean){
 try{
  const metadata=await checkoutAnalytics(user);const context=parseContext(metadata.sf_ga_context);if(!context)return;
  const {after}=await import('next/server');
  after(async()=>{
   try{
    const {billingSecrets}=await import('@/lib/billing/secrets');const secrets=await billingSecrets();if(!secrets.GA_MEASUREMENT_API_SECRET)return;
    const {createHash}=await import('node:crypto');
    const url=new URL('https://www.google-analytics.com/mp/collect');url.searchParams.set('measurement_id',MEASUREMENT_ID);url.searchParams.set('api_secret',secrets.GA_MEASUREMENT_API_SECRET);
    await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({client_id:context.clientId,...(!user.is_anonymous?{user_id:createHash('sha256').update('sacco-analytics:'+user.id).digest('hex')}:{}),consent:{ad_user_data:'DENIED',ad_personalization:'DENIED'},events:[{name,params:{session_id:Number(context.sessionId),...(name==='notification_preference_saved'?{notifications_enabled:enabled===true}:{})}}]}),signal:AbortSignal.timeout(2000),cache:'no-store'});
   }catch{console.warn('Analytics milestone unavailable. The member action succeeded.');}
  });
 }catch{/* Optional analytics never changes the member action's result. */}
}
