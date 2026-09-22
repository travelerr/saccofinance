'use server';
import {redirect} from 'next/navigation';
import {runResearchNotification} from '@/lib/email/research-notifications';
import {requireResearchAdmin} from '@/lib/email/admin';
export async function sendNotification(form:FormData){
 await requireResearchAdmin();
 const key=String(form.get('event')||'');let status='dry_run';
 try{status=await runResearchNotification(key,String(form.get('fingerprint')||''),form.get('material')==='on');}catch(error){const code=error instanceof Error?error.message:'';status=['EMAIL_PAUSED','DAILY_LIMIT','MONTHLY_LIMIT','RATE_LIMIT','ACCEPTED_LOG_UNCERTAIN','ALREADY_RECORDED','NO_RECIPIENTS','RECIPIENT_LIMIT','PREVIEW_CHANGED','MATERIAL_CONFIRMATION_REQUIRED'].includes(code)?code:'SEND_FAILED_OR_UNCERTAIN';}
 redirect('/premium/admin/notifications?event='+encodeURIComponent(key)+'&result='+status);
}
