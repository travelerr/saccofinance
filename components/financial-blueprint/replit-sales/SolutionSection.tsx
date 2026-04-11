import { CheckCircle2 } from "lucide-react";
import { ORDER_PAGE_URL } from "../config";
import { CtaWithSubtext, PageContainer } from "../ui";

const pillars = [
  {
    number: "01",
    title: "Clarity",
    description: "You'll know exactly where every dollar goes before the month begins — no guessing, no surprises.",
  },
  {
    number: "02",
    title: "Structure",
    description: "A clear framework for your income, expenses, savings, and goals — all in one logical system.",
  },
  {
    number: "03",
    title: "Momentum",
    description: "Small, consistent wins that build on each other — so you actually stay on track instead of falling off.",
  },
  {
    number: "04",
    title: "Foundation",
    description: "A real financial base — not just surviving month to month, but building something that lasts.",
  },
];

export function ReplitSolutionSection() {
  return (
    <section className="bg-gradient-to-br from-[var(--sf-teal)]/[0.07] via-slate-50 to-white py-20 lg:py-28">
      <PageContainer>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--sf-teal)]/25 bg-[var(--sf-teal)]/10 px-3 py-1.5">
              <CheckCircle2 className="h-4 w-4 text-[var(--sf-teal-ink)]" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sf-teal-ink)]">
                The Solution
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight text-[var(--sf-navy)] sm:text-4xl lg:text-5xl">
              Introducing <span className="text-[var(--sf-teal-ink)]">The Financial Base Blueprint</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              This isn&apos;t a generic budgeting guide. The Financial Base Blueprint is a step-by-step system built
              specifically for people who want to stop the financial chaos, get grounded, and build a foundation they
              can actually grow from.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              It&apos;s practical. It&apos;s direct. It meets you where you are — not where you wish you were. No
              complex spreadsheets. No impossible overnight transformations. Just a clear, honest system that works for
              normal people with normal incomes.
            </p>
            <div className="mt-8">
              <CtaWithSubtext
                href={ORDER_PAGE_URL}
                subtext="Instant PDF access — read it at your own pace"
              >
                Start Building Your Financial Base
              </CtaWithSubtext>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-2 text-xs font-bold tracking-widest text-[var(--sf-teal-ink)]/60">
                  {pillar.number}
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
