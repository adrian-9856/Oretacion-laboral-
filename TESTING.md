# 🧪 Guía de Testing

## 📋 Resumen

El proyecto incluye dos tipos de tests:

1. **Tests E2E (End-to-End)** con Playwright - Prueban la aplicación completa en un navegador real
2. **Tests Unitarios** con Vitest - Prueban funciones individuales de forma aislada

---

## 🎭 Tests E2E con Playwright

### Ejecutar tests:

```bash
# Todos los tests E2E
npm run test:e2e

# Con interfaz visual (recomendado)
npm run test:e2e:ui

# Ver el navegador mientras corre
npm run test:e2e:headed

# Solo un archivo específico
npx playwright test auth.spec.js

# Solo un test específico
npx playwright test -g "Debe mostrar la pantalla de login"
```

### Tests disponibles:

#### `tests/e2e/auth.spec.js` - Autenticación
- ✅ Mostrar pantalla de login
- ✅ Cambiar entre tabs login/registro
- ✅ Validar email inválido
- ✅ Validar campos requeridos
- ✅ Toggle de mostrar/ocultar contraseña
- ✅ Link de recuperación de contraseña
- ✅ Login con Google
- ✅ Navegación después de login

#### `tests/e2e/navigation.spec.js` - Navegación
- ✅ Cargar sin errores de consola
- ✅ Título correcto
- ✅ Recursos cargados (CSS, JS)
- ✅ Responsividad mobile
- ✅ Responsividad tablet
- ✅ Estructura de contenedores
- ✅ Firebase cargado
- ✅ Claude AI helper cargado
- ✅ Accesibilidad básica
- ✅ Navegación por teclado

### Navegadores soportados:

- ✅ Chromium (Chrome, Edge)
- ✅ Firefox
- ✅ Webkit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### Configuración:

Archivo: `playwright.config.js`

```javascript
{
  testDir: './tests/e2e',
  baseURL: 'http://localhost:8888',
  timeout: 30000,
  retries: 2 (en CI)
}
```

---

## ⚡ Tests Unitarios con Vitest

### Ejecutar tests:

```bash
# Todos los tests unitarios
npm test

# Modo watch (re-ejecuta al cambiar código)
npm test -- --watch

# Con interfaz visual
npm run test:ui

# Con cobertura de código
npm test -- --coverage

# Solo un archivo
npm test helpers.test.js

# Solo un test
npm test -t "Debe validar emails correctos"
```

### Tests disponibles:

#### `tests/unit/helpers.test.js` - Funciones Helper
- ✅ Validación de email
- ✅ Formateo de tiempo
- ✅ Generación de IDs
- ✅ Cálculo de puntuación
- ✅ localStorage mock
- ✅ Validación de respuestas
- ✅ Sistema de niveles
- ✅ Formateo de fecha

#### `tests/unit/api.test.js` - APIs
- ✅ Analyze Interview API
- ✅ Generate Questions API
- ✅ Mentor Coach API
- ✅ Analyze CV API
- ✅ Save to Sheets API
- ✅ Claude AI Cache

### Configuración:

Archivo: `vitest.config.js`

```javascript
{
  environment: 'jsdom',
  setupFiles: ['./tests/setup.js'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html']
  }
}
```

---

## 📊 Cobertura de Código

### Generar reporte:

```bash
npm test -- --coverage
```

### Ver reporte HTML:

```bash
# Después de generar cobertura
open coverage/index.html
```

### Archivos excluidos de cobertura:

- `node_modules/`
- `tests/`
- `netlify/`
- `api/`
- `*.config.js`

---

## ✍️ Escribir Nuevos Tests

### Test E2E ejemplo:

```javascript
// tests/e2e/mi-feature.spec.js
import { test, expect } from '@playwright/test';

test.describe('Mi Nueva Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Debe hacer algo específico', async ({ page }) => {
    // Interactuar con la página
    await page.click('#boton');

    // Verificar resultado
    await expect(page.locator('#resultado')).toBeVisible();
  });
});
```

### Test Unitario ejemplo:

```javascript
// tests/unit/mi-modulo.test.js
import { describe, it, expect } from 'vitest';

describe('Mi Módulo', () => {
  it('Debe hacer algo', () => {
    const resultado = miFuncion('input');
    expect(resultado).toBe('expected');
  });
});
```

---

## 🔍 Debugging

### Playwright:

```bash
# Ver paso a paso con UI
npm run test:e2e:ui

# Ver en navegador real
npm run test:e2e:headed

# Debug mode (pausa en errores)
npx playwright test --debug

# Generar trace para análisis
npx playwright test --trace on
```

### Vitest:

```bash
# Modo watch (más rápido para debugging)
npm test -- --watch

# UI mode
npm run test:ui

# Solo el test que falla
npm test -t "nombre del test"
```

---

## 🚀 CI/CD

### GitHub Actions ejemplo:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npm run test:install

      - name: Run unit tests
        run: npm test

      - name: Run E2E tests
        run: npm run test:e2e
```

---

## 📝 Best Practices

### Tests E2E:

1. ✅ Usa `data-testid` en lugar de selectores frágiles
2. ✅ Espera elementos con `waitForSelector` o `expect().toBeVisible()`
3. ✅ Usa `beforeEach` para setup común
4. ✅ Tests independientes (no dependen entre sí)
5. ✅ Nombres descriptivos: "Debe [acción] [resultado esperado]"

### Tests Unitarios:

1. ✅ Una función = múltiples tests (casos edge)
2. ✅ Usa mocks para dependencias externas
3. ✅ Tests rápidos (< 1ms cada uno)
4. ✅ Nombres claros y específicos
5. ✅ AAA pattern: Arrange, Act, Assert

---

## 🐛 Troubleshooting

### "Cannot find module"
```bash
npm install
```

### "Playwright browsers not installed"
```bash
npm run test:install
```

### "Port 8888 already in use"
```bash
# Cambiar puerto en playwright.config.js
baseURL: 'http://localhost:3000'
```

### Tests lentos
```bash
# Ejecutar en paralelo (Playwright)
npx playwright test --workers=4

# Solo tests específicos
npm test mi-test.js
```

---

## 📚 Recursos

- [Playwright Docs](https://playwright.dev/)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

## ✅ Checklist Pre-Deploy

Antes de hacer deploy, asegúrate que pasan todos los tests:

```bash
# 1. Tests unitarios
npm test

# 2. Tests E2E
npm run test:e2e

# 3. Verificar cobertura
npm test -- --coverage

# 4. Lint (si tienes)
npm run lint

# 5. Build
npm run build
```

Si todos pasan: ✅ **¡Listo para deploy!**
