import {Eyebrow} from "@/components/brand/editorial";
import {brandLinks} from "@/lib/editorial";
import {pageMetadata} from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Privacy Policy",
  "How Sacco Financial collects, uses, and protects information across its websites, newsletters, and Sacco Premium.",
  "/privacy",
);

export default function Page() {
  return (
    <main id="main-content" className="container legal-page">
      <Eyebrow>Sacco Financial / Legal</Eyebrow>
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: September 2026</p>

      <p>
        Sacco Financial respects your privacy. This Privacy Policy explains generally how information may be collected, used, and protected when you use Sacco Financial websites, products, services, newsletters, and Sacco Premium.
      </p>

      <h2>Information We Collect</h2>
      <p>Depending on how you use Sacco Financial, we may collect information you voluntarily provide, including your:</p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Account information</li>
        <li>Subscription information</li>
        <li>Communications with Sacco Financial</li>
      </ul>
      <p>
        We may also automatically receive limited technical information when you interact with the website, such as browser type, device information, IP address, pages visited, referring pages, and similar usage information.
      </p>

      <h2>Accounts</h2>
      <p>Certain Sacco Financial services, including Sacco Premium, may require an account.</p>
      <p>
        You are responsible for maintaining the confidentiality of your login credentials and for activity occurring through your account.
      </p>

      <h2>Payments</h2>
      <p>Payments for paid Sacco Financial products or subscriptions may be processed by third-party payment providers such as Stripe.</p>
      <p>
        Sacco Financial does not need to directly store your complete payment-card information when transactions are processed by these providers.
      </p>
      <p>Your payment information may therefore also be subject to the payment provider’s privacy practices and terms.</p>

      <h2>How Information Is Used</h2>
      <p>Information may be used to:</p>
      <ul>
        <li>Provide and maintain Sacco Financial services</li>
        <li>Create and manage user accounts</li>
        <li>Process subscriptions and payments</li>
        <li>Deliver Premium content</li>
        <li>Send requested emails and communications</li>
        <li>Provide customer support</li>
        <li>Improve the website and services</li>
        <li>Prevent fraud or misuse</li>
        <li>Comply with applicable legal obligations</li>
      </ul>

      <h2>Email Communications</h2>
      <p>
        If you provide your email address, Sacco Financial may send you content, product information, service announcements, or marketing communications where permitted.
      </p>
      <p>Marketing emails will include a method for unsubscribing.</p>
      <p>
        Certain transactional or account-related communications may still be necessary while you maintain an account or subscription.
      </p>

      <h2>Cookies and Similar Technologies</h2>
      <p>
        Sacco Financial may use cookies and similar technologies necessary to operate the website, maintain sessions, remember preferences, understand website usage, and support functionality.
      </p>
      <p>
        Additional analytics or advertising technologies may be introduced in the future. This Privacy Policy may be updated as Sacco Financial’s technology and services evolve.
      </p>

      <h2>Service Providers</h2>
      <p>
        Sacco Financial may use third-party providers to operate portions of its services, including payment processing, website hosting, email delivery, account management, security, and other infrastructure.
      </p>
      <p>These providers may process information as necessary to perform services on behalf of Sacco Financial.</p>

      <h2>Sale of Personal Information</h2>
      <p>Sacco Financial does not sell personal information in the ordinary meaning of selling customer information for money.</p>

      <h2>Data Security</h2>
      <p>Reasonable administrative and technical measures are used to protect information.</p>
      <p>However, no website, database, or electronic transmission can be guaranteed to be completely secure.</p>

      <h2>Data Retention</h2>
      <p>
        Information may be retained for as long as reasonably necessary to provide services, maintain legitimate business records, resolve disputes, prevent fraud, and comply with applicable obligations.
      </p>

      <h2>Your Choices</h2>
      <p>
        Depending on your location and applicable law, you may have rights regarding your personal information, including requesting access, correction, or deletion of certain information.
      </p>
      <p>You may also unsubscribe from marketing communications using the unsubscribe link provided in those communications.</p>

      <h2>Third-Party Links</h2>
      <p>Sacco Financial may link to websites or services operated by third parties.</p>
      <p>Sacco Financial is not responsible for the privacy practices, security, or content of third-party websites.</p>

      <h2>Children</h2>
      <p>Sacco Premium is intended for users who are at least 18 years old.</p>
      <p>Sacco Financial does not knowingly solicit personal information from children through its Premium services.</p>

      <h2>Changes to This Policy</h2>
      <p>
        This Privacy Policy may be updated periodically to reflect changes to Sacco Financial’s services, technology, or legal requirements.
      </p>
      <p>The current version will be posted on this website with an updated revision date.</p>

      <p>
        Questions? <a href={`mailto:${brandLinks.email}`}>Contact Sacco Financial</a>.
      </p>
    </main>
  );
}
