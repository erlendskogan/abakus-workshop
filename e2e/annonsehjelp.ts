import type { Page } from "@playwright/test";
import { Client } from "pg";

process.loadEnvFile(".env.local");

export function unikTittel(navn: string) {
  return `${navn} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function leggUtAnnonse(page: Page, tittel: string) {
  await page.goto("/annonser/ny");
  await page.getByLabel("Tittel").fill(tittel);
  await page.getByLabel("Beskrivelse").fill("Skrevet av en e2e-test.");
  await page.getByLabel("Byttes mot").fill("Ingenting");
  await page.getByLabel("Navnet ditt").fill("Testnissen");
  await page.getByLabel("Gården din").fill("Testgården");
  await page.getByRole("button", { name: "Legg ut annonse" }).click();
}

// The site cannot delete an Annonse, so the tests clean up in the database.
export async function slettAnnonse(tittel: string) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query("DELETE FROM annonser WHERE tittel = $1", [tittel]);
  await client.end();
}
