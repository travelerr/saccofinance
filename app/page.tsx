import type { Metadata } from "next";
import ReplitHomepage from "@/components/replit-homepage";

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
    url: "https://saccofinancial.com",
    images: ["/headshot.jpeg"],
  },
  twitter: {
    title: "Sacco Financial | Stock Market Education & Investing Resources",
    description:
      "Beginner-friendly investing education, stock market insights, and personal finance resources from Justin Sacco.",
    images: ["/headshot.jpeg"],
  },
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://saccofinancial.com/#organization",
        name: "Sacco Financial",
        url: "https://saccofinancial.com",
        logo: "https://saccofinancial.com/images/logo.png",
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
        "@id": "https://saccofinancial.com/#person",
        name: "Justin Sacco",
        url: "https://saccofinancial.com",
        image: "https://saccofinancial.com/images/profile.jpg",
        worksFor: {
          "@id": "https://saccofinancial.com/#organization",
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
        "@id": "https://saccofinancial.com/#website",
        url: "https://saccofinancial.com",
        name: "Sacco Financial",
        publisher: {
          "@id": "https://saccofinancial.com/#organization",
        },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": "https://saccofinancial.com/#webpage",
        url: "https://saccofinancial.com",
        name: "Sacco Financial | Stock Market Education & Investing Resources",
        description:
          "Explore Sacco Financial for beginner investing education, stock market insights, personal finance guidance, and resources from Justin Sacco.",
        isPartOf: {
          "@id": "https://saccofinancial.com/#website",
        },
        about: {
          "@id": "https://saccofinancial.com/#organization",
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
