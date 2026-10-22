import type { Page } from "@playwright/test";
import { Client } from "pg";

process.loadEnvFile(".env.local");

export function unikTittel(navn: string) {
  return `${navn} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

type Skjemafelt = "Tittel" | "Beskrivelse" | "Byttes mot" | "Navnet ditt" | "Gården din";

// Fills in the form on /annonser/ny and posts it. A field set to null is left empty.
export async function leggUtAnnonse(page: Page, tittel: string, endringer: Partial<Record<Skjemafelt, string | null>> = {}) {
  const verdier: Record<Skjemafelt, string | null> = {
    Tittel: tittel,
    Beskrivelse: "Skrevet av en e2e-test.",
    "Byttes mot": "Ingenting",
    "Navnet ditt": "Testnissen",
    "Gården din": "Testgården",
    ...endringer,
  };
  await page.goto("/annonser/ny");
  for (const [etikett, verdi] of Object.entries(verdier)) {
    if (verdi !== null) await page.getByLabel(etikett).fill(verdi);
  }
  await page.getByRole("button", { name: "Legg ut annonse" }).click();
}

// The site cannot delete an Annonse, so the tests clean up in the database.
export async function slettAnnonse(tittel: string) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query("DELETE FROM annonser WHERE tittel = $1", [tittel]);
  await client.end();
}
