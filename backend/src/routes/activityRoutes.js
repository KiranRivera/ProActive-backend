const express = require('express');
const router = express.Router();
// Verifica si tu carpeta es 'business' o 'bussiness'. Si es con una 's', corrígelo aquí:
const activityController = require('../controllers/bussiness/activityController');

// 1. LAS RUTAS MÁS ESPECÍFICAS SIEMPRE VAN PRIMERO
// URL: GET /api/business/activities/teams/:userId/:teamId/members
router.get('/teams/:userId/:teamId/members', activityController.getTeamMembers);

// 2. RUTAS DE ACTIVIDADES
// URL: GET /api/business/activities/:userId/:teamId
router.get('/:userId/:teamId', activityController.getTeamActivities);

// URL: POST /api/business/activities/:userId/:teamId
router.post('/:userId/:teamId', activityController.createActivityByEmail);

// URL: PATCH /api/business/activities/:userId/:teamId/:activityId
router.patch('/:userId/:teamId/:activityId', activityController.updateActivityStatus);

module.exports = router;