const admin = require('firebase-admin');

const getTeamPerformanceReport = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, teamId } = req.params;

    // 1. Obtener todos los miembros del equipo
    const membersSnapshot = await db.collection('Usuarios').doc(userId)
      .collection('Equipos').doc(teamId)
      .collection('Miembros').get();

    const members = membersSnapshot.docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre,
      correo: doc.data().correo
    }));

    // 2. Obtener todas las actividades del equipo
    const activitiesSnapshot = await db.collection('Usuarios').doc(userId)
      .collection('Equipos').doc(teamId)
      .collection('Actividades').get();

    const activities = activitiesSnapshot.docs.map(doc => doc.data());

    // 3. Procesar datos para el reporte
    // Queremos saber: Tareas completadas por cada correo de miembro
    const reportData = members.map(member => {
      const userActivities = activities.filter(act => act.emailAsignado === member.correo);
      
      return {
        user: member.nombre,
        tasks: userActivities.filter(act => act.status === "Completada").length,
        pending: userActivities.filter(act => act.status !== "Completada").length,
        // Aquí podrías sumar metas o recordatorios si tienes esas colecciones
        goals: 0, 
        reminders: 0 
      };
    });

    res.status(200).json(reportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTeamPerformanceReport };