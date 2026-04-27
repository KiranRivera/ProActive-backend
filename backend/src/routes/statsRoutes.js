const express = require('express');
const router = express.Router();
const statsController = require('../controllers/premium/statsController');

// Cambiamos el orden: la palabra 'dashboard' hace que sea una ruta única
router.get('/dashboard/user/:userId', statsController.getUserStats);

module.exports = router;