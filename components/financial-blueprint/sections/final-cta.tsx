import { ORDER_PAGE_URL } from "../config";
import { PrimaryCta, SectionShell } from "../ui";

export function FinalCtaSection() {
  return (
    <SectionShell className="bg-gradient-to-b from-slate-50 to-white pb-20 md:pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-3xl md:text-4xl">
          Take Control of Your Money Starting Today
        </h2>
        <p className="mt-6 text-base leading-relaxed text-slate-700 sm:text-lg">
          You don’t need more information.
          <br />
          You need a system that actually works.
        </p>
        <div className="mt-10 flex justify-center">
          <PrimaryCta href={ORDER_PAGE_URL} size="lg">
            Get The Blueprint
          </PrimaryCta>
        </div>
      </div>
    </SectionShell>
  );
}
