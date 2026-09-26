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
// Historical trade/research dates are distinct from their September 18 archive addition.
const rklbTrade={enteredAt:'2026-09-04',entryPrice:64,stopPrice:55,firstTargetPrice:85,documentation:'Justin explicitly documented reopening his current RKLB position on September 4, 2026 at approximately $64, with a $55 stop and $85 initial target in the September 18 archive brief.'};
const nowInitialTrade={enteredAt:'2026-05-28',entryType:'accumulation' as const,documentation:'Justin explicitly documented beginning his current ServiceNow accumulation on May 28, 2026. Initial purchase price and quantity are not supplied.'};
const nowTrade={...nowInitialTrade,quantity:45,stopPrice:130,firstTargetPrice:175,documentation:'Justin documented the accumulation start of May 28, 2026 and, as of the September 18 brief, current ownership of 45 shares, a $130 stop, and $175 first target/lock-in zone. Average entry price is not supplied.'};
opportunities.push({
 id:'opportunity-002',slug:'rocket-lab-002',ticker:'RKLB',company:'Rocket Lab',title:'RKLB / The price reset. Neutron still has to deliver.',
 publicationState:'published',publishedAt:'2026-09-18',updatedAt:'2026-09-18',addedToArchiveAt:'2026-09-18',researchPublishedAt:'2026-09-13',
 tradeStatus:'Active',technicalStage:null,trade:rklbTrade,sector:'Space',
 summary:'Rocket Lab has fallen sharply while the underlying business and backlog have continued growing. Neutron remains the key catalyst and execution risk. Justin opened the current position at approximately $64.',
 nextStepSummary:'Watch Neutron qualification and pad progress, and price behavior relative to the $55 trade invalidation.',
 whySurfaced:'Rocket Lab fell from above roughly $150 into the low-$60s while the business continued reporting record quarterly revenue and backlog, alongside significant new launch contracts. Customers were reserving Neutron flights before its first launch.\n\nI had previously viewed $70–$75 as a more attractive accumulation area. At approximately $64, the stock was below that zone, and I reopened the current position on September 4. The divergence between price and operating progress brought it back into focus.',
 setupThesis:'At approximately $150, I thought investors were paying for too much future execution upfront. Around $60–$64, the risk/reward became more attractive, with substantial execution risk still unresolved.\n\nThis is a documented active trade, with a $64 initial entry, $55 stop/invalidation and $85 first target. It is not an editorial assignment of a Weinstein stage. Electron and Space Systems already operate; Neutron has to demonstrate what the company can become next.',
 nextCondition:'Watch Stage 1 Neutron hardware reaching the pad, remaining qualification work and vehicle integration, then the initial launch. Here, Stage 1 refers to rocket hardware, not a Weinstein stock classification.\n\nAfter flight one, the question becomes repeatable manufacturing, reusability and launch cadence. Continued contract demand, backlog growth, Space Systems expansion and progress on the proposed Iridium transaction also matter. The $55 level invalidates the current trade framework; it does not automatically record an exit.',
 riskInvalidation:'Justin’s current stop / technical invalidation is $55. No exit has been documented.',
 fundamentalCase:'Rocket Lab’s potential extends beyond Electron: manufacture satellite components, build complete satellites, operate spacecraft and launch payloads. Neutron is intended to add reusable medium-lift capacity for larger commercial, constellation and national-security missions that Electron cannot address. Customers reserving capacity before the first flight suggest demand, but delivery still has to be proven.\n\nThe proposed Iridium acquisition could add an existing global satellite communications network and recurring services. The strategic possibility is build it, launch it, operate it and sell the service. Closing, approval and integration remain risks; this outcome is not guaranteed.',
 catalysts:['Neutron hardware delivery, qualification and vehicle integration.','First Neutron flight, followed by repeatable manufacturing, reusability and cadence.','Continued launch-contract demand, backlog growth and Space Systems execution.','Approval, closing and integration progress on the proposed Iridium transaction.'],
 primaryRisks:[{title:'Neutron execution',explanation:'Further delays, testing failures or launch failure could undermine confidence. A successful first flight would still leave production scale and repeatability to prove.'},{title:'Valuation and capital needs',explanation:'Valuation can remain high relative to current revenue even after a large decline. Significant growth may already be priced in, while expanding launch infrastructure requires capital.'},{title:'Iridium transaction',explanation:'The proposed acquisition may fail to close or fail to deliver the expected strategic benefits.'}],
 thesisChanges:'Strengthens\nHardware reaches the pad, qualification milestones are completed and Neutron flies successfully. Repeatable manufacturing, continued launch demand and backlog growth, and successful Iridium progress add support.\n\nWeakens\nRepeated schedule slippage without corresponding engineering progress, major technical issues, backlog deterioration or material deterioration in the existing business.\n\nCurrent trade invalidation\nThe documented stop / technical invalidation remains $55. A price move alone does not establish that Justin exited.',
 justinsTake:'At $150, I thought too much of Rocket Lab’s future was already in the price. Around $60–$64, I was willing to reopen a position. I’m not buying solely because Neutron might launch before year-end. If it works, Rocket Lab can compete for missions Electron cannot address and launch more of the infrastructure it already builds. Electron proved Rocket Lab is real. Neutron has to prove what it can become next.',
 chart:{src:'/api/premium/chart/rklb-daily-chart',asOf:'2026-09-12',width:1610,height:839,caption:'Justin’s Rocket Lab daily research chart.',alt:'Justin’s Rocket Lab daily TrendSpider research chart, showing the share-price reset, revenue-growth annotations and marked support levels. Original TrendSpider attribution is preserved.'}
},{
 id:'opportunity-003',slug:'spacex-003',ticker:'SPCX',company:'SpaceX',title:'SPCX / A base to investigate. A position to wait for.',
 publicationState:'published',publishedAt:'2026-09-18',updatedAt:'2026-09-18',addedToArchiveAt:'2026-09-18',
 tradeStatus:'Watching',technicalStage:'Stage 1 — Accumulation',sector:'Space',
 summary:'SpaceX may be forming its first meaningful post-IPO Stage 1 base after a broader reset across space stocks. Justin is watching and has not entered a position.',
 nextStepSummary:'Wait for a pullback toward ~$122 to reassess accumulation, or a confirmed breakout above ~$150.',
 whySurfaced:'The supplied research follows SpaceX’s June 2026 IPO at $135, its initial surge toward $225 and subsequent decline to approximately $104.83. Rocket Lab, AST SpaceMobile and Redwire also experienced significant resets.\n\nThat broader decline raised a sector question: how much reflected excessive valuations and speculative enthusiasm resetting, rather than a company-specific problem? Higher Treasury yields can also pressure the present value of distant profits. These are possible influences, not a precise causal attribution.',
 setupThesis:'The developing Stage 1 range is approximately $105–$150. Buyers appeared near the $105 floor, followed by a rebound and consolidation. Around $122 is my preferred pullback area to reassess beginning a position within the range; it is not magical support.\n\nFor the first time since the IPO, there is enough price history to build a real plan. The question is whether the emotional IPO and decline cycle is giving way to accumulation ahead of a potential future Stage 2 move. The bottom is not guaranteed, and I have not entered.',
 setupRange:'~$105–$150',entryFramework:'~$122',confirmation:'~$150',riskInvalidation:'~$105',nextAreaToWatch:'~$172, only after a confirmed breakout above ~$150; not an active trade target.',
 nextCondition:'Scenario A: a pullback toward approximately $122, where I would reassess potentially beginning a position.\n\nScenario B: a clean, confirmed breakout above approximately $150. That would move price outside the current Stage 1 range; approximately $172 would then be the next area to watch. It is not a current trade target.\n\nIf price breaks below the approximately $105 floor and cannot reclaim it, the current base thesis begins to fail. I would reassess rather than automatically buy lower. This is setup invalidation, not a stop-loss order on an owned position.',
 fundamentalCase:'The research separates the appeal of the space industry from the price paid for exposure. Much of the space trade depends on future profits, making valuation and financing conditions important. A major reset can create a reason to investigate, but it does not establish that a stock is cheap or that business execution is assured.\n\nThis record is a patient technical research plan for a potential post-IPO base. It does not claim an active holding or a completed trade.',
 primaryRisks:[{title:'The base may fail',explanation:'A sustained break below approximately $105 would weaken or invalidate the current consolidation thesis. A bounce alone does not prove a bottom.'},{title:'Speculation and valuation',explanation:'The broader space sector can remain volatile and expensive after a large decline. Higher yields may continue to pressure long-duration growth valuations.'},{title:'False breakout',explanation:'A move above approximately $150 needs confirmation and follow-through. Neither a pullback to $122 nor a breakout guarantees a favorable outcome.'}],
 thesisChanges:'Strengthens\nThe developing range holds, a pullback creates an attractive structure to reassess, or a confirmed breakout above approximately $150 earns further investigation.\n\nWeakens / invalidates the setup\nPrice breaks below approximately $105 and cannot reclaim the floor. I would reassess the current base thesis.\n\nTrade status\nWatching remains separate from Stage 1. No position, entry, stop order or active trade target has been documented.',
 justinsTake:'I’m not saying the bottom is definitely in or that $122 will definitely hold. I finally have enough price history to make a plan: $122 is where I’d prefer to reassess accumulation, $150 is the breakout level and $105 is the setup floor. Only after a confirmed breakout would I watch $172 next. Until SpaceX gives me the setup I want, I’m waiting.',
 charts:[{src:'/api/premium/chart/spcx-stage-analysis',width:2404,height:1296,caption:'Justin’s supplied stage-analysis chart. Original research date is not established.',alt:'Justin’s SpaceX TradingView stage-analysis chart showing prior Stage 2, Stage 3 and Stage 4 regions and the developing new Stage 1 accumulation area. Original annotations and attribution are preserved.'},{src:'/api/premium/chart/spcx-setup',width:2396,height:1270,caption:'Justin’s supplied setup chart: ~$150 top, ~$122 preferred area and ~$105 floor. No active position.',alt:'Justin’s SpaceX TradingView setup chart annotated with a $150 top, $122 midpoint and $105 floor. Original annotations and attribution are preserved.'}]
},{
 id:'opportunity-004',slug:'servicenow-004',ticker:'NOW',company:'ServiceNow',title:'NOW / The control layer for enterprise AI?',
 publicationState:'published',publishedAt:'2026-09-18',updatedAt:'2026-09-18',addedToArchiveAt:'2026-09-18',
 tradeStatus:'Active',technicalStage:null,trade:nowTrade,sector:'Software',
 summary:'The market treated software as a potential AI loser, while ServiceNow may become part of the enterprise control layer required to deploy and govern AI agents. Justin currently owns 45 shares.',
 nextStepSummary:'Watch AI adoption, subscription growth, retention, free cash flow and price behavior relative to the $130 trade invalidation.',
 whySurfaced:'ServiceNow fell approximately 50% during the broader software selloff even as the company remained profitable, cash-generative, growing and deeply embedded in large enterprises.\n\nThat disconnect caught my attention: software was being treated as a potential AI loser, while enterprises may need an established platform to govern what AI agents are allowed to do. I began accumulating on May 28, 2026 and have continued building the position.',
 setupThesis:'The thesis is that ServiceNow may become part of the operating and control layer through which enterprises deploy and govern AI agents. It already sits inside IT, HR, security, customer service, approvals and operational workflows.\n\nAgents need permissions, governance, audit trails, access and data controls, workflow routing and visibility. AI that answers a question is different from AI that can safely perform work inside an enterprise. ServiceNow’s existing integration gives it a credible case for the second category.\n\nThe documented position began May 28 and currently totals 45 shares. Average entry price is not supplied. The current stop is $130 and $175 is the first target / planned lock-in zone. No formal Weinstein stage is assigned.',
 nextCondition:'Look for AI adoption translating into usage, AI-package adoption, contract value and workflow expansion, alongside subscription growth, retention, margins and free cash flow.\n\nI want evidence that ServiceNow becomes more central to enterprise work as agents are deployed, rather than being bypassed. Price behavior relative to the $130 invalidation matters, but price movement alone does not document a sale. The first planned target / lock-in zone remains $175.',
 riskInvalidation:'Justin’s current stop / trade invalidation is $130. The first target / initial lock-in zone is $175. No exit or additional target has been supplied.',
 fundamentalCase:'ServiceNow has an established enterprise customer base, recurring software economics, a strong gross-profit profile, substantial operating cash generation, growing free cash flow and balance-sheet flexibility. High renewal and deeply integrated workflows create meaningful switching costs.\n\nThe AI opportunity is more than adding a feature. Enterprises need systems that govern agents and let them act safely across complex operations. That could increase usage, contract value and demand for governance, security and workflow capabilities. It is a thesis to evaluate against actual adoption and economics, not a guaranteed outcome.',
 catalysts:['AI-package adoption and evidence of contract-value or workflow expansion.','Subscription growth, customer retention and renewal trends.','Margins, operating cash generation and free cash flow.','Evidence that ServiceNow remains central to enterprise AI deployment and governance.'],
 primaryRisks:[{title:'Valuation and growth',explanation:'The market may require stronger growth than the business delivers. Valuation can compress even if the company remains profitable.'},{title:'AI monetization and execution',explanation:'AI adoption may not produce the expected revenue or profitability. Execution costs can offset potential benefits.'},{title:'Competition and displacement',explanation:'Competitors or AI-native approaches could bypass incumbent workflows. Weaker retention or enterprise spending would challenge the thesis.'}],
 thesisChanges:'Strengthens\nSubscription growth, renewal, AI adoption and contract expansion remain strong. Free cash flow grows, and ServiceNow becomes more central to enterprise agent deployment and governance.\n\nWeakens\nGrowth or renewal deteriorates, AI monetization disappoints, profitability weakens, or competing platforms and AI-native workflows bypass ServiceNow.\n\nCurrent trade invalidation\nThe documented stop remains $130. No exit is inferred automatically. The current 45-share position and $175 first target are September 18 facts, not reconstructed May 28 trade terms.',
 justinsTake:'I started accumulating on May 28 and currently own 45 shares. My stop is $130 and $175 is my first planned target / lock-in zone. I think there may be more upside, but I’m not adding targets I haven’t established. The question I’m watching is whether AI replaces this platform—or makes the platform that governs AI agents more valuable. ServiceNow has a credible case, and the business has to keep proving it.',
 chart:{src:'/api/premium/chart/now-2026-09-18',asOf:'2026-09-18',width:1600,height:837,caption:'Justin’s ServiceNow daily research chart.',alt:'Justin’s ServiceNow daily TrendSpider chart dated September 18, 2026, with price history, the 50-day moving average, revenue-growth annotations and marked historical regions. Original attribution is preserved.'}
});

