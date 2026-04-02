import { Container, Eyebrow } from "../ui";

const pains = [
  "You feel stuck living paycheck to paycheck, even when your income is “enough” on paper.",
  "You do not have a simple financial system—just bills, stress, and hoping the math works out.",
  "You want to save and invest, but you cannot get traction long enough to see progress.",
  "Debt, subscriptions, and competing priorities leave you overwhelmed instead of focused.",
  "You want structure and clarity—not another hype post about getting rich overnight.",
];

export function ProblemSection() {
  return (
    <section className="border-b border-slate-200/80 bg-[#fafbfc] py-16 sm:py-20">
      <Container>
        <Eyebrow>The real problem</Eyebrow>
        <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--sf-navy)] sm:text-3xl lg:text-4xl">
          Most people were never given a system
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          This blueprint is for you if you are tired of piecing together random tips and want a clear base to
          build from—cash flow first, then stability, then growth.
        </p>
        <ul className="mt-10 space-y-4">
          {pains.map((text) => (
            <li
              key={text}
              className="relative rounded-2xl border border-slate-200/90 bg-white p-5 pl-6 shadow-sm shadow-slate-200/40 before:absolute before:left-0 before:top-5 before:h-[calc(100%-2.5rem)] before:w-1 before:rounded-full before:bg-[var(--sf-teal)]/50"
            >
              <span className="text-sm leading-relaxed text-slate-700 sm:text-base">{text}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
