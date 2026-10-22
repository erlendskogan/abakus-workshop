"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { opprettAnnonse, type NyAnnonse } from "@/lib/annonser";

export type Felt = keyof NyAnnonse;

export type Skjemastatus = {
  verdier: Partial<NyAnnonse>;
  mangler: Felt[];
};

const felter: Felt[] = ["tittel", "beskrivelse", "byttesMot", "nisse", "gard"];

export async function leggUtAnnonse(_forrige: Skjemastatus, data: FormData): Promise<Skjemastatus> {
  const verdier = Object.fromEntries(felter.map((f) => [f, String(data.get(f) ?? "").trim()])) as NyAnnonse;
  const mangler = felter.filter((f) => verdier[f] === "");
  if (mangler.length > 0) return { verdier, mangler };

  await opprettAnnonse(verdier);
  revalidatePath("/", "layout");
  redirect("/annonser");
}
