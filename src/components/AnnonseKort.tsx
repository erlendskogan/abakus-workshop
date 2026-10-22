import type { Annonse } from "@/lib/annonser";
import { Spotlight } from "@/components/ui/Spotlight";

const dato = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short" });
const ETT_DOGN = 24 * 60 * 60 * 1000;

export function AnnonseKort({ annonse, overskrift: Overskrift = "h2" }: { annonse: Annonse; overskrift?: "h2" | "h3" }) {
  const ny = Date.now() - annonse.opprettet.getTime() < 2 * ETT_DOGN;

  return (
    <Spotlight className="h-full rounded-xl border border-kant bg-white/[0.025] transition-colors duration-300 hover:border-kant-sterk">
      <article className="relative flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <Overskrift className="text-[17px] leading-snug font-semibold tracking-[-0.01em] text-tekst">
            {annonse.tittel}
          </Overskrift>
          {ny && (
            <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-lykt/25 px-2 py-0.5 font-mono text-[10px] tracking-[0.06em] text-lykt uppercase">
              <span aria-hidden className="h-1 w-1 rounded-full bg-lykt shadow-[0_0_6px_var(--lykt)]" />
              Ny
            </span>
          )}
        </div>
        <p className="mt-2 line-clamp-3 flex-1 text-[15px] leading-relaxed text-tekst-svak">{annonse.beskrivelse}</p>

        <p className="mt-5 flex items-baseline gap-2 rounded-lg border border-lykt/15 bg-lykt/[0.05] px-3 py-2 text-sm text-tekst">
          <span className="shrink-0 font-mono text-[11px] tracking-[0.06em] text-lykt uppercase">Byttes mot:</span>{" "}
          <span className="min-w-0 line-clamp-2">{annonse.byttesMot}</span>
        </p>

        <div className="mt-4 flex items-center gap-2.5 text-[13px] text-tekst-svakest">
          <span
            aria-hidden
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-kant-sterk bg-flate-2 text-[11px] font-semibold text-tekst-svak"
          >
            {annonse.nisse.trim().charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 truncate text-tekst-svak">
            {annonse.nisse} på {annonse.gard}
          </span>
          <span aria-hidden>·</span>
          <time className="shrink-0" dateTime={annonse.opprettet.toISOString()}>
            {dato.format(annonse.opprettet)}
          </time>
        </div>
      </article>
    </Spotlight>
  );
}
