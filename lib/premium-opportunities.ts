import 'server-only';
import {getPublishedOpportunities as selectPublished,getPublishedOpportunity as selectOpportunity,getOpportunityUpdates as selectUpdates,type Opportunity,type OpportunityUpdate,type WeeklyOutlook} from './premium-content';
// User-approved Opportunity #001. Trade and technical stage are independent editorial facts.
const zsTrade={enteredAt:'2026-09-16',entryPrice:190,stopPrice:160,firstTargetPrice:230,documentation:'Justin supplied his initial entry, active ownership, stop, and first target in the September 16, 2026 Opportunity #001 brief.'};
export const opportunities:Opportunity[]=[{
 id:'opportunity-001',slug:'zscaler-001',ticker:'ZS',company:'Zscaler',title:'ZS / Prove the breakout.',
 publicationState:'published',publishedAt:'2026-09-16',updatedAt:'2026-09-16',
 tradeStatus:'Active',technicalStage:'Stage 1 → Stage 2',trade:zsTrade,
 sector:'Cybersecurity',etfTickers:['CIBR'],
 discoveryChain:['Cybersecurity','CIBR','ZS','Stage 1 Base','Potential Stage 2 Breakout'],
 summary:'Justin owns ZS. A multi-month base and improving weekly structure are attempting a Stage 1-to-Stage 2 transition.',
 nextStepSummary:'Hold the ~$190–$195 breakout and confirm the Stage 2 transition.',
 whySurfaced:'Cybersecurity has been one of the stronger areas of the market over the intermediate term. After drilling into CIBR’s holdings, Zscaler stood out as a major constituent that remained well below its previous high while its technical structure improved.\n\nZscaler had fallen from roughly $336 to $114. After the May 2026 low, the stock stopped making new lows and began forming higher lows beneath resistance around $190–$195. Several other cybersecurity stocks had already begun moving.\n\nStrong industry performance, an ETF constituent that had not yet made the same move, improving price structure, and a potential Stage 1-to-Stage 2 transition put ZS on the Opportunity Board.',
 setupThesis:'Zscaler suffered a major decline from roughly $336 to $114. After the May low, the downtrend began changing character: higher lows replaced repeated lower lows, while sellers repeatedly appeared around $190.\n\nThe result is a multi-month base with increasingly aggressive buyers beneath relatively consistent resistance. At the September 16 review, price had begun pushing through that area. The 30-week SMA, approximately $151.45 at review, had flattened and begun curling higher, with price well above it.\n\nThis is a potential transition from Stage 1 accumulation into Stage 2 markup. It is not yet classified as a fully confirmed Stage 2 advance.',
 nextCondition:'ZS now needs to prove the breakout.\n\nWe want to see the stock hold above the approximately $190–$195 breakout area, continue producing higher highs and higher lows, and see the 30-week moving average continue flattening and turning higher. Continued relative strength in cybersecurity would further support the setup.\n\nA breakout that immediately fails back into the prior range would weaken the thesis. A move to $160 invalidates the current trade setup.',
 confirmation:'~$190–$195',
 riskInvalidation:'Justin’s stop and technical invalidation are $160. Reaching that level invalidates the current setup; it does not automatically record an exit or change trade status.',
 fundamentalCase:'The stock experienced a massive valuation reset while the underlying business continued growing. Fiscal 2026 revenue was approximately $3.35 billion, up 25%. Latest-quarter revenue was approximately $898 million, also up 25%, and ARR was approximately $3.77 billion.\n\nZscaler reported more than 4,100 customers spending at least $100,000 annually and 785 customers spending more than $1 million annually.\n\nThe thesis is not that a falling stock must recover. It is the combination of a severe share-price reset, an expanding business, lower expectations and valuation, structural demand for cybersecurity, and improving technical structure.\n\nZero Trust architecture may become increasingly relevant as companies secure users, workloads, and growing numbers of AI agents and non-human identities accessing corporate systems. AI supports the thesis; the swing-trade setup still has to earn confirmation.',
 primaryRisks:[
  {title:'Growth deceleration',explanation:'Fiscal 2027 guidance implies revenue growth of roughly 17%, materially below fiscal 2026’s 25%. ARR growth is also expected around 17%. Slower growth could justify a structurally lower valuation multiple.'},
  {title:'Stock-based compensation',explanation:'Zscaler recorded more than $820 million of stock-based compensation during fiscal 2026.'},
  {title:'Profitability',explanation:'Despite strong non-GAAP profitability metrics, Zscaler remained GAAP operating-loss-making for the year.'},
  {title:'Competition',explanation:'Cybersecurity is intensely competitive, with companies including Palo Alto Networks, CrowdStrike, Microsoft, Cisco, Fortinet, and Netskope.'}
 ],
 thesisChanges:'Strengthens the thesis\nZS sustains the breakout above the ~$190–$195 base. Higher highs join the existing higher-low structure. The 30-week moving average turns decisively higher. Cybersecurity remains an area of relative market strength.\n\nWeakens the thesis\nThe breakout fails back into the prior range, relative strength deteriorates materially, or business growth decelerates more aggressively than expected.\n\nInvalidates the current trade\nThe $160 stop/invalidation level is reached.',
 justinsTake:'I don’t need Zscaler to return to $336 or start growing 40% again. I’m looking for the combination of a reset valuation, a business that’s still growing, strength in cybersecurity and a technical transition into Stage 2. I bought my first position at $190. Now the stock has to prove the breakout.',
 chart:{src:'/api/premium/chart/zs-2026-09-16',asOf:'2026-09-16',alt:'Justin’s weekly Zscaler TradingView chart dated September 16, 2026, showing historical stages, the current base, resistance near $190–$195, support near $160, higher lows and the 30-week SMA.'}
}];
export const opportunityUpdates:OpportunityUpdate[]=[{
 id:'opportunity-001-initial',opportunityId:'opportunity-001',publishedAt:'2026-09-16',publicationState:'published',
 tradeStatusBefore:null,tradeStatusAfter:'Active',technicalStage:'Stage 1 → Stage 2',trade:zsTrade,
 title:'Initial position opened / Opportunity added',
 explanation:'Justin entered his initial ZS position at $190 as the stock began pushing through the multi-month ~$190 resistance area. The next confirmation is sustained price action above the breakout area with continued improvement in the 30-week moving average and overall structure.'
}];
export const weeklyOutlooks:WeeklyOutlook[]=[];
export function getPublishedOpportunities(){return selectPublished(opportunities);}
export function getPublishedOpportunity(slug:string){return selectOpportunity(slug,opportunities);}
export function getOpportunityUpdates(id:string){return selectUpdates(id,opportunityUpdates);}
export function getRecentOpportunityUpdates(limit=3){
 return getPublishedOpportunities().flatMap(opportunity=>getOpportunityUpdates(opportunity.id).map(update=>({opportunity,update})))
  .sort((a,b)=>b.update.publishedAt.localeCompare(a.update.publishedAt)).slice(0,limit);
}
