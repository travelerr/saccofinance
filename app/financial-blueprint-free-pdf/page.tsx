import type { Metadata } from "next";
import { FreePdfThankYouPage } from "@/components/financial-blueprint-free-pdf/FreePdfThankYouPage";
import { absoluteUrl, defaultOgImagePath, getSiteUrl } from "@/lib/site";

const title = "Your Free Financial Blueprint PDF Is On The Way";

const description =
  "Thanks for downloading the free Sacco Financial PDF. Learn how The Financial Base Blueprint helps you build a stronger financial foundation.";

const path = "/financial-blueprint-free-pdf";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: path,
  },
  openGraph: {
    title: `${title} | Sacco Financial`,
    description,
    url: absoluteUrl(path),
    siteName: "Sacco Financial",
    locale: "en_US",
    type: "website",
    images: [{ url: defaultOgImagePath, alt: "Justin Sacco — Sacco Financial" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Sacco Financial`,
    description,
    images: [defaultOgImagePath],
  },
};

export default function FinancialBlueprintFreePdfPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${title} | Sacco Financial`,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: "Sacco Financial",
      url: getSiteUrl(),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <FreePdfThankYouPage />
    </>
  );
}
