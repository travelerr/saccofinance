import { BlueprintFooter } from "./blueprint-footer";
import { BlueprintHeader } from "./blueprint-header";
import { StickyMobileCta } from "./StickyMobileCta";
import { AgitationSection } from "./sections/agitation";
import { AuthoritySection } from "./sections/authority";
import { BenefitsSection } from "./sections/benefits";
import { FaqSection } from "./sections/faq";
import { FinalCtaSection } from "./sections/final-cta";
import { FitSection } from "./sections/fit";
import { HeroSection } from "./sections/hero";
import { PricingSection } from "./sections/pricing";
import { ProblemSection } from "./sections/problem";
import { SolutionIntroSection } from "./sections/solution-intro";
import { TestimonialsSection } from "./sections/testimonials";
import { WhatsInsideSection } from "./sections/whats-inside";

export function FinancialBlueprintLanding() {
  return (
    <>
      <BlueprintHeader />
      <main className="pb-28 md:pb-0">
        <HeroSection />
        <ProblemSection />
        <AgitationSection />
        <SolutionIntroSection />
        <BenefitsSection />
        <WhatsInsideSection />
        <AuthoritySection />
        <TestimonialsSection />
        <PricingSection />
        <FitSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <BlueprintFooter />
      <StickyMobileCta />
    </>
  );
}
