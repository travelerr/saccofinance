import Link from 'next/link';
import {requirePremium} from '@/lib/premium-access';
import {publishedWatchlists} from '@/lib/premium-watchlist';
import {premiumDate} from '@/lib/premium-content';
import './watchlist.css';
export const metadata={title:'Watchlist | Sacco Premium',robots:{index:false,follow:false}};
export default async function Watchlist(){
 await requirePremium();const editions=publishedWatchlists();
 return <main id="main-content" className="container watchlist-page"><header><p className="eyebrow">SACCO PREMIUM / ON MY RADAR</p><h1>Watchlist</h1><p>A look at the stocks I’m researching between trades. Follow the developing ideas here and find detailed plans and documented positions on the <Link href="/premium/opportunities">Opportunity Board</Link>.</p></header>{editions.map((edition,index)=><section id={edition.id} key={edition.id} className="section"><p className="eyebrow">{index===0?'LATEST WATCHLIST':'PREVIOUS WATCHLIST'} · {premiumDate(edition.date)}</p><h2>{edition.title}</h2><p className="watchlist-intro">{edition.introduction}</p><div className="watchlist-grid">{edition.candidates.map(stock=><article className="watchlist-card" key={stock.ticker}><div className="watchlist-card-heading"><h3>{stock.ticker}</h3><span>{stock.tentative?'Tentative':'Research candidate'}</span></div><p>{stock.company}</p>{stock.whyWatching&&<p><strong>Why I’m watching:</strong> {stock.whyWatching}</p>}{stock.confirmation&&<p><strong>What I need to see:</strong> {stock.confirmation}</p>}{stock.invalidation&&<p><strong>What would change my view:</strong> {stock.invalidation}</p>}{stock.researchHref&&<Link className="text-link" href={stock.researchHref}>Read existing dated research →</Link>}</article>)}</div></section>)}<p className="watchlist-note">Watchlist inclusion does not establish a position or an order. Entry, stop and target levels will only appear when documented. Research can change as conditions develop.</p></main>;
}
