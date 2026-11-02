import Link from 'next/link';
import {outlookBriefs,outlookCalendar} from '@/lib/outlook-briefs';
import type {WeeklyOutlook,Opportunity} from '@/lib/premium-content';

export default function OutlookBrief({outlook,opportunities}:{outlook:WeeklyOutlook;opportunities:Opportunity[]}){
 const brief=outlookBriefs[outlook.id];
 if(!brief)return null;
 return <div className="research-brief">
  <aside className="research-take"><p className="eyebrow">My Market Outlook</p>{outlook.marketPosture&&<strong className="brief-posture">{outlook.marketPosture}</strong>}<p className="research-take-copy">{brief.take}</p><span className="research-date-note">Dated perspective for this issue · Current trade details are on the Opportunity Board.</span></aside>
  <nav className="research-jump-links" aria-label="Outlook sections">{['Market','Sectors','Catalysts','Positions','My plan'].map((name,i)=><a key={name} href={`#outlook-brief-${i+1}`}>{String(i+1).padStart(2,'0')} {name}</a>)}</nav>
  <section id="outlook-brief-1" className="research-brief-section"><p className="eyebrow">01 / The backdrop</p><h2>Market Conditions</h2><p>{brief.market}</p></section>
  <section id="outlook-brief-2" className="research-brief-section"><p className="eyebrow">02 / Relative strength</p><h2>Sectors I&apos;m Watching</h2><p>{brief.sectors}</p><Link className="text-link" href="/premium/market-strength">Explore the current Sector Gauge →</Link></section>
  <section id="outlook-brief-3" className="research-brief-section"><p className="eyebrow">03 / The week ahead</p><h2>This Week&apos;s Catalysts</h2><p className="research-date-note">Selected events from the original issue. Times and qualifications remain in the complete research below.</p><div className="brief-calendar">{outlookCalendar(outlook).map((e,i)=><div key={`${e.day}-${i}`}><h3>{e.day}</h3><p>{e.event}</p></div>)}</div></section>
  <section id="outlook-brief-4" className="research-brief-section"><p className="eyebrow">04 / My portfolio</p><h2>My Positions &amp; Trade Updates</h2><p>{brief.positions}</p><div className="research-jump-links">{opportunities.map(o=><Link key={o.id} href={`/premium/opportunities/${o.slug}`}>{o.ticker} · Latest record →</Link>)}</div></section>
  <section id="outlook-brief-5" className="research-brief-section research-week-plan"><p className="eyebrow">05 / What comes next</p><h2>My Plan for the Week</h2><p>{brief.plan}</p></section>
 </div>;
}
