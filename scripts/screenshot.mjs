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
await page.screenshot({ path: file, fullPage: true });
await browser.close();
console.log(`Saved ${file}`);
