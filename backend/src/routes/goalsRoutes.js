const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/premium/goalsController');

// Rutas de Metas Premium (Añadimos /goals a cada una)
router.get('/:userId', goalsController.getGoals);
router.post('/:userId', goalsController.createGoal);
router.patch('/:userId/:goalId', goalsController.updateGoalProgress);
router.delete('/:userId/:goalId', goalsController.deleteGoal);

module.exports = router;