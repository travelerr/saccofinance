import { BookOpen, CheckCircle2 } from "lucide-react";
import { ORDER_PAGE_URL } from "../config";
import { CtaWithSubtext, PageContainer } from "../ui";

const chapters = [
  {
    chapter: "Chapter 1",
    title: "Why Most People Stay Stuck Financially",
    bullets: [
      "How I went from blue-collar roots to building a real financial system",
      "What working in banking taught me about how financially successful people operate",
      "Why financial progress usually comes from structure — not income alone",
    ],
  },
  {
    chapter: "Chapter 2",
    title: "Build Your Financial Base",
    bullets: [
      "What a true financial foundation looks like and why most people skip it",
      "The difference between strategic debt and bad debt",
      "How to get clear on your full financial picture before making changes",
    ],
  },
  {
    chapter: "Chapter 3",
    title: "Take Control of Debt and Monthly Bills",
    bullets: [
      "How to organize your debt, payments, due dates, and interest rates in one place",
      "How to simplify your bills and reduce unnecessary monthly overhead",
      "Why treating your finances like a business changes everything",
    ],
  },
  {
    chapter: "Chapter 4",
    title: "Create Positive Monthly Cash Flow",
    bullets: [
      "Why you cannot build wealth if more money is going out than coming in",
      "How to find the gap between income and expenses",
      "How to create financial margin so you can finally start building",
    ],
  },
  {
    chapter: "Chapter 5",
    title: "Pay Yourself First and Build Your Cushion",
    bullets: [
      "How to use automatic saving and retirement contributions to build momentum",
      "Why your first savings milestones matter more than you think",
      "How to build toward a real emergency fund and financial stability",
    ],
  },
  {
    chapter: "Chapter 6",
    title: "Start Investing the Right Way",
    bullets: [
      "The difference between trading and long-term investing",
      "Why diversification, dollar-cost averaging, and compounding matter",
      "How to begin building wealth with a simple beginner-friendly investing approach",
    ],
  },
];

export function ReplitWhatsInsideSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <PageContainer>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--sf-teal)]/25 bg-[var(--sf-teal)]/10 px-3 py-1.5">
            <BookOpen className="h-4 w-4 text-[var(--sf-teal-ink)]" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sf-teal-ink)]">
              What&apos;s Inside
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold leading-tight text-[var(--sf-navy)] sm:text-4xl lg:text-5xl">
            Six Chapters. One Clear Path.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Each chapter builds on the last — so by the time you finish, you don&apos;t just have information, you have
            a working system.
          </p>
        </div>

        <div className="mb-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <div
              key={chapter.chapter}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--sf-teal-ink)]/70">
                {chapter.chapter}
              </div>
              <h3 className="font-display mb-4 text-lg font-bold leading-snug text-slate-900">{chapter.title}</h3>
              <ul className="space-y-2.5">
                {chapter.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--sf-teal-ink)]" aria-hidden />
                    <span className="text-sm leading-relaxed text-slate-600">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 rounded-2xl border border-[var(--sf-teal)]/20 bg-gradient-to-br from-[var(--sf-teal)]/[0.08] to-slate-50 p-6">
            <p className="text-base font-medium text-slate-800">
              Also included: a quick-start reference guide so you can go back and implement each step without rereading
              the whole book.
            </p>
          </div>
          <CtaWithSubtext
            href={ORDER_PAGE_URL}
            size="lg"
            align="center"
            subtext="Instant download — PDF format, works on any device"
          >
            Get The Blueprint — Start Today
          </CtaWithSubtext>
        </div>
      </PageContainer>
    </section>
  );
}
