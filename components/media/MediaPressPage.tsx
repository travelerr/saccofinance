import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ExternalLink, Play } from "lucide-react";
import {
  INTERVIEW_TOPICS,
  MEDIA_CATEGORIES,
  type PressItem,
  getPressItemsByCategory,
} from "@/lib/media";
import { OutletLogo, OutletLogos } from "@/components/media/OutletLogos";

const CONTACT_EMAIL = "saccofinancial@iamsocial.la";
const MIZKIF_VIDEO_URL = "https://www.youtube.com/watch?v=D90WnK3k_lM";
const MIZKIF_EMBED_URL = "https://www.youtube.com/embed/D90WnK3k_lM?si=MtWBEuEAV60UHF0x";

function cardClassName(extra = "") {
  return `rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.24)] ${extra}`;
}

function TelevisionCard({ item }: { item: PressItem }) {
  return (
    <article
      className={cardClassName(
        "relative overflow-hidden border-[var(--hub-primary)]/25 ring-1 ring-[var(--hub-primary)]/15 transition duration-300 hover:-translate-y-1",
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--hub-primary)]/10 blur-[80px]" />

      <div className="relative p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <OutletLogo outlet="tastylive" size="md" badge />
          {item.subtitle && (
            <span className="text-sm font-medium text-slate-400">{item.subtitle}</span>
          )}
        </div>

        <h3 className="font-brand text-2xl leading-snug tracking-tight text-white md:text-3xl">
          {item.title}
        </h3>

        <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">{item.description}</p>

        {item.videoEmbedUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
            <div className="relative aspect-video w-full">
              <iframe
                src={item.videoEmbedUrl}
                title={`${item.outlet} — ${item.title}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {item.href && (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-300/20 bg-[var(--hub-primary)] px-6 py-3 text-sm font-semibold text-[var(--hub-bg)] transition hover:brightness-110"
            >
              <Play className="h-4 w-4 shrink-0" aria-hidden />
              {item.cta}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function NewsArticleCard({ item }: { item: PressItem }) {
  return (
    <article
      className={cardClassName(
        "flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 sm:p-7",
      )}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <OutletLogo outlet="cnbc" size="sm" badge />
        <time dateTime={item.dateTime} className="text-sm font-medium text-slate-400">
          {item.date}
        </time>
      </div>

      <h3 className="font-brand text-lg leading-snug tracking-tight text-white md:text-xl">
        {item.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400 md:text-base">
        {item.description}
      </p>

      {item.href && (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 sm:w-auto"
        >
          {item.cta}
          <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
        </a>
      )}
    </article>
  );
}

function EmptyCategoryPlaceholder({ label }: { label: string }) {
  return (
    <div
      className={cardClassName(
        "border-dashed border-white/8 bg-transparent p-8 text-center",
      )}
    >
      <p className="text-sm text-slate-500">
        {label} coverage will be listed here as it becomes available.
      </p>
    </div>
  );
}

export function MediaPressPage() {
  const televisionItems = getPressItemsByCategory("television");
  const newsItems = getPressItemsByCategory("news");

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
        <section className="relative px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-cyan-300/5 blur-[100px]" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-brand text-4xl leading-[1.08] tracking-tight text-white md:text-6xl">
              Featured Media
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Market commentary, television appearances, and financial media coverage featuring Justin
              Sacco.
            </p>

            <div className="mx-auto mt-10 max-w-3xl">
              <OutletLogos size="lg" panel />
            </div>
          </div>
        </section>

        <section
          className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20"
          aria-labelledby="mizkif-feature-heading"
        >
          <div className="mx-auto max-w-6xl">
            <article
              className={cardClassName(
                "relative overflow-hidden border-fuchsia-400/20 ring-1 ring-fuchsia-400/10",
              )}
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-[90px]" />
              <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:p-10">
                <div>
                  <span className="inline-flex items-center rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-200">
                    Creator Feature
                  </span>
                  <h2
                    id="mizkif-feature-heading"
                    className="mt-5 font-brand text-3xl leading-tight tracking-tight text-white md:text-4xl"
                  >
                    Featured with Mizkif
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
                    Watch Justin Sacco&apos;s featured appearance in Mizkif&apos;s $1 Million Investing Challenge.
                  </p>
                  <a
                    href={MIZKIF_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                  >
                    <Play className="h-4 w-4 shrink-0" aria-hidden />
                    Watch on YouTube
                  </a>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={MIZKIF_EMBED_URL}
                      title="Sacco Financial on Mizkif's $1 Million Investing Challenge"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {MEDIA_CATEGORIES.map((category) => {
          const items =
            category.id === "television"
              ? televisionItems
              : category.id === "news"
                ? newsItems
                : [];

          const isPrimary = category.id === "television";

          return (
            <section
              key={category.id}
              className={`px-4 sm:px-6 lg:px-8 ${
                isPrimary ? "pb-16" : "border-t border-white/8 py-16 lg:py-20"
              }`}
              aria-labelledby={`${category.id}-heading`}
            >
              <div className="mx-auto max-w-6xl">
                <div className={`mx-auto mb-10 max-w-2xl text-center ${isPrimary ? "md:mb-12" : "md:mb-10"}`}>
                  <h2
                    id={`${category.id}-heading`}
                    className={`font-brand tracking-tight text-white ${
                      isPrimary ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
                    }`}
                  >
                    {category.label}
                  </h2>
                  <p className={`mt-3 text-slate-400 ${isPrimary ? "text-base md:text-lg" : "text-sm md:text-base"}`}>
                    {category.description}
                  </p>
                </div>

                {items.length === 0 ? (
                  <EmptyCategoryPlaceholder label={category.label} />
                ) : category.id === "television" ? (
                  <div className="space-y-6">
                    {televisionItems.map((item) => (
                      <TelevisionCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : category.id === "news" ? (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {newsItems.map((item) => (
                      <NewsArticleCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}

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
                    Justin Sacco is a finance educator, investor, and founder of Sacco Financial. His market
                    commentary has been featured by CNBC and tastylive, and he has appeared with Mizkif.
                    He discusses IPOs, options strategies, market structure, and retail investor sentiment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8" aria-labelledby="interviews-heading">
          <div className="mx-auto max-w-3xl text-center">
            <div className={cardClassName("relative overflow-hidden p-8 md:p-12")}>
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[var(--hub-primary)]/10 blur-[70px]" />
              <div className="relative z-10">
                <h2 id="interviews-heading" className="font-brand text-3xl tracking-tight text-white md:text-4xl">
                  Available for Interviews
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                  Justin is available for television, podcast, radio, and digital media interviews covering:
                </p>
                <ul className="mx-auto mt-6 grid max-w-lg grid-cols-1 gap-2 text-left text-sm text-slate-300 sm:grid-cols-2 sm:text-base">
                  {INTERVIEW_TOPICS.map((topic) => (
                    <li key={topic} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hub-primary)]" aria-hidden />
                      {topic}
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Media Inquiry — Sacco Financial")}`}
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[var(--sf-coral)] to-[var(--sf-coral-dark)] px-8 py-3 text-sm font-bold text-[var(--hub-bg)] shadow-[0_8px_28px_rgba(255,133,89,0.38)] transition hover:brightness-110 sm:w-auto sm:text-base"
                >
                  Contact for Media Inquiries
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
            Content on this site is for educational purposes only and does not constitute financial, investment, or
            legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
