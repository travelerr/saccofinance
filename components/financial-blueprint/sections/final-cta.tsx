import { ORDER_PAGE_URL } from "../config";
import { Container, PrimaryCta } from "../ui";

export function FinalCtaSection() {
  return (
    <section className="bg-gradient-to-b from-white to-[#eef2f6] py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--sf-navy)] sm:text-3xl lg:text-4xl">
            Build the base. Then build wealth.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            If you are ready to replace chaos with a system—cash flow, stability, and a long-term path—this
            blueprint is the structured starting point. No gimmicks. Just the work that actually moves the
            needle.
          </p>
          <div className="mt-10 flex justify-center">
            <PrimaryCta href={ORDER_PAGE_URL}>Get the Financial Base Blueprint</PrimaryCta>
          </div>
          <p className="mt-6 text-sm text-slate-500">Founding pricing · Instant PDF access</p>
        </div>
      </Container>
    </section>
  );
}
