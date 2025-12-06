import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Tests Unitarios para Funciones Helper
 * Prueba utilidades y helpers del script-pro.js
 */

describe('Validación de Email', () => {
  // Función extraída de script-pro.js para testing
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  it('Debe validar emails correctos', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co')).toBe(true);
    expect(isValidEmail('admin123@company.org')).toBe(true);
  });

  it('Debe rechazar emails inválidos', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('no-at-sign.com')).toBe(false);
    expect(isValidEmail('@no-local-part.com')).toBe(false);
    expect(isValidEmail('no-domain@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('Formateo de Tiempo', () => {
  // Función simulada de formatTime
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  it('Debe formatear segundos correctamente', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(30)).toBe('0:30');
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(90)).toBe('1:30');
    expect(formatTime(125)).toBe('2:05');
  });
});

describe('Generación de ID', () => {
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  it('Debe generar IDs únicos', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it('IDs deben ser strings', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });
});

describe('Cálculo de Puntuación', () => {
  function calculateScore(correctAnswers, totalQuestions) {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  }

  it('Debe calcular porcentaje correcto', () => {
    expect(calculateScore(10, 10)).toBe(100);
    expect(calculateScore(5, 10)).toBe(50);
    expect(calculateScore(7, 10)).toBe(70);
    expect(calculateScore(0, 10)).toBe(0);
  });

  it('Debe manejar división por cero', () => {
    expect(calculateScore(0, 0)).toBe(0);
    expect(calculateScore(5, 0)).toBe(0);
  });

  it('Debe redondear correctamente', () => {
    expect(calculateScore(1, 3)).toBe(33);
    expect(calculateScore(2, 3)).toBe(67);
  });
});

describe('localStorage Mock', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Debe guardar y recuperar datos', () => {
    localStorage.setItem('testKey', 'testValue');
    expect(localStorage.getItem('testKey')).toBe('testValue');
  });

  it('Debe retornar null para claves inexistentes', () => {
    expect(localStorage.getItem('noExiste')).toBe(null);
  });

  it('Debe eliminar items correctamente', () => {
    localStorage.setItem('testKey', 'testValue');
    localStorage.removeItem('testKey');
    expect(localStorage.getItem('testKey')).toBe(null);
  });

  it('Debe limpiar todos los items', () => {
    localStorage.setItem('key1', 'value1');
    localStorage.setItem('key2', 'value2');
    localStorage.clear();
    expect(localStorage.getItem('key1')).toBe(null);
    expect(localStorage.getItem('key2')).toBe(null);
  });
});

describe('Validación de Respuestas de Quiz', () => {
  function isCorrectAnswer(userAnswer, correctAnswer) {
    if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
      return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }
    return userAnswer === correctAnswer;
  }

  it('Debe comparar respuestas case-insensitive', () => {
    expect(isCorrectAnswer('A', 'a')).toBe(true);
    expect(isCorrectAnswer('respuesta', 'RESPUESTA')).toBe(true);
  });

  it('Debe trimear espacios', () => {
    expect(isCorrectAnswer('  A  ', 'A')).toBe(true);
    expect(isCorrectAnswer('respuesta ', ' respuesta')).toBe(true);
  });

  it('Debe manejar respuestas numéricas', () => {
    expect(isCorrectAnswer(1, 1)).toBe(true);
    expect(isCorrectAnswer(1, 2)).toBe(false);
  });
});

describe('Sistema de Niveles', () => {
  function calculateLevel(xp) {
    // Fórmula simple: cada 1000 XP = 1 nivel
    return Math.floor(xp / 1000) + 1;
  }

  function xpForNextLevel(currentXP) {
    const currentLevel = calculateLevel(currentXP);
    return currentLevel * 1000 - currentXP;
  }

  it('Debe calcular nivel basado en XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(500)).toBe(1);
    expect(calculateLevel(1000)).toBe(2);
    expect(calculateLevel(2500)).toBe(3);
  });

  it('Debe calcular XP para siguiente nivel', () => {
    expect(xpForNextLevel(0)).toBe(1000);
    expect(xpForNextLevel(500)).toBe(500);
    expect(xpForNextLevel(1000)).toBe(1000);
    expect(xpForNextLevel(1500)).toBe(500);
  });
});

describe('Formateo de Fecha', () => {
  function getFormattedDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  it('Debe formatear fecha correctamente', () => {
    const date = new Date('2024-01-15');
    expect(getFormattedDate(date)).toBe('2024-01-15');
  });

  it('Debe añadir ceros a la izquierda', () => {
    const date = new Date('2024-03-05');
    expect(getFormattedDate(date)).toBe('2024-03-05');
  });
});
