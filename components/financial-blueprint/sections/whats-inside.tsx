import { Card, SectionShell } from "../ui";

const bullets = [
  "How to organize all your debt and financial accounts",
  "How to reduce unnecessary monthly expenses",
  "How to build positive monthly cash flow",
  "How to create a strong financial base before investing",
  "How to build an emergency fund the right way",
  "A simple framework to start investing with confidence",
];

export function WhatsInsideSection() {
  return (
    <SectionShell className="bg-[#fafafa]">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-3xl md:text-4xl">
        What You’ll Learn Inside the Blueprint
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {bullets.map((line) => (
          <Card key={line}>
            <p className="text-sm leading-relaxed text-slate-800 sm:text-base">{line}</p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
