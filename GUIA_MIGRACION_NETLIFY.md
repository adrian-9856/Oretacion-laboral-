# 🚀 Guía de Migración a Netlify + Google Sheets + Testing

## 📋 Resumen de la Migración

Esta guía documenta la migración completa del proyecto desde **Vercel** a **Netlify Functions**, incluyendo:

- ✅ **5 Netlify Functions** (4 migradas + 1 nueva para Google Sheets)
- ✅ **Integración con Google Sheets API** para recolección de datos
- ✅ **Testing E2E con Playwright** (2 suites de tests)
- ✅ **Testing Unitario con Vitest** (tests de helpers y API)
- ✅ **Configuración completa de package.json y netlify.toml**

---

## 📁 Estructura del Proyecto (Nueva)

```
/
├── netlify/
│   └── functions/               # 🆕 Funciones serverless de Netlify
│       ├── analyze-interview.js   # Análisis de respuestas de entrevista
│       ├── generate-questions.js  # Generación de preguntas IA
│       ├── mentor-coach.js        # Coach virtual con Claude AI
│       ├── analyze-cv.js          # Análisis de CV/Resume
│       └── save-to-sheets.js      # 🆕 Guardar datos en Google Sheets
│
├── tests/                       # 🆕 Tests automatizados
│   ├── e2e/                     # Tests End-to-End con Playwright
│   │   ├── auth.spec.js         # Tests de autenticación
│   │   └── navigation.spec.js   # Tests de navegación
│   ├── unit/                    # Tests unitarios con Vitest
│   │   ├── helpers.test.js      # Tests de funciones helper
│   │   └── api.test.js          # Tests de API con mocks
│   └── setup.js                 # Setup de Vitest
│
├── api/                         # ⚠️ Funciones antiguas de Vercel (deprecadas)
│
├── playwright.config.js         # 🆕 Configuración de Playwright
├── vitest.config.js             # 🆕 Configuración de Vitest
├── netlify.toml                 # ✏️ Actualizado con funciones
├── package.json                 # ✏️ Actualizado con dependencias
│
└── [resto de archivos del proyecto...]
```

---

## 🔧 1. INSTALACIÓN DE DEPENDENCIAS

### Instalar todas las dependencias nuevas:

```bash
npm install
```

### Instalar navegadores de Playwright:

```bash
npm run test:install
```

### Dependencias añadidas:

**Producción:**
- `googleapis@^131.0.0` - Google Sheets API

**Desarrollo:**
- `@playwright/test@^1.42.0` - Testing E2E
- `@testing-library/dom@^9.3.4` - Utilidades de testing
- `@vitest/ui@^1.3.1` - UI de Vitest
- `jsdom@^24.0.0` - DOM virtual para tests
- `netlify-cli@^17.15.0` - CLI de Netlify
- `vitest@^1.3.1` - Testing unitario

---

## 🌐 2. CONFIGURACIÓN DE GOOGLE SHEETS

### Paso 1: Crear un proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**:
   - Menú → APIs y servicios → Biblioteca
   - Busca "Google Sheets API"
   - Clic en "Habilitar"

### Paso 2: Crear Service Account

1. Menú → APIs y servicios → Credenciales
2. Clic en "Crear credenciales" → "Cuenta de servicio"
3. Completa el formulario:
   - **Nombre:** netlify-sheets-access
   - **Rol:** Editor
4. Clic en "Crear clave" → JSON
5. **Guarda el archivo JSON descargado** (lo usarás después)

