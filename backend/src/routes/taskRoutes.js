const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/basic/tasksController');

// Obtener tareas
router.get('/:userId', tasksController.getTasks);

// Crear tarea
router.post('/:userId', tasksController.createTask);

// Actualizar tarea (usamos PATCH para cambios parciales)
router.patch('/:userId/:taskId', tasksController.updateTask);

// Eliminar tarea (usamos DELETE)
router.delete('/:userId/:taskId', tasksController.deleteTask);

module.exports = router;