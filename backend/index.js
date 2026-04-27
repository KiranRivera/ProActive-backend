const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();

// 1. INICIALIZACIÓN DE FIREBASE (Debe ir antes que las rutas)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Verificación de conexión en la terminal
if (db) {
    console.log("✅ Conexión exitosa a Firebase Firestore");
}

// 2. IMPORTACIÓN DE RUTAS
// Las importamos después de inicializar Firebase para que los controladores no fallen
const tasksRoutes = require('./src/routes/taskRoutes');
const calendarRoutes = require('./src/routes/calendarRoutes'); 
const notesRoutes = require('./src/routes/notesRoutes');
const remindersRoutes = require('./src/routes/remindersRoutes');
const goalsRoutes = require('./src/routes/goalsRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const teamsRoutes = require('./src/routes/teamsRoutes');

// 3. MIDDLEWARES
app.use(cors());
app.use(express.json()); // Permite leer el cuerpo de las peticiones POST

// 4. DEFINICIÓN DE RUTAS (Endpoints)
// Conecta el módulo de tareas
app.use('/api/tasks', tasksRoutes);
app.use('/api/calendar', calendarRoutes); 
app.use('/api/notes', notesRoutes);

app.use('/api/premium', statsRoutes);
app.use('/api/premium', remindersRoutes);
app.use('/api/premium', goalsRoutes);

app.use('/api/business', teamsRoutes);




// 5. ENCENDIDO DEL SERVIDOR
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Servidor ProActive: http://localhost:${PORT}`);
  console.log(`📌 Rutas de tareas: http://localhost:${PORT}/api/tasks`);
  console.log(`=========================================`);
});