opportunities.push({
  "id": "opportunity-005",
  "slug": "strategy-005",
  "ticker": "MSTR",
  "company": "Strategy",
  "companyNote": "Formerly MicroStrategy",
  "title": "MSTR / The Bitcoin thesis. A starter position.",
  "publicationState": "published",
  "publishedAt": "2026-09-23",
  "updatedAt": "2026-09-23",
  "tradeStatus": "Active",
  "technicalStage": "Stage 2",
  "trade": {
    "enteredAt": "2026-09-23",
    "entryPrice": 160,
    "quantity": 10,
    "stopPrice": 123,
    "firstTargetPrice": 196,
    "documentation": "Justin documented a 10-share MSTR starter position at $160 in his September 23, 2026 Opportunity brief. The annotated trade-plan chart establishes the $123 stop and $196 first target."
  },
  "sector": "Crypto / Bitcoin",
  "discoveryLabel": "Research path",
  "discoveryChain": [
    "Crypto",
    "Bitcoin",
    "Technical setup",
    "MSTR",
    "Trade"
  ],
  "summary": "Bitcoin has broken higher after a major drawdown and bullish consolidation. MSTR’s Stage 2 transition supports the equity trade: 10 shares at $160, with a conditional $144–$148 add zone.",
  "nextStepSummary": "Reassess adding at $144–$148 if Bitcoin’s breakout and MSTR’s structure hold. If the move continues, the starter position provides exposure without chasing.",
  "whySurfaced": "This trade starts with Bitcoin. I own Bitcoin separately for the long term in cold storage; those coins are not part of this swing strategy. For this move, I want an equity vehicle. That leads to Strategy, formerly MicroStrategy.\n\nAfter Bitcoin’s decline from roughly $125,000 to $57,000, the character of price action began changing. Buyers appeared near the lows, the structure improved through July and August, and price accelerated from the low-$60,000s toward $80,000. Buyers were willing to pay materially higher prices in a short period.\n\nThe advance was followed by a controlled, downward-sloping consolidation that I interpret as a potential bull flag. Earlier buyers could take profits while new demand absorbed the selling. Rather than collapsing, price held together and broke higher again. The September 23 chart shows Bitcoin above the recent ~$82,500 resistance area, around the mid-$80,000s at capture.",
  "setupThesis": "My working thesis is that roughly $57,000 may have marked a major Bitcoin cycle floor. The scale of the decline, buyers appearing near the lows, improving structure, upside acceleration and renewed breakout support that view. Bitcoin’s cyclical history and potential demand for alternative assets amid global inflation concerns add context; neither establishes a guaranteed floor or appreciation.\n\nMSTR gives me an equity vehicle for that thesis. Its higher lows and the transition from Stage 1 into Stage 2 in my TrendSpider phase analysis support a new markup phase. Stage 2 is a documented research classification, not a promise of continued upside.\n\nI opened 10 shares at $160—approximately $1,600 of initial capital. This is deliberately a starter position, not my full intended allocation. I like the thesis more than the entry: the move has already started, and $160 offers less attractive reward/risk than the $144–$148 area. A small position gives me exposure if the move continues while leaving room to reassess a better entry.",
  "nextCondition": "Preferred scenario — a controlled pullback\nMSTR returns toward $144–$148 while Bitcoin holds its breakout and MSTR’s technical structure remains constructive. I would reassess potentially adding capital. Reaching the zone alone is not a buy decision, and no purchase there has been made.\n\nContinuation scenario — no preferred pullback\nMSTR keeps moving higher. The 10-share starter already provides limited exposure; I do not need to chase with my full intended capital simply because price rises.",
  "preferredAddZone": "$144–$148",
  "entryFramework": "The 10-share starter at $160 is already established. The preferred $144–$148 add / reassessment zone is conditional on the thesis remaining intact; it has not been filled.",
  "riskInvalidation": "The documented stop / current trade invalidation is $123. Target 1 is $196, corresponding to prior resistance on the trade-plan chart. It is a first swing target, not a guaranteed outcome. No higher target or exit has been documented.",
  "fundamentalHeading": "Why MSTR / The Equity Vehicle",
  "fundamentalCase": "MSTR’s equity valuation is heavily influenced by its Bitcoin exposure, following its transformation from primarily a software company. That sensitivity makes it the vehicle I’m using for this Bitcoin swing thesis. It does not perfectly track Bitcoin and is not identical to holding coins.\n\nThis is a deliberate exception to the usual company-ownership research question. I’m not building the same long-term operating-business case used for ZS, NOW or RKLB. The analysis here is Bitcoin’s structure, MSTR’s technical structure and the additional risks of expressing the thesis through a company’s equity.\n\nFinancing decisions, leverage, capital structure and changes in the stock’s valuation premium can change the outcome even if Bitcoin behaves as expected. The research still follows the same principle: find where the move is occurring, choose the vehicle, define the setup, risk and target.",
  "technicalConfirmation": "My TrendSpider phase analysis has recently transitioned MSTR from the lighter Stage 1 area into the darker green Stage 2 area. That is additional evidence for a potential markup phase.\n\nThe chart also shows a previously valid Bottom Catcher signal at $166.97, near the $167.33 price displayed at capture. This is separate technical corroboration around the research price area—not my $160 entry, a newly dated signal, or proof that a bottom will hold. Neither the phase transition nor Bottom Catcher guarantees that the trade will work. All chart prices are September 23 research context, not live quotes.",
  "primaryRisks": [
    {
      "title": "Bitcoin’s breakout or floor thesis fails",
      "explanation": "Bitcoin could lose the recent breakout and break its improving structure. The roughly $57,000 cycle-floor thesis remains a working interpretation that can be wrong."
    },
    {
      "title": "Amplified volatility",
      "explanation": "MSTR can amplify Bitcoin’s moves. This is a high-volatility equity trade, and the small starter position reflects the less attractive reward/risk at $160 compared with the preferred $144–$148 area."
    },
    {
      "title": "Financing, leverage and valuation premium",
      "explanation": "Company-specific financing and capital-structure decisions, leverage and compression of MSTR’s valuation premium can cause the equity to underperform Bitcoin."
    },
    {
      "title": "Broader market conditions",
      "explanation": "Equity-market weakness, higher rates and a broader retreat from risk can pressure MSTR independently of Bitcoin."
    },
    {
      "title": "Technical confirmation can fail",
      "explanation": "The Stage 2 transition and Bottom Catcher signal are supporting evidence. False signals and failed continuation patterns remain possible."
    }
  ],
  "thesisChanges": "Strengthens the thesis\nBitcoin holds its breakout, keeps forming higher lows and sustains the bull-flag continuation toward the next resistance areas. MSTR maintains constructive sensitivity to Bitcoin and its Stage 2 structure. A controlled pullback toward $144–$148 with both structures intact would provide an area to reassess adding.\n\nWeakens the thesis\nBitcoin loses its recent breakout or materially breaks its improving structure. MSTR underperforms for company-specific reasons, the Stage 2 transition fails, or broader risk assets deteriorate. A move toward $123 brings the trade closer to its documented invalidation.\n\nCurrent trade invalidation\nThe stop remains $123. A price move alone does not establish an executed exit or an additional purchase.",
  "justinsTake": "Bitcoin looks materially different than it did during the decline from roughly $125,000 to $57,000. Buyers appeared around the lows, price started improving, we got a major upside move, a controlled consolidation and now another breakout.\n\nI hold Bitcoin separately for the long term and don’t actively trade those coins. For this swing setup, I’m using MSTR as the equity vehicle. TrendSpider has moved MSTR from Stage 1 into Stage 2, and its Bottom Catcher previously identified a valid signal around $166.97—near the price shown when I captured this research. That’s additional confirmation, but it doesn’t mean I’m going all in.\n\nI opened a small 10-share starter position at $160 because this move may continue without giving me the pullback I want. But $160 isn’t my ideal entry. The setup gets much more attractive to me around $144–$148. If we get that pullback and the Bitcoin thesis remains intact, that’s where I’ll reassess putting more capital behind the trade. My first target is $196. My stop is $123.\n\nThis is a little different from our normal Sector Gauge → ETF → stock process because crypto is effectively its own market and MSTR is being used as a Bitcoin proxy. The underlying framework is the same: find where the move is happening, find the vehicle, define the setup, risk and target. Then take the trade.",
  "charts": [
    {
      "src": "/api/premium/chart/btc-2026-09-23",
      "asOf": "2026-09-23",
      "placement": "origin",
      "source": "TradingView",
      "width": 3266,
      "height": 1752,
      "caption": "Bitcoin’s daily chart shows the advance from the ~$57,000 area, controlled bull-flag consolidation and renewed breakout above ~$82,500. The $85,462 quote is the price at capture.",
      "alt": "Bitcoin daily TradingView chart dated September 23, 2026, with green annotations around the advance and bull flag, and red resistance lines near $82,500, $90,000 and $98,000."
    },
    {
      "src": "/api/premium/chart/mstr-trade-plan-2026-09-23",
      "asOf": "2026-09-23",
      "placement": "framework",
      "source": "TradingView",
      "width": 3266,
      "height": 1752,
      "caption": "MSTR trade plan: higher lows, a preferred $144–$148 reassessment area, $123 stop and $196 first target. The 10-share starter was established at $160.",
      "alt": "MSTR daily TradingView chart with higher lows, a purple pullback framework, a $123 stop and $196 target. The preferred add zone is $144–$148; it is not a completed purchase."
    },
    {
      "src": "/api/premium/chart/mstr-trendspider-2026-09-23",
      "asOf": "2026-09-23",
      "placement": "confirmation",
      "source": "TrendSpider",
      "width": 1600,
      "height": 837,
      "caption": "Stage 1-to-Stage 2 phase transition and a previously valid Bottom Catcher signal at $166.97, near the $167.33 quote at capture. These are research observations, not live prices or trade performance.",
      "alt": "MSTR daily TrendSpider chart dated September 23, 2026, showing phase colors transitioning to dark green and the Bottom Catcher panel with BC Price $166.97 and capture price $167.33."
    }
  ]
});

