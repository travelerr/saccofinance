import Image from "next/image";
import { Container, Eyebrow } from "../ui";

export function CredibilitySection() {
  return (
    <section className="border-b border-slate-200/80 bg-gradient-to-b from-[#f4f7f9] to-white py-16 sm:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-16">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[var(--sf-teal)]/30 to-transparent blur-lg" />
              <Image
                src="/images/profile.jpg"
                alt="Justin Sacco"
                width={200}
                height={200}
                className="relative h-40 w-40 rounded-2xl border border-slate-200/90 object-cover object-top shadow-lg sm:h-44 sm:w-44"
              />
            </div>
          </div>
          <div>
            <Eyebrow>Why I built this</Eyebrow>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--sf-navy)] sm:text-3xl">
              Built from real experience—not theory
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 sm:text-[1.05rem]">
              <p>
                I spent over a decade in banking, working with everyday households and high net worth clients.
                The gap was rarely “more motivation”—it was a missing structure most people were never taught.
              </p>
              <p>
                For the last five-plus years I have also worked in software engineering, building systems that
                have to work under pressure. Money benefits from the same thing: clear steps, repeatable habits,
                and honest numbers.
              </p>
              <p>
                I built a $1.4M+ net worth from scratch using discipline and long-term thinking—not shortcuts.
                This guide packages the foundation so you can stop guessing and start stacking progress.
              </p>
              <p className="font-medium text-slate-700">
                If you want a calm, modern blueprint instead of noise, you are in the right place.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
