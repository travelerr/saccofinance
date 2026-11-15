import type {WeeklyOutlook} from './premium-content';
import {admaOpportunity} from './adma-opportunity';
import {dgOpportunity} from './dg-opportunity';
import {uhsOpportunity} from './uhs-opportunity';

const opportunities = [admaOpportunity, uhsOpportunity, dgOpportunity];
const posture = 'CAUTIOUS / SELECTIVE — BEGINNING TO REASSESS AI OPPORTUNITIES';
const article = `## My market outlook

**${posture}**

Tuesday's Nvidia earnings call is the first time I'll hear management lay out its outlook since Jensen Huang resigned. On November 11, the board accepted his resignation as president, CEO and director. Nvidia announced the transition on November 12. Colette Kress is serving as interim CEO and continues as CFO.

The timing matters to me. Investors were already questioning how much cash it will take to build AI capacity and how quickly that investment can earn a return. Now I want to hear who will make the next spending and product decisions at Nvidia. I can evaluate what the board has announced without making assumptions about allegations surrounding Huang's departure.

Last week's reports gave me two different reads. CoreWeave raised its 2026 revenue guidance to $13.0–$13.3 billion because it expects to deliver capacity sooner. That's encouraging evidence that deployment can turn into revenue. At Nebius, four new sites began generating revenue and adjusted EBITDA turned positive year over year. My read is more mixed because the buildout also brings higher depreciation. I want to see how much of the growth translates into cash after equipment and data-center spending.

The October Fed meeting and much of big tech earnings season are behind us. The Fed held its target range at 3.75%–4.00%. The IEA also reported that recovering Gulf exports helped bring North Sea Dated crude down from an early-October high of $136 a barrel to about $93. That eases one pressure on the market, even as attacks on energy infrastructure leave supply exposed.

## What I need to see from the Nasdaq

The Nasdaq Composite closed Friday, November 13 at 25,136.27, roughly one point below its 200-day simple moving average of 25,137.41. It had finished above that average on Thursday. Friday's close was still well above the November 5 closing low of 24,315.00.

That's an attempt to stabilize. What would give me confidence is a pullback that holds above the recent lows, followed by a recovery that includes more technology stocks. A break below those lows would keep me defensive. I suspect profit-taking and rotation contributed to the correction, but price changes alone can't tell me which institutions sold or why.

## Where I'm finding opportunities

The one-month Sector Gauge through November 13 helps explain where I've spent my research time. Healthcare (XLV) gained 11.31% and consumer staples (XLP) gained 9.69%, while SPY lost 3.04% and technology (XLK) fell 13.25%. Selected AI stocks look more interesting to me at these prices. I still want to see buyers defend support before I increase exposure.

Looking through the IBB Biotechnology ETF led me to ADMA. Its improving chart and revenue trend caught my attention, and I'm watching for a pullback. UHS in healthcare and DG in consumer staples are two other examples of how I'm following sector strength down to individual companies.

Biotech also gives me a different way to think about AI. A drug developer might use it to narrow a list of compounds before committing money to lab work. That could save time and research dollars. I would still want evidence that those savings matter to the business, and the compounds still have to succeed in clinical testing.

## My Nvidia plan

I took profits in Nvidia when the leadership news broke. I've since used some of that capital to trade Micron. For Nvidia, **$130–$140 is the range where I'd be particularly interested in rebuilding exposure.** I'm using that range to plan a possible entry. I could consider a smaller entry at a higher price if support develops and the broader market improves.

I expect the underlying business to remain strong. On Tuesday I'll listen for what customers are committing to, how management expects margins to hold up, and whether its spending plans or product timetable have changed. Then I'll watch how the stock trades after investors have heard the guidance. That's what will help me decide whether to act.

## How I'd approach Anthropic's IPO

I've received an opportunity to request 100 shares. My allocation and purchase are both unconfirmed. Anthropic's November 10 preliminary prospectus gives a proposed Nasdaq symbol of **ANT** and an indicative range of **$70–$78**. Pricing is expected Wednesday evening, with a possible Thursday debut. The final price, timing and number of shares I might receive can all change.

The initial surge in SpaceX is one scenario I'm preparing for. If I receive shares and Anthropic opens sharply higher, I'd consider selling into that strength and reassessing on a pullback. It could also open lower or keep rising after I sell. If I receive no shares, I'm comfortable watching the first sessions without chasing the opening print.

## What I'll look for in 13F filings

Monday is the filing deadline for the quarter ended September 30. I'll compare managers' reported share counts across quarters. A holding can grow in dollar value simply because its share price rose, so a change in value alone tells me little about buying.

These filings cover specified securities, omit short equity positions and can be weeks out of date. They can't explain who sold during November's correction. What they can do is point me toward companies worth checking against today's Sector Gauge, financials and charts.

## The week ahead · November 16–20

**Monday, November 16** — Q3 Form 13F deadline. Baidu, XPeng and POET Technologies report results.

**Tuesday, November 17** — October advance retail sales at 8:30 a.m. Eastern. Home Depot, Disney, Weibo and Klarna report. Microsoft Ignite opens and runs through Friday. Nvidia expects results around 4:20 p.m. Eastern, followed by its call at 5 p.m.

**Wednesday, November 18** — Lowe's, Target and Palo Alto Networks report. In a reported staff memo, Kress scheduled an internal Nvidia meeting for noon Eastern. The Fed releases its October meeting minutes at 2 p.m. Eastern. Anthropic's IPO pricing is expected in the evening.

**Thursday, November 19** — Walmart, Alibaba, Intuit and Webull report. I'll watch for confirmation that Anthropic has priced and that trading will begin.

**Friday, November 20** — BJ's Wholesale Club reports before the open, with its call at 8:30 a.m. Eastern.

## Bottom line

I'm beginning to reassess AI opportunities while healthcare, staples and biotech still have my attention. If Nvidia's guidance holds up, the Nasdaq defends its lows and more technology stocks participate, I'll have a reason to start adding selectively. If support fails, I'll preserve capital. I can miss the bottom and still participate in the next sustainable move.`;

