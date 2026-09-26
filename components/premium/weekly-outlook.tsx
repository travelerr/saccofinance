import Link from 'next/link';
import PremiumResearchHeader,{researchNumber} from './research-header';
import {Eyebrow,SectionHeader} from '@/components/brand/editorial';
import {premiumDate,weeklyOutlookHref,type WeeklyOutlook} from '@/lib/premium-content';
import {getWeeklyOutlookOpportunities} from '@/lib/premium-opportunities';
import './weekly-outlook.css';

function Prose({text}:{text:string}){
 return <div className="outlook-prose">{text.split('\n\n').map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>;
}
export function OutlookSectorFocus({outlook}:{outlook:WeeklyOutlook}){
 return <dl className="outlook-focus">{outlook.sectorAreas?.map(item=><div key={item.classification}><dt>{item.classification}</dt><dd>{item.area}</dd></div>)}</dl>;
}
export function WeeklyOutlookArchive({outlooks}:{outlooks:WeeklyOutlook[]}){
 return <section className="section"><SectionHeader title="Weekly Outlook archive"/>{outlooks.map(outlook=><article className="outlook-archive-row" key={outlook.id}><Eyebrow>Issue {researchNumber(outlook.id)} · {premiumDate(outlook.publishedAt)}</Eyebrow><h3><Link href={weeklyOutlookHref(outlook)}>{outlook.title}</Link></h3><p>{outlook.summary}</p><Link className="text-link" href={weeklyOutlookHref(outlook)}>Read Issue {researchNumber(outlook.id)} →</Link></article>)}</section>;
}
export default function WeeklyOutlookResearch({outlook}:{outlook:WeeklyOutlook}){
 const opportunities=getWeeklyOutlookOpportunities(outlook);
 const scenario=outlook.bitcoinScenario;
 const scenarioNet=scenario?scenario.netBitcoinValuePerShare*(scenario.bitcoinScenario/scenario.bitcoinReference):0;
 return <>
 <PremiumResearchHeader kind="Weekly Outlook" identifier={`Issue ${researchNumber(outlook.id)}`} title={outlook.title} metadata={[{label:'Week',value:`${premiumDate(outlook.weekOf)}${outlook.weekEnd?` – ${premiumDate(outlook.weekEnd)}`:''}`},{label:'Published',value:premiumDate(outlook.publishedAt)}]}/>
 {outlook.marketPosture&&<div className="outlook-posture"><Eyebrow>Market posture</Eyebrow><p>{outlook.marketPosture}</p></div>}
 <section className="section"><SectionHeader label="01" title="The Read"/><Prose text={outlook.read||outlook.summary||outlook.marketContext}/></section>
 <section className="section"><SectionHeader label="02" title="Market Context"/><dl className="premium-research-metadata outlook-levels">{outlook.marketLevels?.map(level=><div key={level.index}><dt>{level.index} / Support</dt><dd>{level.support.toLocaleString('en-US')}</dd></div>)}</dl><Prose text={outlook.marketContext}/></section>
 <section className="section"><SectionHeader label="03" title={outlook.sectorHeading||"Sector Leadership"}/><Prose text={outlook.sectorFocus}/><OutlookSectorFocus outlook={outlook}/>{outlook.sectorSnapshots?.map(sector=><article className="outlook-sector-snapshot" key={sector.ticker}><h3>{sector.name} / {sector.ticker}</h3><dl className="outlook-sector-periods">{sector.periods.map(period=><div key={period.period}><dt>{period.period}</dt><dd>{period.returnPct>=0?'+':''}{period.returnPct.toFixed(2)}%<span>Rank #{period.rank}</span></dd></div>)}</dl><Prose text={sector.commentary}/></article>)}<Link className="text-link" href="/premium/market-strength">Open Sector Gauge →</Link></section>
 <section className="section"><SectionHeader label="04" title="Current Opportunities"/>{opportunities.map(opportunity=><article className="outlook-opportunity" key={opportunity.id}>
 <div className="outlook-opportunity-heading"><h3><Link href={`/premium/opportunities/${opportunity.slug}`}>{opportunity.company} — {opportunity.ticker}</Link></h3><span className="opportunity-status">{opportunity.tradeStatus.toUpperCase()}</span></div>
 {opportunity.technicalStage&&<p className="support-note">Technical stage: {opportunity.technicalStage}</p>}
 {opportunity.trade?<dl className="premium-research-metadata">{[['Entry',opportunity.trade.entryPrice],['Stop',opportunity.trade.stopPrice],['Target 1',opportunity.trade.firstTargetPrice]].map(([label,value])=>value!==undefined&&<div key={label}><dt>{label}</dt><dd>${value}</dd></div>)}{opportunity.trade.quantity!==undefined&&<div><dt>Shares</dt><dd>{opportunity.trade.quantity}</dd></div>}</dl>:<p className="support-note">NO POSITION · Breakout under evaluation</p>}
 {outlook.bitcoinScenario&&opportunity.preferredAddZone&&<p className="support-note">Preferred add / reassessment: {opportunity.preferredAddZone} · Conditional; not filled</p>}
 {outlook.bitcoinScenario&&!opportunity.trade&&<dl className="premium-research-metadata">{[['Preferred pullback',opportunity.entryFramework],['Prior breakout',opportunity.confirmation],['Prior base invalidation',opportunity.riskInvalidation]].map(([label,value])=>value&&<div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
 <Prose text={outlook.opportunityCommentary?.find(item=>item.opportunityId===opportunity.id)?.body||opportunity.summary||opportunity.setupThesis}/><Link className="text-link" href={`/premium/opportunities/${opportunity.slug}`}>Read the full {opportunity.ticker} Opportunity →</Link>
 </article>)}</section>
 {scenario&&<aside className="outlook-scenario" aria-label="MSTR educational scenario"><Eyebrow>Educational scenario · NOT A PRICE TARGET</Eyebrow><h3>{scenario.heading}</h3><p className="support-note">Research inputs: mNAV {scenario.mnav.toFixed(2)}x · Net Bitcoin value per share ~${scenario.netBitcoinValuePerShare.toFixed(2)} · Bitcoin reference ~${scenario.bitcoinReference.toLocaleString('en-US')}</p><p>${scenario.netBitcoinValuePerShare.toFixed(2)} × (${scenario.bitcoinScenario.toLocaleString('en-US')} / ${scenario.bitcoinReference.toLocaleString('en-US')}) ≈ ${Math.round(scenarioNet)} net BTC value / share</p><p>${Math.round(scenarioNet)} × {scenario.mnav.toFixed(2)}x mNAV ≈ ${Math.round(scenarioNet*scenario.mnav)} MSTR</p><p><strong>Static MSTR scenario: {scenario.displayRange}</strong></p><h4>Assumptions</h4><ul>{scenario.assumptions.map(assumption=><li key={assumption}>{assumption}</li>)}</ul><Prose text={scenario.explanation}/>{opportunities.find(o=>o.ticker==='MSTR')?.trade?.firstTargetPrice!==undefined&&<p className="support-note">MSTR trade Target 1 remains ${opportunities.find(o=>o.ticker==='MSTR')!.trade!.firstTargetPrice}.</p>}</aside>}
 {outlook.longTermRadar?.length&&<section className="section"><SectionHeader title="Long-Term Radar"/><p className="support-note">Outside the Opportunity Board · No new swing trades</p>{outlook.longTermRadar.map(item=><article className="outlook-radar" key={item.title}><h3>{item.title}</h3><Prose text={item.body}/></article>)}</section>}
 <section className="section"><SectionHeader label="05" title="What Matters This Week"/><div className="outlook-calendar">{outlook.events?.map(event=><article key={`${event.day}-${event.title}`}><Eyebrow>{event.day}</Eyebrow><div><h3>{event.title}</h3>{event.description&&<Prose text={event.description}/>}<p>{event.relevance}</p></div></article>)}</div></section>
 <section className="section"><SectionHeader label="06" title="The Trade Plan"/><Prose text={outlook.gamePlan}/></section>
 </>;
}
