import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { ORDER_PAGE_URL } from "./config";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-3xl px-5 sm:px-6 lg:max-w-5xl lg:px-8 ${className}`}>{children}</div>;
}

export function Section({
  id,
  children,
  className = "",
  innerClassName = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      <Container className={innerClassName}>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{children}</p>
  );
}

export function PrimaryCta({
  href = ORDER_PAGE_URL,
  children,
  className = "",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--sf-navy)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#0c2438] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sf-navy)] ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
    </a>
  );
}
