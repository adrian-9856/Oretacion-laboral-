// ========================================
// CONFIGURACIÓN DE FIREBASE
// ========================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase (desde variables de entorno o valores por defecto)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "CONFIGURAR_EN_ENV",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "CONFIGURAR_EN_ENV",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "CONFIGURAR_EN_ENV",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "CONFIGURAR_EN_ENV",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "CONFIGURAR_EN_ENV",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "CONFIGURAR_EN_ENV"
};

// Inicializar Firebase
let app = null;
let auth = null;
let db = null;
let storage = null;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('✅ Firebase inicializado correctamente');
} catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    console.warn('⚠️ La aplicación continuará sin funcionalidades de Firebase');
}

// Exportar servicios
export { app, auth, db, storage };
