import JoinButtons from '@/components/premium/join-buttons';
import PaymentMethods from '@/components/premium/payment-methods';
import SampleForm from '@/components/premium/sample-form';
import {sampleEnabled} from '@/lib/sample/server';
import {PremiumPlanProvider,PlanChoice} from '@/components/premium/plan-choice';
import CheckoutButton from '@/components/premium/checkout-button';
import MobileJoin from '@/components/premium/mobile-join';
import ClosedTradesPreview from '@/components/premium/closed-trades-preview';
import {publicClosedTrades} from '@/lib/public-closed-trades';
import {trialOfferEnabled} from '@/lib/billing/trial-offer';
import {redirect} from 'next/navigation';
import {premiumAccess} from '@/lib/premium-access';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpRight,Check,LockKeyhole,Play,Mail} from 'lucide-react';
import {Eyebrow,SectionHeader} from '@/components/brand/editorial';
import {billingEnabled,billingMode} from '@/lib/billing/model';
import {pageMetadata} from '@/lib/page-metadata';
import {getPublishedOpportunities,weeklyOutlooks} from '@/lib/premium-opportunities';
import {premiumDate} from '@/lib/premium-content';
import styles from './sales.module.css';

export const dynamic='force-dynamic';
export const metadata=pageMetadata('Sacco Premium — The Research Process','Follow Justin Sacco’s documented research, from market leadership to stock setups and completed trades. $10/month or $100/year.','/premium');
const process=[
 ['Market','Start with the broader environment and the catalysts ahead.'],
 ['Sector','Find where leadership is developing across sectors and themes.'],
 ['ETF','Explore the relevant ETFs and the companies inside them.'],
 ['Stock','Research the business, expectations, fundamentals, and risks.'],
 ['Setup','Define the technical structure and what would invalidate it.'],
 ['Trade','Document my entry, stop, targets, and decisions over time.'],
];
const features=[
 ['01 / Weekly Outlook','Start with the market.','My view of the week ahead: the narratives that matter, upcoming catalysts, and what would change my perspective.',['Market context and sector leadership','Earnings and economic catalysts','A clear closing game plan'],'A new perspective each week'],
 ['02 / Sector Gauge','Find the leadership.','Compare 24 sector and theme ETF proxies across six timeframes, with absolute returns and relative performance against SPY.',['Leaders and laggards','Six timeframes, including vs. SPY','Dated historical data, not live signals'],'Check the data date inside the tool'],
 ['03 / Opportunity Board','Follow the research.','See why an idea surfaced, what I’m waiting for, and what could change my mind. Follow the decisions when I take a trade.',['Technical setups and business research','Entries, stops, and targets when documented','Dated updates and closed trades'],'New ideas when the process qualifies them'],
];
const included=['Weekly Outlook and research archive','Sector Gauge: 24 ETF proxies, six timeframes','Opportunity Board and dated trade updates','Closed trades and risk-management history','Learning Library and member dashboard'];
const faqs=[
 ['Is Sacco Premium a signals service?','No. Premium is documented research, not a command to copy trades. I explain why an opportunity surfaced, what I’m waiting for, and what would invalidate it. It is educational and informational, not personalized investment advice.'],
 ['How often are Opportunities added?','There is no forced schedule. Some weeks, nothing makes the board. An idea has to survive sector analysis, technical review, fundamental research, risk analysis, and my own judgment.'],
 ['What do I get when I join?','Both plans include the current Weekly Outlook and archive, Sector Gauge, the Opportunity Board, dated updates, closed-trade histories, and Learning Library. Start with the dashboard, then explore the research at your own pace.'],
 ['How do payment and access work?','Checkout runs through Stripe. After payment is verified, Premium opens in the browser used for checkout. Your welcome email connects the purchase to a permanent account so you can return on other devices. Use email-link login or set an optional password.'],
 ['Can I cancel anytime?','Yes. Manage or cancel through Account & Billing. Your plan renews automatically until canceled. Cancellation stops future renewal charges, and paid access continues through your paid period. Payments are generally non-refundable under the existing Terms.'],
 ['Is this suitable for someone still learning?','The Learning Library walks through my research process, and Opportunities explain the reasoning behind each setup. You remain responsible for your own investment decisions. Premium does not promise returns or provide personalized advice.'],
];
export default async function Premium(){
 const access=await premiumAccess();
 if(access.user&&access.allowed)redirect('/premium/dashboard');
 const enabled=billingEnabled();const trial=enabled&&await trialOfferEnabled();
 const join=enabled?'/premium/join':'/premium/login';
 const joinLabel=enabled?(trial?'Start your 30-day trial':'Join Sacco Premium'):'Member sign in';
 const outlook=weeklyOutlooks.filter(o=>o.publicationState==='published').sort((a,b)=>b.weekOf.localeCompare(a.weekOf))[0];
 // Only deliberately selected public fields leave the canonical member records.
 const trades=publicClosedTrades(getPublishedOpportunities());const latest=trades[0];
 return <PremiumPlanProvider><main id="main-content" className={`container ${styles.page}`}>
  <nav className={styles.sectionNav} aria-label="Explore Premium"><span>SACCO <b>PREMIUM</b></span><div><a href="#inside">What’s inside</a><a href="#process">The process</a><a href="#record">Closed trades</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></div></nav>
  <div className={styles.introLayout}>
   <section className={styles.hero}>
    <div id="premium-hero-copy" className={styles.heroCopy}><Eyebrow>Independent research / Documented decisions</Eyebrow>
     <h1>Follow the market.<br/>Trade the opportunities.<br/><span>See the process.</span></h1>
     <p>The research I use to find developing market leadership, investigate stock setups, and document the trades I actually take—wins and losses included.</p>
     <div className={styles.heroCommunity}><strong>50+ Premium members and counting</strong><span>Trusted by a community of 100,000+ worldwide.</span></div>
     <PlanChoice/>
     <p className={styles.assurance}><Check size={16} aria-hidden="true"/> Both plans include full access. Cancel anytime.</p>
     {trial&&<p className={styles.trial}>30 days free for new monthly members. Card required; then $10/month. Cancel before billing to avoid a charge.</p>}
     <div className={styles.actions}><CheckoutButton className="button" href={join} trial={trial}>{joinLabel}<ArrowUpRight size={18}/></CheckoutButton></div>
     <p className={styles.micro}><LockKeyhole size={14} aria-hidden="true"/> Secure checkout through Stripe · <Link href="/premium/login">Member sign in</Link></p>
     <div className={styles.heroSecondaryActions}><a className={styles.videoAction} href="#premium-video-heading"><Play size={17} aria-hidden="true"/>See how it works</a>{sampleEnabled()&&<a className={styles.sampleAction} href="#sample"><Mail size={17} aria-hidden="true"/>Get a free sample</a>}</div>
     {enabled&&billingMode()==='test'&&<p className={styles.micro}>Local sandbox preview. Checkout uses test payments.</p>}
     {!enabled&&<p className={styles.micro}>Membership is currently available by invitation.</p>}
    </div>
    <aside className={styles.heroResearch} aria-label="Selected public research preview">
     <div className={styles.previewTop}><strong>THE RESEARCH DESK</strong><span>Inside Premium</span></div>
     <div className={styles.deskBody}>{outlook&&<><Eyebrow>Weekly Outlook · {premiumDate(outlook.weekOf)}</Eyebrow><h2>{outlook.title}</h2><p>{outlook.summary}</p><div className={styles.posture}><span>Market posture</span><strong>{outlook.marketPosture}</strong></div></>}
      <div className={styles.gaugePreview}><Eyebrow>Sector Gauge / A look at the tool</Eyebrow><div className={styles.periods}>{['1W','1M','3M','6M','9M','12M'].map(t=><span key={t}>{t}</span>)}</div><div className={styles.gaugeRows}>{[['Compare','Absolute return / vs. SPY'],['Investigate','Sector and theme ETF proxies'],['Focus','Leaders, laggards, rank changes']].map(([a,b])=><div key={a}><strong>{a}</strong><span>{b}</span></div>)}</div></div>
      {latest&&<><Eyebrow>Documented trades</Eyebrow><div className={styles.deskTrade}><div><span>Most recent closed trade</span><strong>{latest.ticker} · {premiumDate(latest.closedAt)}</strong></div><strong className={latest.returnPct!==null&&latest.returnPct<0?styles.loss:styles.gain}>{latest.returnPct===null?'Not available':`${latest.approximate?'≈ ':''}${latest.returnPct>0?'+':''}${latest.returnPct.toFixed(2)}%`}</strong></div></>}
     </div>
    </aside>
   </section>
   <section id="premium-introduction" className={styles.videoSection} aria-labelledby="premium-video-heading"><div><Eyebrow>A five-minute introduction</Eyebrow><h2 id="premium-video-heading">See how the pieces fit together.</h2><p>Take a look at how I research the market, find potential opportunities, and document my actual trading decisions.</p></div><div className={styles.videoFrame}><iframe src="https://www.youtube-nocookie.com/embed/WDtnaojVatU" title="See How Sacco Premium Works — Introduction by Justin Sacco" width="560" height="315" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div><div className={styles.videoCta}><JoinButtons join={join} trial={trial}/></div></section>
  </div>
  <section className={styles.block}><SectionHeader label="Straight answers, up front" title="Know what you’re joining."/><div className={styles.objections}>{[
   ['Research, not signals.','I show my reasoning, what I’m waiting for, and what would change my mind. You make your own decisions.'],
   ['No forced stock picks.','Some weeks, nothing makes the board. I’d rather wait for a setup than manufacture a new idea to fill a schedule.'],
   ['Cancel in your account.','Manage renewal through Account & Billing. Cancel anytime and keep paid access through the end of your billing period.'],
  ].map(([h,p])=><article key={h}><Check size={20} aria-hidden="true"/><h3>{h}</h3><p>{p}</p></article>)}</div></section>
  <section id="inside" className={styles.block}><SectionHeader label="What members get" title="Three tools. One research process."/><div className={styles.features}>{features.map(([number,title,copy,items,cadence])=><article key={number as string}><Eyebrow>{number}</Eyebrow><h3>{title}</h3><p>{copy}</p><ul>{(items as string[]).map(item=><li key={item}>{item}</li>)}</ul><span className={styles.cadence}>{cadence}</span></article>)}</div><div className={styles.library}><div><Eyebrow>Also included / Learning Library</Eyebrow><h3>Learn how I do the research.</h3><p>Watch the complete process in Lesson 1, then follow a real-time stock research walkthrough in Lesson 2.</p></div><a href="#pricing" className="text-link">Included with both plans <ArrowUpRight size={17}/></a></div></section>
  <section id="process" className={styles.block}><SectionHeader label="The research process" title="Market first. Trade last."/><p className={styles.sectionIntro}>Each step narrows the search. A strong sector is a starting point—not a reason to skip the company, the setup, or the risk.</p><ol className={styles.process}>{process.map(([label,copy],i)=><li key={label}><span>STEP 0{i+1}</span><h3>{label}</h3><p>{copy}</p></li>)}</ol><blockquote className={styles.processQuote}>“Some weeks, nothing makes the board. That’s discipline you can follow.”</blockquote></section>
  <div id="record" className={styles.record}><ClosedTradesPreview trades={trades} join={join} trial={trial}/><div className={styles.worked}><Eyebrow>A worked example / Zscaler, first trade</Eyebrow><h3>The target wasn’t reached. The exit plan still mattered.</h3><p>My first Zscaler trade closed when its raised stop triggered on October 7, 2026. The original $220 target was not reached. The full history shows how I progressively adjusted risk as the trade developed.</p><div className={styles.stops}><span>Stop history</span>{['$160','$195','$205','$210'].map((s,i)=><span key={s}>{i>0&&<b aria-hidden="true">→ </b>}<strong>{s}</strong></span>)}<span>Closed at $210.07</span></div><p className={styles.micro}>A separate trade from the later Zscaler position. This example does not guarantee profitable exits on other trades.</p></div></div>
  <section className={styles.block}><SectionHeader label="After you join" title="A clear place to start."/><p className={styles.sectionIntro}>Your dashboard brings the research together. Here’s a simple reading path for your first visit.</p><div className={styles.firstWeek}>{[
   ['01 / Get the context','Read the Outlook','Start with the market backdrop, the important catalysts, and what could change my view.'],
   ['02 / Find leadership','Explore the Sector Gauge','Compare sector and theme returns across timeframes before narrowing your search.'],
   ['03 / Follow an idea','Open an Opportunity','Read the thesis, the technical setup, and the conditions that would invalidate it.'],
   ['04 / Learn the method','Watch a lesson','See the process in action, then return to the board as the research develops.'],
  ].map(([step,h,p])=><article key={step}><Eyebrow>{step}</Eyebrow><h3>{h}</h3><p>{p}</p></article>)}</div></section>
  <section id="pricing" className={styles.block}><SectionHeader label="One membership / Two billing options" title="Same full access. Your choice of plan."/><div className={styles.plans}>{['monthly','annual'].map(plan=><article className={plan==='annual'?styles.best:''} key={plan}>{plan==='annual'&&<span className={styles.badge}>Best Value · 2 months free</span>}<Eyebrow>{plan==='monthly'?'Monthly':'Annual'}</Eyebrow><h3>{plan==='monthly'?'$10':'$8.33'}<span> / month</span></h3><p className={styles.planTerms}>{plan==='annual'?<><strong>Billed $100/year.</strong> Save $20 versus 12 monthly payments.</>:trial?'30 days free, then $10/month. New monthly members only. Card required.':'Billed $10/month.'}</p><ul>{included.map(item=><li key={item}><Check size={17} aria-hidden="true"/>{item}</li>)}</ul><CheckoutButton trial={trial} className="button" href={enabled?`/premium/join?plan=${plan}`:'/premium/login'}>{!enabled?'Member sign in':plan==='annual'?'Join annual — $100/year':joinLabel}<ArrowUpRight size={17}/></CheckoutButton></article>)}</div><div className={styles.billing}><LockKeyhole size={18} aria-hidden="true"/><div><strong>Secure checkout through Stripe.</strong><PaymentMethods/><p>Renews automatically until canceled. Cancel through Account &amp; Billing. Payments are generally non-refundable. Review the final amount and terms at checkout. <Link href="/terms">Terms →</Link></p></div></div></section>
  <section className={`${styles.block} ${styles.creator}`}><Image src="/images/headshot.jpg" alt="Justin Sacco, founder of Sacco Financial" width={1200} height={900} sizes="(max-width: 700px) 100vw, 35vw"/><div><Eyebrow>Justin Sacco / Founder, Sacco Financial</Eyebrow><h2>The research I wanted to follow.</h2><p>Premium is where I turn my market research into a repeatable process—and document it as it develops.</p><p>You’ll see what I’m looking at, why it matters, what would make me act, and when I put my own money behind an idea.</p><p>Free videos introduce the stories I’m investigating. Premium is where you can stay with the research after the video ends.</p><JoinButtons join={join} trial={trial}/></div></section>
  {sampleEnabled()&&<SampleForm/>}
  <section id="faq" className={`${styles.block} ${styles.faq}`}><SectionHeader label="Before you join" title="Everything else, answered."/>{faqs.map(([q,a])=><details key={q} open><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</section>
  <section className={styles.closing}><Eyebrow>Research you can follow</Eyebrow><h2>See the reasoning.<br/><span>Stay with the process.</span></h2><p>Market context, developing opportunities, and documented decisions.<br/>$10/month or $100/year. Cancel anytime.</p><div className={styles.bottomButtons}><JoinButtons join={join} trial={trial}/><Link href="/premium/login" className={`button ${styles.memberButton}`}>Member sign in</Link></div><p className={styles.micro}>Educational and informational research. Not personalized investment advice. Investing involves risk, including loss of principal. <Link href="/disclosures">Disclosures</Link></p></section>
  <MobileJoin href={join} enabled={enabled} trial={trial}/>
 </main></PremiumPlanProvider>;
}
