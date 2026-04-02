import { ANCHOR_PRICE, FOUNDING_PRICE, ORDER_PAGE_URL, PRODUCT_NAME } from "../config";
import { Container, PrimaryCta } from "../ui";

const bullets = ["Instant access after checkout", "Downloadable PDF", "Lifetime access to this edition"];

export function PricingSection() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white to-[#f4f7f9] p-8 shadow-[0_24px_60px_-20px_rgba(15,45,74,0.12)] sm:p-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {PRODUCT_NAME}
          </p>
          <h2 className="mt-3 text-center font-display text-2xl font-bold text-[var(--sf-navy)] sm:text-3xl">
            Founding price
          </h2>
          <div className="mt-8 flex flex-col items-center gap-1">
            <p className="text-sm text-slate-500">
              <span className="line-through">Regularly ${ANCHOR_PRICE}</span>
            </p>
            <p className="font-display text-5xl font-bold tracking-tight text-[var(--sf-navy)] sm:text-6xl">
              ${FOUNDING_PRICE}
            </p>
            <p className="text-sm text-slate-600">One-time purchase · Digital PDF</p>
          </div>
          <ul className="mt-8 space-y-3 border-t border-slate-200/90 pt-8">
            {bullets.map((b) => (
              <li key={b} className="flex items-center justify-center gap-2 text-sm text-slate-700">
                <span className="h-1 w-1 rounded-full bg-[var(--sf-teal)]" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <PrimaryCta href={ORDER_PAGE_URL} className="w-full sm:w-auto">
              Get instant access
            </PrimaryCta>
          </div>
          <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
            You will receive a download link immediately after purchase. No subscription required for this
            product.
          </p>
        </div>
      </Container>
    </section>
  );
}
