import { Card, SectionShell } from "../ui";

const forYou = [
  "You feel stuck financially",
  "You want a clear, simple system",
  "You’re ready to take control",
];

const notFor = [
  "You want a get-rich-quick shortcut",
  "You’re looking for risky trading strategies",
  "You’re not willing to be consistent",
];

export function FitSection() {
  return (
    <SectionShell className="bg-[#fafafa]">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-3xl md:text-4xl">
        Is This Right For You?
      </h2>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-[var(--sf-teal-ink)]">
            This is for you if:
          </p>
          <ul className="mt-4 space-y-3">
            {forYou.map((line) => (
              <li key={line} className="flex gap-3 text-slate-800">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sf-teal)]" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <Card className="border-slate-300/60 bg-slate-50/80">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-slate-600">
            This is NOT for you if:
          </p>
          <ul className="mt-4 space-y-3">
            {notFor.map((line) => (
              <li key={line} className="flex gap-3 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </SectionShell>
  );
}
