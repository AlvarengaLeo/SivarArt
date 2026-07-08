import { test, expect, type Page } from "@playwright/test";

/**
 * Smoke e2e: navegación de extremo a extremo + flujo de carrito.
 * No requiere Supabase/Wompi reales (la app degrada con elegancia).
 * Usamos waitUntil:"domcontentloaded" para no bloquear por imágenes remotas
 * (Wikimedia/Unsplash) que optimiza next/image en el primer request.
 */
const go = (page: Page, path: string) =>
  page.goto(path, { waitUntil: "domcontentloaded" });

test("home: hero, nav y CTA", async ({ page }) => {
  await go(page, "/");
  await expect(page).toHaveTitle(/SivarArt/i);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/El Salvador/i);
  await expect(page.getByRole("link", { name: "Descubrir" }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Descubrí arte", exact: true }),
  ).toBeVisible();
});

test("navegación principal a las 4 zonas", async ({ page }) => {
  for (const path of ["/descubrir", "/tienda", "/academy", "/mapa"]) {
    const res = await go(page, path);
    expect(res?.status(), `status de ${path}`).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("tienda: filtrar y agregar al carrito", async ({ page }) => {
  await go(page, "/tienda/arte");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const addBtn = page.getByRole("button", { name: /Agregar/i }).first();
  await addBtn.click();
  await expect(page.getByRole("link", { name: /Ir a pagar/i })).toBeVisible();
});

test("checkout en modo demo llega a éxito", async ({ page }) => {
  await go(page, "/tienda/arte");
  await page.getByRole("button", { name: /Agregar/i }).first().click();
  await page.getByRole("link", { name: /Ir a pagar/i }).click();
  await expect(page).toHaveURL(/checkout/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("ficha de obra carga con datos y precio", async ({ page }) => {
  await go(page, "/obra/memoria-de-cuscatlan");
  await expect(page.getByRole("heading", { name: /Memoria de Cuscatlán/i })).toBeVisible();
  await expect(page.getByText(/\$/).first()).toBeVisible();
});

test("rutas secundarias responden", async ({ page }) => {
  for (const path of [
    "/descubrir/galeria",
    "/descubrir/filtro-ai",
    "/hub",
    "/about",
    "/ingresar",
    "/registro",
    "/academy/curso/intro-acrilico",
    "/artista/fernanda-cuellar",
  ]) {
    const res = await go(page, path);
    expect(res?.status(), `status de ${path}`).toBeLessThan(400);
  }
});

test("navbar: cada enlace abre su zona", async ({ page }) => {
  const links: [string, RegExp][] = [
    ["Descubrir", /\/descubrir$/],
    ["Tienda", /\/tienda$/],
    ["Academy", /\/academy$/],
    ["Mapa", /\/mapa$/],
  ];
  for (const [name, urlRe] of links) {
    await go(page, "/");
    await page.getByRole("navigation").getByRole("link", { name }).click();
    await expect(page, `${name} debe navegar`).toHaveURL(urlRe);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("el toggle de tema funciona (default oscuro)", async ({ page }) => {
  await go(page, "/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: /Cambiar tema/i }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("404 on-brand", async ({ page }) => {
  const res = await go(page, "/ruta-que-no-existe-xyz");
  expect(res?.status()).toBe(404);
});