export const opportunityUpdates:OpportunityUpdate[]=[{
 id:'opportunity-001-initial',opportunityId:'opportunity-001',publishedAt:'2026-09-16',publicationState:'published',
 tradeStatusBefore:null,tradeStatusAfter:'Active',technicalStage:'Stage 1 → Stage 2',trade:zsTrade,
 title:'Initial position opened / Opportunity added',
 explanation:'Justin entered his initial ZS position at $190 as the stock began pushing through the multi-month ~$190 resistance area. The next confirmation is sustained price action above the breakout area with continued improvement in the 30-week moving average and overall structure.'
}];
opportunityUpdates.push({
 id:'opportunity-002-initial',opportunityId:'opportunity-002',publishedAt:'2026-09-18',eventDate:'2026-09-04',publicationState:'published',tradeStatusBefore:null,tradeStatusAfter:'Active',trade:rklbTrade,
 title:'Initial position opened',explanation:'Justin reopened the current RKLB position on September 4, 2026 at approximately $64. Stop / invalidation: $55. Initial target: $85. Share quantity is not supplied. This historical event was added to the Premium archive on September 18; no intermediate updates or exit are inferred.'
},{
 id:'opportunity-003-initial',opportunityId:'opportunity-003',publishedAt:'2026-09-18',publicationState:'published',tradeStatusBefore:null,tradeStatusAfter:'Watching',technicalStage:'Stage 1 — Accumulation',
 title:'Watching research added to the Premium archive',explanation:'SpaceX is added as a Watching opportunity, developing a potential Stage 1 base between approximately $105 and $150. Justin has not opened a position. Around $122 is the preferred accumulation reassessment area; a confirmed breakout above approximately $150 would change the setup. Failure below approximately $105 would weaken or invalidate the current base thesis. The original research/video date is not established; September 18 records this archive addition, not an invented historical publication date.'
},{
 id:'opportunity-004-initial',opportunityId:'opportunity-004',publishedAt:'2026-09-18',eventDate:'2026-05-28',publicationState:'published',tradeStatusBefore:null,tradeStatusAfter:'Active',trade:nowInitialTrade,
 title:'Accumulation began',explanation:'Justin began accumulating ServiceNow on May 28, 2026. The initial purchase price and share quantity are not supplied. No intermediate purchases, prices, stop or target at that historical date are reconstructed. This event was added to the Premium archive on September 18.'
},{
 id:'opportunity-004-current',opportunityId:'opportunity-004',publishedAt:'2026-09-18',eventDate:'2026-09-18',publicationState:'published',tradeStatusBefore:'Active',tradeStatusAfter:'Active',trade:nowTrade,
 title:'Current position and trade framework documented',explanation:'As of September 18, Justin owns 45 shares of NOW, with a $130 stop and $175 first target / initial lock-in zone. Accumulation began May 28. Average entry price is not supplied, and no intermediate purchase history is invented. The position remains Active; no additional targets or exit have been documented.'
});

