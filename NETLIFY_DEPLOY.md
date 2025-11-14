# 🚀 Guía de Despliegue en Netlify

Este documento te guiará paso a paso para desplegar tu proyecto **Sistema de Evaluación Laboral PRO** en Netlify.

## 📋 Requisitos Previos

- ✅ Cuenta en [Netlify](https://netlify.com) (gratis)
- ✅ Proyecto conectado a GitHub
- ✅ Configuración de Firebase (si usas autenticación/base de datos)

## 🎯 Método 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Conectar Netlify con GitHub

1. Ve a [app.netlify.com](https://app.netlify.com)
2. Haz clic en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub** como proveedor
4. Autoriza a Netlify para acceder a tus repositorios
5. Busca y selecciona el repositorio: `adrian-9856/Oretacion-laboral-`

### Paso 2: Configuración del Sitio

Netlify detectará automáticamente la configuración desde `netlify.toml`:

```
Build command: (vacío - es un sitio estático)
Publish directory: . (raíz del proyecto)
```

**¡No necesitas cambiar nada!** La configuración está en `netlify.toml`

### Paso 3: Variables de Entorno (Si usas Firebase)

Si tu proyecto usa Firebase, necesitas agregar las variables de entorno:

1. En el dashboard de Netlify, ve a **Site settings** → **Environment variables**
2. Agrega las siguientes variables:

```
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

💡 **Nota**: Obtén estos valores desde [Firebase Console](https://console.firebase.google.com/)

### Paso 4: Desplegar

1. Haz clic en **"Deploy site"**
2. Espera unos segundos mientras Netlify despliega tu sitio
3. ¡Listo! Tu sitio estará en línea en una URL como: `https://nombre-aleatorio-12345.netlify.app`

### Paso 5: Personalizar Dominio (Opcional)

1. Ve a **Site settings** → **Domain management**
2. Haz clic en **"Add custom domain"**
3. Sigue las instrucciones para configurar tu dominio propio

## 🎯 Método 2: Despliegue con Netlify CLI

### Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Autenticarse

```bash
netlify login
```

### Desplegar

```bash
# Desde la raíz del proyecto
netlify deploy

# Para producción
netlify deploy --prod
```

## 🔄 Despliegue Automático

Una vez configurado, **cada push a tu rama principal** desplegará automáticamente:

```bash
git add .
git commit -m "Update site"
git push origin claude/fix-code-errors-011CUroayuxoMA9nvkfwDxCG
```

Netlify detectará el cambio y desplegará automáticamente en ~30 segundos.

## 📁 Archivos de Configuración Incluidos

- ✅ `netlify.toml` - Configuración principal de Netlify
- ✅ `_headers` - Headers de seguridad HTTP
- ✅ `_redirects` - Redireccionamientos para SPA

## 🔒 Seguridad

El proyecto incluye headers de seguridad configurados:

- `X-Frame-Options: DENY` - Previene clickjacking
- `X-Content-Type-Options: nosniff` - Previene MIME sniffing
- `X-XSS-Protection` - Protección contra XSS
- `Referrer-Policy` - Control de referrer
- `Permissions-Policy` - Control de permisos del navegador

## 🐛 Solución de Problemas

### Error 404 en rutas

Si obtienes 404 al navegar, verifica que:
- El archivo `_redirects` existe
- Contiene: `/* /index.html 200`

### Problemas con Firebase

1. Verifica que las variables de entorno estén configuradas
2. Asegúrate de que el dominio de Netlify esté autorizado en Firebase Console:
   - Firebase Console → Authentication → Settings → Authorized domains
   - Agrega: `tu-sitio.netlify.app`

### Estilos o Scripts no cargan

1. Verifica que las rutas en `index.html` sean relativas:
   - ✅ `<link href="styles.css">`
   - ❌ `<link href="/styles.css">`

## 📊 Características de Netlify Incluidas

- ✅ **Deploy automático** desde GitHub
- ✅ **HTTPS automático** con certificado SSL
- ✅ **CDN global** para velocidad máxima
- ✅ **Preview deploys** para cada PR
- ✅ **Rollback instantáneo** a versiones anteriores
- ✅ **Analytics** (opcional, de pago)

## 🌐 URLs del Proyecto

- **Producción**: `https://tu-sitio.netlify.app`
- **Dashboard**: `https://app.netlify.com/sites/tu-sitio`

## 📞 Soporte

- [Documentación Netlify](https://docs.netlify.com/)
- [Netlify Community](https://answers.netlify.com/)
- [Documentación Firebase](https://firebase.google.com/docs)

---

¡Tu proyecto está listo para desplegarse en Netlify! 🎉
