import { SectionShell } from "../ui";

export function AuthoritySection() {
  return (
    <SectionShell className="border-y border-slate-200/80 bg-white">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-3xl md:text-4xl">
        Built From Real Experience — Not Theory
      </h2>
      <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-slate-700 sm:text-lg">
        <p>I spent over 10 years working in banking with high net worth individuals.</p>
        <p>I saw exactly how people who were financially successful actually managed their money.</p>
        <p>Then I took those principles and applied them to my own life.</p>
        <p>
          Over time, I built a system that gave me control, flexibility, and the ability to make financial
          decisions without stress.
        </p>
        <p className="font-medium text-slate-900">
          Now I’ve turned that system into something simple that anyone can follow.
        </p>
      </div>
    </SectionShell>
  );
}
