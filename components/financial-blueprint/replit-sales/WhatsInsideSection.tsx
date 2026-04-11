import { BookOpen, CheckCircle2 } from "lucide-react";
import { ORDER_PAGE_URL } from "../config";
import { CtaWithSubtext, PageContainer } from "../ui";

const chapters = [
  {
    chapter: "Chapter 1",
    title: "The Financial Reality Check",
    bullets: [
      "How to take an honest look at your current financial picture without panic",
      "The exact numbers you need to know before you can move forward",
      "Why most people never get started — and how to get past that",
    ],
  },
  {
    chapter: "Chapter 2",
    title: "Building Your Income Framework",
    bullets: [
      "How to structure your income so you always know what's available and what's already spoken for",
      "The spending categories that actually matter vs. the ones that distract you",
      "Setting up a monthly plan you'll actually use",
    ],
  },
  {
    chapter: "Chapter 3",
    title: "Stopping the Financial Bleeding",
    bullets: [
      "Where most people leak money without realizing it",
      "Simple cuts that save real money — without drastic lifestyle changes",
      "How to handle irregular expenses so they stop derailing your month",
    ],
  },
  {
    chapter: "Chapter 4",
    title: "Building Your First Financial Buffer",
    bullets: [
      "Why you need a buffer before anything else — and exactly how to build one",
      "The minimum safe amount to target first",
      "How to save consistently even on a tight income",
    ],
  },
  {
    chapter: "Chapter 5",
    title: "Creating Your Financial Stack",
    bullets: [
      "How to prioritize your money goals in the right order",
      "The sequence that gets you from chaos to stability as fast as possible",
      "What to do with extra money once the basics are covered",
    ],
  },
  {
    chapter: "Chapter 6",
    title: "Building Habits That Stick",
    bullets: [
      "Simple weekly and monthly check-ins that keep you on track",
      "How to recover when life throws something unexpected at you",
      "The mindset shift that makes financial discipline feel sustainable — not punishing",
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
