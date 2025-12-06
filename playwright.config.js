import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para Tests E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Ejecutar tests en paralelo
  fullyParallel: true,

  // Fallar la build si dejaste test.only
  forbidOnly: !!process.env.CI,

  // Reintentos en CI
  retries: process.env.CI ? 2 : 0,

  // Número de workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: 'html',

  // Configuración compartida para todos los proyectos
  use: {
    // URL base para usar en los tests (ej: page.goto('/'))
    baseURL: 'http://localhost:8888',

    // Recoger trazas en el primer reintento de un test fallido
    trace: 'on-first-retry',

    // Screenshot en failure
    screenshot: 'only-on-failure',

    // Video en failure
    video: 'retain-on-failure',
  },

  // Configurar proyectos para diferentes navegadores
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Tests en mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Ejecutar servidor local antes de comenzar los tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8888',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
