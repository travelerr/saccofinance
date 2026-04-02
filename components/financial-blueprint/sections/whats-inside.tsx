import { Container, Eyebrow } from "../ui";

const items = [
  {
    title: "Organize your debt",
    body: "See what you owe, in what order to address it, and how it fits into monthly cash flow.",
  },
  {
    title: "Reduce monthly overhead",
    body: "Find leaks in fixed and variable spending without living on rice and beans forever.",
  },
  {
    title: "Build positive monthly cash flow",
    body: "Structure income and expenses so you are not just breaking even at the end of the month.",
  },
  {
    title: "Create a real financial base",
    body: "Define what “base” means for you and the sequence to build it without skipping steps.",
  },
  {
    title: "Emergency fund strategy",
    body: "How much to hold, where to keep it, and when to use it—so investments do not get raided.",
  },
  {
    title: "Beginner investing basics",
    body: "Long-term, fundamentals-first context so you can invest with a plan—not a whim.",
  },
  {
    title: "Long-term thinking around money",
    body: "Habits and mindset that support decades of progress, not one good month.",
  },
];

export function WhatsInsideSection() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-16 sm:py-20">
      <Container>
        <Eyebrow>Inside the PDF</Eyebrow>
        <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--sf-navy)] sm:text-3xl lg:text-4xl">
          What you get
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          A compact system you can work through in order. No filler chapters—just the moves that create a
          durable foundation.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200/90 bg-[#fafbfc] p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="font-display text-lg font-semibold text-[var(--sf-navy)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
