import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { ORDER_PAGE_URL } from "./config";

/** ~1100px max width, centered */
export function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
  );
}

export function SectionShell({
  children,
  id,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <PageContainer className={innerClassName}>{children}</PageContainer>
    </section>
  );
}

export function PrimaryCta({
  href = ORDER_PAGE_URL,
  children,
  className = "",
  size = "default",
  variant = "navy",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  size?: "default" | "lg";
  /** `accent` = high-contrast teal on dark hero bands; `navy` = default pill on light sections */
  variant?: "navy" | "accent";
}) {
  const sizeClass =
    size === "lg" ? "min-h-14 px-8 py-3.5 text-base" : "min-h-12 px-6 py-3 text-sm sm:text-base";
  const variantClass =
    variant === "accent"
      ? "bg-gradient-to-b from-[var(--sf-teal)] to-[var(--sf-teal-dark)] font-bold text-[var(--sf-navy)] shadow-[0_8px_32px_rgba(76,225,230,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] ring-2 ring-white/25 transition hover:brightness-105 hover:shadow-[0_12px_40px_rgba(76,225,230,0.55),inset_0_1px_0_rgba(255,255,255,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sf-teal)] active:brightness-95"
      : "bg-[var(--sf-navy)] font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#0c2438] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sf-navy)]";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full ${variantClass} sm:w-auto ${sizeClass} ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
    </a>
  );
}

/** Primary CTA with optional subtext (Replit-style), aligned for hero vs content sections. */
export function CtaWithSubtext({
  href = ORDER_PAGE_URL,
  children,
  subtext,
  size = "default",
  align = "start",
  subtextClassName = "text-slate-500",
  ctaVariant = "navy",
}: {
  href?: string;
  children: ReactNode;
  subtext?: string;
  size?: "default" | "lg";
  align?: "start" | "center";
  subtextClassName?: string;
  ctaVariant?: "navy" | "accent";
}) {
  const wrap =
    align === "center"
      ? "flex flex-col items-center gap-1.5 text-center"
      : "flex flex-col items-center gap-1.5 sm:items-start sm:text-left";
  return (
    <div className={wrap}>
      <PrimaryCta
        href={href}
        size={size}
        variant={ctaVariant}
        className={align === "center" ? "mx-auto w-full max-w-md sm:max-w-none" : ""}
      >
        {children}
      </PrimaryCta>
      {subtext ? (
        <p className={`max-w-md text-xs sm:text-sm ${subtextClassName}`}>{subtext}</p>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
