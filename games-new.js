/**
 * ========================================
 * NUEVOS JUEGOS Y FEATURES - RUTA 2
 * ========================================
 *
 * Este archivo contiene 5 nuevos juegos interactivos:
 * 1. Speed Interview - Entrevista Rápida con tiempo límite
 * 2. Red Flags Detector - Detectar señales de alerta en ofertas
 * 3. Salary Negotiation Simulator - Simulador de negociación salarial
 * 4. Body Language Quiz - Quiz de lenguaje corporal
 * 5. Email Professional Builder - Constructor de emails profesionales
 */

// ========================================
// 1. SPEED INTERVIEW - ENTREVISTA RÁPIDA
// ========================================

const speedInterviewData = {
    currentQuestion: 0,
    questions: [],
    answers: [],
    scores: [],
    timePerQuestion: 30, // 30 segundos por pregunta
    timer: null,
    timeLeft: 30,
    totalScore: 0
};

/**
 * Iniciar Speed Interview
 */
async function startSpeedInterview(difficulty = 'mid') {
    try {
        showScreen('speedInterviewScreen');
        speedInterviewData.currentQuestion = 0;
        speedInterviewData.answers = [];
        speedInterviewData.scores = [];
        speedInterviewData.totalScore = 0;

        // Mostrar loading
        document.getElementById('speedInterviewContent').innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Generando preguntas de entrevista rápida...</p>
            </div>
        `;

        // Generar preguntas con Claude AI
        const response = await fetch('/.netlify/functions/generate-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobArea: currentUser.profile?.industry || 'general',
                difficulty: difficulty,
                count: 5
            })
        });

        const data = await response.json();

        if (data.success && data.questions) {
            speedInterviewData.questions = data.questions;
            loadSpeedInterviewQuestion();
        } else {
            throw new Error('No se pudieron generar las preguntas');
        }

    } catch (error) {
        console.error('Error en Speed Interview:', error);
        showToast('Error al iniciar entrevista rápida', 'error');
        showScreen('welcomeScreen');
    }
}

/**
 * Cargar pregunta de Speed Interview
 */
function loadSpeedInterviewQuestion() {
    const question = speedInterviewData.questions[speedInterviewData.currentQuestion];
    const questionNumber = speedInterviewData.currentQuestion + 1;
    const totalQuestions = speedInterviewData.questions.length;

    // Reiniciar timer
    speedInterviewData.timeLeft = speedInterviewData.timePerQuestion;

    const content = `
        <div class="speed-interview-container">
            <div class="speed-progress">
                <div class="speed-progress-bar" style="width: ${(questionNumber / totalQuestions) * 100}%"></div>
            </div>

            <div class="speed-header">
                <span class="speed-counter">Pregunta ${questionNumber} de ${totalQuestions}</span>
                <span class="speed-timer" id="speedTimer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                    <span id="speedTimeLeft">${speedInterviewData.timeLeft}s</span>
                </span>
            </div>

            <div class="speed-question-card">
                <div class="question-type-badge ${question.type}">
                    ${question.type === 'technical' ? '💻 Técnica' :
                      question.type === 'behavioral' ? '🧠 Conductual' : '🎯 Situacional'}
                </div>
                <h2 class="speed-question">${question.question}</h2>
                <div class="speed-tips">
                    <strong>💡 Tip:</strong> ${question.tips}
                </div>
            </div>

            <div class="speed-answer-section">
                <textarea
                    id="speedAnswerInput"
                    placeholder="Escribe tu respuesta aquí... ¡Rápido!"
                    rows="6"
                    autofocus
                ></textarea>
                <div class="speed-answer-counter">
                    <span id="charCount">0</span> caracteres
                </div>
            </div>

            <div class="speed-actions">
                <button class="btn-secondary" onclick="skipSpeedQuestion()">
                    Omitir →
                </button>
                <button class="btn-primary" onclick="submitSpeedAnswer()">
                    Enviar Respuesta ✓
                </button>
            </div>
        </div>
    `;

    document.getElementById('speedInterviewContent').innerHTML = content;

    // Contador de caracteres
    document.getElementById('speedAnswerInput').addEventListener('input', (e) => {
        document.getElementById('charCount').textContent = e.target.value.length;
    });

    // Iniciar countdown
    startSpeedTimer();
}

/**
 * Iniciar timer del Speed Interview
 */
function startSpeedTimer() {
    clearInterval(speedInterviewData.timer);

    speedInterviewData.timer = setInterval(() => {
        speedInterviewData.timeLeft--;

        const timerElement = document.getElementById('speedTimeLeft');
        if (timerElement) {
            timerElement.textContent = speedInterviewData.timeLeft + 's';

            // Cambiar color en los últimos 10 segundos
            const timerContainer = document.getElementById('speedTimer');
            if (speedInterviewData.timeLeft <= 10) {
                timerContainer.classList.add('time-warning');
            }

            // Cambiar color en los últimos 5 segundos
            if (speedInterviewData.timeLeft <= 5) {
                timerContainer.classList.add('time-danger');
            }
        }

        // Tiempo agotado
        if (speedInterviewData.timeLeft <= 0) {
            clearInterval(speedInterviewData.timer);
            showToast('⏰ ¡Tiempo agotado!', 'warning');
            submitSpeedAnswer(true); // auto-submit
        }
    }, 1000);
}

/**
 * Omitir pregunta de Speed Interview
 */
function skipSpeedQuestion() {
    clearInterval(speedInterviewData.timer);
    speedInterviewData.answers.push({ skipped: true, answer: '' });
    speedInterviewData.scores.push(0);
    nextSpeedQuestion();
}

/**
 * Enviar respuesta de Speed Interview
 */
async function submitSpeedAnswer(autoSubmit = false) {
    clearInterval(speedInterviewData.timer);

    const answer = document.getElementById('speedAnswerInput')?.value.trim() || '';
    const question = speedInterviewData.questions[speedInterviewData.currentQuestion];

    if (!answer && !autoSubmit) {
        showToast('Por favor escribe una respuesta', 'warning');
        return;
    }

    // Mostrar loading
    document.getElementById('speedInterviewContent').innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Analizando tu respuesta con IA...</p>
        </div>
    `;

    try {
        // Analizar con Claude AI
        const response = await fetch('/.netlify/functions/analyze-interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question.question,
                answer: answer || 'Sin respuesta',
                userProfile: currentUser.profile
            })
        });

        const data = await response.json();

        if (data.success) {
            const score = data.analysis.score || 0;
            speedInterviewData.answers.push({ answer, analysis: data.analysis });
            speedInterviewData.scores.push(score);
            speedInterviewData.totalScore += score;

            // Mostrar feedback rápido
            showSpeedFeedback(score, data.analysis);

            setTimeout(() => {
                nextSpeedQuestion();
            }, 3000);
        } else {
            throw new Error('Error al analizar respuesta');
        }

    } catch (error) {
        console.error('Error:', error);
        showToast('Error al analizar respuesta', 'error');
        nextSpeedQuestion();
    }
}

