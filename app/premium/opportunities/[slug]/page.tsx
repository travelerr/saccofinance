import OpportunityResearch from '@/components/premium/opportunity-research';
import {requirePremium} from '@/lib/premium-access';
import {notFound} from 'next/navigation';
import {getPublishedOpportunity,getOpportunityUpdates} from '@/lib/premium-opportunities';
import {pageMetadata} from '@/lib/page-metadata';
import '@/components/premium/research-brief.css';
import '@/components/premium/opportunities.css';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){await requirePremium();const{slug}=await params;const o=getPublishedOpportunity(slug);return o?pageMetadata(`${o.ticker} — ${o.title}`,o.setupThesis,`/premium/opportunities/${o.slug}`,true):{title:'Opportunity unavailable',robots:{index:false,follow:false}};}
export default async function Page({params}:Props){
 await requirePremium();const{slug}=await params;const o=getPublishedOpportunity(slug);if(!o)notFound();
 return <OpportunityResearch opportunity={o} updates={getOpportunityUpdates(o.id)}/>;
}
