# 🤖 Guía de Integración: Claude AI + Vercel

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración Inicial](#configuración-inicial)
3. [APIs Disponibles](#apis-disponibles)
4. [Ejemplos de Uso](#ejemplos-de-uso)
5. [Despliegue en Vercel](#despliegue-en-vercel)
6. [Costos y Límites](#costos-y-límites)

---

## 🎯 Requisitos Previos

1. **Cuenta en Anthropic**
   - Regístrate en: https://console.anthropic.com/
   - Obtén tu API Key
   - Carga créditos (empieza con $5 USD para pruebas)

2. **Cuenta en Vercel**
   - Regístrate en: https://vercel.com/
   - Conecta tu repositorio de GitHub
   - Plan gratuito es suficiente para empezar

3. **Node.js**
   - Versión 18 o superior
   - npm o yarn instalado

---

## ⚙️ Configuración Inicial

### Paso 1: Instalar Dependencias

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` y agrega tu API key:
```env
ANTHROPIC_API_KEY=sk-ant-api03-TU_API_KEY_AQUI
```

### Paso 3: Probar Localmente

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo en: http://localhost:3000

---

## 🚀 APIs Disponibles

### 1. 📊 Análisis de Entrevistas
**Endpoint:** `/api/analyze-interview`

**Método:** POST

**Body:**
```json
{
  "question": "¿Cómo manejas situaciones de conflicto en el trabajo?",
  "answer": "Cuando enfrento conflictos, primero escucho todas las perspectivas...",
  "userProfile": {
    "name": "Juan Pérez",
    "age": 28,
    "experience": "3 años en ventas"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "analysis": {
    "score": 85,
    "level": "Muy Bueno",
    "strengths": [
      "Demuestra empatía al mencionar 'escuchar perspectivas'",
      "Enfoque estructurado para resolver conflictos"
    ],
    "improvements": [
      "Podría incluir un ejemplo concreto",
      "Mencionar resultados específicos"
    ],
    "competencies": [
      "Resolución de problemas",
      "Comunicación",
      "Inteligencia emocional"
    ],
    "suggestions": [
      "Utiliza la técnica STAR (Situación, Tarea, Acción, Resultado)",
      "Incluye métricas cuando sea posible"
    ],
    "modelAnswer": "Ejemplo de respuesta mejorada..."
  }
}
```

---

### 2. ❓ Generación de Preguntas
**Endpoint:** `/api/generate-questions`

**Método:** POST

**Body:**
```json
{
  "jobArea": "tecnología",
  "difficulty": "mid",
  "count": 5,
  "userProfile": {
    "name": "María García",
    "age": 25,
    "experience": "2 años como desarrolladora web"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "question": "Describe un proyecto técnico desafiante que hayas completado",
      "type": "behavioral",
      "competencies": ["resolución de problemas", "habilidades técnicas"],
      "tips": "Buscar detalles técnicos específicos y proceso de pensamiento",
      "difficulty": "media"
    }
  ]
}
```

---

### 3. 💬 Coach Virtual
**Endpoint:** `/api/mentor-coach`

**Método:** POST

**Body:**
```json
{
  "userMessage": "No sé qué carrera seguir, me gusta la tecnología pero también el diseño",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hola, necesito ayuda con mi carrera"
    },
    {
      "role": "assistant",
      "content": "¡Hola! Estoy aquí para ayudarte. ¿Qué te preocupa específicamente?"
    }
  ],
  "userProfile": {
    "name": "Carlos",
    "age": 22,
    "situation": "Estudiante universitario"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "response": "¡Excelente que reconozcas tus múltiples intereses! La buena noticia es que tecnología y diseño se complementan perfectamente. Considera estas opciones:\n\n1. **UX/UI Design**: Combina diseño con tecnología...\n2. **Frontend Development**: Requiere ojo para el diseño...\n\n¿Cuál de estas áreas te llama más la atención?",
  "timestamp": "2024-11-10T10:30:00Z"
}
```

---

### 4. 📄 Análisis de CV
**Endpoint:** `/api/analyze-cv`

**Método:** POST

**Body:**
```json
{
  "cvText": "JUAN PÉREZ\nDesarrollador Full Stack\n\nEXPERIENCIA:\n- Empresa X (2020-2023): Desarrollé aplicaciones web...",
  "targetJob": "Senior Developer",
  "targetIndustry": "tecnología"
}
```

---

## 💻 Ejemplos de Uso desde Frontend

### Ejemplo 1: Análisis de Entrevista con Audio

Integra esto en tu función `analyzeAudioResponse()` en `script-pro.js`:

```javascript
async function analyzeInterviewWithClaude(question, transcript) {
  try {
    const response = await fetch('/api/analyze-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        answer: transcript,
        userProfile: {
          name: currentUser.name,
          age: currentUser.age,
          experience: currentUser.experience
        }
      })
    });

    const data = await response.json();

    if (data.success) {
      // Mostrar resultados al usuario
      displayAIAnalysis(data.analysis);
    }
  } catch (error) {
    console.error('Error al analizar con Claude:', error);
  }
}

function displayAIAnalysis(analysis) {
  const resultHTML = `
    <div class="ai-analysis">
      <h3>🤖 Análisis con IA</h3>

      <div class="score-badge">
        <span class="score">${analysis.score}</span>
        <span class="level">${analysis.level}</span>
      </div>

      <div class="section">
        <h4>✅ Fortalezas</h4>
        <ul>
          ${analysis.strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h4>📈 Áreas de Mejora</h4>
        <ul>
          ${analysis.improvements.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h4>🎯 Competencias Detectadas</h4>
        <div class="badges">
          ${analysis.competencies.map(c => `<span class="badge">${c}</span>`).join('')}
        </div>
      </div>

      <div class="section">
        <h4>💡 Sugerencias</h4>
        <ul>
          ${analysis.suggestions.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>

      ${analysis.modelAnswer ? `
        <div class="section model-answer">
          <h4>✨ Respuesta Modelo</h4>
          <p>${analysis.modelAnswer}</p>
        </div>
      ` : ''}
    </div>
  `;

  document.getElementById('analysisResult').innerHTML = resultHTML;
}
```

### Ejemplo 2: Coach Virtual Interactivo

```javascript
// Variables globales
let coachConversation = [];

async function sendMessageToCoach(userMessage) {
  // Mostrar mensaje del usuario
  addMessageToChat('user', userMessage);

  try {
    const response = await fetch('/api/mentor-coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage: userMessage,
        conversationHistory: coachConversation,
        userProfile: {
          name: currentUser.name,
          age: currentUser.age,
          situation: currentUser.situation || 'Buscando orientación'
        }
      })
    });

    const data = await response.json();

    if (data.success) {
      // Agregar mensaje del coach
      addMessageToChat('assistant', data.response);

      // Actualizar historial
      coachConversation.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: data.response }
      );
    }
  } catch (error) {
    console.error('Error con coach:', error);
    addMessageToChat('system', 'Lo siento, hubo un error. Intenta de nuevo.');
  }
}

