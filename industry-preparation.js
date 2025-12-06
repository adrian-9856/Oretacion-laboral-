// ========================================
// SISTEMA DE PREPARACIÓN POR INDUSTRIA
// ========================================

class IndustryPreparationSystem {
    constructor() {
        this.industries = this.initializeIndustries();
        this.selectedIndustry = null;
        this.init();
    }

    init() {
        // Cargar industria seleccionada del usuario
        const saved = localStorage.getItem('selected_industry');
        if (saved) {
            this.selectedIndustry = saved;
        }
    }

    // Definir industrias con sus características
    initializeIndustries() {
        return {
            technology: {
                id: 'technology',
                name: 'Tecnología e IT',
                emoji: '💻',
                color: '#3B82F6',
                description: 'Desarrollo de software, ingeniería, data science, cyberseguridad',
                skills: ['Programación', 'Resolución de problemas', 'Trabajo en equipo', 'Innovación', 'Aprendizaje continuo'],
                questions: [
                    '¿Cuántanos sobre un proyecto técnico desafiante que hayas completado?',
                    '¿Cómo te mantienes actualizado con las nuevas tecnologías?',
                    'Describe una situación donde tuviste que debuggear un problema complejo',
                    '¿Cómo manejas el código legacy?',
                    '¿Puedes explicar un concepto técnico complejo de manera simple?',
                    '¿Cómo priorizas tareas cuando tienes múltiples deadlines?',
                    'Describe tu experiencia trabajando en metodologías ágiles',
                    '¿Cómo manejas el feedback en code reviews?'
                ],
                tips: [
                    'Enfócate en tu experiencia técnica específica',
                    'Prepara ejemplos de proyectos del portafolio',
                    'Conoce el stack tecnológico de la empresa',
                    'Practica explicar conceptos técnicos claramente',
                    'Ten listos links a GitHub/proyectos'
                ],
                keywords: ['código', 'desarrollo', 'testing', 'debugging', 'algoritmo', 'framework', 'API', 'base de datos', 'cloud', 'devops', 'agile', 'scrum']
            },

            healthcare: {
                id: 'healthcare',
                name: 'Salud y Medicina',
                emoji: '🏥',
                color: '#10B981',
                description: 'Medicina, enfermería, farmacia, terapia, administración sanitaria',
                skills: ['Empatía', 'Comunicación', 'Atención al detalle', 'Trabajo bajo presión', 'Ética profesional'],
                questions: [
                    '¿Por qué elegiste la profesión de salud?',
                    '¿Cómo manejas situaciones de alta presión o emergencias?',
                    'Describe una situación donde tuviste que dar malas noticias a un paciente',
                    '¿Cómo mantienes la confidencialidad del paciente?',
                    '¿Qué haces cuando no estás de acuerdo con el tratamiento de un colega?',
                    '¿Cómo balanceas la empatía con la objetividad profesional?',
                    'Describe tu experiencia trabajando con pacientes difíciles',
                    '¿Cómo te mantienes actualizado en avances médicos?'
                ],
                tips: [
                    'Destaca tu empatía y habilidades interpersonales',
                    'Prepara ejemplos de situaciones con pacientes',
                    'Conoce las últimas regulaciones sanitarias',
                    'Enfatiza tu compromiso con la ética médica',
                    'Muestra tu capacidad para trabajar en equipo multidisciplinario'
                ],
                keywords: ['paciente', 'tratamiento', 'diagnóstico', 'cuidado', 'empatía', 'ética', 'protocolo', 'emergencia', 'prevención', 'salud', 'bienestar']
            },

            finance: {
                id: 'finance',
                name: 'Finanzas y Banca',
                emoji: '💰',
                color: '#F59E0B',
                description: 'Banca, inversiones, contabilidad, análisis financiero, seguros',
                skills: ['Análisis numérico', 'Atención al detalle', 'Integridad', 'Toma de decisiones', 'Gestión de riesgo'],
                questions: [
                    '¿Cómo analizas el riesgo en las decisiones financieras?',
                    'Describe una situación donde detectaste un error financiero crítico',
                    '¿Cómo manejas la presión de cumplir objetivos de ventas?',
                    '¿Qué opinas sobre las tendencias actuales en fintech?',
                    '¿Cómo explicarías un producto financiero complejo a un cliente?',
                    'Describe tu experiencia con análisis de datos financieros',
                    '¿Cómo mantienes la confidencialidad de información sensible?',
                    '¿Qué haces cuando un cliente quiere tomar una mala decisión financiera?'
                ],
                tips: [
                    'Demuestra tu conocimiento del mercado actual',
                    'Prepara ejemplos con números y métricas',
                    'Enfatiza tu integridad y ética',
                    'Conoce los productos de la institución',
                    'Muestra habilidades analíticas y de compliance'
                ],
                keywords: ['análisis', 'riesgo', 'inversión', 'ROI', 'portfolio', 'presupuesto', 'auditoría', 'compliance', 'mercado', 'activo', 'pasivo']
            },

            marketing: {
                id: 'marketing',
                name: 'Marketing y Publicidad',
                emoji: '📱',
                color: '#EC4899',
                description: 'Marketing digital, branding, publicidad, redes sociales, análisis de mercado',
                skills: ['Creatividad', 'Comunicación', 'Análisis de datos', 'Estrategia', 'Adaptabilidad'],
                questions: [
                    'Describe una campaña exitosa que hayas creado o gestionado',
                    '¿Cómo mides el éxito de una campaña de marketing?',
                    '¿Cómo te mantienes al día con las tendencias de marketing digital?',
                    'Describe una campaña que fracasó y qué aprendiste',
                    '¿Cómo identificas y llegas a tu público objetivo?',
                    '¿Qué herramientas de marketing digital dominas?',
                    '¿Cómo balanceas creatividad con resultados medibles?',
                    'Describe tu experiencia con marketing de contenidos'
                ],
                tips: [
                    'Prepara ejemplos de campañas con métricas',
                    'Conoce las plataformas de marketing actuales',
                    'Demuestra conocimiento de analytics',
                    'Muestra tu creatividad con casos reales',
                    'Enfatiza tu capacidad de adaptación a tendencias'
                ],
                keywords: ['campaña', 'brand', 'engagement', 'conversión', 'ROI', 'SEO', 'SEM', 'analytics', 'contenido', 'audiencia', 'KPI']
            },

            education: {
                id: 'education',
                name: 'Educación y Formación',
                emoji: '📚',
                color: '#8B5CF6',
                description: 'Docencia, capacitación, diseño instruccional, e-learning',
                skills: ['Comunicación', 'Paciencia', 'Adaptabilidad', 'Liderazgo', 'Empatía'],
                questions: [
                    '¿Cuál es tu filosofía de enseñanza?',
                    '¿Cómo adaptas tu enseñanza a diferentes estilos de aprendizaje?',
                    'Describe una situación donde un estudiante tenía dificultades',
                    '¿Cómo manejas la disciplina en el aula?',
                    '¿Cómo integras la tecnología en tu enseñanza?',
                    '¿Cómo evalúas el progreso de los estudiantes?',
                    'Describe una lección que no salió como planeaste',
                    '¿Cómo fomentas la participación de todos los estudiantes?'
                ],
                tips: [
                    'Prepara ejemplos de métodos de enseñanza innovadores',
                    'Demuestra conocimiento de teorías educativas',
                    'Enfatiza tu paciencia y adaptabilidad',
                    'Muestra experiencia con tecnología educativa',
                    'Destaca tu compromiso con el desarrollo estudiantil'
                ],
                keywords: ['aprendizaje', 'metodología', 'evaluación', 'pedagogía', 'curriculum', 'motivación', 'inclusión', 'feedback', 'desarrollo']
            },

            sales: {
                id: 'sales',
                name: 'Ventas y Comercial',
                emoji: '🤝',
                color: '#EF4444',
                description: 'Ventas B2B/B2C, desarrollo de negocio, gestión de cuentas',
                skills: ['Persuasión', 'Negociación', 'Resiliencia', 'Comunicación', 'Orientación a resultados'],
                questions: [
                    'Describe tu proceso de ventas de principio a fin',
                    '¿Cómo manejas el rechazo?',
                    '¿Cuál ha sido tu venta más desafiante?',
                    '¿Cómo identificas las necesidades del cliente?',
                    '¿Cómo superas objeciones de precio?',
                    'Describe una situación donde convertiste un "no" en un "sí"',
                    '¿Cómo mantienes relaciones a largo plazo con clientes?',
                    '¿Qué haces cuando no alcanzas tus metas de ventas?'
                ],
                tips: [
                    'Prepara números específicos de tus logros',
                    'Demuestra conocimiento del producto/servicio',
                    'Enfatiza tus habilidades de relación',
                    'Muestra resiliencia ante el rechazo',
                    'Destaca tu orientación a resultados'
                ],
                keywords: ['cierre', 'prospección', 'pipeline', 'quota', 'negociación', 'objeción', 'propuesta', 'cliente', 'conversión', 'CRM']
            },

            customer_service: {
                id: 'customer_service',
                name: 'Servicio al Cliente',
                emoji: '😊',
                color: '#06B6D4',
                description: 'Atención al cliente, soporte técnico, experiencia del usuario',
                skills: ['Empatía', 'Paciencia', 'Comunicación', 'Resolución de problemas', 'Multitasking'],
                questions: [
                    '¿Cómo manejas un cliente muy enojado?',
                    'Describe una situación donde fuiste más allá por un cliente',
                    '¿Cómo priorizas cuando múltiples clientes necesitan ayuda?',
                    '¿Qué haces cuando no sabes la respuesta a una pregunta del cliente?',
                    '¿Cómo mantienes la calma bajo presión?',
                    'Describe tu experiencia con software de CRM',
                    '¿Cómo manejas solicitudes imposibles de cumplir?',
                    '¿Cómo recolectas feedback del cliente?'
                ],
                tips: [
                    'Destaca tu empatía y paciencia',
                    'Prepara ejemplos de resolución de conflictos',
                    'Muestra tu capacidad para mantener la calma',
                    'Enfatiza tus habilidades de comunicación',
                    'Demuestra orientación al cliente'
                ],
                keywords: ['satisfacción', 'resolución', 'escalación', 'empatía', 'soporte', 'ticket', 'respuesta', 'feedback', 'experiencia']
            },

            engineering: {
                id: 'engineering',
                name: 'Ingeniería',
                emoji: '⚙️',
                color: '#64748B',
                description: 'Ingeniería civil, mecánica, eléctrica, industrial',
                skills: ['Pensamiento analítico', 'Resolución de problemas', 'Atención al detalle', 'Gestión de proyectos', 'Innovación'],
                questions: [
                    'Describe un proyecto de ingeniería complejo que hayas liderado',
                    '¿Cómo manejas restricciones de presupuesto en proyectos?',
                    '¿Cómo garantizas la seguridad en tus diseños?',
                    'Describe una solución innovadora que implementaste',
                    '¿Cómo colaboras con equipos multidisciplinarios?',
                    '¿Qué software/herramientas de ingeniería dominas?',
                    '¿Cómo manejas cambios de especificaciones a mitad de proyecto?',
                    'Describe un fallo de diseño y cómo lo corregiste'
                ],
                tips: [
                    'Prepara detalles técnicos de tus proyectos',
                    'Enfatiza tu atención a normativas y seguridad',
                    'Demuestra habilidades de gestión de proyectos',
                    'Muestra conocimiento de software especializado',
                    'Destaca tu capacidad de innovación'
                ],
                keywords: ['diseño', 'especificaciones', 'normativa', 'cálculo', 'proyecto', 'seguridad', 'eficiencia', 'optimización', 'prototipo']
            }
        };
    }

