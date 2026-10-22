import type { Metadata } from "next";
import Link from "next/link";
import { nyesteAnnonser } from "@/lib/annonser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Annonser – FjøsFinn",
};

const dato = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long" });

export default async function Annonser() {
  const annonser = await nyesteAnnonser();

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

      {annonser.length === 0 ? (
        <p className="mt-10 text-tekst">Ingen annonser ennå. Bli den første som legger ut noe!</p>
      ) : (
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
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
