import PremiumResearchHeader from '@/components/premium/research-header';
import {requirePremium} from '@/lib/premium-access';
import PremiumNavigation from '@/components/premium/navigation';
import WeeklyOutlookResearch,{WeeklyOutlookArchive} from '@/components/premium/weekly-outlook';
import {getPublishedWeeklyOutlooks} from '@/lib/premium-opportunities';
import {pageMetadata} from '@/lib/page-metadata';
export const metadata=pageMetadata('Weekly Outlook','Justin’s market thesis, what changes the view, and the game plan.','/premium/weekly-outlook',true);
export default async function Page(){
 await requirePremium();
 const outlooks=getPublishedWeeklyOutlooks();
 return <main id="main-content" className="container"><PremiumNavigation/>{outlooks[0]?<WeeklyOutlookResearch outlook={outlooks[0]}/>:<PremiumResearchHeader kind="Weekly Outlook" title="No published Weekly Outlook yet."/>}<WeeklyOutlookArchive outlooks={outlooks.slice(1)}/></main>;
}
