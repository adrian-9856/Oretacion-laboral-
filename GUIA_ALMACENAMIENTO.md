# 💾 Guía Completa de Almacenamiento - Gratis y de Pago

## 📋 Índice
1. [Estado Actual](#estado-actual)
2. [Opciones GRATUITAS](#opciones-gratuitas)
3. [Opciones DE PAGO](#opciones-de-pago)
4. [Comparación Completa](#comparación-completa)
5. [Plan de Migración](#plan-de-migración)
6. [Implementación Paso a Paso](#implementación-paso-a-paso)

---

## 🔍 Estado Actual

### Tu Sistema Actual
- **Almacenamiento:** LocalStorage (navegador)
- **Capacidad:** ~5-10 MB por dominio
- **Persistencia:** Solo en el navegador del usuario
- **Problemas:**
  - ❌ Si borran caché, pierden todo
  - ❌ No pueden acceder desde otro dispositivo
  - ❌ No hay backup automático
  - ❌ No pueden compartir datos entre usuarios

### ✅ Ventajas Actuales
- Funciona sin internet
- Totalmente gratis
- Sin configuración
- Privacidad máxima

---

## 🆓 OPCIONES GRATUITAS

### 1. 🔥 Firebase (Google) - RECOMENDADO PARA EMPEZAR

#### ¿Qué es?
Base de datos en tiempo real de Google, perfecta para tu aplicación.

#### Plan Gratis (Spark)
```
✅ 1 GB de almacenamiento
✅ 10 GB de transferencia/mes
✅ 50,000 lecturas/día
✅ 20,000 escrituras/día
✅ Autenticación incluida
✅ Hosting gratis
```

#### ¿Cuánto puedes guardar GRATIS?
- **~10,000 usuarios** con datos completos
- **~100,000 registros** de tests
- **Rachas ilimitadas**
- **Emails de todos los usuarios**

#### Cuándo pagas
Solo si pasas de:
- 1 GB de datos
- 10 GB de tráfico/mes
- 50k lecturas o 20k escrituras diarias

**Costo:** $0.18 por GB adicional

#### Ventajas
✅ Fácil de integrar
✅ Base de datos en tiempo real
✅ Autenticación incluida (email, Google, etc.)
✅ Hosting gratis incluido
✅ Documentación excelente en español
✅ Dashboard visual

#### Desventajas
⚠️ Requiere aprender Firebase
⚠️ Dependes de Google
⚠️ Curva de aprendizaje inicial

#### Cómo empezar
```bash
1. Ve a: https://firebase.google.com
2. Crea un proyecto gratis
3. Activa Firestore Database
4. Activa Authentication
5. Obtén tu config
```

#### Código de ejemplo
```javascript
// 1. Instalar Firebase
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"></script>

// 2. Configurar
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 3. Guardar usuario
async function guardarUsuario(email, nombre, datos) {
  await db.collection('usuarios').doc(email).set({
    nombre: nombre,
    email: email,
    fechaRegistro: new Date(),
    racha: datos.streak,
    xp: datos.xp,
    nivel: datos.level,
    ultimoAcceso: new Date()
  });
}

// 4. Leer usuario
async function obtenerUsuario(email) {
  const doc = await db.collection('usuarios').doc(email).get();
  if (doc.exists) {
    return doc.data();
  } else {
    return null;
  }
}

// 5. Guardar resultado de test
async function guardarResultadoTest(email, resultado) {
  await db.collection('resultados').add({
    email: email,
    tipo: resultado.tipo,
    puntaje: resultado.puntaje,
    fecha: new Date(),
    duracion: resultado.duracion
  });
}
```

---

### 2. 🟢 Supabase - ALTERNATIVA MODERNA

#### ¿Qué es?
Alternativa open-source a Firebase, usa PostgreSQL.

#### Plan Gratis
```
✅ 500 MB de base de datos
✅ 1 GB de almacenamiento de archivos
✅ 2 GB de transferencia/mes
✅ 50,000 usuarios activos/mes
✅ Autenticación incluida
✅ API REST automática
```

#### ¿Cuánto puedes guardar GRATIS?
- **~5,000 usuarios** con datos completos
- **~50,000 registros** de tests
- **Rachas ilimitadas**

#### Cuándo pagas
Plan Pro: $25/mes para más recursos

#### Ventajas
✅ Base de datos SQL (más familiar)
✅ Open source
✅ API REST automática
✅ Dashboard potente
✅ Triggers y funciones SQL

#### Desventajas
⚠️ Límite de 500 MB en plan gratis
⚠️ No tan conocido como Firebase

#### Cómo empezar
```bash
1. Ve a: https://supabase.com
2. Crea proyecto gratis
3. Obtén tu URL y API Key
```

#### Código de ejemplo
```javascript
// 1. Instalar Supabase
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// 2. Configurar
const supabase = window.supabase.createClient(
  'https://tu-proyecto.supabase.co',
  'TU_ANON_KEY'
);

// 3. Guardar usuario
async function guardarUsuario(email, nombre, datos) {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([
      {
        email: email,
        nombre: nombre,
        racha: datos.streak,
        xp: datos.xp,
        nivel: datos.level,
        fecha_registro: new Date()
      }
    ]);

  if (error) console.error(error);
  return data;
}

// 4. Leer usuario
async function obtenerUsuario(email) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  return data;
}
```

---

### 3. 🍃 MongoDB Atlas - PARA EXPERTOS

#### ¿Qué es?
Base de datos NoSQL profesional en la nube.

#### Plan Gratis (M0)
```
✅ 512 MB de almacenamiento
✅ Compartido entre 3 servidores
✅ Sin límite de conexiones
✅ Backups manuales
```

#### ¿Cuánto puedes guardar GRATIS?
- **~2,500 usuarios**
- **~25,000 registros**

#### Cuándo pagas
Plan M10: $57/mes para servidor dedicado

#### Ventajas
✅ NoSQL flexible
✅ MongoDB es muy usado
✅ Escalable profesional
✅ Agregaciones potentes

#### Desventajas
⚠️ Más complejo de aprender
⚠️ Necesitas backend (Node.js, etc.)
⚠️ No tiene autenticación incluida

---

### 4. 📱 Back4App - MÁS FÁCIL

#### ¿Qué es?
Backend as a Service basado en Parse.

#### Plan Gratis
```
✅ 25,000 requests/mes
✅ 250 MB de base de datos
✅ Autenticación incluida
✅ API REST automática
```

#### Ventajas
✅ Muy fácil de usar
✅ Dashboard visual simple
✅ Perfecto para prototipos

#### Desventajas
⚠️ Límite bajo (25k requests/mes)
⚠️ Menos conocido

---

### 5. 🐘 ElephantSQL - POSTGRESQL GRATIS

#### Plan Gratis (Tiny Turtle)
```
✅ 20 MB de almacenamiento
✅ 5 conexiones concurrentes
✅ PostgreSQL completo
```

#### Ventajas
✅ PostgreSQL puro
✅ SQL tradicional
✅ Bueno para aprender

#### Desventajas
⚠️ Solo 20 MB
⚠️ Necesitas backend

---

## 💰 OPCIONES DE PAGO

### 1. 🔥 Firebase (Blaze Plan) - RECOMENDADO

#### Precio
**Pay as you go** (pagas lo que usas)
```
Firestore:
- $0.18 por GB almacenado/mes
- $0.06 por 100,000 lecturas
- $0.18 por 100,000 escrituras

Ejemplo con 50,000 usuarios:
- 5 GB datos: $0.90/mes
- 500k lecturas: $3/mes
- 100k escrituras: $0.18/mes
TOTAL: ~$5-10/mes
```

#### Cuándo elegir
- ✅ Cuando pases el plan gratis
- ✅ Necesites tiempo real
- ✅ Quieras escalabilidad automática

---

### 2. 🟢 Supabase Pro

#### Precio
**$25/mes** fijo
```
✅ 8 GB de base de datos
✅ 100 GB de transferencia
✅ 100,000 usuarios activos
✅ Backups diarios
✅ Soporte prioritario
```

#### Cuándo elegir
- ✅ Prefieres SQL
- ✅ Quieres precio fijo
- ✅ Necesitas más control

---

### 3. ☁️ AWS (Amazon Web Services)

#### Servicios
- **DynamoDB** (NoSQL)
- **RDS** (SQL)
- **S3** (archivos)

#### Precio Ejemplo
```
DynamoDB bajo demanda:
- $1.25 por millón de escrituras
- $0.25 por millón de lecturas
- $0.25 por GB/mes

Para 10,000 usuarios:
~$10-20/mes
```

#### Cuándo elegir
- ✅ Proyecto profesional grande
- ✅ Necesitas control total
- ✅ Tienes presupuesto

---

### 4. 🚂 Railway

#### Precio
**$5/mes** por servicio
```
✅ PostgreSQL incluido
✅ Deploy automático
✅ $5 crédito gratis/mes
✅ Hosting backend + DB
```

#### Cuándo elegir
- ✅ Quieres todo en uno
- ✅ Necesitas backend también
- ✅ Precio predecible

---

### 5. 🎨 Vercel + Vercel Postgres

#### Precio
```
Hobby (gratis):
- Hosting ilimitado
- Sin DB incluida

Pro ($20/mes):
- Vercel Postgres incluido
- 256 MB DB
- 1 GB transferencia
```

---

## 📊 COMPARACIÓN COMPLETA

| Opción | Plan Gratis | Usuarios Gratis | Precio Pagado | Dificultad | Recomendado Para |
|--------|-------------|-----------------|---------------|------------|------------------|
| **Firebase** | ✅ Generoso | ~10,000 | $5-20/mes | ⭐⭐ Media | **Principiantes/Medianos** |
| **Supabase** | ✅ Bueno | ~5,000 | $25/mes fijo | ⭐⭐ Media | **Desarrolladores SQL** |
| **MongoDB Atlas** | ⚠️ Limitado | ~2,500 | $57/mes | ⭐⭐⭐ Alta | **Expertos** |
| **Back4App** | ⚠️ Muy limitado | ~1,000 | $5/mes | ⭐ Fácil | **Prototipos rápidos** |
| **Railway** | ✅ $5 crédito | Variable | $5/mes | ⭐⭐ Media | **Todo en uno** |
| **AWS** | ⚠️ Complejo | Variable | $10-50/mes | ⭐⭐⭐⭐ Muy Alta | **Empresas** |

---

## 🎯 MI RECOMENDACIÓN

### PARA EMPEZAR (Ahora - Gratis)
**🔥 Firebase Plan Spark (Gratis)**

**Por qué:**
1. ✅ 10,000 usuarios gratis
2. ✅ Muy fácil de integrar
3. ✅ Autenticación incluida
4. ✅ No necesitas backend
5. ✅ Documentación excelente
6. ✅ Dashboard visual
7. ✅ Hosting incluido

**Puedes crecer hasta 10,000 usuarios sin pagar nada.**

---

### PARA CRECER (6-12 meses - Pago)
**🔥 Firebase Plan Blaze (Pay as you go)**

**Por qué:**
1. ✅ Solo pagas lo que usas
2. ✅ Con 50,000 usuarios: ~$15/mes
3. ✅ Con 100,000 usuarios: ~$30/mes
4. ✅ Escalabilidad automática
5. ✅ Sin cambios de código

---

## 📋 PLAN DE MIGRACIÓN

### Fase 1: PREPARACIÓN (Esta semana)
```javascript
// 1. Crear capa de abstracción
class DataService {
    async guardarUsuario(usuario) {
        // Ahora: LocalStorage
        localStorage.setItem('user', JSON.stringify(usuario));

        // Después: Firebase
        // await firebase.guardarUsuario(usuario);
    }

    async obtenerUsuario(email) {
        // Ahora: LocalStorage
        return JSON.parse(localStorage.getItem('user'));

        // Después: Firebase
        // return await firebase.obtenerUsuario(email);
    }
}

const dataService = new DataService();
```

### Fase 2: CONFIGURAR FIREBASE (1-2 días)
1. Crear proyecto en Firebase
2. Obtener credenciales
3. Agregar scripts a index.html
4. Configurar reglas de seguridad

### Fase 3: MIGRACIÓN GRADUAL (1 semana)
1. **Día 1-2:** Migrar autenticación
2. **Día 3-4:** Migrar usuarios y rachas
3. **Día 5-6:** Migrar resultados de tests
4. **Día 7:** Probar y lanzar

### Fase 4: MANTENER AMBOS (Opcional)
```javascript
// Guardar en ambos lados durante transición
async guardarUsuario(usuario) {
    // LocalStorage (backup)
    localStorage.setItem('user', JSON.stringify(usuario));

    // Firebase (principal)
    try {
        await firebase.guardarUsuario(usuario);
    } catch (error) {
        console.error('Error Firebase:', error);
        // Si falla Firebase, al menos tienes LocalStorage
    }
}
```

---

## 💻 IMPLEMENTACIÓN PASO A PASO

### OPCIÓN 1: Firebase (RECOMENDADO)

#### Paso 1: Crear Proyecto
```
1. Ve a https://console.firebase.google.com
2. Clic en "Agregar proyecto"
3. Nombre: "Orientacion-Laboral"
4. Desactiva Google Analytics (opcional)
5. Crear proyecto
```

#### Paso 2: Configurar Firestore
```
1. En el menú, clic en "Firestore Database"
2. Clic en "Crear base de datos"
3. Selecciona "Empezar en modo de prueba"
4. Ubicación: "us-central" (o la más cercana)
5. Habilitar
```

#### Paso 3: Obtener Credenciales
```
1. Clic en ⚙️ (Configuración del proyecto)
2. Desplázate a "Tus apps"
3. Clic en el icono </> (Web)
4. Registra la app: "Orientacion-Laboral-Web"
5. COPIA el código firebaseConfig
```

#### Paso 4: Agregar a tu Proyecto
```html
<!-- En index.html, antes de </body> -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>

<script>
// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123..."
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
</script>

<!-- Tu script-pro.js -->
<script src="script-pro.js"></script>
```

#### Paso 5: Crear Funciones de Base de Datos
Crea un archivo `firebase-service.js`:

```javascript
// ========================================
// FIREBASE SERVICE - Abstracción de datos
// ========================================

const FirebaseService = {
    // USUARIOS
    async registrarUsuario(email, password, nombre, area) {
        try {
            // 1. Crear autenticación
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // 2. Guardar datos en Firestore
            await db.collection('usuarios').doc(user.uid).set({
                email: email,
                nombre: nombre,
                area: area,
                fechaRegistro: firebase.firestore.FieldValue.serverTimestamp(),
                racha: 0,
                xp: 0,
                nivel: 1,
                ultimoAcceso: firebase.firestore.FieldValue.serverTimestamp()
            });

            return { success: true, uid: user.uid };
        } catch (error) {
            console.error('Error al registrar:', error);
            return { success: false, error: error.message };
        }
    },

    async iniciarSesion(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Actualizar último acceso
            await db.collection('usuarios').doc(user.uid).update({
                ultimoAcceso: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Obtener datos del usuario
            const userData = await this.obtenerUsuario(user.uid);
            return { success: true, user: userData };
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return { success: false, error: error.message };
        }
    },

    async obtenerUsuario(uid) {
        try {
            const doc = await db.collection('usuarios').doc(uid).get();
            if (doc.exists) {
                return { uid: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    },

    // RACHAS
    async actualizarRacha(uid, nuevaRacha) {
        try {
            await db.collection('usuarios').doc(uid).update({
                racha: nuevaRacha,
                ultimoAcceso: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Error al actualizar racha:', error);
            return { success: false, error: error.message };
        }
    },

    // RESULTADOS DE TESTS
    async guardarResultadoTest(uid, resultado) {
        try {
            await db.collection('resultados').add({
                uid: uid,
                tipo: resultado.tipo,
                puntaje: resultado.puntaje,
                fecha: firebase.firestore.FieldValue.serverTimestamp(),
                duracion: resultado.duracion,
                respuestas: resultado.respuestas || []
            });
            return { success: true };
        } catch (error) {
            console.error('Error al guardar resultado:', error);
            return { success: false, error: error.message };
        }
    },

    async obtenerResultadosUsuario(uid, limite = 10) {
        try {
            const snapshot = await db.collection('resultados')
                .where('uid', '==', uid)
                .orderBy('fecha', 'desc')
                .limit(limite)
                .get();

            const resultados = [];
            snapshot.forEach(doc => {
                resultados.push({ id: doc.id, ...doc.data() });
            });

            return resultados;
        } catch (error) {
            console.error('Error al obtener resultados:', error);
            return [];
        }
    },

    // XP Y NIVEL
    async actualizarXPyNivel(uid, xp, nivel) {
        try {
            await db.collection('usuarios').doc(uid).update({
                xp: xp,
                nivel: nivel
            });
            return { success: true };
        } catch (error) {
            console.error('Error al actualizar XP:', error);
            return { success: false, error: error.message };
        }
    },

    // EMAILS (Para notificaciones futuras)
    async guardarEmailParaNotificaciones(email, nombre) {
        try {
            await db.collection('emails_notificaciones').add({
                email: email,
                nombre: nombre,
                fechaSuscripcion: firebase.firestore.FieldValue.serverTimestamp(),
                activo: true
            });
            return { success: true };
        } catch (error) {
            console.error('Error al guardar email:', error);
            return { success: false, error: error.message };
        }
    }
};

// Exportar para uso global
window.FirebaseService = FirebaseService;
```

#### Paso 6: Configurar Reglas de Seguridad
En Firebase Console > Firestore Database > Reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir sus propios datos
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Resultados de tests
    match /resultados/{resultId} {
      allow read: if request.auth != null && resource.data.uid == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
    }

    // Emails de notificaciones (solo crear)
    match /emails_notificaciones/{emailId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

---

## 📊 SISTEMA DE GUARDADO DE EMAILS

Ya incluí en el código arriba la función `guardarEmailParaNotificaciones`.

### Cómo usar:
```javascript
// Al registrarse
await FirebaseService.guardarEmailParaNotificaciones(
    user.email,
    user.nombre
);

// Recuperar todos los emails (solo admin)
async function obtenerTodosLosEmails() {
    const snapshot = await db.collection('emails_notificaciones')
        .where('activo', '==', true)
        .get();

    const emails = [];
    snapshot.forEach(doc => {
        emails.push(doc.data().email);
    });

    return emails;
}
```

---

## ⏰ CRONOGRAMA REALISTA

### Semana 1: Preparación
- Día 1-2: Crear proyecto Firebase
- Día 3-4: Integrar scripts y configurar
- Día 5-7: Crear funciones básicas

### Semana 2: Migración
- Día 1-2: Migrar autenticación
- Día 3-4: Migrar datos de usuarios
- Día 5-7: Probar todo

### Semana 3: Lanzamiento
- Día 1-3: Mantener ambos sistemas (LocalStorage + Firebase)
- Día 4-5: Monitorear errores
- Día 6-7: Eliminar LocalStorage (opcional)

---

## 💡 CONSEJOS FINALES

### Para Mantenerte en Plan Gratis
1. ✅ Usa caché local (LocalStorage + Firebase)
2. ✅ No leas datos innecesariamente
3. ✅ Agrupa operaciones (batch writes)
4. ✅ Usa límites en queries

### Para Crecer a Pago
1. ✅ Monitorea uso en Firebase Console
2. ✅ Configura alertas de presupuesto
3. ✅ Empieza en Blaze cuando llegues a 8,000 usuarios
4. ✅ Considera Supabase Pro si prefieres precio fijo

---

## 🎓 RECURSOS DE APRENDIZAJE

### Firebase
- Documentación oficial: https://firebase.google.com/docs
- YouTube: "Firebase para principiantes" (Fazt Code)
- Curso gratis: https://firebase.google.com/codelabs

### Supabase
- Documentación: https://supabase.com/docs
- YouTube: "Supabase crash course"

---

**¿Necesitas ayuda para implementar Firebase? ¡Avísame y te ayudo paso a paso!**
