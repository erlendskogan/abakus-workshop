import type { Metadata } from "next";
import { Toppfelt } from "@/components/Toppfelt";
import { Bunnfelt } from "@/components/ui/Bunnfelt";
import { Inn } from "@/components/ui/Inn";
import { NyAnnonseSkjema } from "./NyAnnonseSkjema";

export const metadata: Metadata = {
  title: "Legg ut annonse – FjøsFinn",
};

const slikBlirDetBytte = [
  { tittel: "Du legger ut annonsen", tekst: "Den vises øverst i listen med en gang, for alle nissene." },
  { tittel: "En nisse finner deg", tekst: "Navnet ditt og gården din er nok til at de vet hvor du bor." },
  { tittel: "Dere møtes ved gjerdet", tekst: "Dere avtaler byttet selv, en natt det passer. Ingen penger." },
];

export default function NyAnnonse() {
  return (
    <>
      <Toppfelt aktiv="ny-annonse" />
      <main className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <Inn straks className="pt-10 md:pt-16">
          <p className="font-mono text-xs tracking-[0.06em] text-tekst-svakest uppercase">Ny annonse</p>
          <h1 className="mt-2 text-[32px] leading-[1.05] font-[540] tracking-[-0.025em] text-tekst md:text-[40px]">
            Legg ut annonse
          </h1>
          <p className="mt-3 max-w-[34rem] text-tekst-svak">
            Skriv hva du vil bytte bort, og hva du vil ha igjen. Du trenger bare navnet ditt og gården din.
          </p>
        </Inn>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <Inn straks forsinkelse={0.05}>
            <NyAnnonseSkjema />
          </Inn>

          <Inn straks forsinkelse={0.1}>
            <aside aria-labelledby="slik-bytte" className="rounded-xl border border-kant bg-white/[0.015] p-6 lg:sticky lg:top-24">
              <h2 id="slik-bytte" className="text-[15px] font-semibold tracking-[-0.01em] text-tekst">
                Slik blir det et bytte
              </h2>
              <ol className="mt-5 grid gap-5">
                {slikBlirDetBytte.map((s, i) => (
                  <li key={s.tittel} className="grid grid-cols-[24px_1fr] gap-3">
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-kant-sterk font-mono text-[11px] text-tekst-svak">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-tekst">{s.tittel}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-tekst-svak">{s.tekst}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          </Inn>
        </div>
      </main>
      <Bunnfelt />
    </>
  );
}
