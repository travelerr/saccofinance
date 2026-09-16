import Link from 'next/link';
import {Eyebrow,SectionHeader} from '@/components/brand/editorial';
import PremiumNavigation from '@/components/premium/navigation';
import OpportunityBoard from '@/components/premium/opportunity-board';
import {getPublishedOpportunities,getRecentOpportunityUpdates} from '@/lib/premium-opportunities';
import {premiumDate} from '@/lib/premium-content';
import {pageMetadata} from '@/lib/page-metadata';
export const metadata=pageMetadata('Stage 2 Opportunities','Reviewed Stage 1-to-Stage 2 setups, required conditions, and dated research updates.','/premium/opportunities',true);
export default function Page(){
 const opportunities=getPublishedOpportunities();const recent=getRecentOpportunityUpdates();
 return <main id="main-content" className="container opportunity-board-page"><PremiumNavigation/><section className="page-hero"><Eyebrow>Sacco Premium / Reviewed setups</Eyebrow><h1>STAGE 2<br/><span>OPPORTUNITIES.</span></h1><p>Market context → Sector strength → ETF analysis → Stock screening → Stage 1-to-Stage 2 candidate → Research → Opportunity. Only intentionally reviewed and approved setups reach this board.</p></section><section className="section"><SectionHeader label="Follow the conditions" title="The Opportunity Board"/><OpportunityBoard opportunities={opportunities}/></section><section className="section"><SectionHeader label="What changed" title="Recent Opportunity Updates"/>{recent.length?recent.map(({opportunity:o,update:u})=><article key={u.id} className="opportunity-empty"><p className="opportunity-meta">{o.ticker} / {premiumDate(u.publishedAt)} / {u.statusBefore} → {u.statusAfter}</p><h3><Link href={`/premium/opportunities/${o.slug}#updates`}>{u.title}</Link></h3><p>{u.explanation}</p></article>):<p>No published opportunity updates yet.</p>}<p className="support-note">Confirmed means the documented technical criteria were met. Active means Justin explicitly documented an entry. Price movement never establishes Active or Closed.</p></section></main>;
}
