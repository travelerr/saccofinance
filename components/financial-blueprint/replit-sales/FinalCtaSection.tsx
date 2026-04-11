import { Clock, Download, ShieldCheck } from "lucide-react";
import { CtaWithSubtext, PageContainer } from "../ui";

const trustBadges = [
  { icon: Download, label: "Instant PDF Access" },
  { icon: ShieldCheck, label: "Trusted Content" },
  { icon: Clock, label: "Read in One Sitting" },
];

export function ReplitFinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#071525] via-[var(--sf-navy)] to-[#0d3a42] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--sf-teal)_0%,transparent_50%)] opacity-[0.1]" />
      <PageContainer className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            You Can Keep Winging It. <span className="text-[var(--sf-teal)]">Or You Can Build a System.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
            The paycheck-to-paycheck cycle doesn&apos;t break on its own. It breaks when you give yourself a clear
            structure — and actually follow it.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            The Financial Base Blueprint gives you that structure. Step by step. No fluff. No hype. Just the system that
            gets you from chaos to stable — and from stable to building.
          </p>

          <div className="mt-10">
            <CtaWithSubtext
              size="lg"
              align="center"
              subtext="Instant PDF download — start reading in minutes"
              subtextClassName="text-white/55"
            >
              Get The Financial Base Blueprint
            </CtaWithSubtext>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-4 w-4 text-[var(--sf-teal)]" aria-hidden />
                  </div>
                  <span className="text-sm font-medium text-white/55">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
