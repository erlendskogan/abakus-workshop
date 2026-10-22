import Link from "next/link";
import { AnnonseKort } from "@/components/AnnonseKort";
import { nyesteAnnonser } from "@/lib/annonser";

export async function SisteAnnonser() {
  const annonser = await nyesteAnnonser(3);
  if (annonser.length === 0) return null;

  return (
    <section aria-labelledby="siste-annonser" className="border-t border-white/10 py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="siste-annonser" className="font-display text-3xl font-semibold text-mane">
          Siste annonser
        </h2>
        <Link href="/annonser" className="text-lykt underline-offset-4 hover:underline">
          Se alle annonsene →
        </Link>
      </div>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {annonser.map((a) => (
          <li key={a.id}>
            <AnnonseKort annonse={a} overskrift="h3" />
          </li>
        ))}
      </ul>
    </section>
  );
}
