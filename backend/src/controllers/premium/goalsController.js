const admin = require('firebase-admin');

// OBTENER todas las metas de un usuario
const getGoals = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId } = req.params;

    const snapshot = await db.collection('Usuarios')
                             .doc(userId)
                             .collection('Metas')
                             .orderBy('fechaLimite', 'asc')
                             .get();

    const metas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(metas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREAR una meta Premium
const createGoal = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId } = req.params;
    const { titulo, objetivo, fechaLimite } = req.body;

    // Validación siguiendo tu estilo
    if (!titulo || !objetivo || !fechaLimite) {
      return res.status(400).json({ error: "Título, objetivo y fecha límite son obligatorios" });
    }

    const nuevaMeta = {
      titulo,
      objetivo: Number(objetivo),
      progreso: 0, // Inicia en 0 por defecto
      fechaLimite, // Formato sugerido: "YYYY-MM-DD"
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('Usuarios')
                           .doc(userId)
                           .collection('Metas')
                           .add(nuevaMeta);

    res.status(201).json({ mensaje: "Meta guardada", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZAR progreso de la meta
const updateGoalProgress = async (req, res) => {
  try {
    const db = admin.firestore();
    // Aplicamos .trim() para eliminar cualquier espacio invisible que venga de Postman
    const userId = req.params.userId.trim();
    const goalId = req.params.goalId.trim();
    const { progreso } = req.body;

    console.log(`🔍 Buscando documento en: Usuarios/${userId}/Metas/${goalId}`);

    const metaRef = db.collection('Usuarios').doc(userId).collection('Metas').doc(goalId);
    const doc = await metaRef.get();

    if (!doc.exists) {
      console.log("❌ Error: El documento NO existe en esa ruta.");
      return res.status(404).json({ 
        error: "Documento no encontrado", 
        path: `Usuarios/${userId}/Metas/${goalId}` 
      });
    }

    await metaRef.update({
      progreso: Number(progreso)
    });

    console.log("✅ ¡Actualización exitosa!");
    res.status(200).json({ mensaje: "Progreso actualizado correctamente" });

  } catch (error) {
    console.error("🔥 Error de Firestore:", error.message);
    res.status(500).json({ error: error.message });
  }
};
// BORRAR una meta
const deleteGoal = async (req, res) => {
  try {
    const db = admin.firestore();
    
    // 1. Limpieza de IDs (Crucial para evitar el falso positivo)
    const userId = req.params.userId.trim();
    const goalId = req.params.goalId.trim();

    const metaRef = db.collection('Usuarios')
                      .doc(userId)
                      .collection('Metas')
                      .doc(goalId);

    // 2. Verificar si existe antes de intentar borrar
    const doc = await metaRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: "No se pudo eliminar: La meta no existe.",
        path: `Usuarios/${userId}/Metas/${goalId}`
      });
    }

    // 3. Borrar ahora que estamos seguros de la ruta
    await metaRef.delete();

    res.status(200).json({ mensaje: "Meta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getGoals, createGoal, updateGoalProgress, deleteGoal };