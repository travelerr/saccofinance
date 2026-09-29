# Tools I Use — local review

Placement: bottom of Premium Dashboard, after Opportunities. No new navigation or contextual research CTAs.

## Exact copy

TOOLS I USE

The platforms behind my research.

These are tools I personally use to analyze charts and research companies. You don’t need either to use Premium—they’re separate, optional products for anyone who wants to go deeper into my process.

### TrendSpider

Technical analysis, scanning & trade setups

I use TrendSpider for charting, scanning for setups, Stage Analysis, Bottom Catcher signals, and backtesting ideas. Many of the technical charts and signals inside Premium come from this workflow.

CTA: View current TrendSpider deals

URL: https://trendspider.com?_go=justin-4f7fc2

Affiliate link — I may earn a commission if you sign up through this link, at no additional cost to you.

### Seeking Alpha

Fundamentals, earnings & company research

I use Seeking Alpha to dig into financial statements, earnings history, analyst estimates, earnings-call transcripts, valuation metrics, and company research—to move beyond the chart and understand the business.

CTA: View Seeking Alpha’s current offer

URL: https://link.seekingalpha.com/5FNXWBJ/4G6SHH/

Affiliate link — I may earn a commission if you sign up through this link, at no additional cost to you.

## Assets and offer verification

TrendSpider Black Banner for light mode and White Banner for dark mode, copied without alteration. Seeking Alpha Main JPG on a white logo panel in both themes. Powered by overlay excluded to avoid suggesting the site is powered by Seeking Alpha. No recreated or recolored logos.

Both affiliate destinations were attempted through the web verification tool but returned inaccessible results. No price, discount, trial or eligibility claims are made. Exact supplied hrefs and new-tab security attributes are verified; external landing-page availability and promotions remain unverified.

## Tracking

Existing consent-aware AnalyticsProvider emits affiliate_link_click with fixed affiliate_partner, placement=premium_tools, and canonical destination labels. Exact URL matching rejects unexpected URLs. No email, Supabase ID, Stripe ID or payment fields are added. Existing consent, GPC, environment and admin exclusions remain in force. Local tests use preview mode, not Google transport.

## Disclosure

Each card displays the commission disclosure adjacent to its CTA. The existing Disclosures affiliate paragraph now describes research/trading platform programs, no additional customer cost, and editorial independence.

## Files changed

- lib/affiliate-tools.ts — central URLs, copy, logos and safe event parameters
- components/premium/tools-i-use.tsx and tools-i-use.css — reusable section
- app/premium/dashboard/page.tsx — placement
- components/analytics/analytics-provider.tsx — outbound click integration
- app/disclosures/page.tsx — affiliate paragraph
- scripts/test-analytics.cjs — URL and parameter regression coverage
- public/images/tools/trendspider-light.png, trendspider-dark.png, seeking-alpha.jpg
- docs/releases/tools-i-use.md — this report

## Validation

Typecheck passed; 79 offline tests passed; production build passed with network access for existing Google Fonts. Light/dark desktop and 390px mobile checked with no horizontal overflow. Real browser listener emitted both partner events in local preview; denying consent emitted none. No opportunity records, authentication, Stripe or billing files changed. No emails sent, commit or deployment performed.
