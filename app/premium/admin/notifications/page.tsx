import './notifications.css';
import {Suspense} from 'react';
import {premiumDate} from '@/lib/premium-content';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {requireResearchAdmin} from '@/lib/email/admin';
import {availableResearchEvents,notificationPreview,notificationTemplate} from '@/lib/email/research-notifications';
import {emailDatabase} from '@/lib/email/database';
import {enrollmentCandidates,enrollmentFingerprint} from '@/lib/email/member-enrollment';
import {sendNotification,enrollExistingMembers} from './actions';
import QueueProgress from './queue-progress';
export const dynamic='force-dynamic';
export const metadata={title:'Research email preview | Sacco Premium',robots:{index:false,follow:false}};
async function Enrollment(){
 try{const rows=await enrollmentCandidates(await emailDatabase());return <form action={enrollExistingMembers}><input type="hidden" name="enrollment_fingerprint" value={enrollmentFingerprint(rows)}/><p>Eligible members with no saved preference: {rows.length}</p><button className="button" disabled={!rows.length}>Enroll {rows.length} existing members</button></form>;}catch{return <p role="alert">Enrollment preview unavailable. No preferences have been changed.</p>;}
}
async function Audience({eventKey}:{eventKey:string}){
 let preview:Awaited<ReturnType<typeof notificationPreview>>;
 try{preview=await notificationPreview(eventKey);}catch{return <p role="alert">Audience unavailable. Check database access and the email queue migration. No notification was queued.</p>;}
 return <><p><strong>Mode: {preview.mode}</strong></p><p>Eligible recipients: {preview.count}. Sent in batches of up to 100.</p><p>Shared research budgets: {preview.limits.daily_limit===null?'No daily cap':`${preview.limits.daily_limit} recipients per rolling 24 hours`}; {preview.limits.monthly_limit.toLocaleString()} per rolling 30 days. Reserved attempts count toward these budgets.</p>
 {preview.log?<QueueProgress eventKey={eventKey} initial={{job:preview.job,log:preview.log}}/>:<p>Not previously recorded.</p>}
 <form action={sendNotification}><input type="hidden" name="event" value={eventKey}/><input type="hidden" name="fingerprint" value={preview.fingerprint}/>{preview.event.updateId&&<label><input name="material" type="checkbox" required/> I consider this documented update material and want to notify members.</label>}<p><button className="button" disabled={Boolean(preview.log)||preview.limits.paused||preview.count===0||preview.count>50000}>{preview.mode==='live'?'Queue notification to eligible members':'Queue notification dry-run'}</button></p></form><p>The background worker processes queued notifications. You can leave this page.</p></>;
}
export default async function Page({searchParams}:{searchParams:Promise<{event?:string;result?:string;enrollment?:string;checkEnrollment?:string}>}){
 try{await requireResearchAdmin();}catch{notFound();}
 const params=await searchParams;const events=availableResearchEvents();let template:ReturnType<typeof notificationTemplate>|null=null;
 if(params.event){try{template=notificationTemplate(params.event);}catch{}}
 return <main className="container research-notifications-admin"><section className="page-hero"><p>SACCO PREMIUM / ADMINISTRATOR</p><h1>Research notifications</h1><p>Publishing never sends an email automatically. Review the template and audience, then queue a notification.</p><Link href="/premium/account">Account</Link> · <Link href="/premium/admin/analytics">Analytics</Link></section>
 <section className="section"><h2>Existing member notifications</h2><p>Enroll eligible members who have never saved a preference. Saved OFF choices, unsubscribes, and suppressed addresses are preserved. No email is sent by enrolling.</p>{params.enrollment&&<p role="status">{params.enrollment==='error'?'Enrollment could not complete.':`Enrolled ${params.enrollment} members. No email was sent.`}</p>}{params.checkEnrollment==='1'?<Suspense fallback={<p>Checking enrollment eligibility…</p>}><Enrollment/></Suspense>:<Link className="button" href={'?'+new URLSearchParams({...(params.event?{event:params.event}:{}),checkEnrollment:'1'})}>Check enrollment eligibility</Link>}</section>
 <section className="section"><form method="get" className="research-event-picker"><label>Published research event <select name="event" defaultValue={params.event||events[0]?.key}>{events.map(e=><option value={e.key} key={e.key}>{premiumDate(e.publishedAt)} · {e.label}: {e.headline}{e.updateId?' / '+e.details[0]:''}</option>)}</select></label><button className="button" type="submit">Preview notification</button></form>
 {params.result&&<p role="status">{params.result==='queued'?'Queued successfully. The worker will prepare this notification in the background.':`Result: ${params.result.replaceAll('_',' ')}. Review the status below before taking further action.`}</p>}
 {template?<><h2>{template.email.subject}</h2><p>Destination: <a href={template.email.url}>{template.email.url}</a></p><iframe title="Email preview" sandbox="" srcDoc={template.email.html} style={{width:'100%',maxWidth:650,height:650,border:0}}/><details><summary>Plain-text preview</summary><pre style={{whiteSpace:'pre-wrap'}}>{template.email.text}</pre></details><Suspense key={template.event.key} fallback={<p role="status">Checking eligible recipients… The template is ready to review.</p>}><Audience eventKey={template.event.key}/></Suspense></>:params.event&&<p role="alert">Published event not found.</p>}</section></main>;
}
