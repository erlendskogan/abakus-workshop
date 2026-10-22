import { expect, test } from "@playwright/test";

test.describe("søk i annonser", () => {
  test("et søk på smør viser smørklatten og skjuler de andre", async ({ page }) => {
    await page.goto("/annonser");
    await page.getByRole("searchbox", { name: "Søk i annonser" }).fill("smør");
    await page.getByRole("button", { name: "Søk" }).click();

    await expect(page).toHaveURL(/\/annonser\?q=sm%C3%B8r$/);
    await expect(page.getByRole("heading", { name: "Smørklatt fra julegrøten" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Høyball til vinteren" })).toBeHidden();
  });

  test("søket bryr seg ikke om store og små bokstaver", async ({ page }) => {
    await page.goto("/annonser?q=SMØR");

    await expect(page.getByRole("heading", { name: "Smørklatt fra julegrøten" })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Søk i annonser" })).toHaveValue("SMØR");
  });

  test("et søk uten treff sier fra", async ({ page }) => {
    await page.goto("/annonser?q=traktor");

    await expect(page.getByText("Ingen annonser med «traktor».")).toBeVisible();
    await expect(page.getByRole("listitem")).toHaveCount(0);
  });
});