opportunityUpdates.push({
  "id": "opportunity-005-initial",
  "opportunityId": "opportunity-005",
  "publishedAt": "2026-09-23",
  "eventDate": "2026-09-23",
  "publicationState": "published",
  "tradeStatusBefore": null,
  "tradeStatusAfter": "Active",
  "technicalStage": "Stage 2",
  "trade": {
    "enteredAt": "2026-09-23",
    "entryPrice": 160,
    "quantity": 10,
    "stopPrice": 123,
    "firstTargetPrice": 196,
    "documentation": "Justin documented a 10-share MSTR starter position at $160 in his September 23, 2026 Opportunity brief. The annotated trade-plan chart establishes the $123 stop and $196 first target."
  },
  "title": "Initial MSTR position opened",
  "explanation": "Justin opened an initial 10-share MSTR position at $160, approximately $1,600 of initial capital. The starter is intentionally small because the current entry is not the preferred reward/risk setup. The preferred add / reassessment zone is $144–$148, conditional on the Bitcoin/MSTR thesis remaining intact. Stop: $123. Target 1: $196. TrendSpider’s phase analysis has transitioned from Stage 1 into Stage 2, while Bottom Catcher previously identified a valid signal around $166.97. No additional purchase has been made at the preferred reassessment zone."
});

