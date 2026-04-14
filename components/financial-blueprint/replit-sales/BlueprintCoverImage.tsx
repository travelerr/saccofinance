import Image from "next/image";
import { COVER_IMAGE_PATH, PRODUCT_NAME } from "../config";

export function BlueprintCoverImage({ priority = false }: { priority?: boolean }) {
  if (!COVER_IMAGE_PATH) {
    return (
      <div
        className="flex aspect-[3/4] w-full max-w-[340px] flex-col justify-end rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center sm:max-w-[400px]"
        role="img"
        aria-label="Ebook cover placeholder"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">PDF cover</p>
        <p className="mt-2 font-display text-lg font-bold text-slate-600">{PRODUCT_NAME}</p>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center lg:justify-end">
      <div
        className="pointer-events-none absolute -bottom-2 -right-2 -z-10 h-[min(100%,480px)] w-[280px] max-w-[92%] rotate-[3deg] rounded-2xl bg-[var(--sf-teal)]/35 sm:w-[320px] lg:w-[360px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-1 -right-1 -z-10 h-[min(100%,480px)] w-[280px] max-w-[92%] rotate-[1.5deg] rounded-2xl bg-[var(--sf-navy)]/20 sm:w-[320px] lg:w-[360px]"
        aria-hidden
      />
      <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px]">
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--sf-teal)]/20 to-transparent blur-2xl" />
        <Image
          src={COVER_IMAGE_PATH}
          alt={`${PRODUCT_NAME} PDF cover`}
          width={680}
          height={880}
          className="relative h-auto w-full rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(7,21,37,0.45),-6px_6px_0_var(--sf-teal)]"
          priority={priority}
        />
      </div>
    </div>
  );
}
