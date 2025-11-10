/**
 * Claude AI Helper
 * Funciones auxiliares para integrar Claude AI en tu aplicación
 */

class ClaudeAIHelper {
  constructor() {
    this.baseURL = window.location.origin; // Automático para producción
    this.cache = new Map();
    this.requestQueue = [];
    this.isProcessing = false;
  }

  /**
   * Analiza una respuesta de entrevista usando Claude AI
   * @param {string} question - La pregunta de la entrevista
   * @param {string} answer - La respuesta del usuario
   * @param {object} userProfile - Perfil del usuario (opcional)
   * @returns {Promise<object>} Análisis de la respuesta
   */
  async analyzeInterview(question, answer, userProfile = null) {
    const cacheKey = `interview_${this.hashString(question + answer)}`;

    // Revisar caché
    if (this.cache.has(cacheKey)) {
      console.log('[ClaudeAI] Usando resultado en caché');
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseURL}/api/analyze-interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          answer,
          userProfile
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al analizar la entrevista');
      }

      const data = await response.json();

      // Guardar en caché
      this.cache.set(cacheKey, data);

      return data;
    } catch (error) {
      console.error('[ClaudeAI] Error:', error);
      throw error;
    }
  }

  /**
   * Genera preguntas personalizadas para entrevistas
   * @param {string} jobArea - Área laboral
   * @param {string} difficulty - Nivel de dificultad
   * @param {number} count - Cantidad de preguntas
   * @param {object} userProfile - Perfil del usuario
   * @returns {Promise<object>} Lista de preguntas generadas
   */
  async generateQuestions(jobArea, difficulty = 'mid', count = 5, userProfile = null) {
    try {
      const response = await fetch(`${this.baseURL}/api/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobArea,
          difficulty,
          count,
          userProfile
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al generar preguntas');
      }

      return await response.json();
    } catch (error) {
      console.error('[ClaudeAI] Error:', error);
      throw error;
    }
  }

  /**
   * Interactúa con el coach virtual
   * @param {string} userMessage - Mensaje del usuario
   * @param {array} conversationHistory - Historial de conversación
   * @param {object} userProfile - Perfil del usuario
   * @returns {Promise<object>} Respuesta del coach
   */
  async chatWithCoach(userMessage, conversationHistory = [], userProfile = null) {
    try {
      const response = await fetch(`${this.baseURL}/api/mentor-coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage,
          conversationHistory,
          userProfile
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en el coach virtual');
      }

      return await response.json();
    } catch (error) {
      console.error('[ClaudeAI] Error:', error);
      throw error;
    }
  }

  /**
   * Analiza un CV
   * @param {string} cvText - Texto del CV
   * @param {string} targetJob - Puesto objetivo
   * @param {string} targetIndustry - Industria objetivo
   * @returns {Promise<object>} Análisis del CV
   */
  async analyzeCV(cvText, targetJob = null, targetIndustry = null) {
    try {
      const response = await fetch(`${this.baseURL}/api/analyze-cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvText,
          targetJob,
          targetIndustry
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al analizar CV');
      }

      return await response.json();
    } catch (error) {
      console.error('[ClaudeAI] Error:', error);
      throw error;
    }
  }

  /**
   * Función auxiliar para generar hash de strings (para caché)
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Limpia el caché
   */
  clearCache() {
    this.cache.clear();
    console.log('[ClaudeAI] Caché limpiado');
  }

  /**
   * Muestra un componente de loading
   */
  showLoading(container, message = 'Analizando con IA...') {
    const loadingHTML = `
      <div class="claude-loading">
        <div class="loading-spinner"></div>
        <p>${message}</p>
      </div>
    `;

    if (typeof container === 'string') {
      container = document.getElementById(container);
    }

    if (container) {
      container.innerHTML = loadingHTML;
    }
  }

  /**
   * Muestra error en un contenedor
   */
  showError(container, error) {
    const errorHTML = `
      <div class="claude-error">
        <span class="error-icon">⚠️</span>
        <p>Error: ${error.message}</p>
        <button onclick="location.reload()">Intentar de nuevo</button>
      </div>
    `;

    if (typeof container === 'string') {
      container = document.getElementById(container);
    }

    if (container) {
      container.innerHTML = errorHTML;
    }
  }

  /**
   * Renderiza el resultado de análisis de entrevista
   */
  renderInterviewAnalysis(container, analysis) {
    const html = `
      <div class="claude-analysis">
        <div class="analysis-header">
          <h3>🤖 Análisis con Claude AI</h3>
          <div class="score-badge ${this.getScoreClass(analysis.score)}">
            <span class="score-number">${analysis.score}</span>
            <span class="score-label">${analysis.level}</span>
          </div>
        </div>

        ${analysis.strengths && analysis.strengths.length > 0 ? `
          <div class="analysis-section strengths">
            <h4><span class="icon">✅</span> Fortalezas</h4>
            <ul>
              ${analysis.strengths.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${analysis.improvements && analysis.improvements.length > 0 ? `
          <div class="analysis-section improvements">
            <h4><span class="icon">📈</span> Áreas de Mejora</h4>
            <ul>
              ${analysis.improvements.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${analysis.competencies && analysis.competencies.length > 0 ? `
          <div class="analysis-section competencies">
            <h4><span class="icon">🎯</span> Competencias Detectadas</h4>
            <div class="competency-badges">
              ${analysis.competencies.map(c => `
                <span class="competency-badge">${c}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${analysis.suggestions && analysis.suggestions.length > 0 ? `
          <div class="analysis-section suggestions">
            <h4><span class="icon">💡</span> Sugerencias para Mejorar</h4>
            <ul>
              ${analysis.suggestions.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${analysis.modelAnswer ? `
          <div class="analysis-section model-answer">
            <h4><span class="icon">✨</span> Respuesta Modelo</h4>
            <div class="model-answer-content">
              ${analysis.modelAnswer}
            </div>
          </div>
        ` : ''}

        <div class="analysis-footer">
          <small>Analizado el ${new Date(analysis.analyzedAt).toLocaleString('es')} con ${analysis.model}</small>
        </div>
      </div>
    `;

    if (typeof container === 'string') {
      container = document.getElementById(container);
    }

    if (container) {
      container.innerHTML = html;
    }
  }

  /**
   * Obtiene la clase CSS según el score
   */
  getScoreClass(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'very-good';
    if (score >= 55) return 'good';
    if (score >= 40) return 'regular';
    return 'needs-improvement';
  }
}

// Exportar instancia global
window.claudeAI = new ClaudeAIHelper();

// CSS para los componentes
const style = document.createElement('style');
style.textContent = `
  .claude-loading {
    text-align: center;
    padding: 40px;
  }

  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .claude-error {
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    color: #c33;
  }

  .claude-error button {
    margin-top: 10px;
    padding: 8px 16px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .claude-analysis {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .analysis-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
  }

  .score-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 20px;
    border-radius: 12px;
    min-width: 100px;
  }

  .score-badge.excellent {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .score-badge.very-good {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }

  .score-badge.good {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
  }

  .score-badge.regular {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    color: #333;
  }

  .score-badge.needs-improvement {
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    color: #333;
  }

  .score-number {
    font-size: 32px;
    font-weight: bold;
  }

  .score-label {
    font-size: 12px;
    margin-top: 4px;
  }

  .analysis-section {
    margin-bottom: 24px;
  }

  .analysis-section h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: #333;
  }

  .analysis-section ul {
    list-style: none;
    padding: 0;
  }

  .analysis-section li {
    padding: 8px 12px;
    margin: 6px 0;
    background: #f8f9fa;
    border-left: 3px solid #667eea;
    border-radius: 4px;
  }

  .competency-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .competency-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
  }

  .model-answer-content {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    line-height: 1.6;
  }

  .analysis-footer {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;
    text-align: center;
    color: #666;
  }
`;
document.head.appendChild(style);

console.log('✅ Claude AI Helper cargado correctamente');
