import { defineConfig } from 'vitest/config';

/**
 * Configuración de Vitest para Tests Unitarios
 * @see https://vitest.dev/config/
 */
export default defineConfig({
  test: {
    // Entorno de prueba
    environment: 'jsdom',

    // Archivos de setup
    setupFiles: ['./tests/setup.js'],

    // Cobertura de código
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'netlify/',
        'api/',
        '*.config.js'
      ]
    },

    // Globals (opcional, para usar describe/test sin imports)
    globals: true,

    // Patrón de archivos de test
    include: ['tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
