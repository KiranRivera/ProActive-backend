const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/premium/goalsController');

// Rutas de Metas Premium (Añadimos /goals a cada una)
router.get('/goals/:userId', goalsController.getGoals);
router.post('/goals/:userId', goalsController.createGoal);
router.patch('/goals/:userId/:goalId', goalsController.updateGoalProgress);
router.delete('/goals/:userId/:goalId', goalsController.deleteGoal);

module.exports = router;