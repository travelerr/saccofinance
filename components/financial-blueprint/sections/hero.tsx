import Image from "next/image";
import { Check } from "lucide-react";
import { PRODUCT_NAME, COVER_IMAGE_PATH, ORDER_PAGE_URL, FOUNDING_PRICE } from "../config";
import { Container, PrimaryCta } from "../ui";

function CoverPlaceholder() {
  return (
    <div
      className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-100 via-white to-[var(--sf-soft)] shadow-[0_20px_50px_-12px_rgba(15,45,74,0.15)] sm:max-w-[320px]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(76,225,230,0.12)_0%,transparent_45%)]" />
      <div className="flex h-full flex-col justify-between p-6 sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">Digital guide</p>
        <div>
          <p className="font-display text-2xl font-bold leading-tight tracking-tight text-[var(--sf-navy)] sm:text-3xl">
            Financial
            <br />
            Base
            <br />
            Blueprint
          </p>
          <p className="mt-4 text-xs leading-relaxed text-slate-600">
            Digital PDF · Step-by-step system for your money
          </p>
        </div>
        <div className="h-1 w-12 rounded-full bg-[var(--sf-teal)]/70" />
      </div>
    </div>
  );
}

const trustItems = [
  "Instant PDF access",
  `Founding price: $${FOUNDING_PRICE}`,
  "Downloadable digital product",
];

export function HeroSection() {
  return (
    <section className="border-b border-slate-200/80 bg-gradient-to-b from-white to-[#f4f7f9] pb-14 pt-10 sm:pb-20 sm:pt-14">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--sf-teal-ink)]">
              {PRODUCT_NAME}
            </p>
            <h1 className="font-display text-[2rem] font-bold leading-[1.12] tracking-tight text-[var(--sf-navy)] sm:text-4xl lg:text-[2.75rem]">
              Break Out of the Paycheck-to-Paycheck Cycle
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              A step-by-step financial system to help you build a solid base, take control of your money, and
              start growing real wealth.
            </p>

            <ul className="mt-8 space-y-2.5">
              {trustItems.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--sf-teal)]/15 text-[var(--sf-teal-ink)]">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta href={ORDER_PAGE_URL}>Get the blueprint</PrimaryCta>
              <p className="text-center text-xs text-slate-500 sm:text-left">
                Secure checkout · One-time purchase
              </p>
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            {COVER_IMAGE_PATH ? (
              <div className="relative w-full max-w-[320px]">
                <Image
                  src={COVER_IMAGE_PATH}
                  alt={`${PRODUCT_NAME} cover`}
                  width={640}
                  height={832}
                  className="h-auto w-full rounded-2xl border border-slate-200/90 shadow-[0_24px_60px_-16px_rgba(15,45,74,0.2)]"
                  priority
                />
              </div>
            ) : (
              <CoverPlaceholder />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
