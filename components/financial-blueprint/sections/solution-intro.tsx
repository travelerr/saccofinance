import { ORDER_PAGE_URL } from "../config";
import { PrimaryCta, SectionShell } from "../ui";

export function SolutionIntroSection() {
  return (
    <SectionShell className="bg-[#fafafa]">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-3xl md:text-4xl">
        This Is the System That Changes Everything
      </h2>
      <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
        <p>
          The Financial Base Blueprint is a step-by-step system designed to give you structure, clarity, and
          control over your money.
        </p>
        <p className="font-medium text-slate-900">This is not theory.</p>
        <p className="font-medium text-slate-900">This is not hype.</p>
        <p>
          This is the exact framework used to build real financial stability — from the ground up.
        </p>
      </div>
      <div className="mt-10">
        <PrimaryCta href={ORDER_PAGE_URL} size="lg">
          Get Instant Access
        </PrimaryCta>
      </div>
    </SectionShell>
  );
}
