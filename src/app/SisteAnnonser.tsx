import Link from "next/link";
import { AnnonseKort } from "@/components/AnnonseKort";
import { Inn } from "@/components/ui/Inn";
import { nyesteAnnonser } from "@/lib/annonser";

export async function SisteAnnonser() {
  const annonser = await nyesteAnnonser(3);
  if (annonser.length === 0) return null;

  return (
    <section aria-labelledby="siste-annonser" className="pt-8 pb-12 md:pt-6 md:pb-20">
      <Inn className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="font-mono text-xs tracking-[0.06em] text-tekst-svakest uppercase">Nytt på låvene</p>
          <h2
            id="siste-annonser"
            className="mt-2 text-[26px] font-[520] tracking-[-0.02em] text-tekst md:text-[32px]"
          >
            Siste annonser
          </h2>
        </div>
        <Link
          href="/annonser"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-tekst-svak transition-colors hover:text-tekst"
        >
          Se alle annonsene
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </Inn>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {annonser.map((a, i) => (
          <li key={a.id} className={i === 2 ? "sm:max-lg:hidden" : undefined}>
            <Inn className="h-full" forsinkelse={i * 0.06}>
              <AnnonseKort annonse={a} overskrift="h3" />
            </Inn>
          </li>
        ))}
      </ul>
    </section>
  );
}
