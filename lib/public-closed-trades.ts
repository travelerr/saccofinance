import type {Opportunity} from './premium-content';
export type ClosedTradePreview={id:string;ticker:string;company:string;closedAt:string;returnPct:number|null;basis:string;approximate:boolean};
/** Deliberately limited public fields; never serialize private research into the carousel. */
export function publicClosedTrades(records:Opportunity[]):ClosedTradePreview[]{
 return records.filter((o):o is Opportunity & {tradeStatus:'Closed'}=>o.publicationState==='published'&&o.tradeStatus==='Closed')
 .sort((a,b)=>b.trade!.exitedAt!.localeCompare(a.trade!.exitedAt!)||b.id.localeCompare(a.id)).slice(0,10).map(o=>{
  if(o.tradeStatus!=='Closed')throw new Error('Closed trade required');
  const option=o.optionPosition,entry=o.trade.entryPrice;
  const returnPct=option?(option.status==='Closed'&&option.realizedProfit!==null&&option.collateral>0?option.realizedProfit/option.collateral*100:null):(entry!==undefined&&entry>0?(o.trade.exitPrice-entry)/entry*100:null);
  return {id:o.id,ticker:o.ticker,company:o.company,closedAt:o.trade.exitedAt,returnPct:returnPct!==null&&Number.isFinite(returnPct)?returnPct:null,basis:option?'Return on cash collateral':'Share-price return',approximate:/approximately|approximate entry/i.test(o.trade.documentation)};
 });
}
