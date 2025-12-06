// ========================================
// SISTEMA DE GAMIFICACIÓN COMPLETO
// ========================================

class GamificationSystem {
    constructor() {
        this.userStats = this.loadUserStats();
        this.badges = this.initializeBadges();
        this.levels = this.initializeLevels();
        this.init();
    }

    // Inicializar sistema
    init() {
        this.updateUI();
        this.checkDailyStreak();
    }

    // Cargar estadísticas del usuario
    loadUserStats() {
        const defaultStats = {
            xp: 0,
            level: 1,
            badges: [],
            streak: 0,
            lastVisit: new Date().toDateString(),
            achievements: {
                testsCompleted: 0,
                perfectScores: 0,
                interviewsPracticed: 0,
                cvCreated: 0,
                totalScore: 0,
                daysActive: 1
            },
            history: []
        };

        const saved = localStorage.getItem('gamification_stats');
        return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    }

    // Guardar estadísticas
    saveUserStats() {
        localStorage.setItem('gamification_stats', JSON.stringify(this.userStats));
    }

    // Definir badges/medallas
    initializeBadges() {
        return {
            // Badges de inicio
            first_login: {
                id: 'first_login',
                name: 'Primer Paso',
                description: 'Iniciaste tu viaje de aprendizaje',
                emoji: '👣',
                xp: 10,
                condition: () => true
            },
            avatar_creator: {
                id: 'avatar_creator',
                name: 'Creador de Identidad',
                description: 'Creaste tu avatar personalizado',
                emoji: '🎨',
                xp: 20
            },

            // Badges de tests
            first_test: {
                id: 'first_test',
                name: 'Primer Examen',
                description: 'Completaste tu primera evaluación',
                emoji: '📝',
                xp: 50
            },
            test_master_5: {
                id: 'test_master_5',
                name: 'Evaluador Dedicado',
                description: 'Completaste 5 evaluaciones',
                emoji: '📚',
                xp: 100,
                condition: (stats) => stats.achievements.testsCompleted >= 5
            },
            test_master_10: {
                id: 'test_master_10',
                name: 'Maestro Evaluador',
                description: 'Completaste 10 evaluaciones',
                emoji: '🎓',
                xp: 200,
                condition: (stats) => stats.achievements.testsCompleted >= 10
            },
            test_master_25: {
                id: 'test_master_25',
                name: 'Evaluador Legendario',
                description: 'Completaste 25 evaluaciones',
                emoji: '👑',
                xp: 500,
                condition: (stats) => stats.achievements.testsCompleted >= 25
            },

            // Badges de puntuación perfecta
            perfectionist: {
                id: 'perfectionist',
                name: 'Perfeccionista',
                description: 'Obtuviste una puntuación perfecta',
                emoji: '💯',
                xp: 100
            },
            perfect_streak_3: {
                id: 'perfect_streak_3',
                name: 'Racha Perfecta',
                description: '3 puntuaciones perfectas consecutivas',
                emoji: '⭐',
                xp: 250,
                condition: (stats) => stats.achievements.perfectScores >= 3
            },
            perfect_legend: {
                id: 'perfect_legend',
                name: 'Leyenda Perfecta',
                description: '10 puntuaciones perfectas',
                emoji: '🌟',
                xp: 750,
                condition: (stats) => stats.achievements.perfectScores >= 10
            },

            // Badges de entrevistas
            interview_ready: {
                id: 'interview_ready',
                name: 'Listo para Entrevistas',
                description: 'Practicaste tu primera entrevista',
                emoji: '🎤',
                xp: 75
            },
            interview_pro_5: {
                id: 'interview_pro_5',
                name: 'Entrevistador Profesional',
                description: 'Completaste 5 simulacros de entrevista',
                emoji: '🎯',
                xp: 150,
                condition: (stats) => stats.achievements.interviewsPracticed >= 5
            },
            interview_master: {
                id: 'interview_master',
                name: 'Maestro de Entrevistas',
                description: 'Completaste 15 simulacros de entrevista',
                emoji: '🏆',
                xp: 400,
                condition: (stats) => stats.achievements.interviewsPracticed >= 15
            },

            // Badges de CV
            cv_builder: {
                id: 'cv_builder',
                name: 'Constructor de CV',
                description: 'Creaste tu primer currículum',
                emoji: '📄',
                xp: 50
            },
            cv_expert: {
                id: 'cv_expert',
                name: 'Experto en CVs',
                description: 'Optimizaste tu CV al máximo',
                emoji: '📋',
                xp: 150
            },

            // Badges de racha
            streak_3: {
                id: 'streak_3',
                name: 'Racha Inicial',
                description: '3 días consecutivos de práctica',
                emoji: '🔥',
                xp: 100,
                condition: (stats) => stats.streak >= 3
            },
            streak_7: {
                id: 'streak_7',
                name: 'Semana Dedicada',
                description: '7 días consecutivos de práctica',
                emoji: '🔥🔥',
                xp: 250,
                condition: (stats) => stats.streak >= 7
            },
            streak_30: {
                id: 'streak_30',
                name: 'Compromiso Total',
                description: '30 días consecutivos de práctica',
                emoji: '🔥🔥🔥',
                xp: 1000,
                condition: (stats) => stats.streak >= 30
            },

            // Badges especiales
            speed_demon: {
                id: 'speed_demon',
                name: 'Rayo Veloz',
                description: 'Completaste un test en tiempo récord',
                emoji: '⚡',
                xp: 150
            },
            night_owl: {
                id: 'night_owl',
                name: 'Búho Nocturno',
                description: 'Estudiaste después de medianoche',
                emoji: '🦉',
                xp: 50
            },
            early_bird: {
                id: 'early_bird',
                name: 'Madrugador',
                description: 'Estudiaste antes de las 6 AM',
                emoji: '🌅',
                xp: 50
            },
            weekend_warrior: {
                id: 'weekend_warrior',
                name: 'Guerrero de Fin de Semana',
                description: 'Estudiaste un fin de semana',
                emoji: '💪',
                xp: 75
            },

            // Badges de puntuación total
            scorer_1000: {
                id: 'scorer_1000',
                name: 'Acumulador',
                description: 'Alcanzaste 1000 puntos totales',
                emoji: '📈',
                xp: 200,
                condition: (stats) => stats.achievements.totalScore >= 1000
            },
            scorer_5000: {
                id: 'scorer_5000',
                name: 'Súper Acumulador',
                description: 'Alcanzaste 5000 puntos totales',
                emoji: '📊',
                xp: 500,
                condition: (stats) => stats.achievements.totalScore >= 5000
            }
        };
    }

