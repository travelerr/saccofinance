import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";

const CONTACT_EMAIL = "saccofinancial@iamsocial.la";

const pressMentions = [
  {
    outlet: "CNBC",
    title: "SpaceX IPO Live Updates",
    date: "June 12, 2026",
    dateTime: "2026-06-12",
    description:
      "Justin Sacco, founder of Sacco Financial, was included in CNBC's live coverage of the SpaceX IPO, discussing his retail investor allocation and experience participating in the offering.",
    href: "https://www.cnbc.com/2026/06/12/spacex-ipo-spcx-live-updates.html",
    cta: "Read on CNBC",
  },
  {
    outlet: "CNBC",
    title: "SpaceX IPO Leaves Retail Investors With Too Few Shares And A Tough Hold-Or-Sell Decision",
    date: "June 15, 2026",
    dateTime: "2026-06-15",
    description:
      "CNBC included follow-up commentary from Justin Sacco on his SpaceX position, long-term holding plan, allocation disappointment, and thoughts on the company's valuation.",
    href: "https://www.cnbc.com/2026/06/15/spacex-ipo-leaves-retail-investors-with-too-few-shares-and-a-tough-hold-or-sell-decision.html",
    cta: "Read on CNBC",
  },
] as const;

function cardClassName(extra = "") {
  return `rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.24)] ${extra}`;
}

export function MediaPressPage() {
  return (
    <div className="min-h-screen bg-[var(--hub-bg)] text-white selection:bg-cyan-300/30 selection:text-white">
      <header className="border-b border-white/10 bg-[rgba(6,11,20,0.82)] py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex-shrink-0" aria-label="Sacco Financial home">
            <Image
              src="/images/logo.png"
              alt="Sacco Financial"
              width={300}
              height={88}
              className="h-12 w-auto sm:h-14"
              priority
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition hover:text-[var(--hub-primary)]"
          >
            Back to home
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-cyan-300/5 blur-[100px]" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur-sm">
              As Seen On CNBC
            </span>

            <h1 className="font-brand mt-8 text-4xl leading-[1.08] tracking-tight text-white md:text-6xl">
              Sacco Financial In The Media
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Market commentary, retail investor sentiment, and investing education from Justin Sacco, founder of Sacco
              Financial.
            </p>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8" aria-labelledby="press-mentions-heading">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
              <h2 id="press-mentions-heading" className="font-brand text-3xl tracking-tight text-white md:text-4xl">
                Press Mentions
              </h2>
              <p className="mt-3 text-base text-slate-400 md:text-lg">
                Recent coverage featuring Justin Sacco and Sacco Financial.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {pressMentions.map((mention) => (
                <article key={mention.href} className={cardClassName("flex h-full flex-col p-6 sm:p-8")}>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex rounded-full border border-[var(--hub-primary)]/30 bg-[var(--hub-primary)]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--hub-primary)]">
                      {mention.outlet}
                    </span>
                    <time dateTime={mention.dateTime} className="text-sm font-medium text-slate-400">
                      {mention.date}
                    </time>
                  </div>

                  <h3 className="font-brand text-xl leading-snug tracking-tight text-white md:text-2xl">
                    {mention.title}
                  </h3>

                  <p className="mt-4 flex-1 text-base leading-relaxed text-slate-300">{mention.description}</p>

                  <a
                    href={mention.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-cyan-300/20 bg-[var(--hub-primary)] px-6 py-3 text-sm font-semibold text-[var(--hub-bg)] transition hover:brightness-110 sm:w-auto"
                  >
                    {mention.cta}
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/8 px-4 py-16 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="bio-heading">
          <div className="mx-auto max-w-3xl">
            <div className={cardClassName("p-6 sm:p-10")}>
              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
                <Image
                  src="/images/profile.jpg"
                  alt="Justin Sacco"
                  width={96}
                  height={96}
                  className="h-24 w-24 shrink-0 rounded-full border-2 border-cyan-300/30 object-cover shadow-xl"
                  style={{ objectPosition: "center top" }}
                />
                <div>
                  <h2 id="bio-heading" className="font-brand text-2xl tracking-tight text-white md:text-3xl">
                    About Justin Sacco
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
                    Justin Sacco is the founder of Sacco Financial, an investing education platform focused on helping
                    everyday investors understand the stock market, IPOs, options strategies, personal finance, and
                    long-term wealth building.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8" aria-labelledby="media-inquiries-heading">
          <div className="mx-auto max-w-3xl text-center">
            <div className={cardClassName("relative overflow-hidden p-8 md:p-12")}>
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[var(--hub-primary)]/10 blur-[70px]" />
              <div className="relative z-10">
                <h2 id="media-inquiries-heading" className="font-brand text-3xl tracking-tight text-white md:text-4xl">
                  Media Inquiries
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                  For market commentary, retail investor sentiment, IPO reactions, or investing education segments,
                  contact Justin Sacco.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Media Inquiry — Sacco Financial")}`}
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[var(--sf-coral)] to-[var(--sf-coral-dark)] px-8 py-3 text-sm font-bold text-[var(--hub-bg)] shadow-[0_8px_28px_rgba(255,133,89,0.38)] transition hover:brightness-110 sm:w-auto sm:text-base"
                >
                  Contact Sacco Financial
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-sm text-slate-400 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} Sacco Financial. All rights reserved.</p>
          <p className="max-w-xl text-xs">
            Content on this site is for educational purposes only and does not constitute financial, investment, or legal
            advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
