import {premiumDate,type Opportunity} from '@/lib/premium-content';
/** Read-only view of canonical position data; never records a fill or assignment. */
export default function OutlookPosition({opportunity:o}:{opportunity:Opportunity}){
 if(!o.trade)return null;
 const call=o.wheel?.fills.find(fill=>fill.id===o.wheel?.currentCallId);
 const assignmentShares=call&&o.trade.quantity!==undefined?Math.min(o.trade.quantity,call.contracts*call.multiplier):undefined;
 const stockScenario=call&&assignmentShares!==undefined&&o.trade.entryPrice!==undefined?(call.strike-o.trade.entryPrice)*assignmentShares:undefined;
 return <><dl className="premium-research-metadata">{[[o.wheel?'Broker basis':'Entry',o.trade.entryPrice],['Stop',o.trade.stopPrice],['Target 1',o.trade.firstTargetPrice],['Target 2 / Stretch',o.trade.secondTargetPrice]].map(([label,value])=>value!==undefined&&<div key={label}><dt>{label}</dt><dd>${value}</dd></div>)}{o.trade.quantity!==undefined&&<div><dt>Shares</dt><dd>{o.trade.quantity}</dd></div>}{o.wheel&&<><div><dt>Position origin</dt><dd>Legacy</dd></div><div><dt>Strategy</dt><dd>{o.strategy}</dd></div></>}</dl>{o.preferredAddZone&&<p className="support-note">Preferred add / reassessment: {o.preferredAddZone} · Conditional; not filled</p>}{call&&<p className="support-note">Current covered call: {premiumDate(call.expiresAt)} · ${call.strike} strike · {call.contracts} contract{call.contracts===1?'':'s'}</p>}{stockScenario!==undefined&&<p className="support-note">If assigned at the documented strike: ${stockScenario.toLocaleString('en-US')} gross stock component only. Conditional, not realized; excludes option economics, fees and taxes.</p>}</>;
}
