// ========================================
// VERSIÓN PRO - SISTEMA COMPLETO
// ========================================

// CONFIGURACIÓN
const CONFIG = {
    GOOGLE_SHEET_URL: 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI',
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'admin123',
    MAX_ATTEMPTS: 3,
    QUIZ_TIME_LIMIT: 900,
    CV_ERRORS_TIME_LIMIT: 600,
    CV_BUILDER_TIME_LIMIT: 1200,
    PASSING_SCORE: 70,
    PRACTICE_MODE: false
};

// VARIABLES GLOBALES
let currentUser = null;
let currentTestType = '';
let currentQuizQuestion = 0;
let quizAnswers = [];
let startTime;
let timerInterval;
let countdownInterval;
let currentDifficulty = 'easy';
let isPracticeMode = false;
let remainingTime = 0;
let modalCallback = null;
let lastTestResult = null;

// PREGUNTAS - NIVEL FÁCIL (PRE-TEST)
const questionsEasy = [
    {
        q: "¿Qué es lo más importante en el trabajo?",
        options: [
            "Llegar temprano todos los días",
            "Ser responsable y cumplir con las tareas",
            "Ser amigo del jefe",
            "Usar el celular cuando no te ven"
        ],
        correct: 1
    },
    {
        q: "¿Cómo debes saludar en una entrevista de trabajo?",
        options: [
            "Solo decir 'hola'",
            "Con un saludo formal y un apretón de manos",
            "No saludar, solo sentarse",
            "Dar un abrazo"
        ],
        correct: 1
    },
    {
        q: "Si no entiendes una tarea, ¿qué debes hacer?",
        options: [
            "Hacerla como puedas",
            "Preguntar a tu supervisor",
            "No hacer nada",
            "Pedir a un compañero que la haga"
        ],
        correct: 1
    },
    {
        q: "¿Qué debe llevar un CV?",
        options: [
            "Solo tu nombre",
            "Nombre, experiencia, educación y contacto",
            "Fotos de tus vacaciones",
            "Información de tu familia"
        ],
        correct: 1
    },
    {
        q: "¿Qué significa trabajar en equipo?",
        options: [
            "Hacer todo solo",
            "Colaborar con otros para lograr objetivos",
            "Competir contra tus compañeros",
            "Dejar que otros hagan tu trabajo"
        ],
        correct: 1
    },
    {
        q: "¿Cómo debes vestirte para trabajar?",
        options: [
            "Como quieras",
            "De forma limpia y apropiada",
            "Con ropa deportiva siempre",
            "No importa"
        ],
        correct: 1
    },
    {
        q: "Si llegas tarde al trabajo, ¿qué haces?",
        options: [
            "Entrar sin decir nada",
            "Avisar y disculparte con tu supervisor",
            "Inventar una excusa",
            "No importa, llegar tarde es normal"
        ],
        correct: 1
    },
    {
        q: "¿Qué es la puntualidad?",
        options: [
            "Llegar cuando quieras",
            "Llegar a tiempo a tus compromisos",
            "Llegar muy temprano siempre",
            "No importa la hora"
        ],
        correct: 1
    },
    {
        q: "¿Cómo tratas a tus compañeros de trabajo?",
        options: [
            "Los ignoras",
            "Con respeto y amabilidad",
            "Solo hablas con algunos",
            "Los criticas"
        ],
        correct: 1
    },
    {
        q: "Si cometes un error en el trabajo, ¿qué haces?",
        options: [
            "Lo ocultas",
            "Lo reconoces y buscas solución",
            "Culpas a otro",
            "Renuncias"
        ],
        correct: 1
    }
];

// PREGUNTAS - NIVEL DIFÍCIL (POST-TEST)
const questionsHard = [
    {
        q: "¿Cuál es el elemento fundamental para desarrollar inteligencia emocional en el ámbito laboral?",
        options: [
            "Conocer las políticas de la empresa",
            "Desarrollar autoconciencia y empatía con los demás",
            "Memorizar procedimientos técnicos",
            "Evitar conflictos a toda costa"
        ],
        correct: 1
    },
    {
        q: "En una situación de conflicto entre dos departamentos, ¿cuál es el enfoque más profesional?",
        options: [
            "Esperar que el gerente resuelva el problema",
            "Facilitar una comunicación asertiva y buscar soluciones ganar-ganar",
            "Tomar partido por un departamento",
            "Documentar todo para protegerse legalmente"
        ],
        correct: 1
    },
    {
        q: "¿Qué estrategia de gestión del tiempo es más efectiva para maximizar la productividad?",
        options: [
            "Hacer multitarea constantemente",
            "Priorizar tareas usando la matriz de Eisenhower (urgente/importante)",
            "Trabajar en orden de llegada de solicitudes",
            "Delegar todas las tareas complejas"
        ],
        correct: 1
    },
    {
        q: "¿Cómo se demuestra liderazgo situacional efectivo?",
        options: [
            "Manteniendo un estilo de dirección constante",
            "Adaptando el estilo de liderazgo según la madurez del equipo",
            "Siendo siempre autoritario",
            "Dejando que el equipo se autogestione completamente"
        ],
        correct: 1
    },
    {
        q: "En una negociación profesional, ¿cuál es la técnica más efectiva?",
        options: [
            "Ceder en todos los puntos para mantener la relación",
            "Preparar alternativas (BATNA) y buscar intereses comunes",
            "Mantener una posición rígida",
            "Usar presión y ultimátums"
        ],
        correct: 1
    },
    {
        q: "¿Qué caracteriza a una cultura organizacional de alto rendimiento?",
        options: [
            "Competencia interna extrema",
            "Confianza, colaboración y aprendizaje continuo",
            "Horarios extensos de trabajo",
            "Jerarquías rígidas"
        ],
        correct: 1
    },
    {
        q: "¿Cómo se gestiona efectivamente el cambio organizacional?",
        options: [
            "Implementarlo rápidamente sin consultar",
            "Comunicar claramente, involucrar stakeholders y gestionar resistencias",
            "Cambiar todo de una vez",
            "Mantener solo informados a los gerentes"
        ],
        correct: 1
    },
    {
        q: "¿Qué define la competencia de pensamiento crítico en el trabajo?",
        options: [
            "Criticar constantemente las ideas de otros",
            "Analizar objetivamente información y tomar decisiones fundamentadas",
            "Seguir procedimientos sin cuestionar",
            "Confiar solo en la intuición"
        ],
        correct: 1
    },
    {
        q: "En la gestión de stakeholders, ¿cuál es el enfoque más estratégico?",
        options: [
            "Tratar a todos por igual",
            "Mapear influencia/interés y personalizar la comunicación",
            "Enfocarse solo en stakeholders de alto nivel",
            "Minimizar la comunicación para evitar conflictos"
        ],
        correct: 1
    },
    {
        q: "¿Qué metodología es más efectiva para la mejora continua de procesos?",
        options: [
            "Esperar a que surjan problemas graves",
            "Implementar ciclos PDCA (Plan-Do-Check-Act) sistemáticamente",
            "Hacer cambios solo cuando lo ordene la dirección",
            "Copiar procesos de otras empresas sin adaptación"
        ],
        correct: 1
    },
    {
        q: "¿Cómo se construye capital social en una organización?",
        options: [
            "Asistiendo a todos los eventos sociales",
            "Desarrollando redes de confianza y reciprocidad genuinas",
            "Conociendo a personas influyentes solamente",
            "Compartiendo información confidencial"
        ],
        correct: 1
    },
    {
        q: "¿Qué elemento es crucial para el aprendizaje organizacional?",
        options: [
            "Tener una gran biblioteca corporativa",
            "Crear sistemas para capturar y compartir conocimiento tácito",
            "Contratar solo personal con postgrados",
            "Implementar más cursos obligatorios"
        ],
        correct: 1
    },
    {
        q: "En la toma de decisiones complejas, ¿cuál es el mejor enfoque?",
        options: [
            "Decidir rápidamente basándose en experiencia",
            "Usar pensamiento sistémico considerando interdependencias",
            "Delegar la decisión a un comité",
            "Seguir la decisión de la mayoría siempre"
        ],
        correct: 1
    },
    {
        q: "¿Cómo se mide efectivamente el desempeño en roles complejos?",
        options: [
            "Solo por resultados financieros",
            "Usando KPIs balanceados cuantitativos y cualitativos",
            "Por horas trabajadas",
            "Según opinión del supervisor"
        ],
        correct: 1
    },
    {
        q: "¿Qué define la agilidad organizacional?",
        options: [
            "Trabajar más rápido",
            "Capacidad de adaptación, aprendizaje y respuesta al cambio",
            "Usar metodologías ágiles en todos los proyectos",
            "Eliminar toda la planificación"
        ],
        correct: 1
    }
];

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showModal(message, callback) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('confirmModal').style.display = 'flex';
    modalCallback = callback;
}

function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
    modalCallback = null;
}

function confirmAction() {
    if (modalCallback) modalCallback();
    closeModal();
}

function confirmExit() {
    showModal('¿Deseas salir de la prueba? Perderás tu progreso actual.', () => {
        if (countdownInterval) clearInterval(countdownInterval);
        goToMenu();
    });
}

// ========================================
// TEMA OSCURO
// ========================================

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const icon = document.getElementById('themeIcon');
    if (isDark) {
        icon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
    } else {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
    }
}

// ========================================
// AUTENTICACIÓN
// ========================================

function showLoginTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelectorAll('.tab')[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelectorAll('.tab')[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

function showAdminLogin() {
    showScreen('adminLoginScreen');
}

function backToLogin() {
    showScreen('loginScreen');
}

// Login Usuario
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        document.getElementById('userName').textContent = user.name;
        if (document.getElementById('userName3')) {
            document.getElementById('userName3').textContent = user.name;
        }
        updateAttempts();
        showScreen('welcomeScreen');
        showToast(`¡Bienvenido ${user.name}!`, 'success');
    } else {
        showToast('❌ Correo o contraseña incorrectos', 'error');
    }
});

// Login Admin
document.getElementById('adminLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPassword').value;
    
    if (user === CONFIG.ADMIN_USER && pass === CONFIG.ADMIN_PASS) {
        showScreen('adminDashboard');
        loadDashboardData();
        showToast('Acceso concedido al panel de administrador', 'success');
    } else {
        showToast('❌ Credenciales incorrectas', 'error');
    }
});

// Registro
document.getElementById('registerForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('regName').value,
        lastName: document.getElementById('regLastName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        age: document.getElementById('regAge').value,
        password: document.getElementById('regPassword').value,
        registeredAt: new Date().toISOString()
    };
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === userData.email)) {
        showToast('❌ Este correo ya está registrado', 'error');
        return;
    }
    
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    await sendToGoogleSheets(userData, 'registro');
    
    showToast('✅ Cuenta creada exitosamente', 'success');
    showLoginTab('login');
    document.getElementById('registerForm').reset();
});

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showScreen('loginScreen');
    showToast('Sesión cerrada', 'info');
}

// ========================================
// GOOGLE SHEETS
// ========================================

async function sendToGoogleSheets(data, type) {
    if (isPracticeMode) return true;
    
    try {
        await fetch(CONFIG.GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                data: data,
                timestamp: new Date().toISOString()
            })
        });
        
        return true;
    } catch (error) {
        console.error('Error al enviar datos:', error);
        return false;
    }
}

// ========================================
// SISTEMA DE INTENTOS
// ========================================

function getAttempts(testType) {
    const attempts = JSON.parse(localStorage.getItem('attempts') || '{}');
    const userEmail = currentUser?.email;
    if (!userEmail) return 0;
    
    if (!attempts[userEmail]) attempts[userEmail] = {};
    return attempts[userEmail][testType] || 0;
}

function incrementAttempts(testType) {
    if (isPracticeMode) return;
    
    const attempts = JSON.parse(localStorage.getItem('attempts') || '{}');
    const userEmail = currentUser.email;
    
    if (!attempts[userEmail]) attempts[userEmail] = {};
    attempts[userEmail][testType] = (attempts[userEmail][testType] || 0) + 1;
    
    localStorage.setItem('attempts', JSON.stringify(attempts));
}

function canTakeTest(testType) {
    if (isPracticeMode) return true;
    return getAttempts(testType) < CONFIG.MAX_ATTEMPTS;
}

