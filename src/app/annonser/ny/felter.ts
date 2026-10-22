import type { NyAnnonse } from "@/lib/annonser";

export type Felt = keyof NyAnnonse;

// The fields of the form, in order. Both the form and the server action read this list.
export const felter: { navn: Felt; etikett: string; hjelp: string; lang?: boolean }[] = [
  { navn: "tittel", etikett: "Tittel", hjelp: "Hva vil du bytte bort?" },
  { navn: "beskrivelse", etikett: "Beskrivelse", hjelp: "Hvordan ser tingen ut, og er den hel?", lang: true },
  { navn: "byttesMot", etikett: "Byttes mot", hjelp: "Hva vil du ha igjen?" },
  { navn: "nisse", etikett: "Navnet ditt", hjelp: "Slik at de andre nissene vet hvem du er." },
  { navn: "gard", etikett: "Gården din", hjelp: "Slik at de andre nissene finner deg." },
];
