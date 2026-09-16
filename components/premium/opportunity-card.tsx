import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {premiumDate,type Opportunity} from '@/lib/premium-content';
import './opportunities.css';
export default function OpportunityCard({opportunity:o}:{opportunity:Opportunity}){
 return <article className="watch-card opportunity-card"><div className="watch-top"><span>{o.ticker}</span><span className="opportunity-status">Trade Status: {o.tradeStatus.toUpperCase()}</span></div><p className="opportunity-meta">{o.company} / {o.sector}{o.etfTickers?.length?` / ${o.etfTickers.join(', ')}`:''}</p><h3><Link href={`/premium/opportunities/${o.slug}`}>{o.title}</Link></h3><p>{o.summary||o.setupThesis}</p>{o.trade&&<p className="opportunity-meta">Entry: ${o.trade.entryPrice}{o.trade.stopPrice!==undefined&&<> · Stop: ${o.trade.stopPrice}</>}{o.trade.firstTargetPrice!==undefined&&<> · Target 1: ${o.trade.firstTargetPrice}</>}</p>}<div className="opportunity-next"><span className="eyebrow">What needs to happen next?</span><p>{o.nextStepSummary||o.nextCondition}</p></div><p className="opportunity-meta">Technical Stage: {o.technicalStage} · Updated {premiumDate(o.updatedAt)}</p><Link className="text-link" href={`/premium/opportunities/${o.slug}`}>Read the setup <ArrowUpRight size={16}/></Link></article>;
}
export function OpportunityEmptyState(){return <div className="opportunity-empty"><h3>No published opportunities yet.</h3><p>Reviewed Stage 2 setups will appear here after completing the Sacco Financial research framework.</p></div>;}
