import 'server-only';
import {createClient} from '@supabase/supabase-js';
import {billingSecrets} from '../billing/secrets';
import {localDevelopment} from '../local-development';
import {requireAnalyticsAdmin} from './admin';
import {memberSummary,type MemberRow,type SubscriptionRow,type PreferenceRow} from './reporting-model';
export type EmailLog={id:string;subject:string;recipient_count:number;mode:string;status:string;created_at:string};
export async function operationsReporting(){
 await requireAnalyticsAdmin();
 try{
  const local=localDevelopment();
  if(!local&&(process.env.AUTH_SITE_URL!=='https://saccofinancial.com'||process.env.STRIPE_MODE!=='live'))throw Error('UNSAFE_REPORTING_CONFIGURATION');
  const secret=local?process.env.SUPABASE_SECRET_KEY:(await billingSecrets()).SUPABASE_SECRET_KEY;
  if(!secret)throw Error('REPORTING_KEY_REQUIRED');
  const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,secret,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(url,init)=>fetch(url,{...init,cache:'no-store',signal:AbortSignal.timeout(8000)})}});
  const mode=local?'test':'live';
  // Stable pagination avoids silently counting only Supabase's first 1,000 rows.
  async function rows<T>(table:string,columns:string,order:string,filter?:[string,string]):Promise<T[]>{
   const all:T[]=[];
   for(let offset=0;offset<=10000;offset+=1000){
    let query=db.from(table).select(columns).order(order).range(offset,offset+999);
    if(filter)query=query.eq(filter[0],filter[1]);
    const {data,error}=await query;if(error||!data)throw Error('DATA_UNAVAILABLE');
    all.push(...data as unknown as T[]);if(all.length>10000)throw Error('REPORT_TOO_LARGE');
    if(data.length<1000)return all;
   }
   throw Error('REPORT_TOO_LARGE');
  }
  const [members,email]=await Promise.allSettled([
   Promise.all([
    rows<MemberRow>('premium_memberships','user_id,enabled,access_expires_at,access_source','user_id'),
    rows<SubscriptionRow>('billing_subscriptions','stripe_subscription_id,access_owner_id,mode,status,plan,paid_through,current_period_end,cancel_at_period_end,cancel_at,first_failure_at,failed_invoice_id','stripe_subscription_id',['mode',mode]),
    rows<PreferenceRow>('research_email_preferences','user_id,enabled','user_id')
   ]).then(([grants,subscriptions,preferences])=>memberSummary(grants,subscriptions,preferences)),
   (async()=>{
    const {data,error}=await db.from('research_notification_log').select('id,subject,recipient_count,mode,status,created_at').eq('mode',local?'dry-run':'live').order('created_at',{ascending:false}).limit(10);
    if(error)throw Error('EMAIL_LOG_UNAVAILABLE');return data as EmailLog[];
   })()
  ]);
  return {local,members:members.status==='fulfilled'?members.value:null,email:email.status==='fulfilled'?email.value:null};
 }catch{return {local:process.env.SACCO_LOCAL_DEVELOPMENT==='true',members:null,email:null};}
}
