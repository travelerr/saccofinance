import {premiumDate,type Opportunity} from '@/lib/premium-content';
export default function RiskManagementUpdate({opportunity:o}:{opportunity:Opportunity}){
 if(!o.riskUpdate)return null;
 return <aside className="risk-management-update" aria-label="Current risk management update"><p className="eyebrow">Risk update · {premiumDate(o.riskUpdate.date)}</p><h2>{o.riskUpdate.title}</h2><dl className="premium-research-metadata"><div><dt>Previous stop</dt><dd>${o.riskUpdate.previousStop}</dd></div><div><dt>New stop</dt><dd>${o.trade?.stopPrice}</dd></div><div><dt>Target unchanged</dt><dd>${o.trade?.firstTargetPrice}</dd></div></dl><p><strong>Premarket gap risk</strong></p><p>{o.riskUpdate.warning}</p><a className="text-link" href="#updates">Read the full decision and trade plan →</a></aside>;
}
