const admin = require('firebase-admin');

// 1. OBTENER EQUIPOS Y SUS MIEMBROS (La clave del éxito)
const getTeams = async (req, res) => {
  try {
    const db = admin.firestore();
    const userId = req.params.userId.trim();
    
    const snapshot = await db.collection('Usuarios')
      .doc(userId)
      .collection('Equipos')
      .get();

    // Mapeamos cada equipo para buscar sus miembros en la subcolección
    const equiposConMiembros = await Promise.all(snapshot.docs.map(async (doc) => {
      const equipoData = doc.data();
      const equipoId = doc.id;

      const miembrosSnapshot = await db.collection('Usuarios')
        .doc(userId)
        .collection('Equipos')
        .doc(equipoId)
        .collection('Miembros')
        .get();

      const members = miembrosSnapshot.docs.map(mDoc => ({
        id: mDoc.id,
        ...mDoc.data()
      }));

      return {
        id: equipoId,
        ...equipoData,
        members: members // Inyectamos el array de miembros
      };
    }));

    res.status(200).json(equiposConMiembros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. CREAR EQUIPO
const createTeam = async (req, res) => {
  try {
    const db = admin.firestore();
    const userId = req.params.userId.trim();
    const { nombre, descripcion } = req.body;

    const nuevoEquipo = {
      nombre,
      descripcion: descripcion || "",
      creado: userId,
      fechaCrecion: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('Usuarios').doc(userId).collection('Equipos').add(nuevoEquipo);
    res.status(201).json({ id: docRef.id, mensaje: "Equipo creado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. AGREGAR MIEMBRO
const addMember = async (req, res) => {
  try {
    const db = admin.firestore();
    const { userId, teamId } = req.params;
    const { nombre, correo, role } = req.body;

    const nuevoMiembro = {
      nombre,
      correo,
      role,
      active: true,
      fechaUnion: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('Usuarios')
      .doc(userId)
      .collection('Equipos')
      .doc(teamId)
      .collection('Miembros')
      .add(nuevoMiembro);

    res.status(201).json({ mensaje: "Miembro añadido" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. ELIMINAR EQUIPO
const deleteTeam = async (req, res) => {
  try {
    const { userId, teamId } = req.params;
    await admin.firestore().collection('Usuarios').doc(userId).collection('Equipos').doc(teamId).delete();
    res.status(200).json({ mensaje: "Equipo eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. CAMBIAR ESTADO MIEMBRO
const toggleMemberStatus = async (req, res) => {
  try {
    const { userId, teamId, memberId } = req.params;
    const { active } = req.body;
    await admin.firestore().collection('Usuarios').doc(userId).collection('Equipos').doc(teamId).collection('Miembros').doc(memberId).update({ active });
    res.status(200).json({ mensaje: "Estado actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. ELIMINAR MIEMBRO
const removeMember = async (req, res) => {
  try {
    const { userId, teamId, memberId } = req.params;
    await admin.firestore().collection('Usuarios').doc(userId).collection('Equipos').doc(teamId).collection('Miembros').doc(memberId).delete();
    res.status(200).json({ mensaje: "Miembro eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTeams, createTeam, addMember, deleteTeam, toggleMemberStatus, removeMember };