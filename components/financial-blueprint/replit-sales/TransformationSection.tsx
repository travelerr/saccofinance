import { PageContainer } from "../ui";

const transformations = [
  {
    before: "Avoiding your bank app because you already know it's not good",
    after: "Checking your accounts weekly because you know exactly what's there",
  },
  {
    before: "Dreading the end of the month because you're not sure how you'll make it",
    after: "Finishing the month with something left — because you planned for it",
  },
  {
    before: "Saving a little, then pulling it back out when something comes up",
    after: "Having a buffer that actually absorbs life's surprises",
  },
  {
    before: "Feeling behind, ashamed, and stuck with no clear path forward",
    after: "Knowing your next step — and actually feeling confident about it",
  },
  {
    before: "Living reactively — dealing with money problems as they happen",
    after: "Living proactively — making decisions before the month begins",
  },
];

export function ReplitTransformationSection() {
  return (
    <section className="bg-gradient-to-br from-[var(--sf-teal)]/[0.06] via-white to-slate-50 py-20 lg:py-28">
      <PageContainer>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold leading-tight text-[var(--sf-navy)] sm:text-4xl lg:text-5xl">
            What Changes When You Have a System
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            The difference isn&apos;t dramatic — it&apos;s just real. Here&apos;s what people who implement this system
            actually experience.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-4">
          {transformations.map((t) => (
            <div
              key={t.before}
              className="grid overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm sm:grid-cols-2"
            >
              <div className="border-b border-slate-200/90 bg-white p-5 sm:border-b-0 sm:border-r sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50">
                    <span className="text-xs font-bold text-red-400">✗</span>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">Before</p>
                    <p className="text-sm leading-relaxed text-slate-800">{t.before}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50/80 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--sf-teal)]/25 bg-[var(--sf-teal)]/10">
                    <span className="text-xs font-bold text-[var(--sf-teal-ink)]">✓</span>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--sf-teal-ink)]">
                      After
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-slate-900">{t.after}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-2xl text-center">
          <p className="text-lg font-medium text-slate-900">None of this requires a big income. It requires a clear system.</p>
          <p className="mt-2 text-base text-slate-600">The Financial Base Blueprint gives you exactly that.</p>
        </div>
      </PageContainer>
    </section>
  );
}