    // Seleccionar industria
    selectIndustry(industryId) {
        this.selectedIndustry = industryId;
        localStorage.setItem('selected_industry', industryId);

        // Mostrar toast
        const industry = this.industries[industryId];
        if (typeof showToast !== 'undefined') {
            showToast(`Industria seleccionada: ${industry.name}`, 'success');
        }
    }

    // Obtener industria actual
    getCurrentIndustry() {
        if (!this.selectedIndustry) return null;
        return this.industries[this.selectedIndustry];
    }

    // Obtener preguntas aleatorias para la industria
    getRandomQuestions(count = 5) {
        const industry = this.getCurrentIndustry();
        if (!industry) return [];

        const shuffled = [...industry.questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Mostrar selector de industria
    showIndustrySelector() {
        const overlay = document.createElement('div');
        overlay.className = 'industry-selector-overlay';
        overlay.innerHTML = `
            <div class="industry-selector-modal">
                <div class="industry-selector-header">
                    <h2>🎯 Selecciona tu Industria Objetivo</h2>
                    <p>Personaliza tu preparación según tu campo profesional</p>
                    <button onclick="this.closest('.industry-selector-overlay').remove()" class="close-btn">✕</button>
                </div>
                <div class="industry-selector-content">
                    ${this.getIndustriesHTML()}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    // Obtener HTML de industrias
    getIndustriesHTML() {
        let html = '<div class="industries-grid">';

        for (const [id, industry] of Object.entries(this.industries)) {
            const isSelected = this.selectedIndustry === id;
            html += `
                <div class="industry-card ${isSelected ? 'selected' : ''}"
                     onclick="industryPrep.selectIndustry('${id}'); this.closest('.industry-selector-overlay').remove();"
                     style="border-color: ${industry.color}">
                    <div class="industry-emoji">${industry.emoji}</div>
                    <h3 class="industry-name">${industry.name}</h3>
                    <p class="industry-description">${industry.description}</p>
                    <div class="industry-skills">
                        ${industry.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                    ${isSelected ? '<div class="selected-badge">✓ Seleccionada</div>' : ''}
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    // Mostrar guía de la industria
    showIndustryGuide() {
        const industry = this.getCurrentIndustry();
        if (!industry) {
            this.showIndustrySelector();
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'industry-guide-overlay';
        overlay.innerHTML = `
            <div class="industry-guide-modal">
                <div class="industry-guide-header" style="background: linear-gradient(135deg, ${industry.color} 0%, ${this.adjustColor(industry.color, -20)} 100%)">
                    <div class="industry-icon-large">${industry.emoji}</div>
                    <h2>${industry.name}</h2>
                    <p>${industry.description}</p>
                    <button onclick="this.closest('.industry-guide-overlay').remove()" class="close-btn">✕</button>
                </div>

                <div class="industry-guide-content">
                    <!-- Habilidades Clave -->
                    <section class="guide-section">
                        <h3>💪 Habilidades Clave</h3>
                        <div class="skills-list">
                            ${industry.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
                        </div>
                    </section>

                    <!-- Preguntas Frecuentes -->
                    <section class="guide-section">
                        <h3>❓ Preguntas Frecuentes en Entrevistas</h3>
                        <div class="questions-list">
                            ${industry.questions.map((q, i) => `<div class="question-item">${i + 1}. ${q}</div>`).join('')}
                        </div>
                    </section>

                    <!-- Tips -->
                    <section class="guide-section">
                        <h3>💡 Tips para Entrevistas</h3>
                        <div class="tips-list">
                            ${industry.tips.map(tip => `<div class="tip-item">✓ ${tip}</div>`).join('')}
                        </div>
                    </section>

                    <!-- Palabras Clave -->
                    <section class="guide-section">
                        <h3>🔑 Palabras Clave para tu CV</h3>
                        <div class="keywords-cloud">
                            ${industry.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                        </div>
                    </section>

                    <!-- Acciones -->
                    <div class="guide-actions">
                        <button onclick="industryPrep.startIndustryPractice()" class="btn-primary">
                            🎯 Practicar Entrevista
                        </button>
                        <button onclick="industryPrep.showIndustrySelector()" class="btn-secondary">
                            🔄 Cambiar Industria
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    // Iniciar práctica de entrevista para la industria
    startIndustryPractice() {
        // Cerrar overlay
        const overlay = document.querySelector('.industry-guide-overlay');
        if (overlay) overlay.remove();

        // Obtener preguntas
        const questions = this.getRandomQuestions(5);

        if (typeof showToast !== 'undefined') {
            showToast(`Iniciando práctica de entrevista para ${this.getCurrentIndustry().name}`, 'success');
        }

        // Aquí se integraría con el simulador de entrevistas existente
        // Por ahora mostraremos las preguntas
        this.showPracticeQuestions(questions);
    }

    // Mostrar preguntas de práctica
    showPracticeQuestions(questions) {
        const overlay = document.createElement('div');
        overlay.className = 'practice-questions-overlay';

        const industry = this.getCurrentIndustry();

        overlay.innerHTML = `
            <div class="practice-questions-modal">
                <div class="practice-header" style="background: ${industry.color}">
                    <h2>${industry.emoji} Práctica: ${industry.name}</h2>
                    <button onclick="this.closest('.practice-questions-overlay').remove()" class="close-btn">✕</button>
                </div>

                <div class="practice-content">
                    <p class="practice-intro">
                        Estas son preguntas típicas para entrevistas en ${industry.name}.
                        Practica tus respuestas y cuando estés listo, graba tu respuesta en el simulador.
                    </p>

                    <div class="practice-questions-list">
                        ${questions.map((q, i) => `
                            <div class="practice-question-card">
                                <div class="question-number">Pregunta ${i + 1}</div>
                                <div class="question-text">${q}</div>
                                <button class="btn-practice" onclick="industryPrep.practiceQuestion('${q.replace(/'/g, "\\'")}')">
                                    🎤 Practicar Respuesta
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <div class="practice-footer">
                        <button onclick="this.closest('.practice-questions-overlay').remove()" class="btn-secondary">
                            Cerrar
                        </button>
                        <button onclick="industryPrep.showIndustryGuide()" class="btn-primary">
                            Ver Guía Completa
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    // Practicar pregunta específica
    practiceQuestion(question) {
        // Cerrar overlay
        const overlay = document.querySelector('.practice-questions-overlay');
        if (overlay) overlay.remove();

        // Integración con el simulador de entrevistas
        if (typeof showScreen !== 'undefined') {
            showScreen('interviewSimulatorScreen');

            // Establecer la pregunta
            const questionDisplay = document.getElementById('currentQuestion');
            if (questionDisplay) {
                questionDisplay.textContent = question;
            }

            if (typeof showToast !== 'undefined') {
                showToast('Usa el modo de grabación para practicar tu respuesta', 'info');
            }
        }
    }

    // Ajustar color (helper)
    adjustColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
            (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
            .toString(16).slice(1);
    }

    // Obtener badge de industria para mostrar en UI
    getIndustryBadge() {
        const industry = this.getCurrentIndustry();
        if (!industry) return null;

        return `
            <div class="industry-badge" style="background: ${industry.color}"
                 onclick="industryPrep.showIndustryGuide()"
                 title="Haz clic para ver la guía completa">
                <span>${industry.emoji}</span>
                <span>${industry.name}</span>
            </div>
        `;
    }
}

// CSS para el sistema de industrias
const industryStyles = `
<style>
/* Industry Selector Overlay */
.industry-selector-overlay,
.industry-guide-overlay,
.practice-questions-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 20000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
    padding: 20px;
    overflow-y: auto;
}

.industry-selector-modal,
.industry-guide-modal,
.practice-questions-modal {
    background: white;
    border-radius: 20px;
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.4s ease;
}

.industry-selector-header,
.industry-guide-header,
.practice-header {
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    position: relative;
}

.industry-selector-header h2,
.industry-guide-header h2,
.practice-header h2 {
    margin: 0 0 10px;
    font-size: 28px;
}

.industry-selector-header p {
    margin: 0;
    opacity: 0.9;
}

.industry-icon-large {
    font-size: 64px;
    margin-bottom: 15px;
}

.industry-guide-header p {
    opacity: 0.95;
    margin: 10px 0 0;
}

.industry-selector-content,
.industry-guide-content,
.practice-content {
    padding: 30px;
    overflow-y: auto;
    flex: 1;
}

/* Industries Grid */
.industries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.industry-card {
    padding: 25px;
    border: 3px solid #e5e7eb;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    background: white;
}

.industry-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.industry-card.selected {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
    border-width: 3px;
}

.industry-emoji {
    font-size: 48px;
    margin-bottom: 15px;
}

.industry-name {
    margin: 0 0 10px;
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
}

.industry-description {
    font-size: 13px;
    color: #64748b;
    margin: 0 0 15px;
    line-height: 1.5;
}

.industry-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.skill-tag {
    padding: 4px 10px;
    background: #f1f5f9;
    border-radius: 12px;
    font-size: 11px;
    color: #475569;
    font-weight: 500;
}

.selected-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #10b981;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
}

/* Industry Guide */
.guide-section {
    margin-bottom: 30px;
}

.guide-section h3 {
    margin: 0 0 15px;
    font-size: 20px;
    color: #1e293b;
}

.skills-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
}

.skill-item {
    padding: 12px 15px;
    background: #f8fafc;
    border-left: 4px solid #667eea;
    border-radius: 8px;
    font-weight: 500;
    color: #334155;
}

.questions-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.question-item {
    padding: 15px;
    background: #f8fafc;
    border-radius: 10px;
    color: #475569;
    line-height: 1.6;
}

.tips-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tip-item {
    padding: 12px 15px;
    background: #ecfdf5;
    border-left: 4px solid #10b981;
    border-radius: 8px;
    color: #064e3b;
}

.keywords-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.keyword-tag {
    padding: 8px 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
}

.guide-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.guide-actions button {
    flex: 1;
}

/* Practice Questions */
.practice-intro {
    padding: 20px;
    background: #fef3c7;
    border-left: 4px solid #f59e0b;
    border-radius: 10px;
    margin-bottom: 25px;
    color: #78350f;
    line-height: 1.6;
}

.practice-questions-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 25px;
}

.practice-question-card {
    padding: 20px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: white;
}

.question-number {
    font-size: 12px;
    font-weight: 700;
    color: #667eea;
    text-transform: uppercase;
    margin-bottom: 10px;
}

.question-text {
    font-size: 16px;
    color: #1e293b;
    margin-bottom: 15px;
    line-height: 1.6;
}

.btn-practice {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-practice:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.practice-footer {
    display: flex;
    gap: 15px;
    padding-top: 20px;
    border-top: 2px solid #e5e7eb;
}

.practice-footer button {
    flex: 1;
}

/* Industry Badge (para mostrar en UI) */
.industry-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 15px;
    border-radius: 20px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.industry-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Dark theme */
body.dark-theme .industry-selector-modal,
body.dark-theme .industry-guide-modal,
body.dark-theme .practice-questions-modal {
    background: #1e293b;
}

body.dark-theme .industry-card {
    background: #0f172a;
    border-color: rgba(99, 102, 241, 0.3);
}

body.dark-theme .industry-name,
body.dark-theme .guide-section h3,
body.dark-theme .question-text {
    color: var(--gray-100);
}

body.dark-theme .industry-description,
body.dark-theme .question-item {
    color: var(--gray-300);
}

body.dark-theme .skill-item,
body.dark-theme .question-item,
body.dark-theme .practice-question-card {
    background: rgba(30, 35, 48, 0.6);
    border-color: rgba(99, 102, 241, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
    .industries-grid {
        grid-template-columns: 1fr;
    }

    .industry-selector-header h2,
    .industry-guide-header h2 {
        font-size: 22px;
    }

    .skills-list {
        grid-template-columns: 1fr;
    }

    .guide-actions,
    .practice-footer {
        flex-direction: column;
    }
}

/* Animations */
@keyframes slideUp {
    from {
        transform: translateY(50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', industryStyles);

// Inicializar sistema global
let industryPrep;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        industryPrep = new IndustryPreparationSystem();
    });
} else {
    industryPrep = new IndustryPreparationSystem();
}
