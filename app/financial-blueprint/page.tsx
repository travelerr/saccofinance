import type { Metadata } from "next";
import { FinancialBlueprintLanding } from "@/components/financial-blueprint/FinancialBlueprintLanding";
import { PRODUCT_NAME } from "@/components/financial-blueprint/config";

const description =
  "A step-by-step PDF system to organize money, build cash flow and a real financial base, and grow wealth long-term. Founding price $29. Instant download.";

/** Uses root layout template: becomes “{PRODUCT_NAME} | Sacco Financial” */
const title = PRODUCT_NAME;

const socialTitle = `${PRODUCT_NAME} — Break the Paycheck-to-Paycheck Cycle`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Financial Base Blueprint",
    "Justin Sacco",
    "Sacco Financial",
    "personal finance PDF",
    "paycheck to paycheck",
    "financial system",
    "beginner investing",
    "budgeting",
    "emergency fund",
  ],
  alternates: {
    canonical: "/financial-blueprint",
  },
  openGraph: {
    title: socialTitle,
    description,
    url: "https://justinsacco.com/financial-blueprint",
    siteName: "Sacco Financial",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/headshot.jpeg",
        width: 1200,
        height: 630,
        alt: `${PRODUCT_NAME} — Sacco Financial`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description,
    images: ["/headshot.jpeg"],
  },
};

export default function FinancialBlueprintPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${PRODUCT_NAME} | Break the Paycheck-to-Paycheck Cycle — Sacco Financial`,
    description,
    url: "https://justinsacco.com/financial-blueprint",
    isPartOf: {
      "@type": "WebSite",
      name: "Sacco Financial",
      url: "https://justinsacco.com",
    },
    about: {
      "@type": "Product",
      name: PRODUCT_NAME,
      description:
        "Digital PDF ebook: a structured financial system for cash flow, debt organization, foundation building, and long-term wealth habits.",
      brand: {
        "@type": "Brand",
        name: "Sacco Financial",
      },
      offers: {
        "@type": "Offer",
        price: "29",
        priceCurrency: "USD",
        availability: "https://schema.org/OnlineOnly",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <FinancialBlueprintLanding />
    </>
  );
}
