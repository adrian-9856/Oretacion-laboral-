// ========================================
// FIREBASE FIRESTORE DATABASE
// ========================================

import { db } from './firebase-config.js';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';

// ========================================
// FUNCIONES DE BASE DE DATOS
// ========================================

/**
 * Guardar perfil de usuario
 * @param {string} userId - ID del usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise} Resultado
 */
export async function saveUserProfile(userId, userData) {
    try {
        await setDoc(doc(db, 'users', userId), {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });

        console.log('✅ Perfil guardado');
        return { success: true };
    } catch (error) {
        console.error('❌ Error al guardar perfil:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtener perfil de usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise} Datos del usuario
 */
export async function getUserProfile(userId) {
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            return { success: false, error: 'Usuario no encontrado' };
        }
    } catch (error) {
        console.error('❌ Error al obtener perfil:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Guardar resultado de test/cuestionario
 * @param {string} userId - ID del usuario
 * @param {Object} testData - Datos del test
 * @returns {Promise} Resultado
 */
export async function saveTestResult(userId, testData) {
    try {
        const testRef = await addDoc(collection(db, 'test_results'), {
            userId: userId,
            testType: testData.testType || 'unknown',
            difficulty: testData.difficulty || 'easy',
            score: testData.score || 0,
            totalQuestions: testData.totalQuestions || 0,
            correctAnswers: testData.correctAnswers || 0,
            timeSpent: testData.timeSpent || 0,
            answers: testData.answers || [],
            isPracticeMode: testData.isPracticeMode || false,
            completedAt: serverTimestamp(),
            createdAt: serverTimestamp()
        });

        console.log('✅ Resultado guardado:', testRef.id);
        return { success: true, id: testRef.id };
    } catch (error) {
        console.error('❌ Error al guardar resultado:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtener resultados de tests de un usuario
 * @param {string} userId - ID del usuario
 * @param {number} limitCount - Límite de resultados (por defecto 10)
 * @returns {Promise} Lista de resultados
 */
export async function getUserTestResults(userId, limitCount = 10) {
    try {
        const q = query(
            collection(db, 'test_results'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const results = [];

        querySnapshot.forEach((doc) => {
            results.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`✅ ${results.length} resultados obtenidos`);
        return { success: true, data: results };
    } catch (error) {
        console.error('❌ Error al obtener resultados:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Guardar CV analizado
 * @param {string} userId - ID del usuario
 * @param {Object} cvData - Datos del CV
 * @returns {Promise} Resultado
 */
export async function saveCVAnalysis(userId, cvData) {
    try {
        const cvRef = await addDoc(collection(db, 'cv_analyses'), {
            userId: userId,
            cvText: cvData.cvText || '',
            analysis: cvData.analysis || {},
            errors: cvData.errors || [],
            score: cvData.score || 0,
            suggestions: cvData.suggestions || [],
            createdAt: serverTimestamp()
        });

        console.log('✅ Análisis de CV guardado:', cvRef.id);
        return { success: true, id: cvRef.id };
    } catch (error) {
        console.error('❌ Error al guardar análisis:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtener análisis de CVs de un usuario
 * @param {string} userId - ID del usuario
 * @param {number} limitCount - Límite de resultados
 * @returns {Promise} Lista de análisis
 */
export async function getUserCVAnalyses(userId, limitCount = 5) {
    try {
        const q = query(
            collection(db, 'cv_analyses'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const analyses = [];

        querySnapshot.forEach((doc) => {
            analyses.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`✅ ${analyses.length} análisis obtenidos`);
        return { success: true, data: analyses };
    } catch (error) {
        console.error('❌ Error al obtener análisis:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Guardar respuesta del mentor/coach
 * @param {string} userId - ID del usuario
 * @param {Object} mentorData - Datos de la consulta
 * @returns {Promise} Resultado
 */
export async function saveMentorConsultation(userId, mentorData) {
    try {
        const mentorRef = await addDoc(collection(db, 'mentor_consultations'), {
            userId: userId,
            question: mentorData.question || '',
            answer: mentorData.answer || '',
            category: mentorData.category || 'general',
            createdAt: serverTimestamp()
        });

        console.log('✅ Consulta guardada:', mentorRef.id);
        return { success: true, id: mentorRef.id };
    } catch (error) {
        console.error('❌ Error al guardar consulta:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Guardar entrevista simulada
 * @param {string} userId - ID del usuario
 * @param {Object} interviewData - Datos de la entrevista
 * @returns {Promise} Resultado
 */
export async function saveInterviewSimulation(userId, interviewData) {
    try {
        const interviewRef = await addDoc(collection(db, 'interview_simulations'), {
            userId: userId,
            position: interviewData.position || '',
            questions: interviewData.questions || [],
            answers: interviewData.answers || [],
            feedback: interviewData.feedback || '',
            score: interviewData.score || 0,
            createdAt: serverTimestamp()
        });

        console.log('✅ Entrevista guardada:', interviewRef.id);
        return { success: true, id: interviewRef.id };
    } catch (error) {
        console.error('❌ Error al guardar entrevista:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Actualizar documento
 * @param {string} collectionName - Nombre de la colección
 * @param {string} docId - ID del documento
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Resultado
 */
export async function updateDocument(collectionName, docId, data) {
    try {
        await updateDoc(doc(db, collectionName, docId), {
            ...data,
            updatedAt: serverTimestamp()
        });

        console.log('✅ Documento actualizado');
        return { success: true };
    } catch (error) {
        console.error('❌ Error al actualizar:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Eliminar documento
 * @param {string} collectionName - Nombre de la colección
 * @param {string} docId - ID del documento
 * @returns {Promise} Resultado
 */
export async function deleteDocument(collectionName, docId) {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        console.log('✅ Documento eliminado');
        return { success: true };
    } catch (error) {
        console.error('❌ Error al eliminar:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtener estadísticas del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise} Estadísticas
 */
export async function getUserStatistics(userId) {
    try {
        // Obtener todos los tests
        const testsQuery = query(
            collection(db, 'test_results'),
            where('userId', '==', userId)
        );
        const testsSnapshot = await getDocs(testsQuery);

        // Calcular estadísticas
        let totalTests = 0;
        let totalScore = 0;
        let testsByType = {};

        testsSnapshot.forEach((doc) => {
            const data = doc.data();
            totalTests++;
            totalScore += data.score || 0;

            const type = data.testType || 'unknown';
            if (!testsByType[type]) {
                testsByType[type] = { count: 0, totalScore: 0 };
            }
            testsByType[type].count++;
            testsByType[type].totalScore += data.score || 0;
        });

        const averageScore = totalTests > 0 ? (totalScore / totalTests).toFixed(2) : 0;

        return {
            success: true,
            data: {
                totalTests,
                averageScore,
                testsByType
            }
        };
    } catch (error) {
        console.error('❌ Error al obtener estadísticas:', error);
        return { success: false, error: error.message };
    }
}

// Exportar también db para uso directo si es necesario
export { db };
