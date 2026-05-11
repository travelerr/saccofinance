import Image from "next/image";
import { COVER_IMAGE_PATH, PRODUCT_NAME } from "../config";

export function BlueprintCoverImage({
  priority = false,
  variant = "default",
}: {
  priority?: boolean;
  /** Softer, smaller presentation for thank-you / secondary contexts. */
  variant?: "default" | "secondary";
}) {
  const secondary = variant === "secondary";

  if (!COVER_IMAGE_PATH) {
    return (
      <div
        className={`flex aspect-[3/4] w-full flex-col justify-end rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center ${
          secondary ? "max-w-[150px] sm:max-w-[170px] lg:max-w-[190px]" : "max-w-[340px] sm:max-w-[400px]"
        }`}
        role="img"
        aria-label="Ebook cover placeholder"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">PDF cover</p>
        <p className="mt-2 font-display text-lg font-bold text-slate-600">{PRODUCT_NAME}</p>
      </div>
    );
  }

  const innerMax = secondary
    ? "max-w-[150px] sm:max-w-[170px] lg:max-w-[190px]"
    : "max-w-[320px] sm:max-w-[380px] lg:max-w-[420px]";

  const imageClass = secondary
    ? "relative h-auto w-full rounded-xl border border-white/10 shadow-md shadow-black/20"
    : "relative h-auto w-full rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(7,21,37,0.45),-6px_6px_0_var(--sf-teal)]";

  return (
    <div className={`relative flex ${secondary ? "justify-center" : "justify-center lg:justify-end"}`}>
      {!secondary ? (
        <>
          <div
            className="pointer-events-none absolute -bottom-2 -right-2 -z-10 h-[min(100%,480px)] w-[280px] max-w-[92%] rotate-[3deg] rounded-2xl bg-[var(--sf-teal)]/35 sm:w-[320px] lg:w-[360px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-1 -right-1 -z-10 h-[min(100%,480px)] w-[280px] max-w-[92%] rotate-[1.5deg] rounded-2xl bg-[var(--sf-navy)]/20 sm:w-[320px] lg:w-[360px]"
            aria-hidden
          />
        </>
      ) : null}
      <div className={`relative w-full ${innerMax}`}>
        {!secondary ? (
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--sf-teal)]/20 to-transparent blur-2xl" />
        ) : null}
        <Image
          src={COVER_IMAGE_PATH}
          alt={`${PRODUCT_NAME} — paid educational product (not the free investing PDF)`}
          width={680}
          height={880}
          className={imageClass}
          priority={priority}
        />
      </div>
    </div>
  );
}
