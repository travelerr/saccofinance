import { Play } from "lucide-react";
import { ORDER_PAGE_URL, PRODUCT_NAME, SALES_VIDEO_EMBED_URL } from "../config";
import { Container, PrimaryCta } from "../ui";

export function VideoSalesSection() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-14 sm:py-20">
      <Container>
        <p className="text-center font-display text-xl font-semibold text-[var(--sf-navy)] sm:text-2xl">
          Watch this quick breakdown before you buy
        </p>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-slate-600">
          A straight overview of what the blueprint covers and who it is for—no hype, just structure.
        </p>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[inset_0_2px_8px_rgba(15,45,74,0.06)]">
          <div className="relative aspect-video w-full">
            {SALES_VIDEO_EMBED_URL ? (
              <iframe
                src={SALES_VIDEO_EMBED_URL}
                title={`${PRODUCT_NAME} — overview video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full rounded-2xl border-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-100 to-slate-50 p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200/80 bg-white shadow-md">
                  <Play className="ml-1 h-7 w-7 text-[var(--sf-teal-ink)]" fill="currentColor" aria-hidden />
                </div>
                <p className="max-w-sm text-center text-sm font-medium text-slate-700">Video loading soon</p>
                <p className="max-w-md text-center text-xs leading-relaxed text-slate-500">
                  Short walkthrough of the blueprint—what you get, how it works, and whether it fits your
                  situation.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <PrimaryCta href={ORDER_PAGE_URL}>Continue to order</PrimaryCta>
        </div>
      </Container>
    </section>
  );
}
