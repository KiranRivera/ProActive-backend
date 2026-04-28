const express = require('express');
const router = express.Router();
const teamController = require('../controllers/bussiness/teamsController');

// --- Gestión de Equipos ---

// Obtener equipos: GET /api/business/teams/:userId
router.get('/:userId', teamController.getTeams);

// Crear equipo: POST /api/business/teams/:userId
router.post('/:userId', teamController.createTeam);

// Eliminar equipo: DELETE /api/business/teams/:userId/:teamId
router.delete('/:userId/:teamId', teamController.deleteTeam);


// --- Gestión de Miembros ---

// Agregar miembro: POST /api/business/teams/:userId/:teamId/members
router.post('/:userId/:teamId/members', teamController.addMember);

// Estado miembro: PATCH /api/business/teams/:userId/:teamId/members/:memberId
router.patch('/:userId/:teamId/members/:memberId', teamController.toggleMemberStatus);

// Eliminar miembro: DELETE /api/business/teams/:userId/:teamId/members/:memberId
router.delete('/:userId/:teamId/members/:memberId', teamController.removeMember);


module.exports = router;