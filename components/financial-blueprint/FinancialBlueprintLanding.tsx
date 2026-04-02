import { BlueprintHeader } from "./blueprint-header";
import { BlueprintFooter } from "./blueprint-footer";
import { HeroSection } from "./sections/hero";
import { VideoSalesSection } from "./sections/video-sales";
import { ProblemSection } from "./sections/problem";
import { WhatsInsideSection } from "./sections/whats-inside";
import { CredibilitySection } from "./sections/credibility";
import { WhoItsForSection, WhoItsNotForSection } from "./sections/audience";
import { PricingSection } from "./sections/pricing";
import { FaqSection } from "./sections/faq";
import { FinalCtaSection } from "./sections/final-cta";

export function FinancialBlueprintLanding() {
  return (
    <>
      <BlueprintHeader />
      <main>
        <HeroSection />
        <VideoSalesSection />
        <ProblemSection />
        <WhatsInsideSection />
        <CredibilitySection />
        <WhoItsForSection />
        <WhoItsNotForSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <BlueprintFooter />
    </>
  );
}
