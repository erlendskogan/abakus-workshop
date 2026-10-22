import { expect, test } from "@playwright/test";
import { leggUtAnnonse, slettAnnonse, unikTittel } from "./annonsehjelp";

test.describe("forsiden", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("viser navnet FjøsFinn", async ({ page }) => {
    await expect(page).toHaveTitle(/FjøsFinn/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("FjøsFinn");
  });

  test("forteller hva FjøsFinn gjør og hvem det er for", async ({ page }) => {
    await expect(page.getByText(/markedsplassen for fjøsnisser/i)).toBeVisible();
    await expect(page.getByText(/ingen penger/i).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /hvem er fjøsfinn for/i })).toBeVisible();
  });

  test("lenker til annonsene og til ny annonse", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Se annonsene" })).toHaveAttribute("href", "/annonser");
    await expect(page.getByRole("link", { name: "Legg ut annonse" }).first()).toHaveAttribute(
      "href",
      "/annonser/ny",
    );
  });

  test("viser de nyeste annonsene, med lenke til alle", async ({ page }) => {
    const tittel = unikTittel("Ullvott til venstre hånd");
    try {
      await leggUtAnnonse(page, tittel);

      // Other tests post Annonser at the same time, so compare with the list, and retry until both pages agree.
      await expect(async () => {
        await page.goto("/annonser");
        const nyeste = await page.getByRole("listitem").getByRole("heading", { level: 2 }).allTextContents();
        await page.goto("/");
        const siste = page.getByRole("region", { name: "Siste annonser" });
        await expect(siste.getByRole("heading", { level: 3 })).toHaveText(nyeste.slice(0, 3), { timeout: 1000 });
      }).toPass();
      await expect(page.getByRole("region", { name: "Siste annonser" }).getByRole("link", { name: /Se alle annonsene/ }))
        .toHaveAttribute("href", "/annonser");
    } finally {
      await slettAnnonse(tittel);
    }
  });
});
