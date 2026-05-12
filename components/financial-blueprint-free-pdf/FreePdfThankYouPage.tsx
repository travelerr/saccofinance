import { CheckCircle2 } from "lucide-react";
import { FinancialBlueprintMarketingSections } from "@/components/financial-blueprint/FinancialBlueprintLanding";
import { StickyMobileCta } from "@/components/financial-blueprint/StickyMobileCta";
import { ORDER_PAGE_URL, PRODUCT_NAME } from "@/components/financial-blueprint/config";
import { BlueprintCoverImage } from "@/components/financial-blueprint/replit-sales/BlueprintCoverImage";
import { PageContainer, PrimaryCta, SectionShell } from "@/components/financial-blueprint/ui";

/** In-page target for Blueprint overview (not checkout). */
const BLUEPRINT_OVERVIEW_ANCHOR = "#blueprint-overview";

const whatNextSteps = [
  {
    step: "1",
    title: "Free PDF sent to your email",
    body: "Watch your inbox for the free investing guide. Nothing else is required on this page to receive it.",
  },
  {
    step: "2",
    title: "Review the Blueprint below",
    body: `When you are ready, scroll through how ${PRODUCT_NAME} works — structure, topics, and how access works if it is a fit.`,
  },
  {
    step: "3",
    title: "Decide if you want the full system",
    body: "The Blueprint is optional paid education. You can read the overview first and only move forward if it makes sense for you.",
  },
] as const;

export function FreePdfThankYouPage() {
  return (
    <>
      <main className="pb-28 md:pb-0">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#071525] via-[var(--sf-navy)] to-[#0d3a42] pb-16 pt-0 md:pb-20 md:pt-0">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--sf-teal)_0%,transparent_55%)] opacity-[0.12]" />
          <PageContainer className="relative">
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[var(--sf-teal)]/30 bg-[var(--sf-teal)]/[0.08] p-4 shadow-sm shadow-black/10 backdrop-blur-sm sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--sf-teal)]/20 text-[var(--sf-teal)]">
                <CheckCircle2 className="h-5 w-5" aria-hidden />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold leading-snug text-white sm:text-base">
                  Success — your free investing PDF is being sent to your inbox now.
                </p>
              </div>
            </div>

            <div className="grid items-start gap-8 pt-10 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-10 md:pt-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14 lg:pt-14">
              <div className="order-1 flex max-w-xl flex-col items-center text-center md:items-start md:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/80">
                  <span className="text-xs font-semibold tracking-wide">FREE PDF SENT</span>
                </div>

                <h1 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                  Your Free Investing PDF Is On The Way
                </h1>

                <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base md:text-lg">
                  Check your inbox in the next few minutes. I&apos;m sending the free guide there now.
                </p>

                <p className="mt-3 text-sm font-bold leading-relaxed text-[var(--sf-coral)] sm:text-base">
                  But if you want the full system behind the guide, {PRODUCT_NAME} is the next step.
                </p>

                <div className="mt-8 flex w-full max-w-md flex-col items-center gap-3 sm:max-w-lg md:items-start">
                  <PrimaryCta
                    href={ORDER_PAGE_URL}
                    size="lg"
                    variant="accent"
                    className="w-full sm:w-auto"
                  >
                    Get The Blueprint
                  </PrimaryCta>
                  <p className="text-center text-xs leading-relaxed text-white/70 sm:text-sm md:text-left">
                    The free PDF is already on the way to your email.
                  </p>
                  <p className="text-center text-xs leading-relaxed text-white/60 sm:text-sm md:text-left">
                    The Blueprint below is the optional next step if you want the full system.
                  </p>
                </div>

                <p className="mt-6 text-sm text-white/55">
                  <a
                    href={BLUEPRINT_OVERVIEW_ANCHOR}
                    className="font-medium text-[var(--sf-teal)] underline-offset-4 transition hover:text-white hover:underline"
                  >
                    Show me what&apos;s inside
                  </a>
                </p>
              </div>

              <div className="order-2 flex justify-center md:justify-end">
                <div className="w-60 max-w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-center shadow-sm shadow-black/10 backdrop-blur-sm sm:w-64 md:w-60 lg:w-72 lg:p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sf-teal)]">
                    TAKE THE NEXT STEP
                  </p>
                  <p className="mt-2 font-display text-base font-bold leading-snug text-white lg:text-lg">
                    {PRODUCT_NAME}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white/70 sm:text-sm">
                    The complete financial system behind the free guide.
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-white/50 sm:text-xs">
                    Not included with the free PDF signup.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <BlueprintCoverImage priority variant="secondary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left shadow-sm shadow-black/10 backdrop-blur-sm sm:p-6 md:mt-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--sf-teal)]">A quick note from Justin</p>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/70 sm:text-base">
                <p>This isn&apos;t just another generic finance ebook pulled together from internet advice.</p>
                <p>
                  {PRODUCT_NAME} is a real system I personally developed through years of experience in banking,
                  investing, and building my own financial foundation — and it&apos;s still the same framework I use to
                  this day.
                </p>
                <p>
                  It&apos;s designed to help you create structure with your money, build financial margin, invest
                  consistently, and stop feeling like you&apos;re guessing your way through personal finance.
                </p>
                <p>The goal isn&apos;t hype or &ldquo;get rich quick&rdquo; strategies.</p>
                <p className="font-semibold text-white">It&apos;s building a financial system that actually lasts.</p>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* 4 — What happens next */}
        <section className="border-b border-slate-200/90 bg-slate-100/90 py-12 md:py-16">
          <PageContainer>
            <h2 className="text-center font-display text-xl font-bold text-[var(--sf-navy)] sm:text-2xl">
              What happens next
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-600 sm:text-base">
              A simple flow: your free resource first, then an optional look at the full program.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
              {whatNextSteps.map(({ step, title, body }) => (
                <div
                  key={step}
                  className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-sm shadow-slate-200/50 sm:p-6"
                >
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sf-navy)] font-display text-sm font-bold text-white">
                    {step}
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold leading-snug text-[var(--sf-navy)]">{title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{body}</p>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        <SectionShell className="bg-white">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
              Take your time with the free PDF when it arrives. The sections that follow explain {PRODUCT_NAME} in a
              straightforward way — no pressure, no tricks — so you can decide whether the full system is worth exploring
              further.
            </p>
          </div>
        </SectionShell>

        <div id="blueprint-overview" className="scroll-mt-6 md:scroll-mt-8">
          <FinancialBlueprintMarketingSections />
        </div>

        <footer className="border-t border-slate-200 bg-white py-10 md:py-12">
          <PageContainer>
            <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
              Sacco Financial content is for educational and informational purposes only. This is not financial advice.
              Always do your own research and consider speaking with a licensed financial professional before making
              financial decisions.
            </p>
          </PageContainer>
        </footer>
      </main>
      <StickyMobileCta />
    </>
  );
}
