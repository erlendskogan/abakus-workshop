import type { Metadata } from "next";
import Link from "next/link";
import { nyesteAnnonser, sokAnnonser } from "@/lib/annonser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Annonser – FjøsFinn",
};

const dato = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long" });

export default async function Annonser({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const sok = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const annonser = sok ? await sokAnnonser(sok) : await nyesteAnnonser();

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20">
      <header className="flex items-center justify-between py-6">
        <Link href="/" className="font-display text-xl font-semibold text-mane">
          FjøsFinn
        </Link>
        <Link
          href="/annonser/ny"
          className="rounded-full border border-lykt/60 px-4 py-2 text-sm text-lykt transition hover:bg-lykt/10"
        >
          Legg ut annonse
        </Link>
      </header>

      <h1 className="pt-8 font-display text-4xl font-bold text-mane md:text-5xl">Annonser</h1>
      <p className="mt-3 text-tekst-svak">Det nissene på gårdene rundt deg vil bytte bort, nyeste først.</p>

      <form action="/annonser" role="search" className="mt-8 flex gap-3">
        <label htmlFor="sok" className="sr-only">
          Søk i annonser
        </label>
        <input
          id="sok"
          name="q"
          type="search"
          defaultValue={sok}
          placeholder="Søk etter smør, ull, lykt …"
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-natt-lys/70 px-5 py-3 text-tekst placeholder:text-tekst-svak/70 focus:border-lykt focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-lykt px-6 py-3 font-semibold text-natt transition hover:bg-mane"
        >
          Søk
        </button>
      </form>

      {sok && annonser.length > 0 && (
        <p className="mt-6 text-tekst-svak">
          {annonser.length === 1 ? "1 annonse" : `${annonser.length} annonser`} med «{sok}».{" "}
          <Link href="/annonser" className="text-lykt underline-offset-4 hover:underline">
            Vis alle
          </Link>
        </p>
      )}

      {annonser.length === 0 ? (
        sok ? (
          <p className="mt-10 text-tekst">
            Ingen annonser med «{sok}». Prøv et annet ord, eller{" "}
            <Link href="/annonser" className="text-lykt underline-offset-4 hover:underline">
              se alle annonsene
            </Link>
            .
          </p>
        ) : (
          <p className="mt-10 text-tekst">Ingen annonser ennå. Bli den første som legger ut noe!</p>
        )
      ) : (
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {annonser.map((a) => (
            <li key={a.id}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-natt-lys/70 p-6">
                <h2 className="font-display text-2xl font-semibold text-mane">{a.tittel}</h2>
                <p className="mt-3 flex-1 leading-relaxed text-tekst">{a.beskrivelse}</p>
                <p className="mt-4 text-lykt">
                  <span className="text-sm tracking-widest uppercase">Byttes mot:</span> {a.byttesMot}
                </p>
                <p className="mt-4 border-t border-white/10 pt-4 text-sm text-tekst-svak">
                  {a.nisse} på {a.gard} · <time dateTime={a.opprettet.toISOString()}>{dato.format(a.opprettet)}</time>
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
