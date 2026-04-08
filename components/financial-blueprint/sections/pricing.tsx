import { FOUNDING_PRICE, ORDER_PAGE_URL, PRODUCT_NAME } from "../config";
import { PrimaryCta, SectionShell } from "../ui";

export function PricingSection() {
  return (
    <SectionShell className="border-b border-slate-200/80 bg-white">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 p-8 text-center shadow-lg shadow-slate-200/60 sm:p-10">
        <h2 className="font-display text-2xl font-extrabold text-[var(--sf-navy)] sm:text-3xl">
          Get The Financial Base Blueprint
        </h2>
        <p className="mt-6 font-display text-5xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-6xl">
          ${FOUNDING_PRICE}
        </p>
        <p className="mt-2 text-sm text-slate-500">Founding price — will increase in the future</p>
        <ul className="mt-8 space-y-2 text-sm text-slate-700">
          <li>Instant PDF download</li>
          <li>Lifetime access</li>
        </ul>
        <div className="mt-10">
          <PrimaryCta href={ORDER_PAGE_URL} size="lg" className="w-full">
            Get Instant Access Now
          </PrimaryCta>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-slate-400">{PRODUCT_NAME}</p>
    </SectionShell>
  );
}
