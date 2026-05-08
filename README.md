# 🔥 Retos 2026 — Guía de instalación

## Pasos para tener el sitio listo en ~15 minutos

---

## PASO 1: Crear base de datos en Firebase (gratis)

1. Ve a **console.firebase.google.com** e inicia sesión con tu cuenta Google
2. Clic en **"Agregar proyecto"**
   - Nombre: `retos2026` (o el que quieras)
   - Desactiva Google Analytics (no es necesario)
   - Clic en **"Crear proyecto"**
3. En el menú izquierdo, clic en **"Realtime Database"**
4. Clic en **"Crear base de datos"**
   - Elige la región más cercana (ej. `us-central1`)
   - En las reglas, selecciona **"Modo de prueba"** (lo ajustamos después)
5. En el menú izquierdo, clic en ⚙️ **"Configuración del proyecto"**
6. Baja hasta **"Tus apps"** → clic en el ícono `</>` (Web)
   - Nombre de la app: `retos2026-web`
   - Clic en **"Registrar app"**
7. Copia el objeto `firebaseConfig` que aparece. Se ve así:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "retos2026.firebaseapp.com",
     databaseURL: "https://retos2026-default-rtdb.firebaseio.com",
     projectId: "retos2026",
     storageBucket: "retos2026.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

8. Abre el archivo `src/firebase.js` y **reemplaza** los valores de `firebaseConfig` con los tuyos.

---

## PASO 2: Ajustar las reglas de Firebase (importante)

En Firebase Console → Realtime Database → **Reglas**, pega esto y publica:

```json
{
  "rules": {
    "activities": {
      ".read": true,
      ".write": true
    }
  }
}
```

> Esto permite que todos en el grupo lean y escriban. Es suficiente para uso privado entre amigos.

---

## PASO 3: Subir a Vercel (gratis, tarda 2 minutos)

### Opción A: Desde GitHub (recomendado)

1. Crea una cuenta en **github.com** si no tienes
2. Crea un repo nuevo llamado `retos2026`
3. Sube todos estos archivos al repo
4. Ve a **vercel.com** → "Add New Project" → conecta tu GitHub
5. Selecciona el repo `retos2026`
6. Vercel detecta automáticamente que es React → clic en **"Deploy"**
7. En ~2 minutos tendrás una URL tipo: `retos2026.vercel.app`

### Opción B: Con Vercel CLI (si tienes Node.js)

```bash
npm install -g vercel
cd retos2026
npm install
vercel --prod
```

---

## PASO 4: Compartir con el grupo

Manda la URL en el grupo de WhatsApp. Cada quien:
1. Abre el link en su celular
2. Toca **"¿Quién soy?"** y selecciona su nombre
3. Va a ✍️ para registrar actividades diarias
4. Ve en 📊 cómo avanzan todos en tiempo real

---

## Estructura de archivos

```
retos2026/
├── public/
│   └── index.html
├── src/
│   ├── App.js          ← app principal
│   ├── firebase.js     ← ⚠️ aquí van TUS claves de Firebase
│   └── index.js
├── package.json
└── README.md           ← este archivo
```

---

## ¿Necesitas ayuda?

Si algo no funciona, el error más común es que `databaseURL` en `firebase.js` no coincide exactamente con el que te da Firebase (incluyendo `-default-rtdb`).
