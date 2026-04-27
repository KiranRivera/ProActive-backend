const admin = require('firebase-admin');

const getUserStats = async (req, res) => {
  try {
    const db = admin.firestore();
    // Limpieza de ID siguiendo tu estándar de seguridad
    const userId = req.params.userId.trim();

    // Consultas en paralelo para optimizar la velocidad del Dashboard
    const [tasksSnap, notesSnap, remindersSnap] = await Promise.all([
      db.collection('Usuarios').doc(userId).collection('Tareas').get(),
      db.collection('Usuarios').doc(userId).collection('Notas').get(),
      db.collection('Usuarios').doc(userId).collection('Recordatorios').get(),
    ]);

    // --- LÓGICA PARA GRÁFICA DE DONA (Tareas Completadas vs Pendientes) ---
    let completadas = 0;
    let pendientes = 0;

    tasksSnap.forEach((doc) => {
      const data = doc.data();
      if (data.completada === true) completadas++;
      else pendientes++;
    });

    // --- LÓGICA PARA GRÁFICA DE LÍNEAS (Evolución Semanal) ---
    // Agrupamos tareas por día de la semana (0 = Domingo, 1 = Lunes, etc.)
    const diasSemana = [0, 0, 0, 0, 0, 0, 0]; // Lun, Mar, Mié, Jue, Vie, Sáb, Dom
    
    tasksSnap.forEach((doc) => {
      const data = doc.data();
      // Verificamos si existe fecha de creación y si está completada
      if (data.completada && data.fechaCreacion) {
        const fecha = data.fechaCreacion.toDate 
                      ? data.fechaCreacion.toDate() 
                      : new Date(data.fechaCreacion);
        
        // Ajustamos para que Lunes sea índice 0
        let diaIndice = fecha.getDay() - 1;
        if (diaIndice === -1) diaIndice = 6; // Domingo
        
        diasSemana[diaIndice]++;
      }
    });

    // --- RESPUESTA ESTRUCTURADA PARA EL FRONTEND ---
    res.status(200).json({
      tareas: {
        completadas,
        pendientes,
        total: tasksSnap.size
      },
      totales: {
        notas: notesSnap.size,
        recordatorios: remindersSnap.size
      },
      evolucionSemanal: diasSemana // Array [1, 2, 2, 3, 3, 4, 4] según tu imagen
    });

  } catch (error) {
    console.error("🔥 Error en statsController:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserStats };