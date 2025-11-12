# 🚀 Sistema de Evaluación Laboral PRO con Claude AI

Sistema completo de evaluación y orientación laboral potenciado con Inteligencia Artificial de Claude (Anthropic).

## ✨ Características

- 🎤 **Simulador de Entrevistas con IA**: Análisis avanzado de respuestas usando Claude AI
- 💬 **Coach Virtual Interactivo**: Mentor personalizado disponible 24/7
- 📊 **Análisis de Competencias**: Detección inteligente de habilidades profesionales
- ❓ **Generación de Preguntas Personalizadas**: Preguntas adaptadas al perfil del usuario
- 📄 **Análisis de CV**: Feedback detallado sobre currículums
- 🎨 **Avatar Personalizado**: Sistema de creación de avatares
- 📱 **Responsive**: Funciona en desktop y móvil

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Vercel Serverless Functions
- **IA**: Claude 3.5 Sonnet (Anthropic)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **APIs**: Web Speech API, MediaRecorder API
- **Hosting**: Vercel

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/orientacion-laboral.git
cd orientacion-laboral
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tus credenciales:

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# Firebase (opcional - para guardar datos en la nube)
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

### 5. Deploy a producción

```bash
npm run deploy
```

## 📚 Documentación

- **[Guía de Integración Claude AI](./GUIA_INTEGRACION_CLAUDE_AI.md)**: Configuración de IA
- **[Guía Completa de Firebase](./GUIA_FIREBASE.md)**: Autenticación, Base de Datos y Storage

### Guía de Firebase

Lee la [Guía Completa de Firebase](./GUIA_FIREBASE.md) para:

- ✅ Configurar autenticación de usuarios (email, Google, etc.)
- ✅ Guardar resultados de tests en Firestore
- ✅ Almacenar CVs en Firebase Storage
- ✅ Obtener historial y estadísticas
- ✅ Ejemplos de código completos
- ✅ Solución de problemas

## 🔑 Obtener API Key de Claude

1. Ve a https://console.anthropic.com/
2. Crea una cuenta
3. Ve a "API Keys"
4. Genera una nueva key
5. Carga créditos (mínimo $5 USD)

## 💡 Ejemplos de Uso

### Analizar una entrevista

```javascript
const analysis = await claudeAI.analyzeInterview(
  "¿Cómo manejas el trabajo bajo presión?",
  "Cuando tengo múltiples tareas...",
  { name: "Juan", age: 25 }
);

claudeAI.renderInterviewAnalysis('resultContainer', analysis.analysis);
```

### Chat con el coach

```javascript
const response = await claudeAI.chatWithCoach(
  "¿Cómo mejoro mi CV?",
  conversationHistory,
  userProfile
);

console.log(response.response);
```

### Generar preguntas

```javascript
const questions = await claudeAI.generateQuestions(
  "tecnología",
  "mid",
  5,
  userProfile
);

console.log(questions.questions);
```

## 📁 Estructura del Proyecto

```
├── api/
│   ├── analyze-interview.js    # Análisis de entrevistas
│   ├── generate-questions.js   # Generación de preguntas
│   ├── mentor-coach.js         # Coach virtual
│   └── analyze-cv.js           # Análisis de CV
├── firebase-config.js          # Configuración de Firebase
├── firebase-auth.js            # Autenticación de usuarios
├── firebase-db.js              # Base de datos Firestore
├── firebase-storage.js         # Almacenamiento de archivos
├── firebase-integration.js     # Integración con sistema actual
├── index.html                  # Página principal
├── script-pro.js               # Lógica principal
├── claude-ai-helper.js         # Helper para Claude AI
├── styles.css                  # Estilos
├── vercel.json                 # Configuración de Vercel
└── package.json                # Dependencias
```

## 💰 Costos Estimados

### Anthropic (Claude AI)
- ~$0.016 por análisis de entrevista
- ~$0.008 por conversación con coach
- 1000 interacciones ≈ $10-15 USD

### Vercel
- Plan Hobby: **Gratis** (suficiente para 10,000+ requests/mes)
- Plan Pro: $20/mes (solo si superas límites)

## 🔒 Seguridad

- ✅ API keys nunca expuestas en el frontend
- ✅ Todas las llamadas pasan por backend seguro
- ✅ Variables de entorno protegidas en Vercel
- ✅ CORS configurado correctamente

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

¿Problemas? Consulta:

- [Guía de Integración](./GUIA_INTEGRACION_CLAUDE_AI.md)
- [Documentación Anthropic](https://docs.anthropic.com/)
- [Documentación Vercel](https://vercel.com/docs)

## ⭐ Roadmap

- [ ] App móvil nativa
- [ ] Integración con LinkedIn
- [ ] Análisis de vídeo entrevistas
- [ ] Modo multiplayer (entrevistas en grupo)
- [ ] Dashboard de analytics
- [ ] API pública

## 🙏 Agradecimientos

- [Anthropic](https://www.anthropic.com/) por Claude AI
- [Vercel](https://vercel.com/) por el hosting
- Comunidad open source

---

Hecho con ❤️ usando Claude AI