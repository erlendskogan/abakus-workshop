import Link from "next/link";

const steg = [
  {
    tittel: "Finn det du mangler",
    tekst: "Søk etter smør, ullsokker eller en høytjuge i nissestørrelse fra gårdene rundt deg.",
  },
  {
    tittel: "Legg ut det du ikke trenger",
    tekst: "Hundre år på samme låve gir mye rot. Skriv hva du har, og hva du vil ha i bytte.",
  },
  {
    tittel: "Møtes ved gjerdet",
    tekst: "Avtal byttet med nissen på nabogården, og gjør det samme natt. Ingen kråker involvert.",
  },
];

export default function Forside() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-20">
      <header className="flex items-center justify-between py-6">
        <span className="font-display text-xl font-semibold text-mane">FjøsFinn</span>
        <Link
          href="/annonser/ny"
          className="rounded-full border border-lykt/60 px-4 py-2 text-sm text-lykt transition hover:bg-lykt/10"
        >
          Legg ut annonse
        </Link>
      </header>

      <section className="relative grid gap-10 pt-10 pb-16 md:grid-cols-[1.4fr_1fr] md:items-center md:pt-20">
        <div>
          <p className="mb-4 text-sm tracking-widest text-lykt uppercase">Åpent om natten · stengt for mennesker</p>
          <h1 className="font-display text-6xl font-bold text-mane md:text-8xl">FjøsFinn</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-tekst md:text-xl">
            Markedsplassen for fjøsnisser. Bytt bort det som hoper seg opp på låven, og finn akkurat det du mangler,
            hos nissen på nabogården. Her finnes ingen penger, bare gode bytter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/annonser"
              className="rounded-full bg-lykt px-6 py-3 font-semibold text-natt shadow-[0_0_30px_-5px] shadow-lykt/60 transition hover:bg-mane"
            >
              Se annonsene
            </Link>
            <Link
              href="/annonser/ny"
              className="rounded-full border border-tekst-svak/40 px-6 py-3 font-semibold text-tekst transition hover:border-mane hover:text-mane"
            >
              Legg ut annonse
            </Link>
          </div>
        </div>

        <div aria-hidden className="relative mx-auto hidden aspect-square w-64 md:block">
          <div className="absolute inset-0 rounded-full bg-mane shadow-[0_0_120px_20px] shadow-mane/25" />
          <div className="absolute top-6 left-10 h-10 w-10 rounded-full bg-[#e4d7ae]" />
          <div className="absolute right-14 bottom-12 h-6 w-6 rounded-full bg-[#e4d7ae]" />
          <svg viewBox="0 0 120 110" className="absolute -bottom-6 -left-8 w-36 -rotate-12 drop-shadow-lg">
            <path d="M14 92 C 30 40, 60 10, 100 18 C 84 30, 78 50, 96 92 Z" fill="var(--lue)" />
            <circle cx="104" cy="20" r="10" fill="#fff" />
            <rect x="6" y="86" width="98" height="18" rx="9" fill="#fff" />
          </svg>
        </div>
      </section>

      <section aria-labelledby="slik-virker" className="border-t border-white/10 py-14">
        <h2 id="slik-virker" className="font-display text-3xl font-semibold text-mane">
          Slik virker FjøsFinn
        </h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {steg.map((s, i) => (
            <li key={s.tittel} className="rounded-2xl border border-white/10 bg-natt-lys/70 p-6">
              <span className="font-display text-3xl text-lykt">{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold text-tekst">{s.tittel}</h3>
              <p className="mt-2 leading-relaxed text-tekst-svak">{s.tekst}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="hvem" className="grid gap-8 border-t border-white/10 py-14 md:grid-cols-2">
        <div>
          <h2 id="hvem" className="font-display text-3xl font-semibold text-mane">
            Hvem er FjøsFinn for?
          </h2>
          <p className="mt-4 leading-relaxed text-tekst">
            For fjøsnisser på alle gårder i Norge, store som små. Du trenger ingen konto: skriv navnet ditt og gården
            din, så vet de andre nissene hvor de finner deg.
          </p>
          <p className="mt-4 leading-relaxed text-tekst-svak">
            Mennesker er ikke velkomne. Bønder som har glemt smørklatten i grøten, er spesielt ikke velkomne.
          </p>
        </div>
        <blockquote className="rounded-2xl border-l-4 border-lue bg-natt-lys/70 p-6 italic leading-relaxed text-tekst">
          «Bonden glemte smøret i grøten for tredje år på rad. På FjøsFinn fant jeg en smørklatt hos Tulla på Øvre Li
          samme natt. Kuene beholdt halene.»
          <footer className="mt-4 text-sm not-italic text-tekst-svak">Gulbrand, Nedre Haugen</footer>
        </blockquote>
      </section>

      <footer className="border-t border-white/10 pt-8 text-sm text-tekst-svak">
        FjøsFinn er bare åpent om natten, når menneskene sover. Ingen penger, ingen kråker.
      </footer>
    </main>
  );
}
