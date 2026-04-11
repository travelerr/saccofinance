import { AlertCircle } from "lucide-react";
import { PageContainer } from "../ui";

const painPoints = [
  {
    icon: "💸",
    title: "Your paycheck disappears faster than it arrives",
    description:
      "You get paid, feel briefly okay, and then — before you know it — you're back to zero. Every. Single. Month.",
  },
  {
    icon: "😰",
    title: "You avoid checking your bank account",
    description: "You already know it's not good. So you just... don't look. And somehow that makes it worse.",
  },
  {
    icon: "🔄",
    title: "You're not overspending — you just have no system",
    description: "You're not irresponsible. You never had a clear structure for where money goes and what happens next.",
  },
  {
    icon: "📉",
    title: "Savings never seem to stick",
    description: "You try. You put a little away. Something comes up. You pull it back out. Repeat for years.",
  },
  {
    icon: "😓",
    title: "Unexpected expenses feel catastrophic",
    description:
      "A car repair. A medical bill. A broken appliance. Without a buffer, any one of these can derail your whole month.",
  },
  {
    icon: "🤐",
    title: "Talking about money feels shameful",
    description: "You feel like you should be further ahead by now. Like everyone else figured something out that you missed.",
  },
];

export function ReplitProblemSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <PageContainer>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--sf-coral)]/25 bg-[var(--sf-coral)]/10 px-3 py-1.5">
            <AlertCircle className="h-4 w-4 text-[var(--sf-coral-dark)]" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sf-coral-dark)]">
              Sound Familiar?
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold leading-tight text-[var(--sf-navy)] sm:text-4xl lg:text-5xl">
            You&apos;re Not Bad With Money. You Just Don&apos;t Have a System.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Most people who feel stuck financially aren&apos;t spending recklessly. They&apos;re simply operating
            without a structure — and without a structure, even good intentions don&apos;t stick.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{point.icon}</div>
              <h3 className="mb-2 text-base font-semibold leading-snug text-slate-900">{point.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-2xl">
          <div className="rounded-2xl border border-[var(--sf-teal)]/20 bg-gradient-to-br from-[var(--sf-teal)]/[0.08] to-slate-50 p-7 text-center">
            <p className="text-lg font-medium leading-relaxed text-slate-800">
              Here&apos;s the truth:{" "}
              <span className="font-semibold text-[var(--sf-teal-ink)]">
                the paycheck-to-paycheck cycle isn&apos;t a money problem — it&apos;s a system problem.
              </span>{" "}
              And system problems have system solutions.
            </p>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