/**
 * Mostrar feedback rápido
 */
function showSpeedFeedback(score, analysis) {
    let emoji = '😊';
    let message = 'Bien';
    let color = '#10b981';

    if (score >= 90) {
        emoji = '🌟';
        message = '¡Excelente!';
        color = '#8b5cf6';
    } else if (score >= 75) {
        emoji = '👍';
        message = '¡Muy bien!';
        color = '#3b82f6';
    } else if (score >= 60) {
        emoji = '👌';
        message = 'Bien';
        color = '#10b981';
    } else {
        emoji = '💪';
        message = 'Puede mejorar';
        color = '#f59e0b';
    }

    const content = `
        <div class="speed-feedback" style="border-color: ${color}">
            <div class="speed-feedback-score" style="color: ${color}">
                <span class="score-emoji">${emoji}</span>
                <span class="score-value">${score}/100</span>
            </div>
            <h3 style="color: ${color}">${message}</h3>
            <div class="speed-feedback-details">
                <p><strong>Fortalezas:</strong> ${analysis.strengths?.[0] || 'Respuesta clara'}</p>
            </div>
            <p class="speed-continue">Continuando en 3 segundos...</p>
        </div>
    `;

    document.getElementById('speedInterviewContent').innerHTML = content;
}

/**
 * Siguiente pregunta de Speed Interview
 */
