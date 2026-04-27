require('dotenv').config(); // 0. CARGAR VARIABLES DE ENTORNO AL INICIO
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
// Configuración de CORS
app.use(cors({
  origin: [
    "http://localhost:3000", // Para seguir probando en local
    "https://pro-active-beta.vercel.app" // TU DOMINIO REAL DE VERCEL
  ],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

// 1. INICIALIZACIÓN DE FIREBASE DINÁMICA
// Ya no usamos require('./serviceAccountKey.json')
// Reemplaza tu bloque de serviceAccount con este:
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Esta limpieza elimina comillas accidentales y arregla los saltos de línea
  privateKey: process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') 
    : undefined,
};

// Verificación rápida antes de inicializar
if (!serviceAccount.privateKey || !serviceAccount.projectId) {
    console.error("❌ ERROR: Faltan variables de entorno de Firebase.");
    process.exit(1); 
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Verificación de conexión mejorada
try {
  if (db) {
    console.log("✅ Conexión exitosa a Firebase Firestore (Admin SDK)");
  }
} catch (error) {
  console.error("❌ Error al conectar con Firebase:", error);
}

// 2. IMPORTACIÓN DE RUTAS (Sin cambios aquí)
const tasksRoutes = require('./src/routes/taskRoutes');
const calendarRoutes = require('./src/routes/calendarRoutes'); 
const notesRoutes = require('./src/routes/notesRoutes');
const remindersRoutes = require('./src/routes/remindersRoutes');
const goalsRoutes = require('./src/routes/goalsRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const teamsRoutes = require('./src/routes/teamsRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const authRoutes = require("./src/routes/authRoutes");

// 3. MIDDLEWARES
// Tip: Cuando tengas tu URL de Vercel/Netlify, agrégala aquí
app.use(cors()); 
app.use(express.json());

// 4. DEFINICIÓN DE RUTAS (Endpoints)
app.use('/api/tasks', tasksRoutes);
app.use('/api/calendar', calendarRoutes); 
app.use('/api/notes', notesRoutes);
app.use('/api/premium', statsRoutes);
app.use('/api/premium', remindersRoutes);
app.use('/api/premium', goalsRoutes);
app.use('/api/business', teamsRoutes);
app.use('/api/business', activityRoutes);
app.use('/api/business/reports', reportRoutes);
app.use('/api/auth', authRoutes);

// 5. ENCENDIDO DEL SERVIDOR
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Servidor ProActive en puerto: ${PORT}`);
  console.log(`📡 Entorno: ${process.env.NODE_ENV || 'desarrollo'}`);
  console.log(`=========================================`);
});