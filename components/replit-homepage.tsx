"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Instagram,
  LineChart,
  Mail,
  Menu,
  Newspaper,
  PlaySquare,
  Star,
  TrendingUp,
  Twitter,
  Wallet,
  X,
  Youtube,
  FileText,
} from "lucide-react";
const LINKS = {
  freeGuide: "https://join.justinsacco.com/free-investing-pdf",
  financialBlueprint: "/financial-blueprint",
  youtube: "https://www.youtube.com/@saccofinancial",
  tiktok: "https://www.tiktok.com/@saccofinancial",
  instagram: "https://www.instagram.com/saccofinancial",
  x: "https://x.com/saccofinancial",
  email: "support@justinsacco.com",
};

const navLinks = [
  { name: "Links", href: "#links" },
  { name: "About", href: "#about" },
  { name: "Resources", href: "#resources" },
  { name: "Topics", href: "#topics" },
];

const badges = [
  "Stock Market Education",
  "Beginner Investing",
  "Personal Finance",
  "Trading Community",
];

const stats = [
  { value: "60K+", label: "Subscribers" },
  { value: "15+", label: "Years Experience" },
  { value: "50M+", label: "Content Views" },
  { value: "5.0", label: "Average Rating" },
];

/** Three main paths: free PDF, premium blueprint, then all channels via link hub. */
const pathCards: {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  variant: "free" | "premium" | "channels";
}[] = [
  {
    title: "Free investing guide",
    description:
      "Start with the free PDF and email list—beginner-friendly investing education without paying a cent.",
    href: LINKS.freeGuide,
    icon: <Mail className="h-6 w-6 text-[var(--hub-primary)]" />,
    variant: "free",
  },
  {
    title: "The Financial Base Blueprint",
    description:
      "Premium PDF: a step-by-step system for cash flow, debt, your financial base, and long-term habits.",
    href: LINKS.financialBlueprint,
    icon: <FileText className="h-6 w-6 text-[var(--hub-primary)]" />,
    variant: "premium",
  },
  {
    title: "YouTube, TikTok & more",
    description:
      "Prefer video and social? Open the link hub for every channel plus the free guide in one place.",
    href: "/link-tree",
    icon: <BookOpen className="h-6 w-6 text-blue-400" />,
    variant: "channels",
  },
];

const socialChannelCards = [
  {
    title: "Watch on YouTube",
    description: "In-depth tutorials, market breakdowns, and beginner lessons.",
    href: LINKS.youtube,
    icon: <Youtube className="h-6 w-6 text-red-400" />,
  },
  {
    title: "Follow on TikTok",
    description: "Quick finance tips and market context in short form.",
    href: LINKS.tiktok,
    icon: <PlaySquare className="h-6 w-6 text-pink-400" />,
  },
  {
    title: "Follow on Instagram",
    description: "Charts, ideas, and behind-the-scenes content.",
    href: LINKS.instagram,
    icon: <Instagram className="h-6 w-6 text-orange-400" />,
  },
  {
    title: "Follow on X",
    description: "Market commentary and real-time notes.",
    href: LINKS.x,
    icon: <Twitter className="h-6 w-6 text-sky-400" />,
  },
];

const offers: {
  title: string;
  description: string;
  badge: string;
  cta: string;
  href: string;
  popular?: boolean;
  premium?: boolean;
}[] = [
  {
    title: "Free Beginner Investing Guide",
    description:
      "Download the free guide and join the list for practical investing education, market insights, and future updates.",
    badge: "Free",
    cta: "Get the free guide",
    href: LINKS.freeGuide,
    popular: true,
  },
  {
    title: "The Financial Base Blueprint",
    description:
      "A downloadable PDF system: organize debt and spending, build positive cash flow, fund emergencies the right way, and learn investing fundamentals—with discipline and long-term structure. Not a get-rich-quick pitch.",
    badge: "Full system",
    cta: "View the blueprint",
    href: LINKS.financialBlueprint,
    premium: true,
  },
  {
    title: "Daily market content",
    description:
      "Follow along for regular market commentary, chart breakdowns, and beginner-friendly education—always free.",
    badge: "Channels",
    cta: "Watch on YouTube",
    href: LINKS.youtube,
  },
];

