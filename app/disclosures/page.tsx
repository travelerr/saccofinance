import {Eyebrow} from "@/components/brand/editorial";
import {brandLinks} from "@/lib/editorial";
import {pageMetadata} from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Disclosures",
  "Educational and informational disclosures for Sacco Financial content, research, and Sacco Premium.",
  "/disclosures",
);

export default function Page() {
  return (
    <main id="main-content" className="container legal-page">
      <Eyebrow>Sacco Financial / Legal</Eyebrow>
      <h1>Disclosures</h1>
      <p className="legal-updated">Last updated: September 2026</p>

      <h2>General Information</h2>
      <p>
        Sacco Financial provides financial market commentary, investment research, educational content, opinions, analysis, and related information for informational and educational purposes only.
      </p>
      <p>
        Nothing published by Sacco Financial, including content on this website, Sacco Premium, social media, videos, livestreams, newsletters, watchlists, research reports, or other communications, should be construed as individualized investment, financial, legal, accounting, or tax advice.
      </p>
      <p>
        Sacco Financial does not provide personalized investment recommendations and does not act as your investment adviser, broker-dealer, fiduciary, attorney, accountant, or tax adviser.
      </p>
      <p>You are solely responsible for your own investment decisions.</p>

      <h2>Investment Risk</h2>
      <p>
        Investing involves risk, including the possible loss of principal. Stocks, options, cryptocurrencies, IPOs, and other securities or financial instruments discussed by Sacco Financial may be volatile and may result in substantial losses.
      </p>
      <p>
        There is no guarantee that any investment, strategy, price target, market outlook, technical setup, or thesis discussed will perform as anticipated.
      </p>
      <p>Past performance is not indicative of future results.</p>
      <p>
        Before making an investment decision, you should conduct your own research and consider your financial circumstances, objectives, risk tolerance, and, when appropriate, consult a qualified professional.
      </p>

      <h2>Opinions and Market Commentary</h2>
      <p>Content published by Sacco Financial reflects opinions and analysis at the time it is created.</p>
      <p>
        Markets and companies can change rapidly. New information may cause an investment thesis, opinion, price target, watchlist status, or market outlook to change without notice.
      </p>
      <p>Sacco Financial is under no obligation to update previously published content when circumstances change.</p>
      <p>
        Statements regarding future events, company performance, market conditions, price targets, or expected outcomes are inherently uncertain and should not be treated as guarantees.
      </p>

      <h2>Personal Investments and Conflicts of Interest</h2>
      <p>
        Justin Sacco and/or persons associated with Sacco Financial may own, buy, sell, or otherwise have a financial interest in securities or other investments discussed in Sacco Financial content.
      </p>
      <p>
        Positions may exist before a security is discussed and may be increased, reduced, or closed after publication without notice.
      </p>
      <p>
        The inclusion of a security in a Sacco Financial watchlist, research report, video, article, livestream, Premium publication, or other content does not constitute a recommendation that you buy or sell that security.
      </p>

      <h2>Sacco Premium</h2>
      <p>
        Sacco Premium provides subscribers with additional market commentary, research, watchlists, investment ideas, technical analysis, price levels, catalysts, and other educational information.
      </p>
      <p>Premium content represents research and opinions—not personalized investment advice.</p>
      <p>
        References to securities Sacco Financial is “watching,” “buying,” “interested in,” “bullish on,” “bearish on,” or considering at particular prices describe the author’s own research and perspective. They are not instructions for subscribers to make the same trades.
      </p>
      <p>Subscribers should independently evaluate every investment decision.</p>

      <h2>Technical Analysis and Price Targets</h2>
      <p>
        Charts, technical indicators, support and resistance levels, price targets, trend analysis, and other technical observations represent interpretations of market data.
      </p>
      <p>Technical analysis is subjective and does not predict future market performance with certainty.</p>
      <p>Price targets are estimates or analytical scenarios, not guarantees that a security will reach a particular price.</p>

      <h2>Third-Party Information</h2>
      <p>
        Sacco Financial may rely on information from financial data providers, company filings, earnings reports, news organizations, research services, market-data platforms, and other third-party sources believed to be reliable.
      </p>
      <p>Sacco Financial does not guarantee that third-party information is complete, current, or error-free.</p>

      <h2>Sponsored Content and Affiliates</h2>
      <p>
        Sacco Financial may receive compensation from sponsors, advertisers, affiliates, referral partners, or other commercial relationships.
      </p>
      <p>Sponsored content will be identified when appropriate.</p>
      <p>
        Some links may be affiliate or referral links. Sacco Financial may receive compensation if you use those links or take certain actions after following them.
      </p>
      <p>Compensation does not change the fundamental obligation to provide opinions that reflect Sacco Financial’s actual views.</p>

      <h2>No Guarantee of Results</h2>
      <p>
        Sacco Financial makes no representation or guarantee regarding investment performance, profitability, portfolio returns, trading results, or financial outcomes.
      </p>
      <p>
        Any examples of investment performance are provided for informational purposes and should not be interpreted as a promise that similar results can be achieved.
      </p>

      <p>
        Questions? <a href={`mailto:${brandLinks.email}`}>Contact Sacco Financial</a>.
      </p>
    </main>
  );
}
