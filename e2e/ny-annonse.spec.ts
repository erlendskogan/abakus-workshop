import { expect, test } from "@playwright/test";
import { leggUtAnnonse, slettAnnonse, unikTittel } from "./annonsehjelp";

test.describe("legg ut annonse", () => {
  const tittel = unikTittel("Høygaffel i nissestørrelse");

  test.afterAll(async () => {
    await slettAnnonse(tittel);
  });

  test("en utfylt annonse vises øverst i listen", async ({ page }) => {
    await leggUtAnnonse(page, tittel);

    await expect(page).toHaveURL(/\/annonser$/);
    const annonse = page.getByRole("listitem").filter({ hasText: tittel });
    await expect(annonse).toContainText("Byttes mot: Ingenting");
    await expect(annonse).toContainText("Testnissen på Testgården");
  });

  test("et skjema med manglende felt blir ikke lagt ut", async ({ page }) => {
    const uten = unikTittel("Uten byttes mot");
    await page.goto("/annonser/ny");
    await page.getByLabel("Tittel").fill(uten);
    await page.getByLabel("Beskrivelse").fill("Mangler felt.");
    await page.getByLabel("Navnet ditt").fill("Testnissen");
    await page.getByRole("button", { name: "Legg ut annonse" }).click();

    await expect(page.getByRole("alert").filter({ hasText: "Annonsen ble ikke lagt ut" })).toContainText(
      "Du må fylle ut: Byttes mot, Gården din.",
    );
    await expect(page.getByLabel("Byttes mot")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Tittel")).toHaveValue(uten);

    await page.goto(`/annonser?q=${encodeURIComponent(uten)}`);
    await expect(page.getByText(`Ingen annonser med «${uten}».`)).toBeVisible();
  });
});
