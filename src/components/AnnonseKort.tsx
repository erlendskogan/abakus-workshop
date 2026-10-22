import type { Annonse } from "@/lib/annonser";

const dato = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long" });

export function AnnonseKort({ annonse, overskrift: Overskrift = "h2" }: { annonse: Annonse; overskrift?: "h2" | "h3" }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-natt-lys/70 p-6">
      <Overskrift className="font-display text-2xl font-semibold text-mane">{annonse.tittel}</Overskrift>
      <p className="mt-3 flex-1 leading-relaxed text-tekst">{annonse.beskrivelse}</p>
      <p className="mt-4 text-lykt">
        <span className="text-sm tracking-widest uppercase">Byttes mot:</span> {annonse.byttesMot}
      </p>
      <p className="mt-4 border-t border-white/10 pt-4 text-sm text-tekst-svak">
        {annonse.nisse} på {annonse.gard} · <time dateTime={annonse.opprettet.toISOString()}>{dato.format(annonse.opprettet)}</time>
      </p>
    </article>
  );
}
