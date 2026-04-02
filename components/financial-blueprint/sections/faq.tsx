import { Container, Eyebrow } from "../ui";

const faqs: { q: string; a: string }[] = [
  {
    q: "Is this a physical product?",
    a: "No. The Financial Base Blueprint is a digital PDF. After purchase you download it instantly—no shipping or waiting.",
  },
  {
    q: "Is this for beginners?",
    a: "Yes. It is written for people who want a clear system, whether you are starting from zero or restarting after a messy stretch.",
  },
  {
    q: "Is this financial advice?",
    a: "No. This is educational content only. It is not financial, investment, legal, or tax advice, and it is not a recommendation to buy or sell any security. Your situation is unique—consult a qualified professional for advice related to your circumstances.",
  },
  {
    q: "How do I access the PDF?",
    a: "After checkout you will receive access to your download link. Save the file to your device and refer back whenever you need.",
  },
  {
    q: "Do I get instant access after purchase?",
    a: "Yes. Access is delivered right after your purchase is confirmed so you can start the same day.",
  },
];

export function FaqSection() {
  return (
    <section className="border-b border-slate-200/80 bg-[#fafbfc] py-16 sm:py-20">
      <Container>
        <Eyebrow>Questions</Eyebrow>
        <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--sf-navy)] sm:text-3xl lg:text-4xl">
          FAQ
        </h2>
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-slate-200/90 bg-white px-5 py-4 shadow-sm open:shadow-md"
            >
              <summary className="cursor-pointer list-none font-medium text-[var(--sf-navy)] outline-none marker:content-none [&::-webkit-details-marker]:hidden">
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
      </Container>
    </section>
  );
}
