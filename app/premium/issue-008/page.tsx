import {notFound} from 'next/navigation';
import {requirePremium} from '@/lib/premium-access';
import {requireResearchAdmin} from '@/lib/email/admin';
import {weeklyOutlook008 as issue} from '@/lib/weekly-outlook-008';
import WeeklyOutlookResearch from '@/components/premium/weekly-outlook';
import {pageMetadata} from '@/lib/page-metadata';
export const metadata=pageMetadata(issue.title,issue.summary||'Sacco Premium research.','/premium/issue-008',true);
export default async function Page(){
 await requirePremium();
 if(issue.publicationState!=='published'){try{await requireResearchAdmin();}catch{notFound();}}
 return <main id="main-content" className="container">{issue.publicationState!=='published'&&<p role="status">Draft preview · Not published or emailed</p>}<WeeklyOutlookResearch outlook={issue}/></main>;
}
