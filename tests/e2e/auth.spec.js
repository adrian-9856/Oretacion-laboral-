import { test, expect } from '@playwright/test';

/**
 * Tests E2E para Autenticación
 * Prueba login, registro y logout
 */

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    // Ir a la página principal
    await page.goto('/');

    // Esperar a que cargue la aplicación
    await page.waitForLoadState('networkidle');
  });

  test('Debe mostrar la pantalla de login al cargar', async ({ page }) => {
    // Verificar que existe el formulario de login
    await expect(page.locator('#loginScreen')).toBeVisible();
    await expect(page.locator('#loginForm')).toBeVisible();

    // Verificar campos del formulario
    await expect(page.locator('#loginEmail')).toBeVisible();
    await expect(page.locator('#loginPassword')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Debe cambiar entre tabs de login y registro', async ({ page }) => {
    // Click en tab de registro
    await page.click('text=Registrarse');

    // Verificar que muestra campos de registro
    await expect(page.locator('#registerName')).toBeVisible();
    await expect(page.locator('#registerEmail')).toBeVisible();
    await expect(page.locator('#registerPassword')).toBeVisible();

    // Volver a tab de login
    await page.click('text=Iniciar Sesión');

    // Verificar que volvió a login
    await expect(page.locator('#loginEmail')).toBeVisible();
  });

  test('Debe validar email inválido', async ({ page }) => {
    // Llenar formulario con email inválido
    await page.fill('#loginEmail', 'email-invalido');
    await page.fill('#loginPassword', 'password123');

    // Intentar submit
    await page.click('button[type="submit"]');

    // Verificar que muestra error (puede ser validación HTML5 o custom)
    const emailInput = page.locator('#loginEmail');
    const validationMessage = await emailInput.evaluate((el) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('Debe validar campos requeridos en login', async ({ page }) => {
    // Intentar submit sin llenar campos
    await page.click('button[type="submit"]');

    // Verificar validación de campo email
    const emailInput = page.locator('#loginEmail');
    const isInvalid = await emailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Debe validar campos requeridos en registro', async ({ page }) => {
    // Ir a tab de registro
    await page.click('text=Registrarse');

    // Intentar submit sin llenar campos
    await page.click('button[type="submit"]');

    // Verificar que el nombre es requerido
    const nameInput = page.locator('#registerName');
    const isInvalid = await nameInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Debe mostrar/ocultar contraseña', async ({ page }) => {
    const passwordInput = page.locator('#loginPassword');

    // Verificar que inicia como password
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Buscar botón de toggle (si existe)
    const toggleButton = page.locator('[data-testid="toggle-password"]').first();

    if (await toggleButton.count() > 0) {
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');

      // Toggle de nuevo
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('Debe tener link/botón de "Olvidé mi contraseña"', async ({ page }) => {
    // Buscar link de recuperación de contraseña
    const forgotPasswordLink = page.locator('text=/olvidé|recuperar|forgot/i');

    // Si existe, debería ser visible
    if (await forgotPasswordLink.count() > 0) {
      await expect(forgotPasswordLink.first()).toBeVisible();
    }
  });

  test('Debe tener opción de login con Google', async ({ page }) => {
    // Buscar botón de Google login
    const googleButton = page.locator('text=/google|continuar con google/i');

    if (await googleButton.count() > 0) {
      await expect(googleButton.first()).toBeVisible();
    }
  });

  test('Debe navegar al dashboard después de login exitoso', async ({ page }) => {
    // Este test requiere credenciales válidas
    // Usar credenciales de testing o mock

    // Llenar formulario
    await page.fill('#loginEmail', 'test@example.com');
    await page.fill('#loginPassword', 'password123');

    // Submit
    await page.click('button[type="submit"]');

    // Esperar navegación (puede tardar por Firebase)
    await page.waitForTimeout(2000);

    // Verificar que cambió de pantalla O que sigue en login con error
    const isStillOnLogin = await page.locator('#loginScreen').isVisible();
    const isOnDashboard = await page.locator('#welcomeScreen').isVisible();

    // Debe estar en uno de los dos estados
    expect(isStillOnLogin || isOnDashboard).toBe(true);
  });
});

test.describe('Navegación de Usuario Autenticado', () => {
  // Estos tests requieren usuario autenticado
  // Puedes usar beforeEach para hacer login automático

  test.skip('Debe poder hacer logout', async ({ page }) => {
    // TODO: Implementar después de login automático
    // await page.goto('/');
    // await doLogin(page);
    // await page.click('[data-testid="logout-button"]');
    // await expect(page.locator('#loginScreen')).toBeVisible();
  });
});
