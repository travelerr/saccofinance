import {Compass,Newspaper,ChartNoAxesCombined} from 'lucide-react';
import ToolsIUse from '@/components/premium/tools-i-use';
import {OutlookSectorFocus} from '@/components/premium/weekly-outlook';
import '@/components/premium/auth.css';
import Link from 'next/link';
import PremiumResearchHeader,{researchNumber,premiumDate} from '@/components/premium/research-header';
import {requirePremium} from '@/lib/premium-access';
import OpportunityCard,{OpportunityEmptyState} from '@/components/premium/opportunity-card';
import {getPublishedOpportunities,getLatestWeeklyOutlook} from '@/lib/premium-opportunities';
import {isCurrentOpportunity} from '@/lib/premium-content';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {Eyebrow,SectionHeader} from '@/components/brand/editorial';
import {pageMetadata} from '@/lib/page-metadata';
import {formatDate,type StrengthSnapshot} from '@/lib/market-strength';
export const metadata=pageMetadata('Premium Dashboard','The Sacco Premium research process: market context, sector strength, setups and weekly outlook.','/premium/dashboard',true);
export const dynamic='force-dynamic';
export default async function Dashboard(){
 const user=await requirePremium();
 const outlook=getLatestWeeklyOutlook();
 const current=getPublishedOpportunities().filter(isCurrentOpportunity);
 let snapshot:StrengthSnapshot|null=null;
 try{snapshot=JSON.parse(await readFile(path.join(process.cwd(),'data/market-strength/latest.json'),'utf8'));}catch{}
 return <main id="main-content" className="container premium-dashboard">
 {user.is_anonymous&&<section className="section"><Eyebrow>Your membership is ready</Eyebrow><h3>Save your login.</h3><p>You have access in this browser. Use your welcome email to save your login and set a password for future visits.</p><Link className="text-link" href="/premium/account/setup">Set up my login</Link></section>}
 <PremiumResearchHeader kind="Dashboard" title="Your research dashboard" summary="The latest perspective, the market backdrop, and the opportunities worth following. All in one place."/>
 <nav className="workspace-overview" aria-label="Research overview">
  <Link href="/premium/weekly-outlook"><Newspaper size={24}/><div><span>Weekly Outlook</span><strong>{outlook?`Issue ${researchNumber(outlook.id)?.replace('#','')}`:'Coming soon'}</strong><small>{outlook?`Week of ${premiumDate(outlook.weekOf)}`:'Market context and the week ahead'}</small></div></Link>
  <Link href="/premium/opportunities"><Compass size={24}/><div><span>Current opportunities</span><strong>{current.length} research files</strong><small>Active positions and setups to watch</small></div></Link>
  <Link href="/premium/market-strength"><ChartNoAxesCombined size={24}/><div><span>Sector Gauge</span><strong>{snapshot?`${snapshot.fundCount} ETF proxies`:'Explore sectors'}</strong><small>{snapshot?`Data through ${formatDate(snapshot.asOf)}`:'Compare strength across six timeframes'}</small></div></Link>
 </nav>
 <div className="workspace-feature-grid">
 <section className="workspace-panel"><Eyebrow>Latest Weekly Outlook</Eyebrow>{outlook?<><h2>{outlook.title}</h2><p>{outlook.summary}</p><p className="support-note">Published {premiumDate(outlook.publishedAt)}</p><div className="outlook-posture"><Eyebrow>Market posture</Eyebrow><p>{outlook.marketPosture}</p>{outlook.secondaryPosture&&<p className="support-note">{outlook.secondaryPosture}</p>}</div><Link className="button" style={{marginTop:24}} href="/premium/weekly-outlook">Read Weekly Outlook</Link></>:<p>No published Weekly Outlook yet.</p>}</section>
 <section className="workspace-panel workspace-panel-secondary"><Eyebrow>The market backdrop</Eyebrow><h2>Follow the leadership.</h2><p>Compare sector strength before exploring an individual setup.</p>{outlook&&<OutlookSectorFocus outlook={outlook}/>}<p className="workspace-gauge-note">Compare total return or strength versus SPY across six timeframes. Leadership is an input to research, not an automatic opportunity.</p><Link className="text-link" href="/premium/market-strength">Explore Sector Gauge</Link></section>
 </div>
 <section className="section"><SectionHeader label="Your research board" title="Current opportunities" href="/premium/opportunities" linkText="View all opportunities"/>{current.length?<div className="editorial-grid">{current.map(o=><OpportunityCard key={o.id} opportunity={o}/>)}</div>:<OpportunityEmptyState/>}</section><ToolsIUse/>
 </main>;
}
