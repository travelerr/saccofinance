export const OUTLET_LOGOS = {
  cnbc: "/images/cnbc-logo.png",
  tastylive: "/images/tastylive-logo.png",
} as const;

export type MediaCategory = "television" | "news" | "podcasts" | "speaking";

export type PressItem = {
  id: string;
  category: MediaCategory;
  outlet: string;
  title: string;
  subtitle?: string;
  date: string;
  dateTime: string;
  description: string;
  href?: string;
  cta: string;
  videoEmbedUrl?: string;
};

export const MEDIA_CATEGORIES: {
  id: MediaCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "television",
    label: "Television",
    description: "Live and recorded television appearances.",
  },
  {
    id: "news",
    label: "News Articles",
    description: "Print and digital news coverage.",
  },
  {
    id: "podcasts",
    label: "Podcasts",
    description: "Podcast interviews and guest appearances.",
  },
  {
    id: "speaking",
    label: "Speaking Engagements",
    description: "Conferences, panels, and live events.",
  },
];

export const pressItems: PressItem[] = [
  {
    id: "tastylive-june-2026",
    category: "television",
    outlet: "tastylive",
    title: "Wheel Strategy & SpaceX Options Discussion",
    subtitle: "June 2026",
    date: "June 2026",
    dateTime: "2026-06-20",
    description:
      "Justin Sacco joined tastylive for a live discussion covering the Wheel Strategy, options trading, and SpaceX.",
    cta: "Watch Interview",
    href: "https://www.youtube.com/watch?v=RF6hsn8AaXg",
    videoEmbedUrl: "https://www.youtube.com/embed/RF6hsn8AaXg",
  },
  {
    id: "cnbc-spacex-hold-or-sell",
    category: "news",
    outlet: "CNBC",
    title: "SpaceX IPO Leaves Retail Investors With Too Few Shares And A Tough Hold-Or-Sell Decision",
    date: "June 15, 2026",
    dateTime: "2026-06-15",
    description:
      "CNBC included follow-up commentary from Justin Sacco on his SpaceX position, long-term holding plan, allocation disappointment, and thoughts on the company's valuation.",
    href: "https://www.cnbc.com/2026/06/15/spacex-ipo-leaves-retail-investors-with-too-few-shares-and-a-tough-hold-or-sell-decision.html",
    cta: "Read on CNBC",
  },
  {
    id: "cnbc-spacex-live-updates",
    category: "news",
    outlet: "CNBC",
    title: "SpaceX IPO Live Updates",
    date: "June 12, 2026",
    dateTime: "2026-06-12",
    description:
      "Justin Sacco, founder of Sacco Financial, was included in CNBC's live coverage of the SpaceX IPO, discussing his retail investor allocation and experience participating in the offering.",
    href: "https://www.cnbc.com/2026/06/12/spacex-ipo-spcx-live-updates.html",
    cta: "Read on CNBC",
  },
];

export const INTERVIEW_TOPICS = [
  "Stock Market Commentary",
  "Retail Investor Sentiment",
  "AI & Technology Stocks",
  "IPO Analysis",
  "Options Strategies",
  "Long-Term Investing",
  "Personal Finance",
] as const;

export function getPressItemsByCategory(category: MediaCategory) {
  return pressItems
    .filter((item) => item.category === category)
    .sort((a, b) => b.dateTime.localeCompare(a.dateTime));
}

export function getPressItemsNewestFirst() {
  return [...pressItems].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
}
