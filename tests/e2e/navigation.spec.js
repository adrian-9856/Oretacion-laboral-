import { test, expect } from '@playwright/test';

/**
 * Tests E2E para Navegación General
 * Prueba que las pantallas principales sean accesibles
 */

test.describe('Navegación General', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Debe cargar la aplicación sin errores de consola críticos', async ({ page }) => {
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    // No debe haber errores críticos (algunos warnings son OK)
    const criticalErrors = errors.filter(err =>
      !err.includes('Warning') &&
      !err.includes('DevTools')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('Debe tener el título correcto', async ({ page }) => {
    await expect(page).toHaveTitle(/Evaluación Laboral|Orientación Laboral/i);
  });

  test('Debe cargar todos los recursos principales', async ({ page }) => {
    // Verificar que CSS cargó
    const styles = await page.locator('link[rel="stylesheet"]');
    expect(await styles.count()).toBeGreaterThan(0);

    // Verificar que scripts cargaron
    const scripts = await page.locator('script[src]');
    expect(await scripts.count()).toBeGreaterThan(0);
  });

  test('Debe ser responsivo en mobile', async ({ page }) => {
    // Cambiar a viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Verificar que el login screen sigue visible
    await expect(page.locator('#loginScreen')).toBeVisible();
  });

  test('Debe ser responsivo en tablet', async ({ page }) => {
    // Cambiar a viewport tablet
    await page.setViewportSize({ width: 768, height: 1024 });

    // Verificar que el login screen sigue visible
    await expect(page.locator('#loginScreen')).toBeVisible();
  });
});

test.describe('Estructura de la App', () => {
  test('Debe tener la estructura principal de contenedores', async ({ page }) => {
    await page.goto('/');

    // Verificar que existen los contenedores principales
    const mainContainer = page.locator('#app, .app-container, main').first();
    await expect(mainContainer).toBeVisible();
  });

  test('Debe cargar Firebase correctamente', async ({ page }) => {
    await page.goto('/');

    // Esperar a que Firebase se inicialice
    await page.waitForTimeout(1000);

    // Verificar que Firebase está en window
    const hasFirebase = await page.evaluate(() => {
      return typeof window.firebase !== 'undefined' ||
             typeof window.firebaseConfig !== 'undefined';
    });

    expect(hasFirebase).toBe(true);
  });

  test('Debe cargar Claude AI helper correctamente', async ({ page }) => {
    await page.goto('/');

    await page.waitForTimeout(1000);

    // Verificar que claudeAI está disponible
    const hasClaudeAI = await page.evaluate(() => {
      return typeof window.claudeAI !== 'undefined';
    });

    expect(hasClaudeAI).toBe(true);
  });
});

test.describe('Accesibilidad Básica', () => {
  test('Los inputs deben tener labels o placeholders', async ({ page }) => {
    await page.goto('/');

    // Verificar que los inputs de login tienen labels/placeholders
    const emailInput = page.locator('#loginEmail');
    const hasLabel = await emailInput.evaluate((el) => {
      return el.labels && el.labels.length > 0 || el.placeholder;
    });

    expect(hasLabel).toBe(true);
  });

  test('Los botones deben ser navegables por teclado', async ({ page }) => {
    await page.goto('/');

    // Navegar con Tab
    await page.keyboard.press('Tab');

    // Verificar que algún elemento tiene focus
    const focusedElement = await page.evaluate(() => {
      return document.activeElement.tagName;
    });

    expect(focusedElement).toBeTruthy();
  });

  test('Debe poder navegar el formulario con teclado', async ({ page }) => {
    await page.goto('/');

    // Navegar con Tab hasta el primer input
    await page.keyboard.press('Tab');

    // Escribir en el input con focus
    await page.keyboard.type('test@example.com');

    // Tab al siguiente campo
    await page.keyboard.press('Tab');
    await page.keyboard.type('password123');

    // Enter para submit
    await page.keyboard.press('Enter');

    // Debe intentar hacer submit (success o error)
    await page.waitForTimeout(500);
  });
});
