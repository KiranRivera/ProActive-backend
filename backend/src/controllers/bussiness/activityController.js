const admin = require('firebase-admin');

// 1. OBTENER ACTIVIDADES
const getTeamActivities = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, teamId } = req.params;

    const snapshot = await db.collection('Usuarios')
      .doc(userId)
      .collection('Equipos')
      .doc(teamId)
      .collection('Actividades')
      .orderBy('fechaCreacion', 'desc')
      .get();

    const actividades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(actividades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. CREAR ACTIVIDAD BUSCANDO POR CORREO
const createActivityByEmail = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, teamId } = req.params;
    const { tarea, correo } = req.body;

    if (!tarea || !correo) {
      return res.status(400).json({ error: "Tarea y correo son obligatorios" });
    }

    const miembrosRef = db.collection('Usuarios').doc(userId)
                          .collection('Equipos').doc(teamId)
                          .collection('Miembros');
    
    const querySnapshot = await miembrosRef.where('correo', '==', correo.trim()).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "No se encontró el miembro en este equipo." });
    }

    const miembroDoc = querySnapshot.docs[0];
    const miembroData = miembroDoc.data();

    const nuevaActividad = {
      tarea,
      assignedTo: miembroData.nombre,
      emailAsignado: correo.trim(),
      memberId: miembroDoc.id,
      status: "Pendiente",
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('Usuarios')
      .doc(userId)
      .collection('Equipos')
      .doc(teamId)
      .collection('Actividades')
      .add(nuevaActividad);

    res.status(201).json({ 
      id: docRef.id, 
      mensaje: `Actividad asignada a ${miembroData.nombre}` 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. ACTUALIZAR ESTADO
const updateActivityStatus = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, teamId, activityId } = req.params;
    const { status } = req.body;

    await db.collection('Usuarios').doc(userId)
      .collection('Equipos').doc(teamId)
      .collection('Actividades').doc(activityId)
      .update({ status });

    res.status(200).json({ mensaje: "Estado actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getTeamMembers = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, teamId } = req.params;

    const snapshot = await db.collection('Usuarios')
      .doc(userId)
      .collection('Equipos')
      .doc(teamId)
      .collection('Miembros') // Accedemos a la subcolección de miembros
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]); // Devolvemos array vacío si no hay miembros
    }

    const miembros = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(miembros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// EXPORTACIÓN CRITICA: Asegúrate de que los nombres coincidan exactamente
module.exports = { 
  getTeamActivities, 
  createActivityByEmail, 
  updateActivityStatus,
  getTeamMembers
};