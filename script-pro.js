// ========================================
// VERSIÓN PRO - SISTEMA COMPLETO
// ========================================

// CONFIGURACIÓN
const CONFIG = {
    // URL de Google Apps Script para sincronizar datos (opcional - deja como está para usar solo localStorage)
    // Para configurar: https://script.google.com/macros/s/TU_SCRIPT_ID/exec
    GOOGLE_SHEET_URL: 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI',
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'admin123',
    MAX_ATTEMPTS: 999, // Sin límite de intentos para pruebas
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
let startTime = null;
let timerInterval = null;
let countdownInterval = null;
let currentDifficulty = 'easy';
let isPracticeMode = false;
let remainingTime = 0;
let modalCallback = null;
let lastTestResult = null;

// FUNCIÓN HELPER PARA OBTENER PREGUNTAS SEGÚN DIFICULTAD
function getQuestionsByDifficulty() {
    switch(currentDifficulty) {
        case 'easy':
            return questionsEasy;
        case 'medium':
            return questionsMedium;
        case 'hard':
            return questionsHard;
        default:
            return questionsEasy;
    }
}

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
    },
    {
        q: "¿Qué significa ser proactivo en el trabajo?",
        options: [
            "Esperar instrucciones",
            "Tomar iniciativa y anticiparse a problemas",
            "Hacer solo lo que te piden",
            "Trabajar más horas"
        ],
        correct: 1
    },
    {
        q: "¿Cómo debes usar el celular en el trabajo?",
        options: [
            "Todo el tiempo para estar conectado",
            "Solo en emergencias o descansos",
            "Cuando el jefe no está mirando",
            "Nunca usarlo"
        ],
        correct: 1
    },
    {
        q: "¿Qué es el respeto en el ambiente laboral?",
        options: [
            "Tener miedo al jefe",
            "Tratar a todos con dignidad y consideración",
            "Hacer lo que otros quieran",
            "No hablar con nadie"
        ],
        correct: 1
    },
    {
        q: "¿Qué debes hacer si recibes crítica constructiva?",
        options: [
            "Enojarte y defenderte",
            "Escuchar y mejorar",
            "Ignorarla",
            "Renunciar"
        ],
        correct: 1
    },
    {
        q: "¿Por qué es importante la higiene personal en el trabajo?",
        options: [
            "No es importante",
            "Muestra profesionalismo y respeto a los demás",
            "Solo importa en trabajos de oficina",
            "Solo si hay clientes"
        ],
        correct: 1
    }
];

// PREGUNTAS - NIVEL MEDIO
const questionsMedium = [
    {
        q: "¿Qué es la comunicación asertiva?",
        options: [
            "Hablar sin pensar",
            "Expresar tus ideas con respeto y claridad",
            "Gritar para que te escuchen",
            "No decir nada para evitar problemas"
        ],
        correct: 1
    },
    {
        q: "¿Cómo manejas el estrés laboral?",
        options: [
            "Ignorándolo",
            "Con técnicas de manejo del tiempo y pausas activas",
            "Quejándote constantemente",
            "Trabajando más horas"
        ],
        correct: 1
    },
    {
        q: "¿Qué es la ética profesional?",
        options: [
            "Hacer lo mínimo necesario",
            "Actuar con honestidad, responsabilidad e integridad",
            "Seguir reglas sin entenderlas",
            "Hacer lo que sea para obtener resultados"
        ],
        correct: 1
    },
    {
        q: "¿Cómo se resuelve un conflicto con un compañero?",
        options: [
            "Evitándolo siempre",
            "Dialogando con respeto y buscando soluciones",
            "Hablando mal de él con otros",
            "Esperando que se resuelva solo"
        ],
        correct: 1
    },
    {
        q: "¿Qué significa tener iniciativa?",
        options: [
            "Hacer cosas sin permiso",
            "Proponer mejoras y actuar sin que te lo pidan",
            "Criticar lo que está mal",
            "Esperar órdenes"
        ],
        correct: 1
    },
    {
        q: "¿Cómo demuestras compromiso con tu trabajo?",
        options: [
            "Llegando a tiempo siempre",
            "Cumpliendo responsabilidades con calidad y dedicación",
            "Trabajando horas extras sin pago",
            "Diciendo que sí a todo"
        ],
        correct: 1
    },
    {
        q: "¿Qué es la adaptabilidad laboral?",
        options: [
            "Hacer siempre lo mismo",
            "Ajustarse a nuevos cambios y situaciones",
            "Resistirse a los cambios",
            "Cambiar de trabajo frecuentemente"
        ],
        correct: 1
    },
    {
        q: "¿Cómo construyes buenas relaciones laborales?",
        options: [
            "Siendo amigo de todos en redes sociales",
            "Con comunicación efectiva, respeto y colaboración",
            "Haciendo favores personales",
            "Evitando a todos"
        ],
        correct: 1
    },
    {
        q: "¿Qué es el trabajo bajo presión?",
        options: [
            "Trabajar enojado",
            "Mantener la calidad en situaciones de alta demanda",
            "Trabajar sin descanso",
            "Pedir ayuda siempre"
        ],
        correct: 1
    },
    {
        q: "¿Por qué es importante la capacitación continua?",
        options: [
            "Para llenar el tiempo",
            "Para actualizar conocimientos y crecer profesionalmente",
            "Solo si la empresa lo exige",
            "No es importante"
        ],
        correct: 1
    },
    {
        q: "¿Qué es la confidencialidad laboral?",
        options: [
            "No hablar con nadie",
            "Proteger información privada de la empresa",
            "Compartir todo con amigos",
            "Solo guardar secretos del jefe"
        ],
        correct: 1
    },
    {
        q: "¿Cómo se da retroalimentación efectiva?",
        options: [
            "Criticando en público",
            "De manera constructiva, específica y privada",
            "Solo mencionando lo negativo",
            "Evitando dar opiniones"
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
    showModal('⚠️ ADVERTENCIA: Si sales ahora, tu calificación será 0 (cero) y se registrará como examen completado. ¿Estás seguro de que deseas salir?', () => {
        // Registrar resultado con nota 0
        if (currentUser && currentTestType && !isPracticeMode) {
            const testNames = {
                'pre': 'Cuestionario PRE-TEST',
                'post': 'Cuestionario POST-TEST',
                'errors': 'Detectar Errores en CV',
                'builder': 'Construir CV',
                'interview': 'Simulador de Entrevista',
                'personality': 'Test de Personalidad',
                'formal': 'Test Formal/Informal',
                'dresscode': 'Código de Vestimenta',
                'wordsearch': 'Sopa de Letras',
                'strengths': 'Fortalezas y Debilidades',
                'codeExam': 'Examen por Código'
            };

            const result = {
                user: currentUser.name,
                email: currentUser.email,
                testType: currentTestType,
                difficulty: currentDifficulty || 'N/A',
                test: testNames[currentTestType] || 'Test',
                score: 0,
                correctAnswers: 0,
                totalQuestions: 0,
                time: Math.floor((Date.now() - startTime) / 1000),
                isPractice: false,
                exitedEarly: true
            };

            saveResult(result);
            incrementAttempts(currentTestType);
        }

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
        showToast('Correo o contraseña incorrectos', 'error');
    }
});

// Login Admin
document.getElementById('adminLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPassword').value;

    // Verificar admin principal
    if (user === CONFIG.ADMIN_USER && pass === CONFIG.ADMIN_PASS) {
        showScreen('adminDashboard');
        loadDashboardData();
        showToast('Acceso concedido al panel de administrador', 'success');
        return;
    }

    // Verificar usuarios con rol de administrador
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminUser = users.find(u => u.email === user && u.password === pass && u.isAdmin === true);

    if (adminUser) {
        showScreen('adminDashboard');
        loadDashboardData();
        showToast(`Bienvenido ${adminUser.name}, acceso concedido`, 'success');
    } else {
        showToast('Credenciales incorrectas', 'error');
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
        registeredAt: new Date().toISOString(),
        isNewUser: true  // Marcar como nuevo usuario
    };

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find(u => u.email === userData.email)) {
        showToast('Este correo ya está registrado', 'error');
        return;
    }

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    await sendToGoogleSheets(userData, 'registro');

    // Autologin del usuario recién registrado
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    document.getElementById('userName').textContent = userData.name;
    if (document.getElementById('userName3')) {
        document.getElementById('userName3').textContent = userData.name;
    }

    showToast('✅ ¡Bienvenido! Vamos a crear tu avatar personalizado', 'success');
    document.getElementById('registerForm').reset();

    // FLUJO MEJORADO: Registro -> Tutorial -> Avatar -> PRE/POST
    setTimeout(() => {
        showOnboarding();  // Mostrar tutorial primero
    }, 500);
});

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showScreen('loginScreen');
    showToast('Sesión cerrada', 'info');
}

// ========================================
// SISTEMA DE ONBOARDING/TUTORIAL
// ========================================

let currentOnboardingStep = 0;
const onboardingSteps = [
    {
        title: '¡Bienvenido a Orientación Laboral!',
        message: 'Te guiaremos paso a paso para que aproveches al máximo la plataforma. Este tutorial te tomará solo 2 minutos.',
        icon: '👋',
        action: null
    },
    {
        title: 'Paso 1: Crea tu Avatar',
        message: 'Personaliza tu avatar para hacerlo único. Será tu imagen de perfil en la plataforma.',
        icon: '🎨',
        action: 'avatar'
    },
    {
        title: 'Paso 2: Evalúate con PRE-TEST o POST-TEST',
        message: 'PRE-TEST: Evaluación inicial antes de capacitarte.\nPOST-TEST: Evaluación final después de aprender.',
        icon: '📝',
        action: null
    },
    {
        title: 'Paso 3: Explora las Herramientas',
        message: 'Accede a simuladores de entrevista, constructor de CV, análisis de personalidad y más.',
        icon: '🛠️',
        action: null
    },
    {
        title: 'Paso 4: Consulta tu Progreso',
        message: 'Revisa tus resultados, estadísticas y desafíos completados en cualquier momento.',
        icon: '📊',
        action: null
    },
    {
        title: '¡Todo Listo!',
        message: 'Ahora estás preparado para comenzar. ¡Mucha suerte en tu camino profesional!',
        icon: '🚀',
        action: 'finish'
    }
];

function showOnboarding() {
    currentOnboardingStep = 0;
    createOnboardingOverlay();
    showOnboardingStep();
}

function createOnboardingOverlay() {
    // Eliminar overlay existente si hay uno
    const existing = document.getElementById('onboardingOverlay');
    if (existing) existing.remove();

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'onboardingOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;

    // Crear modal de onboarding
    const modal = document.createElement('div');
    modal.id = 'onboardingModal';
    modal.style.cssText = `
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        border-radius: 20px;
        padding: 2.5rem;
        max-width: 500px;
        width: 90%;
        color: white;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s ease;
    `;

    modal.innerHTML = `
        <div id="onboardingContent">
            <!-- El contenido se actualizará dinámicamente -->
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function showOnboardingStep() {
    const step = onboardingSteps[currentOnboardingStep];
    const content = document.getElementById('onboardingContent');

    if (!content) return;

    const isFirstStep = currentOnboardingStep === 0;
    const isLastStep = currentOnboardingStep === onboardingSteps.length - 1;

    content.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem;">${step.icon}</div>
        <h2 style="margin-bottom: 1rem; font-size: 1.8rem; font-weight: 700;">${step.title}</h2>
        <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; white-space: pre-line;">${step.message}</p>

        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
            ${!isFirstStep ? `
                <button onclick="previousOnboardingStep()" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid white;
                    color: white;
                    padding: 0.8rem 1.5rem;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.3s;
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    ← Anterior
                </button>
            ` : ''}

            <button onclick="${isLastStep ? 'finishOnboarding()' : 'nextOnboardingStep()'}" style="
                background: white;
                border: none;
                color: var(--primary);
                padding: 0.8rem 2rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 700;
                font-size: 1rem;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 0, 0, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0, 0, 0, 0.2)'">
                ${isLastStep ? '¡Comenzar! 🎉' : 'Siguiente →'}
            </button>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 0.5rem; justify-content: center;">
            ${onboardingSteps.map((_, index) => `
                <div style="
                    width: ${index === currentOnboardingStep ? '30px' : '10px'};
                    height: 10px;
                    background: ${index === currentOnboardingStep ? 'white' : 'rgba(255, 255, 255, 0.3)'};
                    border-radius: 5px;
                    transition: all 0.3s;
                "></div>
            `).join('')}
        </div>

        ${!isLastStep ? `
            <button onclick="skipOnboarding()" style="
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                padding: 0.5rem;
                cursor: pointer;
                font-size: 0.9rem;
                margin-top: 1rem;
                text-decoration: underline;
            " onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255, 255, 255, 0.7)'">
                Saltar tutorial
            </button>
        ` : ''}
    `;
}

function nextOnboardingStep() {
    const step = onboardingSteps[currentOnboardingStep];

    // Ejecutar acción del paso si la hay
    if (step.action === 'avatar') {
        // Cerrar onboarding y abrir creador de avatar
        closeOnboarding();
        setTimeout(() => {
            showAvatarCreatorForNewUser();
        }, 300);
        return;
    }

    if (currentOnboardingStep < onboardingSteps.length - 1) {
        currentOnboardingStep++;
        showOnboardingStep();
    }
}

function previousOnboardingStep() {
    if (currentOnboardingStep > 0) {
        currentOnboardingStep--;
        showOnboardingStep();
    }
}

function skipOnboarding() {
    closeOnboarding();
    markOnboardingAsCompleted();
    showScreen('welcomeScreen');
    showToast('Puedes ver el tutorial en cualquier momento desde el menú', 'info');
}

function finishOnboarding() {
    closeOnboarding();
    markOnboardingAsCompleted();

    // Llevar al usuario a la selección de PRE-TEST/POST-TEST
    setTimeout(() => {
        showScreen('testMenuScreen');
        showToast('💡 Ahora elige PRE-TEST o POST-TEST para comenzar tu evaluación', 'success');
    }, 500);
}

function closeOnboarding() {
    const overlay = document.getElementById('onboardingOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    }
}

function markOnboardingAsCompleted() {
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].onboardingCompleted = true;
            users[userIndex].isNewUser = false;
            localStorage.setItem('users', JSON.stringify(users));
            currentUser.onboardingCompleted = true;
            currentUser.isNewUser = false;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
}

function showAvatarCreatorForNewUser() {
    showAvatarCreator();
    // Agregar mensaje especial para nuevos usuarios
    setTimeout(() => {
        showToast('💡 Personaliza tu avatar y luego haz clic en "Guardar Avatar"', 'info');
    }, 500);
}

// Exportar funciones de onboarding
window.showOnboarding = showOnboarding;
window.nextOnboardingStep = nextOnboardingStep;
window.previousOnboardingStep = previousOnboardingStep;
window.skipOnboarding = skipOnboarding;
window.finishOnboarding = finishOnboarding;

// ========================================
// GOOGLE SHEETS
// ========================================

async function sendToGoogleSheets(data, type) {
    if (isPracticeMode) return true;

    // Validar que la URL de Google Sheets esté configurada correctamente
    if (!CONFIG.GOOGLE_SHEET_URL ||
        CONFIG.GOOGLE_SHEET_URL === 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI' ||
        !CONFIG.GOOGLE_SHEET_URL.startsWith('https://')) {
        console.warn('Google Sheets URL no configurada. Los datos se guardan solo en localStorage.');
        return true; // Retornar true para no bloquear el flujo de la aplicación
    }

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
        console.error('Error al enviar datos a Google Sheets:', error);
        return true; // Retornar true para no bloquear el flujo, los datos están en localStorage
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
    // Sin límite de intentos - siempre permitir
    return true;
}

function updateAttempts() {
    // Desactivado: visualización de intentos para permitir pruebas ilimitadas
    /* const preAttempts = getAttempts('pre');
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
    } */
}

// ========================================
// NAVEGACIÓN
// ========================================

function selectTest(type) {
    // Manejar casos especiales que van directo a su pantalla
    if (type === 'dressCode') {
        currentTestType = 'dressCode';
        showScreen('dressCodeTestScreen');
        return;
    }

    // Sin límite de intentos - eliminada la verificación completamente

    currentTestType = type;
    currentDifficulty = type === 'pre' ? 'easy' : 'hard';

    const badge = type === 'pre' ? 'PRE-TEST' : 'POST-TEST';
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
    } else if (testType === 'interview') {
        startInterviewSimulator();
    } else if (testType === 'personality') {
        const withVideo = confirm('¿Deseas activar la cámara para análisis de video?');
        startPersonalityTest(withVideo);
    } else if (testType === 'formal-informal') {
        startFormalInformalTest();
    } else if (testType === 'dress-code') {
        startDressCodeTest();
    } else if (testType === 'wordsearch') {
        startWordSearch();
    } else if (testType === 'strengths') {
        showScreen('strengthsScreen');
    }
}
// ========================================
// TIMER CON CUENTA REGRESIVA
// ========================================

function startCountdown(timerElementId = 'quizTimer') {
    // Limpiar intervalo anterior siempre
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    const timerElement = document.getElementById(timerElementId);
    if (!timerElement) {
        console.error(`Timer element with id "${timerElementId}" not found`);
        return;
    }

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
            if (timerElement.parentElement) {
                timerElement.parentElement.classList.add('warning');
            }
        }

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            showToast('⏱️ Tiempo agotado', 'error');

            // Determinar qué función finalizar según el timer
            if (timerElementId === 'wordSearchTimer') {
                finishWordSearch();
            } else if (timerElementId === 'codeExamTimer') {
                finishCodeExam();
            } else if (timerElementId === 'strengthsTimer') {
                finishStrengthsTest();
            } else {
                finishQuiz();
            }
        }
    }, 1000);
}

// ========================================
// FUNCIONES DEL CUESTIONARIO
// ========================================