    // Definir niveles
    initializeLevels() {
        return [
            { level: 1, name: 'Principiante', xpRequired: 0, emoji: '🌱', color: '#10b981' },
            { level: 2, name: 'Aprendiz', xpRequired: 100, emoji: '🌿', color: '#10b981' },
            { level: 3, name: 'Estudiante', xpRequired: 250, emoji: '📚', color: '#3b82f6' },
            { level: 4, name: 'Practicante', xpRequired: 500, emoji: '💼', color: '#3b82f6' },
            { level: 5, name: 'Competente', xpRequired: 1000, emoji: '🎯', color: '#8b5cf6' },
            { level: 6, name: 'Hábil', xpRequired: 1750, emoji: '⭐', color: '#8b5cf6' },
            { level: 7, name: 'Experto', xpRequired: 2750, emoji: '💎', color: '#ec4899' },
            { level: 8, name: 'Maestro', xpRequired: 4000, emoji: '🏆', color: '#ec4899' },
            { level: 9, name: 'Profesional', xpRequired: 6000, emoji: '👑', color: '#f59e0b' },
            { level: 10, name: 'Elite', xpRequired: 8500, emoji: '🌟', color: '#f59e0b' },
            { level: 11, name: 'Legendario', xpRequired: 12000, emoji: '⚡', color: '#ef4444' },
            { level: 12, name: 'Dios del Empleo', xpRequired: 16000, emoji: '🔥', color: '#ef4444' }
        ];
    }

    // Otorgar XP
    grantXP(amount, reason = 'Acción completada') {
        const oldLevel = this.userStats.level;
        this.userStats.xp += amount;

        // Actualizar nivel
        this.updateLevel();

        // Guardar
        this.saveUserStats();

        // Mostrar notificación
        this.showXPNotification(amount, reason);

        // Verificar si subió de nivel
        if (this.userStats.level > oldLevel) {
            this.showLevelUpAnimation(this.userStats.level);
        }

        // Actualizar UI
        this.updateUI();
    }

