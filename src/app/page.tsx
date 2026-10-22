import Link from "next/link";
import { GjerdeFigur, LyktFigur, SekkFigur } from "@/components/figurer";
import { HeroScene } from "@/components/hero";
import { Toppfelt } from "@/components/Toppfelt";
import { Bunnfelt } from "@/components/ui/Bunnfelt";
import { Inn } from "@/components/ui/Inn";
import { SisteAnnonser } from "./SisteAnnonser";

export const dynamic = "force-dynamic";

const steg = [
  {
    Figur: LyktFigur,
    tittel: "Finn det du mangler",
    tekst: "Søk etter smør, ullsokker eller en høytjuge i nissestørrelse fra gårdene rundt deg.",
  },
  {
    Figur: SekkFigur,
    tittel: "Legg ut det du ikke trenger",
    tekst: "Hundre år på samme låve gir mye rot. Skriv hva du har, og hva du vil ha i bytte.",
  },
  {
    Figur: GjerdeFigur,
    tittel: "Møtes ved gjerdet",
    tekst: "Avtal byttet med nissen på nabogården, og gjør det samme natt. Ingen kråker involvert.",
  },
];

const etikett = "font-mono text-xs tracking-[0.06em] text-tekst-svakest uppercase";
const h2 = "mt-2 text-[26px] font-[520] tracking-[-0.02em] text-tekst md:text-[32px]";

export default function Forside() {
  return (
    <>
      <Toppfelt />
      <main className="relative">
        {/* A faint lantern light behind the hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-15 -z-10 h-[720px] bg-[radial-gradient(60%_50%_at_70%_35%,rgb(245_184_74/0.07),transparent_70%),radial-gradient(40%_40%_at_15%_10%,rgb(60_207_158/0.04),transparent_70%)]"
        />

        <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
          <section className="grid items-center gap-6 pt-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-4 md:pt-12 md:pb-8">
            <div className="relative z-10 md:py-16">
              <Inn straks>
                <p className={`${etikett} inline-flex items-center gap-2 text-tekst-svak`}>
                  <span aria-hidden className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-lykt opacity-60 motion-reduce:hidden" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-lykt" />
                  </span>
                  Åpent om natten · stengt for mennesker
                </p>
              </Inn>
              <Inn straks forsinkelse={0.05}>
                <h1 className="mt-5 text-[36px] leading-[1.02] font-[540] tracking-[-0.03em] text-tekst md:text-[56px]">
                  FjøsFinn
                </h1>
              </Inn>
              <Inn straks forsinkelse={0.1}>
                <p className="mt-4 text-[20px] leading-snug font-[460] tracking-[-0.015em] text-tekst md:text-[24px]">
                  Markedsplassen for fjøsnisser,{" "}
                  <br className="hidden md:block" />
                  <span className="font-serif font-normal text-lykt italic">mens bonden sover</span>.
                </p>
                <p className="mt-4 max-w-[34rem] text-base leading-relaxed text-tekst-svak md:text-lg">
                  Bytt bort det som hoper seg opp på låven, og finn akkurat det du mangler hos nissen på nabogården.
                  Her finnes ingen penger, bare gode bytter.
                </p>
              </Inn>
              <Inn straks forsinkelse={0.15} className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/annonser"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-lykt px-5 text-sm font-medium text-bakgrunn shadow-[0_0_0_1px_rgb(245_184_74/0.4),0_8px_30px_-8px_var(--lykt)] transition hover:brightness-110"
                >
                  Se annonsene
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/annonser/ny"
                  className="inline-flex h-11 items-center rounded-full border border-kant-sterk bg-white/[0.03] px-5 text-sm font-medium text-tekst transition hover:border-white/25 hover:bg-white/[0.06]"
                >
                  Legg ut annonse
                </Link>
              </Inn>
            </div>

            <div className="relative -mx-4 h-[340px] sm:mx-0 md:h-[520px]">
              <HeroScene />
            </div>
          </section>

          <SisteAnnonser />

          <section aria-labelledby="slik-virker" className="border-t border-kant py-12 md:py-20">
            <Inn>
              <p className={etikett}>Tre steg</p>
              <h2 id="slik-virker" className={h2}>
                Slik virker FjøsFinn
              </h2>
            </Inn>
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {steg.map(({ Figur, tittel, tekst }, i) => (
                <li key={tittel} className="h-full">
                  <Inn className="h-full" forsinkelse={i * 0.06}>
                    <div className="group h-full rounded-xl border border-kant bg-white/[0.02] p-6 transition-colors duration-300 hover:border-kant-sterk">
                      <div className="flex items-start justify-between">
                        <Figur className="h-16 w-16" />
                        <span className="font-mono text-xs tracking-[0.06em] text-tekst-svakest">0{i + 1}</span>
                      </div>
                      <h3 className="mt-6 text-[17px] font-semibold tracking-[-0.01em] text-tekst">{tittel}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-tekst-svak">{tekst}</p>
                    </div>
                  </Inn>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="hvem"
            className="grid gap-10 border-t border-kant py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16 md:py-20"
          >
            <Inn>
              <p className={etikett}>For hvem</p>
              <h2 id="hvem" className={h2}>
                Hvem er FjøsFinn for?
              </h2>
              <p className="mt-5 max-w-[34rem] leading-relaxed text-tekst">
                For fjøsnisser på alle gårder i Norge, store som små. Du trenger bare navnet ditt og gården din, så vet
                de andre nissene hvor de finner deg.
              </p>
              <p className="mt-4 max-w-[34rem] leading-relaxed text-tekst-svak">
                Mennesker er ikke velkomne. Bønder som har glemt smørklatten i grøten, er spesielt ikke velkomne.
              </p>
            </Inn>
            <Inn forsinkelse={0.08} className="self-center">
              <figure className="relative overflow-hidden rounded-xl border border-kant bg-white/[0.02] p-6 md:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,var(--lykt-glod),transparent_70%)]"
                />
                <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 text-lykt/70" fill="currentColor">
                  <path d="M10 7H6.5A2.5 2.5 0 0 0 4 9.5V13a2 2 0 0 0 2 2h2.5v.5A2.5 2.5 0 0 1 6 18v2a4.5 4.5 0 0 0 4.5-4.5V7Zm10 0h-3.5A2.5 2.5 0 0 0 14 9.5V13a2 2 0 0 0 2 2h2.5v.5A2.5 2.5 0 0 1 16 18v2a4.5 4.5 0 0 0 4.5-4.5V7Z" />
                </svg>
                <blockquote className="relative mt-4 text-[17px] leading-relaxed tracking-[-0.005em] text-tekst">
                  «Bonden glemte smøret i grøten for tredje år på rad. På FjøsFinn fant jeg en smørklatt hos Tulla på
                  Øvre Li samme natt. Kuene beholdt halene.»
                </blockquote>
                <figcaption className="relative mt-6 flex items-center gap-3 text-sm">
                  <span
                    aria-hidden
                    className="grid h-8 w-8 place-items-center rounded-full border border-kant-sterk bg-flate-2 text-xs font-semibold text-tekst-svak"
                  >
                    G
                  </span>
                  <span>
                    <span className="block font-medium text-tekst">Gulbrand</span>
                    <span className="block text-tekst-svakest">Nedre Haugen</span>
                  </span>
                </figcaption>
              </figure>
            </Inn>
          </section>
        </div>
      </main>
      <Bunnfelt />
    </>
  );
}
