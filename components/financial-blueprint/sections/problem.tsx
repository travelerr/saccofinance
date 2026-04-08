import { SectionShell } from "../ui";

export function ProblemSection() {
  return (
    <SectionShell className="bg-[#fafafa]">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-3xl md:text-4xl">
        Most People Don’t Have a Money Problem — They Have a System Problem
      </h2>
      <p className="mt-6 max-w-3xl text-lg font-medium text-slate-800">
        You’re not behind because you’re lazy.
        <br />
        You’re behind because no one ever showed you how to structure your finances properly.
      </p>
      <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">Most people:</p>
      <ul className="mt-4 space-y-3 text-base leading-relaxed text-slate-700 sm:text-lg">
        <li className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sf-teal)]" aria-hidden />
          Don’t know exactly where their money is going
        </li>
        <li className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sf-teal)]" aria-hidden />
          Feel like they’re starting over every month
        </li>
        <li className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sf-teal)]" aria-hidden />
          Try to save or invest… but never gain traction
        </li>
      </ul>
      <p className="mt-8 text-base leading-relaxed text-slate-700 sm:text-lg">
        Without a system, money feels random.
        <br />
        And when money feels random, progress never sticks.
      </p>
    </SectionShell>
  );
}
