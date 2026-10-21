import 'server-only';
import {assertLocalEmailEnvironment} from './policy';
import type {renderResearchEmail} from './templates';
/** A local capture only. The address and port cannot be configured to an external host. */
export function localInboxEnabled(){return process.env.SACCO_LOCAL_DEVELOPMENT==='true'&&process.env.LOCAL_ONBOARDING_INBOX==='true';}
export async function deliverLocalInbox(to:string,email:ReturnType<typeof renderResearchEmail>){
 if(!localInboxEnabled())throw Error('LOCAL_INBOX_DISABLED');
 assertLocalEmailEnvironment(process.env);
 const response=await fetch('http://127.0.0.1:54324/api/v1/send',{method:'POST',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify({From:{Email:'premium@sacco.test',Name:'Sacco Premium (local test)'},To:[{Email:to}],Subject:email.subject+' (local test)',Text:email.text,HTML:email.html,Headers:email.headers}),signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw Error('LOCAL_INBOX_UNAVAILABLE');
 const data=await response.json();return typeof data.ID==='string'?'local:'+data.ID:'local:captured';
}
