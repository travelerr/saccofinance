import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {premiumDate,type Opportunity} from '@/lib/premium-content';
import {compactLevels,decisionFor,rewardRisk} from '@/lib/opportunity-presentation';
import './opportunities.css';
export default function OpportunityCard({opportunity:o}:{opportunity:Opportunity}){
 const d=decisionFor(o),rr=rewardRisk(o);
 return <article className="watch-card opportunity-card compact-opportunity" data-status={o.tradeStatus}>
  <div className="compact-heading"><div><h3>{o.ticker}</h3><p>{o.company}</p></div><span className="opportunity-status">{o.boardPlacement==='long-term'?'Long-term holding':o.tradeStatus}</span></div>
  <p className="opportunity-meta">{[o.sector,...(o.etfTickers||[])].join(' / ')}</p>
  <p className="compact-plan">{d.plan}</p>
  {!o.trade&&<p className="opportunity-meta">No position opened{['Developing','Confirmed'].includes(o.tradeStatus)?' · Status describes the research setup':''}.</p>}
  <dl className="compact-levels">{compactLevels(o).map(l=><div key={l.label} data-tone={!/\d/.test(l.value)?'neutral':/result/i.test(l.label)?(l.value.includes('-')?'risk':'reward'):/stop/i.test(l.label)?'risk':/target|premium received/i.test(l.label)?'reward':/entry|basis|credit/i.test(l.label)?'entry':'neutral'}><dt>{l.label}</dt><dd>{l.value}</dd></div>)}</dl>
  {rr&&<p className="compact-ratio">Reward / risk <strong>{rr}</strong>{o.id==='opportunity-009'?' at $72.50':o.trade?' at documented entry':d.entryLabel==='Reference price'?' at reference price':' at proposed entry'}</p>}
  <p className="compact-catalyst"><strong>{o.tradeStatus==='Closed'?'Closure':'Next catalyst / decision'}</strong>{d.catalyst}</p>
  <footer><span>Updated {premiumDate(o.updatedAt)}</span><Link className="text-link" href={`/premium/opportunities/${o.slug}`}>View setup <ArrowRight size={16}/></Link></footer>
 </article>;
}
export function OpportunityEmptyState(){return <div className="opportunity-empty"><h3>No published opportunities yet.</h3><p>Reviewed setups will appear here after completing the research process.</p></div>;}