    // Actualizar nivel según XP
    updateLevel() {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (this.userStats.xp >= this.levels[i].xpRequired) {
                this.userStats.level = this.levels[i].level;
                break;
            }
        }
    }

    // Obtener información del nivel actual
    getCurrentLevelInfo() {
        const currentLevelData = this.levels.find(l => l.level === this.userStats.level);
        const nextLevelData = this.levels.find(l => l.level === this.userStats.level + 1);

        return {
            current: currentLevelData,
            next: nextLevelData,
            progress: nextLevelData ?
                ((this.userStats.xp - currentLevelData.xpRequired) / (nextLevelData.xpRequired - currentLevelData.xpRequired)) * 100 : 100
        };
    }

    // Desbloquear badge
    unlockBadge(badgeId) {
        if (this.userStats.badges.includes(badgeId)) {
            return false; // Ya desbloqueado
        }

        const badge = this.badges[badgeId];
        if (!badge) return false;

        // Verificar condición si existe
        if (badge.condition && !badge.condition(this.userStats)) {
            return false;
        }

        this.userStats.badges.push(badgeId);
        this.grantXP(badge.xp, `Badge desbloqueado: ${badge.name}`);
        this.showBadgeUnlocked(badge);
        this.saveUserStats();

        return true;
    }

    // Verificar racha diaria
    checkDailyStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (this.userStats.lastVisit === today) {
            // Ya visitó hoy
            return;
        } else if (this.userStats.lastVisit === yesterday) {
            // Continúa la racha
            this.userStats.streak++;
            this.grantXP(20, `¡Racha de ${this.userStats.streak} días!`);

            // Verificar badges de racha
            if (this.userStats.streak === 3) this.unlockBadge('streak_3');
            if (this.userStats.streak === 7) this.unlockBadge('streak_7');
            if (this.userStats.streak === 30) this.unlockBadge('streak_30');
        } else {
            // Se rompió la racha
            if (this.userStats.streak > 0) {
                this.showStreakLost(this.userStats.streak);
            }
            this.userStats.streak = 1;
        }

        this.userStats.lastVisit = today;
        this.userStats.achievements.daysActive++;
        this.saveUserStats();

        // Badges de horario
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 6) this.unlockBadge('night_owl');
        if (hour >= 5 && hour < 7) this.unlockBadge('early_bird');

        const day = new Date().getDay();
        if (day === 0 || day === 6) this.unlockBadge('weekend_warrior');
    }

    // Registrar test completado
    onTestCompleted(score, maxScore, testType, timeTaken) {
        this.userStats.achievements.testsCompleted++;
        this.userStats.achievements.totalScore += score;

        // XP base por completar
        let xpGained = 50;

        // Bonus por puntuación
        const percentage = (score / maxScore) * 100;
        if (percentage === 100) {
            xpGained += 100;
            this.userStats.achievements.perfectScores++;
            this.unlockBadge('perfectionist');
        } else if (percentage >= 90) {
            xpGained += 75;
        } else if (percentage >= 80) {
            xpGained += 50;
        } else if (percentage >= 70) {
            xpGained += 25;
        }

        // Bonus por velocidad (si completó en menos de 5 minutos)
        if (timeTaken && timeTaken < 300) {
            xpGained += 50;
            this.unlockBadge('speed_demon');
        }

        this.grantXP(xpGained, `Test completado: ${percentage.toFixed(0)}%`);

        // Verificar badges
        if (this.userStats.achievements.testsCompleted === 1) this.unlockBadge('first_test');
        if (this.userStats.achievements.testsCompleted >= 5) this.unlockBadge('test_master_5');
        if (this.userStats.achievements.testsCompleted >= 10) this.unlockBadge('test_master_10');
        if (this.userStats.achievements.testsCompleted >= 25) this.unlockBadge('test_master_25');
        if (this.userStats.achievements.perfectScores >= 3) this.unlockBadge('perfect_streak_3');
        if (this.userStats.achievements.perfectScores >= 10) this.unlockBadge('perfect_legend');
        if (this.userStats.achievements.totalScore >= 1000) this.unlockBadge('scorer_1000');
        if (this.userStats.achievements.totalScore >= 5000) this.unlockBadge('scorer_5000');

        // Guardar en historial
        this.userStats.history.push({
            type: 'test',
            testType,
            score,
            maxScore,
            percentage,
            xpGained,
            timestamp: Date.now()
        });

        this.saveUserStats();
    }

    // Registrar entrevista practicada
    onInterviewPracticed(score) {
        this.userStats.achievements.interviewsPracticed++;

        let xpGained = 75;
        if (score >= 90) xpGained += 50;
        else if (score >= 80) xpGained += 25;

        this.grantXP(xpGained, `Entrevista practicada: ${score}pts`);

        // Badges
        if (this.userStats.achievements.interviewsPracticed === 1) this.unlockBadge('interview_ready');
        if (this.userStats.achievements.interviewsPracticed >= 5) this.unlockBadge('interview_pro_5');
        if (this.userStats.achievements.interviewsPracticed >= 15) this.unlockBadge('interview_master');

        this.saveUserStats();
    }

    // Registrar CV creado
    onCVCreated(quality) {
        this.userStats.achievements.cvCreated++;

        let xpGained = 50;
        if (quality === 'excellent') xpGained = 150;
        else if (quality === 'good') xpGained = 100;

        this.grantXP(xpGained, 'CV creado');

        // Badges
        if (this.userStats.achievements.cvCreated === 1) this.unlockBadge('cv_builder');
        if (quality === 'excellent') this.unlockBadge('cv_expert');

        this.saveUserStats();
    }

    // Mostrar notificación de XP
    showXPNotification(amount, reason) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.innerHTML = `
            <div class="xp-content">
                <div class="xp-icon">⭐</div>
                <div class="xp-text">
                    <div class="xp-amount">+${amount} XP</div>
                    <div class="xp-reason">${reason}</div>
                </div>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 2.5s;
            font-family: 'Segoe UI', sans-serif;
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    // Mostrar animación de subida de nivel
    showLevelUpAnimation(newLevel) {
        const levelData = this.levels.find(l => l.level === newLevel);

        const overlay = document.createElement('div');
        overlay.className = 'level-up-overlay';
        overlay.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-emoji">${levelData.emoji}</div>
                <h1 class="level-up-title">¡NIVEL ${newLevel}!</h1>
                <p class="level-up-name">${levelData.name}</p>
                <p class="level-up-message">¡Sigue así! 🎉</p>
                <button onclick="this.closest('.level-up-overlay').remove()" class="level-up-btn">
                    ¡Continuar!
                </button>
            </div>
        `;

        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            backdrop-filter: blur(10px);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.5s ease;
        `;

        document.body.appendChild(overlay);

        // Confetti
        this.createConfetti();

        // Sonido (opcional)
        this.playLevelUpSound();
    }

    // Mostrar badge desbloqueado
    showBadgeUnlocked(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-unlocked';
        notification.innerHTML = `
            <div class="badge-content">
                <div class="badge-glow"></div>
                <div class="badge-emoji">${badge.emoji}</div>
                <h3 class="badge-title">¡Badge Desbloqueado!</h3>
                <p class="badge-name">${badge.name}</p>
                <p class="badge-desc">${badge.description}</p>
                <p class="badge-xp">+${badge.xp} XP</p>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            z-index: 15000;
            text-align: center;
            animation: badgePop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'badgePopOut 0.4s ease forwards';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // Mostrar pérdida de racha
    showStreakLost(streakDays) {
        const notification = document.createElement('div');
        notification.className = 'streak-lost';
        notification.innerHTML = `
            <div class="streak-content">
                <div class="streak-icon">💔</div>
                <h3>Racha Perdida</h3>
                <p>Tu racha de ${streakDays} días se ha perdido</p>
                <p style="margin-top: 10px; opacity: 0.8;">¡Empieza una nueva racha hoy!</p>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 4.5s;
            text-align: center;
            max-width: 280px;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Crear confetti
    createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const confettiCount = 100;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    opacity: ${Math.random() * 0.8 + 0.2};
                    z-index: 25000;
                    animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }, i * 10);
        }
    }

    // Sonido de subida de nivel (Web Audio API)
    playLevelUpSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    // Actualizar UI
    updateUI() {
        this.updateProfileBadge();
        this.updateStatsPanel();
    }

    // Actualizar badge de perfil en navbar
    updateProfileBadge() {
        const levelInfo = this.getCurrentLevelInfo();
        const profileBadge = document.querySelector('.user-level-badge');

        if (profileBadge) {
            profileBadge.innerHTML = `
                <span class="level-emoji">${levelInfo.current.emoji}</span>
                <span class="level-number">Nv.${this.userStats.level}</span>
            `;
            profileBadge.style.background = levelInfo.current.color;
        }
    }

    // Actualizar panel de estadísticas
    updateStatsPanel() {
        const statsPanel = document.getElementById('gamification-stats');
        if (!statsPanel) return;

        const levelInfo = this.getCurrentLevelInfo();

        statsPanel.innerHTML = `
            <div class="stats-header">
                <h3>Tu Progreso</h3>
            </div>

            <div class="level-display">
                <div class="level-icon" style="background: ${levelInfo.current.color}">
                    ${levelInfo.current.emoji}
                </div>
                <div class="level-info">
                    <h2>Nivel ${this.userStats.level}</h2>
                    <p>${levelInfo.current.name}</p>
                </div>
            </div>

            <div class="xp-progress">
                <div class="xp-bar-container">
                    <div class="xp-bar" style="width: ${levelInfo.progress}%; background: ${levelInfo.current.color}"></div>
                </div>
                <div class="xp-text">
                    ${this.userStats.xp} / ${levelInfo.next ? levelInfo.next.xpRequired : 'MAX'} XP
                </div>
            </div>

            <div class="streak-display">
                <div class="streak-icon">🔥</div>
                <div class="streak-info">
                    <h3>${this.userStats.streak} días</h3>
                    <p>Racha actual</p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-icon">📝</div>
                    <div class="stat-value">${this.userStats.achievements.testsCompleted}</div>
                    <div class="stat-label">Tests</div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon">💯</div>
                    <div class="stat-value">${this.userStats.achievements.perfectScores}</div>
                    <div class="stat-label">Perfectos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon">🎤</div>
                    <div class="stat-value">${this.userStats.achievements.interviewsPracticed}</div>
                    <div class="stat-label">Entrevistas</div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon">🏅</div>
                    <div class="stat-value">${this.userStats.badges.length}</div>
                    <div class="stat-label">Badges</div>
                </div>
            </div>

            <div class="badges-preview">
                <h4>Badges Recientes</h4>
                <div class="badges-grid">
                    ${this.getRecentBadgesHTML()}
                </div>
                <button onclick="gamification.showAllBadges()" class="view-all-btn">
                    Ver Todos los Badges
                </button>
            </div>
        `;
    }

    // Obtener HTML de badges recientes
    getRecentBadgesHTML() {
        const recentBadges = this.userStats.badges.slice(-6).reverse();
        if (recentBadges.length === 0) {
            return '<p style="text-align: center; opacity: 0.6;">Completa actividades para desbloquear badges</p>';
        }

        return recentBadges.map(badgeId => {
            const badge = this.badges[badgeId];
            return `
                <div class="badge-item" title="${badge.description}">
                    <div class="badge-emoji-small">${badge.emoji}</div>
                    <div class="badge-name-small">${badge.name}</div>
                </div>
            `;
        }).join('');
    }

    // Mostrar todos los badges
    showAllBadges() {
        const overlay = document.createElement('div');
        overlay.className = 'badges-overlay';
        overlay.innerHTML = `
            <div class="badges-modal">
                <div class="badges-header">
                    <h2>🏅 Colección de Badges</h2>
                    <button onclick="this.closest('.badges-overlay').remove()" class="close-btn">✕</button>
                </div>
                <div class="badges-content">
                    ${this.getAllBadgesHTML()}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    // Obtener HTML de todos los badges
    getAllBadgesHTML() {
        const categories = {
            '🚀 Inicio': ['first_login', 'avatar_creator'],
            '📚 Tests': ['first_test', 'test_master_5', 'test_master_10', 'test_master_25'],
            '💯 Perfección': ['perfectionist', 'perfect_streak_3', 'perfect_legend'],
            '🎤 Entrevistas': ['interview_ready', 'interview_pro_5', 'interview_master'],
            '📄 CV': ['cv_builder', 'cv_expert'],
            '🔥 Rachas': ['streak_3', 'streak_7', 'streak_30'],
            '⭐ Especiales': ['speed_demon', 'night_owl', 'early_bird', 'weekend_warrior'],
            '📈 Puntuación': ['scorer_1000', 'scorer_5000']
        };

        let html = '';
        for (const [category, badgeIds] of Object.entries(categories)) {
            html += `<div class="badge-category">
                <h3>${category}</h3>
                <div class="badges-grid-full">`;

            badgeIds.forEach(badgeId => {
                const badge = this.badges[badgeId];
                const unlocked = this.userStats.badges.includes(badgeId);
                html += `
                    <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
                        <div class="badge-emoji-large">${unlocked ? badge.emoji : '🔒'}</div>
                        <h4>${badge.name}</h4>
                        <p>${badge.description}</p>
                        <div class="badge-xp">+${badge.xp} XP</div>
                    </div>
                `;
            });

            html += `</div></div>`;
        }

        return html;
    }

    // Obtener leaderboard
    getLeaderboard() {
        // En producción, esto vendría de Firebase
        // Por ahora simulamos con datos locales
        const allUsers = [
            { name: currentUser?.name || 'Tú', xp: this.userStats.xp, level: this.userStats.level, avatar: '👤' }
        ];

        // Ordenar por XP
        allUsers.sort((a, b) => b.xp - a.xp);

        return allUsers;
    }

    // Mostrar leaderboard
    showLeaderboard() {
        const leaderboard = this.getLeaderboard();

        const overlay = document.createElement('div');
        overlay.className = 'leaderboard-overlay';
        overlay.innerHTML = `
            <div class="leaderboard-modal">
                <div class="leaderboard-header">
                    <h2>🏆 Clasificación Global</h2>
                    <button onclick="this.closest('.leaderboard-overlay').remove()" class="close-btn">✕</button>
                </div>
                <div class="leaderboard-content">
                    ${this.getLeaderboardHTML(leaderboard)}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    // Obtener HTML del leaderboard
    getLeaderboardHTML(leaderboard) {
        return leaderboard.map((user, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
            const levelInfo = this.levels.find(l => l.level === user.level);

            return `
                <div class="leaderboard-item ${user.name === (currentUser?.name || 'Tú') ? 'current-user' : ''}">
                    <div class="rank">${medal}</div>
                    <div class="user-avatar">${user.avatar}</div>
                    <div class="user-info">
                        <h4>${user.name}</h4>
                        <p>Nivel ${user.level} - ${levelInfo.name}</p>
                    </div>
                    <div class="user-xp">${user.xp} XP</div>
                </div>
            `;
        }).join('');
    }
}

// CSS para gamificación
const gamificationStyles = `
<style>
/* Notificación XP */
.xp-notification {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.xp-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.xp-icon {
    font-size: 32px;
    animation: pulse 0.5s ease;
}

.xp-amount {
    font-size: 18px;
    font-weight: bold;
}

.xp-reason {
    font-size: 12px;
    opacity: 0.9;
}

/* Subida de nivel */
.level-up-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 50px;
    border-radius: 30px;
    text-align: center;
    animation: scaleUp 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.level-up-emoji {
    font-size: 120px;
    margin-bottom: 20px;
    animation: bounce 1s infinite;
}

.level-up-title {
    font-size: 48px;
    font-weight: bold;
    margin: 0;
    color: white;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.level-up-name {
    font-size: 24px;
    margin: 10px 0;
    opacity: 0.9;
}

.level-up-message {
    font-size: 18px;
    margin: 20px 0;
}

.level-up-btn {
    background: white;
    color: #667eea;
    border: none;
    padding: 15px 40px;
    border-radius: 25px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s ease;
}

.level-up-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

/* Badge desbloqueado */
.badge-content {
    position: relative;
}

.badge-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    animation: glow 2s ease-in-out infinite;
}

.badge-emoji {
    font-size: 80px;
    margin-bottom: 15px;
    animation: wiggle 0.5s ease;
}

.badge-title {
    margin: 0;
    font-size: 24px;
}

.badge-name {
    font-size: 20px;
    margin: 10px 0 5px;
    font-weight: bold;
}

.badge-desc {
    opacity: 0.9;
    margin: 5px 0;
}

.badge-xp {
    font-weight: bold;
    margin-top: 10px;
    font-size: 18px;
}

/* Panel de estadísticas */
#gamification-stats {
    background: white;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.stats-header h3 {
    margin: 0 0 20px;
    font-size: 24px;
    color: #333;
}

.level-display {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 15px;
    color: white;
}

.level-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    background: rgba(255,255,255,0.2);
}

.level-info h2 {
    margin: 0;
    font-size: 28px;
}

.level-info p {
    margin: 5px 0 0;
    opacity: 0.9;
}

.xp-progress {
    margin: 20px 0;
}

.xp-bar-container {
    width: 100%;
    height: 20px;
    background: #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 8px;
}

.xp-bar {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.5s ease;
    border-radius: 10px;
}

.xp-text {
    text-align: center;
    font-size: 14px;
    color: #666;
}

.streak-display {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 15px;
    color: white;
    margin: 20px 0;
}

.streak-icon {
    font-size: 40px;
}

.streak-info h3 {
    margin: 0;
    font-size: 24px;
}

.streak-info p {
    margin: 5px 0 0;
    opacity: 0.9;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin: 20px 0;
}

.stat-item {
    text-align: center;
    padding: 15px;
    background: #f9fafb;
    border-radius: 12px;
}

.stat-icon {
    font-size: 32px;
    margin-bottom: 8px;
}

.stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.stat-label {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
}

.badges-preview h4 {
    margin: 20px 0 10px;
    color: #333;
}

.badges-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 15px;
}

.badge-item {
    text-align: center;
    padding: 10px;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.badge-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.badge-emoji-small {
    font-size: 32px;
    margin-bottom: 5px;
}

.badge-name-small {
    font-size: 10px;
    color: #666;
}

.view-all-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.view-all-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Modal de badges */
.badges-overlay, .leaderboard-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
    z-index: 15000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
    padding: 20px;
}

.badges-modal, .leaderboard-modal {
    background: white;
    border-radius: 20px;
    max-width: 800px;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.badges-header, .leaderboard-header {
    padding: 20px 25px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.badges-header h2, .leaderboard-header h2 {
    margin: 0;
}

.close-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: rotate(90deg);
}

.badges-content, .leaderboard-content {
    padding: 25px;
    overflow-y: auto;
}

.badge-category {
    margin-bottom: 30px;
}

.badge-category h3 {
    margin: 0 0 15px;
    color: #333;
    font-size: 18px;
}

.badges-grid-full {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
}

.badge-card {
    padding: 20px;
    border-radius: 15px;
    text-align: center;
    transition: all 0.3s ease;
    border: 2px solid #e5e7eb;
}

.badge-card.unlocked {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
    border-color: #667eea;
}

.badge-card.locked {
    opacity: 0.5;
    background: #f9fafb;
}

.badge-emoji-large {
    font-size: 48px;
    margin-bottom: 10px;
}

.badge-card h4 {
    margin: 10px 0 5px;
    font-size: 14px;
}

.badge-card p {
    font-size: 11px;
    color: #666;
    margin: 0 0 10px;
}

.badge-card .badge-xp {
    font-weight: bold;
    color: #667eea;
    font-size: 12px;
}

/* Leaderboard */
.leaderboard-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f9fafb;
    border-radius: 12px;
    margin-bottom: 10px;
    transition: all 0.3s ease;
}

.leaderboard-item:hover {
    background: #f3f4f6;
    transform: translateX(5px);
}

.leaderboard-item.current-user {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
    border: 2px solid #667eea;
}

.rank {
    font-size: 24px;
    font-weight: bold;
    min-width: 50px;
    text-align: center;
}

.user-avatar {
    font-size: 32px;
}

.user-info {
    flex: 1;
}

.user-info h4 {
    margin: 0;
    font-size: 16px;
}

.user-info p {
    margin: 3px 0 0;
    font-size: 12px;
    color: #666;
}

.user-xp {
    font-weight: bold;
    font-size: 18px;
    color: #667eea;
}

/* Animaciones */
@keyframes slideInRight {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(400px);
        opacity: 0;
    }
}

@keyframes badgePop {
    0% {
        transform: translate(-50%, -50%) scale(0) rotate(0deg);
        opacity: 0;
    }
    100% {
        transform: translate(-50%, -50%) scale(1) rotate(360deg);
        opacity: 1;
    }
}

@keyframes badgePopOut {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
}

@keyframes confettiFall {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
}

@keyframes scaleUp {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes wiggle {
    0%, 100% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(-10deg);
    }
    75% {
        transform: rotate(10deg);
    }
}

@keyframes glow {
    0%, 100% {
        opacity: 0.3;
        transform: translate(-50%, -50%) scale(1);
    }
    50% {
        opacity: 0.6;
        transform: translate(-50%, -50%) scale(1.2);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .badges-grid-full {
        grid-template-columns: repeat(2, 1fr);
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .level-up-emoji {
        font-size: 80px;
    }

    .level-up-title {
        font-size: 32px;
    }
}
</style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', gamificationStyles);

// Inicializar sistema global
let gamification;

// Inicializar cuando esté listo el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        gamification = new GamificationSystem();
    });
} else {
    gamification = new GamificationSystem();
}
