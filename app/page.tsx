import type { Metadata } from "next";
import ReplitHomepage from "@/components/replit-homepage";
import { absoluteUrl, defaultOgImagePath, getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sacco Financial | Stock Market Education & Investing Resources",
  description:
    "Explore Sacco Financial for beginner investing education, stock market insights, personal finance guidance, and resources from Justin Sacco.",
  keywords: [
    "Sacco Financial",
    "sacco financial",
    "Justin Sacco",
    "stock market education",
    "beginner investing",
    "personal finance",
    "wealth building",
    "investing resources",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sacco Financial | Stock Market Education & Investing Resources",
    description:
      "Beginner-friendly investing education, stock market insights, and personal finance resources from Justin Sacco.",
    url: getSiteUrl(),
    images: [defaultOgImagePath],
  },
  twitter: {
    title: "Sacco Financial | Stock Market Education & Investing Resources",
    description:
      "Beginner-friendly investing education, stock market insights, and personal finance resources from Justin Sacco.",
    images: [defaultOgImagePath],
  },
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: "Sacco Financial",
        url: getSiteUrl(),
        logo: absoluteUrl("/images/logo.png"),
        sameAs: [
          "https://www.instagram.com/saccofinancial",
          "https://www.threads.net/@saccofinancial",
          "https://www.tiktok.com/@saccofinancial",
          "https://x.com/saccofinancial",
          "https://www.youtube.com/@saccofinancial",
          "https://www.facebook.com/people/Sacco-Financial/61573912254568",
        ],
      },
      {
        "@type": "Person",
        "@id": absoluteUrl("/#person"),
        name: "Justin Sacco",
        url: getSiteUrl(),
        image: absoluteUrl(defaultOgImagePath),
        worksFor: {
          "@id": absoluteUrl("/#organization"),
        },
        sameAs: [
          "https://www.instagram.com/saccofinancial",
          "https://www.tiktok.com/@saccofinancial",
          "https://x.com/saccofinancial",
          "https://www.youtube.com/@saccofinancial",
        ],
        knowsAbout: [
          "Investing",
          "Stock market education",
          "Personal finance",
          "Trading education",
          "Wealth building",
        ],
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: getSiteUrl(),
        name: "Sacco Financial",
        publisher: {
          "@id": absoluteUrl("/#organization"),
        },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/#webpage"),
        url: getSiteUrl(),
        name: "Sacco Financial | Stock Market Education & Investing Resources",
        description:
          "Explore Sacco Financial for beginner investing education, stock market insights, personal finance guidance, and resources from Justin Sacco.",
        isPartOf: {
          "@id": absoluteUrl("/#website"),
        },
        about: {
          "@id": absoluteUrl("/#organization"),
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ReplitHomepage />
    </>
  );
}