function nextSpeedQuestion() {
    speedInterviewData.currentQuestion++;

    if (speedInterviewData.currentQuestion < speedInterviewData.questions.length) {
        loadSpeedInterviewQuestion();
    } else {
        finishSpeedInterview();
    }
}

/**
 * Finalizar Speed Interview
 */
async function finishSpeedInterview() {
    clearInterval(speedInterviewData.timer);

    const totalQuestions = speedInterviewData.questions.length;
    const averageScore = Math.round(speedInterviewData.totalScore / totalQuestions);
    const answeredQuestions = speedInterviewData.answers.filter(a => !a.skipped).length;

    // Guardar en gamificación
    if (typeof addXP === 'function') {
        const xpGained = Math.round(averageScore / 2); // 50 XP por 100 puntos
        addXP(xpGained);
    }

    // Guardar en Google Sheets
    try {
        await fetch('/.netlify/functions/save-to-sheets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dataType: 'interview_simulation',
                userId: currentUser.uid,
                data: {
                    gameType: 'speed_interview',
                    jobArea: currentUser.profile?.industry || 'general',
                    difficulty: 'mid',
                    questionsAnswered: answeredQuestions,
                    questionsSkipped: totalQuestions - answeredQuestions,
                    averageScore: averageScore,
                    totalScore: speedInterviewData.totalScore,
                    timeSpent: totalQuestions * 30
                }
            })
        });
    } catch (error) {
        console.warn('Error guardando en Sheets:', error);
    }

    // Mostrar resultados
    showSpeedInterviewResults(averageScore, answeredQuestions, totalQuestions);
}

/**
 * Mostrar resultados de Speed Interview
 */
