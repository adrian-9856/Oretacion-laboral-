// ========================================
// FIREBASE STORAGE
// ========================================

import { storage } from './firebase-config.js';
import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    listAll
} from 'firebase/storage';

// ========================================
// FUNCIONES DE STORAGE
// ========================================

/**
 * Subir archivo CV
 * @param {string} userId - ID del usuario
 * @param {File} file - Archivo a subir
 * @param {Function} onProgress - Callback de progreso (opcional)
 * @returns {Promise} URL del archivo subido
 */
export async function uploadCV(userId, file, onProgress = null) {
    try {
        // Validar archivo
        const allowedTypes = ['application/pdf', 'application/msword',
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                              'text/plain'];

        if (!allowedTypes.includes(file.type)) {
            return {
                success: false,
                error: 'Tipo de archivo no permitido. Usa PDF, DOC, DOCX o TXT'
            };
        }

        // Limitar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return {
                success: false,
                error: 'El archivo es muy grande. Máximo 5MB'
            };
        }

        // Crear referencia
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `cvs/${userId}/${fileName}`);

        // Subir con progreso
        if (onProgress) {
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        onProgress(progress);
                    },
                    (error) => {
                        console.error('❌ Error al subir:', error);
                        reject({ success: false, error: error.message });
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log('✅ CV subido:', downloadURL);
                        resolve({
                            success: true,
                            url: downloadURL,
                            fileName: fileName
                        });
                    }
                );
            });
        } else {
            // Subir sin progreso
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            console.log('✅ CV subido:', downloadURL);
            return {
                success: true,
                url: downloadURL,
                fileName: fileName
            };
        }
    } catch (error) {
        console.error('❌ Error al subir CV:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Subir imagen de perfil
 * @param {string} userId - ID del usuario
 * @param {File} file - Archivo de imagen
 * @returns {Promise} URL de la imagen
 */
export async function uploadProfileImage(userId, file) {
    try {
        // Validar tipo de imagen
        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'El archivo debe ser una imagen' };
        }

        // Limitar tamaño (2MB)
        if (file.size > 2 * 1024 * 1024) {
            return { success: false, error: 'La imagen es muy grande. Máximo 2MB' };
        }

        // Crear referencia
        const storageRef = ref(storage, `profile_images/${userId}/profile.jpg`);

        // Subir imagen
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        console.log('✅ Imagen de perfil subida:', downloadURL);
        return { success: true, url: downloadURL };
    } catch (error) {
        console.error('❌ Error al subir imagen:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtener URL de descarga de un archivo
 * @param {string} filePath - Ruta del archivo en Storage
 * @returns {Promise} URL de descarga
 */
export async function getFileURL(filePath) {
    try {
        const storageRef = ref(storage, filePath);
        const downloadURL = await getDownloadURL(storageRef);

        return { success: true, url: downloadURL };
    } catch (error) {
        console.error('❌ Error al obtener URL:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Eliminar archivo
 * @param {string} filePath - Ruta del archivo en Storage
 * @returns {Promise} Resultado
 */
export async function deleteFile(filePath) {
    try {
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);

        console.log('✅ Archivo eliminado');
        return { success: true };
    } catch (error) {
        console.error('❌ Error al eliminar archivo:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Listar CVs de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise} Lista de archivos
 */
export async function listUserCVs(userId) {
    try {
        const listRef = ref(storage, `cvs/${userId}`);
        const result = await listAll(listRef);

        const files = await Promise.all(
            result.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return {
                    name: itemRef.name,
                    fullPath: itemRef.fullPath,
                    url: url
                };
            })
        );

        console.log(`✅ ${files.length} CVs encontrados`);
        return { success: true, files: files };
    } catch (error) {
        console.error('❌ Error al listar CVs:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Eliminar CV específico
 * @param {string} userId - ID del usuario
 * @param {string} fileName - Nombre del archivo
 * @returns {Promise} Resultado
 */
export async function deleteCV(userId, fileName) {
    return deleteFile(`cvs/${userId}/${fileName}`);
}

/**
 * Subir archivo genérico
 * @param {string} path - Ruta donde subir
 * @param {File} file - Archivo a subir
 * @param {Function} onProgress - Callback de progreso (opcional)
 * @returns {Promise} URL del archivo
 */
export async function uploadFile(path, file, onProgress = null) {
    try {
        const storageRef = ref(storage, path);

        if (onProgress) {
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        onProgress(progress);
                    },
                    (error) => {
                        reject({ success: false, error: error.message });
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve({ success: true, url: downloadURL });
                    }
                );
            });
        } else {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            return { success: true, url: downloadURL };
        }
    } catch (error) {
        console.error('❌ Error al subir archivo:', error);
        return { success: false, error: error.message };
    }
}

// Exportar también storage para uso directo si es necesario
export { storage };
