'use client';
import {useEffect,useState} from 'react';
import {retryPreparation} from './actions';
type Status={job:{sent_count?:number;completed_batches?:number;batch_count?:number;failed_batches?:number;status:string;attempts:number;prepared_count:number;updated_at:string;lease_until:string|null;error_code:string|null}|null;log:{status:string;created_at:string;recipient_count:number;error_code:string|null}|null};
const labels:Record<string,string>={queued:'Queued',preparing:'Preparing recipients',sending:'Sending to Resend',sent:'Accepted by Resend',dry_run:'Dry-run complete — no email sent',failed:'Preparation failed — no provider dispatch',uncertain:'Outcome uncertain — provider review required',cancelled:'Cancelled — audience, content, or sending settings changed'};
export default function QueueProgress({eventKey,initial}:{eventKey:string;initial:Status}){
 const [state,setState]=useState(initial),[unavailable,setUnavailable]=useState(false);
 const active=!!state.job&&['queued','preparing','sending'].includes(state.job.status);
 useEffect(()=>{if(!active)return;const controller=new AbortController();let timer:ReturnType<typeof setTimeout>;
 const poll=async()=>{try{const r=await fetch('/api/email/notification-status?'+new URLSearchParams({event:eventKey}),{cache:'no-store',signal:controller.signal});if(!r.ok)throw Error();setState(await r.json());setUnavailable(false);}catch{if(!controller.signal.aborted)setUnavailable(true);}if(!controller.signal.aborted)timer=setTimeout(poll,4000);};timer=setTimeout(poll,1500);return()=>{controller.abort();clearTimeout(timer);};},[eventKey,active]);
 const job=state.job;const stale=job&&Date.now()-Date.parse(job.updated_at)>120000;
 return <div role="status" aria-live="polite"><h3>{job?labels[job.status]||job.status:state.log?.status==='sent'?'Accepted by Resend':state.log?.status==='dry_run'?'Dry-run complete — no email sent':'Previous attempt needs review'}</h3>
 <p>{job&&`${job.sent_count||0} of ${state.log?.recipient_count||0} accepted by Resend · ${job.completed_batches||0} of ${job.batch_count||1} batches complete. `}{state.log?.recipient_count} recipients reserved. {job&&`${job.prepared_count} prepared · Attempt ${job.attempts} of 3.`}</p>
 {active&&<p>{stale?'Progress is delayed. Check that the background worker is running. Interrupted preparation can recover; uncertain sends will not be repeated.':'You can leave this page. Sending continues in the background.'}</p>}
 {(job?.status==='sent'||state.log?.status==='sent')&&<p>Provider acceptance is confirmed; inbox delivery is not confirmed.</p>}
 {(!job||job.status==='uncertain')&&state.log?.status!=='sent'&&state.log?.status!=='dry_run'&&<p>This attempt is locked to prevent duplicate emails. Check Resend records before any recovery. Historical reservations are never automatically retried.</p>}
 {Boolean(job?.failed_batches||job?.status==='failed')&&<form action={retryPreparation}><input type="hidden" name="event" value={eventKey}/><button className="button">Retry preparation safely</button><p>The existing reservation and budget remain in place. This is available only when dispatch never started.</p></form>}
 {job?.error_code&&<p>Details: {job.error_code.replaceAll('_',' ')}</p>}{unavailable&&<p>Status refresh unavailable. Last known state shown; no resend has been attempted.</p>}</div>;
}
