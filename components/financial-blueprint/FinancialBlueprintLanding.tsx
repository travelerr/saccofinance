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

export function FinancialBlueprintLanding() {
  return (
    <>
      <main className="pb-28 md:pb-0">
        <ReplitHeroSection />
        <ReplitVideoSection />
        <ReplitProblemSection />
        <ReplitSolutionSection />
        <ReplitWhatsInsideSection />
        <ReplitTransformationSection />
        <ReplitTrustSection />
        <ReplitFaqSection />
        <ReplitFinalCtaSection />
      </main>
      <StickyMobileCta />
    </>
  );
}
