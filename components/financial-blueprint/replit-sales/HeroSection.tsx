import { ShieldCheck, Star } from "lucide-react";
import { ORDER_PAGE_URL } from "../config";
import { CtaWithSubtext, PageContainer } from "../ui";
import { BlueprintCoverImage } from "./BlueprintCoverImage";

export function ReplitHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#071525] via-[var(--sf-navy)] to-[#0d3a42] pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--sf-teal)_0%,transparent_55%)] opacity-[0.12]" />
      <PageContainer className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--sf-teal)]" />
              <span className="text-xs font-medium uppercase tracking-wide text-white/70">
                New Release — PDF E-Book
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Stop Living Paycheck to <span className="text-[var(--sf-teal)]">Paycheck.</span> Build a Real Financial
              Base.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-white/70 sm:text-xl">
              The Financial Base Blueprint is a practical, step-by-step system that shows you exactly how to get
              organized, stop the financial bleeding, and start building real stability — without complicated
              spreadsheets or finance-bro jargon.
            </p>

            <div className="mt-8">
              <CtaWithSubtext
                href={ORDER_PAGE_URL}
                size="lg"
                ctaVariant="accent"
                subtext="Instant PDF download — read it today"
                subtextClassName="text-center text-white/70 sm:text-left"
              >
                Get The Blueprint
              </CtaWithSubtext>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--sf-teal)]" aria-hidden />
                <span className="text-sm text-white/55">No fluff, no filler — just a clear system</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5" aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-white/55">Built for real people, real budgets</span>
              </div>
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <BlueprintCoverImage priority />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
