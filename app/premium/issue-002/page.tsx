import {notFound} from 'next/navigation';
import {requirePremium} from '@/lib/premium-access';
import {getPublishedWeeklyOutlooks} from '@/lib/premium-opportunities';
import PremiumNavigation from '@/components/premium/navigation';
import WeeklyOutlookResearch from '@/components/premium/weekly-outlook';
import {pageMetadata} from '@/lib/page-metadata';
const issue=getPublishedWeeklyOutlooks().find(outlook=>outlook.id==='weekly-outlook-002');
export const metadata=pageMetadata(issue?.title||'Weekly Outlook',issue?.summary||'Sacco Premium research.','/premium/issue-002',true);
export default async function Page(){
 await requirePremium();
 if(!issue)notFound();
 return <main id="main-content" className="container"><PremiumNavigation/><WeeklyOutlookResearch outlook={issue}/></main>;
}