function loadQuestion() {
    const questions = getQuestionsByDifficulty();
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
    const questions = getQuestionsByDifficulty();

    if (quizAnswers[currentQuizQuestion] === undefined) {
        showToast('Por favor selecciona una respuesta antes de continuar', 'warning');
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

    const questions = getQuestionsByDifficulty();
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
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const results = getResults();

        // Validar que los elementos existen antes de actualizar
        const totalUsersEl = document.getElementById('totalUsers');
        const totalTestsEl = document.getElementById('totalTests');
        const avgScoreEl = document.getElementById('avgScore');
        const avgTimeEl = document.getElementById('avgTime');

        if (totalUsersEl) totalUsersEl.textContent = users.length;
        if (totalTestsEl) totalTestsEl.textContent = results.length;

        const scores = results.map(r => r.score).filter(s => !isNaN(s));
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        if (avgScoreEl) avgScoreEl.textContent = avgScore + '%';

        const times = results.map(r => r.time).filter(t => !isNaN(t));
        const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
        if (avgTimeEl) avgTimeEl.textContent = avgTime + 's';

        loadResultsTable(results);

        // Cargar gráficas con manejo de errores
        setTimeout(() => {
            try {
                createCharts();
            } catch (chartError) {
                console.error('Error al crear gráficas:', chartError);
                // No mostrar mensaje al usuario, las gráficas son opcionales
            }
        }, 100);
    } catch (error) {
        console.error('Error al cargar dashboard:', error);
        showToast('Error al cargar algunos datos del dashboard', 'warning');
    }
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
    try {
        loadDashboardData();
        showToast('Dashboard actualizado', 'success');
    } catch (error) {
        console.error('Error al refrescar dashboard:', error);
        showToast('Error al actualizar el dashboard', 'error');
    }
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
// DIPLOMA DE PROGRAMA COMPLETO
// ========================================

function checkAllExamsCompleted() {
    if (!currentUser) return false;

    const requiredTests = ['pre', 'post', 'errors', 'builder', 'interview',
                          'personality', 'formal', 'dresscode', 'wordsearch', 'strengths'];

    const userResults = getUserResults();
    const completedTests = new Set(userResults.map(r => r.testType));

    // Verificar si tiene al menos un resultado exitoso (score > 0 y no salida temprana) de cada tipo
    const allCompleted = requiredTests.every(testType => {
        const testResults = userResults.filter(r =>
            r.testType === testType &&
            r.score > 0 &&
            !r.exitedEarly
        );
        return testResults.length > 0;
    });

    return allCompleted;
}

function checkCodeExamsCompleted() {
    if (!currentUser) return false;

    // Verificar si completó todos los exámenes asignados por código
    const assignedCodes = JSON.parse(localStorage.getItem('examCodes') || '[]');
    const userResults = getUserResults();

    // Si no hay códigos asignados, retornar false
    if (assignedCodes.length === 0) return false;

    // Verificar cuántos códigos ha completado el usuario
    const completedCodes = userResults.filter(r => r.testType === 'codeExam' && r.score > 0 && !r.exitedEarly);

    // Si completó al menos uno, considerarlo para diploma
    return completedCodes.length > 0;
}

function generateCompletionDiploma() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Fondo elegante con gradiente simulado
    doc.setFillColor(15, 23, 42); // Azul muy oscuro
    doc.rect(0, 0, 297, 210, 'F');

    // Bordes dorados
    doc.setDrawColor(251, 191, 36); // Dorado
    doc.setLineWidth(3);
    doc.rect(8, 8, 281, 194);
    doc.setLineWidth(1);
    doc.rect(12, 12, 273, 186);

    // Título principal
    doc.setFontSize(42);
    doc.setTextColor(251, 191, 36); // Dorado
    doc.setFont(undefined, 'bold');
    doc.text('DIPLOMA DE EXCELENCIA', 148.5, 35, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(226, 232, 240); // Gris claro
    doc.setFont(undefined, 'normal');
    doc.text('Programa Completo de Orientación Laboral Profesional', 148.5, 47, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(1.5);
    doc.line(70, 53, 227, 53);

    // Texto de otorgamiento
    doc.setFontSize(14);
    doc.setTextColor(203, 213, 225);
    doc.text('Se otorga el presente Diploma de Excelencia a:', 148.5, 68, { align: 'center' });

    // Nombre del usuario
    doc.setFontSize(32);
    doc.setTextColor(251, 191, 36);
    doc.setFont(undefined, 'bold');
    doc.text(currentUser.name, 148.5, 88, { align: 'center' });

    // Línea bajo el nombre
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(0.8);
    doc.line(50, 92, 247, 92);

    // Descripción del logro
    doc.setFontSize(13);
    doc.setTextColor(203, 213, 225);
    doc.setFont(undefined, 'normal');
    doc.text('Por haber completado exitosamente TODOS los módulos de evaluación', 148.5, 105, { align: 'center' });
    doc.text('del Sistema de Orientación Laboral Profesional, demostrando', 148.5, 113, { align: 'center' });
    doc.text('compromiso, dedicación y excelencia en el desarrollo de competencias laborales.', 148.5, 121, { align: 'center' });

    // Estadísticas del usuario
    const userResults = getUserResults().filter(r => !r.exitedEarly && r.score > 0);
    const avgScore = Math.round(userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length);
    const totalTests = userResults.length;

    doc.setFontSize(12);
    doc.setTextColor(251, 191, 36);
    doc.setFont(undefined, 'bold');
    doc.text(`Evaluaciones completadas: ${totalTests}`, 148.5, 135, { align: 'center' });
    doc.text(`Promedio general: ${avgScore}%`, 148.5, 143, { align: 'center' });

    // Fecha
    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.setFont(undefined, 'normal');
    const fecha = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Fecha de emisión: ${fecha}`, 148.5, 157, { align: 'center' });

    // Líneas de firma
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(0.5);
    doc.line(45, 175, 110, 175);
    doc.line(187, 175, 252, 175);

    // Títulos de firma
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text('Director del Programa', 77.5, 182, { align: 'center' });
    doc.text('Coordinador de Certificación', 219.5, 182, { align: 'center' });

    // Sello/Código de verificación
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const codigo = `DIPLOMA-COMPLETO-${currentUser.email.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-8)}`;
    doc.text(`Código de verificación: ${codigo}`, 148.5, 192, { align: 'center' });
    doc.text('Este diploma certifica la finalización exitosa de todo el programa', 148.5, 198, { align: 'center' });

    // Guardar
    const filename = `DIPLOMA_COMPLETO_${currentUser.name.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);

    showToast('🎓 ¡DIPLOMA DE PROGRAMA COMPLETO DESCARGADO!', 'success');
}

function checkAndOfferCompletionDiploma() {
    if (!currentUser || isPracticeMode) return;

    const allExamsCompleted = checkAllExamsCompleted();

    // Verificar si ya se le ofreció el diploma
    const diplomasOffered = JSON.parse(localStorage.getItem('diplomasOffered') || '{}');
    const userEmail = currentUser.email;

    if (allExamsCompleted && !diplomasOffered[userEmail]) {
        // Marcar como ofrecido
        diplomasOffered[userEmail] = {
            offered: true,
            date: new Date().toISOString()
        };
        localStorage.setItem('diplomasOffered', JSON.stringify(diplomasOffered));

        // Mostrar mensaje especial y generar diploma automáticamente
        setTimeout(() => {
            showModal('🎉 ¡FELICITACIONES! Has completado TODOS los exámenes del programa. Se generará automáticamente tu DIPLOMA DE EXCELENCIA.', () => {
                generateCompletionDiploma();
            });
        }, 2000);
    }
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

    // Verificar si completó todos los exámenes para ofrecer diploma
    checkAndOfferCompletionDiploma();
}

// ========================================
// FUNCIONES DE RESET
// ========================================

function resetCurrentTest() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

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
// MANEJO DE ERRORES MEJORADO
// ========================================

// Contador de errores para evitar spam
let errorCount = 0;
let lastErrorTime = 0;

window.addEventListener('error', function(e) {
    const currentTime = Date.now();

    // Resetear contador si han pasado más de 10 segundos
    if (currentTime - lastErrorTime > 10000) {
        errorCount = 0;
    }

    errorCount++;
    lastErrorTime = currentTime;

    // Solo mostrar el toast si es el primer o segundo error en 10 segundos
    if (errorCount <= 2) {
        console.error('Error capturado:', e.error);

        // Mensaje más amigable
        const errorMessage = e.error?.message || 'Error desconocido';

        // No mostrar errores menores de recursos externos
        if (errorMessage.includes('Script error') ||
            errorMessage.includes('Loading chunk') ||
            errorMessage.includes('Failed to fetch')) {
            return;
        }

        // Solo mostrar un mensaje si el error es crítico
        // Evitamos mostrar mensajes molestos por errores menores
        console.warn('Error capturado:', event.error);
    }

    // Si hay más de 5 errores en poco tiempo, podría ser algo serio
    if (errorCount > 5) {
        console.error('Múltiples errores detectados. Considera recargar la página.');
    }
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
window.showScreen = showScreen;

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

// ========================================
// BANCO DE CVs CON ERRORES (se selecciona uno aleatorio)
// ========================================
const cvErrorsBank = [
    // CV 1: Juan Pérez - Ventas
    {
        cv: {
            nombre: "Juan Perez",
            email: "juan.perez@gmial.com",
            telefono: "+502 1234-567",
            direccion: "Zona 10, Guatemala",
            objetivo: "Busco un puesto de trabajo en el area de ventas para poder crecer profecionalemnte.",
            experiencia: [
                {
                    puesto: "Vendedor",
                    empresa: "Tienda XYZ",
                    periodo: "2020 - 2022",
                    descripcion: "Atencion al cliente y ventas diarias"
                },
                {
                    puesto: "Cajero",
                    empresa: "Supermercado ABC",
                    periodo: "2018 - 2020",
                    descripcion: "Manejo de caja y atencion al publico"
                }
            ],
            educacion: [
                {
                    titulo: "Bachillerato en Ciencias y Letras",
                    institucion: "Colegio San Jose",
                    año: "2018"
                }
            ],
            habilidades: [
                "Trabajo en equipo",
                "Comunicacion efectiva",
                "Manejo de Microsoft Ofice",
                "Atencion al cliente"
            ],
            referencias: "Disponibles a pedido"
        },
        errors: [
            { id: 1, type: 'email', error: 'gmial.com', correct: 'gmail.com', found: false },
            { id: 2, type: 'telefono', error: '+502 1234-567', correct: '+502 1234-5678', found: false },
            { id: 3, type: 'objetivo', error: 'area', correct: 'área', found: false },
            { id: 4, type: 'objetivo', error: 'profecionalemnte', correct: 'profesionalmente', found: false },
            { id: 5, type: 'experiencia', error: 'Atencion al cliente y ventas', correct: 'Atención al cliente y ventas', found: false },
            { id: 6, type: 'experiencia', error: 'atencion al publico', correct: 'atención al público', found: false },
            { id: 7, type: 'habilidades', error: 'Comunicacion', correct: 'Comunicación', found: false },
            { id: 8, type: 'habilidades', error: 'Ofice', correct: 'Office', found: false },
            { id: 9, type: 'habilidades', error: 'Atencion al cliente', correct: 'Atención al cliente', found: false },
            { id: 10, type: 'referencias', error: 'a pedido', correct: 'a solicitud', found: false }
        ]
    },

    // CV 2: María López - Administración
    {
        cv: {
            nombre: "maria lopez",
            email: "maria_lopez@hotmial.com",
            telefono: "+502 9876-54",
            direccion: "Ciudad de Guatemala",
            objetivo: "Busco una oportunidad laboral en el area administrativa donde pueda aplicar mis conocimeintos y habilidades.",
            experiencia: [
                {
                    puesto: "asistente administrativa",
                    empresa: "Empresa ABC S.A.",
                    periodo: "2021-2023",
                    descripcion: "Gestion de documentos, atencion telefonica y coordinacion de reuniones"
                },
                {
                    puesto: "Recepcionista",
                    empresa: "Hotel Plaza",
                    periodo: "2019 - 2021",
                    descripcion: "Atencion a clientes, reservaciones y manejo de llamdas entrantes"
                }
            ],
            educacion: [
                {
                    titulo: "Perito Contador",
                    institucion: "instituto comercial",
                    año: "2019"
                }
            ],
            habilidades: [
                "Dominio de Exel y Word",
                "Organizacion y planificacion",
                "Comunicacion asertiva",
                "Manejo de bases de datos"
            ],
            referencias: "disponibles cuando las necesiten"
        },
        errors: [
            { id: 1, type: 'nombre', error: 'maria lopez', correct: 'María López', found: false },
            { id: 2, type: 'email', error: 'hotmial.com', correct: 'hotmail.com', found: false },
            { id: 3, type: 'telefono', error: '+502 9876-54', correct: '+502 9876-5432', found: false },
            { id: 4, type: 'objetivo', error: 'conocimeintos', correct: 'conocimientos', found: false },
            { id: 5, type: 'experiencia', error: 'asistente administrativa', correct: 'Asistente Administrativa', found: false },
            { id: 6, type: 'experiencia', error: 'Gestion', correct: 'Gestión', found: false },
            { id: 7, type: 'experiencia', error: 'llamdas', correct: 'llamadas', found: false },
            { id: 8, type: 'educacion', error: 'instituto comercial', correct: 'Instituto Comercial', found: false },
            { id: 9, type: 'habilidades', error: 'Exel', correct: 'Excel', found: false },
            { id: 10, type: 'referencias', error: 'disponibles cuando las necesiten', correct: 'Disponibles a solicitud', found: false }
        ]
    },

    // CV 3: Carlos Ramírez - Técnico
    {
        cv: {
            nombre: "Carlos Ramirez",
            email: "c.ramirez@yahooo.com",
            telefono: "5555-123",
            direccion: "zona 12, guatemala",
            objetivo: "Obtener un puesto como tecnico en computadoras donde pueda desarollar mis habilidades tecnologicas.",
            experiencia: [
                {
                    puesto: "Técnico en Soporte",
                    empresa: "TechSupport GT",
                    periodo: "2022-actualidad",
                    descripcion: "reparacion de computadoras, instalacion de software y soporte tecnico a usuarios"
                },
                {
                    puesto: "Ayudante de Sistemas",
                    empresa: "Colegio Bilingüe",
                    periodo: "2020-2022",
                    descripcion: "Mantenimiento de equipos, actualizacion de programas y resolucion de problemas tecnicos"
                }
            ],
            educacion: [
                {
                    titulo: "Bachillerato en computacion",
                    institucion: "Colegio Tecnico",
                    año: "2020"
                }
            ],
            habilidades: [
                "Reparación de hardware",
                "instalacion de sistemas operativos",
                "Conocimiento en redes",
                "atencion al cliente"
            ],
            referencias: "tengo referencias disponibles"
        },
        errors: [
            { id: 1, type: 'nombre', error: 'Ramirez', correct: 'Ramírez', found: false },
            { id: 2, type: 'email', error: 'yahooo.com', correct: 'yahoo.com', found: false },
            { id: 3, type: 'telefono', error: '5555-123', correct: '+502 5555-1234', found: false },
            { id: 4, type: 'direccion', error: 'zona 12, guatemala', correct: 'Zona 12, Guatemala', found: false },
            { id: 5, type: 'objetivo', error: 'tecnico', correct: 'técnico', found: false },
            { id: 6, type: 'objetivo', error: 'desarollar', correct: 'desarrollar', found: false },
            { id: 7, type: 'experiencia', error: 'reparacion de computadoras', correct: 'Reparación de computadoras', found: false },
            { id: 8, type: 'experiencia', error: 'resolucion', correct: 'resolución', found: false },
            { id: 9, type: 'educacion', error: 'computacion', correct: 'Computación', found: false },
            { id: 10, type: 'habilidades', error: 'instalacion', correct: 'Instalación', found: false }
        ]
    }
];

// Variables globales para el CV actual
let currentCVData = null;
let cvWithErrors = {};
let errorsToFind = [];
let foundErrors = [];
let errorStartTime;
let errorTimerInterval;

function startErrorDetection() {
    errorStartTime = Date.now();
    foundErrors = [];
    remainingTime = CONFIG.CV_ERRORS_TIME_LIMIT;

    // Seleccionar aleatoriamente un CV del banco
    const randomIndex = Math.floor(Math.random() * cvErrorsBank.length);
    currentCVData = cvErrorsBank[randomIndex];

    // Copiar el CV y los errores
    cvWithErrors = JSON.parse(JSON.stringify(currentCVData.cv));
    errorsToFind = JSON.parse(JSON.stringify(currentCVData.errors));

    // Resetear el estado de los errores
    errorsToFind.forEach(e => e.found = false);

    // Intentar cargar el CV del usuario (opcional)
    if (currentUser) {
        const userCVKey = `userCV_${currentUser.email}`;
        const savedCV = localStorage.getItem(userCVKey);

        if (savedCV) {
            // Si el usuario tiene un CV guardado, generar errores en ese CV
            try {
                const userCV = JSON.parse(savedCV);
                generateErrorsFromUserCV(userCV);
            } catch (e) {
                console.error('Error al cargar CV del usuario:', e);
                // Si hay error, usar el CV aleatorio del banco
            }
        }
    }

    showScreen('errorDetectionScreen');
    loadCVWithErrors();
    startErrorTimer();
}

// Función para generar errores en el CV del usuario
function generateErrorsFromUserCV(userCV) {
    // Crear una copia del CV del usuario con errores
    const cvData = {
        nombre: userCV.personalInfo.name || "Usuario",
        email: userCV.personalInfo.email || "usuario@email.com",
        telefono: userCV.personalInfo.phone || "+502 1234-5678",
        direccion: userCV.personalInfo.address || "Ciudad, País",
        objetivo: userCV.objective || "Objetivo profesional",
        experiencia: userCV.experience.map(exp => ({
            puesto: exp.position,
            empresa: exp.company,
            periodo: exp.period,
            descripcion: exp.description
        })),
        educacion: userCV.education.map(edu => ({
            titulo: edu.degree,
            institucion: edu.institution,
            año: edu.year
        })),
        habilidades: userCV.skills || [],
        referencias: userCV.references || "Disponibles a solicitud"
    };

    // Generar errores aleatorios en el CV del usuario
    const possibleErrors = [];

    // Error en email (cambiar @ por typo)
    if (cvData.email.includes('@')) {
        const emailError = cvData.email.replace('@', 'arroba');
        possibleErrors.push({
            field: 'email',
            original: cvData.email,
            error: emailError,
            type: 'typo'
        });
    }

    // Error en teléfono (remover un dígito)
    const phoneDigits = cvData.telefono.replace(/\D/g, '');
    if (phoneDigits.length > 6) {
        const phoneError = cvData.telefono.slice(0, -1);
        possibleErrors.push({
            field: 'telefono',
            original: cvData.telefono,
            error: phoneError,
            type: 'missing_digit'
        });
    }

    // Errores en objetivo (quitar tildes, errores ortográficos)
    if (cvData.objetivo) {
        possibleErrors.push({
            field: 'objetivo',
            original: cvData.objetivo,
            error: cvData.objetivo.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u'),
            type: 'accent'
        });
    }

    // Errores en habilidades (quitar tildes)
    cvData.habilidades.forEach((skill, i) => {
        if (skill.includes('ó') || skill.includes('á') || skill.includes('é') || skill.includes('í') || skill.includes('ú')) {
            possibleErrors.push({
                field: `habilidad-${i}`,
                original: skill,
                error: skill.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u'),
                type: 'accent'
            });
        }
    });

    // Seleccionar aleatoriamente 8-10 errores
    const selectedErrors = possibleErrors.slice(0, Math.min(10, possibleErrors.length));

    // Aplicar los errores al CV
    selectedErrors.forEach(error => {
        if (error.field === 'email') cvData.email = error.error;
        else if (error.field === 'telefono') cvData.telefono = error.error;
        else if (error.field === 'objetivo') cvData.objetivo = error.error;
        else if (error.field.startsWith('habilidad-')) {
            const index = parseInt(error.field.split('-')[1]);
            cvData.habilidades[index] = error.error;
        }
    });

    // Actualizar errorsToFind con los nuevos errores
    errorsToFind.length = 0;
    selectedErrors.forEach((error, i) => {
        errorsToFind.push({
            id: i + 1,
            type: error.field,
            error: error.error,
            correct: error.original,
            found: false
        });
    });

    // Actualizar el CV global con errores
    Object.assign(cvWithErrors, cvData);
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

    // Verificar si se está usando el CV del usuario
    const isUserCV = currentUser && localStorage.getItem(`userCV_${currentUser.email}`);
    const cvTypeNotice = isUserCV
        ? '<div class="cv-notice success">✅ Estás revisando TU PROPIO CV</div>'
        : '<div class="cv-notice info">ℹ️ Estás revisando un CV de ejemplo. Crea tu CV primero para revisarlo.</div>';

    container.innerHTML = `
        ${cvTypeNotice}
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

    if (cvBuilderStep === 2) {
        // Guardar todas las experiencias laborales
        cvBuilderData.experience = [];
        const experienceItems = document.querySelectorAll('#experienceList .cv-item-form');
        experienceItems.forEach(item => {
            const id = item.id.replace('experience-', '');
            const position = document.getElementById(`expPosition-${id}`)?.value.trim();
            const company = document.getElementById(`expCompany-${id}`)?.value.trim();
            const period = document.getElementById(`expPeriod-${id}`)?.value.trim();
            const description = document.getElementById(`expDescription-${id}`)?.value.trim();

            if (position || company) {
                cvBuilderData.experience.push({
                    position: position || 'Sin especificar',
                    company: company || 'Sin especificar',
                    period: period || 'Sin especificar',
                    description: description || ''
                });
            }
        });
    }

    if (cvBuilderStep === 3) {
        // Guardar toda la educación
        cvBuilderData.education = [];
        const educationItems = document.querySelectorAll('#educationList .cv-item-form');
        educationItems.forEach(item => {
            const id = item.id.replace('education-', '');
            const degree = document.getElementById(`eduDegree-${id}`)?.value.trim();
            const institution = document.getElementById(`eduInstitution-${id}`)?.value.trim();
            const year = document.getElementById(`eduYear-${id}`)?.value.trim();

            if (degree || institution) {
                cvBuilderData.education.push({
                    degree: degree || 'Sin especificar',
                    institution: institution || 'Sin especificar',
                    year: year || 'Sin especificar'
                });
            }
        });
    }

    if (cvBuilderStep === 5) {
        cvBuilderData.references = document.getElementById('cvReferences')?.value.trim();
    }
}

// Funciones para manejar Experiencia Laboral
function addExperience() {
    const experienceList = document.getElementById('experienceList');
    if (!experienceList) return;

    const id = Date.now();
    const experienceItem = document.createElement('div');
    experienceItem.className = 'cv-item-form';
    experienceItem.id = `experience-${id}`;
    experienceItem.innerHTML = `
        <div class="form-group">
            <label>Puesto</label>
            <input type="text" id="expPosition-${id}" placeholder="Ej: Asistente Administrativo">
        </div>
        <div class="form-group">
            <label>Empresa</label>
            <input type="text" id="expCompany-${id}" placeholder="Ej: Empresa XYZ">
        </div>
        <div class="form-group">
            <label>Período</label>
            <input type="text" id="expPeriod-${id}" placeholder="Ej: Enero 2020 - Presente">
        </div>
        <div class="form-group">
            <label>Descripción</label>
            <textarea id="expDescription-${id}" rows="3" placeholder="Describe tus responsabilidades y logros..."></textarea>
        </div>
        <button type="button" class="btn-remove" onclick="removeExperience(${id})">
            Eliminar
        </button>
    `;
    experienceList.appendChild(experienceItem);
}

function removeExperience(id) {
    const item = document.getElementById(`experience-${id}`);
    if (item) {
        item.remove();
    }
}

// Funciones para manejar Educación
function addEducation() {
    const educationList = document.getElementById('educationList');
    if (!educationList) return;

    const id = Date.now();
    const educationItem = document.createElement('div');
    educationItem.className = 'cv-item-form';
    educationItem.id = `education-${id}`;
    educationItem.innerHTML = `
        <div class="form-group">
            <label>Título/Grado</label>
            <input type="text" id="eduDegree-${id}" placeholder="Ej: Bachillerato en Ciencias">
        </div>
        <div class="form-group">
            <label>Institución</label>
            <input type="text" id="eduInstitution-${id}" placeholder="Ej: Colegio Nacional">
        </div>
        <div class="form-group">
            <label>Año</label>
            <input type="text" id="eduYear-${id}" placeholder="Ej: 2015-2020">
        </div>
        <button type="button" class="btn-remove" onclick="removeEducation(${id})">
            Eliminar
        </button>
    `;
    educationList.appendChild(educationItem);
}

function removeEducation(id) {
    const item = document.getElementById(`education-${id}`);
    if (item) {
        item.remove();
    }
}

// Funciones para manejar Habilidades
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

    // Guardar el CV del usuario en localStorage para usarlo en el detector de errores
    if (currentUser) {
        const userCVKey = `userCV_${currentUser.email}`;
        localStorage.setItem(userCVKey, JSON.stringify(cvBuilderData));
        showToast('✅ Tu CV ha sido guardado', 'success');
    }

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
window.addExperience = addExperience;
window.removeExperience = removeExperience;
window.addEducation = addEducation;
window.removeEducation = removeEducation;
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.nextCVStep = nextCVStep;
window.previousCVStep = previousCVStep;

// Exportar funciones de códigos de acceso
window.generateExamCode = generateExamCode;
window.enterAccessCode = enterAccessCode;
window.verifyAccessCode = verifyAccessCode;

// Exportar funciones de carga de fotos
window.uploadProfilePhoto = uploadProfilePhoto;
window.uploadCVPhoto = uploadCVPhoto;

// Exportar funciones de video
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.startVideoRecording = startVideoRecording;
window.stopVideoRecording = stopVideoRecording;

// Exportar funciones de prueba de personalidad
window.startPersonalityTest = startPersonalityTest;
window.selectPersonalityAnswer = selectPersonalityAnswer;

// Exportar funciones de nuevos exámenes
window.startFormalInformalTest = startFormalInformalTest;
window.selectFormalInformalAnswer = selectFormalInformalAnswer;
window.nextFormalInformalQuestion = nextFormalInformalQuestion;
window.previousFormalInformalQuestion = previousFormalInformalQuestion;

window.startDressCodeTest = startDressCodeTest;
window.selectDressCodeAnswer = selectDressCodeAnswer;
window.nextDressCodeQuestion = nextDressCodeQuestion;
window.previousDressCodeQuestion = previousDressCodeQuestion;
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
// FUNCIONES DE PANTALLA DE DESAFÍOS
// ========================================

function showChallengesScreen() {
    if (!currentUser) {
        showToast('Debes iniciar sesión primero', 'warning');
        return;
    }

    // Actualizar nombre de usuario
    if (document.getElementById('userName4')) {
        document.getElementById('userName4').textContent = currentUser.name;
    }

    // Actualizar estadísticas del usuario
    if (document.getElementById('userLevel')) {
        document.getElementById('userLevel').textContent = userChallengeData.level;
    }
    if (document.getElementById('userXP')) {
        document.getElementById('userXP').textContent = userChallengeData.xp + ' XP';
    }
    if (document.getElementById('userBadges')) {
        document.getElementById('userBadges').textContent = userChallengeData.badges.length;
    }
    if (document.getElementById('userStreak')) {
        document.getElementById('userStreak').textContent = userChallengeData.streak + ' días';
    }

    // Actualizar barra de progreso de nivel
    const xpProgress = getXPProgress();
    if (document.getElementById('currentLevelDisplay')) {
        document.getElementById('currentLevelDisplay').textContent = userChallengeData.level;
    }
    if (document.getElementById('currentXPDisplay')) {
        document.getElementById('currentXPDisplay').textContent = xpProgress.progress;
    }
    if (document.getElementById('nextLevelXP')) {
        document.getElementById('nextLevelXP').textContent = xpProgress.required;
    }
    if (document.getElementById('levelProgressFill')) {
        document.getElementById('levelProgressFill').style.width = xpProgress.percentage + '%';
    }

    // Renderizar desafíos diarios
    renderDailyChallenges();

    // Renderizar desafíos semanales
    renderWeeklyChallenges();

    // Renderizar ranking
    renderLeaderboard();

    // Renderizar badges
    renderBadges();

    // Actualizar notificación de desafíos pendientes
    updateChallengesNotification();

    showScreen('challengesScreen');
}

function showChallengeTab(tabName) {
    // Remover active de todos los tabs
    document.querySelectorAll('.challenge-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.challenge-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activar tab seleccionado
    const tabs = document.querySelectorAll('.challenge-tab');
    const contents = document.querySelectorAll('.challenge-tab-content');

    if (tabName === 'daily') {
        tabs[0].classList.add('active');
        document.getElementById('dailyChallenges')?.classList.add('active');
        renderDailyChallenges();
    } else if (tabName === 'weekly') {
        tabs[1].classList.add('active');
        document.getElementById('weeklyChallenges')?.classList.add('active');
        renderWeeklyChallenges();
    } else if (tabName === 'leaderboard') {
        tabs[2].classList.add('active');
        document.getElementById('leaderboardContent')?.classList.add('active');
        renderLeaderboard();
    } else if (tabName === 'badges') {
        tabs[3].classList.add('active');
        document.getElementById('badgesContent')?.classList.add('active');
        renderBadges();
    }
}

function renderDailyChallenges() {
    const grid = document.getElementById('dailyChallengesGrid');
    if (!grid) return;

    grid.innerHTML = dailyChallenges.map(challenge => {
        const progress = userChallengeData.dailyProgress[challenge.id] || 0;
        const percentage = Math.min((progress / challenge.target) * 100, 100);
        const completed = progress >= challenge.target;

        return `
            <div class="challenge-card ${completed ? 'completed' : ''}">
                <div class="challenge-icon">${challenge.icon}</div>
                <div class="challenge-info">
                    <h4>${challenge.title}</h4>
                    <p>${challenge.description}</p>
                    <div class="challenge-progress">
                        <div class="challenge-progress-bar">
                            <div class="challenge-progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span class="challenge-progress-text">${progress}/${challenge.target}</span>
                    </div>
                    <div class="challenge-reward">
                        <span>⭐ ${challenge.xp} XP</span>
                        ${completed ? '<span class="completed-badge">✓ Completado</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderWeeklyChallenges() {
    const grid = document.getElementById('weeklyChallengesGrid');
    if (!grid) return;

    grid.innerHTML = weeklyChallenges.map(challenge => {
        const progress = userChallengeData.weeklyProgress[challenge.id] || 0;
        const percentage = Math.min((progress / challenge.target) * 100, 100);
        const completed = progress >= challenge.target;

        return `
            <div class="challenge-card ${completed ? 'completed' : ''}">
                <div class="challenge-icon">${challenge.icon}</div>
                <div class="challenge-info">
                    <h4>${challenge.title}</h4>
                    <p>${challenge.description}</p>
                    <div class="challenge-progress">
                        <div class="challenge-progress-bar">
                            <div class="challenge-progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span class="challenge-progress-text">${progress}/${challenge.target}</span>
                    </div>
                    <div class="challenge-reward">
                        <span>⭐ ${challenge.xp} XP</span>
                        ${completed ? '<span class="completed-badge">✓ Completado</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderLeaderboard() {
    // Obtener todos los usuarios con sus datos
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const leaderboardData = users.map(user => {
        const userData = JSON.parse(localStorage.getItem(`challenge_data_${user.email}`) || '{}');
        return {
            name: user.name,
            email: user.email,
            xp: userData.xp || 0,
            level: userData.level || 1,
            badges: (userData.badges || []).length
        };
    }).sort((a, b) => b.xp - a.xp);

    // Actualizar podio (top 3)
    if (leaderboardData[0]) {
        const podium1 = document.getElementById('podium1');
        if (podium1) {
            podium1.querySelector('.podium-user').textContent = leaderboardData[0].name;
            podium1.querySelector('.podium-xp').textContent = leaderboardData[0].xp + ' XP';
        }
    }
    if (leaderboardData[1]) {
        const podium2 = document.getElementById('podium2');
        if (podium2) {
            podium2.querySelector('.podium-user').textContent = leaderboardData[1].name;
            podium2.querySelector('.podium-xp').textContent = leaderboardData[1].xp + ' XP';
        }
    }
    if (leaderboardData[2]) {
        const podium3 = document.getElementById('podium3');
        if (podium3) {
            podium3.querySelector('.podium-user').textContent = leaderboardData[2].name;
            podium3.querySelector('.podium-xp').textContent = leaderboardData[2].xp + ' XP';
        }
    }

    // Tabla de ranking
    const tbody = document.getElementById('leaderboardTableBody');
    if (tbody) {
        tbody.innerHTML = leaderboardData.map((user, index) => {
            const isCurrentUser = user.email === currentUser?.email;
            return `
                <tr ${isCurrentUser ? 'class="current-user-row"' : ''}>
                    <td>${index + 1}</td>
                    <td>${user.name} ${isCurrentUser ? '(Tú)' : ''}</td>
                    <td>Nivel ${user.level}</td>
                    <td>${user.xp} XP</td>
                    <td>${user.badges}</td>
                </tr>
            `;
        }).join('');
    }

    // Actualizar ranking del usuario actual
    if (currentUser) {
        const userRank = leaderboardData.findIndex(u => u.email === currentUser.email) + 1;
        if (document.getElementById('userRank')) {
            document.getElementById('userRank').textContent = userRank > 0 ? `#${userRank}` : '#-';
        }
    }
}

function renderBadges() {
    const grid = document.getElementById('badgesGrid');
    if (!grid) return;

    grid.innerHTML = availableBadges.map(badge => {
        const unlocked = userChallengeData.badges.includes(badge.id);

        return `
            <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-info">
                    <h4>${badge.name}</h4>
                    <p>${badge.description}</p>
                    ${unlocked ? '<span class="badge-status">✓ Desbloqueada</span>' : '<span class="badge-status">🔒 Bloqueada</span>'}
                </div>
            </div>
        `;
    }).join('');
}

function updateChallengesNotification() {
    const notification = document.getElementById('challengesNotification');
    if (!notification) return;

    // Contar desafíos pendientes
    let pendingCount = 0;

    dailyChallenges.forEach(challenge => {
        const progress = userChallengeData.dailyProgress[challenge.id] || 0;
        if (progress < challenge.target) pendingCount++;
    });

    notification.textContent = pendingCount;
    notification.style.display = pendingCount > 0 ? 'flex' : 'none';
}

// ========================================
// CREADOR DE AVATAR PRO - DICEBEAR API
// ========================================

// Configuración del avatar con DiceBear
let avatarConfig = {
    style: 'avataaars',  // Estilo de avatar (avataaars, adventurer, etc.)
    seed: '',            // Semilla única para generar el avatar
    backgroundColor: 'transparent',
    size: 256,
    flip: false
};

// Generar URL del avatar usando DiceBear API
function generateAvatarURL() {
    const baseURL = `https://api.dicebear.com/7.x/${avatarConfig.style}/svg`;
    const params = new URLSearchParams({
        seed: avatarConfig.seed,
        size: avatarConfig.size,
        backgroundColor: avatarConfig.backgroundColor === 'transparent' ? '' : avatarConfig.backgroundColor,
        flip: avatarConfig.flip
    });

    // Eliminar parámetros vacíos
    for (const [key, value] of Array.from(params.entries())) {
        if (!value) params.delete(key);
    }

    return `${baseURL}?${params.toString()}`;
}

// Actualizar vista previa del avatar
function updateAvatarPreview() {
    const avatarImg = document.getElementById('avatarPreviewLarge');
    const seedDisplay = document.getElementById('avatarSeedDisplay');

    const avatarURL = generateAvatarURL();
    avatarImg.src = avatarURL;
    seedDisplay.textContent = avatarConfig.seed || 'sin definir';
}

// Mostrar pantalla del creador de avatar
function showAvatarCreator() {
    if (!currentUser) {
        showToast('Debes iniciar sesión primero', 'warning');
        return;
    }

    document.getElementById('userName5').textContent = currentUser.name;

    // Cargar avatar guardado o generar uno nuevo
    const savedConfig = localStorage.getItem(`avatar_pro_${currentUser.email}`);
    if (savedConfig) {
        avatarConfig = JSON.parse(savedConfig);
    } else {
        // Generar seed basado en el nombre del usuario
        avatarConfig.seed = currentUser.name || `user${Date.now()}`;
    }

    // Marcar estilo activo
    document.querySelectorAll('.style-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.style === avatarConfig.style) {
            card.classList.add('active');
        }
    });

    // Actualizar input de seed
    document.getElementById('customSeed').value = avatarConfig.seed;

    // Actualizar size activo
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    const activeSize = Array.from(document.querySelectorAll('.size-btn')).find(
        btn => parseInt(btn.textContent) === avatarConfig.size
    );
    if (activeSize) activeSize.classList.add('active');

    updateAvatarPreview();
    showScreen('avatarCreatorScreen');
}

// Cambiar estilo de avatar
function changeAvatarStyle(style) {
    avatarConfig.style = style;

    // Actualizar UI
    document.querySelectorAll('.style-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.style === style) {
            card.classList.add('active');
        }
    });

    updateAvatarPreview();
}