export const weeklyOutlook009: WeeklyOutlook = {
  id: 'weekly-outlook-009',
  slug: 'issue-009',
  title: "Weekly Market Outlook: Nvidia's Leadership Crisis and the Next AI Opportunity",
  weekOf: '2026-11-16',
  weekEnd: '2026-11-20',
  publishedAt: '2026-11-15',
  sourceCheckedAt: '2026-11-15',
  publicationState: 'published',
  marketPosture: posture,
  marketContext: "I'm reassessing selected AI stocks as the Nasdaq tests its 200-day average.",
  sectorFocus: 'Healthcare, consumer staples and biotechnology.',
  gamePlan: "Watch Nvidia's guidance and the market's response before increasing exposure.",
  summary: "My Nvidia buying range, how I'd approach an Anthropic allocation, and what I need to see from the Nasdaq.",
  opportunityIds: opportunities.map(o => o.id),
  articleMarkdown: article,
  notification: {
    subject: "Nvidia's Leadership Crisis, Anthropic's IPO & My Next AI Trades",
    preview: "I'm beginning to reassess AI opportunities, but I'm not ready to abandon my cautious approach.",
    cta: 'View the Full Weekly Market Outlook',
  },
  notificationSummary: article.replace(/^## (.+)$/gm, '**$1**').replace(/\b(ADMA|UHS|DG)\b/g, ticker => {
    const opportunity = opportunities.find(o => o.ticker === ticker)!;
    return `[${ticker}](/premium/opportunities/${opportunity.slug})`;
  }),
  disclosure: 'These are my personal research and trading plans. Investing involves risk, including loss of principal.',
  sources: [
    {label: "Nvidia CEO transition and earnings timetable", url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-CEO-Transition/'},
    {label: "Reported Kress memo to Nvidia employees", url: 'https://www.tomsguide.com/news/live/jensen-huang-nvidia-crisis-live-november-2026'},
    {label: "Nvidia Form 8-K", url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000082/nvda-20261111.htm'},
    {label: "CoreWeave quarterly results", url: 'https://investors.coreweave.com/news/news-details/2026/CoreWeave-Reports-Strong-Third-Quarter-2026-Results/'},
    {label: "Nebius shareholder letter", url: 'https://assets.nebius.com/assets/721c566e-9ba5-4935-ad24-b1209116a4cc/Nebius-SHL-2026-Q3.pdf'},
    {label: "Nasdaq Composite daily closes", url: 'https://portfolio-terminal.com/markets/nasdaq-composite/november-2026'},
    {label: "November 13 daily chart and 200-session average", url: 'https://forexnese.com/charts/nasdaq'},
    {label: "Federal Reserve October decision", url: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a.htm'},
    {label: "Federal Reserve November calendar", url: 'https://www.federalreserve.gov/newsevents/2026-November.htm'},
    {label: "IEA November Oil Market Report", url: 'https://www.iea.org/reports/oil-market-report-november-2026'},
    {label: "Anthropic preliminary prospectus", url: 'https://ipo.anthropic.com/documents/us/prospectus.pdf'},
    {label: "Fidelity expected pricing schedule", url: 'https://www.fidelity.com/learning-center/trading-investing/how-to-buy-anthropic-stock'},
    {label: "Nasdaq Index Research on the anticipated debut", url: 'https://www.nasdaq.com/articles/global-indexes/biweekly-investment-insights-ai-theme-concerns-accelerate-market-rotation'},
    {label: "SEC 13F coverage and deadlines", url: 'https://www.sec.gov/rules-regulations/staff-guidance/frequently-asked-questions-about-form-13f'},
    {label: "Census advance retail sales schedule", url: 'https://www.census.gov/retail/release_schedule.html'},
    {label: "POET Technologies to Report Third Quarter 2026 Financial Results on November 16", url: 'https://www.poet-technologies.com/news/poet-technologies-to-report-third-quarter-2026-financial-results-on-november-16'},
    {label: "Baidu to Report Third Quarter 2026 Financial Results on November 16, 2026", url: 'https://ir.baidu.com/node/14976/pdf'},
    {label: "XPENG to Report Third Quarter 2026 Financial Results on Monday, November 16, 2026", url: 'https://ir.xiaopeng.com/zh-hant/news-releases/news-release-details/xpeng-report-third-quarter-2026-financial-results-monday'},
    {label: "Get ready for Microsoft Ignite 2026", url: 'https://techcommunity.microsoft.com/blog/partnernews/get-ready-for-microsoft-ignite-2026/4568837'},
    {label: "The Walt Disney Company - The Walt Disney Company Executives to Discuss Fiscal Full Year and Fourth Quarter 2026 Financial Results via Webcast", url: 'https://investors.thewaltdisneycompany.com/news/news-details/2026/The-Walt-Disney-Company-Executives-to-Discuss-Fiscal-Full-Year-and-Fourth-Quarter-2026-Financial-Results-via-Webcast/default.aspx'},
    {label: "The Home Depot to Host Third Quarter Earnings Conference Call on November 17", url: 'https://ir.homedepot.com/news-releases/2026/11-03-2026-130236805'},
    {label: "Lowe's Companies, Inc. to Host Third Quarter 2026 Earnings Conference Call on Nov. 18", url: 'https://corporate.lowes.com/newsroom/press-releases/lowes-companies-inc-host-third-quarter-2026-earnings-conference-call-nov-18'},
    {label: "Target earnings", url: 'https://corporate.target.com/investors/events-presentations'},
    {label: "Palo Alto Networks to Announce Fiscal First Quarter 2027 Financial Results on Wednesday, November 18, 2026 - Palo Alto Networks", url: 'https://origin-www.paloaltonetworks.com/company/press/2026/palo-alto-networks-to-announce-fiscal-first-quarter-2027-financial-results-on-wednesday--november-18--2026'},
    {label: "Alibaba Group Will Announce September Quarter 2026 Results on November 19, 2026-Alibaba Group", url: 'https://home.alibabagroup.com/en-US/document-2054756418245885952'},
    {label: "Intuit to Announce First-Quarter Fiscal Year 2027 Results on Nov. 19 :: Intuit Inc. (INTU)", url: 'https://investors.intuit.com/news-events/press-releases/detail/1330/intuit-to-announce-first-quarter-fiscal-year-2027-results-on-nov-19'},
    {label: "BJ’s Wholesale Club Announces Third Quarter Fiscal 2026 Earnings Conference Call Date – BJ’s Wholesale Club Holdings, Inc.", url: 'https://investors.bjs.com/press-releases/press-release-details/2026/BJs-Wholesale-Club-Announces-Third-Quarter-Fiscal-2026-Earnings-Conference-Call-Date/default.aspx'},
    {label: "Weibo earnings", url: 'https://weibocorporation.gcs-web.com/news-releases/news-release-details/weibo-corporation-report-third-quarter-2026-financial-results'},
    {label: "Klarna earnings", url: 'https://investors.klarna.com/News--Events/news/news-details/2026/Klarna-to-Publish-Q3-2026-Earnings-on-November-17-2026/default.aspx'},
    {label: "Walmart earnings", url: 'https://corporate.walmart.com/news/2026/11/Walmart-To-Host-Q3-Earnings-Call-Nov-19-2026'},
    {label: "Webull earnings", url: 'https://www.webull.com/news/15871561118606336'},
  ],
};
