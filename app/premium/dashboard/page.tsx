import '@/components/premium/auth.css';
import Link from 'next/link';
import PremiumResearchHeader,{researchNumber,premiumDate} from '@/components/premium/research-header';
import {requirePremium} from '@/lib/premium-access';
import OpportunityCard,{OpportunityEmptyState} from '@/components/premium/opportunity-card';
import {getPublishedOpportunities,weeklyOutlooks} from '@/lib/premium-opportunities';
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
 const user=await requirePremium();
 const outlook=weeklyOutlooks.filter(o=>o.publicationState==='published').sort((a,b)=>b.weekOf.localeCompare(a.weekOf))[0];
 const current=getPublishedOpportunities().filter(isCurrentOpportunity);
 let snapshot:StrengthSnapshot|null=null;
 try{snapshot=JSON.parse(await readFile(path.join(process.cwd(),'data/market-strength/latest.json'),'utf8'));}catch{}
 return <main id="main-content" className="container premium-dashboard"><PremiumNavigation/>{user.is_anonymous&&<section className="section"><Eyebrow>Your membership is ready</Eyebrow><h3>Save your login.</h3><p>You have access in this browser. Use your welcome email to save your login and set a password for future visits.</p><Link className="text-link" href="/premium/account/setup">Set up my login</Link></section>}<PremiumResearchHeader kind="Research Home" title={<>YOUR RESEARCH.<br/><span>THE NEXT STEP.</span></>} summary="Start with the market context. Follow sector strength into reviewed stock setups. Return to the conditions that change the thesis."/><section className="section"><SectionHeader label="Start with the environment" title="Weekly Outlook" href="/premium/weekly-outlook" linkText="Open Weekly Outlook"/>{outlook?<><Eyebrow>Issue {researchNumber(outlook.id)?.replace('#','')} / Week of {premiumDate(outlook.weekOf)}</Eyebrow><h3>{outlook.title}</h3><p style={{marginTop:16,maxWidth:900}}>{outlook.summary}</p><p className="support-note">Published {premiumDate(outlook.publishedAt)} · Sunday perspective {premiumDate(outlook.perspectiveDate||outlook.weekOf)}</p></>:<p>No published Weekly Outlook yet.</p>}</section><section className="section"><SectionHeader label="The sector-strength input" title="Sector Gauge" href="/premium/market-strength" linkText="Open Sector Gauge"/><p>{snapshot?`${snapshot.fundCount} ETF proxies across six timeframes. Saved data through ${formatDate(snapshot.asOf)}.`:'Snapshot unavailable. Open the Sector Gauge to check the latest saved data.'}</p><p>Compare each fund’s total return or its return versus SPY. Leadership is an input to further ETF and stock research, rather than an automatic opportunity.</p></section><section className="section"><SectionHeader label="Reviewed setups" title="Opportunities" href="/premium/opportunities" linkText="Explore Opportunities"/>{current.length?<div className="editorial-grid">{current.map(o=><OpportunityCard key={o.id} opportunity={o}/>)}</div>:<OpportunityEmptyState/>}</section></main>;
}
