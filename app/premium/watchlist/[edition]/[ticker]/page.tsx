import Link from 'next/link';
import {notFound} from 'next/navigation';
import {requirePremium} from '@/lib/premium-access';
import {findWatchlistStock} from '@/lib/premium-watchlist';
import {premiumDate} from '@/lib/premium-content';
import '../../watchlist.css';
export const metadata={title:'Watchlist Research | Sacco Premium',robots:{index:false,follow:false}};
export default async function WatchlistStock({params}:{params:Promise<{edition:string;ticker:string}>}){
 await requirePremium();const route=await params;const found=findWatchlistStock(route.edition,route.ticker);if(!found)notFound();const {edition,stock}=found;
 const notes=[['Why I’m watching',stock.whyWatching],['What I need to see',stock.confirmation],['What would change my view',stock.invalidation]].filter(([,body])=>body);
 return <main id="main-content" className="container watchlist-page watchlist-detail"><Link className="text-link" href={'/premium/watchlist#'+edition.id}>← Watchlist</Link><header><p className="eyebrow">{stock.tentative?'TENTATIVE CANDIDATE':'ON MY RADAR'} · {premiumDate(edition.date)}</p><h1>{stock.ticker}</h1><p>{stock.company}</p></header>{notes.length?notes.map(([title,body])=><section className="section" key={title}><h2>{title}</h2><p className="watchlist-detail-notes">{body}</p></section>):<section className="section"><h2>Research notes coming soon</h2><p className="watchlist-detail-notes">This name is on my research list. I’ll add my reasoning, the confirmation I’m waiting for, and what would change my view as I review the setup.</p></section>}{stock.researchHref&&<p><Link className="text-link" href={stock.researchHref}>Read existing dated Opportunity Board research →</Link></p>}<p className="watchlist-note">Watchlist inclusion is not an entry signal or a documented position.</p></main>;
}
