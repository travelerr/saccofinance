import Link from "next/link";

export function BlueprintFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Sacco Financial ·{" "}
          <Link href="/" className="underline decoration-slate-300 underline-offset-2 hover:text-[var(--sf-navy)]">
            justinsacco.com
          </Link>
        </p>
        <p className="max-w-md text-xs leading-relaxed text-slate-500">
          Educational content only. Past performance does not guarantee future results.
        </p>
      </div>
    </footer>
  );
}
