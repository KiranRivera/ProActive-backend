const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/basic/calendarController');

router.get('/:userId', calendarController.getEvents);
router.post('/:userId', calendarController.createEvent);
router.delete('/:userId/:eventId', calendarController.deleteEvent);

module.exports = router;