### Paso 3: Crear Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Crea las siguientes pestañas/hojas:

   **Hoja 1: "Resultados de Tests"**
   - Columnas: Timestamp | UserID | TestType | Score | TotalQuestions | CorrectAnswers | TimeSpent | Difficulty | Passed

   **Hoja 2: "Análisis de CV"**
   - Columnas: Timestamp | UserID | Score | Rating | TargetJob | TargetIndustry | WordCount | Strengths | Weaknesses

   **Hoja 3: "Simulaciones de Entrevista"**
   - Columnas: Timestamp | UserID | JobArea | Difficulty | QuestionsAnswered | AverageScore | TimeSpent | Competencies

   **Hoja 4: "Estadísticas de Usuario"**
   - Columnas: Timestamp | UserID | TestsCompleted | TotalScore | XP | Level | BadgesEarned | Streak | LastActive

   **Hoja 5: "Conversaciones con Mentor"**
   - Columnas: Timestamp | UserID | MessageCount | Topic | UserMessage | Duration

4. **Copiar el ID de la hoja:**
   - En la URL: `https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit`
   - Guarda este ID

5. **Compartir con Service Account:**
   - Clic en "Compartir"
   - Agregar el email de tu service account (del JSON, campo `client_email`)
   - Dar permisos de **Editor**

### Paso 4: Configurar Variables de Entorno

Crea o actualiza tu archivo `.env.local`:

```bash
# Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-XXXXXXXXXXXXXXXX

# Google Sheets
GOOGLE_SHEET_ID=tu_sheet_id_aqui
GOOGLE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'

# Firebase (Frontend)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**⚠️ IMPORTANTE:**
- El `GOOGLE_SERVICE_ACCOUNT` debe ser el contenido completo del JSON en **UNA sola línea**
- Usa comillas simples para evitar problemas con las comillas dobles internas

---

## 🔧 3. CONFIGURACIÓN DE NETLIFY

### Paso 1: Conectar tu repositorio

1. Ve a [Netlify](https://app.netlify.com)
2. Clic en "Add new site" → "Import an existing project"
3. Conecta tu repositorio de GitHub
4. **Configuración de build:**
   - **Build command:** `npm run build`
   - **Publish directory:** `.`
   - **Functions directory:** `netlify/functions`

### Paso 2: Configurar Variables de Entorno

1. En tu sitio de Netlify → Site settings → Environment variables
2. Agregar todas las variables del archivo `.env.local`:

   ```
   ANTHROPIC_API_KEY
   GOOGLE_SHEET_ID
   GOOGLE_SERVICE_ACCOUNT
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   ```

### Paso 3: Deploy

```bash
# Deploy manual
npm run deploy

# O hacer push a la rama principal
git push origin main
```

---

## 🧪 4. EJECUTAR TESTS

### Tests E2E con Playwright

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar en modo UI (recomendado para debugging)
npm run test:e2e:ui

# Ejecutar en modo headed (ver el navegador)
npm run test:e2e:headed

# Ejecutar solo tests de autenticación
npx playwright test auth.spec.js
```

### Tests Unitarios con Vitest

```bash
# Ejecutar todos los tests unitarios
npm test

# Ejecutar en modo watch (se re-ejecutan al cambiar código)
npm test -- --watch

# Ejecutar con UI
npm run test:ui

# Ejecutar con cobertura de código
npm test -- --coverage
```

### Verificar que tests pasan antes de deploy:

```bash
# Ejecutar TODOS los tests
npm test && npm run test:e2e
```

---

## 📊 5. USAR LA FUNCIÓN DE GOOGLE SHEETS

### Desde el Frontend (JavaScript):

