import { devices, expect, test } from "@playwright/test";

const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch } = devices["iPhone 13"];
test.use({ viewport, userAgent, deviceScaleFactor, isMobile, hasTouch });

test.describe("på mobil", () => {
  for (const side of ["/", "/annonser", "/annonser/ny"]) {
    test(`${side} får plass i bredden`, async ({ page }) => {
      await page.goto(side);

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const forBred = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(forBred).toBe(false);
    });
  }
});
