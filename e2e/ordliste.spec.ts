import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

// The words that GLOSSARY.md says to avoid, read from its "_Avoid_:" lines,
// so that a new word in the glossary is checked without a change here.
const unngaa = readFileSync("GLOSSARY.md", "utf8")
  .split("\n")
  .filter((linje) => linje.startsWith("_Avoid_:"))
  .flatMap((linje) => linje.replace("_Avoid_:", "").split(","))
  .map((ord) => ord.trim())
  .filter(Boolean);

const feilOrd = new RegExp(`(?<![\\p{L}\\p{N}])(${unngaa.join("|")})(?![\\p{L}\\p{N}])`, "giu");

// All text a Nisse can see or hear on the page: the body, the tab title,
// the description for search engines, placeholders and labels for screen readers.
async function tekstPaSiden(page: Page) {
  return page.evaluate(() => {
    const deler = [document.body.innerText, document.title];
    for (const el of document.querySelectorAll("meta[name=description], [placeholder], [aria-label], [title], img[alt]")) {
      for (const attr of ["content", "placeholder", "aria-label", "title", "alt"]) {
        const verdi = el.getAttribute(attr);
        if (verdi) deler.push(verdi);
      }
    }
    return deler.join("\n");
  });
}

function sjekkOrd(side: string, tekst: string) {
  const funnet = [...new Set([...tekst.matchAll(feilOrd)].map((m) => m[0]))];
  expect(funnet, `${side} bruker ord som GLOSSARY.md sier vi skal unngå`).toEqual([]);
}

test.describe("ordlisten", () => {
  test("GLOSSARY.md har ord som skal unngås", () => {
    expect(unngaa).toContain("konto");
  });

  test("ingen side bruker ord som skal unngås", async ({ page }) => {
    // Visit every page that the site links to, starting at the front page.
    const besokt = new Set<string>();
    const ko = ["/", "/annonser?q=smør", "/annonser?q=finnesikke"];
    while (ko.length > 0 && besokt.size < 50) {
      const side = ko.shift()!;
      if (besokt.has(side)) continue;
      besokt.add(side);

      await page.goto(side);
      sjekkOrd(side, await tekstPaSiden(page));

      const lenker = await page.locator("a[href^='/']").evaluateAll((a) => a.map((el) => el.getAttribute("href")!));
      ko.push(...lenker.filter((lenke) => !besokt.has(lenke)));
    }
    expect(besokt).toContain("/annonser/ny");
  });

  test("feilmeldingene i skjemaet bruker ikke ord som skal unngås", async ({ page }) => {
    await page.goto("/annonser/ny");
    await page.getByRole("button", { name: "Legg ut annonse" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Annonsen ble ikke lagt ut" })).toBeVisible();

    sjekkOrd("/annonser/ny med feil", await tekstPaSiden(page));
  });
});
