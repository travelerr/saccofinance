import StartHereVisit from '@/components/premium/start-here-visit';
import {affiliateTools} from '@/lib/affiliate-tools';
import ProposedLevels from '@/components/premium/proposed-levels';
import OptionPosition from '@/components/premium/option-position';
import RiskManagementUpdate from '@/components/premium/risk-management-update';
import TradeScenarios from '@/components/premium/trade-scenarios';
import WheelPositionDetails,{LegacyDisclosure} from '@/components/premium/wheel-position';
import TradeResult from '@/components/premium/trade-result';
import {requirePremium} from '@/lib/premium-access';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import OpportunityUpdates from '@/components/premium/opportunity-updates';
import {getPublishedOpportunity,getOpportunityUpdates} from '@/lib/premium-opportunities';
import {premiumDate,type OpportunityChart} from '@/lib/premium-content';
import {compactLevels,decisionFor,rewardRisk} from '@/lib/opportunity-presentation';
import {pageMetadata} from '@/lib/page-metadata';
import type {ReactNode} from 'react';
import '@/components/premium/opportunities.css';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){await requirePremium();const{slug}=await params;const o=getPublishedOpportunity(slug);return o?pageMetadata(`${o.ticker} — ${o.title}`,o.setupThesis,`/premium/opportunities/${o.slug}`,true):{title:'Opportunity unavailable',robots:{index:false,follow:false}};}
function Copy({text}:{text:string}){return <>{text.split(/\n\n/).map((p,i)=><p key={i}>{p}</p>)}</>;}
function Research({title,children}:{title:string;children:ReactNode}){return <details className="research-disclosure"><summary>{title}</summary><div className="research-disclosure-body">{children}</div></details>;}
export default async function Page({params}:Props){
 await requirePremium();const{slug}=await params;const o=getPublishedOpportunity(slug);if(!o)notFound();
 const d=decisionFor(o),rr=rewardRisk(o),updates=getOpportunityUpdates(o.id),latest=updates.at(-1);
 const figures=o.charts||(o.chart?[o.chart]:[]),primary=figures.find(c=>(c.placement||'setup')==='setup');
 const chartView=(chart:OpportunityChart)=><figure key={chart.src} className="opportunity-detail-chart"><Image unoptimized src={chart.src} alt={chart.alt} width={chart.width||3286} height={chart.height||1840} sizes="(max-width: 900px) 100vw, 60vw"/><figcaption>{chart.source&&<strong>{chart.source} · </strong>}{chart.caption}{chart.asOf&&<> · Chart as of {premiumDate(chart.asOf)}</>} · <a href={chart.src} target="_blank" rel="noopener">View full-size chart</a>{chart.affiliateTool&&<a className="chart-tool-link" href={affiliateTools.find(t=>t.id===chart.affiliateTool)!.url} target="_blank" rel="noopener sponsored" data-affiliate-placement="opportunity_chart">Explore {affiliateTools.find(t=>t.id===chart.affiliateTool)!.name} ↗</a>}</figcaption></figure>;
 const used=new Set<string>(primary?[primary.src]:[]);
 const charts=(placement:OpportunityChart['placement'])=>figures.filter(c=>!used.has(c.src)&&(c.placement||'setup')===placement).map(c=>{used.add(c.src);return chartView(c);});
 const framework=[['Position started',o.trade?(o.trade.enteredAt?premiumDate(o.trade.enteredAt):'Exact purchase dates not documented'):undefined],['Quantity',o.trade?.quantity!==undefined?`${o.trade.quantity} shares`:undefined],['Consolidation range',o.setupRange],['Next area after a confirmed breakout',o.nextAreaToWatch],['Entry / average cost',o.trade?.entryPrice!==undefined?`$${o.trade.entryPrice}`:undefined],['Preferred add / reassessment',o.preferredAddZone],['Stop / invalidation',o.trade?.stopPrice!==undefined?`$${o.trade.stopPrice}`:undefined],['Target 1',o.trade?.firstTargetPrice!==undefined?`$${o.trade.firstTargetPrice}`:undefined],['Target 2 / stretch',o.trade?.secondTargetPrice!==undefined?`$${o.trade.secondTargetPrice}`:undefined],['Breakout area',o.confirmation],['Preferred entry framework',o.entryFramework],['Secondary entry',o.secondaryEntry],['Risk / invalidation',o.riskInvalidation]].filter(([,v])=>v);
 return <main id="main-content" className="container opportunity-detail-page decision-page"><StartHereVisit step="opportunity"/><article data-research-id={o.id} data-research-type="opportunity">
 <header className="decision-header"><p className="eyebrow">Opportunity #{o.id.split('-').at(-1)} · {o.sector}{o.etfTickers?.length?` / ${o.etfTickers.join(', ')}`:''}</p><h1>{o.ticker} <span>{o.company}</span></h1><div className="decision-tags"><strong className="opportunity-status">{o.boardPlacement==='long-term'?'Long-term holding · Shares open':o.tradeStatus}</strong><span>{o.strategy||'Documented research'}</span><span>Technical stage: {o.technicalStage||'Unassigned'}</span><time dateTime={o.updatedAt}>Updated {premiumDate(o.updatedAt)}</time></div></header>
 {o.learningLesson&&<aside className="latest-opportunity-update"><div><h2><a href={o.learningLesson.href}>{o.learningLesson.title} →</a></h2><p>{o.learningLesson.description}</p></div></aside>}
 <div className={`decision-overview ${primary?'':'without-chart'}`}>
 <section className="current-plan" aria-labelledby="current-plan-title"><h2 id="current-plan-title">My current plan</h2><p className="plan-lead">{d.plan}</p>{!o.trade&&<p className="opportunity-meta">No position opened. These are conditional research levels.</p>}<dl className="compact-levels">{compactLevels(o).map(l=><div key={l.label}><dt>{l.label}</dt><dd>{l.value}</dd></div>)}</dl>{rr&&<p className="compact-ratio">Reward / risk <strong>{rr}</strong>{o.id==='opportunity-009'?' at $72.50':o.trade?' at documented entry':' at proposed entry'}</p>}<h3>{o.tradeStatus==='Closed'?'Current status':'What would prompt reassessment'}</h3><p>{d.condition}</p><h3>{o.tradeStatus==='Closed'?'Closed':'Next catalyst / decision'}</h3><p>{d.catalyst}</p></section>
 {primary&&<div className="primary-chart">{chartView(primary)}{o.tradeStatus==='Closed'&&<p className="opportunity-meta">Historical chart · The trade is closed; chart levels are not current instructions.</p>}</div>}
 </div>
 {latest&&<aside className="latest-opportunity-update"><div><p className="eyebrow">Latest dated update · {premiumDate(latest.eventDate||latest.publishedAt)}</p><h2>{latest.title}</h2><p>{latest.explanation.split('\n\n')[0]}</p></div><a className="text-link" href={`#${latest.id}`}>Read update &amp; timeline →</a></aside>}
 <div className="decision-thesis">{[['Why I’m interested',d.why],['What supports the setup',d.support],['What could change my mind',d.risks]].map(([title,bullets])=><section key={title as string}><h2>{title as string}</h2><ul>{(bullets as string[]).map(b=><li key={b}>{b}</li>)}</ul></section>)}</div>
 {o.breakdownVideo&&<section className="opportunity-breakdown"><h2>Watch my breakdown</h2><p>Recorded {premiumDate(o.breakdownVideo.recordedAt)} · Later written updates take precedence.</p><iframe title={o.breakdownVideo.title} src={`https://www.youtube-nocookie.com/embed/${o.breakdownVideo.youtubeId}`} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></section>}
 <section className="full-opportunity-research" aria-labelledby="full-research-title"><p className="eyebrow">Full research · Published {premiumDate(o.publishedAt)}</p><h2 id="full-research-title">{o.title}</h2>{o.summary&&<p>{o.summary}</p>}{o.companyNote&&<p>{o.companyNote}</p>}{o.tradeStatus==='Closed'&&<aside className="opportunity-history-note"><h3>Historical research — trade closed</h3><p>The research and dated levels below preserve the original thesis and decisions. They do not describe an open position. Current results are documented above and in the timeline.</p></aside>}{o.originalResearchAt&&<p>Original research: {premiumDate(o.originalResearchAt)}</p>}{o.addedToArchiveAt&&<p>Added to archive: {premiumDate(o.addedToArchiveAt)} · Original research date: {o.researchPublishedAt?premiumDate(o.researchPublishedAt):'Not established'}</p>}{o.positionOrigin==='Legacy'&&<LegacyDisclosure/>}{o.discoveryLabel&&o.discoveryChain&&<p>{o.discoveryLabel}: {o.discoveryChain.join(' → ')}</p>}
 {o.closingCommentary&&<Research title="Closing the trade"><Copy text={o.closingCommentary}/></Research>}
 <Research title={o.tradeStatus==='Closed'?'Documented result and historical levels':'Complete plan and position details'}><Copy text={o.nextCondition}/><ProposedLevels opportunity={o}/><RiskManagementUpdate opportunity={o}/><OptionPosition opportunity={o}/><TradeResult opportunity={o}/><WheelPositionDetails opportunity={o}/>{!o.wheel&&<dl className="research-framework">{framework.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}{o.targets&&<ul>{o.targets.map(t=><li key={t}>{t}</li>)}</ul>}<TradeScenarios opportunity={o}/></Research>
 {o.articleSections?o.articleSections.map(s=><Research key={s.title} title={s.title}><Copy text={s.body}/>{s.chartPlacement&&charts(s.chartPlacement)}{s.title==='The Technical Setup'&&<>{charts('setup')}{charts('confirmation')}</>}{s.title==='Wall Street And Quant Ratings'&&charts('framework')}{s.sources&&<ul>{s.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener">{source.label}</a></li>)}</ul>}</Research>):<>
 <Research title="Sector / ETF thesis — why it surfaced"><Copy text={o.whySurfaced}/>{charts('origin')}</Research>
 <Research title="Technical setup"><Copy text={o.setupThesis}/>{charts('setup')}{o.technicalConfirmation&&<Copy text={o.technicalConfirmation}/>} {charts('confirmation')}{charts('framework')}</Research>
 <Research title={o.fundamentalHeading||'Company fundamentals'}><Copy text={o.fundamentalCase}/>{charts('fundamentals')}</Research>
 {o.researchSections?.map(s=><Research key={s.title} title={s.title}><Copy text={s.body}/>{s.table&&<div className="opportunity-research-table" tabIndex={0} role="region" aria-label={s.title}><table><caption>Reported shares held · March 31 → June 30, 2026</caption><thead><tr>{s.table.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{s.table.rows.map(row=><tr key={row[0]}>{row.map((cell,i)=>i===0?<th key={i} scope="row">{cell}</th>:<td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>}{s.sources&&<ul>{s.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener">{source.label}</a></li>)}</ul>}</Research>)}
 <Research title="Risks and what changes the thesis">{o.primaryRisks?.map(r=><div key={r.title}><h3>{r.title}</h3><Copy text={r.explanation}/></div>)}<Copy text={o.thesisChanges}/></Research>
 <Research title="My full perspective"><Copy text={o.justinsTake}/></Research></>}
 {o.catalysts?.length&&<Research title="Catalysts"><ul>{o.catalysts.map(c=><li key={c}>{c}</li>)}</ul></Research>}
 {figures.filter(c=>!used.has(c.src)).length>0&&<Research title="Supporting charts">{figures.filter(c=>!used.has(c.src)).map(chartView)}</Research>}
 </section>
 <section id="updates" className="section opportunity-detail-section"><h2>Complete update timeline</h2><OpportunityUpdates updates={updates}/></section>
 </article></main>;
}
