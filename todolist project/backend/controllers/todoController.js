const mongoose = require('mongoose');
const Todo = require('../models/Todo');

// @desc    Get all todos with search, filter, and sorting
// @route   GET /api/todos
// @access  Public
const getTodos = async (req, res, next) => {
  try {
    const { status, priority, category, search, sortBy } = req.query;
    const filter = {};

    // Filter by status (Pending, Completed, All)
    if (status && status.toLowerCase() !== 'all') {
      if (status.toLowerCase() === 'completed') {
        filter.status = 'Completed';
      } else if (status.toLowerCase() === 'pending') {
        filter.status = 'Pending';
      }
    }

    // Filter by priority (Low, Medium, High)
    if (priority && priority.toLowerCase() !== 'all') {
      const formattedPriority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
      filter.priority = formattedPriority;
    }

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    // Search query matching title, description, or category
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    // Build query
    let query = Todo.find(filter);

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.sort({ createdAt: -1 });
        break;
      case 'dueSoon':
        query = query.sort({ dueDate: 1, dueTime: 1, createdAt: -1 });
        break;
      case 'dueLate':
        query = query.sort({ dueDate: -1, dueTime: -1, createdAt: -1 });
        break;
      case 'alphabetical':
        query = query.sort({ title: 1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
        break;
    }

    const todos = await query.exec();

    // Priority custom sort if requested (High -> Medium -> Low)
    if (sortBy === 'priority') {
      const weights = { High: 3, Medium: 2, Low: 1 };
      todos.sort((a, b) => (weights[b.priority] || 0) - (weights[a.priority] || 0));
    }

    res.status(200).json({
      success: true,
      count: todos.length,
      message: 'Todos retrieved successfully',
      data: {
        todos
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Public
const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`Invalid Todo ID format: ${id}`);
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      res.status(404);
      throw new Error(`Todo not found with ID: ${id}`);
    }

    res.status(200).json({
      success: true,
      message: 'Todo retrieved successfully',
      data: {
        todo
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Public
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, dueTime, category, status, completed } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Task title is required');
    }

    // Determine status & completed compatibility
    let resolvedStatus = 'Pending';
    let resolvedCompleted = false;

    if (status !== undefined) {
      resolvedStatus = status.toLowerCase() === 'completed' ? 'Completed' : 'Pending';
      resolvedCompleted = resolvedStatus === 'Completed';
    } else if (completed !== undefined) {
      resolvedCompleted = Boolean(completed);
      resolvedStatus = resolvedCompleted ? 'Completed' : 'Pending';
    }

    const newTodo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      dueDate: dueDate || undefined,
      dueTime: dueTime ? dueTime.trim() : '',
      category: category || 'Work',
      status: resolvedStatus,
      completed: resolvedCompleted,
      completedAt: resolvedCompleted ? new Date() : null
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: {
        todo: newTodo
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing todo
// @route   PUT /api/todos/:id
// @access  Public
const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`Invalid Todo ID format: ${id}`);
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      res.status(404);
      throw new Error(`Todo not found with ID: ${id}`);
    }

    const { title, description, priority, dueDate, dueTime, category, status, completed } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        res.status(400);
        throw new Error('Task title cannot be empty');
      }
      todo.title = title.trim();
    }

    if (description !== undefined) {
      todo.description = description.trim();
    }

    if (priority !== undefined) {
      todo.priority = priority;
    }

    if (dueDate !== undefined) {
      todo.dueDate = dueDate;
    }

    if (dueTime !== undefined) {
      todo.dueTime = dueTime;
    }

    if (category !== undefined) {
      todo.category = category;
    }

    if (status !== undefined) {
      todo.status = status.toLowerCase() === 'completed' ? 'Completed' : 'Pending';
      todo.completed = todo.status === 'Completed';
      todo.completedAt = todo.completed ? (todo.completedAt || new Date()) : null;
    } else if (completed !== undefined) {
      todo.completed = Boolean(completed);
      todo.status = todo.completed ? 'Completed' : 'Pending';
      todo.completedAt = todo.completed ? (todo.completedAt || new Date()) : null;
    }

    const updatedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: {
        todo: updatedTodo
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status or completion state
// @route   PATCH /api/todos/:id/status
// @access  Public
const updateTodoStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`Invalid Todo ID format: ${id}`);
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      res.status(404);
      throw new Error(`Todo not found with ID: ${id}`);
    }

    const { status, completed } = req.body;

    if (status === undefined && completed === undefined) {
      res.status(400);
      throw new Error('Please provide status or completed in request body');
    }

    if (status !== undefined) {
      todo.status = status.toLowerCase() === 'completed' ? 'Completed' : 'Pending';
      todo.completed = todo.status === 'Completed';
    } else if (completed !== undefined) {
      todo.completed = Boolean(completed);
      todo.status = todo.completed ? 'Completed' : 'Pending';
    }

    todo.completedAt = todo.completed ? new Date() : null;

    const updatedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: `Todo status updated to ${updatedTodo.status}`,
      data: {
        todo: updatedTodo
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Public
const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`Invalid Todo ID format: ${id}`);
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      res.status(404);
      throw new Error(`Todo not found with ID: ${id}`);
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: {
        id: todo._id.toString()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo
};
