const admin = require('firebase-admin');

// OBTENER todos los recordatorios (Ordenados por fecha)
const getReminders = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId } = req.params;
    
    const snapshot = await db.collection('Usuarios').doc(userId)
                             .collection('Recordatorios')
                             .orderBy('fechaHora', 'asc')
                             .get();
                             
    const recordatorios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(recordatorios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREAR un recordatorio Premium
const createReminder = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId } = req.params;
    const { titulo, nota, fechaHora, prioridad, categoria, color } = req.body;

    if (!titulo || !fechaHora) {
      return res.status(400).json({ error: "Título y fecha/hora son obligatorios" });
    }

    const nuevoRecordatorio = {
      titulo,
      nota: nota || "",
      fechaHora, // Formato sugerido: "YYYY-MM-DDTHH:mm"
      prioridad: prioridad || "media", // alta, media, baja
      categoria: categoria || "General",
      color: color || "#005B97",
      completado: false,
      notificado: false,
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('Usuarios').doc(userId).collection('Recordatorios').add(nuevoRecordatorio);
    res.status(201).json({ mensaje: "Recordatorio guardado", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZAR estado (Completado / No completado)
const toggleReminder = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, reminderId } = req.params;
    const { completado } = req.body;

    await db.collection('Usuarios').doc(userId).collection('Recordatorios').doc(reminderId).update({
      completado: completado
    });

    res.status(200).json({ mensaje: "Estado actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// BORRAR un recordatorio
const deleteReminder = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, reminderId } = req.params;
    
    await db.collection('Usuarios').doc(userId).collection('Recordatorios').doc(reminderId).delete();
    res.status(200).json({ mensaje: "Recordatorio eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getReminders, createReminder, toggleReminder, deleteReminder };