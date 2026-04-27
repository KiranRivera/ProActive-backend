const admin = require('firebase-admin');

// OBTENER todas las notas
const getNotes = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId } = req.params;
    
    const snapshot = await db.collection('Usuarios').doc(userId).collection('Notas').get();
    const notas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(notas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREAR una nota
const createNote = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId } = req.params;
    const { titulo, contenido, color } = req.body;

    const nuevaNota = {
      titulo: titulo || "Nota sin título",
      contenido: contenido || "",
      color: color || "#FFFFFF",
      fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('Usuarios').doc(userId).collection('Notas').add(nuevaNota);
    res.status(201).json({ mensaje: "Nota creada", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ELIMINAR una nota
const deleteNote = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, noteId } = req.params;
    await db.collection('Usuarios').doc(userId).collection('Notas').doc(noteId).delete();
    res.status(200).json({ mensaje: "Nota eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNotes, createNote, deleteNote };