function updateAttempts() {
    const preAttempts = getAttempts('pre');
    const postAttempts = getAttempts('post');
    
    if (document.getElementById('preAttempts')) {
        document.getElementById('preAttempts').innerHTML = `
            <small>Intentos: ${preAttempts}/${CONFIG.MAX_ATTEMPTS}</small>
        `;
    }
    if (document.getElementById('postAttempts')) {
        document.getElementById('postAttempts').innerHTML = `
            <small>Intentos: ${postAttempts}/${CONFIG.MAX_ATTEMPTS}</small>
        `;
    }
}

// ========================================
// MODO PRÁCTICA
// ========================================

function enablePracticeMode() {
    isPracticeMode = true;
    showToast('🎓 Modo Práctica activado - Los resultados no se guardarán', 'info');
    selectTest('pre');
}

// ========================================
// NAVEGACIÓN
// ========================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function selectTest(type) {
    if (!canTakeTest(type) && !isPracticeMode) {
        showToast(`❌ Has alcanzado el límite de ${CONFIG.MAX_ATTEMPTS} intentos para este test`, 'error');
        return;
    }
    
    currentTestType = type;
    currentDifficulty = type === 'pre' ? 'easy' : 'hard';
    
    const badge = type === 'pre' ? '📝 PRE-TEST' : '✅ POST-TEST';
    if (document.getElementById('testTypeBadge')) {
        document.getElementById('testTypeBadge').textContent = badge;
    }
    if (document.getElementById('testTypeBadge2')) {
        document.getElementById('testTypeBadge2').textContent = badge;
    }
    
    showScreen('testMenuScreen');
}

function goToWelcome() {
    showScreen('welcomeScreen');
    isPracticeMode = false;
    resetAll();
}

function goToMenu() {
    showScreen('testMenuScreen');
    resetCurrentTest();
}

function showProgress() {
    loadUserProgress();
    showScreen('progressScreen');
}

function startTest(testType) {
    startTime = Date.now();
    
    if (testType === 'quiz') {
        currentQuizQuestion = 0;
        quizAnswers = [];
        remainingTime = CONFIG.QUIZ_TIME_LIMIT;
        showScreen('quizScreen');
        loadQuestion();
        startCountdown();
    } else if (testType === 'errors') {
        startErrorDetection();
    } else if (testType === 'builder') {
        startCVBuilder();
    }
}
// ========================================
// TIMER CON CUENTA REGRESIVA
// ========================================

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    const timerElement = document.getElementById('quizTimer');
    if (!timerElement) return;
    
    countdownInterval = setInterval(() => {
        remainingTime--;
        
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (remainingTime === 300) {
            showToast('⚠️ Quedan 5 minutos', 'warning');
        }
        
        if (remainingTime === 60) {
            showToast('⏰ ¡Último minuto!', 'warning');
            timerElement.style.color = '#E86C4A';
            timerElement.parentElement.classList.add('warning');
        }
        
        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            showToast('⏱️ Tiempo agotado', 'error');
            finishQuiz();
        }
    }, 1000);
}

// ========================================
// FUNCIONES DEL CUESTIONARIO
// ========================================

function loadQuestion() {
    const questions = currentDifficulty === 'easy' ? questionsEasy : questionsHard;
    const q = questions[currentQuizQuestion];
    const container = document.getElementById('questionContainer');
    
    if (!container) return;
    
    let html = `
        <div class="question-card">
            <div class="question-text">${currentQuizQuestion + 1}. ${q.q}</div>
            <div class="options">
    `;
    
    q.options.forEach((option, index) => {
        const isSelected = quizAnswers[currentQuizQuestion] === index;
        html += `
            <div class="option ${isSelected ? 'selected' : ''}" onclick="selectOption(${index})">
                ${option}
            </div>
        `;
    });
    
    html += `</div></div>`;
    container.innerHTML = html;
    
    document.getElementById('currentQuestion').textContent = currentQuizQuestion + 1;
    document.getElementById('totalQuestions').textContent = questions.length;
    
    const progress = ((currentQuizQuestion) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressPercentage').textContent = Math.round(progress);
    
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = currentQuizQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente →';
}

function selectOption(index) {
    quizAnswers[currentQuizQuestion] = index;
    loadQuestion();
}

function nextQuestion() {
    const questions = currentDifficulty === 'easy' ? questionsEasy : questionsHard;
    
    if (quizAnswers[currentQuizQuestion] === undefined) {
        showToast('⚠️ Por favor selecciona una respuesta antes de continuar', 'warning');
        return;
    }
    
    currentQuizQuestion++;
    
    if (currentQuizQuestion >= questions.length) {
        finishQuiz();
    } else {
        loadQuestion();
    }
}

function finishQuiz() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    const questions = currentDifficulty === 'easy' ? questionsEasy : questionsHard;
    let correct = 0;
    
    questions.forEach((q, i) => {
        if (quizAnswers[i] === q.correct) correct++;
    });
    
    const score = Math.round((correct / questions.length) * 100);
    
    if (!isPracticeMode) {
        incrementAttempts(currentTestType);
    }
    
    const result = {
        user: currentUser.name,
        email: currentUser.email,
        testType: currentTestType,
        difficulty: currentDifficulty,
        test: 'Cuestionario',
        score: score,
        correctAnswers: correct,
        totalQuestions: questions.length,
        time: Math.floor((Date.now() - startTime) / 1000),
        isPractice: isPracticeMode
    };
    
    lastTestResult = result;
    
    if (!isPracticeMode) {
        saveResult(result);
        sendToGoogleSheets(result, 'resultado');
    }
    
    showResults(score, 'Cuestionario de Competencias Laborales');
}

// ========================================
// GUARDAR Y CARGAR RESULTADOS
// ========================================

function saveResult(result) {
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    results.push({...result, timestamp: new Date().toISOString()});
    localStorage.setItem('results', JSON.stringify(results));
}

function getResults() {
    return JSON.parse(localStorage.getItem('results') || '[]');
}

function getUserResults() {
    const results = getResults();
    return results.filter(r => r.email === currentUser?.email);
}

// ========================================
// PROGRESO DEL USUARIO
// ========================================

