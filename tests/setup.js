/**
 * Setup para Vitest
 * Este archivo se ejecuta antes de cada suite de tests
 */

// Configurar localStorage mock
const localStorageMock = {
  getItem: (key) => localStorageMock[key] || null,
  setItem: (key, value) => { localStorageMock[key] = value.toString(); },
  removeItem: (key) => { delete localStorageMock[key]; },
  clear: () => {
    Object.keys(localStorageMock).forEach(key => {
      if (typeof localStorageMock[key] !== 'function') {
        delete localStorageMock[key];
      }
    });
  }
};

global.localStorage = localStorageMock;

// Configurar sessionStorage mock
global.sessionStorage = { ...localStorageMock };

// Mock de console.error para tests más limpios (opcional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
