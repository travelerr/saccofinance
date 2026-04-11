import { ChevronDown } from "lucide-react";
import { PageContainer } from "../ui";

const faqs = [
  {
    question: "Is this for complete beginners?",
    answer:
      "Yes — this is designed specifically for people who feel like they're starting from zero or feel stuck despite having income. You don't need any prior financial knowledge. The Blueprint builds the foundation from the ground up, in plain language. If you already have a strong system, this may feel like review. If you don't, it's exactly what you need.",
  },
  {
    question: "Is this just budgeting advice?",
    answer:
      "No. Budgeting is one piece of it, but The Financial Base Blueprint covers the full picture: how to understand where you stand, how to structure your income, how to eliminate the financial leaks, how to build a buffer, how to sequence your financial goals, and how to build habits that keep the system running. Think of it as a financial foundation — not a line-item expense tracker.",
  },
  {
    question: "What format is it in?",
    answer:
      "The Financial Base Blueprint is a PDF e-book. You'll get instant download access after purchase and can read it on any device — your phone, tablet, laptop, or print it out. No app to install, no subscription to manage.",
  },
  {
    question: "How long will it take me to go through it?",
    answer:
      "Most people can read through the entire Blueprint in 2-3 hours. But it's designed to be used as a reference — not just read once and shelved. You'll likely come back to specific chapters as you implement each step.",
  },
  {
    question: "Is this actual financial advice?",
    answer:
      "The Financial Base Blueprint is financial education — a practical system and framework for managing your personal finances. It is not personalized financial advice, investment advice, or tax advice. As with any financial decision, you should use your own judgment and consult a licensed professional if you need advice specific to your situation.",
  },
  {
    question: "What if I have irregular income or I'm self-employed?",
    answer:
      "The principles in the Blueprint apply to all income types. There's specific guidance on how to work with variable income — including how to set a baseline, smooth out your cash flow month to month, and still build a buffer without a fixed paycheck.",
  },
  {
    question: "What if I've tried budgets before and failed?",
    answer:
      'Most budget "failures" happen because the system wasn\'t built around your actual life — it was built around an ideal version of your life. The Financial Base Blueprint works because it starts with reality, not aspirations. It\'s built to be realistic enough to stick to.',
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Please review the refund terms on the order page before purchasing. We stand behind the quality of the content — if you have a question about fit before buying, we encourage you to review the 'What's Inside' section above to see exactly what you'll receive.",
  },
];

export function ReplitFaqSection() {
  return (
    <section className="bg-gradient-to-br from-[var(--sf-teal)]/[0.07] via-slate-50 to-white py-20 lg:py-28">
      <PageContainer>
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold leading-tight text-[var(--sf-navy)] sm:text-4xl lg:text-5xl">
            Questions Before You Buy
          </h2>
          <p className="mt-4 text-lg text-slate-600">Straight answers to the things people actually want to know.</p>
          </div>

          <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-slate-900 outline-none transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                <span className="leading-snug">{faq.question}</span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="border-t border-slate-200/90 px-6 py-5">
                <p className="text-base leading-relaxed text-slate-600">{faq.answer}</p>
              </div>
            </details>
          ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
