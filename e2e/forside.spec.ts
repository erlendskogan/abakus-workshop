import { expect, test } from "@playwright/test";

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
});
