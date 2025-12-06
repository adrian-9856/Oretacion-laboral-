// ========================================
// FIREBASE AUTHENTICATION
// ========================================

import { auth } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

// ========================================
// FUNCIONES DE AUTENTICACIÓN
// ========================================

/**
 * Registrar nuevo usuario con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @param {string} displayName - Nombre completo del usuario
 * @returns {Promise} Resultado del registro
 */
export async function registerUser(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Actualizar perfil con nombre
        await updateProfile(user, {
            displayName: displayName
        });

        console.log('✅ Usuario registrado:', user.email);
        return { success: true, user: user };
    } catch (error) {
        console.error('❌ Error al registrar:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * Iniciar sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise} Resultado del login
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('✅ Sesión iniciada:', user.email);
        return { success: true, user: user };
    } catch (error) {
        console.error('❌ Error al iniciar sesión:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * Iniciar sesión con Google
 * @returns {Promise} Resultado del login
 */
export async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log('✅ Sesión iniciada con Google:', user.email);
        return { success: true, user: user };
    } catch (error) {
        console.error('❌ Error al iniciar sesión con Google:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * Cerrar sesión
 * @returns {Promise} Resultado del logout
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        console.log('✅ Sesión cerrada');
        return { success: true };
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Recuperar contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise} Resultado del envío
 */
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('✅ Email de recuperación enviado');
        return { success: true };
    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * Obtener usuario actual
 * @returns {Object|null} Usuario actual o null
 */
export function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Escuchar cambios en autenticación
 * @param {Function} callback - Función a ejecutar cuando cambie el estado
 */
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

/**
 * Obtener mensaje de error en español
 * @param {string} errorCode - Código de error de Firebase
 * @returns {string} Mensaje de error
 */
function getErrorMessage(errorCode) {
    const errors = {
        'auth/email-already-in-use': 'Este correo ya está registrado',
        'auth/invalid-email': 'Correo electrónico inválido',
        'auth/operation-not-allowed': 'Operación no permitida',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
        'auth/popup-closed-by-user': 'Ventana cerrada por el usuario'
    };

    return errors[errorCode] || 'Error al procesar la solicitud';
}

// Exportar también auth para uso directo si es necesario
export { auth };