```javascript
// Guardar resultado de test
async function saveTestResult(userId, testData) {
  try {
    const response = await fetch('/.netlify/functions/save-to-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataType: 'test_result',
        userId: userId,
        data: {
          testType: 'personality',
          score: 85,
          totalQuestions: 20,
          correctAnswers: 17,
          timeSpent: 600, // segundos
          difficulty: 'medium',
          passed: true
        }
      })
    });

    const result = await response.json();
    console.log('Guardado en Sheets:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Guardar análisis de CV
async function saveCVAnalysis(userId, cvData) {
  await fetch('/.netlify/functions/save-to-sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataType: 'cv_analysis',
      userId: userId,
      data: {
        score: 75,
        rating: 'Bueno',
        targetJob: 'Developer',
        targetIndustry: 'Technology',
        wordCount: 350,
        strengths: ['Experiencia relevante', 'Buena estructura'],
        weaknesses: ['Falta cuantificar logros']
      }
    })
  });
}

// Guardar simulación de entrevista
async function saveInterviewSimulation(userId, interviewData) {
  await fetch('/.netlify/functions/save-to-sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataType: 'interview_simulation',
      userId: userId,
      data: {
        jobArea: 'ventas',
        difficulty: 'mid',
        questionsAnswered: 5,
        averageScore: 82,
        timeSpent: 900,
        competencies: ['Comunicación', 'Negociación']
      }
    })
  });
}

// Guardar estadísticas de usuario
async function saveUserStats(userId, stats) {
  await fetch('/.netlify/functions/save-to-sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataType: 'user_stats',
      userId: userId,
      data: {
        testsCompleted: 15,
        totalScore: 1250,
        xp: 3500,
        level: 4,
        badgesEarned: 8,
        streak: 7,
        lastActive: new Date().toISOString()
      }
    })
  });
}

// Guardar conversación con mentor
async function saveMentorConversation(userId, conversationData) {
  await fetch('/.netlify/functions/save-to-sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataType: 'mentor_conversation',
      userId: userId,
      data: {
        messageCount: 5,
        topic: 'mejora de cv',
        userMessage: '¿Cómo mejoro mi CV para tech?',
        duration: 120 // segundos
      }
    })
  });
}
```

### Tipos de datos soportados:

- `test_result` - Resultados de tests/exámenes
- `cv_analysis` - Análisis de CV
- `interview_simulation` - Simulaciones de entrevista
- `user_stats` - Estadísticas generales del usuario
- `mentor_conversation` - Conversaciones con el mentor IA

---

## 🔄 6. INTEGRACIÓN EN TU CÓDIGO ACTUAL

### Actualizar claude-ai-helper.js:

Agrega métodos para guardar en Google Sheets después de cada análisis:

```javascript
// En claude-ai-helper.js, después de analyzeInterview:
async analyzeInterview(question, answer, userProfile) {
  const response = await fetch('/.netlify/functions/analyze-interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer, userProfile })
  });

  const data = await response.json();

  // 🆕 Guardar en Google Sheets automáticamente
  if (data.success && userProfile?.userId) {
    this.saveToSheets('interview_simulation', {
      jobArea: userProfile.jobArea || 'general',
      difficulty: 'mid',
      questionsAnswered: 1,
      averageScore: data.analysis.score,
      timeSpent: 0,
      competencies: data.analysis.competencies
    }, userProfile.userId);
  }

  return data;
}

// 🆕 Método nuevo para guardar en Sheets
async saveToSheets(dataType, data, userId) {
  try {
    await fetch('/.netlify/functions/save-to-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataType, data, userId })
    });
  } catch (error) {
    console.warn('Error guardando en Sheets:', error);
    // No bloquear la app si falla Sheets
  }
}
```

### Actualizar script-pro.js:

En la función `finishQuiz()`:

```javascript
async function finishQuiz() {
  // ... código existente ...

  // 🆕 Guardar resultado en Google Sheets
  if (currentUser) {
    await fetch('/.netlify/functions/save-to-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataType: 'test_result',
        userId: currentUser.uid,
        data: {
          testType: currentExam.id,
          score: scorePercentage,
          totalQuestions: currentExam.questions.length,
          correctAnswers: correctAnswers,
          timeSpent: timeSpent,
          difficulty: currentExam.difficulty || 'medium',
          passed: scorePercentage >= 70
        }
      })
    });
  }
}
```

---

## 📜 7. SCRIPTS DISPONIBLES

