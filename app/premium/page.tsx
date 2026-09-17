import Link from 'next/link';
import Image from 'next/image';
import {ArrowDown,ArrowUpRight,Check} from 'lucide-react';
import {Eyebrow,SectionHeader} from '@/components/brand/editorial';
import {billingEnabled,billingMode} from '@/lib/billing/model';
import {pageMetadata} from '@/lib/page-metadata';
import {getPublishedOpportunity,weeklyOutlooks} from '@/lib/premium-opportunities';
import {opportunityStatuses,premiumDate} from '@/lib/premium-content';
import styles from './sales.module.css';

export const dynamic='force-dynamic';
export const metadata=pageMetadata('Sacco Premium — The Research Process','Follow Justin Sacco’s market research from sector leadership to stock setups and documented trades. Full Premium access for $10/month or $100/year.','/premium');
const process=[
 ['Market','Understand the environment.','Weekly Outlook establishes the market backdrop, the week’s important catalysts, and what could change my view.'],
 ['Sector','Find where leadership develops.','Sector Gauge compares selected sectors and themes across timeframes to focus the next investigation.'],
 ['ETF','Drill into the area.','Investigate relevant ETFs and their major holdings. Sector strength narrows the search; it does not finish the research.'],
 ['Stock','Research the business.','Evaluate fundamentals, expectations, catalysts, and risks. A beaten-down stock needs more than a low share price.'],
 ['Setup','Make the structure earn it.','Look for stocks forming Stage 1 bases and potential Stage 2 advances. Define confirmation conditions and what would invalidate the idea.'],
 ['Trade','Document the decision.','When I take a position, follow the documented entry, stop, targets, thesis, and dated updates. Many candidates never become trades.'],
];
const faqs=[
 ['Is Sacco Premium a signals service?','No. Premium documents my research, the opportunities I’m investigating, and trades I personally take. It is not a command to copy trades, a day-trading service, or full portfolio access.'],
 ['How often are Opportunities added?','There is no forced schedule. An Opportunity earns its place through sector analysis, technical review, fundamental research, risk analysis, and my own judgment. If nothing qualifies in a given week, nothing needs to be added.'],
 ['What is the difference between Confirmed and Active?','Confirmed means the technical confirmation criteria have been met. Active means I have actually entered a documented trade. Trade status and technical stage are separate: an Active trade can still be waiting for Stage 2 confirmation.'],
 ['What is included, and where do I find it?','Both plans include the Premium Dashboard, Weekly Outlook, Sector Gauge, all current Opportunities, and dated Opportunity updates. Documented trades include entry, stop/invalidation, and targets when available. Research lives inside the member site. Sector Gauge uses saved historical prices; check its data date rather than treating it as a live feed.'],
 ['How do I get access after payment?','After Stripe verifies payment, you can enter Premium immediately in the browser used for checkout. Your welcome email connects the purchase to a permanent account so you can return on other devices. Use email-link login or set an optional password.'],
 ['Can I cancel anytime?','Yes. Manage or cancel through Account & Billing. Your plan renews automatically until canceled. Cancellation stops future renewal charges, and access continues through your paid period. Under the existing Terms, payments are generally non-refundable.'],
 ['Is this investment advice?','No. Premium provides educational and informational research, not personalized investment advice. You make your own decisions. Investing involves risk, including loss of principal, and no investment result is guaranteed.'],
];

