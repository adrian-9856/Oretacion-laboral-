# 🔧 Configuración de API Claude AI para Mentor Virtual

## ✅ Ya Configurado Localmente

Tu API key de Anthropic ya está configurada en el archivo `.env.local` para desarrollo local:

```
ANTHROPIC_API_KEY=sk-ant-api03-ly9M71V3L0...(ver archivo .env.local)
```

**✨ Esto significa que el Mentor Virtual funcionará cuando ejecutes el proyecto localmente.**

**IMPORTANTE**: El archivo `.env.local` contiene tu API key completa y NO se sube a GitHub por seguridad (está en `.gitignore`).

---

## 🚀 Para que Funcione en Producción (Vercel)

Si tu aplicación está desplegada en Vercel, necesitas configurar la API key ahí también:

### Método 1: Desde el Dashboard de Vercel (Recomendado)

1. **Ve a tu proyecto en Vercel**
   - Entra a: https://vercel.com/dashboard
   - Selecciona tu proyecto: `Oretacion-laboral-`

2. **Configurar Variable de Entorno**
   - Click en **Settings** (Configuración)
   - En el menú lateral: **Environment Variables**
   - Click en **Add New**

3. **Agregar la API Key**
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: (Copia el valor completo del archivo `.env.local`)
   - **Environments**: Selecciona:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
   - Click en **Save**

   💡 **Dónde encontrar la API key**: Abre el archivo `.env.local` y copia el valor completo después de `ANTHROPIC_API_KEY=`

4. **Re-deploy**
   - Ve a la pestaña **Deployments**
   - Click en los tres puntos (...) del último deployment
   - Click en **Redeploy**
   - Espera 1-2 minutos

---

### Método 2: Desde la Terminal (Alternativo)

Si prefieres usar la terminal:

```bash
# Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# Login en Vercel
vercel login

# Configurar variable de entorno
vercel env add ANTHROPIC_API_KEY

# Cuando te pregunte:
# - Value: pega tu API key
# - Environments: selecciona Production, Preview, Development

# Re-deploy
vercel --prod
```

---

## 🧪 Probar que Funciona

### Localmente

1. Ejecuta el servidor local:
   ```bash
   npm run dev
   ```

2. Abre: http://localhost:3000

3. Haz click en el botón **"Mentor Virtual"** en la pantalla principal

4. Si funciona, deberías poder chatear con el mentor

### En Producción

1. Ve a tu URL de Vercel (ej: `https://tu-proyecto.vercel.app`)

2. Click en **"Mentor Virtual"**

3. Prueba enviando un mensaje como: *"Necesito ayuda para preparar una entrevista"*

4. El mentor debería responderte en segundos

---

## 🔍 Verificar si Está Configurado Correctamente

### Desde Vercel Dashboard

1. Ve a: **Settings → Environment Variables**
2. Deberías ver: `ANTHROPIC_API_KEY` con el valor `sk-ant-api03-...` (oculto)

### Desde la Terminal

```bash
vercel env ls
```

Deberías ver algo como:

```
Environment Variables:
┌─────────────────────┬──────────────────┬────────────┐
│ Name                │ Value            │ Environments│
├─────────────────────┼──────────────────┼────────────┤
│ ANTHROPIC_API_KEY   │ sk-ant-api03-... │ Production │
│                     │                  │ Preview    │
│                     │                  │ Development│
└─────────────────────┴──────────────────┴────────────┘
```

---

## ❌ Solución de Problemas

### Error: "ANTHROPIC_API_KEY is not defined"

**Causa**: La variable de entorno no está configurada en Vercel

**Solución**:
1. Sigue los pasos de "Método 1" arriba
2. Asegúrate de hacer **Redeploy** después de agregar la variable

### Error: "401 Unauthorized" o "Invalid API key"

**Causa**: La API key es incorrecta o expiró

**Solución**:
1. Verifica que la API key sea la correcta en: https://console.anthropic.com/
2. Si es necesario, genera una nueva API key
3. Actualiza el valor en Vercel: **Settings → Environment Variables → Edit**

### Error: "429 Too Many Requests"

**Causa**: Has excedido el límite de requests de tu plan de Anthropic

**Solución**:
1. Ve a: https://console.anthropic.com/settings/usage
2. Verifica tu plan y límites
3. Si necesitas más, actualiza tu plan o espera a que se renueve

### El mentor no responde / tarda mucho

**Causa**: Puede ser conexión lenta o problemas con la API

**Solución**:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Network**
3. Busca requests a `/api/mentor-coach`
4. Verifica el status code y la respuesta

---

## 📊 Costos de la API

**Modelo**: Claude 3.5 Sonnet (el más avanzado)

**Precios aproximados**:
- **Input**: $3 USD por millón de tokens (~750,000 palabras)
- **Output**: $15 USD por millón de tokens (~750,000 palabras)

**Ejemplo de uso**:
- 1 conversación con el mentor (~500 palabras) = **$0.01 USD**
- 100 conversaciones = **$1 USD**
- 1000 conversaciones = **$10 USD**

**Recomendación**: Monitorea tu uso en: https://console.anthropic.com/settings/usage

---

## 📚 APIs Disponibles

Tu aplicación tiene 4 endpoints de Claude AI:

### 1. `/api/mentor-coach` (Mentor Virtual)
Chatbot conversacional para mentoría profesional

### 2. `/api/analyze-interview`
Analiza respuestas de entrevistas y da feedback

### 3. `/api/generate-questions`
Genera preguntas personalizadas según industria/nivel

### 4. `/api/analyze-cv`
Analiza un CV y da recomendaciones

**Todas usan la misma API key** configurada en `ANTHROPIC_API_KEY`.

---

## ✅ Checklist de Configuración

- [x] API key configurada en `.env.local` (local)
- [ ] API key configurada en Vercel (producción)
- [ ] Re-deploy realizado
- [ ] Probado localmente
- [ ] Probado en producción

---

## 🆘 Soporte

Si tienes problemas:

1. **Documentación de Anthropic**: https://docs.anthropic.com/
2. **Console de Anthropic**: https://console.anthropic.com/
3. **Vercel Docs**: https://vercel.com/docs/environment-variables

---

**Fecha de configuración**: 2025-11-18
**Configurado por**: Claude Code Assistant
