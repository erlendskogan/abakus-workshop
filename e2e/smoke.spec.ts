import { expect, test } from "@playwright/test";

test("the front page answers", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
});
