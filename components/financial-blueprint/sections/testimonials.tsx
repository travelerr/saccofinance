import { Card, SectionShell } from "../ui";

const quotes = [
  "This completely changed how I look at my money.",
  "For the first time, I feel in control.",
  "Simple, clear, and actually works.",
];

export function TestimonialsSection() {
  return (
    <SectionShell className="bg-[#fafafa]">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-3xl md:text-4xl">
        People Are Already Using This System
      </h2>
      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">
        (Testimonials will be updated)
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {quotes.map((q) => (
          <Card key={q} className="flex flex-col justify-between">
            <p className="text-base italic leading-relaxed text-slate-700">&ldquo;{q}&rdquo;</p>
            <p className="mt-4 text-xs text-slate-400">— Customer</p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
