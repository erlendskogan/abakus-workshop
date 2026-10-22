import Link from "next/link";
import { Merke } from "@/components/ui/Merke";
import { ToppfeltRamme } from "@/components/ui/ToppfeltRamme";

type Side = "forside" | "annonser" | "ny-annonse";

export function Toppfelt({ aktiv = "forside" }: { aktiv?: Side }) {
  return (
    <ToppfeltRamme>
      <div className="mx-auto flex h-15 max-w-[1120px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="-ml-1 flex items-center gap-2 rounded-md px-1 text-[15px] font-semibold tracking-[-0.01em] text-tekst"
        >
          <Merke className="h-5 w-5" />
          FjøsFinn
        </Link>
        <nav aria-label="Hovedmeny" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/annonser"
            aria-current={aktiv === "annonser" ? "page" : undefined}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-tekst-svak transition-colors hover:text-tekst aria-[current=page]:text-tekst"
          >
            Annonser
          </Link>
          <Link
            href="/annonser/ny"
            aria-current={aktiv === "ny-annonse" ? "page" : undefined}
            className="rounded-full border border-lykt/30 bg-lykt/[0.08] px-3.5 py-1.5 text-sm font-medium text-lykt transition-colors hover:border-lykt/60 hover:bg-lykt/[0.14] aria-[current=page]:border-lykt/60"
          >
            Legg ut annonse
          </Link>
        </nav>
      </div>
    </ToppfeltRamme>
  );
}
