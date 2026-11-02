import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/icons/premium/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/icons/premium/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/premium/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function PremiumLayout({ children }: { children: ReactNode }) {
  return children;
}
