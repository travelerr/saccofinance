import { StickyMobileCta } from "./StickyMobileCta";
import {
  ReplitFaqSection,
  ReplitFinalCtaSection,
  ReplitHeroSection,
  ReplitVideoSection,
  ReplitProblemSection,
  ReplitSolutionSection,
  ReplitTransformationSection,
  ReplitTrustSection,
  ReplitWhatsInsideSection,
} from "./replit-sales";

/** Full sales funnel (hero through final CTA). Used on `/financial-blueprint` and merged thank-you flows. */
export function FinancialBlueprintMarketingSections() {
  return (
    <>
      <ReplitHeroSection />
      <ReplitVideoSection />
      <ReplitProblemSection />
      <ReplitSolutionSection />
      <ReplitWhatsInsideSection />
      <ReplitTransformationSection />
      <ReplitTrustSection />
      <ReplitFaqSection />
      <ReplitFinalCtaSection />
    </>
  );
}

export function FinancialBlueprintLanding() {
  return (
    <>
      <main className="pb-28 md:pb-0">
        <FinancialBlueprintMarketingSections />
      </main>
      <StickyMobileCta />
    </>
  );
}
