import StartHereVisit from '@/components/premium/start-here-visit';
import {Fragment} from 'react';
import OutlookPosition from './outlook-position';
import TradeResult from './trade-result';
import Link from 'next/link';
import PremiumResearchHeader,{researchNumber} from './research-header';
import {Eyebrow,SectionHeader} from '@/components/brand/editorial';
import {premiumDate,weeklyOutlookHref,type WeeklyOutlook} from '@/lib/premium-content';
import {getWeeklyOutlookOpportunities} from '@/lib/premium-opportunities';
import './weekly-outlook.css';
import './opportunities.css';

function Prose({text}:{text:string}){
 return <div className="outlook-prose">{text.split('\n\n').map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>;
}

// Render approved editorial copy in the canonical Outlook layout without rewriting it.
function ApprovedArticle({outlook}:{outlook:WeeklyOutlook}){
 const references=getWeeklyOutlookOpportunities(outlook);
 function inline(text:string):React.ReactNode{
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part,i)=>{
   if(part.startsWith('**')&&part.endsWith('**'))return <strong key={i}>{inline(part.slice(2,-2))}</strong>;
   if(part.startsWith('*')&&part.endsWith('*'))return <em key={i}>{inline(part.slice(1,-1))}</em>;
   return part.split(/(ServiceNow|Zscaler|Rocket Lab|Workiva|EPAM|MSTR|SMCI|RKLB|SPCX|WK|NOW|ZS)\b/g).map((word,j)=>{
    const opportunity=references.find(o=>o.ticker===word||o.company===word);
    return opportunity?<Link key={`${i}-${j}`} href={`/premium/opportunities/${opportunity.slug}`}>{word}</Link>:word;
   });
  });
 }
 const body=outlook.articleMarkdown!.replace(/^# [^\n]+\n\n/,'');
 return <>{body.split(/\n---\n/).map((section,index)=>{
  const blocks=section.trim().split(/\n\s*\n/);
  const heading=blocks[0]?.startsWith('## ')?blocks.shift()!.slice(3):null;
  return <Fragment key={index}><section className="section">{heading&&<SectionHeader title={heading}/>}<div className="outlook-prose outlook-approved-prose">{blocks.map((block,i)=>{
   if(block.startsWith('| ')){
    const rows=block.split('\n').filter((_,i)=>i!==1).map(line=>line.split('|').slice(1,-1).map(cell=>cell.trim()));
    return <div key={i} className="outlook-results-table"><table><caption>My confirmed personal results · Before additional fees and taxes</caption><thead><tr>{rows[0].map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.slice(1).map((row,j)=><tr key={j}><th scope="row">{inline(row[0])}</th><td>{inline(row[1])}</td></tr>)}</tbody></table></div>;
   }
   if(block.startsWith('### '))return <h3 key={i}>{inline(block.slice(4))}</h3>;
   if(block.startsWith('- '))return <ul key={i}>{block.split('\n').map((line,j)=><li key={j}>{inline(line.slice(2))}</li>)}</ul>;
   return <p key={i}>{block.split(/ {2}\n/).map((line,j)=><span key={j}>{j>0&&<br/>}{inline(line)}</span>)}</p>;
  })}</div></section>{index===0&&outlook.promotion&&<OutlookPromotionBlock promotion={outlook.promotion}/>}</Fragment>;
 })}{outlook.sources&&<details className="outlook-sources"><summary>Calendar and research sources · Checked October 17, 2026</summary><ul>{outlook.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></details>}{outlook.disclosure&&<aside className="section support-note"><h2>Disclosure</h2><p>{outlook.disclosure}</p></aside>}</>;
}

function OutlookPromotionBlock({promotion:p}:{promotion:NonNullable<WeeklyOutlook['promotion']>}){
 return <aside className="outlook-promotion" aria-label="Sacco Premium Special Offer"><Eyebrow>Sacco Premium Special Offer</Eyebrow><h2>{p.headline}</h2><Prose text={p.body}/><ul>{p.features.map(feature=><li key={feature}>{feature}</li>)}</ul><Prose text={p.conclusion}/><a className="button" href={p.url} target="_blank" rel="noopener sponsored" data-affiliate-placement="weekly_outlook">{p.cta}</a><p className="outlook-promotion-deadline"><strong>{p.terms}</strong></p></aside>;
}

export function OutlookSectorFocus({outlook}:{outlook:WeeklyOutlook}){
 return <dl className="outlook-focus">{outlook.sectorAreas?.map(item=><div key={item.classification}><dt>{item.classification}</dt><dd>{item.area}</dd></div>)}</dl>;
}
export function WeeklyOutlookArchive({outlooks}:{outlooks:WeeklyOutlook[]}){
 return <section className="section"><SectionHeader title="Weekly Outlook archive"/>{outlooks.map(outlook=><article className="outlook-archive-row" key={outlook.id}><Eyebrow>Issue {researchNumber(outlook.id)} · {premiumDate(outlook.publishedAt)}</Eyebrow><h3><Link href={weeklyOutlookHref(outlook)}>{outlook.title}</Link></h3><p>{outlook.summary}</p><Link className="text-link" href={weeklyOutlookHref(outlook)}>Read Issue {researchNumber(outlook.id)} →</Link></article>)}</section>;
}
export default function WeeklyOutlookResearch({outlook}:{outlook:WeeklyOutlook}){
 const opportunities=getWeeklyOutlookOpportunities(outlook);
 const current=outlook.separateClosedPositions?opportunities.filter(o=>o.tradeStatus!=='Closed'):opportunities;
 const closed=outlook.separateClosedPositions?opportunities.filter(o=>o.tradeStatus==='Closed'):[];
 const scenario=outlook.bitcoinScenario;
 const scenarioNet=scenario?scenario.netBitcoinValuePerShare*(scenario.bitcoinScenario/scenario.bitcoinReference):0;
 return <>
 <StartHereVisit step="outlook"/>
 <span hidden data-research-id={outlook.id} data-research-type="weekly_outlook"/>
 <PremiumResearchHeader kind="Weekly Outlook" identifier={`Issue ${researchNumber(outlook.id)}`} title={outlook.title} metadata={[{label:'Week',value:`${premiumDate(outlook.weekOf)}${outlook.weekEnd?` – ${premiumDate(outlook.weekEnd)}`:''}`},{label:'Published',value:premiumDate(outlook.publishedAt)}]}/>
 {outlook.marketPosture&&<div className="outlook-posture"><Eyebrow>Market posture</Eyebrow><p>{outlook.marketPosture}</p>{outlook.secondaryPosture&&<p className="support-note">{outlook.secondaryPosture}</p>}</div>}
 {outlook.articleMarkdown?<ApprovedArticle outlook={outlook}/>:<>
 <section className="section"><SectionHeader label="01" title="The Read"/><Prose text={outlook.read||outlook.summary||outlook.marketContext}/></section>
 <section className="section"><SectionHeader label="02" title={outlook.marketHeading||"Market Context"}/>{!!outlook.marketLevels?.length&&<dl className="premium-research-metadata outlook-levels">{outlook.marketLevels.map(level=><div key={level.index}><dt>{level.index} / Support</dt><dd>{level.support.toLocaleString('en-US')}</dd></div>)}</dl>}<Prose text={outlook.marketContext}/>{outlook.macroWatch&&<aside className="outlook-macro"><Eyebrow>What I’m watching</Eyebrow><h3>{outlook.macroWatch.title}</h3><Prose text={outlook.macroWatch.body}/></aside>}</section>
 <section className="section"><SectionHeader label="03" title={outlook.sectorHeading||"Sector Leadership"}/><Prose text={outlook.sectorFocus}/><OutlookSectorFocus outlook={outlook}/>{outlook.gaugeSummary&&<div className="outlook-gauge-summary"><Eyebrow>1-week Gauge · {premiumDate(outlook.gaugeSummary.asOf)}</Eyebrow><p>SPY: {outlook.gaugeSummary.benchmarkReturn.toFixed(2)}% · Dated research snapshot</p><ol>{outlook.gaugeSummary.groups.map((group,index)=><li key={group.ticker}><span className="outlook-gauge-rank">#{index+1}</span><div><strong>{group.name} / {group.ticker}</strong><span>Rank change: {group.rankChange===0?'unchanged':`${group.rankChange>0?'+':''}${group.rankChange}`}</span></div><strong>{group.returnPct>=0?'+':''}{group.returnPct.toFixed(2)}%</strong></li>)}</ol></div>}{outlook.sectorSnapshots?.map(sector=><article className="outlook-sector-snapshot" key={sector.ticker}><h3>{sector.name} / {sector.ticker}</h3><dl className="outlook-sector-periods">{sector.periods.map(period=><div key={period.period}><dt>{period.period}</dt><dd>{period.returnPct>=0?'+':''}{period.returnPct.toFixed(2)}%<span>Rank #{period.rank}</span></dd></div>)}</dl><Prose text={sector.commentary}/></article>)}<Link className="text-link" href="/premium/market-strength">Open Sector Gauge →</Link></section>
 <>{outlook.researchNotes?.map(note=><section className="section" key={note.title}><SectionHeader title={note.title}/><Prose text={note.body}/></section>)}</>
 <section className="section"><SectionHeader label="04" title="Current Opportunities"/>{current.map(opportunity=><article className="outlook-opportunity" key={opportunity.id}>
 <div className="outlook-opportunity-heading"><h3><Link href={`/premium/opportunities/${opportunity.slug}`}>{opportunity.company} — {opportunity.ticker}</Link></h3><span className="opportunity-status">{opportunity.tradeStatus.toUpperCase()}</span></div>
 {opportunity.technicalStage&&<p className="support-note">Technical stage: {opportunity.technicalStage}</p>}
 {outlook.separateClosedPositions?<OutlookPosition opportunity={opportunity}/>:opportunity.trade?<dl className="premium-research-metadata">{[['Entry',opportunity.trade.entryPrice],['Stop',opportunity.trade.stopPrice],['Target 1',opportunity.trade.firstTargetPrice]].map(([label,value])=>value!==undefined&&<div key={label}><dt>{label}</dt><dd>${value}</dd></div>)}{opportunity.trade.quantity!==undefined&&<div><dt>Shares</dt><dd>{opportunity.trade.quantity}</dd></div>}</dl>:<p className="support-note">NO POSITION · Breakout under evaluation</p>}
 {!outlook.separateClosedPositions&&outlook.bitcoinScenario&&opportunity.preferredAddZone&&<p className="support-note">Preferred add / reassessment: {opportunity.preferredAddZone} · Conditional; not filled</p>}
 {outlook.bitcoinScenario&&!opportunity.trade&&<dl className="premium-research-metadata">{[['Preferred pullback',opportunity.entryFramework],['Prior breakout',opportunity.confirmation],['Prior base invalidation',opportunity.riskInvalidation]].map(([label,value])=>value&&<div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
 <Prose text={outlook.opportunityCommentary?.find(item=>item.opportunityId===opportunity.id)?.body||opportunity.summary||opportunity.setupThesis}/><Link className="text-link" href={`/premium/opportunities/${opportunity.slug}`}>Read the full {opportunity.ticker} Opportunity →</Link>
 </article>)}</section>
 {closed.length>0&&<section className="section"><SectionHeader title="Closed / Recent Actions"/>{closed.map(opportunity=><article className="outlook-opportunity" key={opportunity.id}><div className="outlook-opportunity-heading"><h3><Link href={`/premium/opportunities/${opportunity.slug}`}>{opportunity.company} — {opportunity.ticker}</Link></h3><span className="opportunity-status">CLOSED</span></div><Prose text={outlook.opportunityCommentary?.find(item=>item.opportunityId===opportunity.id)?.body||''}/><TradeResult opportunity={opportunity}/><Link className="text-link" href={`/premium/opportunities/${opportunity.slug}`}>Read the closed {opportunity.ticker} Opportunity →</Link></article>)}</section>}
 {scenario&&<aside className="outlook-scenario" aria-label="MSTR educational scenario"><Eyebrow>Educational scenario · NOT A PRICE TARGET</Eyebrow><h3>{scenario.heading}</h3><p className="support-note">Research inputs: mNAV {scenario.mnav.toFixed(2)}x · Net Bitcoin value per share ~${scenario.netBitcoinValuePerShare.toFixed(2)} · Bitcoin reference ~${scenario.bitcoinReference.toLocaleString('en-US')}</p><p>${scenario.netBitcoinValuePerShare.toFixed(2)} × (${scenario.bitcoinScenario.toLocaleString('en-US')} / ${scenario.bitcoinReference.toLocaleString('en-US')}) ≈ ${Math.round(scenarioNet)} net BTC value / share</p><p>${Math.round(scenarioNet)} × {scenario.mnav.toFixed(2)}x mNAV ≈ ${Math.round(scenarioNet*scenario.mnav)} MSTR</p><p><strong>Static MSTR scenario: {scenario.displayRange}</strong></p><h4>Assumptions</h4><ul>{scenario.assumptions.map(assumption=><li key={assumption}>{assumption}</li>)}</ul><Prose text={scenario.explanation}/>{opportunities.find(o=>o.ticker==='MSTR')?.trade?.firstTargetPrice!==undefined&&<p className="support-note">MSTR trade Target 1 remains ${opportunities.find(o=>o.ticker==='MSTR')!.trade!.firstTargetPrice}.</p>}</aside>}
 {outlook.longTermRadar?.length&&<section className="section"><SectionHeader title="Long-Term Radar"/><p className="support-note">Outside the Opportunity Board · No new swing trades</p>{outlook.longTermRadar.map(item=><article className="outlook-radar" key={item.title}><h3>{item.title}</h3><Prose text={item.body}/></article>)}</section>}
 <section className="section"><SectionHeader label="05" title="What Matters This Week"/><div className="outlook-calendar">{outlook.events?.map(event=><article key={`${event.day}-${event.title}`}><Eyebrow>{event.day}</Eyebrow><div><h3>{event.title}</h3>{event.description&&<Prose text={event.description}/>}<p>{event.relevance}</p></div></article>)}</div></section>
 <section className="section"><SectionHeader label="06" title={outlook.planHeading||"The Trade Plan"}/><Prose text={outlook.gamePlan}/></section>
 {outlook.gaugeSummary&&outlook.sources&&<details className="outlook-sources"><summary>Calendar and research sources</summary><ul>{outlook.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></details>}
 </>}
 </>;
}
