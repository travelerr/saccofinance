'use server';
import {redirect} from 'next/navigation';
import {runResearchNotification} from '@/lib/email/research-notifications';
import {requireResearchAdmin} from '@/lib/email/admin';
export async function sendNotification(form:FormData){
 await requireResearchAdmin();
 const key=String(form.get('event')||'');let status='dry_run';
 try{status=await runResearchNotification(key,String(form.get('fingerprint')||''),form.get('material')==='on');}catch(error){const code=error instanceof Error?error.message:'';status=['QUEUE_UNAVAILABLE','EMAIL_PAUSED','DAILY_LIMIT','MONTHLY_LIMIT','RATE_LIMIT','ACCEPTED_LOG_UNCERTAIN','ALREADY_RECORDED','NO_RECIPIENTS','RECIPIENT_LIMIT','PREVIEW_CHANGED','MATERIAL_CONFIRMATION_REQUIRED'].includes(code)?code:'SEND_FAILED_OR_UNCERTAIN';}
 redirect('/premium/admin/notifications?event='+encodeURIComponent(key)+'&result='+status);
}

export async function enrollExistingMembers(form:FormData){
 await requireResearchAdmin();
 const {emailDatabase}=await import('@/lib/email/database');
 const {enrollMissingPreferences}=await import('@/lib/email/member-enrollment');
 let result:string;
 try{const count=await enrollMissingPreferences(await emailDatabase(),String(form.get('enrollment_fingerprint')||''));result=String(count);}catch{result='error';}
 redirect('/premium/admin/notifications?enrollment='+result);
}

export async function retryPreparation(form:FormData){
 await requireResearchAdmin();
 const {emailDatabase}=await import('@/lib/email/database');
 const {emailSecrets}=await import('@/lib/email/secrets');
 const {researchSendMode}=await import('@/lib/email/policy');
 const key=String(form.get('event')||'');const mode=researchSendMode({...process.env,...await emailSecrets()});
 const {data,error}=await (await emailDatabase()).rpc('retry_research_email_preparation',{p_event:key,p_mode:mode});
 redirect('/premium/admin/notifications?'+new URLSearchParams({event:key,result:!error&&data?'queued':'RECOVERY_UNAVAILABLE'}));
}
