const admin = require('firebase-admin');

// OBTENER tareas (Coincidiendo con tu captura: "Usuarios" -> "Tareas")
const getTasks = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId } = req.params;
    
    // Cambiado a "Tareas" con T mayúscula
    const snapshot = await db.collection('Usuarios').doc(userId).collection('Tareas').get();
    
    const tareas = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREAR tarea nueva
const createTask = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId } = req.params;
    
    // Verificamos el body de forma segura
    const titulo = req.body?.titulo;

    if (!titulo) {
      return res.status(400).json({ 
        error: "Falta el título en el JSON del Body." 
      });
    }

    const nuevaTarea = {
      titulo: titulo,
      completada: false,
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp()
    };

    // Cambiado a "Tareas" con T mayúscula para que se guarde en la misma colección que ves en Firebase
    const docRef = await db.collection('Usuarios').doc(userId).collection('Tareas').add(nuevaTarea);
    
    res.status(201).json({ 
      mensaje: "Tarea creada con éxito", 
      id: docRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateTask = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, taskId } = req.params;
    const { completada } = req.body; // Esperamos un true o false

    const taskRef = db.collection('Usuarios').doc(userId).collection('Tareas').doc(taskId);
    
    await taskRef.update({
      completada: completada,
      ultimaActualizacion: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ mensaje: "Tarea actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ELIMINAR una tarea
const deleteTask = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, taskId } = req.params;

    await db.collection('Usuarios').doc(userId).collection('Tareas').doc(taskId).delete();

    res.status(200).json({ mensaje: "Tarea eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exportamos todas las funciones
module.exports = { getTasks, createTask, updateTask, deleteTask };