function showSpeedInterviewResults(averageScore, answered, total) {
    let emoji = '🎯';
    let title = 'Resultados de Entrevista Rápida';
    let message = '';

    if (averageScore >= 85) {
        emoji = '🏆';
        title = '¡Excelente desempeño!';
        message = 'Tienes gran habilidad para responder bajo presión.';
    } else if (averageScore >= 70) {
        emoji = '⭐';
        title = '¡Muy bien!';
        message = 'Manejas bien las entrevistas rápidas.';
    } else if (averageScore >= 50) {
        emoji = '👍';
        title = 'Buen trabajo';
        message = 'Con práctica mejorarás tus respuestas.';
    } else {
        emoji = '💪';
        title = 'Sigue practicando';
        message = 'La velocidad es importante, pero también la calidad.';
    }

    const content = `
        <div class="speed-results">
            <div class="results-header">
                <span class="results-emoji">${emoji}</span>
                <h2>${title}</h2>
                <p>${message}</p>
            </div>

            <div class="results-stats">
                <div class="stat-card">
                    <div class="stat-value">${averageScore}</div>
                    <div class="stat-label">Puntuación Media</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${answered}/${total}</div>
                    <div class="stat-label">Preguntas Respondidas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${speedInterviewData.totalScore}</div>
                    <div class="stat-label">Puntuación Total</div>
                </div>
            </div>

            <div class="results-breakdown">
                <h3>Desglose por Pregunta</h3>
                ${speedInterviewData.questions.map((q, i) => {
                    const answer = speedInterviewData.answers[i];
                    const score = speedInterviewData.scores[i];
                    return `
                        <div class="question-result">
                            <div class="question-result-header">
                                <span class="question-num">Pregunta ${i + 1}</span>
                                <span class="question-score ${score >= 70 ? 'good' : 'needs-improvement'}">
                                    ${score}/100
                                </span>
                            </div>
                            <p class="question-text">${q.question}</p>
                            ${answer.skipped ?
                                '<p class="skipped-label">⚠️ Pregunta omitida</p>' :
                                `<p class="answer-preview">${answer.answer.substring(0, 100)}${answer.answer.length > 100 ? '...' : ''}</p>`
                            }
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="results-actions">
                <button class="btn-secondary" onclick="showScreen('welcomeScreen')">
                    Volver al Inicio
                </button>
                <button class="btn-primary" onclick="startSpeedInterview()">
                    🔄 Intentar de Nuevo
                </button>
            </div>
        </div>
    `;

    document.getElementById('speedInterviewContent').innerHTML = content;
}

// ========================================
// 2. RED FLAGS DETECTOR
// ========================================

const redFlagsData = {
    currentCase: 0,
    cases: [],
    score: 0,
    correct: 0,
    wrong: 0
};

/**
 * Casos de Red Flags (ofertas de trabajo sospechosas)
 */
const redFlagsCases = [
    {
        id: 1,
        title: 'Asistente Administrativo - Home Office',
        company: 'Global Solutions LLC',
        description: 'Buscamos asistente administrativo para trabajo desde casa. Salario: $3,000-$5,000 mensuales. No experiencia requerida. Horario flexible. Pagos semanales en efectivo.',
        requirements: ['Mayor de 18 años', 'Cuenta bancaria', 'Smartphone'],
        redFlags: [
            'Salario muy alto sin experiencia requerida',
            'Pagos en efectivo (poco transparente)',
            'Requisitos mínimos (posible estafa)'
        ],
        isScam: true,
        explanation: 'Esta oferta presenta múltiples señales de alerta: salario desproporcionadamente alto, ningún requisito profesional, y pagos en efectivo que dificultan el rastreo.'
    },
    {
        id: 2,
        title: 'Desarrollador Full Stack Senior',
        company: 'TechStart Guatemala',
        description: 'Empresa de desarrollo busca Full Stack Developer con 3+ años de experiencia. Stack: React, Node.js, MongoDB. Salario: Q15,000-Q20,000. Modalidad híbrida.',
        requirements: ['3+ años experiencia', 'Portafolio de proyectos', 'Inglés intermedio', 'Conocimientos en Git'],
        redFlags: [],
        isScam: false,
        explanation: 'Oferta legítima con requisitos claros, salario acorde al mercado, y especificaciones técnicas detalladas.'
    },
    {
        id: 3,
        title: '¡GANA DINERO DESDE CASA! 💰',
        company: 'BusinessPro International',
        description: '¿Quieres ganar $2,000-$10,000 al mes? ¡Solo necesitas tu teléfono! Sin jefes, sin horarios. Inversión inicial de $500 para materiales de trabajo. ¡Resultados garantizados!',
        requirements: ['Ganas de triunfar', 'Inversión inicial $500', 'Agregar a WhatsApp +1-555-0123'],
        redFlags: [
            'Promesas de ganancias exageradas',
            'Requiere inversión inicial',
            'No especifica el trabajo real',
            'Uso excesivo de emojis y mayúsculas',
            'Contacto solo por WhatsApp'
        ],
        isScam: true,
        explanation: 'ESTAFA EVIDENTE: Ningún trabajo legítimo requiere inversión inicial ni promete ganancias garantizadas. El contacto únicamente por WhatsApp es otra señal de alerta.'
    },
    {
        id: 4,
        title: 'Community Manager',
        company: 'Agencia Digital Creativa',
        description: 'Agencia busca Community Manager para gestión de redes sociales de clientes. Experiencia mínima 1 año. Conocimientos en Canva, Meta Business Suite. Salario Q8,000 + prestaciones de ley.',
        requirements: ['1 año experiencia', 'Manejo de redes sociales', 'Portafolio', 'Título universitario en curso o completo'],
        redFlags: [],
        isScam: false,
        explanation: 'Oferta normal con requisitos razonables, salario justo, y prestaciones legales mencionadas.'
    },
    {
        id: 5,
        title: 'Asistente Virtual - Empresa Europea',
        company: 'EuroConnect Services',
        description: 'Empresa europea busca asistentes virtuales. Excelente salario en dólares. Primer pago después de 3 meses de "prueba". Debes comprar software especial ($800) para trabajar.',
        requirements: ['Inglés fluido', 'Computadora', 'Compra de software (herramienta de trabajo)'],
        redFlags: [
            'Requiere compra de software/herramientas',
            'Pago después de 3 meses (trabajo gratis)',
            'No nombre específico de empresa',
            'No especifica funciones claras'
        ],
        isScam: true,
        explanation: 'ESTAFA: Nunca debes pagar por herramientas de trabajo. El "período de prueba" de 3 meses sin pago es ilegal. Buscan que compres su software falso.'
    },
    {
        id: 6,
        title: 'Analista de Datos Junior',
        company: 'DataCorp Guatemala',
        description: 'Empresa de análisis de datos busca analista junior. Requisitos: conocimientos en SQL, Python básico, Excel avanzado. Salario Q10,000-Q12,000. Capacitación incluida. Modalidad presencial en zona 10.',
        requirements: ['Título universitario', 'SQL y Python básico', 'Excel avanzado', 'Inglés técnico'],
        redFlags: [],
        isScam: false,
        explanation: 'Oferta legítima con requisitos técnicos específicos, ubicación clara, salario de mercado y mención de capacitación que es común para puestos junior.'
    },
    {
        id: 7,
        title: 'Empacador de Productos - ¡Pago Inmediato!',
        company: 'Amazon Work From Home (NO OFICIAL)',
        description: 'Trabaja empacando productos desde casa para Amazon. Pago $5 por paquete. Potencial de $3,000+ mensuales. Solo necesitas pagar $300 por kit de inicio con productos.',
        requirements: ['Pago de kit ($300)', 'Espacio en casa', 'Transporte para recoger productos'],
        redFlags: [
            'Usa nombre de empresa famosa sin ser oficial',
            'Requiere pago inicial',
            'Modelo de negocio ilógico',
            'Amazon no subcontrata empacado casero'
        ],
        isScam: true,
        explanation: 'ESTAFA COMÚN: Amazon NO contrata empacadores desde casa. Usan el nombre de la empresa para dar credibilidad. Te hacen pagar el kit y nunca recibes productos ni trabajo real.'
    },
    {
        id: 8,
        title: 'Vendedor de Seguros',
        company: 'Seguros Universales S.A.',
        description: 'Compañía de seguros busca agentes de ventas. Comisiones del 15-25% por venta. Capacitación gratuita. Horario flexible. Se valorará experiencia pero no indispensable.',
        requirements: ['Mayor de edad', 'Excelente comunicación', 'Vehículo propio (deseable)', 'Secundaria completa'],
        redFlags: [],
        isScam: false,
        explanation: 'Oferta legítima de trabajo por comisiones, común en ventas de seguros. Menciona capacitación gratuita (importante) y requisitos realistas. El salario variable por comisiones es estándar en ventas.'
    }
];

/**
 * Iniciar Red Flags Detector
 */
function startRedFlagsDetector() {
    showScreen('redFlagsScreen');
    redFlagsData.currentCase = 0;
    redFlagsData.score = 0;
    redFlagsData.correct = 0;
    redFlagsData.wrong = 0;
    redFlagsData.cases = [...redFlagsCases].sort(() => Math.random() - 0.5).slice(0, 6); // 6 casos aleatorios

    loadRedFlagsCase();
}

/**
 * Cargar caso de Red Flags
 */
function loadRedFlagsCase() {
    const caseData = redFlagsData.cases[redFlagsData.currentCase];
    const progress = ((redFlagsData.currentCase + 1) / redFlagsData.cases.length) * 100;

    const content = `
        <div class="red-flags-container">
            <div class="red-flags-progress">
                <div class="progress-bar" style="width: ${progress}%"></div>
                <span class="progress-text">Caso ${redFlagsData.currentCase + 1} de ${redFlagsData.cases.length}</span>
            </div>

            <div class="job-offer-card">
                <div class="job-header">
                    <h2>${caseData.title}</h2>
                    <span class="company-name">${caseData.company}</span>
                </div>

                <div class="job-description">
                    <h3>📋 Descripción:</h3>
                    <p>${caseData.description}</p>
                </div>

                <div class="job-requirements">
                    <h3>📝 Requisitos:</h3>
                    <ul>
                        ${caseData.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="detection-question">
                <h3>🔍 ¿Esta oferta es legítima o es una estafa?</h3>
                <p class="hint">Busca señales de alerta como: salarios irreales, pagos iniciales, información vaga, promesas exageradas...</p>
            </div>

            <div class="detection-buttons">
                <button class="detection-btn legitimate" onclick="answerRedFlags(false)">
                    ✅ Es Legítima
                    <span class="btn-hint">Oferta de trabajo real</span>
                </button>
                <button class="detection-btn scam" onclick="answerRedFlags(true)">
                    🚩 Es Estafa
                    <span class="btn-hint">Señales de alerta detectadas</span>
                </button>
            </div>

            <div class="score-display">
                <span class="score-item correct">✓ Correctas: ${redFlagsData.correct}</span>
                <span class="score-item wrong">✗ Incorrectas: ${redFlagsData.wrong}</span>
            </div>
        </div>
    `;

    document.getElementById('redFlagsContent').innerHTML = content;
}

/**
 * Responder Red Flags
 */
function answerRedFlags(userAnswerIsScam) {
    const caseData = redFlagsData.cases[redFlagsData.currentCase];
    const isCorrect = userAnswerIsScam === caseData.isScam;

    if (isCorrect) {
        redFlagsData.correct++;
        redFlagsData.score += 100 / redFlagsData.cases.length;
        showRedFlagsFeedback(true, caseData);
    } else {
        redFlagsData.wrong++;
        showRedFlagsFeedback(false, caseData);
    }
}

/**
 * Mostrar feedback de Red Flags
 */
function showRedFlagsFeedback(correct, caseData) {
    const content = `
        <div class="red-flags-feedback ${correct ? 'correct' : 'incorrect'}">
            <div class="feedback-header">
                <span class="feedback-icon">${correct ? '✅' : '❌'}</span>
                <h2>${correct ? '¡Correcto!' : 'Incorrecto'}</h2>
            </div>

            <div class="feedback-result">
                <p><strong>Esta oferta ${caseData.isScam ? 'ES una estafa' : 'es legítima'}</strong></p>
            </div>

            <div class="feedback-explanation">
                <h3>💡 Explicación:</h3>
                <p>${caseData.explanation}</p>
            </div>

            ${caseData.redFlags.length > 0 ? `
                <div class="feedback-red-flags">
                    <h3>🚩 Señales de alerta encontradas:</h3>
                    <ul>
                        ${caseData.redFlags.map(flag => `<li>${flag}</li>`).join('')}
                    </ul>
                </div>
            ` : `
                <div class="feedback-legitimate">
                    <h3>✅ Señales de legitimidad:</h3>
                    <ul>
                        <li>Requisitos profesionales claros</li>
                        <li>Salario acorde al mercado</li>
                        <li>No requiere inversión inicial</li>
                        <li>Información transparente</li>
                    </ul>
                </div>
            `}

            <button class="btn-primary" onclick="nextRedFlagsCase()">
                Continuar →
            </button>
        </div>
    `;

    document.getElementById('redFlagsContent').innerHTML = content;
}

/**
 * Siguiente caso de Red Flags
 */
function nextRedFlagsCase() {
    redFlagsData.currentCase++;

    if (redFlagsData.currentCase < redFlagsData.cases.length) {
        loadRedFlagsCase();
    } else {
        finishRedFlagsDetector();
    }
}

/**
 * Finalizar Red Flags Detector
 */
async function finishRedFlagsDetector() {
    const finalScore = Math.round(redFlagsData.score);
    const total = redFlagsData.cases.length;

    // XP y guardado en Sheets
    if (typeof addXP === 'function') {
        addXP(finalScore / 2);
    }

    try {
        await fetch('/.netlify/functions/save-to-sheets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dataType: 'test_result',
                userId: currentUser?.uid,
                data: {
                    testType: 'red_flags_detector',
                    score: finalScore,
                    totalQuestions: total,
                    correctAnswers: redFlagsData.correct,
                    timeSpent: 0,
                    difficulty: 'medium',
                    passed: finalScore >= 70
                }
            })
        });
    } catch (error) {
        console.warn('Error guardando en Sheets:', error);
    }

    // Mostrar resultados
    const accuracy = Math.round((redFlagsData.correct / total) * 100);
    let message = '';
    let emoji = '';

    if (accuracy >= 90) {
        emoji = '🏆';
        message = '¡Experto en detección! Tienes un ojo excelente para identificar estafas.';
    } else if (accuracy >= 70) {
        emoji = '⭐';
        message = '¡Muy bien! Puedes identificar la mayoría de las ofertas sospechosas.';
    } else if (accuracy >= 50) {
        emoji = '👍';
        message = 'Vas por buen camino. Con práctica mejorarás tu detección.';
    } else {
        emoji = '⚠️';
        message = 'Ten cuidado. Necesitas aprender más sobre señales de alerta en ofertas laborales.';
    }

    const content = `
        <div class="red-flags-results">
            <div class="results-header">
                <span class="results-emoji">${emoji}</span>
                <h2>Resultados - Detector de Red Flags</h2>
                <p>${message}</p>
            </div>

            <div class="results-stats">
                <div class="stat-card">
                    <div class="stat-value">${finalScore}</div>
                    <div class="stat-label">Puntuación Final</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${redFlagsData.correct}/${total}</div>
                    <div class="stat-label">Respuestas Correctas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${accuracy}%</div>
                    <div class="stat-label">Precisión</div>
                </div>
            </div>

            <div class="safety-tips">
                <h3>🛡️ Consejos de Seguridad</h3>
                <ul>
                    <li>✅ Nunca pagues por conseguir un trabajo</li>
                    <li>✅ Desconfía de salarios muy altos sin requisitos</li>
                    <li>✅ Investiga la empresa en Google y redes sociales</li>
                    <li>✅ Las ofertas legítimas tienen información clara</li>
                    <li>✅ Evita ofertas que solo contactan por WhatsApp</li>
                    <li>✅ Si prometen "hacerte rico rápido", es estafa</li>
                </ul>
            </div>

            <div class="results-actions">
                <button class="btn-secondary" onclick="showScreen('welcomeScreen')">
                    Volver al Inicio
                </button>
                <button class="btn-primary" onclick="startRedFlagsDetector()">
                    🔄 Intentar de Nuevo
                </button>
            </div>
        </div>
    `;

    document.getElementById('redFlagsContent').innerHTML = content;
}

// Exportar funciones globalmente
window.startSpeedInterview = startSpeedInterview;
window.skipSpeedQuestion = skipSpeedQuestion;
window.submitSpeedAnswer = submitSpeedAnswer;
window.startRedFlagsDetector = startRedFlagsDetector;
window.answerRedFlags = answerRedFlags;
window.nextRedFlagsCase = nextRedFlagsCase;