```bash
# Desarrollo
npm run dev              # Servidor local con Netlify Dev
npm run dev:vercel       # Servidor local con Vercel (legacy)

# Build
npm run build            # Build del proyecto

# Deploy
npm run deploy           # Deploy a Netlify producción
npm run deploy:vercel    # Deploy a Vercel (legacy)

# Testing
npm test                 # Tests unitarios (Vitest)
npm run test:ui          # Tests unitarios con UI
npm run test:e2e         # Tests E2E (Playwright)
npm run test:e2e:ui      # Tests E2E con UI
npm run test:e2e:headed  # Tests E2E visible
npm run test:install     # Instalar navegadores Playwright
```

---

## 🐛 8. TROUBLESHOOTING

### Error: "GOOGLE_SERVICE_ACCOUNT no configurado"

**Solución:**
1. Verifica que la variable está en `.env.local` (desarrollo) o en Netlify (producción)
2. El JSON debe estar en UNA sola línea
3. Usa comillas simples alrededor del JSON completo

### Error: "Could not load the default credentials"

**Solución:**
- Verifica que el Service Account tiene permisos de Editor en el Google Sheet
- Verifica que la Google Sheets API está habilitada en Google Cloud Console

### Tests de Playwright fallan

**Solución:**
```bash
# Reinstalar navegadores
npm run test:install

# Verificar que el servidor está corriendo
npm run dev

# Ejecutar en modo headed para ver qué pasa
npm run test:e2e:headed
```

### Netlify Functions timeout

**Solución:**
- Los timeouts están configurados en `netlify.toml`
- Claude AI puede tardar, aumenta el timeout si es necesario
- Máximo permitido por Netlify: 26 segundos en plan free

### Firebase no carga en tests

**Solución:**
- Los tests usan mocks de localStorage
- Para tests reales con Firebase, usa tests E2E, no unitarios

---

## 📚 9. RECURSOS ADICIONALES

### Documentación oficial:
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Playwright](https://playwright.dev/)
- [Vitest](https://vitest.dev/)
- [Claude AI SDK](https://docs.anthropic.com/claude/docs)

### Archivos de configuración:
- `netlify.toml` - Configuración de Netlify
- `playwright.config.js` - Configuración de Playwright
- `vitest.config.js` - Configuración de Vitest
- `package.json` - Scripts y dependencias

---

## ✅ 10. CHECKLIST DE MIGRACIÓN

Usa este checklist para verificar que todo está configurado:

### Setup Inicial:
- [ ] `npm install` ejecutado
- [ ] `npm run test:install` ejecutado
- [ ] `.env.local` creado con todas las variables

### Google Sheets:
- [ ] Proyecto de Google Cloud creado
- [ ] Google Sheets API habilitada
- [ ] Service Account creado y JSON descargado
- [ ] Google Sheet creado con las 5 hojas
- [ ] Sheet compartido con service account
- [ ] Variables de entorno configuradas

### Netlify:
- [ ] Repositorio conectado a Netlify
- [ ] Variables de entorno configuradas en Netlify
- [ ] Build command configurado: `npm run build`
- [ ] Functions directory configurado: `netlify/functions`
- [ ] Deploy exitoso

### Testing:
- [ ] Tests unitarios pasan: `npm test`
- [ ] Tests E2E pasan: `npm run test:e2e`
- [ ] Navegadores instalados correctamente

### Integración:
- [ ] Claude AI funciona en desarrollo
- [ ] Google Sheets guarda datos correctamente
- [ ] Firebase Auth funciona
- [ ] Netlify Functions responden correctamente

---

## 🎉 ¡Listo!

Tu aplicación ahora está migrada a Netlify con:
- ✅ 5 Netlify Functions operativas
- ✅ Integración con Google Sheets
- ✅ Testing completo (E2E + Unitario)
- ✅ Documentación completa

**Próximos pasos:** ¿Quieres implementar las nuevas funcionalidades (juegos, mejoras visuales, etc.)?
