import type {Opportunity} from '@/lib/premium-content';
import {tradeScenarios} from '@/lib/trade-scenarios';
const dollars=(n:number)=>n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2});
export default function TradeScenarios({opportunity:o}:{opportunity:Opportunity}){
 if(!o.showTradeScenarios)return null;
 const s=tradeScenarios(o.trade);if(!s)return null;
 return <aside className="trade-scenarios"><h3>Trade Geometry / Scenarios</h3><p>Based on {o.trade?.quantity} shares at the documented {dollars(o.trade!.entryPrice!)} entry. Initial capital: <strong>{dollars(s.capital)}</strong>.</p><div className="trade-scenario-grid"><div><h4>Risk to the stop</h4><p>{dollars(s.riskPerShare)} per share · {s.riskPct.toFixed(1)}%</p><strong>{dollars(s.riskTotal)} position risk</strong></div>{s.targets.map(t=><div key={t.label}><h4>{t.label} · {dollars(t.price)}</h4><p>{dollars(t.gainPerShare)} per share · {t.gainPct.toFixed(1)}% upside</p><p>{t.rewardRisk.toFixed(2)}:1 reward / risk</p><strong>{dollars(t.gainTotal)} potential gross gain</strong></div>)}</div><p className="opportunity-meta">Hypothetical outcomes, not realized profit or forecasts. Target 2 is a stretch scenario, not the expected base case. Figures exclude fees and taxes; gaps and execution slippage can increase the loss beyond the stop calculation.</p></aside>;
}
