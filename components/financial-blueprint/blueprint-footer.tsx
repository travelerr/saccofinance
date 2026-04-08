import { PageContainer } from "./ui";

export function BlueprintFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-10">
      <PageContainer className="text-center">
        <p className="text-sm font-semibold text-[var(--sf-navy)]">Sacco Financial</p>
        <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-slate-500">
          Educational content only. Not personalized financial, investment, legal, or tax advice. Consult a
          qualified professional for advice specific to your situation.
        </p>
        <p className="mt-4 text-xs text-slate-400">© {new Date().getFullYear()} Sacco Financial</p>
      </PageContainer>
    </footer>
  );
}
