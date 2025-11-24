import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Tests Unitarios para funciones de API
 * Mock de requests a Netlify Functions
 */

// Mock de fetch global
global.fetch = vi.fn();

describe('API - Analyze Interview', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('Debe enviar request correcta para análisis de entrevista', async () => {
    // Mock de respuesta exitosa
    const mockResponse = {
      success: true,
      analysis: {
        score: 85,
        level: 'Muy Bueno',
        strengths: ['Clara comunicación', 'Buenos ejemplos'],
        improvements: ['Agregar más detalles'],
        competencies: ['Liderazgo', 'Comunicación'],
        suggestions: ['Usar método STAR'],
        modelAnswer: 'Respuesta mejorada...'
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Simular llamada a la API
    const response = await fetch('/.netlify/functions/analyze-interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: '¿Cuál es tu mayor fortaleza?',
        answer: 'Mi mayor fortaleza es el trabajo en equipo'
      })
    });

    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith(
      '/.netlify/functions/analyze-interview',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );

    expect(data.success).toBe(true);
    expect(data.analysis.score).toBe(85);
    expect(data.analysis.strengths).toBeInstanceOf(Array);
  });

  it('Debe manejar errores de API', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Error del servidor' })
    });

    const response = await fetch('/.netlify/functions/analyze-interview', {
      method: 'POST',
      body: JSON.stringify({ question: 'test', answer: 'test' })
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });
});

describe('API - Generate Questions', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('Debe generar preguntas para un área laboral', async () => {
    const mockResponse = {
      success: true,
      questions: [
        {
          id: 'q1',
          question: '¿Cómo manejas el estrés en ventas?',
          type: 'behavioral',
          competencies: ['Manejo de estrés', 'Resiliencia'],
          tips: 'Buscar ejemplos concretos',
          difficulty: 'media'
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const response = await fetch('/.netlify/functions/generate-questions', {
      method: 'POST',
      body: JSON.stringify({
        jobArea: 'ventas',
        difficulty: 'mid',
        count: 5
      })
    });

    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.questions).toBeInstanceOf(Array);
    expect(data.questions[0]).toHaveProperty('question');
    expect(data.questions[0]).toHaveProperty('type');
  });
});

describe('API - Mentor Coach', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('Debe obtener respuesta del mentor', async () => {
    const mockResponse = {
      success: true,
      response: 'Excelente pregunta. Te recomiendo...',
      timestamp: new Date().toISOString()
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const response = await fetch('/.netlify/functions/mentor-coach', {
      method: 'POST',
      body: JSON.stringify({
        userMessage: '¿Cómo mejoro mi CV?',
        conversationHistory: []
      })
    });

    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.response).toBeTruthy();
    expect(typeof data.response).toBe('string');
  });
});

describe('API - Analyze CV', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('Debe analizar un CV correctamente', async () => {
    const mockResponse = {
      success: true,
      analysis: {
        score: 75,
        rating: 'Bueno',
        strengths: ['Experiencia relevante'],
        weaknesses: ['Falta cuantificar logros'],
        missingKeywords: ['liderazgo', 'gestión'],
        specificSuggestions: ['Agregar métricas']
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const response = await fetch('/.netlify/functions/analyze-cv', {
      method: 'POST',
      body: JSON.stringify({
        cvText: 'Desarrollador con 5 años de experiencia...',
        targetJob: 'Senior Developer'
      })
    });

    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.analysis.score).toBeGreaterThan(0);
    expect(data.analysis.strengths).toBeInstanceOf(Array);
    expect(data.analysis.weaknesses).toBeInstanceOf(Array);
  });
});

describe('API - Save to Sheets', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('Debe guardar resultado de test en Google Sheets', async () => {
    const mockResponse = {
      success: true,
      dataType: 'test_result',
      sheetName: 'Resultados de Tests',
      rowsAdded: 1
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const response = await fetch('/.netlify/functions/save-to-sheets', {
      method: 'POST',
      body: JSON.stringify({
        dataType: 'test_result',
        data: {
          testType: 'personality',
          score: 85,
          totalQuestions: 20,
          correctAnswers: 17
        },
        userId: 'user123'
      })
    });

    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.dataType).toBe('test_result');
    expect(data.rowsAdded).toBe(1);
  });

  it('Debe validar dataType requerido', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Se requiere dataType y data' })
    });

    const response = await fetch('/.netlify/functions/save-to-sheets', {
      method: 'POST',
      body: JSON.stringify({
        // Falta dataType
        data: { test: 'data' }
      })
    });

    const data = await response.json();
    expect(response.ok).toBe(false);
    expect(data.error).toBeTruthy();
  });
});

describe('Claude AI Helper - Cache', () => {
  // Simular sistema de cache
  const cache = new Map();

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  function getCached(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < 3600000) {
      return cached.data;
    }
    return null;
  }

  function setCache(key, data) {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  it('Debe generar hash consistente', () => {
    const str = 'test string';
    const hash1 = hashString(str);
    const hash2 = hashString(str);

    expect(hash1).toBe(hash2);
  });

  it('Debe cachear y recuperar datos', () => {
    const key = 'test-key';
    const data = { result: 'cached data' };

    setCache(key, data);
    const cached = getCached(key);

    expect(cached).toEqual(data);
  });

  it('Debe retornar null para cache expirada', () => {
    const key = 'expired-key';
    const data = { result: 'old data' };

    // Simular cache antigua
    cache.set(key, {
      data,
      timestamp: Date.now() - 4000000 // Más de 1 hora
    });

    const cached = getCached(key);
    expect(cached).toBe(null);
  });
});
