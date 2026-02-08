import type React from "react";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

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
    "Justin Sacco shares 15 years of experience in tech & finance. Investing strategies, market insights, and financial education with no gatekeeping.",

  keywords: [
    "Justin Sacco",
    "Sacco Financial",
    "investing",
    "finance tips",
    "stock market",
    "personal finance",
  ],

  authors: [{ name: "Justin Sacco" }],

  openGraph: {
    title: "Justin Sacco – Sacco Financial",
    description:
      "Investing strategies, market insights, and financial education from Justin Sacco.",
    url: "https://justinsacco.com",
    siteName: "Sacco Financial",
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
    description: "Investing strategies & market education from Justin Sacco.",
    images: ["/headshot.jpeg"],
  },

  icons: {
    icon: "/favicon.ico",
    // If you have these files, uncomment:
    // apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}