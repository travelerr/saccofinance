import Image from "next/image";
import Link from "next/link";

export function BlueprintHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#fafbfc]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--sf-navy)]">
          <Image
            src="/images/logo.png"
            alt="Sacco Financial"
            width={40}
            height={40}
            className="h-9 w-9 rounded-lg object-contain sm:h-10 sm:w-10"
          />
          <span className="hidden font-semibold tracking-tight text-[var(--sf-navy)] sm:inline">
            Sacco Financial
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-slate-600 transition hover:text-[var(--sf-navy)]"
        >
          Home
        </Link>
      </div>
    </header>
  );
}
