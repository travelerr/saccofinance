import type {WeeklyOutlook} from './premium-content';

// Dated editorial summaries. These never replace the original article or live trade records.
export type OutlookBrief = {take:string;market:string;sectors:string;positions:string;plan:string};
export const outlookBriefs:Record<string,OutlookBrief>={
 'weekly-outlook-001':{
 take:"I'm staying selective while the market absorbs higher rates. I want confirmation from the indexes and sector leadership before adding exposure.",
 market:"The indexes have held their broader structure, but participation has been uneven. I'm watching whether elevated yields begin weighing on equities; weaker breadth or failed support would make me reduce my appetite for risk.",
 sectors:"Shipping and air cargo keep appearing across the Gauge's timeframes, making them a research priority. Software and cybersecurity remain strong, space and robotics are emerging, and energy stays on my radar while oil is elevated.",
 positions:"I'm managing the RKLB, NOW and ZS positions discussed in this issue without adding several versions of the same sector trade. SPCX remains a watching setup: a breakout is a reason to investigate, not a reason to chase.",
 plan:"I want to see Monday and Tuesday's trading before becoming more aggressive. If market structure and leadership hold, I'll research new setups; if weakness spreads, I'll become more selective. Shipping and air cargo are my next area for deeper research."
 },
 'weekly-outlook-002':{
 take:"I'm staying invested but preserving capital for better entries. Strong indexes and narrowing leadership can coexist, and I think higher rates may still weigh on prices.",
 market:"Elevated yields, inflation and labor-market data are interacting with expensive valuations. I'm watching whether earnings and economic releases support resilience or make a broader pullback more likely; I don't know when that pullback would begin.",
 sectors:"Semiconductors, cybersecurity and software lead this issue's dated short-term rankings. Shipping's momentum has weakened sharply, while improving Bitcoin structure is drawing my attention. Sector performance is a research filter, not an automatic entry.",
 positions:"I opened a starter MSTR position and want a better entry before adding. I'm monitoring Zscaler's revenue leadership change ahead of Investor Day, maintaining existing software exposure, and keeping SPCX on watch rather than chasing its breakout.",
 plan:"I won't force another trade. I'll research semiconductor setups, manage existing software and cybersecurity exposure, and keep capital available if higher borrowing costs finally pressure the market. Any addition still needs a constructive setup."
 },
 'weekly-outlook-003':{
 take:"I'm selective as employment cools while AI leadership holds. Lower yields could help growth stocks, but I want the economic data to support that view.",
 market:"Cooling employment may reduce pressure for further tightening, while elevated Treasury yields remain a valuation headwind. I'm watching the relationship between jobs, Fed expectations and yields rather than forecasting the entire market.",
 sectors:"Shipping has recovered in this issue's dated Gauge snapshot, semiconductors remain strong, and software and cybersecurity are holding up. I'm putting shipping back on my research list and taking another look at Micron and the semiconductor group.",
 positions:"Zscaler Investor Day is a major checkpoint for my existing thesis. I want answers on growth, execution and demand rather than assume the event will produce a rally. Position management remains documented on each Opportunity.",
 plan:"I'll watch the 10-year yield, jobless claims and the Fed minutes, and listen closely to Zscaler. If cooling employment takes pressure off rates, that could improve conditions for growth stocks. Until then, I want evidence before committing more capital."
 },
 'weekly-outlook-004':{
 take:"I'm looking for earnings to reset expectations and create better entries. Strong results alone aren't enough; I want the business, price and technical setup to align.",
 market:"Banks and inflation are this week's major tests. I'm watching credit quality, funding costs and guidance alongside CPI and PPI. Favorable earnings and inflation could support equities, while conflicting signals could increase volatility.",
 sectors:"Financials could become a new research area if earnings and sustained Gauge strength support the case. Enterprise AI implementation remains interesting through EPAM. I'm looking for strong sectors and constructive charts after earnings, not buying every selloff.",
 positions:"I review the completed NOW and original ZS trades and whether I tightened stops too aggressively. EPAM's enterprise AI initiative supports the research thesis, but I still need evidence of revenue and profitability. The original article preserves the position levels used at publication.",
 plan:"I'll investigate strong businesses whose shares fall after credible earnings, then check guidance and technical support. I want stop adjustments tied to structure rather than discomfort with giving back gains. A post-earnings decline is a research lead, not a buy signal."
 },
 'weekly-outlook-005':{
 take:"I'm leaning toward rotation rather than a broad market breakdown. After several losing exits, I'm prioritizing quality and waiting for stronger setups.",
 market:"Breadth shows some encouraging signs, but the dated observations in my research have not all been independently reconciled. Concentration, elevated yields and AI financing remain risks. Sustained participation would support my rotation view; spreading weakness would challenge it.",
 sectors:"Consumer staples, energy, aerospace and defense, natural gas equities, gold miners, biotechnology and regional banks lead the dated one-week snapshot. Relative performance is not proof of capital inflows, but it gives me places to investigate outside technology.",
 positions:"I closed SMCI, MSTR and RKLB and review those losses alongside earlier NOW and ZS gains. EPAM remains a focus and SPCX remains on watch. I also discuss early WK accumulation; exact fills were not reconciled in this issue. Later confirmed records belong on the Opportunity Board.",
 plan:"I want strong businesses, improving fundamentals, constructive technical structures and defined risk. I'll watch earnings reactions and whether broader leadership persists. Fewer opportunities are acceptable; I won't force trades simply to keep the board busy."
 },
 'weekly-outlook-006':{
 take:"I'm leaning toward rotation out of AI, but this week's earnings and economic data could challenge that view. I'll manage existing positions while waiting for stabilization in technology.",
 market:"Big Tech must show that AI demand can support investment and cash flow. The Fed, GDP and inflation could change the rate outlook. Elevated valuations and financing needs keep me cautious; strong revenue alone doesn't settle the economics of AI spending.",
 sectors:"I'm researching enterprise software, cybersecurity, healthcare and energy. I want fundamental quality and technical confirmation together. AI infrastructure names remain research candidates, not automatic purchases because prices have fallen.",
 positions:"My second ZS trade closed after reaching its target. I review EPAM and WK management and CNC ahead of earnings; CNC was still Watching when this issue was published. SPCX remains a watch item, with supply-event details qualified in the full research.",
 plan:"I'll ask whether AI demand justifies spending, whether rates can become less of a headwind, and whether sector rotation holds. I want selling pressure to ease before adding AI exposure and will continue researching stronger sectors in the meantime."
 },
 'weekly-outlook-007':{
 take:"I'm cautiously selective. AI stocks are under pressure, but I'm following strength elsewhere and waiting for technology's price structures to stabilize.",
 market:"I'm leaning toward sector rotation rather than a market-wide collapse. My roughly 8% Nasdaq decline and 63% breadth observations are approximate and not independently reconciled, so I won't treat them as precise trading signals. Earnings, jobs and the December rate outlook could still change the picture.",
 sectors:"I'm focused on energy, healthcare, enterprise software and cybersecurity. I want broader participation to produce durable setups, not just a brief bounce. If weakness spreads beyond technology, I'll reassess my rotation thesis and risk exposure.",
 positions:"AR: I opened 100 shares at $41.66, with a $45 target and preliminary $39.75 stop reference. CNC: my latest confirmed holding for this issue is 15 shares at $67.80, with a $75 target and preliminary $65 stop reference. Neither stop order is confirmed. WK: I'm considering an exit before Thursday's earnings, but no exit is confirmed.",
 plan:"I'll watch whether earnings rebuild confidence in AI and whether Friday's jobs report changes the rate outlook. I want support, consolidation and returning buyers before taking new AI swing trades. I'll review WK ahead of earnings and document any actual transaction separately."
 }
};

export function outlookCalendar(outlook:WeeklyOutlook):{day:string;event:string}[]{
 if(outlook.events?.length){const grouped=new Map<string,string[]>();for(const event of outlook.events)grouped.set(event.day,[...(grouped.get(event.day)||[]),event.title]);return [...grouped].map(([day,events])=>({day,event:events.join('; ')}));}
 const article=outlook.articleMarkdown||'';
 const table=article.split(/\n\s*\n/).find(b=>b.startsWith('| Day |'));
 if(table)return table.split('\n').slice(2).map(line=>{const cells=line.split('|').slice(1,-1).map(s=>s.trim());return {day:cells[0],event:cells.slice(1).join(' — ')};});
 // Older issues use daily subheadings; keep their exact opening paragraph or first two list items.
 return [...article.matchAll(/### ((?:Monday|Tuesday|Wednesday|Thursday|Friday)[^\n]*)\n+([\s\S]*?)(?=\n### |\n---|\n## |$)/g)].map(m=>({day:m[1],event:m[2].trim().split(/\n\s*\n/)[0].split('\n').slice(0,2).join(' ').replace(/^- /,'')}));
}