const topics = [
  {
    title: "Stock Market News",
    description: "Breaking down earnings, macro events, and market moves into plain English.",
    icon: <Newspaper className="mb-4 h-8 w-8 text-[var(--hub-primary)]" />,
  },
  {
    title: "Beginner Investing",
    description: "ETF strategies, retirement accounts, and building a strong financial foundation.",
    icon: <Wallet className="mb-4 h-8 w-8 text-[var(--hub-primary)]" />,
  },
  {
    title: "Trading Education",
    description: "Price action, chart patterns, entries, exits, and risk-management systems.",
    icon: <TrendingUp className="mb-4 h-8 w-8 text-[var(--hub-primary)]" />,
  },
  {
    title: "Personal Finance",
    description: "Budgeting, building credit, and maximizing savings for long-term wealth.",
    icon: <Briefcase className="mb-4 h-8 w-8 text-[var(--hub-primary)]" />,
  },
  {
    title: "Market Breakdowns",
    description: "Weekly sector analysis, earnings previews, and broader economic commentary.",
    icon: <LineChart className="mb-4 h-8 w-8 text-[var(--hub-primary)]" />,
  },
  {
    title: "Wealth Building",
    description: "Long-term strategies for building generational wealth through smart investing.",
    icon: <Wallet className="mb-4 h-8 w-8 text-[var(--hub-primary)]" />,
  },
];

const testimonials = [
  {
    text: "Before finding Sacco Financial, I was terrified of the stock market. Now my Roth IRA is fully funded and I actually understand what I'm buying.",
    name: "Sarah J.",
    handle: "@sarah_invests",
  },
  {
    text: "The market breakdowns have helped me refine my own strategy and stay disciplined in volatile markets.",
    name: "Marcus T.",
    handle: "@marcus_trades",
  },
  {
    text: "Clear, concise, and no BS. It's refreshing to find a finance creator who cares about education instead of hype.",
    name: "David L.",
    handle: "@david_builds",
  },
];

const socialIcons = [
  { name: "YouTube", href: LINKS.youtube, icon: <Youtube className="h-5 w-5" /> },
  { name: "X", href: LINKS.x, icon: <Twitter className="h-5 w-5" /> },
  { name: "Instagram", href: LINKS.instagram, icon: <Instagram className="h-5 w-5" /> },
  { name: "TikTok", href: LINKS.tiktok, icon: <PlaySquare className="h-5 w-5" /> },
];

function isExternalHref(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:");
}

function primaryButtonClassName() {
  return "inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/20 bg-[var(--hub-primary)] px-6 py-3 text-sm font-semibold text-[var(--hub-bg)] transition hover:brightness-110";
}

function secondaryButtonClassName() {
  return "inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10";
}

function offerCtaClassName(offer: { popular?: boolean; premium?: boolean }) {
  if (offer.popular || offer.premium) return primaryButtonClassName();
  return secondaryButtonClassName();
}

function cardClassName(extra = "") {
  return `rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.24)] ${extra}`;
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <h2 className="font-brand text-3xl tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 text-lg text-slate-300">{subtitle}</p>
    </div>
  );
}

