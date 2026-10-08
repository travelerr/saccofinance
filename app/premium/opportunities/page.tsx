import PremiumResearchHeader from '@/components/premium/research-header';
import {requirePremium} from '@/lib/premium-access';
import Link from 'next/link';
import {SectionHeader} from '@/components/brand/editorial';
import OpportunityBoard from '@/components/premium/opportunity-board';
import {getPublishedOpportunities,getRecentOpportunityUpdates} from '@/lib/premium-opportunities';
import {premiumDate} from '@/lib/premium-content';
import {pageMetadata} from '@/lib/page-metadata';
export const metadata=pageMetadata('Stage 2 Opportunities','Reviewed Stage 1-to-Stage 2 setups, required conditions, and dated research updates.','/premium/opportunities',true);
export default async function Page(){
 await requirePremium();
 const opportunities=getPublishedOpportunities();const recent=getRecentOpportunityUpdates();
 return <main id="main-content" className="container opportunity-board-page"><PremiumResearchHeader kind="Opportunity Board" title="Opportunities" summary="Reviewed research files, not scanner results. Trade status and technical stage remain independent; follow the thesis, conditions, and dated updates."/><section className="section"><SectionHeader label="Follow the conditions" title="Research board"/><OpportunityBoard opportunities={opportunities}/></section><section className="section"><SectionHeader label="What changed" title="Recent Opportunity Updates"/>{recent.length?recent.map(({opportunity:o,update:u})=><article key={u.id} className="opportunity-empty"><p className="opportunity-meta">{o.ticker} / {premiumDate(u.publishedAt)} / {u.tradeStatusBefore?`${u.tradeStatusBefore} → ${u.tradeStatusAfter}`:`Trade Status: ${u.tradeStatusAfter}`}</p><h3><Link href={`/premium/opportunities/${o.slug}#updates`}>{u.title}</Link></h3><details className="workspace-update-details"><summary>Read update</summary><p>{u.explanation}</p><Link className="text-link" href={`/premium/opportunities/${o.slug}#updates`}>Open research file</Link></details></article>):<p>No published opportunity updates yet.</p>}<p className="support-note">Confirmed means the documented technical criteria were met. Active means Justin explicitly documented an entry. Price movement never establishes Active or Closed.</p></section></main>;
}
