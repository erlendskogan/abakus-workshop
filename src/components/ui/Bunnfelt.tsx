import Link from "next/link";
import { Merke } from "./Merke";

export function Bunnfelt() {
  return (
    <footer className="mt-16 border-t md:mt-24 border-kant">
      <div className="mx-auto grid max-w-[1120px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-tekst">
            <Merke className="h-5 w-5" />
            FjøsFinn
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-tekst-svak">
            FjøsFinn er bare åpent om natten, når menneskene sover. Ingen penger, ingen kråker.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <nav aria-label="Bunnmeny" className="flex gap-5 text-sm text-tekst-svak">
            <Link href="/" className="transition-colors hover:text-tekst">
              Forsiden
            </Link>
            <Link href="/annonser" className="transition-colors hover:text-tekst">
              Annonser
            </Link>
            <Link href="/annonser/ny" className="transition-colors hover:text-tekst">
              Ny annonse
            </Link>
          </nav>
          <p className="font-mono text-[11px] tracking-[0.06em] text-tekst-svakest uppercase">
            Åpent fra skumring til hanegal
          </p>
        </div>
      </div>
    </footer>
  );
}
