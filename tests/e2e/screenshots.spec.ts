import { test, type Page } from "@playwright/test";

/** Desplaza toda la página en pasos para disparar los reveals (whileInView) y carga diferida. */
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
      }, 120);
    });
  });
  await page.waitForTimeout(500);
}

/** Captura pantallazos de las pantallas clave (light + dark) para revisión visual. */
const PAGES: [string, string][] = [
  ["/", "home"],
  ["/descubrir", "descubrir"],
  ["/descubrir/galeria", "galeria-3d"],
  ["/descubrir/filtro-ai", "filtro-ai"],
  ["/tienda/arte", "tienda-arte"],
  ["/obra/memoria-de-cuscatlan", "obra"],
  ["/academy", "academy"],
  ["/mapa", "mapa"],
  ["/hub", "hub"],
  ["/ingresar", "ingresar"],
];

for (const [path, name] of PAGES) {
  test(`screenshot ${name}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(2500); // dejar montar 3D / imágenes
    await autoScroll(page);
    await page.screenshot({
      path: `tests/screenshots/${name}.png`,
      fullPage: true,
    });
  });
}

test("screenshot home-dark", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Cambiar tema/i }).click();
  await page.waitForTimeout(1500);
  await autoScroll(page);
  await page.screenshot({ path: "tests/screenshots/home-dark.png", fullPage: true });
});
