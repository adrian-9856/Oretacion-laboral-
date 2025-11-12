# 🔥 Guía Completa de Firebase

## 📋 Tabla de Contenidos
1. [¿Qué es Firebase?](#qué-es-firebase)
2. [Configuración Inicial](#configuración-inicial)
3. [Autenticación de Usuarios](#autenticación)
4. [Base de Datos (Firestore)](#base-de-datos)
5. [Almacenamiento (Storage)](#almacenamiento)
6. [Integración con el Sistema](#integración)
7. [Ejemplos de Uso](#ejemplos)
8. [Solución de Problemas](#problemas)

---

## 🎯 ¿Qué es Firebase?

Firebase es una plataforma de Google que te proporciona:

- **🔐 Authentication**: Sistema de login seguro (email, Google, Facebook, etc.)
- **💾 Firestore**: Base de datos NoSQL en tiempo real
- **📁 Storage**: Almacenamiento de archivos (CVs, imágenes, etc.)
- **🚀 Hosting**: Hospedaje de tu aplicación
- **📊 Analytics**: Estadísticas de uso

### ¿Por qué usar Firebase en este proyecto?

✅ **Antes (Sin Firebase)**:
- Login básico con usuario/contraseña hardcodeado
- Datos se pierden al cerrar el navegador
- No hay historial de resultados
- No se pueden guardar CVs

✅ **Ahora (Con Firebase)**:
- Login real con múltiples proveedores
- Todos los datos se guardan en la nube
- Historial completo de tests y análisis
- Guardar CVs y documentos

---

## ⚙️ Configuración Inicial

### Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: `orientacion-laboral` (o el que prefieras)
4. Acepta los términos y crea el proyecto

### Paso 2: Configurar Web App

1. En el panel de Firebase, haz clic en el ícono **</>** (Web)
2. Registra tu app con un nombre
3. **¡IMPORTANTE!** Copia la configuración que te muestra:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Paso 3: Configurar Variables de Entorno

1. Copia el archivo `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y agrega tus valores de Firebase:
   ```env
   FIREBASE_API_KEY=tu_api_key_aqui
   FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   FIREBASE_PROJECT_ID=tu-proyecto-id
   FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789
   FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### Paso 4: Habilitar Servicios en Firebase

#### 🔐 Authentication
1. En Firebase Console → **Authentication** → **Get Started**
2. Habilita los métodos de autenticación:
   - ✅ Email/Password
   - ✅ Google (opcional)

#### 💾 Firestore Database
1. En Firebase Console → **Firestore Database** → **Create Database**
2. Modo: **Producción** (cambiaremos las reglas después)
3. Ubicación: Elige la más cercana a tus usuarios

#### 📁 Storage
1. En Firebase Console → **Storage** → **Get Started**
2. Modo: **Producción**

### Paso 5: Configurar Reglas de Seguridad

#### Firestore Rules
En Firebase Console → Firestore → Reglas, agrega:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regla para usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Regla para test_results
    match /test_results/{document} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // Regla para cv_analyses
    match /cv_analyses/{document} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // Regla para interview_simulations
    match /interview_simulations/{document} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // Regla para mentor_consultations
    match /mentor_consultations/{document} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

#### Storage Rules
En Firebase Console → Storage → Reglas, agrega:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // CVs - solo el usuario puede ver/subir sus CVs
    match /cvs/{userId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Imágenes de perfil
    match /profile_images/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Paso 6: Instalar Dependencias

```bash
npm install
```

---

## 🔐 Autenticación

### Registro de Usuario

```javascript
import { registerUser } from './firebase-auth.js';

// Registrar usuario
const result = await registerUser(
    'usuario@email.com',
    'password123',
    'Juan Pérez'
);

if (result.success) {
    console.log('Usuario registrado:', result.user);
} else {
    console.error('Error:', result.error);
}
```

### Iniciar Sesión

```javascript
import { loginUser, loginWithGoogle } from './firebase-auth.js';

// Login con email
const result = await loginUser('usuario@email.com', 'password123');

// Login con Google
const googleResult = await loginWithGoogle();
```

### Cerrar Sesión

```javascript
import { logoutUser } from './firebase-auth.js';

await logoutUser();
```

### Obtener Usuario Actual

```javascript
import { getCurrentUser } from './firebase-auth.js';

const user = getCurrentUser();
if (user) {
    console.log('Usuario:', user.email);
}
```

### Escuchar Cambios de Autenticación

```javascript
import { onAuthChange } from './firebase-auth.js';

onAuthChange((user) => {
    if (user) {
        console.log('Usuario logueado:', user.email);
    } else {
        console.log('No hay usuario');
    }
});
```

---

## 💾 Base de Datos (Firestore)

### Guardar Resultado de Test

```javascript
import { saveTestResult } from './firebase-db.js';

const testData = {
    testType: 'quiz',
    difficulty: 'easy',
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    timeSpent: 300,
    answers: [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    isPracticeMode: false
};

const result = await saveTestResult(userId, testData);
```

### Obtener Resultados de Tests

```javascript
import { getUserTestResults } from './firebase-db.js';

const results = await getUserTestResults(userId, 10); // últimos 10 tests

if (results.success) {
    results.data.forEach(test => {
        console.log(`Test: ${test.testType}, Score: ${test.score}`);
    });
}
```

### Guardar Análisis de CV

```javascript
import { saveCVAnalysis } from './firebase-db.js';

const cvData = {
    cvText: 'Contenido del CV...',
    analysis: { /* análisis del CV */ },
    errors: ['Error 1', 'Error 2'],
    score: 75,
    suggestions: ['Sugerencia 1', 'Sugerencia 2']
};

await saveCVAnalysis(userId, cvData);
```

### Obtener Estadísticas

```javascript
import { getUserStatistics } from './firebase-db.js';

const stats = await getUserStatistics(userId);

console.log('Total tests:', stats.data.totalTests);
console.log('Promedio:', stats.data.averageScore);
```

---

## 📁 Almacenamiento (Storage)

### Subir CV

```javascript
import { uploadCV } from './firebase-storage.js';

// Desde un input file
const fileInput = document.getElementById('cvFile');
const file = fileInput.files[0];

// Con barra de progreso
const result = await uploadCV(userId, file, (progress) => {
    console.log(`Progreso: ${progress}%`);
});

if (result.success) {
    console.log('URL del CV:', result.url);
}
```

### Subir Imagen de Perfil

```javascript
import { uploadProfileImage } from './firebase-storage.js';

const imageFile = document.getElementById('profileImage').files[0];
const result = await uploadProfileImage(userId, imageFile);

if (result.success) {
    console.log('URL de la imagen:', result.url);
}
```

### Listar CVs del Usuario

```javascript
import { listUserCVs } from './firebase-storage.js';

const result = await listUserCVs(userId);

if (result.success) {
    result.files.forEach(file => {
        console.log(`Archivo: ${file.name}, URL: ${file.url}`);
    });
}
```

### Eliminar CV

```javascript
import { deleteCV } from './firebase-storage.js';

await deleteCV(userId, 'nombre-del-archivo.pdf');
```

---

## 🔗 Integración con el Sistema

### Usar Funciones Automáticas

El archivo `firebase-integration.js` proporciona funciones que automáticamente usan el usuario actual:

```javascript
import {
    saveTestResultAuto,
    saveCVAnalysisAuto,
    getUserHistory
} from './firebase-integration.js';

// Guardar test automáticamente (usa el usuario logueado)
await saveTestResultAuto({
    testType: 'quiz',
    score: 90,
    // ... resto de datos
});

// Obtener historial completo
const history = await getUserHistory();
console.log('Tests:', history.tests);
console.log('Estadísticas:', history.statistics);
```

### Integrar en tu Código Actual

#### Ejemplo: Guardar resultado al finalizar quiz

En `script-pro.js`, modifica la función que finaliza el quiz:

```javascript
// Agregar al inicio del archivo
import { saveTestResultAuto } from './firebase-integration.js';

// En la función finishQuiz() o similar
async function finishQuiz() {
    // ... tu código actual ...

    // Calcular resultado
    const score = calculateScore();

    // Guardar en Firebase
    await saveTestResultAuto({
        testType: currentTestType,
        difficulty: currentDifficulty,
        score: score,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        timeSpent: elapsedTime,
        answers: quizAnswers,
        isPracticeMode: isPracticeMode
    });

    // ... resto del código ...
}
```

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Sistema de Login Completo

```javascript
// HTML
<div id="loginForm">
    <input type="email" id="email" placeholder="Email">
    <input type="password" id="password" placeholder="Contraseña">
    <button onclick="handleLogin()">Iniciar Sesión</button>
    <button onclick="handleGoogleLogin()">Iniciar con Google</button>
</div>

// JavaScript
import { loginUser, loginWithGoogle } from './firebase-auth.js';

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = await loginUser(email, password);

    if (result.success) {
        alert('Bienvenido!');
        // Redirigir a dashboard
    } else {
        alert('Error: ' + result.error);
    }
}

async function handleGoogleLogin() {
    const result = await loginWithGoogle();
    if (result.success) {
        alert('Bienvenido!');
    }
}
```

### Ejemplo 2: Subir y Analizar CV

```javascript
import { uploadCV } from './firebase-storage.js';
import { saveCVAnalysis } from './firebase-db.js';

async function handleCVUpload(file, userId) {
    // 1. Subir archivo
    const uploadResult = await uploadCV(userId, file, (progress) => {
        updateProgressBar(progress);
    });

    if (!uploadResult.success) {
        alert('Error al subir: ' + uploadResult.error);
        return;
    }

    // 2. Analizar CV (con Claude AI)
    const analysis = await analyzeCV(uploadResult.url);

    // 3. Guardar análisis
    await saveCVAnalysis(userId, {
        cvText: analysis.text,
        analysis: analysis.result,
        errors: analysis.errors,
        score: analysis.score,
        suggestions: analysis.suggestions
    });

    // 4. Mostrar resultados
    displayAnalysisResults(analysis);
}
```

### Ejemplo 3: Dashboard con Estadísticas

```javascript
import { getUserHistory, getUserStatistics } from './firebase-integration.js';

async function loadDashboard() {
    const history = await getUserHistory();

    if (history.success) {
        // Mostrar últimos tests
        displayRecentTests(history.tests);

        // Mostrar estadísticas
        displayStatistics(history.statistics);
    }
}

function displayStatistics(stats) {
    document.getElementById('totalTests').textContent = stats.totalTests;
    document.getElementById('avgScore').textContent = stats.averageScore;

    // Crear gráfico de tests por tipo
    createChart(stats.testsByType);
}
```

---

## 🐛 Solución de Problemas

### Error: "Firebase not initialized"

**Problema**: Firebase no se está inicializando.

**Solución**:
1. Verifica que las variables de entorno estén configuradas en `.env.local`
2. Verifica que el archivo `firebase-config.js` se esté importando correctamente
3. Verifica que el proyecto de Firebase esté activo en la consola

### Error: "Permission denied"

**Problema**: Las reglas de seguridad están bloqueando la operación.

**Solución**:
1. Verifica que el usuario esté autenticado
2. Revisa las reglas de Firestore/Storage en la consola
3. Asegúrate de que el userId coincida con el usuario autenticado

### Error: "Quota exceeded"

**Problema**: Has superado el límite gratuito de Firebase.

**Solución**:
1. Revisa tu uso en Firebase Console → Usage
2. Optimiza las consultas para reducir lecturas/escrituras
3. Considera actualizar al plan Blaze (pago por uso)

### Los datos no se guardan

**Problema**: Las operaciones parecen exitosas pero no se ven en Firestore.

**Solución**:
1. Abre Firebase Console → Firestore
2. Verifica que la colección se esté creando
3. Revisa la consola del navegador en busca de errores
4. Verifica que `serverTimestamp()` no esté causando problemas

### Error al subir archivos

**Problema**: Los archivos no se suben a Storage.

**Solución**:
1. Verifica el tamaño del archivo (límites: CV 5MB, Imagen 2MB)
2. Verifica el tipo de archivo (solo PDF, DOC, DOCX, TXT para CVs)
3. Revisa las reglas de Storage
4. Verifica tu cuota de almacenamiento en Firebase Console

---

## 📊 Estructura de Datos en Firestore

### Colección: `users`
```javascript
{
  userId: "abc123",
  email: "usuario@email.com",
  displayName: "Juan Pérez",
  phoneNumber: "+1234567890",
  age: 25,
  education: "Universitaria",
  experience: "2 años",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Colección: `test_results`
```javascript
{
  userId: "abc123",
  testType: "quiz",
  difficulty: "easy",
  score: 85,
  totalQuestions: 10,
  correctAnswers: 8,
  timeSpent: 300,
  answers: [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
  isPracticeMode: false,
  completedAt: Timestamp,
  createdAt: Timestamp
}
```

### Colección: `cv_analyses`
```javascript
{
  userId: "abc123",
  cvText: "Contenido del CV...",
  analysis: { /* objeto con análisis */ },
  errors: ["Error 1", "Error 2"],
  score: 75,
  suggestions: ["Sugerencia 1", "Sugerencia 2"],
  createdAt: Timestamp
}
```

---

## 🎓 Próximos Pasos

1. **Configura tu proyecto de Firebase** siguiendo los pasos de configuración inicial
2. **Instala las dependencias** con `npm install`
3. **Prueba la autenticación** registrando un usuario
4. **Integra con tu código** usando las funciones de `firebase-integration.js`
5. **Personaliza** según tus necesidades

---

## 📚 Recursos Adicionales

- [Documentación oficial de Firebase](https://firebase.google.com/docs)
- [Firebase JavaScript SDK](https://firebase.google.com/docs/reference/js)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Security Rules](https://firebase.google.com/docs/rules)

---

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa esta guía completa
2. Consulta la sección de Solución de Problemas
3. Revisa la consola de Firebase para errores
4. Consulta la documentación oficial de Firebase

---

**¡Firebase está listo para usar! 🚀**
