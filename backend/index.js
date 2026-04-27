require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();

// 1. CONFIGURACIÓN DE CORS (Única y centralizada)
app.use(cors({
  origin: true, // Esto refleja el origen de la petición, sea cual sea
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Responder 200 OK a todas las peticiones OPTIONS (Preflight)
app.options('/:any*', cors());

app.use(express.json()); // Middleware para parsear JSON

// 2. INICIALIZACIÓN DE FIREBASE
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') 
    : undefined,
};

if (!serviceAccount.privateKey || !serviceAccount.projectId) {
    console.error("❌ ERROR: Faltan variables de entorno de Firebase.");
    process.exit(1); 
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
console.log("✅ Conexión exitosa a Firebase Firestore");

// 3. IMPORTACIÓN DE RUTAS
const authRoutes = require("./src/routes/authRoutes");
const tasksRoutes = require('./src/routes/taskRoutes');
const calendarRoutes = require('./src/routes/calendarRoutes'); 
const notesRoutes = require('./src/routes/notesRoutes');
const remindersRoutes = require('./src/routes/remindersRoutes');
const goalsRoutes = require('./src/routes/goalsRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const teamsRoutes = require('./src/routes/teamsRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

// 4. DEFINICIÓN DE RUTAS (Estandarizadas con /api)
// Nota: He ajustado los prefijos para que no haya colisiones
app.use('/api/auth', authRoutes);         // -> /api/auth/login
app.use('/api/tasks', tasksRoutes);
app.use('/api/calendar', calendarRoutes); 
app.use('/api/notes', notesRoutes);

// Rutas Premium
app.use('/api/premium/stats', statsRoutes);
app.use('/api/premium/reminders', remindersRoutes);
app.use('/api/premium/goals', goalsRoutes);

// Rutas Business
app.use('/api/business/teams', teamsRoutes);
app.use('/api/business/activities', activityRoutes);
app.use('/api/business/reports', reportRoutes);

// 5. RUTA DE PRUEBA (Para verificar si el backend responde en Render)
app.get('/', (req, res) => res.send("🚀 ProActive API Online"));

// 6. ENCENDIDO DEL SERVIDOR
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`🚀 Servidor ProActive en puerto: ${PORT}`);
  console.log(`📡 API Base URL: /api`);
  console.log(`=========================================`);
});