export default function ReplitHomepage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowMobileCta(window.scrollY > 300);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--hub-bg)] text-white selection:bg-cyan-300/30 selection:text-white">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-white/10 bg-[rgba(6,11,20,0.82)] py-2 backdrop-blur-xl"
            : "bg-transparent py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex-shrink-0"
            aria-label="Scroll to top"
          >
            <Image
              src="/images/logo.png"
              alt="Sacco Financial"
              width={300}
              height={88}
              className="h-12 w-auto sm:h-14 md:h-20"
              priority
            />
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-semibold tracking-wide text-slate-300 transition hover:text-white"
              >
                {link.name}
              </button>
            ))}
          </nav>

          <a href="/link-tree" className={`${primaryButtonClassName()} hidden md:inline-flex`}>
            Open Link Tree
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-white/10 bg-[rgba(8,14,24,0.94)] px-4 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => scrollToSection(link.href)}
                  className="border-b border-white/10 py-2 text-left text-lg font-semibold text-white"
                >
                  {link.name}
                </button>
              ))}
              <a href="/link-tree" className={`${primaryButtonClassName()} mt-2 justify-center`}>
                Open the Link Tree
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="overflow-hidden">
        <section className="relative flex items-center justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-[-10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-cyan-300/5 blur-[100px]" />
          </div>

          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1.5 rounded-full bg-[linear-gradient(135deg,#4CE1E6,#0ea5e9)] opacity-60 blur-md" />
                <Image
                  src="/images/profile.jpg"
                  alt="Justin Sacco"
                  width={128}
                  height={128}
                  className="relative h-28 w-28 rounded-full border-2 border-cyan-300/30 object-cover shadow-2xl md:h-32 md:w-32"
                  style={{ objectPosition: "center top" }}
                />
              </div>
            </div>

            <div className="mb-7 flex flex-wrap justify-center gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 backdrop-blur-sm"
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-[var(--hub-primary)]" />
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="font-brand text-5xl leading-[1.05] tracking-tight text-white md:text-7xl">
              Master the Markets.
              <br />
              <span className="bg-[linear-gradient(135deg,#4CE1E6_0%,#c8fdff_100%)] bg-clip-text text-transparent">
                Build Real Wealth.
              </span>
            </h1>

            <p className="mx-auto mb-10 mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Helping everyday people understand the stock market, manage personal finances, and build
              long-term wealth through clear education.
            </p>

            <div className="flex w-full max-w-xl flex-col items-stretch justify-center gap-3 sm:mx-auto sm:max-w-2xl sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <a
                href={LINKS.freeGuide}
                target="_blank"
                rel="noopener noreferrer"
                className={`${primaryButtonClassName()} h-14 flex-1 px-8 text-base sm:min-w-[200px] sm:flex-none`}
              >
                Get the free guide
                <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
              </a>
              <a
                href={LINKS.financialBlueprint}
                className={`${primaryButtonClassName()} h-14 flex-1 px-8 text-base sm:min-w-[200px] sm:flex-none`}
              >
                Get the premium guide
                <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
              </a>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("#links")}
              className="mt-10 text-sm font-medium text-slate-400 underline-offset-4 transition hover:text-[var(--hub-primary)] hover:underline"
            >
              Or browse YouTube, TikTok, and more
            </button>

            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => scrollToSection("#links")}
                className="animate-bounce text-slate-400 transition hover:text-[var(--hub-primary)]"
                aria-label="Scroll to links"
              >
                <ChevronDown className="h-7 w-7" />
              </button>
            </div>
          </div>
        </section>

        <section id="links" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              title="Choose your path"
              subtitle="Start with the free guide, go deeper with the premium blueprint, or jump straight to the channels you already use."
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
              {pathCards.map((card) => {
                const ring =
                  card.variant === "free"
                    ? "ring-1 ring-cyan-300/25"
                    : card.variant === "premium"
                      ? "ring-1 ring-white/20"
                      : "";
                return (
                  <a
                    key={card.title}
                    href={card.href}
                    target={isExternalHref(card.href) ? "_blank" : undefined}
                    rel={isExternalHref(card.href) ? "noopener noreferrer" : undefined}
                    className="group block outline-none transition duration-300 hover:-translate-y-1"
                  >
                    <div className={cardClassName(`relative h-full overflow-hidden p-6 sm:p-7 ${ring}`)}>
                      {card.variant === "free" && (
                        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-cyan-300/20 blur-[50px]" />
                      )}
                      {card.variant === "premium" && (
                        <>
                          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-cyan-300/25 via-cyan-400/10 to-transparent blur-3xl" />
                          <div className="pointer-events-none absolute right-2 top-2 h-40 w-40 rounded-full bg-cyan-300/12 blur-[72px]" />
                        </>
                      )}
                      <div className="relative z-10 flex items-start justify-between gap-3">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 transition duration-300 group-hover:scale-110 group-hover:bg-cyan-300/10">
                          {card.icon}
                        </div>
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-400 shadow-[0_0_28px_rgba(76,225,230,0.12)] backdrop-blur-sm transition duration-300 group-hover:border-[var(--hub-primary)]/35 group-hover:bg-[var(--hub-primary)]/20 group-hover:text-[var(--hub-primary)]"
                          aria-hidden
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {card.variant === "free"
                          ? "Free"
                          : card.variant === "premium"
                            ? "Premium"
                            : "Channels"}
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-white transition group-hover:text-[var(--hub-primary)] sm:text-xl">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">{card.description}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            <p className="mt-14 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Social channels
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {socialChannelCards.map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block outline-none transition duration-300 hover:-translate-y-1"
                >
                  <div className={cardClassName("relative h-full overflow-hidden p-6 sm:p-7")}>
                    <div className="flex items-start justify-between">
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 transition duration-300 group-hover:scale-110 group-hover:bg-cyan-300/10">
                        {card.icon}
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition duration-300 group-hover:bg-[var(--hub-primary)] group-hover:text-[var(--hub-bg)]">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white transition group-hover:text-[var(--hub-primary)]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{card.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="border-y border-white/8 bg-white/[0.03] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-brand text-3xl tracking-tight text-white md:text-5xl">
                Who is <span className="text-[var(--hub-primary)]">Sacco Financial</span>?
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-300">
                <p>
                  I&apos;m a finance creator and investor focused on making the stock market accessible to
                  everyone. With a background across finance and software, I break down complex market
                  mechanics into practical frameworks.
                </p>
                <p>
                  My mission is to help people ignore the noise, understand risk, and build long-term
                  wealth through structured education and a real community.
                </p>
                <p>
                  Whether you&apos;re buying your first ETF or sharpening an active trading process, this
                  site is built to give you a clearer next step.
                </p>
              </div>
              <a
                href={LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={`${primaryButtonClassName()} mt-8`}
              >
                Watch My Content
              </a>
            </div>

            <div className="flex flex-col gap-6">
              <div className="relative mx-auto w-full max-w-xs lg:max-w-none">
                <div className="absolute -inset-1 rounded-[26px] bg-[linear-gradient(135deg,#4CE1E6,#0ea5e9)] opacity-30 blur-md" />
                <Image
                  src="/images/headshot.jpg"
                  alt="Justin Sacco headshot"
                  width={1200}
                  height={900}
                  className="relative w-full rounded-[24px] border border-white/10 object-cover shadow-2xl"
                  style={{ aspectRatio: "4 / 3", objectPosition: "center top" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className={cardClassName("p-5 text-center")}>
                    <div className="bg-[linear-gradient(135deg,#4CE1E6,#ffffff)] bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="resources" className="relative px-4 py-24 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute right-0 top-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-300/10 blur-[100px]" />
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="Resources built for you"
              subtitle="Free education, daily content on your favorite channel, or the full premium PDF when you want a complete system."
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <div
                  key={offer.title}
                  className={cardClassName(
                    `flex h-full flex-col p-8 ${
                      offer.popular ? "border-cyan-300/50 ring-1 ring-cyan-300/20" : ""
                    } ${offer.premium ? "border-white/15 ring-1 ring-white/10" : ""}`,
                  )}
                >
                  <div className="mb-6 flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        offer.popular || offer.premium
                          ? "bg-[var(--hub-primary)] text-[var(--hub-bg)]"
                          : "bg-white/8 text-slate-200"
                      }`}
                    >
                      {offer.badge}
                    </span>
                    {offer.popular && (
                      <span className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-[var(--hub-primary)]">
                        Start here
                      </span>
                    )}
                    {offer.premium && (
                      <span className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-[var(--hub-primary)]">
                        Dominate here
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white">{offer.title}</h3>
                  <p className="mb-8 mt-4 flex-grow leading-relaxed text-slate-300">{offer.description}</p>
                  <a
                    href={offer.href}
                    target={isExternalHref(offer.href) ? "_blank" : undefined}
                    rel={isExternalHref(offer.href) ? "noopener noreferrer" : undefined}
                    className={offerCtaClassName(offer)}
                  >
                    {offer.cta}
                    {(offer.popular || offer.premium) && (
                      <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="topics" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="What I Cover"
              subtitle="Deep dives into the mechanics of wealth creation."
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <div
                  key={topic.title}
                  className={`${cardClassName("h-full p-8 transition duration-300 hover:border-white/20 hover:bg-white/[0.08]")} group`}
                >
                  <div className="transition duration-300 group-hover:-translate-y-1">{topic.icon}</div>
                  <h3 className="text-xl font-bold text-white">{topic.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-white/[0.03] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="Don't Just Take My Word For It"
              subtitle="Join thousands of others who are taking control of their financial future."
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.handle} className={cardClassName("flex h-full flex-col justify-between p-8")}>
                  <div>
                    <div className="mb-6 flex gap-1">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <Star key={index} className="h-5 w-5 fill-[var(--hub-primary)] text-[var(--hub-primary)]" />
                      ))}
                    </div>
                    <p className="mb-8 text-lg italic leading-relaxed text-slate-300">
                      &quot;{testimonial.text}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-sm text-[var(--hub-primary)]">{testimonial.handle}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 border-t border-white/8 pt-10">
              <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                As Featured In
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-2xl font-bold text-white/55 md:gap-16">
                <span className="font-brand">Bloomberg</span>
                <span className="font-brand">Yahoo! Finance</span>
                <span className="font-brand">MarketWatch</span>
                <span className="font-brand">TechCrunch</span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className={cardClassName("relative overflow-hidden p-8 text-center md:p-16")}>
              <div className="absolute left-0 top-0 h-2 w-full bg-[linear-gradient(90deg,#4CE1E6,#67e8f9,#4CE1E6)]" />
              <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-cyan-300/20 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-[80px]" />

              <div className="relative z-10 mx-auto max-w-2xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-300/10">
                  <Mail className="h-8 w-8 text-[var(--hub-primary)]" />
                </div>
                <h2 className="font-brand text-3xl tracking-tight text-white md:text-5xl">
                  Free guide or full blueprint
                </h2>
                <p className="mb-10 mt-4 text-lg text-slate-300">
                  New here? Grab the free beginner PDF. Ready for a complete step-by-step financial system—including
                  cash flow, debt, emergency funding, and investing fundamentals—open the Financial Base Blueprint.
                </p>

                <div className="mx-auto flex max-w-md flex-col gap-3">
                  <a
                    href={LINKS.freeGuide}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${primaryButtonClassName()} flex h-14 w-full items-center justify-center px-8 text-base`}
                  >
                    Get the free guide
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                  <a
                    href={LINKS.financialBlueprint}
                    className={`${primaryButtonClassName()} flex h-14 w-full items-center justify-center px-8 text-base`}
                  >
                    Get the premium guide
                    <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 bg-[var(--hub-bg)] px-4 pb-24 pt-16 sm:px-6 md:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <Image
                src="/images/logo.png"
                alt="Sacco Financial"
                width={180}
                height={52}
                className="h-12 w-auto"
              />
              <p className="mt-4 max-w-md text-slate-300">
                Master the markets. Build real wealth. Sacco Financial helps everyday people approach
                investing with more structure and less noise.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {socialIcons.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={isExternalHref(social.href) ? "_blank" : undefined}
                    rel={isExternalHref(social.href) ? "noopener noreferrer" : undefined}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/6 text-slate-300 transition hover:bg-[var(--hub-primary)] hover:text-[var(--hub-bg)]"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
              <div className="space-y-3">
                <a href="#links" className="inline-flex items-center gap-1 text-slate-300 transition hover:text-[var(--hub-primary)]">
                  Choose your path
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                <a href={LINKS.financialBlueprint} className="inline-flex items-center gap-1 text-slate-300 transition hover:text-[var(--hub-primary)]">
                  Financial Base Blueprint
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                <a href="#about" className="inline-flex items-center gap-1 text-slate-300 transition hover:text-[var(--hub-primary)]">
                  About
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                <a href="/link-tree" className="inline-flex items-center gap-1 text-slate-300 transition hover:text-[var(--hub-primary)]">
                  Link hub
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Contact</h3>
              <a href={`mailto:${LINKS.email}`} className="text-slate-300 transition hover:text-[var(--hub-primary)]">
                {LINKS.email}
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 text-center text-sm text-slate-400 md:flex-row md:text-left">
            <p>© {new Date().getFullYear()} Sacco Financial. All rights reserved.</p>
            <p className="max-w-2xl text-xs">
              Disclaimer: Content on this site and across social channels is for educational purposes only
              and does not constitute financial, investment, or legal advice.
            </p>
          </div>
        </div>
      </footer>

      {showMobileCta && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[rgba(6,11,20,0.92)] p-3 backdrop-blur-xl md:hidden">
          <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
            <a
              href={LINKS.freeGuide}
              target="_blank"
              rel="noopener noreferrer"
              className={`${primaryButtonClassName()} flex h-12 items-center justify-center px-2 text-center text-xs font-semibold sm:text-sm`}
            >
              Free guide
            </a>
            <a
              href={LINKS.financialBlueprint}
              className={`${secondaryButtonClassName()} flex h-12 items-center justify-center px-2 text-center text-xs font-semibold sm:text-sm`}
            >
              Blueprint
            </a>
            <a
              href="/link-tree"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-2 text-center text-xs font-semibold text-white sm:text-sm"
            >
              All links
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
