import type {TradeEntry} from './premium-content';
/** Gross hypothetical outcomes from documented levels, never realized performance. */
export function tradeScenarios(trade:TradeEntry|undefined){
 const {entryPrice:entry,stopPrice:stop,quantity,firstTargetPrice:first,secondTargetPrice:second}=trade||{};
 if(entry===undefined||stop===undefined||quantity===undefined||![entry,stop,quantity].every(Number.isFinite)||entry<=stop||stop<=0||quantity<=0)return null;
 const risk=entry-stop;
 return {capital:entry*quantity,riskPerShare:risk,riskPct:risk/entry*100,riskTotal:risk*quantity,targets:[first,second].flatMap((price,i)=>price!==undefined&&Number.isFinite(price)&&price>entry?[{label:i===0?'Target 1':'Target 2 / Stretch',price,gainPerShare:price-entry,gainPct:(price-entry)/entry*100,rewardRisk:(price-entry)/risk,gainTotal:(price-entry)*quantity}]:[])};
}
