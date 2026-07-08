import { test, type Page } from "@playwright/test";

async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = window.innerHeight * 0.8;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        y += step;
        if (y >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 110);
    });
  });
  await page.waitForTimeout(400);
}

/** Capturas responsive para auditar mobile-first. */
const VIEWPORTS = [
  { name: "mobile", w: 390, h: 844 },
  { name: "tablet", w: 768, h: 1024 },
];
const PAGES: [string, string][] = [
  ["/", "home"],
  ["/tienda/arte", "tienda"],
  ["/descubrir", "descubrir"],
  ["/obra/memoria-de-cuscatlan", "obra"],
  ["/academy", "academy"],
  ["/mapa", "mapa"],
];

for (const vp of VIEWPORTS) {
  for (const [path, name] of PAGES) {
    test(`${vp.name} ${name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2600);
      await autoScroll(page);
      await page.screenshot({
        path: `tests/screenshots/resp-${vp.name}-${name}.png`,
        fullPage: true,
      });
    });
  }
}
