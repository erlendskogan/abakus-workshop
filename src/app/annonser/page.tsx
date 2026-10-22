import type { Metadata } from "next";
import Link from "next/link";
import { AnnonseKort } from "@/components/AnnonseKort";
import { TomtSokFigur } from "@/components/figurer";
import { Toppfelt } from "@/components/Toppfelt";
import { Bunnfelt } from "@/components/ui/Bunnfelt";
import { Inn } from "@/components/ui/Inn";
import { nyesteAnnonser, sokAnnonser } from "@/lib/annonser";

export const metadata: Metadata = {
  title: "Annonser – FjøsFinn",
};

const forslag = ["smør", "ull", "lykt", "høy"];
const lenke = "font-medium text-lykt underline decoration-lykt/30 underline-offset-4 transition-colors hover:decoration-lykt";

function antall(n: number) {
  return n === 1 ? "1 annonse" : `${n} annonser`;
}

export default async function Annonser({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q: sokeparameter } = await searchParams;
  const sok = (Array.isArray(sokeparameter) ? sokeparameter[0] : sokeparameter)?.trim() ?? "";
  const annonser = sok ? await sokAnnonser(sok) : await nyesteAnnonser();

  return (
    <>
      <Toppfelt aktiv="annonser" />
      <main className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <Inn straks className="pt-10 md:pt-16">
          <p className="font-mono text-xs tracking-[0.06em] text-tekst-svakest uppercase">Markedet</p>
          <h1 className="mt-2 text-[32px] leading-[1.05] font-[540] tracking-[-0.025em] text-tekst md:text-[40px]">
            Annonser
          </h1>
          <p className="mt-3 max-w-[34rem] text-tekst-svak">
            Det nissene på gårdene rundt deg vil bytte bort, nyeste først.
          </p>
        </Inn>

        <Inn straks forsinkelse={0.05}>
          <form action="/annonser" role="search" className="mt-8 max-w-2xl">
            <label htmlFor="sok" className="sr-only">
              Søk i annonser
            </label>
            <div className="group relative flex items-center rounded-xl border border-kant-sterk bg-flate shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset] transition focus-within:border-lykt/60 focus-within:shadow-[0_0_0_4px_var(--lykt-glod)]">
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="pointer-events-none absolute left-4 h-[18px] w-[18px] text-tekst-svakest transition-colors group-focus-within:text-lykt"
              >
                <circle cx="9" cy="9" r="5.5" />
                <path d="m13.2 13.2 3.3 3.3" strokeLinecap="round" />
              </svg>
              <input
                id="sok"
                name="q"
                type="search"
                defaultValue={sok}
                placeholder="Søk etter smør, ull, lykt …"
                className="h-12 min-w-0 flex-1 rounded-xl bg-transparent pr-2 pl-11 text-[15px] text-tekst placeholder:text-tekst-svakest focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="submit"
                className="mr-1.5 h-9 shrink-0 rounded-lg bg-lykt px-4 text-sm font-medium text-bakgrunn transition hover:brightness-110"
              >
                Søk
              </button>
            </div>
          </form>
        </Inn>

        {annonser.length > 0 && (
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-tekst-svak">
            {sok ? (
              <>
                <span>
                  {antall(annonser.length)} med <span className="text-tekst">«{sok}»</span>.
                </span>
                <Link href="/annonser" className={lenke}>
                  Vis alle
                </Link>
              </>
            ) : (
              <span>{antall(annonser.length)}, nyeste først</span>
            )}
          </p>
        )}

        {annonser.length === 0 ? (
          <Inn straks forsinkelse={0.1}>
            <div className="group mt-8 flex flex-col items-center rounded-xl border border-dashed border-kant-sterk px-6 py-14 text-center">
              <TomtSokFigur className="h-[120px] w-[120px]" />
              {sok ? (
                <>
                  <p className="mt-6 max-w-md text-tekst">
                    Ingen annonser med «{sok}». Prøv et annet ord, eller{" "}
                    <Link href="/annonser" className={lenke}>
                      se alle annonsene
                    </Link>
                    .
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {forslag.map((ord) => (
                      <Link
                        key={ord}
                        href={`/annonser?q=${encodeURIComponent(ord)}`}
                        className="rounded-full border border-kant-sterk px-3 py-1 text-[13px] text-tekst-svak transition-colors hover:border-lykt/50 hover:text-tekst"
                      >
                        {ord}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-6 max-w-md text-tekst">
                  Ingen annonser ennå. Bli den første som{" "}
                  <Link href="/annonser/ny" className={lenke}>
                    legger ut noe
                  </Link>
                  !
                </p>
              )}
            </div>
          </Inn>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {annonser.map((annonse, i) => (
              <li key={annonse.id}>
                <Inn className="h-full" straks forsinkelse={0.08 + Math.min(i, 8) * 0.04}>
                  <AnnonseKort annonse={annonse} />
                </Inn>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Bunnfelt />
    </>
  );
}
