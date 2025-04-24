const express = require('express');
const { 
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoStats,
  updateTodoStatus
} = require('../controllers/todo.controller');
const { protect } = require('../middlewares/authMiddleware');
const { todoValidator } = require('../validators/todoValidator');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Protected routes
router.route('/')
  .get(protect, getTodos)
  .post(protect, todoValidator, validateRequest, createTodo);

router.route('/stats')
  .get(protect, getTodoStats);

router.route('/:id')
  .get(protect, getTodoById)
  .put(protect, todoValidator, validateRequest, updateTodo)
  .delete(protect, deleteTodo);

// Add status update endpoint
router.route('/:id/status')
  .patch(protect, updateTodoStatus);

module.exports = router; 