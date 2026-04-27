const admin = require('firebase-admin');

// OBTENER eventos
const getEvents = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId } = req.params;
    
    const snapshot = await db.collection('Usuarios').doc(userId).collection('Eventos').get();
    const eventos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREAR evento
const createEvent = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId } = req.params;
    const { titulo, fecha, color, tipo } = req.body;

    if (!titulo || !fecha) {
      return res.status(400).json({ error: "Título y fecha son obligatorios" });
    }

    const nuevoEvento = {
      titulo,
      fecha, // Puede ser un string "2026-04-26" o un Timestamp
      color: color || "#005B97", // Azul por defecto de tu diseño
      tipo: tipo || "general",
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('Usuarios').doc(userId).collection('Eventos').add(nuevoEvento);
    res.status(201).json({ mensaje: "Evento guardado", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ELIMINAR evento
const deleteEvent = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, eventId } = req.params;
    await db.collection('Usuarios').doc(userId).collection('Eventos').doc(eventId).delete();
    res.status(200).json({ mensaje: "Evento eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getEvents, createEvent, deleteEvent };