import type { Metadata } from "next";
import ReplitHomepage from "@/components/replit-homepage";
import { absoluteUrl, defaultOgImagePath, getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sacco Financial | Markets, Media & Investment Research",
  description:
    "Creator-led financial media and investment research from Justin Sacco. Explore stocks, market narratives, AI, technology, and deeper Premium research.",
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
    title: "Sacco Financial | Markets, Media & Investment Research",
    description:
      "Market stories, individual stocks, and investment research from Justin Sacco.",
    url: getSiteUrl(),
    images: [defaultOgImagePath],
  },
  twitter: {
    title: "Sacco Financial | Markets, Media & Investment Research",
    description:
      "Market stories, individual stocks, and investment research from Justin Sacco.",
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
          "https://www.tiktok.com/@saccofinancial",
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
        name: "Sacco Financial | Markets, Media & Investment Research",
        description:
          "Creator-led financial media and investment research from Justin Sacco. Explore stocks, market narratives, AI, technology, and deeper Premium research.",
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
