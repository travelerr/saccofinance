import type { Metadata } from "next";
import { FinancialBlueprintLanding } from "@/components/financial-blueprint/FinancialBlueprintLanding";
import { COVER_IMAGE_PATH, PRODUCT_NAME } from "@/components/financial-blueprint/config";
import { absoluteUrl, defaultOgImagePath, getSiteUrl } from "@/lib/site";

const blueprintOgImagePath = COVER_IMAGE_PATH ?? defaultOgImagePath;

const description =
  "Break out of the paycheck-to-paycheck cycle with a step-by-step PDF system: organize money, reduce stress, build a solid base, and grow wealth long-term. Founding price $29. Instant download.";

/** Uses root layout template: becomes “{PRODUCT_NAME} | Sacco Financial” */
const title = PRODUCT_NAME;

const socialTitle = `${PRODUCT_NAME} — Build Real Financial Control`;

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
    url: absoluteUrl("/financial-blueprint"),
    siteName: "Sacco Financial",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: blueprintOgImagePath,
        alt: `${PRODUCT_NAME} — Sacco Financial`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description,
    images: [
      {
        url: blueprintOgImagePath,
        alt: `${PRODUCT_NAME} — Sacco Financial`,
      },
    ],
  },
};

export default function FinancialBlueprintPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${PRODUCT_NAME} | Break Out of the Paycheck-to-Paycheck Cycle — Sacco Financial`,
    description,
    url: absoluteUrl("/financial-blueprint"),
    isPartOf: {
      "@type": "WebSite",
      name: "Sacco Financial",
      url: getSiteUrl(),
    },
    about: {
      "@type": "Product",
      name: PRODUCT_NAME,
      description:
        "Digital PDF: a step-by-step system to organize money, reduce financial stress, build a solid base, and grow wealth with structure and discipline—not hype.",
      ...(COVER_IMAGE_PATH ? { image: absoluteUrl(COVER_IMAGE_PATH) } : {}),
      brand: {
        "@type": "Brand",
        name: "Sacco Financial",
      },
      offers: {
        "@type": "Offer",
        price: "29",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
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
