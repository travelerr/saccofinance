import {localDevelopment} from '@/lib/local-development';
import type React from "react";
import "./globals.css";
import "@/components/brand/brand.css";
import ThemeProvider from '@/components/theme-provider';
import {themeBootstrap} from '@/lib/theme';
import '@/components/theme.css';
import PremiumProductFrame from '@/components/premium/product-frame';
import SiteHeader from "@/components/site-header";
import {SiteFooter} from "@/components/brand/editorial";
import {Barlow_Condensed, Manrope} from "next/font/google";
const display=Barlow_Condensed({subsets:["latin"],weight:["600","700","800"],display:"swap",variable:"--font-editorial"});
const body=Manrope({subsets:["latin"],display:"swap",variable:"--font-reading"});
import type { Metadata, Viewport } from "next";
import { defaultOgImagePath, getSiteUrl } from "@/lib/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),

  title: {
    default: "Justin Sacco – Sacco Financial",
    template: "%s | Sacco Financial",
  },

  description:
    "Creator-led financial media and investment research from Justin Sacco. Individual stocks, market narratives, AI, technology, and the ideas worth investigating.",

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
    url: getSiteUrl(),
    siteName: "Sacco Financial",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: defaultOgImagePath,
        alt: "Justin Sacco – Sacco Financial",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Justin Sacco – Sacco Financial",
    description: "Stock market education, investing strategies, and personal finance content from Sacco Financial.",
    images: [defaultOgImagePath],
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
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:themeBootstrap}}/></head>
      <body className={`${display.variable} ${body.variable} brand`}><ThemeProvider>{localDevelopment()&&<div style={{background:"#ffd479",color:"#171717",padding:"8px 16px",textAlign:"center",fontSize:14,fontWeight:700}}>LOCAL TEST SITE · Fake accounts · No real payments or research emails</div>}<PremiumProductFrame publicHeader={<SiteHeader/>} publicFooter={<SiteFooter/>}>{children}</PremiumProductFrame></ThemeProvider></body>
    </html>
  );
}
