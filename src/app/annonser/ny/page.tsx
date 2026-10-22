import type { Metadata } from "next";
import Link from "next/link";
import { NyAnnonseSkjema } from "./NyAnnonseSkjema";

export const metadata: Metadata = {
  title: "Legg ut annonse – FjøsFinn",
};

export default function NyAnnonse() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-20">
      <header className="flex items-center justify-between py-6">
        <Link href="/" className="font-display text-xl font-semibold text-mane">
          FjøsFinn
        </Link>
        <Link href="/annonser" className="text-sm text-tekst-svak transition hover:text-mane">
          Se annonsene
        </Link>
      </header>

      <h1 className="pt-8 font-display text-4xl font-bold text-mane md:text-5xl">Legg ut annonse</h1>
      <p className="mt-3 text-tekst-svak">
        Skriv hva du vil bytte bort, og hva du vil ha igjen. Du trenger ingen konto, bare navnet ditt og gården din.
      </p>

      <NyAnnonseSkjema />
    </main>
  );
}
