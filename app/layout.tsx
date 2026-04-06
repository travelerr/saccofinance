import type React from "react";
import "./globals.css";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://justinsacco.com"),

  title: {
    default: "Justin Sacco – Sacco Financial",
    template: "%s | Sacco Financial",
  },

  description:
    "Sacco Financial by Justin Sacco shares beginner-friendly investing education, stock market insights, personal finance tips, and long-term wealth-building strategies.",

  keywords: [
    "Justin Sacco",
    "Sacco Financial",
    "sacco financial",
    "Sacco Financial investing",
    "Sacco Financial stock market",
    "Justin Sacco investing",
    "investing",
    "finance tips",
    "stock market",
    "stock market education",
    "beginner investing",
    "trading education",
    "personal finance education",
    "wealth building",
    "passive income",
    "options trading education",
    "personal finance",
  ],

  authors: [{ name: "Justin Sacco" }],
  creator: "Justin Sacco",
  publisher: "Sacco Financial",
  category: "Finance",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Justin Sacco – Sacco Financial",
    description:
      "Sacco Financial delivers stock market education, investing strategies, and personal finance content from Justin Sacco.",
    url: "https://justinsacco.com",
    siteName: "Sacco Financial",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/headshot.jpeg",
        width: 1200,
        height: 630,
        alt: "Justin Sacco – Sacco Financial",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Justin Sacco – Sacco Financial",
    description: "Stock market education, investing strategies, and personal finance content from Sacco Financial.",
    images: ["/headshot.jpeg"],
  },

  icons: {
    icon: [
      {
        url: "/images/logo.png",
        type: "image/png",
        sizes: "500x500",
      },
    ],
    apple: [
      {
        url: "/images/logo.png",
        sizes: "500x500",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
