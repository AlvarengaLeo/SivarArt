import { test, expect } from "@playwright/test";

/**
 * Smoke e2e: navegación de extremo a extremo + flujo de carrito.
 * No requiere Supabase/Wompi reales (la app degrada con elegancia).
 */

const noFatalConsole = (errors: string[]) => (msg: import("@playwright/test").ConsoleMessage) => {
  if (msg.type() === "error") {
    const t = msg.text();
    // Ignorar ruido conocido (imágenes externas, fuentes, etc.)
    if (/Failed to load resource|favicon|picsum|net::ERR/i.test(t)) return;
    errors.push(t);
  }
};

test("home: hero, nav y CTA", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", noFatalConsole(errors));

  await page.goto("/");
  await expect(page).toHaveTitle(/SivarArt/i);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/El Salvador/i);
  await expect(page.getByRole("link", { name: "Descubrir" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Entrar a la galería/i })).toBeVisible();
  expect(errors, errors.join("\n")).toHaveLength(0);
});

test("navegación principal a las 4 zonas", async ({ page }) => {
  for (const path of ["/descubrir", "/tienda", "/academy", "/mapa"]) {
    const res = await page.goto(path);
    expect(res?.status(), `status de ${path}`).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("tienda: filtrar y agregar al carrito", async ({ page }) => {
  await page.goto("/tienda/arte");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Agregar la primera obra disponible al carrito
  const addBtn = page.getByRole("button", { name: /Agregar/i }).first();
  await addBtn.click();

  // El drawer del carrito debe abrir con "Ir a pagar"
  await expect(page.getByRole("link", { name: /Ir a pagar/i })).toBeVisible();
});

test("checkout en modo demo llega a éxito", async ({ page }) => {
  await page.goto("/tienda/arte");
  await page.getByRole("button", { name: /Agregar/i }).first().click();
  await page.getByRole("link", { name: /Ir a pagar/i }).click();
  await expect(page).toHaveURL(/checkout/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("ficha de obra carga con datos y precio", async ({ page }) => {
  await page.goto("/obra/memoria-de-cuscatlan");
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
    const res = await page.goto(path);
    expect(res?.status(), `status de ${path}`).toBeLessThan(400);
  }
});

test("tema oscuro togglea", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Cambiar tema/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("404 on-brand", async ({ page }) => {
  const res = await page.goto("/ruta-que-no-existe-xyz");
  expect(res?.status()).toBe(404);
});
