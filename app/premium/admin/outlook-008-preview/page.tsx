import {notFound} from 'next/navigation';
import {requireResearchAdmin} from '@/lib/email/admin';
import {weeklyOutlook008} from '@/lib/weekly-outlook-008';
import {researchEvents} from '@/lib/email/events';
import {renderResearchEmail} from '@/lib/email/templates';
import {unsubscribePlaceholder,validateEmailSnapshot} from '@/lib/email/snapshot';
import {localDevelopment} from '@/lib/local-development';
export default async function Page(){
 try{await requireResearchAdmin();}catch{notFound();}
 const origin=localDevelopment()?'http://localhost:3082':'https://saccofinancial.com';
 // Rendering a draft never creates a queue entry or changes publication state.
 const event=researchEvents([{...weeklyOutlook008,publicationState:'published'}],[],[])[0];
 const email=renderResearchEmail(event,origin,unsubscribePlaceholder(origin));
 validateEmailSnapshot({version:1,...email},origin);
 return <main className="container"><h1>Weekly Outlook email preview</h1><p>Preview only. No email has been queued or sent.</p><p>{email.subject}</p><a href="/premium/issue-008">Read the article preview</a><iframe title="Detailed Weekly Outlook email preview" sandbox="" srcDoc={email.html} style={{display:'block',width:'100%',maxWidth:650,height:900,border:0,marginTop:24}}/></main>;
}
