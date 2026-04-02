import { Container, Eyebrow } from "../ui";

const forYou = [
  "You are living paycheck to paycheck and want a way out that respects real life.",
  "You are a beginner who wants a step-by-step system—not scattered blog posts.",
  "You know you need structure before you throw money at random investments.",
  "You care about long-term stability more than viral trading clips.",
];

const notForYou = [
  "You want a get-rich-quick playbook or overnight results.",
  "You are looking for hype trading signals or “secret” stock picks.",
  "You are not willing to be consistent and disciplined with the basics.",
];

export function WhoItsForSection() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-16 sm:py-20">
      <Container>
        <Eyebrow>Fit</Eyebrow>
        <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--sf-navy)] sm:text-3xl lg:text-4xl">
          Who this is for
        </h2>
        <div className="mt-10 rounded-2xl border border-slate-200/90 bg-[#fafbfc] p-8 shadow-sm sm:p-10">
          <ul className="space-y-4">
            {forYou.map((line) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sf-teal)]" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export function WhoItsNotForSection() {
  return (
    <section className="border-b border-slate-200/80 bg-[#fafbfc] py-16 sm:py-20">
      <Container>
        <Eyebrow>Honest expectations</Eyebrow>
        <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--sf-navy)] sm:text-3xl lg:text-4xl">
          Who this is not for
        </h2>
        <div className="mt-10 rounded-2xl border border-slate-300/60 bg-white p-8 shadow-sm sm:p-10">
          <ul className="space-y-4">
            {notForYou.map((line) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
