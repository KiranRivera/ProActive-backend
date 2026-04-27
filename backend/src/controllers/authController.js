const admin = require('firebase-admin');

const registerUser = async (req, res) => {
  try {
    const db = admin.firestore();
    // 1. Extraemos el plan del cuerpo de la petición (req.body)
    const { nombre, edad, correo, ocupacion, password, plan } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios" });
    }

    const userRef = db.collection('Usuarios');
    const snapshot = await userRef.where('correo', '==', correo.trim()).get();

    if (!snapshot.empty) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado" });
    }

    const nuevoUsuario = {
      nombre,
      edad: parseInt(edad),
      correo: correo.trim().toLowerCase(),
      ocupacion,
      password, 
      // 2. Aquí usamos el plan que viene del frontend. 
      // Si por alguna razón no llega, ponemos "basico" por defecto.
      plan: plan || "basico", 
      fechaRegistro: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await userRef.add(nuevoUsuario);

    res.status(201).json({ 
      id: docRef.id, 
      mensaje: "Usuario creado exitosamente" 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const db = admin.firestore();
    const { correo, password } = req.body;

    // 1. Buscar usuario por correo
    const userRef = db.collection('Usuarios');
    const snapshot = await userRef.where('correo', '==', correo.trim().toLowerCase()).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "El usuario no existe" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // 2. Verificar contraseña
    if (userData.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // 3. Responder con los datos básicos, ID y el PLAN
    res.status(200).json({
      id: userDoc.id,
      nombre: userData.nombre,
      correo: userData.correo,
      plan: userData.plan || "basico" // <--- Enviamos el plan guardado (o básico por seguridad)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };