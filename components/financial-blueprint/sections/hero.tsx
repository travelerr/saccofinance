import Image from "next/image";
import { COVER_IMAGE_PATH, FOUNDING_PRICE, ORDER_PAGE_URL, PRODUCT_NAME, SALES_VIDEO_EMBED_URL } from "../config";
import { PageContainer, PrimaryCta } from "../ui";

export function HeroSection() {
  return (
    <section className="border-b border-slate-200/80 bg-white pt-8 pb-12 md:pt-12 md:pb-16">
      <PageContainer>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.02fr] lg:gap-14">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <h1 className="font-display text-[1.65rem] font-extrabold leading-[1.15] tracking-tight text-[var(--sf-navy)] sm:text-3xl md:text-4xl lg:text-[2.35rem]">
              Break Out of the Paycheck-to-Paycheck Cycle — and Build Real Financial Control
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl">
              A step-by-step system to help you organize your money, reduce stress, and finally start building
              real wealth — without guessing or starting over every month.
            </p>
            <div className="mt-8 flex flex-col items-center gap-2 sm:items-start">
              <PrimaryCta href={ORDER_PAGE_URL} size="lg" className="w-full sm:max-w-md">
                Get The Financial Base Blueprint
              </PrimaryCta>
              <p className="text-sm text-slate-500">
                Instant download • Founding price: ${FOUNDING_PRICE}
              </p>
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            {COVER_IMAGE_PATH ? (
              <div className="relative w-full max-w-[300px] sm:max-w-[340px]">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[var(--sf-teal)]/15 to-transparent blur-2xl" />
                <Image
                  src={COVER_IMAGE_PATH}
                  alt={`${PRODUCT_NAME} ebook cover`}
                  width={680}
                  height={880}
                  className="relative h-auto w-full rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10"
                  priority
                />
              </div>
            ) : (
              <div
                className="flex aspect-[3/4] w-full max-w-[280px] flex-col justify-end rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center sm:max-w-[320px]"
                role="img"
                aria-label="Ebook cover placeholder"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Ebook mockup</p>
                <p className="mt-2 font-display text-lg font-bold text-slate-600">{PRODUCT_NAME}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <p className="mb-4 text-center font-display text-sm font-semibold text-[var(--sf-navy)]">
            Watch: How This System Changes Your Financial Life
          </p>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
            <div className="relative aspect-video w-full bg-slate-900/5">
              {SALES_VIDEO_EMBED_URL ? (
                <iframe
                  src={SALES_VIDEO_EMBED_URL}
                  title="How this system changes your financial life"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 p-6 text-center">
                  <p className="text-sm font-medium text-slate-500">Video embed — add URL in config</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
