// Saves a full-page PNG of a URL, so that the agent can read the image.
// Usage: pnpm screenshot <url> <file> [--mobile]
import { chromium, devices } from "@playwright/test";

const [url, file, flag] = process.argv.slice(2);
if (!url || !file) {
  console.error("Usage: pnpm screenshot <url> <file> [--mobile]");
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext(
  flag === "--mobile" ? devices["iPhone 13"] : { viewport: { width: 1280, height: 800 } },
);
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
// Content fades in when it scrolls into view, so scroll through the page first.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
    window.scrollTo(0, y);
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  window.scrollTo(0, 0);
});
// Give the 3D hero scene time to load and render its first frames.
await page.waitForTimeout(2500);
await page.screenshot({ path: file, fullPage: true });
await browser.close();
console.log(`Saved ${file}`);
