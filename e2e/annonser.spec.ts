import { expect, test } from "@playwright/test";

test.describe("annonselisten", () => {
  test("viser smørklatten fra Tulla på Øvre Li", async ({ page }) => {
    await page.goto("/annonser");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Annonser");
    const annonse = page.getByRole("listitem").filter({ hasText: "Smørklatt fra julegrøten" });
    await expect(annonse).toContainText("Byttes mot: En varm lue");
    await expect(annonse).toContainText("Tulla på Øvre Li");
    await expect(annonse).toContainText(/smeltet i kanten/);
  });

  test("viser de nyeste annonsene først", async ({ page }) => {
    await page.goto("/annonser");

    const titler = page.getByRole("listitem").getByRole("heading", { level: 2 });
    const alle = await titler.allTextContents();
    expect(alle.indexOf("Smørklatt fra julegrøten")).toBeLessThan(alle.indexOf("Kattepels til å sove på"));
  });

  test("forsiden lenker til annonsene", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Se annonsene" }).click();

    await expect(page).toHaveURL(/\/annonser$/);
    await expect(page.getByText("Smørklatt fra julegrøten")).toBeVisible();
  });
});
