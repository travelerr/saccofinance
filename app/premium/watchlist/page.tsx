import Link from 'next/link';
import {requirePremium} from '@/lib/premium-access';
import {publishedWatchlists,watchlistStockHref} from '@/lib/premium-watchlist';
import {premiumDate} from '@/lib/premium-content';
import './watchlist.css';
export const metadata={title:'Watchlist | Sacco Premium',robots:{index:false,follow:false}};
export default async function Watchlist(){
 await requirePremium();const editions=publishedWatchlists();
 return <main id="main-content" className="container watchlist-page"><header><p className="eyebrow">SACCO PREMIUM / ON MY RADAR</p><h1>Watchlist</h1><p>Stocks I’m researching. Select a name for notes and setup details.</p></header>{editions.map((edition,index)=><section id={edition.id} key={edition.id} className="section watchlist-edition"><p className="eyebrow">{index===0?'LATEST WATCHLIST':'PREVIOUS WATCHLIST'} · {premiumDate(edition.date)}</p><ul className="watchlist-list" aria-label={edition.title}>{edition.candidates.map(stock=><li key={stock.ticker}><Link className="watchlist-row" href={watchlistStockHref(edition.id,stock.ticker)}><strong>{stock.ticker}</strong><span className="watchlist-company">{stock.company}</span><span className="watchlist-status">{stock.tentative?'Tentative':stock.whyWatching||stock.confirmation||stock.invalidation||stock.researchHref?'View research':'Notes coming soon'}</span><span className="watchlist-arrow" aria-hidden="true">→</span></Link></li>)}</ul></section>)}<p className="watchlist-note">Research candidates, not entry signals. See the <Link href="/premium/opportunities">Opportunity Board</Link> for detailed plans and documented positions.</p></main>;
}
