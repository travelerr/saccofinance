import { SALES_VIDEO_EMBED_URL } from "../config";
import { PageContainer } from "../ui";

export function ReplitVideoSection() {
  if (!SALES_VIDEO_EMBED_URL) {
    return (
      <section className="border-b border-slate-200/80 bg-white py-12 md:py-16">
        <PageContainer>
          <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-500">Add your embed URL in config to show the sales video.</p>
          </div>
        </PageContainer>
      </section>
    );
  }

  return (
    <section className="border-b border-slate-200/80 bg-white py-12 md:py-16">
      <PageContainer>
        <p className="mb-4 text-center font-display text-sm font-semibold text-[var(--sf-navy)] md:text-base">
          Watch: How This System Changes Your Financial Life
        </p>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner shadow-slate-900/5">
          <div className="relative aspect-video w-full bg-slate-900/5">
            <iframe
              src={SALES_VIDEO_EMBED_URL}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
