const express = require('express');
const router = express.Router();
const reportController = require('../controllers/bussiness/reportController');

// URL: GET /api/business/reports/:userId/:teamId
router.get('/:userId/:teamId', reportController.getTeamPerformanceReport);

module.exports = router;