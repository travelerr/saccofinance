import Image from "next/image";
import Link from "next/link";
import { OUTLET_LOGOS } from "@/lib/media";

export type OutletName = keyof typeof OUTLET_LOGOS;

type OutletLogosProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  linkToMedia?: boolean;
  /** Full-width light panel — hero sections */
  panel?: boolean;
  /** Individual light badges per logo — cards */
  badge?: boolean;
};

const LOGO_DIMENSIONS = {
  cnbc: { width: 1000, height: 320 },
  tastylive: { width: 987, height: 212 },
} as const;

const sizeClasses = {
  sm: { cnbc: "h-7 w-auto md:h-8", tastylive: "h-5 w-auto md:h-6" },
  md: { cnbc: "h-9 w-auto md:h-10", tastylive: "h-6 w-auto md:h-7" },
  lg: { cnbc: "h-11 w-auto md:h-14", tastylive: "h-8 w-auto md:h-10" },
};

export const outletLogoPanelClassName =
  "rounded-2xl border border-white/10 bg-slate-100 px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:px-10 sm:py-9";

export const outletLogoBadgeClassName =
  "inline-flex items-center rounded-xl bg-slate-100 px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.18)] sm:px-4 sm:py-2.5";

function LogoImage({
  outlet,
  size,
}: {
  outlet: OutletName;
  size: "sm" | "md" | "lg";
}) {
  const dimensions = LOGO_DIMENSIONS[outlet];
  const label = outlet === "cnbc" ? "CNBC" : "tastylive";

  return (
    <Image
      src={OUTLET_LOGOS[outlet]}
      alt={label}
      width={dimensions.width}
      height={dimensions.height}
      className={`${sizeClasses[size][outlet]} object-contain transition hover:opacity-95`}
    />
  );
}

export function OutletLogo({
  outlet,
  size = "md",
  badge = false,
  className = "",
}: {
  outlet: OutletName;
  size?: "sm" | "md" | "lg";
  badge?: boolean;
  className?: string;
}) {
  const image = <LogoImage outlet={outlet} size={size} />;

  if (badge) {
    return <div className={`${outletLogoBadgeClassName} ${className}`}>{image}</div>;
  }

  return <span className={className}>{image}</span>;
}

export function OutletLogos({
  size = "md",
  className = "",
  linkToMedia = false,
  panel = false,
  badge = false,
}: OutletLogosProps) {
  const logos = (
    <div className={`flex flex-wrap items-center justify-center gap-8 sm:gap-12 ${className}`}>
      {badge ? (
        <>
          <OutletLogo outlet="cnbc" size={size} badge />
          <OutletLogo outlet="tastylive" size={size} badge />
        </>
      ) : (
        <>
          <LogoImage outlet="cnbc" size={size} />
          <LogoImage outlet="tastylive" size={size} />
        </>
      )}
    </div>
  );

  const content = panel ? <div className={outletLogoPanelClassName}>{logos}</div> : logos;

  if (linkToMedia) {
    return (
      <Link
        href="/media"
        className="inline-block rounded-sm outline-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hub-primary)]"
        aria-label="View media coverage featuring Justin Sacco on CNBC and tastylive"
      >
        {content}
      </Link>
    );
  }

  return content;
}
