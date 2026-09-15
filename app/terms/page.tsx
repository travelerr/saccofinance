import {Eyebrow} from "@/components/brand/editorial";
import {brandLinks} from "@/lib/editorial";
import {pageMetadata} from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Terms of Use",
  "Terms governing access to Sacco Financial websites, content, accounts, subscriptions, and services.",
  "/terms",
);

export default function Page() {
  return (
    <main id="main-content" className="container legal-page">
      <Eyebrow>Sacco Financial / Legal</Eyebrow>
      <h1>Terms of Use</h1>
      <p className="legal-updated">Last updated: September 2026</p>

      <p>
        These Terms of Use govern your access to and use of Sacco Financial websites, content, accounts, subscriptions, and services.
      </p>
      <p>By accessing or using Sacco Financial, you agree to these Terms.</p>

      <h2>Educational and Informational Content</h2>
      <p>Sacco Financial provides financial education, market commentary, research, opinions, and related information.</p>
      <p>Sacco Financial does not provide individualized investment advice.</p>
      <p>
        Nothing provided through Sacco Financial creates an investment advisory, brokerage, fiduciary, attorney-client, accounting, or tax-advisory relationship.
      </p>
      <p>Investment decisions remain your responsibility.</p>

      <h2>Eligibility</h2>
      <p>You must be at least 18 years old to purchase or maintain a Sacco Premium subscription.</p>
      <p>By subscribing, you represent that you meet this requirement.</p>

      <h2>Accounts</h2>
      <p>You may be required to create an account to access certain services.</p>
      <p>You are responsible for maintaining the security of your account and login credentials.</p>
      <p>You may not share, sell, transfer, or provide your Premium account credentials to another person.</p>

      <h2>Sacco Premium</h2>
      <p>
        A Sacco Premium subscription provides access to Premium content and features made available during your active subscription.
      </p>
      <p>
        The exact content, format, frequency, features, and delivery methods may evolve over time as Sacco Financial develops the service.
      </p>
      <p>Purchasing Premium does not guarantee any investment result or access to individualized financial advice.</p>

      <h2>Subscription Billing</h2>
      <p>Premium subscriptions are billed using the billing frequency and price displayed when you subscribe.</p>
      <p>Payments may be processed through Stripe or another designated payment processor.</p>
      <p>By purchasing a recurring subscription, you authorize the applicable recurring charges until you cancel.</p>

      <h2>Cancellation</h2>
      <p>Subscriptions may be canceled at any time.</p>
      <p>
        Cancellation stops future renewal charges. Unless otherwise stated during checkout, cancellation does not terminate access immediately; you may continue accessing Premium through the end of your current paid billing period.
      </p>

      <h2>Refunds</h2>
      <p>Payments are generally non-refundable, but you can cancel at any time to prevent future charges.</p>

      <h2>Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Share Premium login credentials with others</li>
        <li>Republish Premium research</li>
        <li>Copy or distribute paid content</li>
        <li>Scrape or systematically extract Sacco Financial content</li>
        <li>Resell Sacco Financial research</li>
        <li>Circumvent access restrictions</li>
        <li>Use the service unlawfully</li>
        <li>Attempt to interfere with the operation or security of the website</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        Sacco Financial content—including original videos, articles, research, graphics, branding, written analysis, Premium publications, and other original materials—is protected by applicable intellectual-property laws.
      </p>
      <p>Your subscription provides a limited right to access content for your personal, non-commercial use.</p>
      <p>
        Purchasing a subscription does not transfer ownership of Sacco Financial content or grant permission to redistribute it.
      </p>
      <p>Reasonable sharing of publicly available Sacco Financial content is permitted through normal sharing features and links.</p>
      <p>Premium content may not be reproduced or distributed without permission.</p>

      <h2>Third-Party Services and Links</h2>
      <p>Sacco Financial may contain links to third-party websites, brokers, platforms, products, services, or resources.</p>
      <p>
        Sacco Financial does not control these third parties and is not responsible for their availability, accuracy, policies, security, products, or services.
      </p>
      <p>Some links may be affiliate or referral links.</p>

      <h2>Service Availability</h2>
      <p>Sacco Financial may modify, add, remove, suspend, or discontinue features or content.</p>
      <p>Continuous or uninterrupted availability of the website or Premium service is not guaranteed.</p>
      <p>
        Temporary interruptions may occur because of maintenance, technical problems, third-party services, or circumstances outside Sacco Financial’s control.
      </p>

      <h2>No Warranty</h2>
      <p>
        Sacco Financial content and services are provided on an “as is” and “as available” basis to the extent permitted by law.
      </p>
      <p>
        Sacco Financial does not guarantee the accuracy, completeness, availability, or investment results associated with any content or service.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, Sacco Financial will not be liable for investment losses, trading losses, lost profits, lost opportunities, or indirect, incidental, special, consequential, or similar damages arising from reliance on Sacco Financial content or use of its services.
      </p>
      <p>You remain responsible for evaluating investment risks and making your own financial decisions.</p>

      <h2>Termination</h2>
      <p>
        Sacco Financial may suspend or terminate access to an account for material violations of these Terms, including unauthorized sharing, redistribution of Premium content, fraud, abuse, or attempts to circumvent access controls.
      </p>

      <h2>Changes to These Terms</h2>
      <p>These Terms may be updated periodically as Sacco Financial’s products and services evolve.</p>
      <p>
        Continued use of Sacco Financial after updated Terms become effective constitutes acceptance of the revised Terms to the extent permitted by applicable law.
      </p>

      <p>
        Questions? <a href={`mailto:${brandLinks.email}`}>Contact Sacco Financial</a>.
      </p>
    </main>
  );
}
