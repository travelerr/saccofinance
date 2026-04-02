import type { ReactNode } from "react";
import { DM_Sans, Montserrat } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-fb",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-display-fb",
});

export default function FinancialBlueprintLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`financial-blueprint-root ${dmSans.variable} ${montserrat.variable} ${dmSans.className} min-h-screen bg-[#fafbfc] text-slate-900 antialiased selection:bg-[var(--sf-teal)]/25 selection:text-[var(--sf-navy)]`}
    >
      {children}
    </div>
  );
}