// Aplicar seed personalizado
function applyCustomSeed() {
    const seedInput = document.getElementById('customSeed');
    const newSeed = seedInput.value.trim();

    if (!newSeed) {
        showToast('Por favor ingresa una palabra o nombre', 'warning');
        return;
    }

    avatarConfig.seed = newSeed;
    updateAvatarPreview();
    showToast('Semilla aplicada correctamente', 'success');
}

// Generar avatar aleatorio
function randomizeAvatar() {
    // Generar seed aleatorio
    const randomWords = ['awesome', 'cool', 'super', 'mega', 'ultra', 'epic', 'fantastic', 'amazing'];
    const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
    const randomNum = Math.floor(Math.random() * 10000);

    avatarConfig.seed = `${randomWord}${randomNum}`;
    document.getElementById('customSeed').value = avatarConfig.seed;

    updateAvatarPreview();
    showToast('Avatar aleatorio generado', 'success');
}

// Cambiar color de fondo
function changeBackground(color) {
    avatarConfig.backgroundColor = color;

    // Actualizar UI
    document.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    updateAvatarPreview();
}

// Cambiar tamaño del avatar
function changeSize(size) {
    avatarConfig.size = size;

    // Actualizar UI
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    updateAvatarPreview();
}

// Voltear avatar
function toggleFlip() {
    avatarConfig.flip = !avatarConfig.flip;
    updateAvatarPreview();

    const btn = event.target.closest('.flip-btn');
    if (avatarConfig.flip) {
        btn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
        btn.style.color = 'white';
    } else {
        btn.style.background = '';
        btn.style.color = '';
    }
}

// Exportar avatar
async function exportAvatar(format) {
    const avatarURL = generateAvatarURL();

    if (format === 'svg') {
        // Descargar SVG directamente
        try {
            const response = await fetch(avatarURL);
            const svgBlob = await response.blob();
            const url = window.URL.createObjectURL(svgBlob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `avatar-${avatarConfig.seed}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showToast('Avatar SVG descargado', 'success');
        } catch (error) {
            showToast('Error al descargar SVG', 'error');
        }
    } else if (format === 'png') {
        // Convertir SVG a PNG
        try {
            const response = await fetch(avatarURL);
            const svgText = await response.text();

            const canvas = document.createElement('canvas');
            canvas.width = avatarConfig.size;
            canvas.height = avatarConfig.size;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(blob => {
                    const pngURL = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = pngURL;
                    a.download = `avatar-${avatarConfig.seed}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(pngURL);
                    URL.revokeObjectURL(url);

                    showToast('Avatar PNG descargado', 'success');
                });
            };

            img.src = url;
        } catch (error) {
            showToast('Error al convertir a PNG', 'error');
        }
    }
}

// Guardar avatar PRO
function saveAvatarPro() {
    if (!currentUser) {
        showToast('Debes iniciar sesión primero', 'error');
        return;
    }

    // Generar URL del avatar
    const avatarURL = generateAvatarURL();

    // Guardar configuración en localStorage
    localStorage.setItem(`avatar_pro_${currentUser.email}`, JSON.stringify(avatarConfig));

    // IMPORTANTE: Sincronizar avatar con foto de perfil
    localStorage.setItem(`profilePhoto_${currentUser.email}`, avatarURL);

    // Actualizar avatar en la navegación
    updateUserAvatarPro();

    // Actualizar foto de perfil en el perfil del usuario
    updateProfilePhoto();

    showToast('¡Avatar guardado y sincronizado con tu perfil!', 'success');

    // Si es un nuevo usuario, continuar con el flujo de onboarding
    if (currentUser.isNewUser) {
        setTimeout(() => {
            // Cerrar el creador de avatar
            const avatarScreen = document.getElementById('avatarCreatorScreen');
            if (avatarScreen) {
                avatarScreen.classList.remove('active');
            }

            // Avanzar al siguiente paso del onboarding (Paso 2: PRE-TEST/POST-TEST)
            currentOnboardingStep = 2; // Paso 2 es el índice 2 en el array
            createOnboardingOverlay();
            showOnboardingStep();
            showToast('💡 Ahora conoce los tipos de evaluaciones disponibles', 'info');
        }, 1500);
    } else {
        // Usuario existente, volver a la pantalla anterior
        setTimeout(() => {
            showScreen('welcomeScreen');
        }, 1000);
    }
}

// Actualizar avatar del usuario en la navegación
function updateUserAvatarPro() {
    const avatarURL = generateAvatarURL();

    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'user-mini-avatar';
    avatarContainer.innerHTML = `
        <img src="${avatarURL}" alt="Avatar" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;">
    `;

    // Insertar avatar en la navegación
    document.querySelectorAll('.nav-user').forEach(navUser => {
        const existingAvatar = navUser.querySelector('.user-mini-avatar');
        if (existingAvatar) {
            existingAvatar.remove();
        }
        navUser.insertBefore(avatarContainer.cloneNode(true), navUser.firstChild);
    });
}

// Actualizar foto de perfil en todas partes
function updateProfilePhoto() {
    if (!currentUser) return;

    const profilePhoto = localStorage.getItem(`profilePhoto_${currentUser.email}`);
    if (!profilePhoto) return;

    // Actualizar en el perfil del usuario
    const profilePhotoElement = document.getElementById('userProfilePhoto');
    if (profilePhotoElement) {
        profilePhotoElement.src = profilePhoto;
    }

    // Actualizar en modal de usuario (admin)
    const modalUserPhoto = document.getElementById('modalUserPhoto');
    if (modalUserPhoto) {
        modalUserPhoto.src = profilePhoto;
    }

    // Actualizar cualquier otra imagen de perfil en la página
    document.querySelectorAll('.user-photo, .user-card-photo').forEach(img => {
        if (img.dataset.userEmail === currentUser.email || !img.dataset.userEmail) {
            img.src = profilePhoto;
        }
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
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Cargar avatar PRO si el usuario está logueado
    if (currentUser) {
        const savedAvatarPro = localStorage.getItem(`avatar_pro_${currentUser.email}`);
        if (savedAvatarPro) {
            avatarConfig = JSON.parse(savedAvatarPro);
            updateUserAvatarPro();
        }
    }

    // Inicializar lookbook cuando se muestra la pantalla de dress code
    if (screenId === 'dressCodeTestScreen' && typeof initLookbook === 'function') {
        setTimeout(() => initLookbook(), 100);
    }
}

// ========================================
// SISTEMA DE CÓDIGOS DE ACCESO
// ========================================

// Generar código único para examen
function generateAccessCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EXAM-${timestamp}-${random}`;
}

// Guardar código de examen
function saveAccessCode(code, testType, duration = 3600000) {
    const expirationTime = Date.now() + duration; // 1 hora por defecto
    const accessCodes = JSON.parse(localStorage.getItem('accessCodes') || '{}');

    accessCodes[code] = {
        testType: testType,
        createdAt: Date.now(),
        expiresAt: expirationTime,
        used: false,
        createdBy: currentUser?.email || 'admin'
    };

    localStorage.setItem('accessCodes', JSON.stringify(accessCodes));
    return code;
}

// Verificar código de acceso
function verifyAccessCode(code) {
    const accessCodes = JSON.parse(localStorage.getItem('accessCodes') || '{}');
    const codeData = accessCodes[code];

    if (!codeData) {
        return { valid: false, message: 'Código no válido' };
    }

    if (codeData.used) {
        return { valid: false, message: 'Este código ya ha sido utilizado' };
    }

    if (Date.now() > codeData.expiresAt) {
        return { valid: false, message: 'Este código ha expirado' };
    }

    return { valid: true, testType: codeData.testType };
}

// Marcar código como usado
function markCodeAsUsed(code) {
    const accessCodes = JSON.parse(localStorage.getItem('accessCodes') || '{}');
    if (accessCodes[code]) {
        accessCodes[code].used = true;
        accessCodes[code].usedAt = Date.now();
        accessCodes[code].usedBy = currentUser?.email;
        localStorage.setItem('accessCodes', JSON.stringify(accessCodes));
    }
}

// Generar código desde el panel admin
function generateExamCode() {
    const testType = prompt('Tipo de test (pre/post):', 'pre');
    if (!testType) return;

    const duration = prompt('Duración en horas:', '1');
    const durationMs = parseInt(duration) * 3600000;

    const code = generateAccessCode();
    saveAccessCode(code, testType, durationMs);

    showModal(`Código generado:\n\n${code}\n\nVálido por ${duration} hora(s)`, () => {
        navigator.clipboard.writeText(code);
        showToast('Código copiado al portapapeles', 'success');
    });
}

// Ingresar código de acceso
function enterAccessCode() {
    const code = prompt('Ingresa tu código de acceso:');
    if (!code) return;

    const verification = verifyAccessCode(code);

    if (verification.valid) {
        markCodeAsUsed(code);
        currentTestType = verification.testType;
        showToast(`✅ Código válido. Accediendo a ${verification.testType}-test...`, 'success');
        setTimeout(() => {
            showScreen('testMenuScreen');
            document.getElementById('testTypeBadge').textContent =
                verification.testType === 'pre' ? '📝 PRE-TEST' : '✅ POST-TEST';
        }, 1000);
    } else {
        showToast(`❌ ${verification.message}`, 'error');
    }
}

// ========================================
// SISTEMA DE CARGA DE FOTOS
// ========================================

let userProfilePhoto = null;
let cvPhoto = null;

// Cargar foto de perfil
function uploadProfilePhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast('❌ La imagen no debe superar 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            userProfilePhoto = event.target.result;
            localStorage.setItem(`profile_photo_${currentUser.email}`, userProfilePhoto);
            updateProfilePhotoDisplay();
            showToast('✅ Foto de perfil actualizada', 'success');
        };
        reader.readAsDataURL(file);
    };

    input.click();
}

// Actualizar display de foto de perfil
function updateProfilePhotoDisplay() {
    const photoContainers = document.querySelectorAll('.user-profile-photo');
    photoContainers.forEach(container => {
        if (userProfilePhoto) {
            container.innerHTML = `<img src="${userProfilePhoto}" alt="Perfil" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        }
    });
}

// Cargar foto para CV
function uploadCVPhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showToast('❌ La imagen no debe superar 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            cvPhoto = event.target.result;
            cvBuilderData.photo = cvPhoto;
            document.getElementById('cvPhotoPreview')?.setAttribute('src', cvPhoto);
            showToast('✅ Foto agregada al CV', 'success');
        };
        reader.readAsDataURL(file);
    };

    input.click();
}

// ========================================
// SISTEMA DE VIDEO Y ANÁLISIS
// ========================================