export const weeklyOutlooks:WeeklyOutlook[]=[{
  "id": "weekly-outlook-001",
  "slug": "market-survived-rate-hike-september-21-2026",
  "title": "The Market Survived the Rate Hike. Now It Has to Prove It.",
  "weekOf": "2026-09-21",
  "weekEnd": "2026-09-25",
  "perspectiveDate": "2026-09-20",
  "publishedAt": "2026-09-20",
  "publicationState": "published",
  "summary": "The market absorbed the Fed's first 25-basis-point hike without breaking its broader structure. This week we're watching whether higher yields finally begin affecting equities, investigating persistent strength in shipping and air cargo, and managing our existing RKLB, NOW and ZS trades while SpaceX tests its breakout.",
  "read": "The Federal Reserve raised rates by 25 basis points last week, and the market took it surprisingly well.\n\nThe S&P 500 and Nasdaq finished the week without any real technical damage. Friday was noticeably more volatile than Thursday, but we also had triple witching, and nothing happened that changed my view of the broader trend.\n\nFor now, both the S&P 500 and Nasdaq Composite still look healthy.\n\nThe Dow is a different story. It has been trending lower while technology-heavy indexes have held up much better. That tells me this isn't necessarily a market where everything is working. Leadership is becoming more selective.\n\nAnd that's important.\n\nBecause the biggest question this week isn't whether the market survived the initial rate hike.\n\nIt's whether we've actually felt the impact of that rate hike yet.\n\nThe 10-year Treasury yield initially moved lower after the Fed decision before rebounding toward 5%. That's the number I'm watching closely.\n\nThe Fed has already moved. Stocks absorbed it. Now we get to see what happens when the market has had several days to process higher rates and yields sitting around 5%.\n\nI'm not getting defensive yet.\n\nBut I'm also not interested in aggressively adding exposure Monday morning.\n\nI want the market to prove it can live with these rates first.",
  "marketContext": "As long as those levels hold and the broader structure remains intact, I'm comfortable continuing to look for long setups.\n\nA break doesn't automatically mean the market is falling apart, but it would cause me to reassess how much risk I want to take.\n\nI'm also watching breadth more closely.\n\nLast week's strength wasn't uniform across the market. Technology continued to hold up better while the Dow weakened, and participation underneath the indexes was more selective.\n\nThat's something we're going to start incorporating into these Outlooks every week.\n\nIf SPY and the Nasdaq keep moving higher but fewer and fewer stocks participate, that's information we shouldn't ignore.",
  "marketPosture": "Selective / Waiting for confirmation",
  "marketLevels": [
    {
      "index": "S&P 500",
      "support": 7507
    },
    {
      "index": "Nasdaq Composite",
      "support": 25800
    }
  ],
  "sectorFocus": "This is where the Sector Gauge gave us something I wasn't expecting.\n\nShipping and air cargo keeps showing up.\n\nIt's appearing near the top of our rankings across the 1-week, 1-month, 3-month, 6-month, 9-month and 12-month periods.\n\nThis is not an area I normally trade.\n\nAnd that's exactly why I built the Sector Gauge.\n\nI don't want us starting with stocks we already like and then searching for reasons to buy them. I want the process to show us where money is actually moving — even when it sends us somewhere we weren't looking.\n\nSo this week I'm going deeper into shipping and air cargo to see whether there are individual stocks beginning to form setups worth researching.\n\nThat doesn't mean we're buying something simply because the sector ranks well.\n\nIt means we've found a new pool to investigate.\n\nSpace and robotics are also beginning to appear on the 1-week rankings.\n\nThat's particularly interesting because we're already active in Rocket Lab.\n\nSoftware and cybersecurity remain strong as well, but I'm not interested in loading the portfolio with five different versions of the same trade.\n\nWe already have exposure through ServiceNow and Zscaler.\n\nFor now, that's enough.\n\nAnd energy stays on the radar as long as oil remains elevated.",
  "sectorAreas": [
    {
      "classification": "Investigating",
      "area": "Shipping & Air Cargo"
    },
    {
      "classification": "Improving short term",
      "area": "Space & Robotics"
    },
    {
      "classification": "Current leadership / existing exposure",
      "area": "Software & Cybersecurity"
    },
    {
      "classification": "Watching",
      "area": "Energy"
    }
  ],
  "gamePlan": "We're waiting.\n\nAt least initially.\n\nI want to see how the market trades Monday and Tuesday before getting more aggressive.\n\nThe Fed already raised rates.\n\nThe 10-year is back around 5%.\n\nBut the S&P 500 and Nasdaq haven't really shown us the consequences yet.\n\nMaybe there aren't any.\n\nMaybe investors have accepted that rates need to remain higher to bring inflation under control.\n\nOr maybe last week's resilience was the calm before higher yields finally start weighing on equities.\n\nWe don't need to guess.\n\nWe have our levels.\n\nWe have our active trades.\n\nWe know which sectors are showing strength.\n\nAnd now we let the market give us more information.\n\nIf the S&P and Nasdaq continue holding their structure, leadership remains intact, and new setups make it through the process, we can add exposure.\n\nIf weakness starts spreading and our support levels begin failing, we get more selective.\n\nIn the meantime, I'm digging into something I probably wouldn't have looked at without the Sector Gauge:\n\nShipping and air cargo.\n\nThat's where the process is pointing us.\n\nNow we need to find out whether there's actually a trade hiding inside it.",
  "opportunityIds": [
    "opportunity-002",
    "opportunity-004",
    "opportunity-001",
    "opportunity-003"
  ],
  "opportunityCommentary": [
    {
      "opportunityId": "opportunity-002",
      "body": "Nothing has changed.\n\nRocket Lab continues to hold, and the appearance of space and robotics in the short-term Sector Gauge adds some additional support to the environment around the trade.\n\nThat doesn't change our levels.\n\nThe trade remains active with the same $55 invalidation and $85 initial target."
    },
    {
      "opportunityId": "opportunity-004",
      "body": "Software continues to show strength, and I'm sticking with the exposure we already have.\n\nI'm not looking to pile into every software stock that starts moving.\n\nServiceNow remains one of the names I want exposure to, and nothing has changed in the current trade framework."
    },
    {
      "opportunityId": "opportunity-001",
      "body": "The breakout thesis remains intact.\n\nCybersecurity continues to show leadership, and Zscaler is still holding the area we wanted to see hold.\n\nWednesday's Okta Investor Summit is particularly relevant here. Okta is another major cybersecurity/identity company, so I'll be listening for anything that changes how we're thinking about enterprise security, AI identity and spending across the group."
    },
    {
      "opportunityId": "opportunity-003",
      "body": "This one just got more interesting.\n\nOur original range was roughly $105 to $150.\n\nWe identified ~$122 as the pullback area I preferred, ~$150 as the breakout level, and ~$105 as the level that would invalidate the developing Stage 1 thesis.\n\nSpaceX is now above $150.\n\nThat does not mean I'm chasing it.\n\nNow I want to see whether it can actually hold the breakout.\n\nHigher rates are exactly the type of environment that can pressure stocks where investors are paying heavily for growth far into the future. If yields remain elevated and SpaceX falls straight back into its previous range, that tells us something.\n\nIf it holds above $150 and begins building on the breakout, that tells us something too.\n\nFor now, it stays WATCHING."
    }
  ],
  "events": [
    {
      "day": "Monday / September 21",
      "title": "S&P Index Rebalance",
      "description": "Bloom Energy, Everpure and Illumina join the S&P 500.\n\nDell, Palo Alto Networks, Arista Networks and SanDisk join the S&P 100.",
      "relevance": "Watch for unusual price action created by index-tracking funds adjusting holdings."
    },
    {
      "day": "Tuesday / September 22",
      "title": "UiPath Investor Day",
      "description": "",
      "relevance": "Software remains an area of strength. Listen for commentary around enterprise AI, automation, demand and spending that could inform the broader environment around the ServiceNow thesis."
    },
    {
      "day": "Wednesday / September 23",
      "title": "Okta Investor Summit",
      "description": "",
      "relevance": "Cybersecurity remains strong and Zscaler is already an active Opportunity. Watch identity/security spending, AI identity, enterprise demand and anything that changes the broader cybersecurity thesis."
    },
    {
      "day": "Thursday / September 24",
      "title": "Costco Q4 2026 Earnings",
      "description": "",
      "relevance": "Another read on consumer spending while inflation remains a central market concern."
    },
    {
      "day": "Thursday / September 24",
      "title": "U.S.–China Summit",
      "description": "President Donald Trump and Chinese President Xi Jinping are scheduled to meet in Washington.",
      "relevance": "Trade, tariffs, technology restrictions, critical minerals and AI are among the issues surrounding the talks."
    }
  ]
}];
weeklyOutlooks.push({
  "id": "weekly-outlook-002",
  "slug": "market-strong-rate-hike-september-28-2026",
  "title": "The Market Still Looks Strong. I Don’t Think the Rate Hike Has Hit Yet.",
  "publishedAt": "2026-09-26",
  "weekOf": "2026-09-28",
  "weekEnd": "2026-10-02",
  "perspectiveDate": "2026-09-26",
  "publicationState": "published",
  "summary": "Major indexes remain strong, but leadership is narrowing and I believe the full impact of higher rates may not yet be reflected in stock prices.",
  "notificationSummary": "Leadership is narrowing while rates remain elevated. This week we're watching Micron, inflation, jobs, semiconductor strength, Zscaler's pullback and the improving Bitcoin/MSTR setup.",
  "marketPosture": "Selective / Expecting higher volatility",
  "read": "The market continues to look stronger than I would have expected given where interest rates are.\n\nThe Nasdaq is sitting near all-time highs. The S&P 500 is still holding its broader structure. And even after the Fed raised rates, we still haven’t seen the kind of widespread selloff you might expect when borrowing costs move higher.\n\nBut I don’t think that means the risk disappeared.\n\nI think there’s a decent chance we simply haven’t felt the full impact yet.\n\nHigher rates work through the economy slowly. Companies refinance debt. Consumers face higher borrowing costs. Valuations get harder to justify. And eventually some combination of that can start showing up in stock prices.\n\nThat’s why I’m becoming more selective here.\n\nI’m not bearish on the market.\n\nI’m not liquidating everything.\n\nBut I also don’t want to assume that because stocks survived the first week after the rate hike, they’re automatically going straight higher.\n\nThis week gives us several major tests: Micron, Core PCE and the jobs report.\n\nIf AI demand remains strong, inflation cooperates, and the labor market continues holding up, the market could continue absorbing higher rates.\n\nIf those pieces start moving the wrong direction at the same time, I think the odds of a pullback increase significantly.\n\nFor now, I’m staying invested — but I want better setups before I add a lot more risk.",
  "marketContext": "Higher rates, elevated yields, inflation, corporate valuations and labor-market data are beginning to interact. I think the odds of a broader pullback are increasing, but the timing and outcome remain uncertain.\n\nMicron, inflation and the jobs report are this week’s major tests. Strong AI demand, improving inflation and a resilient labor market could help equities continue absorbing higher rates. Deterioration across those inputs would make me more cautious. I’m staying invested and preserving capital for better setups.",
  "sectorFocus": "Leadership is narrowing. SPY gained +0.85% over the last week, and only three tracked groups outperformed it: semiconductors (SMH, +7.12%), cybersecurity (CIBR, +1.51%) and software (IGV, +1.30%).\n\nThe same three groups lead the one-month rankings: cybersecurity at +10.69%, semiconductors at +9.82% and software at +4.59%. These are the September 26 editorial snapshots for this issue; the full Sector Gauge carries the complete rankings.",
  "sectorHeading": "Sector Gauge",
  "sectorAreas": [
    {
      "classification": "Leading",
      "area": "Semiconductors · Cybersecurity · Software"
    },
    {
      "classification": "Investigating",
      "area": "Semiconductors for new Stage 1 → Stage 2 setups"
    },
    {
      "classification": "Cooling",
      "area": "Shipping & Air Cargo"
    },
    {
      "classification": "Watching",
      "area": "Crypto / Bitcoin"
    }
  ],
  "gamePlan": "This week, I'm not trying to force another trade.\n\nWe already have exposure.\n\nSemiconductors, cybersecurity and software are showing the strongest short-term leadership.\n\nCrypto is finally improving.\n\nShipping's short-term momentum just deteriorated dramatically.\n\nAnd the broader market still hasn't really reacted to higher rates.\n\nThat combination tells me to stay selective.\n\nI'm watching semiconductors for new Stage 1 → Stage 2 candidates.\n\nI'm continuing to manage the exposure we already have in software and cybersecurity.\n\nI'm giving MSTR room to develop while waiting for the better $144–$148 add zone.\n\nAnd I'm watching whether the market finally starts pricing in the consequences of higher borrowing costs.\n\nBecause I still think a pullback is coming.\n\nI just don't know whether it starts Monday, next month, or after stocks move another 5% higher first.\n\nAnd we don't need to predict the exact day.\n\nWe need to make sure we're positioned so that if it comes, we have capital available to take advantage of it.",
  "opportunityIds": [
    "opportunity-001",
    "opportunity-004",
    "opportunity-002",
    "opportunity-003",
    "opportunity-005"
  ],
  "sectorSnapshots": [
    {
      "name": "Semiconductors",
      "ticker": "SMH",
      "periods": [
        {
          "period": "1W",
          "returnPct": 7.12,
          "rank": 1
        },
        {
          "period": "1M",
          "returnPct": 9.82,
          "rank": 2
        },
        {
          "period": "3M",
          "returnPct": -2.97,
          "rank": 11
        },
        {
          "period": "6M",
          "returnPct": 52.19,
          "rank": 2
        },
        {
          "period": "9M",
          "returnPct": 64.9,
          "rank": 1
        },
        {
          "period": "12M",
          "returnPct": 87.6,
          "rank": 1
        }
      ],
      "commentary": "Semiconductors are the largest change in the rankings. Three-month weakness followed by a sharp return to short-term leadership makes the group particularly interesting for the Stage 1 → Stage 2 framework. I want to investigate individual holdings for potential setups. Micron earnings become especially important against that renewed leadership."
    },
    {
      "name": "Cybersecurity",
      "ticker": "CIBR",
      "periods": [
        {
          "period": "1W",
          "returnPct": 1.51,
          "rank": 2
        },
        {
          "period": "1M",
          "returnPct": 10.69,
          "rank": 1
        },
        {
          "period": "3M",
          "returnPct": 23.25,
          "rank": 3
        },
        {
          "period": "6M",
          "returnPct": 64.02,
          "rank": 1
        },
        {
          "period": "9M",
          "returnPct": 42.02,
          "rank": 3
        },
        {
          "period": "12M",
          "returnPct": 37.03,
          "rank": 7
        }
      ],
      "commentary": "Persistent leadership across multiple timeframes supports the broader sector thesis behind ZS. Sector strength does not override company-specific problems; Zscaler still has to prove its own execution."
    },
    {
      "name": "Software",
      "ticker": "IGV",
      "periods": [
        {
          "period": "1W",
          "returnPct": 1.3,
          "rank": 3
        },
        {
          "period": "1M",
          "returnPct": 4.59,
          "rank": 3
        },
        {
          "period": "3M",
          "returnPct": 24.35,
          "rank": 1
        },
        {
          "period": "6M",
          "returnPct": 32.6,
          "rank": 3
        },
        {
          "period": "9M",
          "returnPct": -0.98,
          "rank": 16
        },
        {
          "period": "12M",
          "returnPct": -6.99,
          "rank": 21
        }
      ],
      "commentary": "Recent leadership contrasts sharply with poor longer-term returns, making software an interesting rotation and recovery area. That supports the broader logic behind NOW. I’m comfortable maintaining existing exposure rather than adding several more software trades and overconcentrating."
    },
    {
      "name": "Shipping & Air Cargo",
      "ticker": "SEA",
      "periods": [
        {
          "period": "1W",
          "returnPct": -4.29,
          "rank": 22
        },
        {
          "period": "1M",
          "returnPct": -1.96,
          "rank": 6
        },
        {
          "period": "3M",
          "returnPct": 17.78,
          "rank": 4
        },
        {
          "period": "6M",
          "returnPct": 17.98,
          "rank": 6
        },
        {
          "period": "9M",
          "returnPct": 38.01,
          "rank": 4
        },
        {
          "period": "12M",
          "returnPct": 46.03,
          "rank": 5
        }
      ],
      "commentary": "Long-term leader experiencing sharp short-term deterioration. SEA fell 19 places to rank #22 over one week. Last week’s research into persistent shipping strength can continue, but this week’s data does not support blindly chasing the sector. This is why we evaluate multiple timeframes."
    }
  ],
  "opportunityCommentary": [
    {
      "opportunityId": "opportunity-001",
      "body": "ZS pulled back sharply following the Chief Revenue Officer transition. I was surprised by the magnitude of the reaction. My interpretation is that the market is particularly sensitive to revenue leadership when Zscaler is already guiding toward slower growth. I don’t currently believe the CRO change alone destroys the long-term thesis.\n\nOctober 6 Investor Day could provide the next major catalyst or clarification. I want management to address long-term growth, revenue execution, sales productivity and the financial outlook. The event does not guarantee a rally."
    },
    {
      "opportunityId": "opportunity-004",
      "body": "No material change. Software remains strong in the Sector Gauge, and I’m comfortable maintaining our existing exposure rather than adding several more software trades. Average cost has not been documented."
    },
    {
      "opportunityId": "opportunity-002",
      "body": "Space is not showing strong short-term Sector Gauge leadership, so I’m not using the rankings as support for RKLB this week. Google’s Project Suncatcher is a longer-term industry development worth watching: an early experiment testing TPU / AI compute hardware in orbit.\n\nIf orbital computing eventually becomes viable, it could create additional demand for launch capacity, satellite manufacturing, orbital power, communications and space infrastructure. The immediate experiment is small. I’m not pricing hypothetical future demand into Rocket Lab today."
    },
    {
      "opportunityId": "opportunity-003",
      "body": "SpaceX remains above the previous breakout level in this week’s research, but I’m not chasing it. The existing pullback, breakout and base-invalidation framework remains in place. Project Suncatcher creates another possible future use case for launch infrastructure; one prototype does not justify changing the framework. No position has been opened."
    },
    {
      "opportunityId": "opportunity-005",
      "body": "Bitcoin’s structure has improved substantially after its major drawdown. I opened a starter MSTR position to gain equity exposure to the Bitcoin swing thesis and have not committed my full intended capital. The preferred add / reassessment zone remains conditional on the thesis holding. Reaching it does not automatically add shares."
    }
  ],
  "bitcoinScenario": {
    "heading": "What if Bitcoin returns to $125,000?",
    "bitcoinReference": 77288,
    "bitcoinScenario": 125000,
    "netBitcoinValuePerShare": 118.99,
    "mnav": 1.1,
    "displayRange": "~$210–$212",
    "assumptions": [
      "Bitcoin-per-share exposure remains approximately constant.",
      "mNAV remains 1.10x.",
      "No major dilution or capital-structure changes.",
      "No major changes in Strategy’s Bitcoin holdings."
    ],
    "explanation": "This is a simplified constant-mNAV scenario using the research inputs supplied for this issue, not a live valuation. MSTR can trade at materially different mNAV multiples. Strategy can purchase more Bitcoin, issue securities, change its capital structure or experience company-specific price changes. The scenario does not replace the documented trade target."
  },
  "longTermRadar": [
    {
      "title": "Long-term accumulation philosophy",
      "body": "I view Alphabet / Google, Microsoft, Amazon and Apple differently from short-term swing trades. My confidence in their staying power makes me comfortable treating large pullbacks as potential long-term accumulation opportunities. Meta can sometimes fit that category depending on valuation and setup. This is my investment philosophy, not a guarantee that these stocks rise over time."
    },
    {
      "title": "Meta / Muse — radar only",
      "body": "Muse has helped clarify Meta’s AI strategy for me. ChatGPT and Claude have substantial professional and productivity adoption; I see Muse as aimed more directly at a broad consumer audience through Meta’s enormous existing distribution.\n\nI’ve tried Muse and liked it, and I joined the waitlist for Muse Charm. But the stock has already made a significant move. I don’t want to chase it here. A meaningful pullback or a better entry setup would make me more interested again. There is no new Opportunity, entry, stop or target."
    },
    {
      "title": "Google / Project Suncatcher",
      "body": "Google remains a long-term holding / radar item. Project Suncatcher is an experimental attempt to test machine-learning compute hardware in orbit, including Google’s TPUs.\n\nI’m interested in the implications for Alphabet, SpaceX, Rocket Lab and the broader orbital-infrastructure ecosystem. A prototype test is an early-stage industry catalyst; it does not establish that orbital data centers are commercially viable or that revenue will increase materially."
    }
  ],
  "events": [
    {
      "day": "Monday / September 28",
      "title": "Jefferies · Vail Resorts",
      "description": "Earnings are on the research calendar. Oura’s IPO remains a developing market story; this is not a confirmed Monday trading debut.",
      "relevance": "Watch financial-market activity and consumer demand."
    },
    {
      "day": "Tuesday / September 29",
      "title": "OpenAI DevDay 2026",
      "description": "Sam Altman’s opening keynote and the developer program.",
      "relevance": "AI developer ecosystem, new tools and APIs, and possible downstream opportunities."
    },
    {
      "day": "Tuesday / September 29",
      "title": "NetApp INSIGHT begins",
      "description": "Enterprise data and AI infrastructure are in focus.",
      "relevance": "Watch storage demand and what customers need to deploy AI."
    },
    {
      "day": "Wednesday / September 30",
      "title": "Micron earnings",
      "description": "One of the most important events of the week. I’ll be live with TrendSpider at 4:00 PM Eastern on YouTube to cover Micron earnings.",
      "relevance": "AI memory, HBM and data-center demand are especially relevant as semiconductors return to short-term leadership."
    },
    {
      "day": "Wednesday / September 30",
      "title": "Core PCE / Personal Income & Outlays",
      "description": "Inflation remains central to the higher-rate thesis.",
      "relevance": "Is inflation moving enough to support a less restrictive future rate path? We’re watching the release, not predicting it."
    },
    {
      "day": "Wednesday / September 30",
      "title": "Oura IPO — expected / tentative",
      "description": "Oura is expected to begin trading under OURA around this date. The exact debut date remains tentative.",
      "relevance": "Watch demand for new listings; timing may change."
    },
    {
      "day": "Thursday / October 1",
      "title": "Accenture · Nike · McCormick",
      "description": "Earnings across enterprise consulting and consumer businesses.",
      "relevance": "Watch spending, demand and the effect of higher borrowing costs."
    },
    {
      "day": "Thursday / October 1",
      "title": "Project Suncatcher — tentative launch watch",
      "description": "A prototype carrying Google AI / TPU hardware is expected to launch aboard a SpaceX Falcon 9. Treat the October 1 timing as tentative pending launch confirmation.",
      "relevance": "An early experiment in orbital computing, with possible long-term implications for launch and satellite infrastructure."
    },
    {
      "day": "Friday / October 2",
      "title": "September jobs report",
      "description": "Can the labor market continue absorbing higher borrowing costs?",
      "relevance": "The report is a key test of economic resilience. No jobs number or consensus forecast is assumed."
    }
  ],
  "sources": [
    {
      "label": "Micron earnings announcement",
      "url": "https://investors.micron.com/news/press-release/2026/Micron-Technology-to-Report-Fiscal-Fourth-Quarter-Results-on-September-30-2026/default.aspx"
    },
    {
      "label": "BEA release schedule",
      "url": "https://www.bea.gov/news/schedule"
    },
    {
      "label": "BLS Employment Situation schedule",
      "url": "https://www.bls.gov/schedule/news_release/empsit.htm"
    },
    {
      "label": "Zscaler Investor Day",
      "url": "https://ir.zscaler.com/news-releases/news-release-details/zscaler-host-investor-day-october-6"
    },
    {
      "label": "Project Suncatcher research",
      "url": "https://blog.google/innovation-and-ai/models-and-research/google-research/google-project-suncatcher-facts/"
    },
    {
      "label": "OpenAI DevDay",
      "url": "https://devday.openai.com/"
    },
    {
      "label": "NetApp INSIGHT",
      "url": "https://www.netapp.com/insight/agenda/"
    },
    {
      "label": "Meta Muse",
      "url": "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/"
    }
  ]
});

export function getPublishedOpportunities(){return selectPublished(opportunities);}
export function getPublishedOpportunity(slug:string){return selectOpportunity(slug,opportunities);}
export function getOpportunityUpdates(id:string){return selectUpdates(id,opportunityUpdates);}
export function getRecentOpportunityUpdates(limit=3){
 return getPublishedOpportunities().flatMap(opportunity=>getOpportunityUpdates(opportunity.id).map(update=>({opportunity,update})))
  .sort((a,b)=>b.update.publishedAt.localeCompare(a.update.publishedAt)).slice(0,limit);
}

export function getPublishedWeeklyOutlooks(){
 return weeklyOutlooks.filter(o=>o.publicationState==='published').sort((a,b)=>b.weekOf.localeCompare(a.weekOf));
}
export function getLatestWeeklyOutlook(){return getPublishedWeeklyOutlooks()[0];}
export function getWeeklyOutlookOpportunities(outlook:WeeklyOutlook){
 const records=getPublishedOpportunities();
 return outlook.opportunityIds.flatMap(id=>{const record=records.find(o=>o.id===id);return record?[record]:[];});
}
