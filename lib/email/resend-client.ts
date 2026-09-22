import 'server-only';
import type {renderResearchEmail} from './templates';
type Email=ReturnType<typeof renderResearchEmail>;
/** The application exposes dry-run only. Live transport requires a later reviewed rollout. */
export async function deliverResearchBatch(input:{mode:'dry-run';emails:string[];email:Email;key:string}){
 if(input.mode!=='dry-run')throw new Error('LIVE_EMAIL_DISABLED');
 if(input.emails.length>100)throw new Error('RECIPIENT_LIMIT');
 return {status:'dry_run' as const,providerIds:[] as string[]};
}
/** Adapter shared by the developer test command and mocked transport tests. */
export async function resendBatchWithTransport(input:{from:string;apiKey:string;emails:string[];email:Email;key:string},transport:typeof fetch){
 if(!input.emails.length||input.emails.length>100)throw new Error('RECIPIENT_LIMIT');
 return resendPersonalizedWithTransport({from:input.from,apiKey:input.apiKey,key:input.key,messages:input.emails.map(to=>({to,email:input.email}))},transport);
}
export async function resendPersonalizedWithTransport(input:{from:string;apiKey:string;key:string;messages:{to:string;email:Email}[]},transport:typeof fetch){
 if(!input.messages.length||input.messages.length>100)throw new Error('RECIPIENT_LIMIT');
 const response=await transport('https://api.resend.com/emails/batch',{method:'POST',headers:{Authorization:'Bearer '+input.apiKey,'Content-Type':'application/json','Idempotency-Key':input.key},body:JSON.stringify(input.messages.map(({to,email})=>({from:input.from,to:[to],subject:email.subject,html:email.html,text:email.text,headers:email.headers}))),signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Error('RESEND_REJECTED');
 const result=await response.json();
 if(!Array.isArray(result.data)||result.data.length!==input.messages.length||result.data.some((x:{id?:unknown})=>typeof x.id!=='string'||!x.id))throw new Error('RESEND_RESPONSE_UNCERTAIN');
 return result.data.map((x:{id:string})=>x.id) as string[];
}
