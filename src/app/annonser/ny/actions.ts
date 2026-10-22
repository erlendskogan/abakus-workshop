"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { opprettAnnonse, type NyAnnonse } from "@/lib/annonser";
import { felter, type Felt } from "./felter";

export type Skjemastatus = {
  verdier: Partial<NyAnnonse>;
  mangler: Felt[];
};

export async function leggUtAnnonse(_forrige: Skjemastatus, data: FormData): Promise<Skjemastatus> {
  const verdier = Object.fromEntries(felter.map(({ navn }) => [navn, String(data.get(navn) ?? "").trim()])) as NyAnnonse;
  const mangler = felter.map(({ navn }) => navn).filter((navn) => verdier[navn] === "");
  if (mangler.length > 0) return { verdier, mangler };

  await opprettAnnonse(verdier);
  revalidatePath("/", "layout");
  redirect("/annonser");
}