let videoStream = null;
let videoRecorder = null;
let videoChunks = [];
let recordedVideoBlob = null;

// Iniciar cámara
async function startCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: true
        });

        const videoElement = document.getElementById('cameraPreview');
        if (videoElement) {
            videoElement.srcObject = videoStream;
            videoElement.play();
        }

        showToast('✅ Cámara activada', 'success');
        return true;
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        showToast('❌ No se pudo acceder a la cámara. Verifica los permisos.', 'error');
        return false;
    }
}

// Detener cámara
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        const videoElement = document.getElementById('cameraPreview');
        if (videoElement) {
            videoElement.srcObject = null;
        }
    }
}

// Iniciar grabación de video
function startVideoRecording() {
    if (!videoStream) {
        showToast('❌ Primero debes activar la cámara', 'warning');
        return;
    }

    videoChunks = [];
    videoRecorder = new MediaRecorder(videoStream, {
        mimeType: 'video/webm'
    });

    videoRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            videoChunks.push(event.data);
        }
    };

    videoRecorder.onstop = () => {
        recordedVideoBlob = new Blob(videoChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(recordedVideoBlob);

        const playbackElement = document.getElementById('videoPlayback');
        if (playbackElement) {
            playbackElement.src = videoUrl;
            playbackElement.style.display = 'block';
        }

        analyzeVideoRecording();
    };

    videoRecorder.start();
    showToast('🎥 Grabación iniciada', 'success');
}

// Detener grabación de video
function stopVideoRecording() {
    if (videoRecorder && videoRecorder.state !== 'inactive') {
        videoRecorder.stop();
        showToast('⏹️ Grabación detenida', 'info');
    }
}

// Analizar video grabado (análisis básico)
function analyzeVideoRecording() {
    // Simulación de análisis de video
    // En producción, esto se conectaría a una API de análisis facial

    const duration = videoChunks.length * 0.5; // Estimación

    const analysis = {
        duration: duration,
        confidence: Math.random() * 30 + 70, // 70-100%
        emotions: {
            happy: Math.random() * 40 + 20,
            neutral: Math.random() * 40 + 30,
            focused: Math.random() * 30 + 20
        },
        eyeContact: Math.random() * 30 + 60,
        posture: Math.random() * 25 + 65,
        expressiveness: Math.random() * 35 + 50
    };

    displayVideoAnalysis(analysis);
}

// Mostrar análisis de video
function displayVideoAnalysis(analysis) {
    const container = document.getElementById('videoAnalysisResults');
    if (!container) return;

    container.innerHTML = `
        <div class="analysis-result">
            <h3>📊 Análisis de Video Completado</h3>

            <div class="analysis-section">
                <h4>😊 Expresiones Detectadas</h4>
                <div class="emotion-bars">
                    <div class="emotion-item">
                        <span>Feliz:</span>
                        <div class="progress-bar-mini">
                            <div class="progress-fill" style="width: ${analysis.emotions.happy}%"></div>
                        </div>
                        <span>${Math.round(analysis.emotions.happy)}%</span>
                    </div>
                    <div class="emotion-item">
                        <span>Neutral:</span>
                        <div class="progress-bar-mini">
                            <div class="progress-fill" style="width: ${analysis.emotions.neutral}%"></div>
                        </div>
                        <span>${Math.round(analysis.emotions.neutral)}%</span>
                    </div>
                    <div class="emotion-item">
                        <span>Concentrado:</span>
                        <div class="progress-bar-mini">
                            <div class="progress-fill" style="width: ${analysis.emotions.focused}%"></div>
                        </div>
                        <span>${Math.round(analysis.emotions.focused)}%</span>
                    </div>
                </div>
            </div>

            <div class="analysis-section">
                <h4>👁️ Contacto Visual</h4>
                <p>Mantienes contacto visual el ${Math.round(analysis.eyeContact)}% del tiempo</p>
                <div class="progress-bar-large">
                    <div class="progress-fill" style="width: ${analysis.eyeContact}%"></div>
                </div>
            </div>

            <div class="analysis-section">
                <h4>🎭 Expresividad</h4>
                <p>Nivel de expresividad: ${Math.round(analysis.expressiveness)}%</p>
                <div class="progress-bar-large">
                    <div class="progress-fill" style="width: ${analysis.expressiveness}%"></div>
                </div>
            </div>

            <div class="analysis-tips">
                <h4>💡 Recomendaciones:</h4>
                <ul>
                    ${analysis.eyeContact < 70 ? '<li>Intenta mantener más contacto visual con la cámara</li>' : '<li>Excelente contacto visual, sigue así</li>'}
                    ${analysis.expressiveness < 60 ? '<li>Intenta ser más expresivo al hablar</li>' : '<li>Buena expresividad facial</li>'}
                    ${analysis.posture < 70 ? '<li>Mantén una postura erguida y profesional</li>' : '<li>Buena postura corporal</li>'}
                </ul>
            </div>
        </div>
    `;

    container.style.display = 'block';
}

// ========================================
// PRUEBA DE FORTALEZAS Y DEBILIDADES
// ========================================

const personalityQuestions = [
    {
        q: "¿Cómo te describes en situaciones de trabajo en equipo?",
        options: [
            "Prefiero liderar y tomar decisiones",
            "Me adapto y colaboro con todos",
            "Trabajo mejor de forma independiente",
            "Analizo y aporto soluciones técnicas"
        ]
    },
    {
        q: "Ante un problema difícil, ¿cuál es tu primera reacción?",
        options: [
            "Busco ayuda de inmediato",
            "Lo analizo cuidadosamente antes de actuar",
            "Pruebo diferentes soluciones rápidamente",
            "Investigo casos similares primero"
        ]
    },
    {
        q: "¿Qué te motiva más en el trabajo?",
        options: [
            "Reconocimiento y logros visibles",
            "Aprender cosas nuevas constantemente",
            "Ayudar y colaborar con otros",
            "Superar desafíos complejos"
        ]
    },
    {
        q: "¿Cuál consideras tu mayor fortaleza?",
        options: [
            "Comunicación efectiva",
            "Pensamiento analítico",
            "Creatividad e innovación",
            "Organización y planificación"
        ]
    },
    {
        q: "¿Qué área te gustaría mejorar?",
        options: [
            "Gestión del tiempo",
            "Hablar en público",
            "Trabajo bajo presión",
            "Delegación de tareas"
        ]
    }
];

let personalityAnswers = [];
let personalityCurrentQ = 0;
let personalityWithVideo = false;

// Iniciar prueba de personalidad
function startPersonalityTest(withVideo = false) {
    personalityAnswers = [];
    personalityCurrentQ = 0;
    personalityWithVideo = withVideo;

    showScreen('personalityTestScreen');

    if (withVideo) {
        startCamera();
    }

    loadPersonalityQuestion();
}

