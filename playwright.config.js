/* Testes de interface (Playwright): sobem o app com um banco novo em pasta temporária */
const os = require("os");
const path = require("path");
const { defineConfig, devices } = require("@playwright/test");

const PORT = Number(process.env.E2E_PORT) || 3210;
const DATABASE_FILE = path.join(os.tmpdir(), `jobs-calc-e2e-${Date.now()}.sqlite`);

module.exports = defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    /* Sem animação de entrada: o axe mede o contraste com a opacidade final */
    reducedMotion: "reduce",
    /* Fora do CI dá para apontar um Chromium já instalado (PW_CHROMIUM) */
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  projects: [
    { name: "claro", use: { ...devices["Desktop Chrome"], colorScheme: "light" } },
    { name: "escuro", use: { ...devices["Desktop Chrome"], colorScheme: "dark" } },
  ],
  webServer: {
    command: "node src/server.js",
    url: `http://localhost:${PORT}/health`,
    reuseExistingServer: false,
    env: { PORT: String(PORT), DATABASE_FILE },
  },
});
/* Fim de playwright.config.js */
