import { Card, SectionShell } from "../ui";

const items = [
  "You stop guessing where your money goes",
  "You build consistent monthly cash flow",
  "You feel in control instead of stressed",
  "You finally know when you’re ready to invest",
  "You stop living month-to-month",
  "You start building long-term wealth",
];

export function BenefitsSection() {
  return (
    <SectionShell className="border-b border-slate-200/80 bg-white">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-3xl md:text-4xl">
        What Changes When You Have a Real Financial System
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map((text) => (
          <Card key={text}>
            <p className="text-base font-medium leading-relaxed text-slate-800">{text}</p>
          </Card>
        ))}
      </div>
      <p className="mt-10 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
        <span className="font-medium text-slate-800">This isn’t about getting rich overnight.</span>
        <br />
        It’s about finally feeling in control of your financial life.
      </p>
    </SectionShell>
  );
}