// Cargar pregunta de personalidad
function loadPersonalityQuestion() {
    const container = document.getElementById('personalityQuestionContainer');
    if (!container) return;

    const q = personalityQuestions[personalityCurrentQ];

    container.innerHTML = `
        <div class="personality-question-card">
            <div class="question-header">
                <span class="question-number">Pregunta ${personalityCurrentQ + 1} de ${personalityQuestions.length}</span>
            </div>
            <h3 class="question-text">${q.q}</h3>
            <div class="personality-options">
                ${q.options.map((opt, i) => `
                    <div class="personality-option" onclick="selectPersonalityAnswer(${i})">
                        <input type="radio" name="personality_q${personalityCurrentQ}" id="opt${i}" value="${i}">
                        <label for="opt${i}">${opt}</label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Seleccionar respuesta de personalidad
function selectPersonalityAnswer(index) {
    personalityAnswers[personalityCurrentQ] = index;

    personalityCurrentQ++;

    if (personalityCurrentQ >= personalityQuestions.length) {
        finishPersonalityTest();
    } else {
        loadPersonalityQuestion();
    }
}

// Finalizar prueba de personalidad
function finishPersonalityTest() {
    if (personalityWithVideo) {
        stopCamera();
    }

    const profile = analyzePersonality();
    displayPersonalityResults(profile);
}

// Analizar personalidad basado en respuestas
function analyzePersonality() {
    // Análisis simplificado
    const traits = {
        leadership: 0,
        analytical: 0,
        creative: 0,
        collaborative: 0
    };

    personalityAnswers.forEach((answer, qIndex) => {
        if (qIndex === 0) {
            if (answer === 0) traits.leadership += 2;
            if (answer === 1) traits.collaborative += 2;
            if (answer === 3) traits.analytical += 2;
        }
        if (qIndex === 1) {
            if (answer === 1) traits.analytical += 2;
            if (answer === 2) traits.creative += 2;
        }
        if (qIndex === 2) {
            if (answer === 1) traits.analytical += 1;
            if (answer === 2) traits.collaborative += 2;
            if (answer === 3) traits.analytical += 1;
        }
    });

    const dominant = Object.entries(traits).sort((a, b) => b[1] - a[1])[0];

    const profiles = {
        leadership: {
            title: "Líder Natural",
            description: "Tienes habilidades naturales de liderazgo. Te gusta tomar decisiones y guiar equipos.",
            strengths: ["Toma de decisiones", "Motivación de equipos", "Visión estratégica"],
            weaknesses: ["Delegar tareas", "Escuchar otras opiniones"]
        },
        analytical: {
            title: "Pensador Analítico",
            description: "Destacas en análisis y resolución de problemas complejos mediante lógica y datos.",
            strengths: ["Análisis de datos", "Resolución de problemas", "Atención al detalle"],
            weaknesses: ["Decisiones rápidas", "Trabajo bajo presión"]
        },
        creative: {
            title: "Innovador Creativo",
            description: "Tu creatividad te permite encontrar soluciones originales y pensar fuera de lo convencional.",
            strengths: ["Pensamiento innovador", "Adaptabilidad", "Generación de ideas"],
            weaknesses: ["Seguir procesos rígidos", "Tareas repetitivas"]
        },
        collaborative: {
            title: "Colaborador Empático",
            description: "Sobresales en trabajo en equipo y comunicación. Construyes relaciones efectivas.",
            strengths: ["Trabajo en equipo", "Comunicación", "Empatía"],
            weaknesses: ["Tomar decisiones difíciles", "Confrontación"]
        }
    };

    return profiles[dominant[0]] || profiles.collaborative;
}

// Mostrar resultados de personalidad
function displayPersonalityResults(profile) {
    showScreen('personalityResultsScreen');

    const container = document.getElementById('personalityResultsContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="personality-results-card">
            <div class="profile-header">
                <div class="profile-icon">🎯</div>
                <h2>${profile.title}</h2>
                <p class="profile-description">${profile.description}</p>
            </div>

            <div class="strengths-section">
                <h3>💪 Tus Fortalezas</h3>
                <ul class="traits-list">
                    ${profile.strengths.map(s => `<li>✓ ${s}</li>`).join('')}
                </ul>
            </div>

            <div class="weaknesses-section">
                <h3>📈 Áreas de Mejora</h3>
                <ul class="traits-list">
                    ${profile.weaknesses.map(w => `<li>• ${w}</li>`).join('')}
                </ul>
            </div>

            <div class="results-actions">
                <button class="btn-result primary" onclick="downloadPersonalityReport()">
                    📄 Descargar Reporte
                </button>
                <button class="btn-result secondary" onclick="goToWelcome()">
                    ← Volver al Inicio
                </button>
            </div>
        </div>
    `;
}

// Descargar reporte de personalidad
function downloadPersonalityReport() {
    showToast('📄 Generando reporte...', 'info');
    // Aquí se implementaría la generación del PDF del reporte de personalidad
    setTimeout(() => {
        showToast('✅ Reporte descargado', 'success');
    }, 1000);
}

// ========================================
// EXAMEN: TRABAJOS FORMALES E INFORMALES
// ========================================

const formalInformalQuestions = [
    {
        q: "¿Qué caracteriza a un trabajo formal?",
        options: [
            "No tiene contrato escrito",
            "Tiene contrato, prestaciones y seguridad social",
            "Se paga en efectivo sin recibo",
            "No tiene horario fijo"
        ],
        correct: 1,
        explanation: "Un trabajo formal se caracteriza por tener contrato laboral, prestaciones de ley y seguridad social."
    },
    {
        q: "¿Cuál es un ejemplo de trabajo informal?",
        options: [
            "Empleado de banco con contrato",
            "Maestro de escuela pública",
            "Vendedor ambulante sin registro",
            "Contador en empresa registrada"
        ],
        correct: 2,
        explanation: "Los vendedores ambulantes sin registro fiscal son ejemplo clásico de trabajo informal."
    },
    {
        q: "¿Qué ventaja tiene el trabajo formal?",
        options: [
            "Puedes trabajar sin horario",
            "No pagas impuestos",
            "Tienes acceso a créditos y pensión",
            "Ganas más dinero siempre"
        ],
        correct: 2,
        explanation: "El trabajo formal te da acceso a seguridad social, créditos bancarios, ahorro para el retiro y pensión."
    },
    {
        q: "¿Qué riesgo tiene el trabajo informal?",
        options: [
            "Pagar demasiados impuestos",
            "No tener protección laboral ni prestaciones",
            "Ganar demasiado dinero",
            "Trabajar muy pocas horas"
        ],
        correct: 1,
        explanation: "El trabajo informal no ofrece protección legal, prestaciones, ni seguridad social."
    },
    {
        q: "¿Qué es el IMSS o IGSS?",
        options: [
            "Un tipo de impuesto",
            "Instituto de seguridad social para trabajadores formales",
            "Una empresa privada",
            "Un sindicato de trabajadores"
        ],
        correct: 1,
        explanation: "El IMSS (México) o IGSS (Guatemala) es el instituto que brinda seguridad social a trabajadores formales."
    },
    {
        q: "¿Cuál NO es una prestación del trabajo formal?",
        options: [
            "Aguinaldo",
            "Vacaciones pagadas",
            "Trabajar sin jefe",
            "Prima vacacional"
        ],
        correct: 2,
        explanation: "Trabajar sin jefe no es una prestación. Las prestaciones incluyen aguinaldo, vacaciones, prima vacacional, etc."
    },
    {
        q: "¿Qué documento comprueba un empleo formal?",
        options: [
            "Foto con el jefe",
            "Contrato laboral escrito",
            "Mensaje de WhatsApp",
            "Promesa verbal"
        ],
        correct: 1,
        explanation: "El contrato laboral por escrito es el documento legal que comprueba un empleo formal."
    },
    {
        q: "¿Qué sucede si un trabajo formal te despide injustificadamente?",
        options: [
            "No pasa nada",
            "Tienes derecho a indemnización",
            "Pierdes todo",
            "Te multan"
        ],
        correct: 1,
        explanation: "En el trabajo formal, tienes derecho a indemnización por despido injustificado."
    },
    {
        q: "¿Qué es la economía informal?",
        options: [
            "Empresas registradas que pagan impuestos",
            "Actividades económicas fuera del marco legal",
            "Bancos internacionales",
            "Tiendas departamentales"
        ],
        correct: 1,
        explanation: "La economía informal incluye actividades económicas que operan fuera del marco legal y fiscal."
    },
    {
        q: "¿Cómo se llama el pago mensual en un trabajo formal?",
        options: [
            "Propina",
            "Salario o sueldo con recibo de nómina",
            "Comisión sin documentar",
            "Dinero en efectivo sin registro"
        ],
        correct: 1,
        explanation: "En un trabajo formal, el pago mensual se llama salario o sueldo y viene con recibo de nómina oficial."
    }
];

let formalInformalCurrentQ = 0;
let formalInformalAnswers = [];
let formalInformalStartTime = 0;

// Iniciar examen de trabajos formales/informales
function startFormalInformalTest() {
    formalInformalCurrentQ = 0;
    formalInformalAnswers = [];
    formalInformalStartTime = Date.now();

    showScreen('formalInformalTestScreen');
    loadFormalInformalQuestion();
}

// Cargar pregunta
function loadFormalInformalQuestion() {
    const container = document.getElementById('formalInformalQuestionContainer');
    if (!container) return;

    const q = formalInformalQuestions[formalInformalCurrentQ];

    container.innerHTML = `
        <div class="question-progress">
            <span>Pregunta ${formalInformalCurrentQ + 1} de ${formalInformalQuestions.length}</span>
            <div class="progress-bar-mini">
                <div class="progress-fill" style="width: ${((formalInformalCurrentQ + 1) / formalInformalQuestions.length) * 100}%"></div>
            </div>
        </div>

        <div class="question-card">
            <h3 class="question-text">${q.q}</h3>
            <div class="options-grid">
                ${q.options.map((opt, i) => `
                    <div class="option-card ${formalInformalAnswers[formalInformalCurrentQ] === i ? 'selected' : ''}"
                         onclick="selectFormalInformalAnswer(${i})">
                        <div class="option-letter">${String.fromCharCode(65 + i)}</div>
                        <div class="option-text">${opt}</div>
                    </div>
                `).join('')}
            </div>

            <div class="question-navigation">
                ${formalInformalCurrentQ > 0 ?
                    `<button class="btn-nav secondary" onclick="previousFormalInformalQuestion()">← Anterior</button>` :
                    '<div></div>'}
                <button class="btn-nav primary" onclick="nextFormalInformalQuestion()">
                    ${formalInformalCurrentQ === formalInformalQuestions.length - 1 ? 'Finalizar' : 'Siguiente →'}
                </button>
            </div>
        </div>
    `;
}

// Seleccionar respuesta
function selectFormalInformalAnswer(index) {
    formalInformalAnswers[formalInformalCurrentQ] = index;
    loadFormalInformalQuestion();
}

// Siguiente pregunta
function nextFormalInformalQuestion() {
    if (formalInformalAnswers[formalInformalCurrentQ] === undefined) {
        showToast('⚠️ Por favor selecciona una respuesta', 'warning');
        return;
    }

    formalInformalCurrentQ++;

    if (formalInformalCurrentQ >= formalInformalQuestions.length) {
        finishFormalInformalTest();
    } else {
        loadFormalInformalQuestion();
    }
}

// Pregunta anterior
function previousFormalInformalQuestion() {
    if (formalInformalCurrentQ > 0) {
        formalInformalCurrentQ--;
        loadFormalInformalQuestion();
    }
}

// Finalizar examen
function finishFormalInformalTest() {
    let correct = 0;
    formalInformalQuestions.forEach((q, i) => {
        if (formalInformalAnswers[i] === q.correct) correct++;
    });

    const score = Math.round((correct / formalInformalQuestions.length) * 100);
    const timeElapsed = Math.floor((Date.now() - formalInformalStartTime) / 1000);

    if (!isPracticeMode) {
        incrementAttempts(currentTestType);
    }

    const result = {
        user: currentUser.name,
        email: currentUser.email,
        testType: currentTestType,
        difficulty: currentDifficulty,
        test: 'Trabajos Formales e Informales',
        score: score,
        correctAnswers: correct,
        totalQuestions: formalInformalQuestions.length,
        time: timeElapsed,
        isPractice: isPracticeMode
    };

    lastTestResult = result;

    if (!isPracticeMode) {
        saveResult(result);
        sendToGoogleSheets(result, 'resultado');
    }

    showResults(score, 'Trabajos Formales e Informales');
}

// ========================================
// EXAMEN: CÓDIGO DE VESTIMENTA FORMAL
// ========================================

const dressCodeScenarios = [
    {
        scenario: "Entrevista de trabajo en una empresa corporativa",
        image: "business-suit",
        avatarDesc: "Persona profesional con traje oscuro, camisa blanca y corbata",
        visualTip: "Traje de dos piezas (saco y pantalón), camisa de botones, corbata conservadora, zapatos formales lustrados",
        question: "¿Qué vestimenta es apropiada?",
        options: [
            { text: "Traje formal, camisa y corbata", correct: true, feedback: "¡Excelente! Para entrevistas corporativas es esencial vestir formalmente. Un traje bien ajustado proyecta profesionalismo y seriedad." },
            { text: "Jeans y camiseta deportiva", correct: false, feedback: "Demasiado casual. Las empresas corporativas esperan vestimenta formal." },
            { text: "Short y sandalias", correct: false, feedback: "Totalmente inapropiado para una entrevista formal." },
            { text: "Ropa deportiva", correct: false, feedback: "La ropa deportiva no es apropiada para entrevistas de trabajo." }
        ]
    },
    {
        scenario: "Primer día de trabajo en una oficina",
        image: "business-casual",
        avatarDesc: "Persona en vestimenta business casual: pantalón de vestir y camisa",
        visualTip: "Pantalón de vestir, camisa de botones (sin corbata), zapatos formales pero cómodos, accesorios discretos",
        question: "¿Cómo debes vestir?",
        options: [
            { text: "Ropa de playa", correct: false, feedback: "Completamente inapropiado para una oficina." },
            { text: "Vestimenta business casual (pantalón de vestir, camisa)", correct: true, feedback: "¡Correcto! Business casual es apropiado para la mayoría de oficinas. Es profesional pero no tan rígido como traje completo." },
            { text: "Pijama", correct: false, feedback: "El pijama es solo para casa, nunca para el trabajo." },
            { text: "Disfraz", correct: false, feedback: "Los disfraces no son apropiados para el trabajo (excepto eventos especiales)." }
        ]
    },
    {
        scenario: "Reunión importante con clientes",
        image: "executive-meeting",
        avatarDesc: "Ejecutivo/a en traje completo presentando profesionalismo",
        visualTip: "Traje impecable (oscuro: azul marino o gris), camisa clara bien planchada, corbata clásica, maletín profesional",
        question: "¿Qué vestimenta proyecta profesionalismo?",
        options: [
            { text: "Sudadera con capucha", correct: false, feedback: "Demasiado casual para una reunión con clientes." },
            { text: "Traje completo y zapatos formales", correct: true, feedback: "¡Perfecto! Un traje completo proyecta profesionalismo y respeto. Los clientes valorarán tu imagen cuidada." },
            { text: "Shorts y flip-flops", correct: false, feedback: "Totalmente inapropiado para una reunión de negocios." },
            { text: "Ropa arrugada y sucia", correct: false, feedback: "La apariencia descuidada proyecta falta de profesionalismo." }
        ]
    },
    {
        scenario: "Trabajo en call center / atención telefónica",
        image: "office-casual",
        avatarDesc: "Persona vestida de manera profesional casual para trabajo remoto",
        visualTip: "Business casual: pantalón/falda cómodos pero presentables, polo o blusa, calzado cerrado",
        question: "¿Qué nivel de formalidad se requiere?",
        options: [
            { text: "Business casual (aunque no te vean, la actitud importa)", correct: true, feedback: "¡Correcto! Vestir bien ayuda a tu actitud y profesionalismo. Tu forma de vestir afecta tu confianza y cómo te expresas por teléfono." },
            { text: "Cualquier cosa, nadie me ve", correct: false, feedback: "La vestimenta afecta tu actitud y profesionalismo." },
            { text: "Ropa de dormir", correct: false, feedback: "Mantener estándares profesionales mejora tu desempeño." },
            { text: "No importa la vestimenta", correct: false, feedback: "Tu vestimenta influye en cómo te sientes y trabajas." }
        ]
    },
    {
        scenario: "Trabajo en restaurante de alta categoría",
        image: "hospitality-uniform",
        avatarDesc: "Personal de servicio con uniforme impecable y presentación pulcra",
        visualTip: "Uniforme completo del establecimiento, perfectamente limpio y planchado, zapatos lustrados, cabello recogido/peinado",
        question: "¿Qué vestimenta se requiere?",
        options: [
            { text: "Uniforme impecable, planchado y limpio", correct: true, feedback: "¡Exacto! En servicios de alta categoría la imagen es fundamental. Tu presentación refleja la calidad del establecimiento." },
            { text: "Ropa casual de calle", correct: false, feedback: "Los restaurantes formales exigen uniformes específicos." },
            { text: "Ropa deportiva", correct: false, feedback: "Inapropiado para un ambiente formal de servicio." },
            { text: "Lo que quieras", correct: false, feedback: "Los restaurantes tienen códigos de vestimenta estrictos." }
        ]
    },
    {
        scenario: "Evento de networking profesional",
        image: "networking-smart",
        avatarDesc: "Profesional en vestimenta smart casual para evento de networking",
        visualTip: "Smart casual: blazer sport, camisa/blusa sin corbata, pantalón/falda de vestir, zapatos elegantes pero cómodos",
        question: "¿Cómo debes vestir?",
        options: [
            { text: "Casual elegante (smart casual)", correct: true, feedback: "¡Correcto! Smart casual es ideal para networking. Te permite verte profesional pero accesible y crear conexiones genuinas." },
            { text: "Pijama de diseñador", correct: false, feedback: "Aunque sea de diseñador, un pijama no es apropiado." },
            { text: "Ropa de gimnasio", correct: false, feedback: "La ropa deportiva no es apropiada para eventos profesionales." },
            { text: "Traje de baño", correct: false, feedback: "Totalmente inapropiado para un evento profesional." }
        ]
    },
    {
        scenario: "Presentación ante directivos de la empresa",
        image: "executive-presentation",
        avatarDesc: "Profesional presentando con atuendo ejecutivo formal",
        visualTip: "Traje oscuro de alta calidad, camisa blanca o celeste, corbata conservadora, accesorios mínimos pero elegantes",
        question: "¿Qué vestimenta es esencial?",
        options: [
            { text: "Camiseta con estampados", correct: false, feedback: "Demasiado informal para presentar ante directivos." },
            { text: "Traje oscuro, camisa clara, corbata conservadora", correct: true, feedback: "¡Excelente! Esta es la vestimenta ideal para presentaciones ejecutivas. Proyecta autoridad y credibilidad." },
            { text: "Jeans rotos y zapatillas", correct: false, feedback: "Completamente inapropiado para el ámbito ejecutivo." },
            { text: "Ropa con manchas", correct: false, feedback: "La apariencia descuidada es inaceptable en el ámbito ejecutivo." }
        ]
    },
    {
        scenario: "Video conferencia importante",
        image: "video-professional",
        avatarDesc: "Persona en videollamada con vestimenta profesional completa",
        visualTip: "Atuendo profesional completo (no solo la parte superior), colores sólidos que se vean bien en cámara, fondo ordenado",
        question: "¿Qué debes considerar?",
        options: [
            { text: "Solo vestir bien de la cintura para arriba", correct: false, feedback: "Aunque tentador, debes estar completamente presentable por si necesitas pararte." },
            { text: "Vestir completamente profesional como si fuera presencial", correct: true, feedback: "¡Correcto! Siempre debes estar completamente presentable en videollamadas. Los accidentes pasan y siempre es mejor estar preparado." },
            { text: "Pijama completa", correct: false, feedback: "Las videollamadas laborales requieren vestimenta profesional." },
            { text: "Sin camisa", correct: false, feedback: "Totalmente inapropiado, incluso en videollamadas." }
        ]
    }
];

let dressCodeCurrentQ = 0;
let dressCodeAnswers = [];
let dressCodeStartTime = 0;

// Iniciar examen de código de vestimenta
function startDressCodeTest() {
    dressCodeCurrentQ = 0;
    dressCodeAnswers = [];
    dressCodeStartTime = Date.now();

    showScreen('dressCodeTestScreen');
    loadDressCodeQuestion();
}

// Cargar pregunta de vestimenta
function loadDressCodeQuestion() {
    const container = document.getElementById('dressCodeQuestionContainer');
    if (!container) return;

    const scenario = dressCodeScenarios[dressCodeCurrentQ];

    // Generar icono visual basado en el tipo de imagen
    const iconMap = {
        'business-suit': '👔',
        'business-casual': '👕',
        'executive-meeting': '💼',
        'office-casual': '🏢',
        'hospitality-uniform': '🍽️',
        'networking-smart': '🤝',
        'executive-presentation': '📊',
        'video-professional': '💻'
    };

    const icon = iconMap[scenario.image] || '👔';

    container.innerHTML = `
        <div class="scenario-progress">
            <span>Escenario ${dressCodeCurrentQ + 1} de ${dressCodeScenarios.length}</span>
        </div>

        <div class="scenario-card">
            <div class="scenario-visual-section">
                <div class="scenario-icon-large">${icon}</div>
                <div class="avatar-description">
                    <strong>👤 Imagen profesional:</strong>
                    <p>${scenario.avatarDesc}</p>
                </div>
            </div>

            <h2 class="scenario-title">${scenario.scenario}</h2>

            <div class="visual-tip-box">
                <div class="tip-icon">💡</div>
                <div class="tip-content">
                    <strong>Consejo visual:</strong>
                    <p>${scenario.visualTip}</p>
                </div>
            </div>

            <h3 class="scenario-question">${scenario.question}</h3>

            <div class="dress-options">
                ${scenario.options.map((opt, i) => `
                    <div class="dress-option ${dressCodeAnswers[dressCodeCurrentQ] === i ? 'selected' : ''}"
                         onclick="selectDressCodeAnswer(${i})">
                        <div class="option-content">
                            <div class="option-radio ${dressCodeAnswers[dressCodeCurrentQ] === i ? 'checked' : ''}"></div>
                            <div class="option-label">${opt.text}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="scenario-navigation">
                ${dressCodeCurrentQ > 0 ?
                    `<button class="btn-nav secondary" onclick="previousDressCodeQuestion()">← Anterior</button>` :
                    '<div></div>'}
                <button class="btn-nav primary" onclick="nextDressCodeQuestion()">
                    ${dressCodeCurrentQ === dressCodeScenarios.length - 1 ? 'Finalizar' : 'Siguiente →'}
                </button>
            </div>
        </div>
    `;
}

// Seleccionar respuesta
function selectDressCodeAnswer(index) {
    dressCodeAnswers[dressCodeCurrentQ] = index;
    loadDressCodeQuestion();
}

// Siguiente pregunta
function nextDressCodeQuestion() {
    if (dressCodeAnswers[dressCodeCurrentQ] === undefined) {
        showToast('⚠️ Por favor selecciona una opción', 'warning');
        return;
    }

    dressCodeCurrentQ++;

    if (dressCodeCurrentQ >= dressCodeScenarios.length) {
        finishDressCodeTest();
    } else {
        loadDressCodeQuestion();
    }
}

// Pregunta anterior
function previousDressCodeQuestion() {
    if (dressCodeCurrentQ > 0) {
        dressCodeCurrentQ--;
        loadDressCodeQuestion();
    }
}

// Finalizar examen
function finishDressCodeTest() {
    let correct = 0;
    dressCodeScenarios.forEach((scenario, i) => {
        const selectedOption = dressCodeAnswers[i];
        if (selectedOption !== undefined && scenario.options[selectedOption].correct) {
            correct++;
        }
    });

    const score = Math.round((correct / dressCodeScenarios.length) * 100);
    const timeElapsed = Math.floor((Date.now() - dressCodeStartTime) / 1000);

    if (!isPracticeMode) {
        incrementAttempts(currentTestType);
    }

    const result = {
        user: currentUser.name,
        email: currentUser.email,
        testType: currentTestType,
        difficulty: currentDifficulty,
        test: 'Código de Vestimenta Profesional',
        score: score,
        correctAnswers: correct,
        totalQuestions: dressCodeScenarios.length,
        time: timeElapsed,
        isPractice: isPracticeMode
    };

    lastTestResult = result;

    if (!isPracticeMode) {
        saveResult(result);
        sendToGoogleSheets(result, 'resultado');
    }

    showResults(score, 'Código de Vestimenta Profesional');
}

// ========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================

window.addEventListener('DOMContentLoaded', () => {
    // Limpiar intentos guardados (ya no hay límite de intentos)
    localStorage.removeItem('attempts');

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

        // Cargar avatar PRO si existe
        const savedAvatarPro = localStorage.getItem(`avatar_pro_${currentUser.email}`);
        if (savedAvatarPro) {
            avatarConfig = JSON.parse(savedAvatarPro);
            updateUserAvatarPro();
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

// ========================================
// NUEVAS FUNCIONALIDADES
// ========================================

// ========================================
// 1. SOPA DE LETRAS
// ========================================

const wordSearchWords = [
    'TRABAJO', 'EMPLEO', 'CARRERA', 'CURRICULUM', 'ENTREVISTA',
    'HABILIDAD', 'EXPERIENCIA', 'EDUCACION', 'PROFESIONAL', 'OBJETIVO',
    'COMPETENCIA', 'LIDERAZGO', 'EQUIPO', 'COMUNICACION', 'RESPONSABLE'
];

let wordSearchGrid = [];
let wordSearchSize = 15;
let wordsFoundList = [];
let wordSearchScore = 0;
let isSelecting = false;
let selectedCells = [];
let wordSearchStartTime;

function startWordSearch() {
    if (!currentUser) {
        showToast('Debes iniciar sesión', 'error');
        return;
    }

    // Reiniciar variables
    wordsFoundList = [];
    wordSearchScore = 0;
    selectedCells = [];
    isSelecting = false;

    // Actualizar badges
    const badge = document.getElementById('testTypeBadgeWS');
    if (badge) {
        badge.textContent = currentTestType === 'pre' ? 'PRE-TEST' : 'POST-TEST';
        badge.className = `test-badge ${currentTestType}`;
    }

    // Generar sopa de letras
    generateWordSearch();
    displayWordSearch();
    displayWordsList();

    // Iniciar temporizador
    remainingTime = 600; // 10 minutos
    startCountdown('wordSearchTimer');
    wordSearchStartTime = Date.now();

    showScreen('wordSearchScreen');
}

function generateWordSearch() {
    // Crear grilla vacía
    wordSearchGrid = Array(wordSearchSize).fill(null).map(() =>
        Array(wordSearchSize).fill('')
    );

    // Colocar palabras
    wordSearchWords.forEach(word => {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 100) {
            const direction = Math.floor(Math.random() * 8); // 8 direcciones
            const row = Math.floor(Math.random() * wordSearchSize);
            const col = Math.floor(Math.random() * wordSearchSize);

            if (canPlaceWord(word, row, col, direction)) {
                placeWord(word, row, col, direction);
                placed = true;
            }
            attempts++;
        }
    });

    // Rellenar espacios vacíos con letras aleatorias
    for (let i = 0; i < wordSearchSize; i++) {
        for (let j = 0; j < wordSearchSize; j++) {
            if (wordSearchGrid[i][j] === '') {
                wordSearchGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }
}

function canPlaceWord(word, row, col, direction) {
    const directions = [
        [0, 1],   // Horizontal derecha
        [0, -1],  // Horizontal izquierda
        [1, 0],   // Vertical abajo
        [-1, 0],  // Vertical arriba
        [1, 1],   // Diagonal abajo-derecha
        [-1, -1], // Diagonal arriba-izquierda
        [1, -1],  // Diagonal abajo-izquierda
        [-1, 1]   // Diagonal arriba-derecha
    ];

    const [dx, dy] = directions[direction];

    for (let i = 0; i < word.length; i++) {
        const newRow = row + (i * dx);
        const newCol = col + (i * dy);

        if (newRow < 0 || newRow >= wordSearchSize ||
            newCol < 0 || newCol >= wordSearchSize) {
            return false;
        }

        if (wordSearchGrid[newRow][newCol] !== '' &&
            wordSearchGrid[newRow][newCol] !== word[i]) {
            return false;
        }
    }

    return true;
}

function placeWord(word, row, col, direction) {
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];

    const [dx, dy] = directions[direction];

    for (let i = 0; i < word.length; i++) {
        const newRow = row + (i * dx);
        const newCol = col + (i * dy);
        wordSearchGrid[newRow][newCol] = word[i];
    }
}

function displayWordSearch() {
    const container = document.getElementById('wordSearchGrid');
    container.innerHTML = '';

    for (let i = 0; i < wordSearchSize; i++) {
        for (let j = 0; j < wordSearchSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'ws-cell';
            cell.textContent = wordSearchGrid[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;

            cell.addEventListener('mousedown', startSelection);
            cell.addEventListener('mouseenter', continueSelection);
            cell.addEventListener('mouseup', endSelection);

            container.appendChild(cell);
        }
    }

    // Eventos táctiles para móviles
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
}

function displayWordsList() {
    const container = document.getElementById('wordsList');
    container.innerHTML = '';

    wordSearchWords.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word-item';
        wordDiv.textContent = word;
        wordDiv.dataset.word = word;
        container.appendChild(wordDiv);
    });

    document.getElementById('totalWords').textContent = wordSearchWords.length;
    document.getElementById('wordsFound').textContent = wordsFoundList.length;
    document.getElementById('wsScore').textContent = wordSearchScore;
}

function startSelection(e) {
    // No permitir seleccionar celdas ya encontradas
    if (e.target.classList.contains('ws-found')) {
        return;
    }

    // Limpiar selecciones previas antes de comenzar nueva selección
    document.querySelectorAll('.ws-cell.ws-selected').forEach(cell => {
        if (!cell.classList.contains('ws-found')) {
            cell.classList.remove('ws-selected');
        }
    });

    isSelecting = true;
    selectedCells = [e.target];
    e.target.classList.add('ws-selected');
}

function continueSelection(e) {
    if (!isSelecting) return;

    // No permitir seleccionar celdas ya encontradas
    if (e.target.classList.contains('ws-found')) {
        return;
    }

    // Verificar que el target sea una celda válida
    if (!e.target.classList.contains('ws-cell')) {
        return;
    }

    if (!selectedCells.includes(e.target)) {
        selectedCells.push(e.target);
        e.target.classList.add('ws-selected');
    }
}

function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;

    checkSelectedWord();

    // Limpiar selección - SIEMPRE limpiar celdas que no fueron encontradas
    setTimeout(() => {
        selectedCells.forEach(cell => {
            if (!cell.classList.contains('ws-found')) {
                cell.classList.remove('ws-selected');
            }
        });
        selectedCells = [];
    }, 100);
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.contains('ws-cell')) {
        startSelection({ target: element });
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.contains('ws-cell')) {
        continueSelection({ target: element });
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    endSelection();
}

function checkSelectedWord() {
    if (selectedCells.length < 3) return;

    const word = selectedCells.map(cell => cell.textContent).join('');
    const reverseWord = word.split('').reverse().join('');

    let foundWord = null;
    if (wordSearchWords.includes(word)) {
        foundWord = word;
    } else if (wordSearchWords.includes(reverseWord)) {
        foundWord = reverseWord;
    }

    if (foundWord && !wordsFoundList.includes(foundWord)) {
        wordsFoundList.push(foundWord);
        wordSearchScore += 100;

        // Marcar celdas como encontradas
        selectedCells.forEach(cell => {
            cell.classList.add('ws-found');
            cell.classList.remove('ws-selected');
        });

        // Marcar palabra en la lista
        const wordItem = document.querySelector(`.word-item[data-word="${foundWord}"]`);
        if (wordItem) {
            wordItem.classList.add('word-found');
        }

        // Actualizar stats
        document.getElementById('wordsFound').textContent = wordsFoundList.length;
        document.getElementById('wsScore').textContent = wordSearchScore;

        showToast(`¡Encontraste: ${foundWord}! +100 puntos`, 'success');

        // Verificar si terminó
        if (wordsFoundList.length === wordSearchWords.length) {
            setTimeout(() => finishWordSearch(), 500);
        }
    }
}

function finishWordSearch() {
    clearInterval(countdownInterval);

    const timeElapsed = Math.floor((Date.now() - wordSearchStartTime) / 1000);
    const timeBonus = Math.max(0, (600 - timeElapsed) * 2); // Bonus por tiempo
    const finalScore = wordSearchScore + timeBonus;

    const percentage = Math.round((finalScore / (wordSearchWords.length * 100 + 1200)) * 100);

    const result = {
        user: currentUser.name,
        email: currentUser.email,
        testType: currentTestType,
        test: 'Sopa de Letras',
        score: percentage,
        correctAnswers: wordsFoundList.length,
        totalQuestions: wordSearchWords.length,
        time: timeElapsed,
        isPractice: isPracticeMode
    };

    lastTestResult = result;

    if (!isPracticeMode) {
        saveResult(result);
        sendToGoogleSheets(result, 'resultado');
    }

    showResults(percentage, 'Sopa de Letras');
}

// ========================================
// 2. SISTEMA DE EXÁMENES POR CÓDIGO
// ========================================

let examCodes = JSON.parse(localStorage.getItem('examCodes') || '{}');
let currentCodeExam = null;
let currentCodeExamQuestion = 0;
let codeExamAnswers = [];
let codeExamStartTime;

function showCodeExamInput() {
    if (!currentUser) {
        showToast('Debes iniciar sesión', 'error');
        return;
    }

    document.getElementById('examCodeInput').value = '';
    document.getElementById('codeExamError').style.display = 'none';
    showScreen('codeExamInputScreen');
}

function validateExamCode() {
    const code = document.getElementById('examCodeInput').value.trim().toUpperCase();
    const errorDiv = document.getElementById('codeExamError');

    if (!code) {
        errorDiv.textContent = 'Por favor ingresa un código';
        errorDiv.style.display = 'block';
        return;
    }

    if (!examCodes[code]) {
        errorDiv.textContent = 'Código inválido. Verifica con tu profesor.';
        errorDiv.style.display = 'block';
        return;
    }

    currentCodeExam = examCodes[code];

    // Si es un examen del sistema, redirigir a la función correspondiente
    if (currentCodeExam.isSystemExam) {
        startSystemExam(currentCodeExam);
    } else {
        // Examen personalizado
        startCodeExam();
    }
}

function startSystemExam(examData) {
    showToast(`Iniciando: ${examData.title}`, 'success');

    // Configurar dificultad si aplica
    if (examData.examDifficulty) {
        currentDifficulty = examData.examDifficulty;
    }

    // Redirigir según el tipo de examen
    switch (examData.examFunction) {
        case 'startQuiz':
            currentDifficulty = examData.examDifficulty;
            startQuiz();
            break;
        case 'startCVErrors':
            startCVErrors();
            break;
        case 'startCVBuilder':
            startCVBuilder();
            break;
        case 'startInterview':
            startInterview();
            break;
        case 'startStrengthsTest':
            startStrengthsTest();
            break;
        case 'startWordSearch':
            startWordSearch();
            break;
        default:
            showToast('Tipo de examen no reconocido', 'error');
    }
}

function startCodeExam() {
    currentCodeExamQuestion = 0;
    codeExamAnswers = [];

    // Actualizar título
    document.getElementById('codeExamTitle').textContent = currentCodeExam.title;

    // Actualizar badge
    const badge = document.getElementById('testTypeBadgeCE');
    if (badge) {
        badge.textContent = currentTestType === 'pre' ? 'PRE-TEST' : 'POST-TEST';
        badge.className = `test-badge ${currentTestType}`;
    }

    // Iniciar temporizador
    remainingTime = currentCodeExam.timeLimit || 900; // 15 minutos por defecto
    startCountdown('codeExamTimer');
    codeExamStartTime = Date.now();

    loadCodeExamQuestion();
    showScreen('codeExamScreen');
}

function loadCodeExamQuestion() {
    const question = currentCodeExam.questions[currentCodeExamQuestion];
    const container = document.getElementById('codeExamQuestionContainer');

    document.getElementById('codeExamCurrentQ').textContent = currentCodeExamQuestion + 1;
    document.getElementById('codeExamTotalQ').textContent = currentCodeExam.questions.length;

    const progress = ((currentCodeExamQuestion / currentCodeExam.questions.length) * 100);
    document.getElementById('codeExamProgress').textContent = Math.round(progress);
    document.getElementById('codeExamProgressBar').style.width = progress + '%';

    let html = `
        <h3 class="question-title">${question.q}</h3>
        <div class="options-container">
    `;

    question.options.forEach((option, index) => {
        html += `
            <div class="option-card" onclick="selectCodeExamOption(${index})">
                <div class="option-radio" id="codeExamRadio${index}"></div>
                <div class="option-text">${option}</div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;

    // Restaurar respuesta si existe
    if (codeExamAnswers[currentCodeExamQuestion] !== undefined) {
        selectCodeExamOption(codeExamAnswers[currentCodeExamQuestion], false);
    }
}

function selectCodeExamOption(index, save = true) {
    // Limpiar selección anterior
    document.querySelectorAll('#codeExamQuestionContainer .option-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelectorAll('#codeExamQuestionContainer .option-radio').forEach(radio => {
        radio.classList.remove('selected');
    });

    // Seleccionar nueva opción
    const cards = document.querySelectorAll('#codeExamQuestionContainer .option-card');
    const radios = document.querySelectorAll('#codeExamQuestionContainer .option-radio');
    cards[index].classList.add('selected');
    radios[index].classList.add('selected');

    if (save) {
        codeExamAnswers[currentCodeExamQuestion] = index;
    }
}

function nextCodeExamQuestion() {
    if (codeExamAnswers[currentCodeExamQuestion] === undefined) {
        showToast('Selecciona una respuesta', 'error');
        return;
    }

    if (currentCodeExamQuestion < currentCodeExam.questions.length - 1) {
        currentCodeExamQuestion++;
        loadCodeExamQuestion();
    } else {
        finishCodeExam();
    }
}

function finishCodeExam() {
    clearInterval(countdownInterval);

    let correct = 0;
    codeExamAnswers.forEach((answer, index) => {
        if (answer === currentCodeExam.questions[index].correct) {
            correct++;
        }
    });

    const score = Math.round((correct / currentCodeExam.questions.length) * 100);
    const timeElapsed = Math.floor((Date.now() - codeExamStartTime) / 1000);

    const result = {
        user: currentUser.name,
        email: currentUser.email,
        testType: currentTestType,
        test: currentCodeExam.title,
        score: score,
        correctAnswers: correct,
        totalQuestions: currentCodeExam.questions.length,
        time: timeElapsed,
        isPractice: isPracticeMode,
        examCode: currentCodeExam.code
    };

    lastTestResult = result;

    if (!isPracticeMode) {
        saveResult(result);
        sendToGoogleSheets(result, 'resultado');
    }

    showResults(score, currentCodeExam.title);
}

// FUNCIONES DE ADMINISTRADOR PARA CREAR EXÁMENES

function createExamCode(examData) {
    // Generar código único
    const code = 'EXAM-' + Date.now().toString(36).toUpperCase();

    examCodes[code] = {
        code: code,
        title: examData.title,
        description: examData.description,
        questions: examData.questions,
        timeLimit: examData.timeLimit || 900,
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
    };

    localStorage.setItem('examCodes', JSON.stringify(examCodes));
    return code;
}

function deleteExamCode(code) {
    delete examCodes[code];
    localStorage.setItem('examCodes', JSON.stringify(examCodes));
}

function getExamCodes() {
    return examCodes;
}

// ========================================
// 3. TEST DE FORTALEZAS Y DEBILIDADES
// ========================================

const strengthsQuestions = [
    {
        q: "¿Cómo te describes en situaciones de trabajo bajo presión?",
        options: [
            { text: "Me mantengo calmado y enfocado", type: "fortaleza", score: 5 },
            { text: "Me estreso pero logro completar las tareas", type: "neutral", score: 3 },
            { text: "Me cuesta manejar la presión", type: "debilidad", score: 1 },
            { text: "Prefiero evitar situaciones de alta presión", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Qué tan bien trabajas en equipo?",
        options: [
            { text: "Excelente, me gusta colaborar y escuchar ideas", type: "fortaleza", score: 5 },
            { text: "Bien, aunque a veces prefiero trabajar solo", type: "neutral", score: 3 },
            { text: "Me cuesta adaptarme a los demás", type: "debilidad", score: 1 },
            { text: "Prefiero trabajar individualmente siempre", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Cómo manejas las críticas constructivas?",
        options: [
            { text: "Las acepto y las uso para mejorar", type: "fortaleza", score: 5 },
            { text: "Me molestan pero trato de aprender", type: "neutral", score: 3 },
            { text: "Me afectan negativamente", type: "debilidad", score: 1 },
            { text: "Las tomo de forma personal", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Qué tan organizado eres con tus tareas?",
        options: [
            { text: "Muy organizado, planifico todo con anticipación", type: "fortaleza", score: 5 },
            { text: "Medianamente organizado", type: "neutral", score: 3 },
            { text: "Desorganizado, a veces olvido cosas", type: "debilidad", score: 1 },
            { text: "Muy desorganizado, me cuesta priorizar", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Cómo es tu comunicación con los demás?",
        options: [
            { text: "Excelente, me expreso clara y efectivamente", type: "fortaleza", score: 5 },
            { text: "Buena, aunque a veces me cuesta explicarme", type: "neutral", score: 3 },
            { text: "Regular, tengo dificultades para comunicarme", type: "debilidad", score: 1 },
            { text: "Muy tímido, evito hablar en público", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Cómo reaccionas ante los cambios?",
        options: [
            { text: "Me adapto rápidamente a nuevas situaciones", type: "fortaleza", score: 5 },
            { text: "Me toma tiempo pero me adapto", type: "neutral", score: 3 },
            { text: "Me cuesta adaptarme a los cambios", type: "debilidad", score: 1 },
            { text: "Prefiero mantener la rutina siempre", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Qué tan proactivo eres?",
        options: [
            { text: "Muy proactivo, tomo iniciativa constantemente", type: "fortaleza", score: 5 },
            { text: "A veces tomo iniciativa", type: "neutral", score: 3 },
            { text: "Espero instrucciones antes de actuar", type: "debilidad", score: 1 },
            { text: "Rara vez tomo la iniciativa", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Cómo manejas los conflictos?",
        options: [
            { text: "Los resuelvo mediante diálogo y compromiso", type: "fortaleza", score: 5 },
            { text: "Trato de resolverlos aunque me incomoden", type: "neutral", score: 3 },
            { text: "Me cuesta enfrentar conflictos", type: "debilidad", score: 1 },
            { text: "Los evito completamente", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Qué tan responsable eres con tus compromisos?",
        options: [
            { text: "Muy responsable, siempre cumplo", type: "fortaleza", score: 5 },
            { text: "Generalmente cumplo mis compromisos", type: "neutral", score: 3 },
            { text: "A veces olvido mis compromisos", type: "debilidad", score: 1 },
            { text: "Me cuesta cumplir con responsabilidades", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Cómo describes tu nivel de creatividad?",
        options: [
            { text: "Muy creativo, siempre propongo nuevas ideas", type: "fortaleza", score: 5 },
            { text: "Moderadamente creativo", type: "neutral", score: 3 },
            { text: "Poco creativo, prefiero seguir métodos establecidos", type: "debilidad", score: 1 },
            { text: "No me considero creativo", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Qué tan puntual eres?",
        options: [
            { text: "Siempre llego a tiempo o antes", type: "fortaleza", score: 5 },
            { text: "Generalmente soy puntual", type: "neutral", score: 3 },
            { text: "A menudo llego tarde", type: "debilidad", score: 1 },
            { text: "Tengo problemas serios de puntualidad", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Cómo manejas múltiples tareas simultáneas?",
        options: [
            { text: "Muy bien, puedo hacer multitasking efectivamente", type: "fortaleza", score: 5 },
            { text: "Razonablemente bien", type: "neutral", score: 3 },
            { text: "Me cuesta manejar varias tareas a la vez", type: "debilidad", score: 1 },
            { text: "Prefiero hacer una tarea a la vez", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Qué tan bien aceptas responsabilidades de liderazgo?",
        options: [
            { text: "Me siento cómodo liderando equipos", type: "fortaleza", score: 5 },
            { text: "Puedo liderar si es necesario", type: "neutral", score: 3 },
            { text: "Prefiero no liderar", type: "debilidad", score: 1 },
            { text: "Me incomoda mucho liderar", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Cómo describes tu capacidad de aprendizaje?",
        options: [
            { text: "Aprendo rápido y me gusta adquirir nuevas habilidades", type: "fortaleza", score: 5 },
            { text: "Aprendo a un ritmo normal", type: "neutral", score: 3 },
            { text: "Me toma tiempo aprender cosas nuevas", type: "debilidad", score: 1 },
            { text: "Tengo dificultades para aprender", type: "debilidad", score: 1 }
        ]
    },
    {
        q: "¿Qué tan bien manejas el estrés?",
        options: [
            { text: "Muy bien, tengo buenas técnicas de manejo", type: "fortaleza", score: 5 },
            { text: "Razonablemente bien", type: "neutral", score: 3 },
            { text: "El estrés me afecta significativamente", type: "debilidad", score: 1 },
            { text: "Tengo grandes problemas con el estrés", type: "debilidad", score: 1 }
        ]
    }
];

let currentStrengthsQuestion = 0;
let strengthsAnswers = [];
let strengthsStartTime;

function startStrengthsTest() {
    currentStrengthsQuestion = 0;
    strengthsAnswers = [];

    // Actualizar badge
    const badge = document.getElementById('testTypeBadgeSWT');
    if (badge) {
        badge.textContent = currentTestType === 'pre' ? 'PRE-TEST' : 'POST-TEST';
        badge.className = `test-badge ${currentTestType}`;
    }

    // Iniciar temporizador
    remainingTime = 1200; // 20 minutos
    startCountdown('strengthsTimer');
    strengthsStartTime = Date.now();

    loadStrengthsQuestion();
    showScreen('strengthsTestScreen');
}

function loadStrengthsQuestion() {
    const question = strengthsQuestions[currentStrengthsQuestion];
    const container = document.getElementById('strengthsQuestionContainer');

    document.getElementById('strengthsCurrentQ').textContent = currentStrengthsQuestion + 1;
    document.getElementById('strengthsTotalQ').textContent = strengthsQuestions.length;

    const progress = ((currentStrengthsQuestion / strengthsQuestions.length) * 100);
    document.getElementById('strengthsProgress').textContent = Math.round(progress);
    document.getElementById('strengthsProgressBar').style.width = progress + '%';

    let html = `
        <h3 class="question-title">${question.q}</h3>
        <div class="options-container">
    `;

    question.options.forEach((option, index) => {
        html += `
            <div class="option-card" data-index="${index}">
                <div class="option-radio" id="strengthsRadio${index}"></div>
                <div class="option-text">${option.text}</div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;

    // Agregar event listeners a las opciones
    const optionCards = container.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            selectStrengthsOption(index);
        });
    });

    // Restaurar respuesta si existe
    if (strengthsAnswers[currentStrengthsQuestion] !== undefined) {
        selectStrengthsOption(strengthsAnswers[currentStrengthsQuestion], false);
    }
}

function selectStrengthsOption(index, save = true) {
    // Limpiar selección anterior
    document.querySelectorAll('#strengthsQuestionContainer .option-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelectorAll('#strengthsQuestionContainer .option-radio').forEach(radio => {
        radio.classList.remove('selected');
    });

    // Seleccionar nueva opción
    const cards = document.querySelectorAll('#strengthsQuestionContainer .option-card');
    const radios = document.querySelectorAll('#strengthsQuestionContainer .option-radio');
    cards[index].classList.add('selected');
    radios[index].classList.add('selected');

    if (save) {
        strengthsAnswers[currentStrengthsQuestion] = index;
    }
}

function nextStrengthsQuestion() {
    if (strengthsAnswers[currentStrengthsQuestion] === undefined) {
        showToast('Selecciona una respuesta', 'error');
        return;
    }

    if (currentStrengthsQuestion < strengthsQuestions.length - 1) {
        currentStrengthsQuestion++;
        loadStrengthsQuestion();
    } else {
        finishStrengthsTest();
    }
}

function finishStrengthsTest() {
    clearInterval(countdownInterval);

    let totalScore = 0;
    let fortalezas = 0;
    let debilidades = 0;

    strengthsAnswers.forEach((answerIndex, questionIndex) => {
        const option = strengthsQuestions[questionIndex].options[answerIndex];
        totalScore += option.score;

        if (option.type === 'fortaleza') fortalezas++;
        else if (option.type === 'debilidad') debilidades++;
    });

    const maxScore = strengthsQuestions.length * 5;
    const percentage = Math.round((totalScore / maxScore) * 100);
    const timeElapsed = Math.floor((Date.now() - strengthsStartTime) / 1000);

    const result = {
        user: currentUser.name,
        email: currentUser.email,
        testType: currentTestType,
        test: 'Fortalezas y Debilidades',
        score: percentage,
        correctAnswers: fortalezas,
        totalQuestions: strengthsQuestions.length,
        time: timeElapsed,
        isPractice: isPracticeMode,
        fortalezas: fortalezas,
        debilidades: debilidades
    };

    lastTestResult = result;

    if (!isPracticeMode) {
        saveResult(result);
        sendToGoogleSheets(result, 'resultado');
    }

    showResults(percentage, 'Fortalezas y Debilidades');
}

// ========================================
// PANEL DE ADMINISTRACIÓN DE EXÁMENES
// ========================================

let newExamQuestions = [];

function showExamCodesManager() {
    showScreen('examCodesManagerScreen');
    loadExamCodesList();
    updateCodeStats();

    // Configurar listeners para los checkboxes
    setTimeout(() => {
        const checkboxes = document.querySelectorAll('input[name="examSelection"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateExamSelectionCount);
        });
        updateExamSelectionCount();
    }, 100);
}

// Actualizar contador de exámenes seleccionados
function updateExamSelectionCount() {
    const checkboxes = document.querySelectorAll('input[name="examSelection"]:checked');
    const count = checkboxes.length;
    const countEl = document.getElementById('selectedCount');
    const summaryEl = document.getElementById('examSummary');
    const summaryListEl = document.getElementById('examSummaryList');

    if (countEl) {
        countEl.textContent = count;

        // Animar el contador
        const badge = document.querySelector('.selected-count-badge');
        if (badge) {
            badge.style.transform = 'scale(1.1)';
            setTimeout(() => badge.style.transform = 'scale(1)', 200);
        }
    }

    const examNames = {
        'quiz_easy': '📝 Cuestionario PRE-TEST',
        'quiz_hard': '📝 Cuestionario POST-TEST',
        'cv_errors': '🔍 Detectar Errores en CV',
        'cv_builder': '📄 Constructor de CV',
        'interview': '🎭 Simulador de Entrevista',
        'personality': '🧠 Test de Personalidad',
        'formal': '💼 Test Formal/Informal',
        'dresscode': '👔 Código de Vestimenta',
        'strengths': '💪 Fortalezas y Debilidades',
        'wordsearch': '🔤 Sopa de Letras'
    };

    if (count > 0 && summaryEl && summaryListEl) {
        summaryEl.style.display = 'block';
        const selectedExams = Array.from(checkboxes).map(cb => cb.value);
        summaryListEl.innerHTML = selectedExams.map(exam =>
            `<div style="padding: 0.25rem 0;">✓ ${examNames[exam] || exam}</div>`
        ).join('');
    } else if (summaryEl) {
        summaryEl.style.display = 'none';
    }
}

// Limpiar selección de exámenes
function clearExamSelection() {
    const checkboxes = document.querySelectorAll('input[name="examSelection"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateExamSelectionCount();
    document.getElementById('assignExamTitle').value = '';
    document.getElementById('assignExamDescription').value = '';
    showToast('Selección limpiada', 'info');
}

// Generar código único para múltiples exámenes
function generateMultiExamCode() {
    const checkboxes = document.querySelectorAll('input[name="examSelection"]:checked');
    const selectedExams = Array.from(checkboxes).map(cb => cb.value);
    const customTitle = document.getElementById('assignExamTitle').value.trim();
    const description = document.getElementById('assignExamDescription').value.trim();

    if (selectedExams.length === 0) {
        showToast('❌ Selecciona al menos un examen', 'error');
        return;
    }

    // Generar código único
    const code = 'MULTI-' + Date.now().toString(36).toUpperCase();

    // Nombres de exámenes para el mensaje
    const examNames = {
        'quiz_easy': 'Cuestionario PRE-TEST',
        'quiz_hard': 'Cuestionario POST-TEST',
        'cv_errors': 'Detectar Errores en CV',
        'cv_builder': 'Constructor de CV',
        'interview': 'Simulador de Entrevista',
        'personality': 'Test de Personalidad',
        'formal': 'Test Formal/Informal',
        'dresscode': 'Código de Vestimenta',
        'strengths': 'Fortalezas y Debilidades',
        'wordsearch': 'Sopa de Letras'
    };

    const examsList = selectedExams.map(e => examNames[e]).join(', ');
    const finalTitle = customTitle || `Paquete de ${selectedExams.length} Exámenes`;

    // Guardar en localStorage
    const examCodes = JSON.parse(localStorage.getItem('examCodes') || '{}');

    examCodes[code] = {
        code: code,
        title: finalTitle,
        description: description || `Paquete con ${selectedExams.length} evaluaciones`,
        exams: selectedExams, // Array de exámenes incluidos
        isMultiExam: true,
        examCount: selectedExams.length,
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
        used: false
    };

    localStorage.setItem('examCodes', JSON.stringify(examCodes));

    showToast(`✅ Código generado exitosamente: ${code}`, 'success');

    // Mostrar modal moderno con el código
    showCodeGeneratedModal(code, finalTitle, selectedExams, examNames);

    // Limpiar formulario y recargar lista
    clearExamSelection();
    loadExamCodesList();
    updateCodeStats();
}

// Mostrar modal con código generado
function showCodeGeneratedModal(code, title, exams, examNames) {
    const modal = document.getElementById('codeGeneratedModal');
    const codeValue = document.getElementById('modalCodeValue');
    const codeTitle = document.getElementById('modalCodeTitle');
    const codeExams = document.getElementById('modalCodeExams');
    const codeDate = document.getElementById('modalCodeDate');
    const examsList = document.getElementById('modalExamsList');

    // Actualizar valores
    codeValue.textContent = code;
    codeTitle.textContent = title;
    codeExams.textContent = exams.length;
    codeDate.textContent = new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Crear lista de exámenes
    examsList.innerHTML = '<h4>📚 Lista de Exámenes:</h4>' +
        exams.map(e => `<div class="exam-item-modal">✓ ${examNames[e]}</div>`).join('');

    // Mostrar modal con animación
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

// Cerrar modal de código
function closeCodeModal(event) {
    if (event && event.target !== event.currentTarget) return;

    const modal = document.getElementById('codeGeneratedModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// Copiar código al portapapeles
function copyCodeToClipboard() {
    const codeValue = document.getElementById('modalCodeValue').textContent;

    navigator.clipboard.writeText(codeValue).then(() => {
        showToast('📋 Código copiado al portapapeles', 'success');

        // Cambiar ícono temporalmente
        const btn = event.target.closest('.btn-copy');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;

        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        showToast('❌ Error al copiar código', 'error');
    });
}

// Copiar código y cerrar modal
function copyCodeAndClose() {
    copyCodeToClipboard();
    setTimeout(() => closeCodeModal(), 1000);
}

// Actualizar contador de exámenes seleccionados (alias para compatibilidad)
function updateSelectedCount() {
    updateExamSelectionCount();
}

// Actualizar estadísticas de códigos
function updateCodeStats() {
    const examCodes = JSON.parse(localStorage.getItem('examCodes') || '{}');
    const codesArray = Object.values(examCodes);

    const totalCodes = codesArray.length;
    const usedCodes = codesArray.filter(c => c.used).length;
    const activeCodes = totalCodes - usedCodes;
    const totalExams = codesArray.reduce((sum, c) => sum + (c.examCount || 0), 0);

    // Actualizar en el DOM si existen los elementos
    const totalActiveEl = document.getElementById('totalActiveCodes');
    const totalUsedEl = document.getElementById('totalUsedCodes');
    const totalGeneratedEl = document.getElementById('totalGeneratedCodes');
    const totalExamsEl = document.getElementById('totalExamsInCodes');

    if (totalActiveEl) totalActiveEl.textContent = activeCodes;
    if (totalUsedEl) totalUsedEl.textContent = usedCodes;
    if (totalGeneratedEl) totalGeneratedEl.textContent = totalCodes;
    if (totalExamsEl) totalExamsEl.textContent = totalExams;
}

// Cancelar asignación
function cancelAssignExam() {
    document.getElementById('existingExamType').value = '';
    document.getElementById('assignExamTitle').value = '';
    document.getElementById('assignExamDescription').value = '';
    document.getElementById('examPreview').style.display = 'none';
}

function showCreateExamForm() {
    document.getElementById('createExamForm').style.display = 'block';
    newExamQuestions = [];
    document.getElementById('questionsContainer').innerHTML = '';
    document.getElementById('examTitle').value = '';
    document.getElementById('examDescription').value = '';
    document.getElementById('examTimeLimit').value = '15';

    // Agregar una pregunta por defecto
    addQuestionToExam();
}

function cancelCreateExam() {
    document.getElementById('createExamForm').style.display = 'none';
    newExamQuestions = [];
}

function addQuestionToExam() {
    const questionIndex = newExamQuestions.length;
    newExamQuestions.push({
        q: '',
        options: ['', '', '', ''],
        correct: 0
    });

    const container = document.getElementById('questionsContainer');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-card';
    questionDiv.style.marginBottom = '1rem';
    questionDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4>Pregunta ${questionIndex + 1}</h4>
            ${questionIndex > 0 ? `<button class="btn-nav secondary" onclick="removeQuestion(${questionIndex})">Eliminar</button>` : ''}
        </div>
        <div class="form-group">
            <label>Pregunta:</label>
            <input type="text" id="question_${questionIndex}" placeholder="Escribe tu pregunta aquí..." onchange="updateQuestionText(${questionIndex}, this.value)">
        </div>
        <div class="form-group">
            <label>Opciones de respuesta:</label>
            ${[0, 1, 2, 3].map(optIndex => `
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; align-items: center;">
                    <input type="radio" name="correct_${questionIndex}" value="${optIndex}" ${optIndex === 0 ? 'checked' : ''} onchange="updateCorrectAnswer(${questionIndex}, ${optIndex})">
                    <input type="text" id="option_${questionIndex}_${optIndex}" placeholder="Opción ${optIndex + 1}" style="flex: 1;" onchange="updateOption(${questionIndex}, ${optIndex}, this.value)">
                </div>
            `).join('')}
            <small>Selecciona el círculo de la respuesta correcta</small>
        </div>
    `;
    container.appendChild(questionDiv);
}

function removeQuestion(index) {
    newExamQuestions.splice(index, 1);
    renderQuestionsForm();
}

function renderQuestionsForm() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    newExamQuestions.forEach((q, index) => {
        addQuestionToExam();
        document.getElementById(`question_${index}`).value = q.q;
        q.options.forEach((opt, optIndex) => {
            document.getElementById(`option_${index}_${optIndex}`).value = opt;
        });
        document.querySelector(`input[name="correct_${index}"][value="${q.correct}"]`).checked = true;
    });
}

function updateQuestionText(index, value) {
    newExamQuestions[index].q = value;
}

function updateOption(questionIndex, optionIndex, value) {
    newExamQuestions[questionIndex].options[optionIndex] = value;
}

function updateCorrectAnswer(questionIndex, correctIndex) {
    newExamQuestions[questionIndex].correct = correctIndex;
}

function saveNewExam() {
    const title = document.getElementById('examTitle').value.trim();
    const description = document.getElementById('examDescription').value.trim();
    const timeLimit = parseInt(document.getElementById('examTimeLimit').value) * 60; // Convertir a segundos

    if (!title) {
        showToast('Ingresa un título para el examen', 'error');
        return;
    }

    if (newExamQuestions.length === 0) {
        showToast('Agrega al menos una pregunta', 'error');
        return;
    }

    // Validar que todas las preguntas estén completas
    for (let i = 0; i < newExamQuestions.length; i++) {
        const q = newExamQuestions[i];
        if (!q.q.trim()) {
            showToast(`La pregunta ${i + 1} está vacía`, 'error');
            return;
        }
        for (let j = 0; j < q.options.length; j++) {
            if (!q.options[j].trim()) {
                showToast(`La opción ${j + 1} de la pregunta ${i + 1} está vacía`, 'error');
                return;
            }
        }
    }

    const examData = {
        title: title,
        description: description,
        questions: newExamQuestions,
        timeLimit: timeLimit
    };

    const code = createExamCode(examData);

    showToast(`Examen creado exitosamente. Código: ${code}`, 'success');

    // Mostrar el código en un modal o alert
    alert(`¡Examen creado exitosamente!\n\nCódigo del examen: ${code}\n\nComparte este código con tus estudiantes para que puedan realizar el examen.`);

    cancelCreateExam();
    loadExamCodesList();
}

function loadExamCodesList() {
    const tbody = document.getElementById('examCodesTableBody');
    const examCodes = JSON.parse(localStorage.getItem('examCodes') || '{}');
    const allCodes = Object.values(examCodes);

    if (allCodes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray-500);">No hay códigos generados aún</td></tr>';
        return;
    }

    tbody.innerHTML = allCodes.map(codeData => {
        const date = new Date(codeData.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const statusBadge = codeData.used
            ? '<span style="padding: 0.25rem 0.75rem; background: #fca5a5; color: #991b1b; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">USADO</span>'
            : '<span style="padding: 0.25rem 0.75rem; background: #86efac; color: #166534; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">ACTIVO</span>';

        return `
            <tr style="transition: background 0.2s ease;">
                <td>
                    <strong style="font-family: 'Courier New', monospace; color: var(--primary); font-size: 0.9rem;">${codeData.code}</strong>
                </td>
                <td style="max-width: 250px;">
                    <div style="font-weight: 600; color: var(--gray-900);">${codeData.title}</div>
                    ${codeData.description ? `<div style="font-size: 0.85rem; color: var(--gray-600); margin-top: 0.25rem;">${codeData.description}</div>` : ''}
                </td>
                <td>
                    <span style="font-weight: 600; color: var(--primary);">${codeData.examCount || 0}</span> examen${(codeData.examCount || 0) !== 1 ? 'es' : ''}
                </td>
                <td>${statusBadge}</td>
                <td>${date}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem; justify-content: center;">
                        <button class="btn-modern secondary small" onclick="copyExamCode('${codeData.code}')" title="Copiar código">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                            </svg>
                        </button>
                        <button class="btn-modern secondary small" onclick="viewCodeDetails('${codeData.code}')" title="Ver detalles">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </button>
                        ${!codeData.used ? `
                        <button class="btn-modern secondary small" onclick="confirmDeleteExam('${codeData.code}')" title="Eliminar" style="color: #dc2626;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Ver detalles de un código
function viewCodeDetails(code) {
    const examCodes = JSON.parse(localStorage.getItem('examCodes') || '{}');
    const codeData = examCodes[code];

    if (!codeData) {
        showToast('❌ Código no encontrado', 'error');
        return;
    }

    const examNames = {
        'quiz_easy': 'Cuestionario PRE-TEST',
        'quiz_hard': 'Cuestionario POST-TEST',
        'cv_errors': 'Detectar Errores en CV',
        'cv_builder': 'Constructor de CV',
        'interview': 'Simulador de Entrevista',
        'personality': 'Test de Personalidad',
        'formal': 'Test Formal/Informal',
        'dresscode': 'Código de Vestimenta',
        'strengths': 'Fortalezas y Debilidades',
        'wordsearch': 'Sopa de Letras'
    };

    showCodeGeneratedModal(code, codeData.title, codeData.exams || [], examNames);
}

function copyExamCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast(`Código ${code} copiado al portapapeles`, 'success');
    }).catch(() => {
        prompt('Copia este código:', code);
    });
}

function confirmDeleteExam(code) {
    if (confirm(`¿Estás seguro de eliminar el examen con código ${code}?`)) {
        deleteExamCode(code);
        showToast('Examen eliminado', 'success');
        loadExamCodesList();
    }
}

// Exportar funciones
window.startWordSearch = startWordSearch;
window.finishWordSearch = finishWordSearch;
window.showCodeExamInput = showCodeExamInput;
window.validateExamCode = validateExamCode;
window.nextCodeExamQuestion = nextCodeExamQuestion;
window.selectCodeExamOption = selectCodeExamOption;
window.createExamCode = createExamCode;
window.deleteExamCode = deleteExamCode;
window.getExamCodes = getExamCodes;
window.startStrengthsTest = startStrengthsTest;
window.loadStrengthsQuestion = loadStrengthsQuestion;
window.nextStrengthsQuestion = nextStrengthsQuestion;
window.selectStrengthsOption = selectStrengthsOption;
window.showExamCodesManager = showExamCodesManager;
window.showCreateExamForm = showCreateExamForm;
window.cancelCreateExam = cancelCreateExam;
window.addQuestionToExam = addQuestionToExam;
window.removeQuestion = removeQuestion;
window.updateQuestionText = updateQuestionText;
window.updateOption = updateOption;
window.updateCorrectAnswer = updateCorrectAnswer;
window.saveNewExam = saveNewExam;
window.copyExamCode = copyExamCode;
window.confirmDeleteExam = confirmDeleteExam;
window.switchExamTab = switchExamTab;
window.updateExamPreview = updateExamPreview;
window.saveAssignExam = saveAssignExam;
window.cancelAssignExam = cancelAssignExam;
window.startSystemExam = startSystemExam;

// ========================================
// SISTEMA DE PERFILES DE USUARIO
// ========================================

function showUserProfile() {
    if (!currentUser) {
        showToast('Debes iniciar sesión', 'error');
        return;
    }

    // Cargar información del usuario
    document.getElementById('profileUserName').textContent = `${currentUser.name} ${currentUser.lastName}`;
    document.getElementById('profileUserEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone || '-';
    document.getElementById('profileAge').textContent = currentUser.age || '-';

    const registeredDate = new Date(currentUser.registeredAt);
    document.getElementById('profileRegistered').textContent = registeredDate.toLocaleDateString();

    // Cargar foto de perfil
    const profilePhoto = localStorage.getItem(`profilePhoto_${currentUser.email}`);
    if (profilePhoto) {
        document.getElementById('userProfilePhoto').src = profilePhoto;
    } else {
        // Usar avatar por defecto
        document.getElementById('userProfilePhoto').src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`;
    }

    // Calcular estadísticas
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');
    const userResults = allResults.filter(r => r.email === currentUser.email && !r.isPractice);

    document.getElementById('profileTestsCompleted').textContent = userResults.length;

    if (userResults.length > 0) {
        const avgScore = Math.round(userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length);
        const bestScore = Math.max(...userResults.map(r => r.score));
        document.getElementById('profileAvgScore').textContent = avgScore + '%';
        document.getElementById('profileBestScore').textContent = bestScore + '%';
    } else {
        document.getElementById('profileAvgScore').textContent = '0%';
        document.getElementById('profileBestScore').textContent = '0%';
    }

    // Cargar historial de actividades
    loadUserActivityHistory();

    showScreen('userProfileScreen');
}

function loadUserActivityHistory() {
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');
    const userResults = allResults.filter(r => r.email === currentUser.email)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const container = document.getElementById('userActivityHistory');

    if (userResults.length === 0) {
        container.innerHTML = '<p class="no-data">No hay actividades registradas</p>';
        return;
    }

    container.innerHTML = userResults.map(result => {
        const date = new Date(result.timestamp);
        const timeStr = formatTime(result.time);
        const scoreClass = result.score >= CONFIG.PASSING_SCORE ? 'success' : 'danger';

        return `
            <div class="activity-item">
                <div class="activity-icon ${scoreClass}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${result.score >= CONFIG.PASSING_SCORE
                            ? '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
                            : '<path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
                        }
                    </svg>
                </div>
                <div class="activity-content">
                    <h4>${result.test}</h4>
                    <p>Tipo: ${result.testType === 'pre' ? 'PRE-TEST' : 'POST-TEST'} | Puntuación: <strong>${result.score}%</strong> | Tiempo: ${timeStr}</p>
                    <span class="activity-date">${date.toLocaleString()}</span>
                </div>
            </div>
        `;
    }).join('');
}

function changeUserPassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Completa todos los campos', 'error');
        return;
    }

    if (currentPassword !== currentUser.password) {
        showToast('La contraseña actual es incorrecta', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast('La nueva contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Las contraseñas nuevas no coinciden', 'error');
        return;
    }

    // Actualizar contraseña
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        currentUser.password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showToast('Contraseña actualizada exitosamente', 'success');

        // Limpiar campos
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }
}

// ========================================
// GESTIÓN DE USUARIOS (ADMIN)
// ========================================

let selectedUser = null;

function showUsersManagement() {
    showScreen('usersManagementScreen');
    loadUsersGrid();
}

function loadUsersGrid() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');
    const container = document.getElementById('usersGrid');

    if (users.length === 0) {
        container.innerHTML = '<p class="no-data">No hay usuarios registrados</p>';
        return;
    }

    container.innerHTML = users.map(user => {
        const userResults = allResults.filter(r => r.email === user.email && !r.isPractice);
        const avgScore = userResults.length > 0
            ? Math.round(userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length)
            : 0;

        const profilePhoto = localStorage.getItem(`profilePhoto_${user.email}`) ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;

        const userName = (user.name || '') + ' ' + (user.lastName || '');
        const userNameTrimmed = userName.trim() || 'Usuario sin nombre';

        return `
            <div class="user-card" data-user-email="${user.email}" onclick='showUserDetailByEmail("${user.email}")'>
                <img src="${profilePhoto}" alt="${userNameTrimmed}" class="user-card-photo">
                <div class="user-card-info">
                    <h3>${userNameTrimmed}</h3>
                    <p>${user.email}</p>
                    <div class="user-card-stats">
                        <span>${userResults.length} pruebas</span>
                        <span>${avgScore}% promedio</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearchInput').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filtered = users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm) ||
        (user.lastName || '').toLowerCase().includes(searchTerm) ||
        (user.email || '').toLowerCase().includes(searchTerm)
    );

    const allResults = JSON.parse(localStorage.getItem('results') || '[]');
    const container = document.getElementById('usersGrid');

    container.innerHTML = filtered.map(user => {
        const userResults = allResults.filter(r => r.email === user.email && !r.isPractice);
        const avgScore = userResults.length > 0
            ? Math.round(userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length)
            : 0;

        const profilePhoto = localStorage.getItem(`profilePhoto_${user.email}`) ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;

        const userName = (user.name || '') + ' ' + (user.lastName || '');
        const userNameTrimmed = userName.trim() || 'Usuario sin nombre';

        return `
            <div class="user-card" data-user-email="${user.email}" onclick='showUserDetailByEmail("${user.email}")'>
                <img src="${profilePhoto}" alt="${userNameTrimmed}" class="user-card-photo">
                <div class="user-card-info">
                    <h3>${userNameTrimmed}</h3>
                    <p>${user.email}</p>
                    <div class="user-card-stats">
                        <span>${userResults.length} pruebas</span>
                        <span>${avgScore}% promedio</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showUserDetail(user) {
    selectedUser = user;

    const profilePhoto = localStorage.getItem(`profilePhoto_${user.email}`) ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;

    const userName = (user.name || '') + ' ' + (user.lastName || '');
    const userNameTrimmed = userName.trim() || 'Usuario sin nombre';

    document.getElementById('modalUserPhoto').src = profilePhoto;
    document.getElementById('modalUserName').textContent = userNameTrimmed;
    document.getElementById('modalUserEmail').textContent = user.email || '-';
    document.getElementById('modalUserFullName').textContent = userNameTrimmed;
    document.getElementById('modalUserPhone').textContent = user.phone || '-';
    document.getElementById('modalUserAge').textContent = user.age || '-';

    const registeredDate = user.registeredAt ? new Date(user.registeredAt) : new Date();
    document.getElementById('modalUserRegistered').textContent = registeredDate.toLocaleDateString();

    // Cargar resultados
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');
    const userResults = allResults.filter(r => r.email === user.email && !r.isPractice);
    document.getElementById('modalUserTests').textContent = userResults.length;

    // Actualizar rol y botón de admin
    const roleSpan = document.getElementById('modalUserRole');
    const toggleBtn = document.getElementById('toggleAdminBtn');

    if (user.isAdmin) {
        roleSpan.textContent = '👑 Administrador';
        roleSpan.style.color = '#f59e0b';
        toggleBtn.textContent = 'Quitar Administrador';
    } else {
        roleSpan.textContent = 'Usuario Normal';
        roleSpan.style.color = '#6b7280';
        toggleBtn.textContent = 'Hacer Administrador';
    }

    loadUserResultsInModal(user.email);

    document.getElementById('userDetailModal').style.display = 'flex';
}

function closeUserDetailModal() {
    document.getElementById('userDetailModal').style.display = 'none';
    selectedUser = null;
}

function showUserDetailByEmail(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (user) {
        showUserDetail(user);
    } else {
        showToast('❌ Usuario no encontrado', 'error');
    }
}

function switchUserDetailTab(tab) {
    // Remover active de todos los tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Activar tab seleccionado
    event.target.classList.add('active');
    document.getElementById(`userDetailTab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
}

function loadUserResultsInModal(email) {
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');
    const userResults = allResults.filter(r => r.email === email && !r.isPractice)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const container = document.getElementById('modalUserResults');

    if (userResults.length === 0) {
        container.innerHTML = '<p class="no-data">No hay resultados registrados</p>';
        return;
    }

    container.innerHTML = `
        <table class="results-table">
            <thead>
                <tr>
                    <th>Prueba</th>
                    <th>Tipo</th>
                    <th>Puntuación</th>
                    <th>Tiempo</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
                ${userResults.map(result => {
                    const date = new Date(result.timestamp);
                    const timeStr = formatTime(result.time);
                    const scoreClass = result.score >= CONFIG.PASSING_SCORE ? 'success' : 'danger';

                    return `
                        <tr>
                            <td>${result.test}</td>
                            <td><span class="test-badge ${result.testType}">${result.testType === 'pre' ? 'PRE' : 'POST'}</span></td>
                            <td><span class="score-badge ${scoreClass}">${result.score}%</span></td>
                            <td>${timeStr}</td>
                            <td>${date.toLocaleString()}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function adminChangeUserPassword() {
    if (!selectedUser) return;

    const newPassword = document.getElementById('adminNewPassword').value;

    if (!newPassword) {
        showToast('Ingresa una nueva contraseña', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === selectedUser.email);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));

        showToast(`Contraseña actualizada para ${selectedUser.name}`, 'success');
        document.getElementById('adminNewPassword').value = '';
    }
}

function toggleUserAdmin() {
    if (!selectedUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === selectedUser.email);

    if (userIndex !== -1) {
        // Toggle admin status
        users[userIndex].isAdmin = !users[userIndex].isAdmin;
        localStorage.setItem('users', JSON.stringify(users));

        // Update selected user
        selectedUser.isAdmin = users[userIndex].isAdmin;

        // Update UI
        const roleSpan = document.getElementById('modalUserRole');
        const toggleBtn = document.getElementById('toggleAdminBtn');

        if (users[userIndex].isAdmin) {
            roleSpan.textContent = '👑 Administrador';
            roleSpan.style.color = '#f59e0b';
            toggleBtn.textContent = 'Quitar Administrador';
            showToast(`${selectedUser.name} ahora es administrador`, 'success');
        } else {
            roleSpan.textContent = 'Usuario Normal';
            roleSpan.style.color = '#6b7280';
            toggleBtn.textContent = 'Hacer Administrador';
            showToast(`${selectedUser.name} ya no es administrador`, 'success');
        }

        loadUsersGrid();
    }
}

function confirmDeleteUser() {
    if (!selectedUser) return;

    if (confirm(`¿Estás seguro de eliminar al usuario ${selectedUser.name} ${selectedUser.lastName}?\n\nEsta acción eliminará todos sus datos y resultados.`)) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filteredUsers = users.filter(u => u.email !== selectedUser.email);
        localStorage.setItem('users', JSON.stringify(filteredUsers));

        // Eliminar resultados del usuario
        const allResults = JSON.parse(localStorage.getItem('results') || '[]');
        const filteredResults = allResults.filter(r => r.email !== selectedUser.email);
        localStorage.setItem('results', JSON.stringify(filteredResults));

        // Eliminar foto de perfil
        localStorage.removeItem(`profilePhoto_${selectedUser.email}`);
        localStorage.removeItem(`avatar_pro_${selectedUser.email}`);

        showToast('Usuario eliminado', 'success');
        closeUserDetailModal();
        loadUsersGrid();
    }
}

// Función para editar datos de usuario (ADMIN)
function enableUserEditing() {
    if (!selectedUser) return;

    // Convertir campos a editables
    const nameField = document.getElementById('modalUserFullName');
    const phoneField = document.getElementById('modalUserPhone');
    const ageField = document.getElementById('modalUserAge');

    if (!nameField || !phoneField || !ageField) return;

    // Crear inputs editables
    nameField.innerHTML = `<input type="text" id="editUserName" value="${selectedUser.name || ''}" style="padding: 0.5rem; border: 2px solid var(--primary); border-radius: 5px; width: 100%;">`;
    phoneField.innerHTML = `<input type="text" id="editUserPhone" value="${selectedUser.phone || ''}" style="padding: 0.5rem; border: 2px solid var(--primary); border-radius: 5px; width: 100%;">`;
    ageField.innerHTML = `<input type="number" id="editUserAge" value="${selectedUser.age || ''}" style="padding: 0.5rem; border: 2px solid var(--primary); border-radius: 5px; width: 100%;">`;

    // Cambiar botón de editar a guardar
    const editBtn = document.getElementById('editUserBtn');
    if (editBtn) {
        editBtn.textContent = 'Guardar Cambios';
        editBtn.onclick = saveUserEdits;
        editBtn.style.background = 'var(--success)';
    }

    showToast('Modo edición activado', 'info');
}

// Guardar cambios de usuario (ADMIN)
function saveUserEdits() {
    if (!selectedUser) return;

    const newName = document.getElementById('editUserName')?.value.trim();
    const newPhone = document.getElementById('editUserPhone')?.value.trim();
    const newAge = document.getElementById('editUserAge')?.value;

    if (!newName) {
        showToast('El nombre no puede estar vacío', 'error');
        return;
    }

    // Actualizar usuario en localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === selectedUser.email);

    if (userIndex !== -1) {
        users[userIndex].name = newName;
        users[userIndex].phone = newPhone;
        users[userIndex].age = newAge ? parseInt(newAge) : null;

        localStorage.setItem('users', JSON.stringify(users));

        // Actualizar selectedUser
        selectedUser = users[userIndex];

        showToast('✅ Usuario actualizado correctamente', 'success');

        // Recargar vista del modal
        showUserDetail(selectedUser);
        loadUsersGrid();
    }
}

// Función para resetear contraseña de usuario (ADMIN)
function resetUserPassword() {
    if (!selectedUser) return;

    const newPassword = prompt(`Ingresa la nueva contraseña para ${selectedUser.name}:`, '123456');

    if (!newPassword) {
        return;
    }

    if (newPassword.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === selectedUser.email);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));

        showToast(`✅ Contraseña actualizada para ${selectedUser.name}`, 'success');
    }
}

// Función para ver todos los resultados de un usuario (ADMIN)
function exportUserResults() {
    if (!selectedUser) return;

    const allResults = JSON.parse(localStorage.getItem('results') || '[]');
    const userResults = allResults.filter(r => r.email === selectedUser.email && !r.isPractice);

    if (userResults.length === 0) {
        showToast('Este usuario no tiene resultados', 'info');
        return;
    }

    // Crear CSV
    let csv = 'Fecha,Test,Puntuación,Respuestas Correctas,Total Preguntas,Tiempo\n';

    userResults.forEach(r => {
        const date = new Date(r.timestamp).toLocaleDateString();
        csv += `${date},${r.test},${r.score}%,${r.correctAnswers},${r.totalQuestions},${r.time}s\n`;
    });

    // Descargar CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultados_${selectedUser.name}_${selectedUser.lastName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`✅ Resultados de ${selectedUser.name} exportados`, 'success');
}

// Exportar funciones para el admin
window.enableUserEditing = enableUserEditing;
window.saveUserEdits = saveUserEdits;
window.resetUserPassword = resetUserPassword;
window.exportUserResults = exportUserResults;

// ========================================
// GRÁFICAS Y ESTADÍSTICAS
// ========================================

function createCharts() {
    createScoresDistributionChart();
    createTestsTypeChart();
    createTopUsersChart();
    createActivityChart();
}

function createScoresDistributionChart() {
    const canvas = document.getElementById('scoresChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');

    // Agrupar por rangos de puntuación
    const ranges = {
        '0-20': 0,
        '21-40': 0,
        '41-60': 0,
        '61-80': 0,
        '81-100': 0
    };

    allResults.forEach(r => {
        if (r.score <= 20) ranges['0-20']++;
        else if (r.score <= 40) ranges['21-40']++;
        else if (r.score <= 60) ranges['41-60']++;
        else if (r.score <= 80) ranges['61-80']++;
        else ranges['81-100']++;
    });

    drawBarChart(ctx, Object.keys(ranges), Object.values(ranges), '#E86C4A');
}

function createTestsTypeChart() {
    const canvas = document.getElementById('testsTypeChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');

    const testTypes = {};
    allResults.forEach(r => {
        testTypes[r.test] = (testTypes[r.test] || 0) + 1;
    });

    const labels = Object.keys(testTypes).slice(0, 5);
    const values = Object.values(testTypes).slice(0, 5);

    drawPieChart(ctx, labels, values);
}

function createTopUsersChart() {
    const canvas = document.getElementById('topUsersChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');

    const userScores = {};
    allResults.forEach(r => {
        if (!userScores[r.user]) {
            userScores[r.user] = { total: 0, count: 0 };
        }
        userScores[r.user].total += r.score;
        userScores[r.user].count++;
    });

    const topUsers = Object.entries(userScores)
        .map(([name, data]) => ({ name, avg: data.total / data.count }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 5);

    const labels = topUsers.map(u => u.name.split(' ')[0]);
    const values = topUsers.map(u => Math.round(u.avg));

    drawBarChart(ctx, labels, values, '#2A9D8F');
}

function createActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');

    const last7Days = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        last7Days[dateStr] = 0;
    }

    allResults.forEach(r => {
        const date = new Date(r.timestamp);
        const dateStr = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        if (last7Days.hasOwnProperty(dateStr)) {
            last7Days[dateStr]++;
        }
    });

    drawLineChart(ctx, Object.keys(last7Days), Object.values(last7Days), '#F4A261');
}

// Funciones auxiliares para dibujar gráficas

// ========================================
// GRÁFICAS CON CHART.JS - VERSIÓN PROFESIONAL
// ========================================
let chartInstances = {};

function drawBarChart(ctx, labels, values, color) {
    // Destruir gráfica anterior si existe
    if (chartInstances[ctx.canvas.id]) {
        chartInstances[ctx.canvas.id].destroy();
    }

    // Crear nueva gráfica con Chart.js
    chartInstances[ctx.canvas.id] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad',
                data: values,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 2,
                borderRadius: 5,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        font: { size: 12 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

function drawPieChart(ctx, labels, values) {
    // Destruir gráfica anterior si existe
    if (chartInstances[ctx.canvas.id]) {
        chartInstances[ctx.canvas.id].destroy();
    }

    const colors = ['#E86C4A', '#F4A261', '#2A9D8F', '#264653', '#E76F51', '#8B5CF6', '#EC4899'];

    // Crear nueva gráfica con Chart.js
    chartInstances[ctx.canvas.id] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 11 },
                        boxWidth: 12,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: label.length > 15 ? label.substring(0, 15) + '...' : label,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function drawLineChart(ctx, labels, values, color) {
    // Destruir gráfica anterior si existe
    if (chartInstances[ctx.canvas.id]) {
        chartInstances[ctx.canvas.id].destroy();
    }

    // Crear nueva gráfica con Chart.js
    chartInstances[ctx.canvas.id] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Actividad',
                data: values,
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        font: { size: 12 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

// ========================================
// MENTOR/COACH VIRTUAL SYSTEM
// ========================================

// Base de datos de consejos diarios
const DAILY_TIPS = [
    {
        category: "Entrevista",
        tip: "Investiga sobre la empresa antes de la entrevista. Conocer su misión y valores demuestra interés genuino y preparación profesional."
    },
    {
        category: "CV",
        tip: "Mantén tu CV conciso en una o dos páginas. Enfócate en logros cuantificables y experiencias relevantes para el puesto."
    },
    {
        category: "Comunicación",
        tip: "Practica la escucha activa. Espera tu turno para hablar y demuestra que comprendiste antes de responder."
    },
    {
        category: "Vestimenta",
        tip: "Viste siempre un nivel más formal de lo esperado. Es mejor estar sobre-vestido que sub-vestido en el ambiente laboral."
    },
    {
        category: "Puntualidad",
        tip: "Llega 10-15 minutos antes a tus citas laborales. La puntualidad demuestra respeto y profesionalismo."
    },
    {
        category: "Desarrollo Personal",
        tip: "Identifica una habilidad nueva cada mes para aprender. El aprendizaje continuo es clave en el mercado laboral actual."
    },
    {
        category: "Networking",
        tip: "Construye relaciones profesionales genuinas. Las conexiones de calidad son más valiosas que la cantidad."
    },
    {
        category: "Actitud",
        tip: "Mantén una actitud positiva incluso en momentos difíciles. Tu actitud puede diferenciarte de otros candidatos."
    },
    {
        category: "Entrevista",
        tip: "Prepara ejemplos concretos de tus logros usando el método STAR: Situación, Tarea, Acción, Resultado."
    },
    {
        category: "CV",
        tip: "Usa verbos de acción al inicio de cada punto: 'Desarrollé', 'Lideré', 'Implementé'. Esto hace tu CV más dinámico."
    },
    {
        category: "Comunicación",
        tip: "Elimina muletillas como 'eh', 'mmm', 'este'. Practica hablar con pausas naturales en lugar de llenar el silencio."
    },
    {
        category: "Etiqueta",
        tip: "Apaga tu celular o ponlo en silencio durante reuniones y entrevistas. Demuestra que estás completamente presente."
    },
    {
        category: "Entrevista",
        tip: "Haz preguntas inteligentes al entrevistador. Preguntar sobre cultura, crecimiento y responsabilidades demuestra interés."
    },
    {
        category: "Desarrollo Personal",
        tip: "Pide retroalimentación regularmente. Saber cómo otros te perciben te ayuda a mejorar continuamente."
    },
    {
        category: "CV",
        tip: "Personaliza tu CV para cada aplicación. Ajusta las palabras clave para que coincidan con la descripción del puesto."
    },
    {
        category: "Actitud",
        tip: "Convierte los errores en oportunidades de aprendizaje. Muestra cómo has crecido a partir de los desafíos."
    },
    {
        category: "Comunicación",
        tip: "Tu lenguaje corporal comunica tanto como tus palabras. Mantén contacto visual y una postura abierta."
    },
    {
        category: "Networking",
        tip: "Haz seguimiento después de conocer a alguien. Un mensaje simple de 'Gusto en conocerte' fortalece la conexión."
    },
    {
        category: "Entrevista",
        tip: "Practica la regla 80/20: deja que el entrevistador hable 80% del tiempo, especialmente al inicio."
    },
    {
        category: "Vestimenta",
        tip: "Los detalles importan: zapatos limpios, ropa planchada, higiene personal impecable. Todo suma o resta puntos."
    }
];

// Función para obtener el consejo del día
function getDailyTip() {
    const today = new Date().getDate();
    const tipIndex = today % DAILY_TIPS.length;
    return DAILY_TIPS[tipIndex];
}

// Función para mostrar la pantalla de Mentor/Coach
function showMentorCoach() {
    showScreen('mentorCoachScreen');

    // Actualizar nombre de usuario
    if (currentUser) {
        document.getElementById('mentorUserName').textContent = currentUser.name || currentUser.email;
    }

    // Cargar consejo del día
    const dailyTip = getDailyTip();
    document.getElementById('dailyTipContent').textContent = dailyTip.tip;
    document.getElementById('dailyTipCategory').textContent = dailyTip.category;

    // Cargar análisis de rendimiento
    loadPerformanceAnalysis();

    // Cargar recomendaciones
    loadRecommendations();

    // Cargar plan de aprendizaje
    loadLearningPath();
}

// Función para cargar análisis de rendimiento
function loadPerformanceAnalysis() {
    if (!currentUser) return;

    const email = currentUser.email;

    // Obtener resultados del usuario desde localStorage
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');
    const results = allResults.filter(r => r.email === email && !r.isPractice);
    const totalTests = results.length;

    let totalScore = 0;
    let scoreCount = 0;
    let strongAreas = 0;

    results.forEach(result => {
        if (result.score !== undefined) {
            totalScore += result.score;
            scoreCount++;
            if (result.score >= 80) strongAreas++;
        }
    });

    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

    // Calcular mejora (comparar primeros vs últimos tests)
    let improvementRate = 0;
    if (results.length >= 2) {
        const firstHalf = results.slice(0, Math.ceil(results.length / 2));
        const secondHalf = results.slice(Math.ceil(results.length / 2));

        const firstAvg = firstHalf.reduce((sum, r) => sum + (r.score || 0), 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, r) => sum + (r.score || 0), 0) / secondHalf.length;

        improvementRate = Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
    }

    // Actualizar UI
    document.getElementById('totalTestsTaken').textContent = totalTests;
    document.getElementById('averageScore').textContent = `${averageScore}%`;
    document.getElementById('improvementRate').textContent = improvementRate >= 0 ? `+${improvementRate}%` : `${improvementRate}%`;
    document.getElementById('strongAreas').textContent = strongAreas;
}

// Función para cargar recomendaciones personalizadas
function loadRecommendations() {
    if (!currentUser) return;

    const email = currentUser.email;

    // Obtener resultados del usuario desde localStorage
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');
    const results = allResults.filter(r => r.email === email && !r.isPractice);

    if (results.length === 0) return;

    const recommendations = [];

    // Analizar resultados y generar recomendaciones
    const testTypes = {};
    results.forEach(result => {
        if (!testTypes[result.testType]) {
            testTypes[result.testType] = [];
        }
        testTypes[result.testType].push(result.score || 0);
    });

    // Encontrar áreas débiles
    const weakAreas = [];
    for (const [type, scores] of Object.entries(testTypes)) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        if (avg < 70) {
            weakAreas.push({ type, avg });
        }
    }

    // Generar recomendaciones basadas en áreas débiles
    if (weakAreas.length === 0) {
        recommendations.push({
            icon: '🎉',
            title: '¡Excelente Desempeño!',
            description: 'Estás haciendo un gran trabajo en todas las áreas. Continúa practicando para mantener tu nivel.'
        });
        recommendations.push({
            icon: '🚀',
            title: 'Desafíate a ti mismo',
            description: 'Prueba el modo POST-TEST para evaluar habilidades más avanzadas y seguir creciendo.'
        });
    } else {
        weakAreas.forEach(area => {
            const recommendation = generateRecommendationForArea(area.type, area.avg);
            if (recommendation) recommendations.push(recommendation);
        });
    }

    // Si hay pocas pruebas realizadas
    if (results.length < 3) {
        recommendations.push({
            icon: '📚',
            title: 'Realiza más evaluaciones',
            description: 'Completa más pruebas para obtener un análisis más preciso de tus habilidades y áreas de oportunidad.'
        });
    }

    // Recomendación general
    recommendations.push({
        icon: '💪',
        title: 'Practica regularmente',
        description: 'La consistencia es clave. Dedica al menos 30 minutos diarios a mejorar tus habilidades laborales.'
    });

    // Renderizar recomendaciones
    const container = document.getElementById('recommendationsList');
    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <div class="recommendation-icon">${rec.icon}</div>
            <div class="recommendation-content">
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-description">${rec.description}</div>
            </div>
        </div>
    `).join('');
}

// Función auxiliar para generar recomendación por área
function generateRecommendationForArea(testType, avgScore) {
    const recommendations = {
        'quiz': {
            icon: '📝',
            title: 'Mejora tus conocimientos teóricos',
            description: `Tu promedio en cuestionarios es ${Math.round(avgScore)}%. Revisa conceptos básicos de orientación laboral y practica más.`
        },
        'interview': {
            icon: '🎤',
            title: 'Practica tus habilidades de entrevista',
            description: `Tu desempeño en entrevistas necesita atención. Practica respuestas usando el método STAR y graba tus respuestas.`
        },
        'cv': {
            icon: '📄',
            title: 'Fortalece tu CV',
            description: `Necesitas mejorar la construcción de tu CV. Enfócate en logros cuantificables y formato profesional.`
        },
        'personality': {
            icon: '🧠',
            title: 'Desarrolla tu inteligencia emocional',
            description: `Trabaja en conocerte mejor. Los tests de personalidad te ayudarán a identificar tus fortalezas únicas.`
        },
        'dressCode': {
            icon: '👔',
            title: 'Aprende etiqueta profesional',
            description: `La presentación profesional necesita mejorar. Estudia códigos de vestimenta y comportamiento laboral.`
        }
    };

    return recommendations[testType] || null;
}

// Función para cargar el plan de aprendizaje
function loadLearningPath() {
    if (!currentUser) return;

    const email = currentUser.email;

    // Obtener resultados del usuario desde localStorage
    const allResults = JSON.parse(localStorage.getItem('results') || '[]');
    const results = allResults.filter(r => r.email === email && !r.isPractice);

    // Verificar si tiene foto de perfil
    const hasProfilePhoto = localStorage.getItem(`profilePhoto_${email}`) !== null;

    // Definir pasos del plan de aprendizaje
    const steps = [
        {
            number: 1,
            title: 'Completa tu Perfil',
            description: 'Actualiza tu información personal y crea un avatar profesional',
            completed: hasProfilePhoto,
            inProgress: !hasProfilePhoto
        },
        {
            number: 2,
            title: 'Realiza el PRE-TEST',
            description: 'Evalúa tus conocimientos iniciales para identificar áreas de oportunidad',
            completed: results.some(r => r.testType === 'quiz' || r.type === 'PRE'),
            inProgress: !results.some(r => r.testType === 'quiz' || r.type === 'PRE')
        },
        {
            number: 3,
            title: 'Practica Entrevistas',
            description: 'Mejora tus habilidades de comunicación con el simulador de entrevistas',
            completed: results.some(r => r.testType === 'interview'),
            inProgress: results.some(r => r.testType === 'quiz') && !results.some(r => r.testType === 'interview')
        },
        {
            number: 4,
            title: 'Construye tu CV',
            description: 'Crea un currículum profesional que destaque tus habilidades',
            completed: results.some(r => r.testType === 'cv'),
            inProgress: results.some(r => r.testType === 'interview') && !results.some(r => r.testType === 'cv')
        },
        {
            number: 5,
            title: 'Domina la Etiqueta Profesional',
            description: 'Aprende las normas de comportamiento y vestimenta en el trabajo',
            completed: results.some(r => r.testType === 'dressCode'),
            inProgress: results.some(r => r.testType === 'cv') && !results.some(r => r.testType === 'dressCode')
        },
        {
            number: 6,
            title: 'Realiza el POST-TEST',
            description: 'Demuestra todo lo que has aprendido con la evaluación final',
            completed: results.some(r => r.type === 'POST' && r.score >= 70),
            inProgress: results.length >= 5 && !results.some(r => r.type === 'POST')
        }
    ];

    // Renderizar pasos
    const container = document.getElementById('learningPathSteps');
    container.innerHTML = steps.map(step => {
        let statusClass = 'locked';
        let statusText = '🔒 Bloqueado';

        if (step.completed) {
            statusClass = 'completed';
            statusText = '✅ Completado';
        } else if (step.inProgress) {
            statusClass = 'in-progress';
            statusText = '🔄 En Progreso';
        }

        return `
            <div class="path-step">
                <div class="path-step-number ${step.completed ? 'completed' : ''}">${step.number}</div>
                <div class="path-step-content">
                    <div class="path-step-title">${step.title}</div>
                    <div class="path-step-description">${step.description}</div>
                </div>
                <span class="path-step-status ${statusClass}">${statusText}</span>
            </div>
        `;
    }).join('');
}

// Función para agregar tip de mentor en pantallas específicas
function addMentorTipToScreen(screenId, tipTitle, tipText) {
    const screen = document.getElementById(screenId);
    if (!screen) return;

    // Buscar si ya existe un panel de mentor
    let mentorPanel = screen.querySelector('.mentor-tips-panel');
    if (mentorPanel) {
        mentorPanel.remove();
    }

    // Crear nuevo panel
    const panel = document.createElement('div');
    panel.className = 'mentor-tips-panel';
    panel.innerHTML = `
        <div class="mentor-tip">
            <div class="mentor-tip-icon">💡</div>
            <div class="mentor-tip-content">
                <div class="mentor-tip-title">${tipTitle}</div>
                <div class="mentor-tip-text">${tipText}</div>
            </div>
        </div>
    `;

    // Insertar después del navbar
    const navbar = screen.querySelector('.navbar');
    if (navbar && navbar.nextSibling) {
        navbar.parentNode.insertBefore(panel, navbar.nextSibling);
    }
}

// Agregar tips contextuales al cargar pantallas
function addContextualMentorTips() {
    // Tip para simulador de entrevistas
    addMentorTipToScreen(
        'interviewSimulatorScreen',
        'Consejo del Mentor para Entrevistas',
        'Tómate tu tiempo para pensar antes de responder. La calidad de tus respuestas es más importante que la velocidad. Demuestra seguridad y profesionalismo en cada respuesta.'
    );

    // Tip para constructor de CV
    addMentorTipToScreen(
        'cvBuilderScreen',
        'Consejo del Mentor para tu CV',
        'Un buen CV es claro, conciso y personalizado. Enfócate en logros medibles y usa verbos de acción. Recuerda que el reclutador dedicará solo 6 segundos a tu CV en la primera revisión.'
    );

    // Tip para detección de errores
    addMentorTipToScreen(
        'errorDetectionScreen',
        'Consejo del Mentor',
        'Revisa cuidadosamente cada sección. Los errores comunes incluyen: faltas ortográficas, formato inconsistente, información irrelevante y falta de datos de contacto.'
    );
}

// Llamar función cuando se inicializa el sistema
window.addEventListener('load', function() {
    setTimeout(addContextualMentorTips, 1000);
});

// Exportar funciones
window.showUserProfile = showUserProfile;
window.uploadProfilePhoto = uploadProfilePhoto;
window.changeUserPassword = changeUserPassword;
window.showUsersManagement = showUsersManagement;
window.filterUsers = filterUsers;
window.showUserDetail = showUserDetail;
window.closeUserDetailModal = closeUserDetailModal;
window.showUserDetailByEmail = showUserDetailByEmail;
window.switchUserDetailTab = switchUserDetailTab;
window.adminChangeUserPassword = adminChangeUserPassword;
window.toggleUserAdmin = toggleUserAdmin;
window.confirmDeleteUser = confirmDeleteUser;
window.createCharts = createCharts;
window.showMentorCoach = showMentorCoach;

// ========================================
// TUTORIAL / ONBOARDING PARA USUARIOS NUEVOS
// ========================================

// Mostrar tutorial al cargar la pantalla de bienvenida (solo la primera vez)
function checkAndShowTutorial() {
    const dontShow = localStorage.getItem('dontShowTutorial');
    const tutorialShown = sessionStorage.getItem('tutorialShownThisSession');
    
    // Solo mostrar si no está marcado "no mostrar" y no se ha mostrado en esta sesión
    if (!dontShow && !tutorialShown) {
        setTimeout(() => {
            showTutorial();
            sessionStorage.setItem('tutorialShownThisSession', 'true');
        }, 800);
    }
}

// Mostrar el modal de tutorial
function showTutorial() {
    const modal = document.getElementById('tutorialModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }
}

// Cerrar el modal de tutorial
function closeTutorial() {
    const modal = document.getElementById('tutorialModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaurar scroll del body
    }
}

// Guardar preferencia de no mostrar tutorial
function setDontShowTutorial(checked) {
    if (checked) {
        localStorage.setItem('dontShowTutorial', 'true');
    } else {
        localStorage.removeItem('dontShowTutorial');
    }
}

// Cerrar tutorial al hacer clic fuera del contenido
document.addEventListener('click', function(e) {
    const modal = document.getElementById('tutorialModal');
    if (modal && e.target === modal) {
        closeTutorial();
    }
});

// Cerrar tutorial con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeTutorial();
    }
});

// Hook en showScreen para mostrar tutorial cuando se muestra welcomeScreen
const originalShowScreen = window.showScreen;
if (typeof originalShowScreen === 'function') {
    window.showScreen = function(screenId) {
        originalShowScreen(screenId);
        
        // Si se está mostrando la pantalla de bienvenida, verificar si mostrar tutorial
        if (screenId === 'welcomeScreen') {
            checkAndShowTutorial();
        }
    };
}

// Exportar funciones para uso global
window.showTutorial = showTutorial;
window.closeTutorial = closeTutorial;
window.setDontShowTutorial = setDontShowTutorial;
window.checkAndShowTutorial = checkAndShowTutorial;

// Verificar al cargar la página
window.addEventListener('load', function() {
    // Verificar si estamos en la pantalla de bienvenida
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen && welcomeScreen.classList.contains('active')) {
        checkAndShowTutorial();
    }
});

console.log('✅ Sistema de tutorial inicializado correctamente');
