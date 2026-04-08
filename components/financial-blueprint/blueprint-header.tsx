import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "./ui";

/** Minimal header — logo + brand only */
export function BlueprintHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
      <PageContainer className="flex items-center justify-between py-3 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--sf-navy)] focus-visible:ring-offset-2"
        >
          <Image
            src="/images/logo.png"
            alt="Sacco Financial"
            width={36}
            height={36}
            className="h-8 w-8 rounded-lg object-contain sm:h-9 sm:w-9"
          />
          <span className="font-display text-sm font-bold tracking-tight text-[var(--sf-navy)] sm:text-base">
            Sacco Financial
          </span>
        </Link>
      </PageContainer>
    </header>
  );
}
