const todoService = require('../services/todoService');
const { catchAsync, createError } = require('../utils/errorUtils');
const Todo = require('../models/Todo');

// Fetch all todos for the authenticated user
exports.getTodos = catchAsync(async (req, res) => {
  const result = await todoService.getTodos(req.user._id, req.query);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

// Retrieve a specific todo by its ID
exports.getTodoById = catchAsync(async (req, res) => {
  const todo = await todoService.getTodoById(req.params.id, req.user._id);
  
  res.status(200).json({
    success: true,
    data: todo
  });
});

// Create a new todo item
exports.createTodo = catchAsync(async (req, res) => {
  const todo = await todoService.createTodo(req.body, req.user._id);
  
  res.status(201).json({
    success: true,
    data: todo
  });
});

// Update an existing todo
exports.updateTodo = catchAsync(async (req, res) => {
  const todo = await todoService.updateTodo(req.params.id, req.body, req.user._id);
  
  res.status(200).json({
    success: true,
    data: todo
  });
});

// Remove a todo from the database
exports.deleteTodo = catchAsync(async (req, res) => {
  await todoService.deleteTodo(req.params.id, req.user._id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// Get statistical information about user's todos
exports.getTodoStats = catchAsync(async (req, res) => {
  const stats = await todoService.getTodoStats(req.user._id);
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

// Update only the status of a todo
exports.updateTodoStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    throw createError(400, 'Status is required');
  }
  
  // Validate status value
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (!validStatuses.includes(status)) {
    throw createError(400, 'Invalid status value. Must be one of: pending, in-progress, completed');
  }
  
  // Update only the status field
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status },
    { new: true, runValidators: true }
  );
  
  if (!todo) {
    throw createError(404, 'Todo not found');
  }
  
  res.status(200).json({
    success: true,
    data: todo
  });
}); 