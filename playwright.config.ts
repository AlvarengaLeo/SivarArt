import { defineConfig, devices } from "@playwright/test";

/**
 * Pruebas e2e de SivarArt. Levanta el dev server automáticamente.
 * Ejecutar: npm run test:e2e
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "./tests/.artifacts",
  use: {
    // Puerto 3210 dedicado a SivarArt: el 3000 lo ocupa otro proyecto (DataTouch).
    baseURL: "http://localhost:3210",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    viewport: { width: 1366, height: 900 },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // Producción en puerto propio (build precompilado, rápido y estable).
    command: "npm run start -- -p 3210",
    url: "http://localhost:3210",
    timeout: 120_000,
    reuseExistingServer: true,
    stdout: "ignore",
    stderr: "pipe",
  },
});
