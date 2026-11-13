import type {Opportunity} from './premium-content';

export const admaOpportunity: Opportunity = {
  id: 'opportunity-017',
  slug: 'adma-biologics-017',
  ticker: 'ADMA',
  company: 'ADMA Biologics',
  title: "ADMA — A Biotech Setup I'm Watching for a Pullback",
  publicationState: 'published',
  publishedAt: '2026-11-13',
  updatedAt: '2026-11-13',
  researchPublishedAt: '2026-11-13',
  tradeStatus: 'Watching',
  technicalStage: 'Confirmed Stage 2 (TrendSpider)',
  strategy: 'Potential Swing Trade',
  sector: 'Healthcare',
  etfTickers: ['IBB'],
  summary: "I found ADMA in the iShares Biotechnology ETF. Its Stage 2 recovery caught my attention, but at the November 12 close of $13.24, I’d prefer a pullback toward $12.30. I haven’t purchased shares.",
  whySurfaced: "With technology stocks struggling, I started looking through IBB’s holdings for strength outside AI infrastructure. I’m interested in whether biotech companies could eventually use AI to accelerate drug discovery and improve profitability. For ADMA specifically, what drew me in was the combination of rising revenue and a recovering share price.",
  setupThesis: "TrendSpider identifies a confirmed Stage 2 trend. My TradingView chart shows ADMA above both moving averages, but the 50-day at $10.49 is still below the 200-day at $10.74. I want to see that crossover. RSI looks to be in the upper 60s, near the usual overbought threshold of 70. That momentum gives me another reason to wait for a pullback.",
  nextCondition: "I want buyers to defend the $12.30 area and the 50-day average to cross above the 200-day. If both develop, I’ll reassess the entry.",
  nextStepSummary: "I’m waiting for support near $12.30 and a moving-average crossover.",
  entryFramework: "My preferred entry is around $12.30. My initial target near $16.40 corresponds to a previous trading high.",
  riskInvalidation: "My chart marks a proposed stop at $10.24. From $12.30, that puts $2.06 per share at risk for $4.10 of potential upside, or 1.99:1. These are preliminary research levels.",
  proposedLevels: [
    {label:'Reference price',value:'$13.24 · November 12 close'},
    {label:'Potential entry',value:'$12.30'},
    {label:'Proposed stop',value:'$10.24'},
    {label:'Initial target',value:'$16.40'},
    {label:'Reward-to-risk',value:'1.99:1'},
  ],
  fundamentalCase: "The five-year chart shows revenue trending higher. Seeking Alpha grades profitability A and momentum A−, while growth earns D+, valuation C+ and earnings revisions B−. I see that tension in the ratings too. Wall Street rates ADMA Buy, while Seeking Alpha analysts and Quant both rate it Hold.",
  researchSections: [{
    title:'Financial health and valuation',
    body:"InvestingPro rates financial health “Great Performance.” Cash flow covers interest payments, though three analysts lowered earnings estimates for the upcoming period. I want to see whether the company can sustain profitability as it grows.\n\nInvestingPro’s $16.22 fair value estimate carries medium uncertainty. It gives me a second reference near my technical target. The four analyst targets average $18 and range from $13 to $22.",
  }],
  primaryRisks: [
    {title:'Price and trend confirmation',explanation:'I’ll reassess if support fails near $12.30, the recovery weakens or the moving averages fail to cross.'},
    {title:'Operating results and valuation',explanation:'Further earnings cuts could leave the stock expensive even after a pullback.'},
    {title:'Biotech participation',explanation:'I’m watching whether IBB holds its rising trend. Broader biotech weakness would reduce my confidence in ADMA.'},
  ],
  thesisChanges: "I’d want to revisit the setup if ADMA loses support or IBB begins breaking down.",
  justinsTake: "ADMA stays on my watchlist. If it pulls back toward $12.30 with the technical structure intact, I’ll take another look. If it keeps running, I’m comfortable waiting.",
  charts: [
  {
    "src": "/api/premium/chart/adma-tradingview-2026-11-13",
    "placement": "setup",
    "source": "TradingView",
    "caption": "The chart tool uses $12.29 for entry, $10.24 for the stop and $16.38 for the target, approximately 2:1 before rounding.",
    "alt": "TradingView — The chart tool uses $12.29 for entry, $10.24 for the stop and $16.38 for the target, approximately 2:1 before rounding.",
    "asOf": "2026-11-13",
    "width": 3212,
    "height": 1854
  },
  {
    "src": "/api/premium/chart/adma-trendspider-2026-11-13",
    "placement": "confirmation",
    "source": "TrendSpider",
    "caption": "Stage 2 recovery with RSI approaching 70.",
    "alt": "TrendSpider — Stage 2 recovery with RSI approaching 70.",
    "asOf": "2026-11-13",
    "width": 1292,
    "height": 846
  },
  {
    "src": "/api/premium/chart/adma-seeking-alpha-2026-11-13",
    "placement": "fundamentals",
    "source": "Seeking Alpha",
    "caption": "Profitability and momentum lead the factor grades, while growth lags.",
    "alt": "Seeking Alpha — Profitability and momentum lead the factor grades, while growth lags.",
    "asOf": "2026-11-13",
    "width": 2504,
    "height": 1350
  },
  {
    "src": "/api/premium/chart/adma-investingpro-2026-11-13",
    "placement": "fundamentals",
    "source": "InvestingPro",
    "caption": "Model fair value of $16.22 and analyst targets averaging $18.",
    "alt": "InvestingPro — Model fair value of $16.22 and analyst targets averaging $18.",
    "asOf": "2026-11-13",
    "width": 2216,
    "height": 1520
  },
  {
    "src": "/api/premium/chart/adma-revenue-2026-11-13",
    "placement": "fundamentals",
    "source": "Five-year financial chart",
    "caption": "The five-year revenue trend alongside earnings, price and analyst expectations.",
    "alt": "Five-year financial chart — The five-year revenue trend alongside earnings, price and analyst expectations.",
    "asOf": "2026-11-13",
    "width": 1872,
    "height": 740
  },
  {
    "src": "/api/premium/chart/adma-ibb-2026-11-13",
    "placement": "origin",
    "source": "TradingView",
    "caption": "IBB closed at $213.43, above both moving averages on my sector chart.",
    "alt": "TradingView — IBB closed at $213.43, above both moving averages on my sector chart.",
    "asOf": "2026-11-13",
    "width": 3212,
    "height": 1854
  }
],
};