function loadUserProgress() {
    const userResults = getUserResults();
    
    const completed = userResults.length;
    const scores = userResults.map(r => r.score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    
    if (document.getElementById('userTestsCompleted')) {
        document.getElementById('userTestsCompleted').textContent = completed;
    }
    if (document.getElementById('userAvgScore')) {
        document.getElementById('userAvgScore').textContent = avgScore + '%';
    }
    if (document.getElementById('userBestScore')) {
        document.getElementById('userBestScore').textContent = bestScore + '%';
    }
    
    const tableBody = document.getElementById('userHistoryTable');
    if (tableBody) {
        if (userResults.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 32px; color: var(--gray-500);">
                        No has completado ninguna evaluación aún
                    </td>
                </tr>
            `;
        } else {
            tableBody.innerHTML = userResults.map(r => `
                <tr>
                    <td>${r.test}</td>
                    <td>${r.testType.toUpperCase()}</td>
                    <td><span class="score-badge ${r.score >= CONFIG.PASSING_SCORE ? 'pass' : 'fail'}">${r.score}%</span></td>
                    <td>${r.time}s</td>
                    <td>${new Date(r.timestamp).toLocaleDateString()}</td>
                    <td>
                        ${r.score >= CONFIG.PASSING_SCORE ? 
                            `<button class="btn-cert" onclick='generateCertificate(${JSON.stringify(r).replace(/'/g, "&apos;")})'>📄 Descargar</button>` : 
                            '<span class="no-cert">No disponible</span>'}
                    </td>
                </tr>
            `).join('');
        }
    }
}

// ========================================
// DASHBOARD ADMIN
// ========================================

function loadDashboardData() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const results = getResults();
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalTests').textContent = results.length;
    
    const scores = results.map(r => r.score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    document.getElementById('avgScore').textContent = avgScore + '%';
    
    const times = results.map(r => r.time);
    const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
    document.getElementById('avgTime').textContent = avgTime + 's';
    
    loadResultsTable(results);
}

function loadResultsTable(results) {
    const tableBody = document.getElementById('resultsTableBody');
    if (!tableBody) return;
    
    if (results.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 32px; color: var(--gray-500);">
                    No hay resultados disponibles
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = results.map((r, index) => `
        <tr>
            <td>${r.user}</td>
            <td>${r.email}</td>
            <td>${r.test}</td>
            <td><span class="test-type-badge ${r.testType}">${r.testType.toUpperCase()}</span></td>
            <td><span class="score-badge ${r.score >= CONFIG.PASSING_SCORE ? 'pass' : 'fail'}">${r.score}%</span></td>
            <td>${r.time}s</td>
            <td>${new Date(r.timestamp).toLocaleDateString()}</td>
            <td><button class="btn-action-small" onclick="deleteResult(${index})">🗑️</button></td>
        </tr>
    `).join('');
}

function refreshDashboard() {
    loadDashboardData();
    showToast('Dashboard actualizado', 'success');
}

function exportToExcel() {
    const results = getResults();
    
    if (results.length === 0) {
        showToast('❌ No hay datos para exportar', 'error');
        return;
    }
    
    const csv = [
        ['Usuario', 'Email', 'Prueba', 'Tipo', 'Puntuación', 'Tiempo', 'Fecha'],
        ...results.map(r => [
            r.user,
            r.email,
            r.test,
            r.testType,
            r.score + '%',
            r.time + 's',
            new Date(r.timestamp).toLocaleString()
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultados_evaluacion_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showToast('✅ Datos exportados correctamente', 'success');
}

function deleteResult(index) {
    showModal('¿Estás seguro de eliminar este resultado?', () => {
        const results = getResults();
        results.splice(index, 1);
        localStorage.setItem('results', JSON.stringify(results));
        loadDashboardData();
        showToast('Resultado eliminado', 'info');
    });
}

// ========================================
// FILTROS DEL DASHBOARD
// ========================================

document.getElementById('searchUser')?.addEventListener('input', function(e) {
    filterResults();
});

document.getElementById('filterTest')?.addEventListener('change', function(e) {
    filterResults();
});

document.getElementById('filterType')?.addEventListener('change', function(e) {
    filterResults();
});

function filterResults() {
    const searchTerm = document.getElementById('searchUser')?.value.toLowerCase() || '';
    const testFilter = document.getElementById('filterTest')?.value || '';
    const typeFilter = document.getElementById('filterType')?.value || '';
    
    let results = getResults();
    
    if (searchTerm) {
        results = results.filter(r => 
            r.user.toLowerCase().includes(searchTerm) || 
            r.email.toLowerCase().includes(searchTerm)
        );
    }
    
    if (testFilter) {
        results = results.filter(r => r.test === testFilter);
    }
    
    if (typeFilter) {
        results = results.filter(r => r.testType === typeFilter);
    }
    
    loadResultsTable(results);
}

// ========================================
// GENERAR CERTIFICADOS PDF
// ========================================

async function downloadCertificate() {
    if (!lastTestResult || lastTestResult.score < CONFIG.PASSING_SCORE) {
        showToast('❌ Necesitas una puntuación de al menos 70% para obtener certificado', 'error');
        return;
    }
    
    generateCertificate(lastTestResult);
}

function generateCertificate(result) {
    if (result.score < CONFIG.PASSING_SCORE) {
        showToast('❌ Necesitas una puntuación de al menos 70% para obtener certificado', 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });
    
    doc.setFillColor(255, 248, 243);
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setDrawColor(232, 108, 74);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(0.5);
    doc.rect(15, 15, 267, 180);
    
    doc.setFontSize(36);
    doc.setTextColor(38, 70, 83);
    doc.setFont(undefined, 'bold');
    doc.text('CERTIFICADO DE APROBACIÓN', 148.5, 40, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(113, 128, 150);
    doc.setFont(undefined, 'normal');
    doc.text('Sistema de Evaluación de Orientación Laboral', 148.5, 52, { align: 'center' });
    
    doc.setDrawColor(244, 162, 97);
    doc.setLineWidth(1);
    doc.line(80, 58, 217, 58);
    
    doc.setFontSize(14);
    doc.setTextColor(74, 85, 104);
    doc.text('Se otorga el presente certificado a:', 148.5, 75, { align: 'center' });
    
    doc.setFontSize(28);
    doc.setTextColor(232, 108, 74);
    doc.setFont(undefined, 'bold');
    doc.text(result.user, 148.5, 95, { align: 'center' });
    
    doc.setDrawColor(232, 108, 74);
    doc.setLineWidth(0.5);
    doc.line(60, 98, 237, 98);
    
    doc.setFontSize(12);
    doc.setTextColor(74, 85, 104);
    doc.setFont(undefined, 'normal');
    doc.text('Por haber completado exitosamente la evaluación:', 148.5, 110, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(38, 70, 83);
    doc.setFont(undefined, 'bold');
    doc.text(`${result.test} - ${result.testType.toUpperCase()}`, 148.5, 122, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(42, 157, 143);
    doc.text(`Puntuación obtenida: ${result.score}%`, 148.5, 135, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setTextColor(113, 128, 150);
    doc.setFont(undefined, 'normal');
    const fecha = new Date(result.timestamp).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    doc.text(`Fecha de emisión: ${fecha}`, 148.5, 148, { align: 'center' });
    
    doc.setLineWidth(0.3);
    doc.line(50, 175, 110, 175);
    doc.line(187, 175, 247, 175);
    
    doc.setFontSize(9);
    doc.setTextColor(113, 128, 150);
    doc.text('Director de Evaluación', 80, 182, { align: 'center' });
    doc.text('Coordinador de Programa', 217, 182, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(160, 174, 192);
    const codigo = `CERT-${result.email.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    doc.text(`Código de verificación: ${codigo}`, 148.5, 195, { align: 'center' });
    
    const filename = `certificado_${result.user.replace(/\s+/g, '_')}_${result.testType}.pdf`;
    doc.save(filename);
    
    showToast('✅ Certificado descargado correctamente', 'success');
}

// ========================================
// RESULTADOS CON RETROALIMENTACIÓN
// ========================================

function showResults(score, testName) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('totalTime').textContent = elapsed;
    document.getElementById('testTypeResult').textContent = currentTestType === 'pre' ? 'PRE-TEST' : 'POST-TEST';
    
    const circle = document.getElementById('scoreCircle');
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    let message = '';
    let icon = '';
    
    if (score >= 90) {
        message = `<p><strong>🎉 ¡Excelente trabajo!</strong></p>
                   <p>Has demostrado un dominio sobresaliente de las competencias evaluadas. Tu desempeño es ejemplar.</p>`;
        icon = '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
    } else if (score >= 70) {
        message = `<p><strong>👍 ¡Muy buen trabajo!</strong></p>
                   <p>Has aprobado la evaluación. Tienes una base sólida en las competencias evaluadas.</p>`;
        icon = '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
    } else if (score >= 50) {
        message = `<p><strong>📚 Sigue practicando</strong></p>
                   <p>Estás cerca de aprobar. Te recomendamos repasar los contenidos y volver a intentarlo.</p>`;
        icon = '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>';
    } else {
        message = `<p><strong>💪 No te desanimes</strong></p>
                   <p>Este es el inicio de tu aprendizaje. Usa el modo práctica para mejorar y vuelve a intentarlo.</p>`;
        icon = '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>';
    }
    
    document.getElementById('resultsIcon').innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${icon}
        </svg>
    `;
    
    document.getElementById('resultsMessage').innerHTML = `
        <p style="font-weight: 700; font-size: 1.1em; color: var(--primary); margin-bottom: 12px;">${testName}</p>
        ${message}
        ${isPracticeMode ? '<p style="color: var(--accent); margin-top: 12px;"><strong>🎓 Modo Práctica</strong> - Este resultado no se guardó</p>' : ''}
    `;
    
    const certBtn = document.getElementById('certBtn');
    if (certBtn) {
        if (score >= CONFIG.PASSING_SCORE && !isPracticeMode) {
            certBtn.style.display = 'flex';
        } else {
            certBtn.style.display = 'none';
        }
    }
    
    showScreen('resultsScreen');
    updateAttempts();
}

// ========================================
// FUNCIONES DE RESET
// ========================================

function resetCurrentTest() {
    if (timerInterval) clearInterval(timerInterval);
    if (countdownInterval) clearInterval(countdownInterval);
    
    currentQuizQuestion = 0;
    quizAnswers = [];
    remainingTime = 0;
}

function resetAll() {
    resetCurrentTest();
    currentTestType = '';
    currentDifficulty = 'easy';
}

// ========================================
// INICIALIZACIÓN
// ========================================

window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
        }
    }
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        const nameEl = document.getElementById('userName');
        if (nameEl) nameEl.textContent = currentUser.name;
        const name3El = document.getElementById('userName3');
        if (name3El) name3El.textContent = currentUser.name;
        updateAttempts();
        showScreen('welcomeScreen');
    }
    
    console.log('✅ Sistema PRO de Evaluación Laboral iniciado');
    console.log('📊 PRE-TEST: ' + questionsEasy.length + ' preguntas');
    console.log('📊 POST-TEST: ' + questionsHard.length + ' preguntas');
});

// ========================================
// NOTIFICACIONES
// ========================================

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23E86C4A"/></svg>'
        });
    }
}

setTimeout(requestNotificationPermission, 3000);

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getFormattedDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ========================================
// MANEJO DE ERRORES
// ========================================

window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.error);
    showToast('⚠️ Ha ocurrido un error. Por favor, recarga la página.', 'error');
});

// ========================================
// EXPORTAR FUNCIONES GLOBALES
// ========================================

window.showLoginTab = showLoginTab;
window.showAdminLogin = showAdminLogin;
window.backToLogin = backToLogin;
window.logout = logout;
window.toggleTheme = toggleTheme;
window.showProgress = showProgress;
window.selectTest = selectTest;
window.goToWelcome = goToWelcome;
window.goToMenu = goToMenu;
window.enablePracticeMode = enablePracticeMode;
window.startTest = startTest;
window.selectOption = selectOption;
window.nextQuestion = nextQuestion;
window.confirmExit = confirmExit;
window.closeModal = closeModal;
window.confirmAction = confirmAction;
window.downloadCertificate = downloadCertificate;
window.generateCertificate = generateCertificate;
window.refreshDashboard = refreshDashboard;
window.exportToExcel = exportToExcel;
window.deleteResult = deleteResult;

// ========================================
// SHORTCUTS DE TECLADO
// ========================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('confirmModal');
        if (modal && modal.style.display === 'flex') {
            closeModal();
        }
    }
    
    if (e.key === 'Enter') {
        const quizScreen = document.getElementById('quizScreen');
        if (quizScreen && quizScreen.classList.contains('active')) {
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) nextBtn.click();
        }
    }
    
    if (['1', '2', '3', '4'].includes(e.key)) {
        const quizScreen = document.getElementById('quizScreen');
        if (quizScreen && quizScreen.classList.contains('active')) {
            const optionIndex = parseInt(e.key) - 1;
            selectOption(optionIndex);
        }
    }
});

// ========================================
// PREVENIR PÉRDIDA DE DATOS
// ========================================

window.addEventListener('beforeunload', function(e) {
    const quizScreen = document.getElementById('quizScreen');
    if (quizScreen && quizScreen.classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro? Perderás el progreso de tu prueba actual.';
        return e.returnValue;
    }
});

// ========================================
// RESPONSIVE
// ========================================

function adjustForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

window.addEventListener('resize', adjustForMobile);
adjustForMobile();

// ========================================
// MODO OFFLINE
// ========================================

window.addEventListener('online', () => {
    showToast('✅ Conexión restaurada', 'success');
});

window.addEventListener('offline', () => {
    showToast('⚠️ Sin conexión a Internet. Algunas funciones pueden no estar disponibles.', 'warning');
});

// ========================================
// BACKUP AUTOMÁTICO
// ========================================

function createBackup() {
    const backup = {
        users: localStorage.getItem('users'),
        results: localStorage.getItem('results'),
        attempts: localStorage.getItem('attempts'),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('backup', JSON.stringify(backup));
    console.log('💾 Backup creado:', new Date().toLocaleString());
}

function restoreBackup() {
    const backup = localStorage.getItem('backup');
    if (backup) {
        const data = JSON.parse(backup);
        localStorage.setItem('users', data.users);
        localStorage.setItem('results', data.results);
        localStorage.setItem('attempts', data.attempts);
        showToast('✅ Backup restaurado correctamente', 'success');
        console.log('♻️ Backup restaurado desde:', data.timestamp);
    } else {
        showToast('❌ No hay backup disponible', 'error');
    }
}

setInterval(createBackup, 30 * 60 * 1000);

// ========================================
// UTILIDADES DE DEPURACIÓN
// ========================================

window.debugSystem = {
    clearAllData: function() {
        if (confirm('¿Estás seguro de eliminar TODOS los datos?')) {
            localStorage.clear();
            location.reload();
        }
    },
    showStorageInfo: function() {
        console.log('📦 Usuarios:', JSON.parse(localStorage.getItem('users') || '[]').length);
        console.log('📊 Resultados:', JSON.parse(localStorage.getItem('results') || '[]').length);
        console.log('🔄 Intentos:', localStorage.getItem('attempts'));
        console.log('👤 Usuario actual:', localStorage.getItem('currentUser'));
    },
    resetAttempts: function() {
        localStorage.removeItem('attempts');
        updateAttempts();
        console.log('✅ Intentos reiniciados');
    },
    unlockAllTests: function() {
        CONFIG.MAX_ATTEMPTS = 999;
        updateAttempts();
        console.log('🔓 Todos los tests desbloqueados');
    }
};

// ========================================
// CONSOLE LOG ESTILIZADO
// ========================================

console.log('%c🎯 Sistema PRO de Evaluación Laboral', 'color: #E86C4A; font-size: 20px; font-weight: bold;');
console.log('%c✅ Sistema completamente cargado y funcional', 'color: #2A9D8F; font-size: 14px;');
console.log('%c📊 PRE-TEST: ' + questionsEasy.length + ' preguntas', 'color: #F4A261;');
console.log('%c📊 POST-TEST: ' + questionsHard.length + ' preguntas', 'color: #F4A261;');
console.log('%c💡 Tip: Escribe "debugSystem" en consola para ver comandos de depuración', 'color: #718096; font-style: italic;');
// ========================================
// DETECTAR ERRORES EN CV
// ========================================

const cvWithErrors = {
    nombre: "Juan Perez",
    email: "juan.perez@gmial.com", // Error: gmial
    telefono: "+502 1234-567", // Error: falta un dígito
    direccion: "Zona 10, Guatemala",
    
    objetivo: "Busco un puesto de trabajo en el area de ventas para poder crecer profecionalemnte.", // Errores de ortografía
    
    experiencia: [
        {
            puesto: "Vendedor",
            empresa: "Tienda XYZ",
            periodo: "2020 - 2022",
            descripcion: "Atencion al cliente y ventas diarias" // Falta tilde
        },
        {
            puesto: "Cajero",
            empresa: "Supermercado ABC", 
            periodo: "2018 - 2020",
            descripcion: "Manejo de caja y atencion al publico" // Faltan tildes
        }
    ],
    
    educacion: [
        {
            titulo: "Bachillerato en Ciencias y Letras",
            institucion: "Colegio San Jose",
            año: "2018" // Debe ser "año"
        }
    ],
    
    habilidades: [
        "Trabajo en equipo",
        "Comunicacion efectiva", // Falta tilde
        "Manejo de Microsoft Ofice", // Error: Ofice
        "Atencion al cliente" // Falta tilde
    ],
    
    referencias: "Disponibles a pedido" // Error: debe ser "solicitud"
};

const errorsToFind = [
    { id: 1, type: 'email', error: 'gmial.com', correct: 'gmail.com', found: false },
    { id: 2, type: 'telefono', error: 'falta dígito', correct: '+502 1234-5678', found: false },
    { id: 3, type: 'objetivo', error: 'area', correct: 'área', found: false },
    { id: 4, type: 'objetivo', error: 'profecionalemnte', correct: 'profesionalmente', found: false },
    { id: 5, type: 'experiencia', error: 'Atencion', correct: 'Atención', found: false },
    { id: 6, type: 'experiencia', error: 'publico', correct: 'público', found: false },
    { id: 7, type: 'habilidades', error: 'Comunicacion', correct: 'Comunicación', found: false },
    { id: 8, type: 'habilidades', error: 'Ofice', correct: 'Office', found: false },
    { id: 9, type: 'habilidades', error: 'Atencion', correct: 'Atención', found: false },
    { id: 10, type: 'referencias', error: 'a pedido', correct: 'a solicitud', found: false }
];

let foundErrors = [];
let errorStartTime;
let errorTimerInterval;

function startErrorDetection() {
    errorStartTime = Date.now();
    foundErrors = [];
    errorsToFind.forEach(e => e.found = false);
    remainingTime = CONFIG.CV_ERRORS_TIME_LIMIT;
    
    showScreen('errorDetectionScreen');
    loadCVWithErrors();
    startErrorTimer();
}

function startErrorTimer() {
    if (errorTimerInterval) clearInterval(errorTimerInterval);
    
    const timerElement = document.getElementById('errorTimer');
    if (!timerElement) return;
    
    errorTimerInterval = setInterval(() => {
        remainingTime--;
        
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (remainingTime === 60) {
            showToast('⏰ ¡Último minuto!', 'warning');
            timerElement.style.color = '#E86C4A';
        }
        
        if (remainingTime <= 0) {
            clearInterval(errorTimerInterval);
            showToast('⏱️ Tiempo agotado', 'error');
            finishErrorDetection();
        }
    }, 1000);
}

function loadCVWithErrors() {
    const container = document.getElementById('cvErrorContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="cv-paper">
            <div class="cv-header">
                <h2 class="cv-name clickable-text" data-error="nombre">${cvWithErrors.nombre}</h2>
                <div class="cv-contact">
                    <p class="clickable-text" data-error="email">📧 ${cvWithErrors.email}</p>
                    <p class="clickable-text" data-error="telefono">📱 ${cvWithErrors.telefono}</p>
                    <p class="clickable-text" data-error="direccion">📍 ${cvWithErrors.direccion}</p>
                </div>
            </div>
            
            <div class="cv-section">
                <h3>Objetivo Profesional</h3>
                <p class="clickable-text" data-error="objetivo">${cvWithErrors.objetivo}</p>
            </div>
            
            <div class="cv-section">
                <h3>Experiencia Laboral</h3>
                ${cvWithErrors.experiencia.map((exp, i) => `
                    <div class="cv-item">
                        <h4>${exp.puesto}</h4>
                        <p><strong>${exp.empresa}</strong> | ${exp.periodo}</p>
                        <p class="clickable-text" data-error="experiencia-${i}">${exp.descripcion}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="cv-section">
                <h3>Educación</h3>
                ${cvWithErrors.educacion.map((edu, i) => `
                    <div class="cv-item">
                        <h4 class="clickable-text" data-error="educacion-${i}">${edu.titulo}</h4>
                        <p><strong>${edu.institucion}</strong> | ${edu.año}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="cv-section">
                <h3>Habilidades</h3>
                <ul class="cv-skills">
                    ${cvWithErrors.habilidades.map((skill, i) => `
                        <li class="clickable-text" data-error="habilidad-${i}">${skill}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="cv-section">
                <h3>Referencias</h3>
                <p class="clickable-text" data-error="referencias">${cvWithErrors.referencias}</p>
            </div>
        </div>
        
        <div class="errors-found-panel">
            <h3>Errores Encontrados: <span id="errorsCount">0</span>/${errorsToFind.length}</h3>
            <div id="errorsList"></div>
        </div>
    `;
    
    // Agregar event listeners a textos clickeables
    document.querySelectorAll('.clickable-text').forEach(element => {
        element.addEventListener('click', function() {
            checkForError(this);
        });
    });
}

function checkForError(element) {
    const text = element.textContent.trim();
    
    // Buscar si el texto contiene algún error
    const foundError = errorsToFind.find(e => !e.found && text.includes(e.error));
    
    if (foundError) {
        foundError.found = true;
        foundErrors.push(foundError);
        element.classList.add('error-found');
        showToast(`✅ ¡Error encontrado! ${foundError.error} → ${foundError.correct}`, 'success');
        updateErrorsPanel();
        
        // Verificar si encontró todos los errores
        if (foundErrors.length === errorsToFind.length) {
            setTimeout(() => {
                finishErrorDetection();
            }, 1000);
        }
    } else {
        element.classList.add('error-wrong');
        showToast('❌ Ese no es un error', 'error');
        setTimeout(() => {
            element.classList.remove('error-wrong');
        }, 500);
    }
}

function updateErrorsPanel() {
    document.getElementById('errorsCount').textContent = foundErrors.length;
    const errorsList = document.getElementById('errorsList');
    
    errorsList.innerHTML = foundErrors.map(e => `
        <div class="error-item">
            <span class="error-wrong-text">${e.error}</span>
            <span class="error-arrow">→</span>
            <span class="error-correct-text">${e.correct}</span>
        </div>
    `).join('');
}

function finishErrorDetection() {
    if (errorTimerInterval) clearInterval(errorTimerInterval);
    
    const timeElapsed = Math.floor((Date.now() - errorStartTime) / 1000);
    const score = Math.round((foundErrors.length / errorsToFind.length) * 100);
    
    if (!isPracticeMode) {
        incrementAttempts(currentTestType);
    }
    
    const result = {
        user: currentUser.name,
        email: currentUser.email,
        testType: currentTestType,
        difficulty: currentDifficulty,
        test: 'Detectar Errores',
        score: score,
        correctAnswers: foundErrors.length,
        totalQuestions: errorsToFind.length,
        time: timeElapsed,
        isPractice: isPracticeMode
    };
    
    lastTestResult = result;
    
    if (!isPracticeMode) {
        saveResult(result);
        sendToGoogleSheets(result, 'resultado');
    }
    
    showResults(score, 'Detección de Errores en CV');
}

// ========================================
// CONSTRUIR CV
// ========================================

let cvBuilderData = {
    personalInfo: {},
    objective: '',
    experience: [],
    education: [],
    skills: [],
    references: ''
};

let cvBuilderStep = 0;
let cvBuilderStartTime;

function startCVBuilder() {
    cvBuilderStartTime = Date.now();
    cvBuilderStep = 0;
    cvBuilderData = {
        personalInfo: {},
        objective: '',
        experience: [],
        education: [],
        skills: [],
        references: ''
    };
    
    showScreen('cvBuilderScreen');
    loadCVBuilderStep();
}

function loadCVBuilderStep() {
    const container = document.getElementById('cvBuilderContainer');
    if (!container) return;
    
    const steps = [
        {
            title: 'Información Personal',
            content: `
                <div class="cv-builder-form">
                    <div class="form-group">
                        <label>Nombre Completo *</label>
                        <input type="text" id="cvName" placeholder="Juan Pérez López" required>
                    </div>
                    <div class="form-group">
                        <label>Correo Electrónico *</label>
                        <input type="email" id="cvEmail" placeholder="juan@email.com" required>
                    </div>
                    <div class="form-group">
                        <label>Teléfono *</label>
                        <input type="tel" id="cvPhone" placeholder="+502 1234-5678" required>
                    </div>
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="cvAddress" placeholder="Ciudad, País">
                    </div>
                </div>
            `
        },
        {
            title: 'Objetivo Profesional',
            content: `
                <div class="cv-builder-form">
                    <div class="form-group">
                        <label>Describe tu objetivo profesional *</label>
                        <textarea id="cvObjective" rows="4" placeholder="Ejemplo: Profesional en busca de oportunidades en el área de..." required></textarea>
                        <small>Describe tus metas y lo que buscas lograr</small>
                    </div>
                </div>
            `
        },
        {
            title: 'Experiencia Laboral',
            content: `
                <div class="cv-builder-form">
                    <div id="experienceList"></div>
                    <button type="button" class="btn-add" onclick="addExperience()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="16"/>
                            <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                        Agregar Experiencia
                    </button>
                </div>
            `
        },
        {
            title: 'Educación',
            content: `
                <div class="cv-builder-form">
                    <div id="educationList"></div>
                    <button type="button" class="btn-add" onclick="addEducation()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="16"/>
                            <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                        Agregar Educación
                    </button>
                </div>
            `
        },
        {
            title: 'Habilidades',
            content: `
                <div class="cv-builder-form">
                    <div class="form-group">
                        <label>Agrega tus habilidades *</label>
                        <input type="text" id="cvSkillInput" placeholder="Ej: Trabajo en equipo">
                        <button type="button" class="btn-add-skill" onclick="addSkill()">Agregar</button>
                    </div>
                    <div id="skillsList" class="skills-tags"></div>
                    <small>Presiona Enter o haz clic en Agregar</small>
                </div>
            `
        },
        {
            title: 'Referencias',
            content: `
                <div class="cv-builder-form">
                    <div class="form-group">
                        <label>Referencias</label>
                        <textarea id="cvReferences" rows="3" placeholder="Disponibles a solicitud"></textarea>
                    </div>
                </div>
            `
        },
        {
            title: 'Vista Previa',
            content: '<div id="cvPreview"></div>'
        }
    ];
    
    const step = steps[cvBuilderStep];
    
    container.innerHTML = `
        <div class="cv-builder-progress">
            <div class="progress-steps">
                ${steps.map((s, i) => `
                    <div class="progress-step ${i === cvBuilderStep ? 'active' : ''} ${i < cvBuilderStep ? 'completed' : ''}">
                        <div class="step-number">${i + 1}</div>
                        <div class="step-title">${s.title}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="cv-builder-content">
            <h2>${step.title}</h2>
            ${step.content}
        </div>
        
        <div class="cv-builder-navigation">
            ${cvBuilderStep > 0 ? '<button class="btn-nav secondary" onclick="previousCVStep()">← Anterior</button>' : '<div></div>'}
            <button class="btn-nav primary" onclick="nextCVStep()">${cvBuilderStep === steps.length - 1 ? 'Finalizar' : 'Siguiente →'}</button>
        </div>
    `;
    
    // Cargar datos guardados si existen
    if (cvBuilderStep === 0 && cvBuilderData.personalInfo.name) {
        document.getElementById('cvName').value = cvBuilderData.personalInfo.name || '';
        document.getElementById('cvEmail').value = cvBuilderData.personalInfo.email || '';
        document.getElementById('cvPhone').value = cvBuilderData.personalInfo.phone || '';
        document.getElementById('cvAddress').value = cvBuilderData.personalInfo.address || '';
    }
    
    if (cvBuilderStep === 4) {
        renderSkills();
    }
    
    if (cvBuilderStep === 6) {
        renderCVPreview();
    }
}

function nextCVStep() {
    if (!validateCVStep()) {
        showToast('⚠️ Por favor completa los campos requeridos', 'warning');
        return;
    }
    
    saveCVStepData();
    
    if (cvBuilderStep === 6) {
        finishCVBuilder();
    } else {
        cvBuilderStep++;
        loadCVBuilderStep();
    }
}

function previousCVStep() {
    saveCVStepData();
    cvBuilderStep--;
    loadCVBuilderStep();
}

function validateCVStep() {
    if (cvBuilderStep === 0) {
        const name = document.getElementById('cvName')?.value.trim();
        const email = document.getElementById('cvEmail')?.value.trim();
        const phone = document.getElementById('cvPhone')?.value.trim();
        return name && email && phone;
    }
    
    if (cvBuilderStep === 1) {
        const objective = document.getElementById('cvObjective')?.value.trim();
        return objective && objective.length >= 20;
    }
    
    if (cvBuilderStep === 4) {
        return cvBuilderData.skills.length >= 3;
    }
    
    return true;
}

function saveCVStepData() {
    if (cvBuilderStep === 0) {
        cvBuilderData.personalInfo = {
            name: document.getElementById('cvName')?.value.trim(),
            email: document.getElementById('cvEmail')?.value.trim(),
            phone: document.getElementById('cvPhone')?.value.trim(),
            address: document.getElementById('cvAddress')?.value.trim()
        };
    }
    
    if (cvBuilderStep === 1) {
        cvBuilderData.objective = document.getElementById('cvObjective')?.value.trim();
    }
    
    if (cvBuilderStep === 5) {
        cvBuilderData.references = document.getElementById('cvReferences')?.value.trim();
    }
}

function addSkill() {
    const input = document.getElementById('cvSkillInput');
    const skill = input.value.trim();
    
    if (skill && !cvBuilderData.skills.includes(skill)) {
        cvBuilderData.skills.push(skill);
        input.value = '';
        renderSkills();
    }
}

function removeSkill(index) {
    cvBuilderData.skills.splice(index, 1);
    renderSkills();
}

function renderSkills() {
    const container = document.getElementById('skillsList');
    if (!container) return;
    
    container.innerHTML = cvBuilderData.skills.map((skill, i) => `
        <span class="skill-tag">
            ${skill}
            <button onclick="removeSkill(${i})">×</button>
        </span>
    `).join('');
}

function renderCVPreview() {
    const container = document.getElementById('cvPreview');
    if (!container) return;
    
    container.innerHTML = `
        <div class="cv-paper preview">
            <div class="cv-header">
                <h2 class="cv-name">${cvBuilderData.personalInfo.name}</h2>
                <div class="cv-contact">
                    <p>📧 ${cvBuilderData.personalInfo.email}</p>
                    <p>📱 ${cvBuilderData.personalInfo.phone}</p>
                    ${cvBuilderData.personalInfo.address ? `<p>📍 ${cvBuilderData.personalInfo.address}</p>` : ''}
                </div>
            </div>
            
            ${cvBuilderData.objective ? `
                <div class="cv-section">
                    <h3>Objetivo Profesional</h3>
                    <p>${cvBuilderData.objective}</p>
                </div>
            ` : ''}
            
            ${cvBuilderData.experience.length > 0 ? `
                <div class="cv-section">
                    <h3>Experiencia Laboral</h3>
                    ${cvBuilderData.experience.map(exp => `
                        <div class="cv-item">
                            <h4>${exp.position}</h4>
                            <p><strong>${exp.company}</strong> | ${exp.period}</p>
                            <p>${exp.description}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${cvBuilderData.education.length > 0 ? `
                <div class="cv-section">
                    <h3>Educación</h3>
                    ${cvBuilderData.education.map(edu => `
                        <div class="cv-item">
                            <h4>${edu.degree}</h4>
                            <p><strong>${edu.institution}</strong> | ${edu.year}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${cvBuilderData.skills.length > 0 ? `
                <div class="cv-section">
                    <h3>Habilidades</h3>
                    <ul class="cv-skills">
                        ${cvBuilderData.skills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${cvBuilderData.references ? `
                <div class="cv-section">
                    <h3>Referencias</h3>
                    <p>${cvBuilderData.references}</p>
                </div>
            ` : ''}
        </div>
    `;
}

function finishCVBuilder() {
    const timeElapsed = Math.floor((Date.now() - cvBuilderStartTime) / 1000);
    
    // Calcular score basado en completitud
    let score = 0;
    if (cvBuilderData.personalInfo.name) score += 20;
    if (cvBuilderData.objective) score += 20;
    if (cvBuilderData.experience.length > 0) score += 20;
    if (cvBuilderData.education.length > 0) score += 20;
    if (cvBuilderData.skills.length >= 3) score += 20;
    
    if (!isPracticeMode) {
        incrementAttempts(currentTestType);
    }
    
    const result = {
        user: currentUser.name,
        email: currentUser.email,
        testType: currentTestType,
        difficulty: currentDifficulty,
        test: 'Construir CV',
        score: score,
        correctAnswers: score / 20,
        totalQuestions: 5,
        time: timeElapsed,
        isPractice: isPracticeMode
    };
    
    lastTestResult = result;
    
    if (!isPracticeMode) {
        saveResult(result);
        sendToGoogleSheets(result, 'resultado');
    }
    
    showResults(score, 'Construcción de CV');
}

// ========================================
// EXPORTAR FUNCIONES GLOBALES
// ========================================

window.startErrorDetection = startErrorDetection;
window.startCVBuilder = startCVBuilder;
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.nextCVStep = nextCVStep;
window.previousCVStep = previousCVStep;
// ========================================
// SIMULADOR DE ENTREVISTA
// ========================================

const interviewQuestions = [
    {
        q: "Cuéntame sobre ti y tu experiencia.",
        options: [
            {
                text: "Me llamo Juan, tengo 25 años, me gusta el fútbol y salir con amigos.",
                score: 1,
                feedback: "Muy informal. En una entrevista debes enfocarte en tu experiencia profesional y habilidades relevantes para el puesto."
            },
            {
                text: "Soy un profesional con 3 años de experiencia en ventas. He trabajado en atención al cliente y logré aumentar las ventas en un 20% en mi último empleo. Me apasiona ayudar a los clientes.",
                score: 5,
                feedback: "¡Excelente! Mencionaste experiencia relevante, logros concretos y mostraste entusiasmo. Muy profesional."
            },
            {
                text: "Pues... he trabajado en varios lugares. Hice de todo un poco.",
                score: 2,
                feedback: "Muy vago. Debes ser específico sobre tu experiencia, roles y logros. Da ejemplos concretos."
            }
        ]
    },
    {
        q: "¿Por qué quieres trabajar en nuestra empresa?",
        options: [
            {
                text: "Porque necesito dinero y me queda cerca de mi casa.",
                score: 1,
                feedback: "Respuesta honesta pero poco profesional. Los empleadores buscan candidatos motivados por el crecimiento y la misión de la empresa."
            },
            {
                text: "Investigué sobre su empresa y me impresiona su compromiso con la innovación y el desarrollo de talento. Mis habilidades en [área] se alinean perfectamente con sus valores.",
                score: 5,
                feedback: "¡Perfecto! Demostraste que investigaste la empresa y cómo tus habilidades aportan valor. Muy profesional."
            },
            {
                text: "Me dijeron que es una buena empresa.",
                score: 2,
                feedback: "Muy genérico. Investiga sobre la empresa y menciona aspectos específicos que te atraen."
            }
        ]
    },
    {
        q: "¿Cuál es tu mayor debilidad?",
        options: [
            {
                text: "Soy perfeccionista, trabajo demasiado duro.",
                score: 2,
                feedback: "Cliché muy común. Los reclutadores reconocen esto como evasivo. Sé más auténtico."
            },
            {
                text: "A veces me cuesta delegar tareas porque quiero asegurarme que todo salga bien. He trabajado en esto participando en cursos de liderazgo y confiando más en mi equipo.",
                score: 5,
                feedback: "¡Excelente! Mencionaste una debilidad real, pero mostraste auto-conciencia y acciones para mejorar."
            },
            {
                text: "Llego tarde frecuentemente y me distraigo fácil.",
                score: 1,
                feedback: "Demasiado honesto puede jugarte en contra. Menciona debilidades que estás trabajando en mejorar."
            }
        ]
    },
    {
        q: "Describe una situación donde tuviste un conflicto con un compañero. ¿Cómo lo resolviste?",
        options: [
            {
                text: "Nunca he tenido conflictos con nadie.",
                score: 1,
                feedback: "Poco creíble. Todos hemos tenido desacuerdos. Es mejor mostrar cómo los manejas profesionalmente."
            },
            {
                text: "Tuve un desacuerdo sobre un proyecto. Pedí una reunión privada, escuché su perspectiva, expliqué la mía y encontramos un punto medio que benefició al proyecto.",
                score: 5,
                feedback: "¡Perfecto! Mostraste madurez, comunicación efectiva y enfoque en soluciones. Respuesta ideal."
            },
            {
                text: "Mi compañero estaba equivocado y se lo dije directamente. Al final tuvieron que darme la razón.",
                score: 2,
                feedback: "Suena confrontativo. Es mejor mostrar empatía, escucha activa y capacidad de colaboración."
            }
        ]
    },
    {
        q: "¿Dónde te ves en 5 años?",
        options: [
            {
                text: "No sé, probablemente haciendo algo diferente.",
                score: 1,
                feedback: "Muestra falta de ambición y planificación. Los empleadores buscan candidatos con metas claras."
            },
            {
                text: "Me veo liderando un equipo en esta área, habiendo desarrollado habilidades en [X] y contribuyendo al crecimiento de la empresa.",
                score: 5,
                feedback: "¡Excelente! Mostraste ambición realista, alineada con la empresa y con un plan de crecimiento."
            },
            {
                text: "Dirigiendo mi propio negocio.",
                score: 2,
                feedback: "Puede hacer pensar que no estás comprometido a largo plazo con la empresa. Enfócate en tu crecimiento dentro de la organización."
            }
        ]
    },
    {
        q: "¿Por qué dejaste tu último empleo?",
        options: [
            {
                text: "Mi jefe era terrible y mis compañeros no ayudaban.",
                score: 1,
                feedback: "Nunca hables mal de empleadores anteriores. Muestra falta de profesionalismo."
            },
            {
                text: "Busco nuevos desafíos y oportunidades de crecimiento. Aprendí mucho en mi anterior posición y ahora busco aplicar esas habilidades en un rol más desafiante.",
                score: 5,
                feedback: "¡Perfecto! Positivo, enfocado en el futuro y muestra ambición profesional sin criticar."
            },
            {
                text: "Me despidieron.",
                score: 2,
                feedback: "Si es verdad, se honesto pero breve. Enfócate en lo que aprendiste y tu preparación para el nuevo rol."
            }
        ]
    },
    {
        q: "¿Cómo manejas el estrés y la presión?",
        options: [
            {
                text: "No me estreso, trabajo bien bajo presión.",
                score: 2,
                feedback: "Poco realista. Es mejor mostrar estrategias concretas de manejo del estrés."
            },
            {
                text: "Priorizo tareas, hago listas, tomo pequeños descansos y me comunico con mi equipo. En mi último trabajo logré cumplir 15 proyectos simultáneos usando estas estrategias.",
                score: 5,
                feedback: "¡Excelente! Técnicas concretas con ejemplo real. Muestra auto-gestión y resultados."
            },
            {
                text: "Me estreso mucho y a veces no puedo dormir.",
                score: 1,
                feedback: "Demasiado honesto negativamente. Enfócate en tus estrategias positivas de manejo."
            }
        ]
    },
    {
        q: "¿Qué te hace el candidato ideal para este puesto?",
        options: [
            {
                text: "Porque soy trabajador y responsable.",
                score: 2,
                feedback: "Muy genérico. Da ejemplos específicos de habilidades y logros relevantes al puesto."
            },
            {
                text: "Mi experiencia de 2 años en [área], combinada con mi certificación en [X] y mi track record de [logro específico], me hacen ideal. Además, comparto los valores de la empresa.",
                score: 5,
                feedback: "¡Perfecto! Específico, con evidencia, alineado al puesto y a la cultura de la empresa."
            },
            {
                text: "Ustedes saben mejor que yo si soy ideal o no.",
                score: 1,
                feedback: "Muestra inseguridad. Este es tu momento para venderte profesionalmente."
            }
        ]
    },
    {
        q: "¿Prefieres trabajar solo o en equipo?",
        options: [
            {
                text: "Prefiero trabajar solo porque trabajo más rápido.",
                score: 2,
                feedback: "Puede sonar poco colaborativo. La mayoría de trabajos requieren trabajo en equipo."
            },
            {
                text: "Me adapto a ambos. Puedo trabajar independientemente en tareas que lo requieren, pero valoro el trabajo en equipo para proyectos complejos donde diferentes perspectivas enriquecen el resultado.",
                score: 5,
                feedback: "¡Excelente! Muestra flexibilidad, madurez y comprensión de cuándo cada enfoque es apropiado."
            },
            {
                text: "Siempre en equipo, no me gusta trabajar solo.",
                score: 2,
                feedback: "Puede sonar dependiente. Es importante mostrar que puedes ser autónomo también."
            }
        ]
    },
    {
        q: "¿Tienes alguna pregunta para nosotros?",
        options: [
            {
                text: "No, creo que está todo claro.",
                score: 1,
                feedback: "Error común. No hacer preguntas muestra falta de interés. Siempre prepara 2-3 preguntas inteligentes."
            },
            {
                text: "Sí, ¿cómo es un día típico en este rol? ¿Qué oportunidades de desarrollo profesional ofrecen? ¿Cuáles son los mayores desafíos del equipo actualmente?",
                score: 5,
                feedback: "¡Perfecto! Preguntas inteligentes que muestran interés genuino, pensamiento estratégico y enfoque en el futuro."
            },
            {
                text: "¿Cuánto es el salario y cuántos días de vacaciones tengo?",
                score: 2,
                feedback: "Aunque son preguntas válidas, en la primera entrevista enfócate en el rol y la empresa. Habla de compensación en etapas posteriores."
            }
        ]
    }
];

let currentInterviewQuestion = 0;
let interviewAnswers = [];
let interviewStartTime;

function startInterviewSimulator() {
    interviewStartTime = Date.now();
    currentInterviewQuestion = 0;
    interviewAnswers = [];
    
    const badge = currentTestType === 'pre' ? '📝 PRE-TEST' : '✅ POST-TEST';
    if (document.getElementById('testTypeBadge5')) {
        document.getElementById('testTypeBadge5').textContent = badge;
    }
    
    showScreen('interviewSimulatorScreen');
    loadInterviewQuestion();
}

function loadInterviewQuestion() {
    const question = interviewQuestions[currentInterviewQuestion];
    
    document.getElementById('interviewQuestion').textContent = question.q;
    document.getElementById('interviewCurrentQ').textContent = currentInterviewQuestion + 1;
    document.getElementById('interviewTotalQ').textContent = interviewQuestions.length;
    
    const progress = (currentInterviewQuestion / interviewQuestions.length) * 100;
    document.getElementById('interviewProgressBar').style.width = progress + '%';
    
    const optionsContainer = document.getElementById('interviewOptions');
    optionsContainer.innerHTML = question.options.map((option, index) => `
        <div class="interview-option" onclick="selectInterviewOption(${index})">
            ${option.text}
        </div>
    `).join('');
    
    document.getElementById('interviewFeedback').style.display = 'none';
    document.getElementById('interviewNextBtn').disabled = true;
}

function selectInterviewOption(index) {
    const question = interviewQuestions[currentInterviewQuestion];
    const selectedOption = question.options[index];
    
    interviewAnswers.push({
        question: question.q,
        answer: selectedOption.text,
        score: selectedOption.score,
        feedback: selectedOption.feedback
    });
    
    const options = document.querySelectorAll('.interview-option');
    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === index) {
            opt.classList.add('selected');
            if (selectedOption.score >= 4) {
                opt.classList.add('correct');
            } else if (selectedOption.score <= 2) {
                opt.classList.add('incorrect');
            }
        }
    });
    
    const feedbackDiv = document.getElementById('interviewFeedback');
    feedbackDiv.style.display = 'block';
    document.getElementById('feedbackText').textContent = selectedOption.feedback;
    document.getElementById('feedbackPoints').textContent = `+${selectedOption.score * 20} puntos`;
    
    document.getElementById('interviewNextBtn').disabled = false;
}

function nextInterviewQuestion() {
    currentInterviewQuestion++;
    
    if (currentInterviewQuestion >= interviewQuestions.length) {
        finishInterviewSimulator();
    } else {
        loadInterviewQuestion();
    }
}

function finishInterviewSimulator() {
    const timeElapsed = Math.floor((Date.now() - interviewStartTime) / 1000);
    const totalScore = interviewAnswers.reduce((sum, ans) => sum + ans.score, 0);
    const maxScore = interviewQuestions.length * 5;
    const scorePercentage = Math.round((totalScore / maxScore) * 100);
    
    if (!isPracticeMode) {
        incrementAttempts(currentTestType);
    }
    
    const result = {
        user: currentUser.name,
        email: currentUser.email,
        testType: currentTestType,
        difficulty: currentDifficulty,
        test: 'Simulador de Entrevista',
        score: scorePercentage,
        correctAnswers: totalScore,
        totalQuestions: maxScore,
        time: timeElapsed,
        isPractice: isPracticeMode,
        details: interviewAnswers
    };
    
    lastTestResult = result;
    
    if (!isPracticeMode) {
        saveResult(result);
        sendToGoogleSheets(result, 'resultado');
    }
    
    showResults(scorePercentage, 'Simulador de Entrevista Laboral');
}

// Actualizar la función startTest para incluir interview
function startTest(testType) {
    startTime = Date.now();
    
    if (testType === 'quiz') {
        currentQuizQuestion = 0;
        quizAnswers = [];
        remainingTime = CONFIG.QUIZ_TIME_LIMIT;
        showScreen('quizScreen');
        loadQuestion();
        startCountdown();
    } else if (testType === 'errors') {
        startErrorDetection();
    } else if (testType === 'builder') {
        startCVBuilder();
    } else if (testType === 'interview') {
        startInterviewSimulator();
    }
}

// Exportar funciones
window.startInterviewSimulator = startInterviewSimulator;
window.selectInterviewOption = selectInterviewOption;
window.nextInterviewQuestion = nextInterviewQuestion;

console.log('✅ Simulador de Entrevista cargado');
// ========================================
// SISTEMA DE DESAFÍOS Y COMPETENCIAS
// ========================================

// Definición de desafíos diarios
const dailyChallenges = [
    {
        id: 'daily_1',
        icon: '🎯',
        title: 'Primera Prueba del Día',
        description: 'Completa cualquier prueba hoy',
        xp: 50,
        progress: 0,
        target: 1,
        action: 'complete_test'
    },
    {
        id: 'daily_2',
        icon: '🔥',
        title: 'Racha Activa',
        description: 'Entra al sistema 3 días consecutivos',
        xp: 100,
        progress: 0,
        target: 3,
        action: 'login_streak'
    },
    {
        id: 'daily_3',
        icon: '⭐',
        title: 'Perfeccionista',
        description: 'Obtén 100% en cualquier prueba',
        xp: 150,
        progress: 0,
        target: 1,
        action: 'perfect_score'
    },
    {
        id: 'daily_4',
        icon: '💪',
        title: 'Modo Práctica',
        description: 'Completa 2 pruebas en modo práctica',
        xp: 75,
        progress: 0,
        target: 2,
        action: 'practice_mode'
    }
];

// Definición de desafíos semanales
const weeklyChallenges = [
    {
        id: 'weekly_1',
        icon: '🏆',
        title: 'Maestro de Pruebas',
        description: 'Completa 10 pruebas esta semana',
        xp: 500,
        progress: 0,
        target: 10,
        action: 'complete_tests_weekly'
    },
    {
        id: 'weekly_2',
        icon: '🎓',
        title: 'Estudiante Dedicado',
        description: 'Entra al sistema 7 días seguidos',
        xp: 750,
        progress: 0,
        target: 7,
        action: 'login_daily'
    },
    {
        id: 'weekly_3',
        icon: '🌟',
        title: 'Top Scorer',
        description: 'Mantén un promedio de 85% o más',
        xp: 600,
        progress: 0,
        target: 85,
        action: 'maintain_average'
    },
    {
        id: 'weekly_4',
        icon: '🎯',
        title: 'Completista',
        description: 'Prueba los 3 tipos de evaluación',
        xp: 400,
        progress: 0,
        target: 3,
        action: 'try_all_tests'
    }
];

// Definición de badges (insignias)
const availableBadges = [
    { id: 'first_test', icon: '🎯', name: 'Primer Paso', description: 'Completaste tu primera prueba', unlocked: false },
    { id: 'perfect_score', icon: '💯', name: 'Perfección', description: 'Obtuviste 100% en una prueba', unlocked: false },
    { id: 'week_streak', icon: '🔥', name: 'En Racha', description: '7 días consecutivos de actividad', unlocked: false },
    { id: 'level_5', icon: '⭐', name: 'Estrella', description: 'Alcanzaste el nivel 5', unlocked: false },
    { id: 'level_10', icon: '💎', name: 'Diamante', description: 'Alcanzaste el nivel 10', unlocked: false },
    { id: 'master', icon: '👑', name: 'Maestro', description: 'Completaste todas las pruebas', unlocked: false },
    { id: 'practice_10', icon: '📚', name: 'Dedicado', description: '10 pruebas en modo práctica', unlocked: false },
    { id: 'top_rank', icon: '🏆', name: 'Campeón', description: 'Llegaste al top 3 del ranking', unlocked: false }
];

// Niveles y XP requerido
const levelThresholds = [
    0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 
    4000, 5000, 6200, 7600, 9200, 11000, 13000, 15500, 18500, 22000
];

// Variables globales - Estructura de datos del usuario
let userChallengeData = {
    xp: 0,
    level: 1,
    badges: [],
    streak: 0,
    lastLogin: null,
    dailyProgress: {},
    weeklyProgress: {},
    completedTests: 0,
    practiceTests: 0,
    testTypes: new Set(),
    scores: [],
    lastDailyReset: null,
    lastWeeklyReset: null
};

// ========================================
// INICIALIZACIÓN Y CARGA DE DATOS
// ========================================

function initializeChallengesSystem() {
    loadUserChallengeData();
    checkLoginStreak();
    checkDailyReset();
    checkWeeklyReset();
    updateAllUI();
}

function loadUserChallengeData() {
    const saved = localStorage.getItem('userChallengeData');
    if (saved) {
        const parsed = JSON.parse(saved);
        userChallengeData = {
            ...parsed,
            testTypes: new Set(parsed.testTypes || [])
        };
    }
}

function saveUserChallengeData() {
    const toSave = {
        ...userChallengeData,
        testTypes: Array.from(userChallengeData.testTypes)
    };
    localStorage.setItem('userChallengeData', JSON.stringify(toSave));
}

// ========================================
// GESTIÓN DE RACHA Y RESETEOS
// ========================================

function checkLoginStreak() {
    const today = new Date().toDateString();
    const lastLogin = userChallengeData.lastLogin;
    
    if (!lastLogin) {
        userChallengeData.streak = 1;
    } else {
        const lastDate = new Date(lastLogin);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            userChallengeData.streak++;
            updateChallengeProgress('login_streak', userChallengeData.streak);
        } else if (diffDays > 1) {
            userChallengeData.streak = 1;
        }
    }
    
    userChallengeData.lastLogin = today;
    saveUserChallengeData();
}

function checkDailyReset() {
    const today = new Date().toDateString();
    if (userChallengeData.lastDailyReset !== today) {
        userChallengeData.dailyProgress = {};
        userChallengeData.lastDailyReset = today;
        saveUserChallengeData();
    }
}

function checkWeeklyReset() {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekKey = weekStart.toDateString();
    
    if (userChallengeData.lastWeeklyReset !== weekKey) {
        userChallengeData.weeklyProgress = {};
        userChallengeData.lastWeeklyReset = weekKey;
        saveUserChallengeData();
    }
}

// ========================================
// SISTEMA DE XP Y NIVELES
// ========================================

function addXP(amount) {
    userChallengeData.xp += amount;
    
    const newLevel = calculateLevel(userChallengeData.xp);
    const oldLevel = userChallengeData.level;
    
    if (newLevel > oldLevel) {
        userChallengeData.level = newLevel;
        onLevelUp(newLevel);
        checkLevelBadges(newLevel);
    }
    
    saveUserChallengeData();
    updateLevelUI();
    
    showXPNotification(amount);
}

function calculateLevel(xp) {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (xp >= levelThresholds[i]) {
            return i + 1;
        }
    }
    return 1;
}

function getXPForNextLevel() {
    const currentLevel = userChallengeData.level;
    if (currentLevel >= levelThresholds.length) {
        return levelThresholds[levelThresholds.length - 1];
    }
    return levelThresholds[currentLevel];
}

function getXPProgress() {
    const currentLevel = userChallengeData.level;
    const currentXP = userChallengeData.xp;
    const currentThreshold = levelThresholds[currentLevel - 1];
    const nextThreshold = getXPForNextLevel();
    
    const progress = currentXP - currentThreshold;
    const required = nextThreshold - currentThreshold;
    
    return { progress, required, percentage: (progress / required) * 100 };
}

// ========================================
// GESTIÓN DE DESAFÍOS
// ========================================

function updateChallengeProgress(action, value = 1) {
    // Actualizar desafíos diarios
    dailyChallenges.forEach(challenge => {
        if (challenge.action === action) {
            const key = challenge.id;
            if (!userChallengeData.dailyProgress[key]) {
                userChallengeData.dailyProgress[key] = 0;
            }
            
            if (action === 'login_streak') {
                userChallengeData.dailyProgress[key] = value;
            } else {
                userChallengeData.dailyProgress[key] += value;
            }
            
            checkChallengeCompletion(challenge, userChallengeData.dailyProgress[key], 'daily');
        }
    });
    
    // Actualizar desafíos semanales
    weeklyChallenges.forEach(challenge => {
        if (challenge.action === action) {
            const key = challenge.id;
            if (!userChallengeData.weeklyProgress[key]) {
                userChallengeData.weeklyProgress[key] = 0;
            }
            
            if (action === 'maintain_average') {
                userChallengeData.weeklyProgress[key] = value;
            } else if (action === 'login_daily') {
                userChallengeData.weeklyProgress[key] = userChallengeData.streak;
            } else {
                userChallengeData.weeklyProgress[key] += value;
            }
            
            checkChallengeCompletion(challenge, userChallengeData.weeklyProgress[key], 'weekly');
        }
    });
    
    saveUserChallengeData();
    updateChallengesUI();
}

function checkChallengeCompletion(challenge, progress, type) {
    if (progress >= challenge.target) {
        const completedKey = `${type}_${challenge.id}_completed`;
        const alreadyCompleted = localStorage.getItem(completedKey);
        
        if (!alreadyCompleted) {
            addXP(challenge.xp);
            showChallengeCompletedNotification(challenge);
            localStorage.setItem(completedKey, 'true');
        }
    }
}

// ========================================
// GESTIÓN DE BADGES
// ========================================

function unlockBadge(badgeId) {
    const badge = availableBadges.find(b => b.id === badgeId);
    if (badge && !badge.unlocked && !userChallengeData.badges.includes(badgeId)) {
        badge.unlocked = true;
        userChallengeData.badges.push(badgeId);
        saveUserChallengeData();
        showBadgeUnlockedNotification(badge);
        updateBadgesUI();
    }
}

function checkLevelBadges(level) {
    if (level >= 5) unlockBadge('level_5');
    if (level >= 10) unlockBadge('level_10');
}

// ========================================
// EVENTOS DE PRUEBAS
// ========================================

function onTestCompleted(score, testType, isPractice = false) {
    userChallengeData.completedTests++;
    userChallengeData.scores.push(score);
    userChallengeData.testTypes.add(testType);
    
    // Actualizar desafíos
    updateChallengeProgress('complete_test', 1);
    updateChallengeProgress('complete_tests_weekly', 1);
    
    if (isPractice) {
        userChallengeData.practiceTests++;
        updateChallengeProgress('practice_mode', 1);
    }
    
    if (score === 100) {
        updateChallengeProgress('perfect_score', 1);
        unlockBadge('perfect_score');
    }
    
    // Calcular promedio
    const average = userChallengeData.scores.reduce((a, b) => a + b, 0) / userChallengeData.scores.length;
    updateChallengeProgress('maintain_average', Math.round(average));
    
    // Verificar si probó todos los tipos
    updateChallengeProgress('try_all_tests', userChallengeData.testTypes.size);
    
    // Verificar badges
    if (userChallengeData.completedTests === 1) {
        unlockBadge('first_test');
    }
    if (userChallengeData.practiceTests >= 10) {
        unlockBadge('practice_10');
    }
    if (userChallengeData.streak >= 7) {
        unlockBadge('week_streak');
    }
    
    saveUserChallengeData();
}

function onLevelUp(newLevel) {
    showLevelUpNotification(newLevel);
}

// ========================================
// ACTUALIZACIÓN DE UI
// ========================================

function updateAllUI() {
    updateLevelUI();
    updateChallengesUI();
    updateBadgesUI();
    updateStreakUI();
}

function updateLevelUI() {
    const xpProgress = getXPProgress();
    console.log(`Nivel ${userChallengeData.level} | XP: ${xpProgress.progress}/${xpProgress.required} (${xpProgress.percentage.toFixed(1)}%)`);
}

function updateChallengesUI() {
    console.log('=== DESAFÍOS DIARIOS ===');
    dailyChallenges.forEach(challenge => {
        const progress = userChallengeData.dailyProgress[challenge.id] || 0;
        console.log(`${challenge.icon} ${challenge.title}: ${progress}/${challenge.target}`);
    });
    
    console.log('\n=== DESAFÍOS SEMANALES ===');
    weeklyChallenges.forEach(challenge => {
        const progress = userChallengeData.weeklyProgress[challenge.id] || 0;
        console.log(`${challenge.icon} ${challenge.title}: ${progress}/${challenge.target}`);
    });
}

function updateBadgesUI() {
    console.log('\n=== INSIGNIAS ===');
    availableBadges.forEach(badge => {
        const unlocked = userChallengeData.badges.includes(badge.id);
        console.log(`${badge.icon} ${badge.name}: ${unlocked ? '✓ Desbloqueada' : '🔒 Bloqueada'}`);
    });
}

function updateStreakUI() {
    console.log(`\n🔥 Racha actual: ${userChallengeData.streak} días`);
}

// ========================================
// NOTIFICACIONES
// ========================================

function showXPNotification(amount) {
    console.log(`✨ +${amount} XP ganados!`);
}

function showChallengeCompletedNotification(challenge) {
    console.log(`🎉 ¡Desafío completado! ${challenge.icon} ${challenge.title} (+${challenge.xp} XP)`);
}

function showBadgeUnlockedNotification(badge) {
    console.log(`🏅 ¡Nueva insignia desbloqueada! ${badge.icon} ${badge.name}: ${badge.description}`);
}

function showLevelUpNotification(newLevel) {
    console.log(`🎊 ¡Subiste de nivel! Ahora eres nivel ${newLevel}`);
}

// ========================================
// API PÚBLICA
// ========================================

const ChallengesAPI = {
    init: initializeChallengesSystem,
    onTestCompleted,
    addXP,
    getUserData: () => ({ ...userChallengeData }),
    resetProgress: () => {
        userChallengeData = {
            xp: 0,
            level: 1,
            badges: [],
            streak: 0,
            lastLogin: null,
            dailyProgress: {},
            weeklyProgress: {},
            completedTests: 0,
            practiceTests: 0,
            testTypes: new Set(),
            scores: [],
            lastDailyReset: null,
            lastWeeklyReset: null
        };
        localStorage.clear();
        saveUserChallengeData();
        updateAllUI();
    }
};

// Inicializar automáticamente
initializeChallengesSystem();

// Exportar API
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChallengesAPI;
}

// ========================================
// CREADOR DE AVATAR ANIMADO
// ========================================

let currentAvatar = {
    skinColor: '#F4A261',
    hairStyle: 'short',
    hairColor: '#2D3748',
    clothesColor: '#E86C4A',
    accessory: 'none'
};

// Mostrar pantalla del creador de avatar
function showAvatarCreator() {
    if (!currentUser) {
        showToast('Debes iniciar sesión primero', 'warning');
        return;
    }

    // Cargar avatar guardado si existe
    const savedAvatar = localStorage.getItem(`avatar_${currentUser.email}`);
    if (savedAvatar) {
        currentAvatar = JSON.parse(savedAvatar);
        applyAvatarStyles();
    }

    document.getElementById('userName5').textContent = currentUser.name;
    showScreen('avatarCreatorScreen');
}

// Cambiar color de piel
function changeSkinColor(color) {
    currentAvatar.skinColor = color;
    document.getElementById('avatarHead').setAttribute('fill', color);
    document.getElementById('avatarNeck').setAttribute('fill', color);
    highlightSelected('.color-palette button', event?.target);
}

// Cambiar estilo de cabello
function changeHairStyle(style) {
    const hairGroup = document.getElementById('avatarHair');

    const hairStyles = {
        short: 'M 50 100 Q 50 50 100 50 Q 150 50 150 100 Q 150 70 100 60 Q 50 70 50 100',
        long: 'M 50 100 Q 50 40 100 40 Q 150 40 150 100 Q 150 60 100 50 Q 50 60 50 100 L 60 130 Q 80 135 100 130 Q 120 135 140 130 L 150 100',
        curly: 'M 50 100 Q 40 80 50 60 Q 45 50 55 45 Q 50 40 60 40 Q 55 35 70 35 Q 65 30 80 30 Q 75 25 90 25 Q 85 25 100 25 Q 110 25 110 30 Q 120 30 120 35 Q 130 35 130 40 Q 140 40 140 45 Q 148 45 148 55 Q 155 60 150 70 Q 158 80 150 100',
        bald: ''
    };

    if (style === 'bald') {
        hairGroup.innerHTML = '';
    } else {
        hairGroup.innerHTML = `<path d="${hairStyles[style]}" fill="${currentAvatar.hairColor}"/>`;
    }

    currentAvatar.hairStyle = style;
    highlightSelected('.style-btn', event?.target);
}

// Cambiar color de cabello
function changeHairColor(color) {
    currentAvatar.hairColor = color;
    const hairPath = document.querySelector('#avatarHair path');
    if (hairPath) {
        hairPath.setAttribute('fill', color);
    }
    highlightSelected('.color-palette button', event?.target);
}

// Cambiar color de ropa
function changeClothesColor(color) {
    currentAvatar.clothesColor = color;
    document.getElementById('avatarBody').setAttribute('fill', color);
    highlightSelected('.color-palette button', event?.target);
}

// Toggle accesorios
function toggleAccessory(accessory) {
    currentAvatar.accessory = accessory;
    const accessoriesGroup = document.getElementById('avatarAccessories');

    if (accessory === 'glasses') {
        accessoriesGroup.style.display = 'block';
    } else {
        accessoriesGroup.style.display = 'none';
    }

    highlightSelected('.style-btn', event?.target);
}

// Destacar botón seleccionado
function highlightSelected(selector, target) {
    if (!target) return;
    document.querySelectorAll(selector).forEach(btn => btn.classList.remove('active'));
    target.classList.add('active');
}

// Aplicar estilos de avatar
function applyAvatarStyles() {
    changeSkinColor(currentAvatar.skinColor);
    changeHairStyle(currentAvatar.hairStyle);
    changeHairColor(currentAvatar.hairColor);
    changeClothesColor(currentAvatar.clothesColor);
    toggleAccessory(currentAvatar.accessory);
}

// Animar avatar
function animateAvatar(animationType) {
    const avatarSvg = document.querySelector('.avatar-svg');

    if (animationType === 'blink') {
        avatarSvg.classList.add('animating-blink');
        setTimeout(() => avatarSvg.classList.remove('animating-blink'), 300);
    } else if (animationType === 'smile') {
        const mouth = document.querySelector('#avatarMouth path');
        const originalPath = mouth.getAttribute('d');
        mouth.setAttribute('d', 'M 85 115 Q 100 120 115 115');
        setTimeout(() => mouth.setAttribute('d', originalPath), 1000);
    } else if (animationType === 'talk') {
        avatarSvg.classList.add('animating-talk');
        setTimeout(() => avatarSvg.classList.remove('animating-talk'), 1500);
    }
}

// Guardar avatar
function saveAvatar() {
    if (!currentUser) {
        showToast('Debes iniciar sesión primero', 'error');
        return;
    }

    // Guardar en localStorage
    localStorage.setItem(`avatar_${currentUser.email}`, JSON.stringify(currentAvatar));

    // Actualizar avatar en la navegación
    updateUserAvatar();

    showToast('¡Avatar guardado exitosamente!', 'success');

    // Animar celebración
    animateAvatar('smile');
    setTimeout(() => animateAvatar('blink'), 500);
}

// Actualizar avatar del usuario en la navegación
function updateUserAvatar() {
    // Crear un mini avatar SVG para mostrar en la navegación
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'user-mini-avatar';
    avatarContainer.innerHTML = `
        <svg viewBox="0 0 40 40" style="width: 35px; height: 35px;">
            <circle cx="20" cy="20" r="15" fill="${currentAvatar.skinColor}"/>
            <circle cx="16" cy="18" r="2" fill="#2D3748"/>
            <circle cx="24" cy="18" r="2" fill="#2D3748"/>
            <path d="M 15 25 Q 20 28 25 25" stroke="#2D3748" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
    `;

    // Insertar avatar en la navegación si no existe
    document.querySelectorAll('.nav-user').forEach(navUser => {
        const existingAvatar = navUser.querySelector('.user-mini-avatar');
        if (existingAvatar) {
            existingAvatar.remove();
        }
        navUser.insertBefore(avatarContainer.cloneNode(true), navUser.firstChild);
    });
}

// ========================================
// SIMULADOR DE ENTREVISTA CON AUDIO
// ========================================

let mediaRecorder;
let audioChunks = [];
let recordingInterval;
let recordingStartTime;
let currentInterviewMode = 'options';
let speechSynthesis = window.speechSynthesis;
let speechRecognition = null;
let currentTranscription = '';
let audioAnalysisResult = null;

// Configurar reconocimiento de voz (para transcripción)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = 'es-ES';
}

// Palabras clave por categoría de entrevista
const keywordCategories = {
    responsabilidad: ['responsable', 'compromiso', 'cumplir', 'puntual', 'deber', 'obligación'],
    trabajo_equipo: ['equipo', 'colaborar', 'ayudar', 'cooperar', 'comunicación', 'grupo'],
    liderazgo: ['liderar', 'dirigir', 'guiar', 'motivar', 'delegar', 'supervisar'],
    resolucion: ['resolver', 'solución', 'problema', 'analizar', 'estrategia', 'enfoque'],
    adaptabilidad: ['adaptar', 'cambio', 'flexible', 'aprender', 'ajustar', 'innovar'],
    profesionalismo: ['profesional', 'ético', 'respeto', 'honesto', 'integridad', 'valores'],
    comunicacion: ['comunicar', 'expresar', 'escuchar', 'diálogo', 'feedback', 'presentar'],
    iniciativa: ['iniciativa', 'proactivo', 'proponer', 'crear', 'mejorar', 'innovación']
};

// Cambiar modo de entrevista (opciones vs audio)
function switchInterviewMode(mode) {
    currentInterviewMode = mode;

    // Actualizar tabs
    document.querySelectorAll('.mode-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(mode === 'options' ? 'optionsTab' : 'audioTab').classList.add('active');

    // Actualizar contenido
    document.querySelectorAll('.interview-mode-content').forEach(content => content.classList.remove('active'));
    document.getElementById(mode === 'options' ? 'optionsModeContent' : 'audioModeContent').classList.add('active');

    // Habilitar botón siguiente si está en modo opciones
    if (mode === 'options') {
        document.getElementById('interviewNextBtn').disabled = false;
    } else {
        document.getElementById('interviewNextBtn').disabled = false; // En modo audio siempre puede continuar
    }
}

// Leer pregunta en voz alta
function speakQuestion() {
    const questionText = document.getElementById('interviewQuestion').textContent;
    const btnSpeak = document.getElementById('btnSpeakQuestion');

    if (!speechSynthesis) {
        showToast('Tu navegador no soporta síntesis de voz', 'error');
        return;
    }

    // Detener si ya está hablando
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        btnSpeak.classList.remove('speaking');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    btnSpeak.classList.add('speaking');

    utterance.onend = () => {
        btnSpeak.classList.remove('speaking');
    };

    speechSynthesis.speak(utterance);
}

// Analizar audio con IA
function analyzeAudioResponse(transcription, duration) {
    const analysis = {
        transcription: transcription,
        duration: duration,
        wordCount: transcription.split(' ').filter(w => w.length > 0).length,
        keywordsFound: {},
        score: 0,
        feedback: [],
        level: ''
    };

    // 1. Analizar duración (respuestas entre 30-90 segundos son ideales)
    if (duration < 15) {
        analysis.feedback.push('⚠️ Respuesta muy corta. Intenta desarrollar más tus ideas.');
        analysis.score += 20;
    } else if (duration >= 15 && duration <= 30) {
        analysis.feedback.push('✅ Buena duración, pero podrías dar más detalles.');
        analysis.score += 60;
    } else if (duration > 30 && duration <= 90) {
        analysis.feedback.push('✅ Excelente duración de respuesta.');
        analysis.score += 90;
    } else {
        analysis.feedback.push('⚠️ Respuesta muy larga. Intenta ser más conciso.');
        analysis.score += 50;
    }

    // 2. Analizar palabras clave por categoría
    const lowerTranscription = transcription.toLowerCase();
    let totalKeywords = 0;

    for (const [category, keywords] of Object.entries(keywordCategories)) {
        const found = keywords.filter(kw => lowerTranscription.includes(kw));
        if (found.length > 0) {
            analysis.keywordsFound[category] = found;
            totalKeywords += found.length;
        }
    }

    // 3. Bonus por palabras clave
    if (totalKeywords === 0) {
        analysis.feedback.push('⚠️ No se detectaron palabras clave relevantes.');
        analysis.score += 0;
    } else if (totalKeywords <= 3) {
        analysis.feedback.push('✅ Se detectaron algunas palabras clave.');
        analysis.score += 30;
    } else if (totalKeywords <= 6) {
        analysis.feedback.push('✅ Excelente uso de palabras clave relevantes.');
        analysis.score += 60;
    } else {
        analysis.feedback.push('🌟 Sobresaliente uso de vocabulario profesional.');
        analysis.score += 80;
    }

    // 4. Analizar cantidad de palabras (fluidez)
    if (analysis.wordCount < 20) {
        analysis.feedback.push('⚠️ Respuesta muy breve. Explica más tus ideas.');
    } else if (analysis.wordCount >= 20 && analysis.wordCount <= 50) {
        analysis.feedback.push('✅ Buena cantidad de contenido.');
        analysis.score += 40;
    } else if (analysis.wordCount > 50 && analysis.wordCount <= 150) {
        analysis.feedback.push('✅ Excelente desarrollo de ideas.');
        analysis.score += 70;
    } else {
        analysis.feedback.push('⚠️ Demasiado contenido. Sé más directo.');
        analysis.score += 30;
    }

    // 5. Detectar palabras de relleno excesivas
    const fillerWords = ['eh', 'mmm', 'este', 'pues', 'o sea', 'como que'];
    const fillerCount = fillerWords.reduce((count, word) => {
        return count + (lowerTranscription.match(new RegExp(word, 'g')) || []).length;
    }, 0);

    if (fillerCount > 5) {
        analysis.feedback.push('⚠️ Intenta reducir las muletillas (eh, mmm, este, etc.).');
        analysis.score -= 20;
    } else if (fillerCount === 0) {
        analysis.feedback.push('✅ Excelente fluidez verbal sin muletillas.');
        analysis.score += 30;
    }

    // Normalizar score (máximo 100)
    analysis.score = Math.min(100, Math.max(0, Math.round(analysis.score / 3)));

    // Determinar nivel
    if (analysis.score >= 85) {
        analysis.level = 'Excelente';
    } else if (analysis.score >= 70) {
        analysis.level = 'Muy Bueno';
    } else if (analysis.score >= 55) {
        analysis.level = 'Bueno';
    } else if (analysis.score >= 40) {
        analysis.level = 'Regular';
    } else {
        analysis.level = 'Necesita Mejorar';
    }

    return analysis;
}

// Mostrar análisis de audio
function showAudioAnalysis(analysis) {
    const feedbackDiv = document.getElementById('interviewFeedback');
    const feedbackText = document.getElementById('feedbackText');
    const feedbackPoints = document.getElementById('feedbackPoints');

    let keywordsHTML = '';
    if (Object.keys(analysis.keywordsFound).length > 0) {
        keywordsHTML = '<div class="keywords-detected"><h5>🎯 Competencias detectadas:</h5><ul>';
        for (const [category, keywords] of Object.entries(analysis.keywordsFound)) {
            const categoryName = category.replace('_', ' ').toUpperCase();
            keywordsHTML += `<li><strong>${categoryName}:</strong> ${keywords.join(', ')}</li>`;
        }
        keywordsHTML += '</ul></div>';
    }

    feedbackText.innerHTML = `
        <div class="audio-analysis-result">
            <div class="analysis-header">
                <h4>📊 Análisis de tu Respuesta con IA</h4>
            </div>

            <div class="analysis-metrics">
                <div class="metric">
                    <span class="metric-label">⏱️ Duración:</span>
                    <span class="metric-value">${analysis.duration}s</span>
                </div>
                <div class="metric">
                    <span class="metric-label">📝 Palabras:</span>
                    <span class="metric-value">${analysis.wordCount}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">🎯 Palabras clave:</span>
                    <span class="metric-value">${Object.values(analysis.keywordsFound).flat().length}</span>
                </div>
            </div>

            ${keywordsHTML}

            <div class="analysis-feedback">
                <h5>💬 Retroalimentación:</h5>
                <ul>
                    ${analysis.feedback.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>

            <div class="transcription-section">
                <h5>📝 Transcripción:</h5>
                <p class="transcription-text">${analysis.transcription || 'No se pudo transcribir el audio.'}</p>
            </div>
        </div>
    `;

    feedbackPoints.innerHTML = `
        <div class="score-badge-large ${analysis.level.toLowerCase().replace(' ', '-')}">
            <span class="score-number">${analysis.score}</span>
            <span class="score-max">/100</span>
            <span class="score-level">${analysis.level}</span>
        </div>
    `;

    feedbackDiv.style.display = 'block';
}

// Iniciar grabación de audio
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        currentTranscription = '';

        // Iniciar reconocimiento de voz para transcripción
        if (speechRecognition) {
            speechRecognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                currentTranscription = finalTranscript || interimTranscript;
            };

            speechRecognition.start();
        }

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);

            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.src = audioUrl;

            document.getElementById('audioPlayback').style.display = 'block';
            document.getElementById('interviewNextBtn').disabled = false;

            // Analizar la respuesta con IA
            const duration = Math.floor((Date.now() - recordingStartTime) / 1000);
            audioAnalysisResult = analyzeAudioResponse(currentTranscription, duration);

            // Mostrar análisis
            showAudioAnalysis(audioAnalysisResult);
        };

        mediaRecorder.start();

        // UI updates
        document.getElementById('btnStartRecording').disabled = true;
        document.getElementById('btnStopRecording').disabled = false;
        document.getElementById('recordingIndicator').style.display = 'flex';
        document.getElementById('audioPlayback').style.display = 'none';
        document.getElementById('interviewFeedback').style.display = 'none';

        // Iniciar temporizador
        recordingStartTime = Date.now();
        recordingInterval = setInterval(updateRecordingTime, 1000);

        showToast('🎤 Grabación y análisis iniciados', 'success');

    } catch (error) {
        console.error('Error al acceder al micrófono:', error);
        showToast('No se pudo acceder al micrófono. Verifica los permisos.', 'error');
    }
}

// Detener grabación
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());

        // Detener reconocimiento de voz
        if (speechRecognition) {
            try {
                speechRecognition.stop();
            } catch (e) {
                // Ignorar errores si ya está detenido
            }
        }

        document.getElementById('btnStartRecording').disabled = false;
        document.getElementById('btnStopRecording').disabled = true;
        document.getElementById('recordingIndicator').style.display = 'none';

        clearInterval(recordingInterval);

        showToast('🤖 Analizando tu respuesta con IA...', 'info');
    }
}

// Actualizar tiempo de grabación
function updateRecordingTime() {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('recordingTime').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Eliminar grabación
function deleteRecording() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = '';
    document.getElementById('audioPlayback').style.display = 'none';
    document.getElementById('interviewNextBtn').disabled = true;
    audioChunks = [];
    showToast('Grabación eliminada', 'info');
}

// ========================================
// NAVEGACIÓN Y PANTALLAS
// ========================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    // Cargar avatar si el usuario está logueado
    if (currentUser) {
        const savedAvatar = localStorage.getItem(`avatar_${currentUser.email}`);
        if (savedAvatar) {
            currentAvatar = JSON.parse(savedAvatar);
            updateUserAvatar();
        }
    }
}

function goToWelcome() {
    showScreen('welcomeScreen');
}

function goToMenu() {
    showScreen('testMenuScreen');
}

// ========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================

window.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay un usuario logueado
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('userName').textContent = currentUser.name;
        if (document.getElementById('userName3')) {
            document.getElementById('userName3').textContent = currentUser.name;
        }
        if (document.getElementById('userName4')) {
            document.getElementById('userName4').textContent = currentUser.name;
        }
        if (document.getElementById('userName5')) {
            document.getElementById('userName5').textContent = currentUser.name;
        }

        // Cargar avatar si existe
        const savedAvatar = localStorage.getItem(`avatar_${currentUser.email}`);
        if (savedAvatar) {
            currentAvatar = JSON.parse(savedAvatar);
            updateUserAvatar();
        }

        updateAttempts();
        showScreen('welcomeScreen');
    } else {
        showScreen('loginScreen');
    }

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
        }
    }
});
