const express = require('express');
const router = express.Router();
const notesController = require('../controllers/basic/notesController');

router.get('/:userId', notesController.getNotes);
router.post('/:userId', notesController.createNote);
router.delete('/:userId/:noteId', notesController.deleteNote);

module.exports = router;