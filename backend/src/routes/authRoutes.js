const express = require('express');
const router = express.Router();
// Si el controlador está en src/controllers/authController.js
// y este archivo de rutas está en src/routes/authRoutes.js:
const authController = require('../controllers/authController');

// Si esto es undefined, el servidor crashea con el error que pusiste
router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

module.exports = router;