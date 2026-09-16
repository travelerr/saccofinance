import OpportunityCard,{OpportunityEmptyState} from '@/components/premium/opportunity-card';
import {getPublishedOpportunities} from '@/lib/premium-opportunities';
import {isCurrentOpportunity} from '@/lib/premium-content';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {Eyebrow,SectionHeader} from '@/components/brand/editorial';
import PremiumNavigation from '@/components/premium/navigation';
import {pageMetadata} from '@/lib/page-metadata';
import {formatDate,type StrengthSnapshot} from '@/lib/market-strength';
export const metadata=pageMetadata('Premium Dashboard','The Sacco Premium research process: market context, sector strength, setups and weekly outlook.','/premium/dashboard',true);
export const dynamic='force-dynamic';
export default async function Dashboard(){
 const current=getPublishedOpportunities().filter(isCurrentOpportunity).slice(0,3);
 let snapshot:StrengthSnapshot|null=null;
 try{snapshot=JSON.parse(await readFile(path.join(process.cwd(),'data/market-strength/latest.json'),'utf8'));}catch{}
 return <main id="main-content" className="container"><PremiumNavigation/><section className="page-hero"><Eyebrow>Sacco Premium / Research preview</Eyebrow><h1>THE CONTEXT.<br/>THE SETUP.<br/><span>THE NEXT STEP.</span></h1><p>A disciplined swing-trading research process. Start with the market, follow sector strength, and make each setup earn its place.</p></section><section className="section"><SectionHeader label="Start with the environment" title="Weekly Outlook" href="/premium/weekly-outlook" linkText="Open Weekly Outlook"/><p>No published Premium Weekly Outlook yet. A reviewed market view will establish the context for the setups that follow.</p></section><section className="section"><SectionHeader label="The sector-strength input" title="Sector Gauge" href="/premium/market-strength" linkText="Open Sector Gauge"/><p>{snapshot?`${snapshot.fundCount} ETF proxies across six timeframes. Saved data through ${formatDate(snapshot.asOf)}.`:'Snapshot unavailable. Open the Sector Gauge to check the latest saved data.'}</p><p>Compare each fund’s total return or its return versus SPY. Leadership is an input to further ETF and stock research, rather than an automatic opportunity.</p></section><section className="section"><SectionHeader label="Reviewed setups" title="Opportunities" href="/premium/opportunities" linkText="Explore Opportunities"/>{current.length?<div className="editorial-grid">{current.map(o=><OpportunityCard key={o.id} opportunity={o}/>)}</div>:<OpportunityEmptyState/>}</section></main>;
}
