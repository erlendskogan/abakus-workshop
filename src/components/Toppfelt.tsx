import Link from "next/link";

const lenker = {
  "ny-annonse": { href: "/annonser/ny", tekst: "Legg ut annonse" },
  annonser: { href: "/annonser", tekst: "Se annonsene" },
};

export function Toppfelt({ lenke }: { lenke: keyof typeof lenker }) {
  const { href, tekst } = lenker[lenke];
  return (
    <header className="flex items-center justify-between py-6">
      <Link href="/" className="font-display text-xl font-semibold text-mane">
        FjøsFinn
      </Link>
      <Link
        href={href}
        className="rounded-full border border-lykt/60 px-4 py-2 text-sm text-lykt transition hover:bg-lykt/10"
      >
        {tekst}
      </Link>
    </header>
  );
}
