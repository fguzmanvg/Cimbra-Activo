// src/firebase.js
// ⚠️  REEMPLAZA ESTOS VALORES con los de tu proyecto Firebase
// Ve a: console.firebase.google.com → Tu proyecto → ⚙️ Configuración → Tus apps → SDK

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBLSXvfqXTtcYipuh7dSLQoy6Sb8YVQc38",
  authDomain: "cimbra-activo.firebaseapp.com",
  databaseURL: "https://cimbra-activo-default-rtdb.firebaseio.com",
  projectId: "cimbra-activo",
  storageBucket: "cimbra-activo.firebasestorage.app",
  messagingSenderId: "724321167596",
  appId: "1:724321167596:web:d312fb307ab0d7215addc9"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
