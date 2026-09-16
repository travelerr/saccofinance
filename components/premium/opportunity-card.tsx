import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {premiumDate,type Opportunity} from '@/lib/premium-content';
import './opportunities.css';
export default function OpportunityCard({opportunity:o}:{opportunity:Opportunity}){
 return <article className="watch-card opportunity-card"><div className="watch-top"><span>{o.ticker}</span><span className="opportunity-status">{o.status}</span></div><p className="opportunity-meta">{o.company} / {o.sector}{o.etfTickers?.length?` / ${o.etfTickers.join(', ')}`:''}</p><h3><Link href={`/premium/opportunities/${o.slug}`}>{o.title}</Link></h3><p>{o.setupThesis}</p><div className="opportunity-next"><span className="eyebrow">What needs to happen next?</span><p>{o.nextCondition}</p></div><p className="opportunity-meta">{o.stage} · Updated {premiumDate(o.updatedAt)}</p><Link className="text-link" href={`/premium/opportunities/${o.slug}`}>Read the setup <ArrowUpRight size={16}/></Link></article>;
}
export function OpportunityEmptyState(){return <div className="opportunity-empty"><h3>No published opportunities yet.</h3><p>Reviewed Stage 2 setups will appear here after completing the Sacco Financial research framework.</p></div>;}
