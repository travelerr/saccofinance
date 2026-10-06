import {getOpportunityUpdates} from '@/lib/premium-opportunities';
import {premiumDate,type Opportunity} from '@/lib/premium-content';
export default function RiskManagementUpdate({opportunity:o}:{opportunity:Opportunity}){
 if(!o.riskUpdate)return null;
 const history=getOpportunityUpdates(o.id).filter(u=>u.trade&&u.trade.stopPrice!==undefined);
 return <aside className="risk-management-update" aria-label="Current risk management update"><p className="eyebrow">Risk update · {premiumDate(o.riskUpdate.date)}</p><h2>{o.riskUpdate.title}</h2><dl className="premium-research-metadata"><div><dt>Previous stop</dt><dd>${o.riskUpdate.previousStop}</dd></div><div><dt>New stop</dt><dd>${o.trade?.stopPrice}</dd></div><div><dt>Target unchanged</dt><dd>${o.trade?.firstTargetPrice}</dd></div></dl><h3>Stop history</h3><ol>{history.map((u,i)=><li key={u.id}>{i===0?'Original stop':premiumDate(u.eventDate||u.publishedAt)}: ${u.trade!.stopPrice}</li>)}</ol><p><strong>Execution and extended-hours risk</strong></p><p>{o.riskUpdate.warning}</p><a className="text-link" href="#updates">Read the full decision and trade plan →</a></aside>;
}
