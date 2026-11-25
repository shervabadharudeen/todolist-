const express = require('express');
const router = express.Router();
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo
} = require('../controllers/todoController');
const { checkDbConnection } = require('../middleware/errorMiddleware');

// Apply database connection check middleware to all /api/todos endpoints
router.use(checkDbConnection);

// Routes for /api/todos
router.route('/')
  .get(getTodos)
  .post(createTodo);

// Routes for /api/todos/:id
router.route('/:id')
  .get(getTodoById)
  .put(updateTodo)
  .delete(deleteTodo);

// Route for /api/todos/:id/status
router.route('/:id/status')
  .patch(updateTodoStatus);

module.exports = router;