function addMessageToChat(role, content) {
  const chatContainer = document.getElementById('coachChat');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;

  messageDiv.innerHTML = `
    <div class="message-content">
      ${role === 'assistant' ? '🤖' : '👤'} ${content}
    </div>
  `;

  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
```

### Ejemplo 3: Generar Preguntas Personalizadas

```javascript
async function generateCustomQuestions(area, level) {
  try {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobArea: area,
        difficulty: level,
        count: 5,
        userProfile: {
          name: currentUser.name,
          age: currentUser.age,
          experience: currentUser.experience
        }
      })
    });

    const data = await response.json();

    if (data.success) {
      // Reemplazar preguntas existentes con las generadas por IA
      interviewQuestions = data.questions;
      displayQuestions(interviewQuestions);
    }
  } catch (error) {
    console.error('Error generando preguntas:', error);
  }
}
```

---

## 🚀 Despliegue en Vercel

### Opción 1: Desde la Web de Vercel

1. **Sube tu código a GitHub**
   ```bash
   git add .
   git commit -m "Integración de Claude AI"
   git push origin main
   ```

2. **Importa en Vercel**
   - Ve a https://vercel.com/new
   - Selecciona tu repositorio
   - Vercel detectará automáticamente la configuración

3. **Configura Variables de Entorno**
   - En Vercel Dashboard → Settings → Environment Variables
   - Agrega: `ANTHROPIC_API_KEY` = `sk-ant-api03-xxxxx`

4. **Deploy**
   - Haz clic en "Deploy"
   - Espera 1-2 minutos
   - ¡Tu app está en línea!

### Opción 2: Desde la Terminal

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Durante el deploy, Vercel te preguntará por las variables de entorno.

---

## 💰 Costos y Límites

### Claude AI (Anthropic)

**Modelo: Claude 3.5 Sonnet** (Recomendado)

| Concepto | Precio |
|----------|--------|
| Input | $3.00 / millón de tokens |
| Output | $15.00 / millón de tokens |

**Estimación de Costos:**

- **1 análisis de entrevista** ≈ 500 tokens input + 1000 tokens output = $0.016
- **1000 análisis** ≈ $16 USD
- **Coach conversación** ≈ 300 tokens input + 500 tokens output = $0.008
- **Generación de preguntas** ≈ 400 tokens input + 800 tokens output = $0.013

**Recomendación inicial:** Carga $20 USD para empezar, te alcanzará para ~1,000-1,500 interacciones.

### Vercel

**Plan Hobby (Gratis):**
- ✅ 100GB bandwidth/mes
- ✅ Serverless Functions ilimitadas
- ✅ 100 horas de ejecución/mes
- ✅ Suficiente para 10,000+ requests/mes

**Plan Pro ($20/mes):**
- Solo necesario si superas los límites gratuitos

---

## 🎯 Mejores Prácticas

### 1. **Optimiza los Prompts**
- Sé específico en lo que pides
- Estructura clara (usa JSON cuando sea posible)
- Mantén los prompts concisos

### 2. **Caché de Respuestas**
- Guarda análisis previos en localStorage
- Evita llamadas duplicadas

### 3. **Manejo de Errores**
```javascript
try {
  const response = await fetch('/api/analyze-interview', {...});
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error desconocido');
  }

  // Procesar data...
} catch (error) {
  console.error('Error:', error);
  // Mostrar mensaje amigable al usuario
  showErrorMessage('Lo sentimos, algo salió mal. Por favor intenta de nuevo.');
}
```

### 4. **Rate Limiting**
- Implementa un delay entre requests
- Agrupa múltiples análisis si es posible

### 5. **Seguridad**
- ⚠️ **NUNCA** expongas tu API key en el frontend
- Todas las llamadas a Claude deben pasar por tu backend (/api/)
- Vercel maneja las variables de entorno de forma segura

---

## 🔒 Seguridad

### Variables de Entorno en Producción

En Vercel:
1. Dashboard → Project → Settings → Environment Variables
2. Agrega `ANTHROPIC_API_KEY`
3. Selecciona "Production, Preview, Development"
4. Save

### Validación de Requests

Agrega validación en tus APIs:

```javascript
// En cualquier API endpoint
export default async function handler(req, res) {
  // Verificar origen
  const allowedOrigins = [
    'https://tu-dominio.vercel.app',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // ... resto del código
}
```

---

## 📊 Monitoreo y Analytics

### Ver Logs en Vercel

1. Dashboard → Project → Deployments
2. Click en el deployment
3. Ver "Function Logs"

### Agregar Analytics

```javascript
// En cada API
console.log('[ANALYTICS]', {
  endpoint: '/api/analyze-interview',
  user: userProfile?.name,
  timestamp: new Date().toISOString(),
  success: true
});
```

---

## 🆘 Troubleshooting

### Error: "API key not found"
- Verifica que `.env.local` existe
- Reinicia el servidor de desarrollo
- En producción: revisa Environment Variables en Vercel

### Error: "429 Too Many Requests"
- Has excedido el rate limit de Anthropic
- Implementa retry con backoff
- Considera caché de respuestas

### Error: "Module not found: @anthropic-ai/sdk"
- Ejecuta `npm install`
- Verifica que `package.json` tiene la dependencia

---

## 🎓 Recursos Adicionales

- 📖 [Documentación Anthropic](https://docs.anthropic.com/)
- 📖 [Documentación Vercel](https://vercel.com/docs)
- 💬 [Discord de Anthropic](https://discord.gg/anthropic)
- 🎥 [Videos tutoriales Vercel](https://vercel.com/guides)

---

## ✅ Checklist de Implementación

- [ ] Cuenta en Anthropic creada
- [ ] API Key obtenida
- [ ] Cuenta en Vercel creada
- [ ] Dependencias instaladas (`npm install`)
- [ ] `.env.local` configurado
- [ ] Probado localmente (`npm run dev`)
- [ ] Código subido a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deployment exitoso
- [ ] APIs probadas en producción
- [ ] Frontend actualizado con llamadas a las APIs

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de evaluación laboral potenciado con IA de Claude.

**Próximos pasos sugeridos:**
1. Integra el análisis de IA en tu simulador de entrevistas actual
2. Agrega el coach virtual como una nueva sección
3. Implementa la generación de preguntas personalizadas
4. Considera agregar análisis de CV

¿Preguntas? ¡Consulta la documentación o contacta soporte!
