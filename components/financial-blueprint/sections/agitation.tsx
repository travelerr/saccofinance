import { SectionShell } from "../ui";

export function AgitationSection() {
  return (
    <SectionShell className="border-y border-slate-200/80 bg-white">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-3xl md:text-4xl">
        This Is Why You Stay Stuck
      </h2>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
        <p>
          You make money… but it disappears.
          <br />
          You try to budget… but it doesn’t last.
          <br />
          You want to invest… but don’t feel ready.
        </p>
        <p className="font-medium text-slate-800">So what happens?</p>
        <p>You stay in the same cycle:</p>
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-display text-lg font-bold text-[var(--sf-navy)]">
          Earn → Spend → Reset → Repeat
        </p>
        <p className="pt-2 text-slate-600">
          And over time, that cycle creates stress, frustration, and the feeling that you’re falling behind —
          even when you’re doing your best.
        </p>
      </div>
    </SectionShell>
  );
}
