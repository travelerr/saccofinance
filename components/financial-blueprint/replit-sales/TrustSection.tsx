import { FileText, Landmark, TrendingUp, Users } from "lucide-react";
import { PageContainer } from "../ui";

const credentialPoints = [
  {
    icon: Landmark,
    title: "Banking & Financial Services Background",
    description:
      "Years of direct experience in the banking industry — working inside the systems most people only interact with from the outside.",
  },
  {
    icon: TrendingUp,
    title: "Real-World Financial Literacy",
    description:
      "This isn't academic theory. The Blueprint is built from practical knowledge of how money actually moves, where people actually get stuck, and what actually works.",
  },
  {
    icon: FileText,
    title: "Built for the People I've Seen Struggle",
    description:
      "Working in finance means watching smart, hardworking people hit the same walls over and over — not because they're careless, but because nobody gave them a system. That's why this exists.",
  },
  {
    icon: Users,
    title: "No Guru. No Hype. Just a System.",
    description:
      "I'm not here to sell you a lifestyle or a personality. I'm here to give you a framework that works — and then get out of your way.",
  },
];

export function ReplitTrustSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <PageContainer>
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--sf-teal)]/25 bg-[var(--sf-teal)]/10 px-3 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sf-teal-ink)]">
                Why Listen to Me
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight text-[var(--sf-navy)] sm:text-4xl lg:text-5xl">
              Finance Knowledge. No Pedestal.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
            The Financial Base Blueprint was created by Justin Sacco, the founder of Sacco Financial — a brand built on the belief that financial knowledge should be practical, accessible, and grounded in real-world experience.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Justin brings direct experience from the banking and financial services industry — working with real accounts, real numbers, and real people navigating real financial challenges.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              The Blueprint isn&apos;t written by someone who figured out money theory from a book. It&apos;s written by
              someone who has watched, from the inside, what separates people who build financial stability from people
              who stay stuck — and decided to put that knowledge into a system anyone could use.
            </p>
          </div>

          <div className="space-y-5">
            {credentialPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-shadow hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--sf-teal)]/10">
                    <Icon className="h-5 w-5 text-[var(--sf-teal-ink)]" aria-hidden />
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-base font-semibold text-slate-900">{point.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
