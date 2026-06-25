import type { Metadata } from "next";
import { MediaPressPage } from "@/components/media/MediaPressPage";
import { absoluteUrl, defaultOgImagePath, getSiteUrl } from "@/lib/site";

const description =
  "Television appearances and press coverage featuring Justin Sacco on CNBC, tastylive, and financial media.";

export const metadata: Metadata = {
  title: "Media & Press",
  description,
  keywords: [
    "Sacco Financial media",
    "Justin Sacco CNBC",
    "Justin Sacco tastylive",
    "Justin Sacco press",
    "Sacco Financial press",
    "investing education media",
    "retail investor commentary",
  ],
  alternates: {
    canonical: "/media",
  },
  openGraph: {
    title: "Media & Press | Sacco Financial",
    description,
    url: absoluteUrl("/media"),
    siteName: "Sacco Financial",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: defaultOgImagePath,
        alt: "Media & Press | Sacco Financial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Media & Press | Sacco Financial",
    description,
    images: [defaultOgImagePath],
  },
};

export default function MediaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/media#webpage"),
        url: absoluteUrl("/media"),
        name: "Media & Press | Sacco Financial",
        description,
        isPartOf: {
          "@type": "WebSite",
          name: "Sacco Financial",
          url: getSiteUrl(),
        },
        about: {
          "@type": "Person",
          name: "Justin Sacco",
          jobTitle: "Founder",
          worksFor: {
            "@type": "Organization",
            name: "Sacco Financial",
            url: getSiteUrl(),
          },
        },
      },
      {
        "@type": "VideoObject",
        name: "Wheel Strategy & SpaceX Options Discussion",
        description:
          "Justin Sacco joined tastylive for a live discussion covering the Wheel Strategy, options trading, and SpaceX.",
        uploadDate: "2026-06-24",
        embedUrl: "https://www.youtube.com/embed/RF6hsn8AaXg",
        publisher: {
          "@type": "Organization",
          name: "tastylive",
        },
        mentions: {
          "@type": "Person",
          name: "Justin Sacco",
        },
      },
      ...[
        {
          headline:
            "SpaceX IPO Leaves Retail Investors With Too Few Shares And A Tough Hold-Or-Sell Decision",
          datePublished: "2026-06-15",
          url: "https://www.cnbc.com/2026/06/15/spacex-ipo-leaves-retail-investors-with-too-few-shares-and-a-tough-hold-or-sell-decision.html",
        },
        {
          headline: "SpaceX IPO Live Updates",
          datePublished: "2026-06-12",
          url: "https://www.cnbc.com/2026/06/12/spacex-ipo-spcx-live-updates.html",
        },
      ].map((article) => ({
        "@type": "NewsArticle",
        headline: article.headline,
        datePublished: article.datePublished,
        url: article.url,
        publisher: {
          "@type": "Organization",
          name: "CNBC",
        },
        mentions: {
          "@type": "Person",
          name: "Justin Sacco",
        },
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MediaPressPage />
    </>
  );
}