export default function Premium(){
 const enabled=billingEnabled();
 const join=enabled?'/premium/join':'/premium/login';
 // Selected public marketing excerpts only. Never pass whole member records to a client component.
 const zs=getPublishedOpportunity('zscaler-001');
 const outlook=weeklyOutlooks.filter(o=>o.publicationState==='published').sort((a,b)=>b.weekOf.localeCompare(a.weekOf))[0];
 const levels=zs?[
  ['Initial entry',zs.trade?`$${zs.trade.entryPrice}`:'Not documented'],
  ['Stop / invalidation',zs.trade?.stopPrice!==undefined?`$${zs.trade.stopPrice}`:'Not documented'],
  ['Target 1',zs.trade?.firstTargetPrice!==undefined?`$${zs.trade.firstTargetPrice}`:'Not documented'],
  ['Breakout area',zs.confirmation||'Not documented'],
 ]:[];
 const joinLabel=enabled?'Join Sacco Premium':'Member sign in';
 return <main id="main-content" className={`container ${styles.page}`}>
  <section className={styles.hero}>
   <div className={styles.heroCopy}><Eyebrow>Sacco Financial / Premium</Eyebrow>
    <h1>FIND BETTER STOCK OPPORTUNITIES.<br/><span>BEFORE THE MOVE IS OBVIOUS.</span></h1>
    <p>Sacco Premium is the research process I use to find where market leadership is developing, identify stocks setting up inside those areas, and track the opportunities I’m actually watching and trading.</p>
    <div className={styles.heroPrice}><strong>$10<span> / month</span></strong><p>Cancel anytime.</p></div>
    <div className="actions"><Link className="button" href={join}>{joinLabel}<ArrowUpRight size={18}/></Link><Link className="text-link" href="/premium/login">Sign in</Link></div>
    {enabled&&billingMode()==='test'&&<p className="support-note">Local sandbox preview. Checkout uses test payments.</p>}
    {!enabled&&<p className="support-note">Membership is currently available by invitation.</p>}
   </div>
   <div className={styles.heroResearch} aria-label="Selected public research preview">
    <div className={styles.previewTop}><span>SACCO <b>PREMIUM</b></span><span>THE RESEARCH DESK</span></div>
    <p className={styles.previewLabel}>MARKET → SECTOR → ETF → STOCK → SETUP → TRADE</p>
    {outlook&&<div className={styles.heroOutlook}><Eyebrow>Weekly Outlook / Week of {premiumDate(outlook.weekOf)}</Eyebrow><h3>{outlook.title}</h3><p>{outlook.summary}</p></div>}
    {zs&&<div className={styles.heroOpportunity}><div className={styles.previewTop}><strong>{zs.ticker} / {zs.company}</strong><span className={styles.status}>{zs.tradeStatus.toUpperCase()}</span></div><h3>{zs.title}</h3><p>{zs.nextStepSummary}</p><div className={styles.miniLevels}>{levels.slice(0,3).map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><p className={styles.date}>Documented {premiumDate(zs.updatedAt)} · Not a buy recommendation</p></div>}
    <a href="#process" className={styles.explore}>Follow the process <ArrowDown size={16}/></a>
   </div>
  </section>

  <section id="process" className={`section ${styles.processSection}`}><SectionHeader label="A deliberate research system" title="Stop looking for stocks at random."/>
   <ol className={styles.process}>{process.map(([label,title,copy],i)=><li key={label}><div className={styles.processNode}><span>0{i+1}</span><strong>{label}</strong>{i<process.length-1&&<ArrowDown size={18} aria-hidden="true"/>}</div><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
   <p className={styles.framework}>Market Context → Sector Strength → ETF Analysis → Stock Screening → Stage 1-to-Stage 2 Candidates → Setup Analysis → Trade Tracking</p>
  </section>

  {zs&&<section id="zscaler" className={`section ${styles.caseStudy}`}><SectionHeader label={`A real example / Documented ${premiumDate(zs.updatedAt)}`} title="From sector strength to a position."/>
   <div className={styles.chain}>{[zs.sector,...(zs.etfTickers||[]),zs.company,'Stage 1 base','Potential Stage 2',zs.trade?`$${zs.trade.entryPrice} entry`:'Watching'].map((label,i)=><span key={label}>{i>0&&<span aria-hidden="true">→ </span>}{label}</span>)}</div>
   <div className={styles.caseGrid}><div className={styles.story}><p className={styles.lead}>Cybersecurity led me to CIBR. CIBR led me to Zscaler.</p><p>{zs.whySurfaced.split('\n\n').slice(0,2).join('\n\n')}</p><p>{zs.setupThesis.split('\n\n')[1]}</p><blockquote>{zs.justinsTake}</blockquote></div>
    <aside className={styles.tradeSheet}><Eyebrow>Opportunity 001 / Research excerpt</Eyebrow><h3>{zs.company} <span>{zs.ticker}</span></h3><dl><div><dt>Trade status</dt><dd className={styles.status}>{zs.tradeStatus.toUpperCase()}</dd></div><div><dt>Technical stage</dt><dd>{zs.technicalStage}</dd></div>{levels.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className={styles.confirmation}><strong>Active ≠ technically confirmed.</strong><p>{zs.nextStepSummary} The documented trade and the technical transition are separate facts.</p></div><p className={styles.note}>Dated research, not a recommendation to buy ZS. The target is a documented objective, not a promised return. Read the full thesis, risks, and updates inside Premium.</p></aside>
   </div>
  </section>}

  <section className="section"><SectionHeader label="The tools behind the process" title="Context. Leadership. Conviction."/>
   <div className={styles.productRows}>
    <article><div><Eyebrow>01 / Weekly Outlook</Eyebrow><h3>What kind of market are we in?</h3></div><p>My market view, the important narratives and catalysts, areas worth watching, and what would change the outlook. Start with the environment before evaluating the individual idea.</p></article>
    <article><div><Eyebrow>02 / Sector Gauge</Eyebrow><h3>Where is leadership developing?</h3></div><p>Compare 24 selected sector and theme ETF proxies across six timeframes. View absolute performance or compare returns with SPY, then investigate the relevant ETFs and holdings. Saved historical data, not a real-time signal.</p></article>
    <article><div><Eyebrow>03 / Opportunities</Eyebrow><h3>Which stocks survived the work?</h3></div><div><p>Why it surfaced. The technical setup. What I’m waiting for. Fundamentals, catalysts, risks, and thesis changes. Entry, stop, and targets when I actually take a trade, with dated updates as the research develops.</p><div className={styles.statuses}>{opportunityStatuses.map(s=><span key={s}>{s}</span>)}</div><p className={styles.note}>Confirmed is a technical setup status. Active and Closed require documented trades.</p></div></article>
   </div>
  </section>

  <section className={`section ${styles.quality}`}><Eyebrow>Quality over quantity</Eyebrow><h2>SOME WEEKS,<br/><span>NOTHING MAKES THE BOARD.</span></h2><div><p>Premium isn’t built to manufacture a new stock pick every Monday. A scanner result is only the beginning.</p><p>An idea has to survive sector analysis, technical review, fundamental research, risk analysis, and one more question:</p><blockquote>“Would I actually put money into this?”</blockquote><p>If nothing survives the process, nothing needs to become an Opportunity or a trade.</p></div></section>

  <section className={`section ${styles.creator}`}><Image src="/images/headshot.jpg" alt="Justin Sacco, founder of Sacco Financial" width={1200} height={900} sizes="(max-width: 700px) 100vw, 40vw"/><div><Eyebrow>Why I built it</Eyebrow><h2>The investing product I wanted for myself.</h2><p>I’m Justin Sacco. Premium is where I turn my market research into a repeatable process—and document it as it develops.</p><p>You’ll see what I’m looking at, why it matters, what would make me act, what would change my mind, and when I put my own money behind an idea.</p><p>Free videos introduce the stories I’m investigating. Premium is where you can stay with the research after the video ends.</p><p className={styles.signature}>— Justin Sacco</p></div></section>

  <section id="inside" className="section"><SectionHeader label="Inside the membership" title="This is where the research lives."/>
   <div className={styles.deskPreview}><div className={styles.deskHeader}><strong>SACCO <span>PREMIUM</span></strong><span>Selected product preview</span></div><div className={styles.deskNav} aria-label="Member destinations preview"><strong>Dashboard</strong><span>Weekly Outlook</span><span>Sector Gauge</span><span>Opportunities</span></div>
    <div className={styles.deskContent}><div><Eyebrow>Weekly Outlook</Eyebrow><h3>{outlook?.title||'The market perspective.'}</h3>{outlook&&<><p className={styles.date}>Week of {premiumDate(outlook.weekOf)}</p><p>{outlook.summary}</p></>}<div className={styles.previewSections}><span>Market context</span><span>What changes my view</span><span>The closing game plan</span></div></div>
     <div className={styles.gaugePreview}><Eyebrow>Sector Gauge</Eyebrow><h3>Compare. Investigate. Focus.</h3><div className={styles.periods}>{['1W','1M','3M','6M','9M','12M'].map(p=><span key={p}>{p}</span>)}</div><div className={styles.gaugeMode}><strong>Absolute return</strong><span>vs. SPY</span></div><div className={styles.gaugeColumns}><span>Sector / ETF proxy</span><span>Return</span><span>Rank change</span></div><p>24 ETF proxies · Leaders &amp; laggards · Multiple timeframes</p><p className={styles.note}>Layout preview only. Market-data values remain inside the member tool; no public price feed is included here.</p></div>
    </div>{zs&&<div className={styles.deskFooter}><strong>{zs.ticker} / {zs.title}</strong><span>Trade status: {zs.tradeStatus} · Technical stage: {zs.technicalStage}</span></div>}
   </div><p className={styles.proofNote}>Selected excerpts from existing member research and a simplified product layout.<br/>Full analysis stays inside Premium.<br/>The <Link className="text-link" href="/premium/issue-001">archived Issue 001</Link> remains a separate sample.</p>
  </section>

  <section id="pricing" className="section"><SectionHeader label="One membership / Two billing options" title="Get the full research process."/>
   <div className={styles.offer}><div><p className={styles.lead}>Both plans include the same full access.</p><ul>{['Weekly Outlook and the Premium Dashboard','Sector Gauge','All current Opportunities and dated updates','Documented entry, stop/invalidation, and targets when I take a trade','Member account and subscription management'].map(item=><li key={item}><Check size={17} aria-hidden="true"/>{item}</li>)}</ul></div><div className={styles.plans}>{[['monthly','Monthly','$10','Billed monthly.'],['annual','Annual','$100','Billed annually. Save $20 versus 12 monthly payments.']].map(([plan,title,price,detail])=><article key={plan}><Eyebrow>{title}</Eyebrow><h3>{price}<span> / {plan==='monthly'?'month':'year'}</span></h3><p>{detail}</p><Link className="button" href={enabled?`/premium/join?plan=${plan}`:'/premium/login'} aria-label={enabled?`Join Sacco Premium — ${title.toLowerCase()}`:'Member sign in'}>{joinLabel}<ArrowUpRight size={16}/></Link></article>)}</div></div>
   <p className={styles.billing}>Cancel anytime through Account &amp; Billing.<br/>Renews automatically until canceled; access continues through your paid period.<br/>Payments are generally non-refundable.<br/><Link className="text-link" href="/terms">Terms</Link> · <Link className="text-link" href="/premium/login">Sign in</Link></p>
  </section>

  <section className="section faq-section"><SectionHeader label="Before you join" title="Straight answers."/>{faqs.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</section>
  <section className={`premium-bottom ${styles.closing}`}><Eyebrow>Market context. Sector leadership. Individual opportunities.</Eyebrow><h2>SEE WHAT<br/><span>I’M SEEING.</span></h2><p>The setups I’m actually researching and trading.<br/>$10/month · $100/year · Cancel anytime.</p><div className="actions"><Link href={join} className="button">{joinLabel}<ArrowUpRight size={18}/></Link><Link href="/premium/login" className="text-link">Sign in</Link></div><p className={styles.note}>Educational and informational research.<br/>Not personalized investment advice.<br/>Investing involves risk, including loss of principal.<br/><Link href="/disclosures">Disclosures</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></p></section>
 </main>;
}
