// ========================================
// INTEGRACIÓN FIREBASE CON SISTEMA ACTUAL
// ========================================

import {
    registerUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    getCurrentUser,
    onAuthChange
} from './firebase-auth.js';

import {
    saveUserProfile,
    getUserProfile,
    saveTestResult,
    getUserTestResults,
    saveCVAnalysis,
    saveInterviewSimulation,
    getUserStatistics
} from './firebase-db.js';

import {
    uploadCV,
    uploadProfileImage,
    listUserCVs,
    deleteCV
} from './firebase-storage.js';

// ========================================
// FUNCIONES DE INTEGRACIÓN
// ========================================

/**
 * Inicializar Firebase en el sistema
 * Configura los listeners y la UI
 */
export function initializeFirebase() {
    console.log('🔥 Inicializando Firebase...');

    // Escuchar cambios de autenticación
    onAuthChange((user) => {
        if (user) {
            console.log('👤 Usuario autenticado:', user.email);
            handleUserAuthenticated(user);
        } else {
            console.log('👤 Usuario no autenticado');
            handleUserLoggedOut();
        }
    });

    // Agregar botones de Firebase a la UI si no existen
    addFirebaseUIElements();
}

/**
 * Manejar usuario autenticado
 * @param {Object} user - Usuario de Firebase
 */
async function handleUserAuthenticated(user) {
    // Actualizar UI con datos del usuario
    if (window.currentUser) {
        window.currentUser = {
            ...window.currentUser,
            firebaseId: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
    }

    // Cargar perfil desde Firestore
    const profile = await getUserProfile(user.uid);
    if (profile.success) {
        console.log('✅ Perfil cargado:', profile.data);
    }

    // Actualizar UI (puedes personalizar esto)
    updateUserUI(user);
}

/**
 * Manejar cierre de sesión
 */
function handleUserLoggedOut() {
    window.currentUser = null;
    // Redirigir al login si es necesario
}

/**
 * Actualizar UI con datos del usuario
 * @param {Object} user - Usuario
 */
function updateUserUI(user) {
    // Buscar elementos en la UI y actualizarlos
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = user.displayName || user.email;
    });

    // Mostrar foto de perfil si existe
    if (user.photoURL) {
        const photoElements = document.querySelectorAll('.user-photo');
        photoElements.forEach(el => {
            el.src = user.photoURL;
        });
    }
}

/**
 * Agregar elementos de UI de Firebase
 */
function addFirebaseUIElements() {
    // Solo agregar si no existen
    // Esto es opcional, puedes personalizar según tu UI
}

/**
 * Guardar resultado de test automáticamente
 * Función auxiliar que se puede llamar desde el sistema actual
 * @param {Object} testData - Datos del test
 */
export async function saveTestResultAuto(testData) {
    const user = getCurrentUser();
    if (!user) {
        console.warn('⚠️ No hay usuario autenticado, no se guardará el resultado');
        return { success: false, error: 'No hay usuario autenticado' };
    }

    return await saveTestResult(user.uid, testData);
}

/**
 * Guardar análisis de CV automáticamente
 * @param {Object} cvData - Datos del CV
 */
export async function saveCVAnalysisAuto(cvData) {
    const user = getCurrentUser();
    if (!user) {
        console.warn('⚠️ No hay usuario autenticado, no se guardará el análisis');
        return { success: false, error: 'No hay usuario autenticado' };
    }

    return await saveCVAnalysis(user.uid, cvData);
}

/**
 * Guardar entrevista simulada automáticamente
 * @param {Object} interviewData - Datos de la entrevista
 */
export async function saveInterviewAuto(interviewData) {
    const user = getCurrentUser();
    if (!user) {
        console.warn('⚠️ No hay usuario autenticado, no se guardará la entrevista');
        return { success: false, error: 'No hay usuario autenticado' };
    }

    return await saveInterviewSimulation(user.uid, interviewData);
}

/**
 * Obtener historial del usuario actual
 * @returns {Promise} Historial completo
 */
export async function getUserHistory() {
    const user = getCurrentUser();
    if (!user) {
        return { success: false, error: 'No hay usuario autenticado' };
    }

    try {
        const [tests, stats] = await Promise.all([
            getUserTestResults(user.uid, 20),
            getUserStatistics(user.uid)
        ]);

        return {
            success: true,
            tests: tests.data || [],
            statistics: stats.data || {}
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Registrar y crear perfil completo
 * @param {string} email - Email
 * @param {string} password - Contraseña
 * @param {Object} profileData - Datos adicionales del perfil
 * @returns {Promise} Resultado
 */
export async function registerComplete(email, password, profileData) {
    // Registrar en Firebase Auth
    const result = await registerUser(email, password, profileData.displayName);

    if (result.success) {
        // Crear perfil en Firestore
        await saveUserProfile(result.user.uid, {
            email: email,
            displayName: profileData.displayName,
            phoneNumber: profileData.phoneNumber || '',
            age: profileData.age || null,
            education: profileData.education || '',
            experience: profileData.experience || ''
        });

        return result;
    }

    return result;
}

// ========================================
// EXPORTAR FUNCIONES PRINCIPALES
// ========================================

export {
    // Auth
    registerUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    getCurrentUser,
    onAuthChange,

    // Database
    saveUserProfile,
    getUserProfile,
    saveTestResult,
    getUserTestResults,
    saveCVAnalysis,
    saveInterviewSimulation,
    getUserStatistics,

    // Storage
    uploadCV,
    uploadProfileImage,
    listUserCVs,
    deleteCV
};

// ========================================
// AUTO-INICIALIZACIÓN
// ========================================

// Inicializar Firebase cuando el DOM esté listo
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFirebase);
    } else {
        initializeFirebase();
    }
}
