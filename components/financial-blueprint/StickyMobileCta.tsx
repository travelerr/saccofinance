"use client";

import { ORDER_PAGE_URL, PRODUCT_NAME, FOUNDING_PRICE } from "./config";

export function StickyMobileCta() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,45,74,0.12)] backdrop-blur-md md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-1">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-[var(--sf-navy)]">{PRODUCT_NAME}</p>
          <p className="text-sm font-bold text-slate-900">${FOUNDING_PRICE}</p>
        </div>
        <a
          href={ORDER_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-[var(--sf-navy)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0c2438]"
        >
          Get Access
        </a>
      </div>
    </div>
  );
}
