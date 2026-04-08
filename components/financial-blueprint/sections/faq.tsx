import { SectionShell } from "../ui";

const faqs = [
  {
    q: "Is this financial advice?",
    a: "No, this is educational content designed to help you better understand and structure your finances.",
  },
  {
    q: "Is this for beginners?",
    a: "Yes, especially if you feel like you don’t have a system yet.",
  },
  {
    q: "How do I access it?",
    a: "Immediately after purchase, you’ll receive a downloadable PDF.",
  },
];

export function FaqSection() {
  return (
    <SectionShell className="border-t border-slate-200/80 bg-white">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--sf-navy)] sm:text-3xl">
        FAQ
      </h2>
      <div className="mt-10 space-y-4">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm open:shadow-md"
          >
            <summary className="cursor-pointer list-none font-semibold text-[var(--sf-navy)] outline-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-3">
                {item.q}
                <span className="text-slate-400 transition group-open:rotate-180" aria-hidden>
                  ▼
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{item.a}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
