import {requirePremium} from '@/lib/premium-access';
import PremiumPlaceholder from '@/components/premium/placeholder';
import {pageMetadata} from '@/lib/page-metadata';
export const metadata=pageMetadata('Weekly Outlook','No published Premium Weekly Outlook yet. Market context and the closing game plan will appear here after review and publication.','/premium/weekly-outlook',true);
export default async function Page(){
 await requirePremium();return <PremiumPlaceholder title="Weekly Outlook" description="No published Premium Weekly Outlook yet. Market context and the closing game plan will appear here after review and publication."/>;}
