const Todo = require('../models/Todo');
const { createError } = require('../utils/errorUtils');

// Retrieves todos for a user with support for filtering, pagination, and sorting
// Allows filtering by status, priority and search term
// Returns paginated results with metadata
const getTodos = async (userId, queryParams = {}) => {
  const { status, priority, search, sortBy, page = 1, limit = 10 } = queryParams;
  
  // Build query
  const query = { user: userId };
  
  // Filter by status
  if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
    query.status = status;
  }
  
  // Filter by priority
  if (priority && ['low', 'medium', 'high'].includes(priority)) {
    query.priority = priority;
  }
  
  // Search by title or description
  if (search) {
    query.$text = { $search: search };
  }
  
  // Determine sort order
  let sort = { createdAt: -1 }; // Default sort by created date (newest first)
  
  if (sortBy) {
    if (sortBy === 'dueDate') {
      sort = { dueDate: 1 }; // Sort by due date (ascending)
    } else if (sortBy === 'priority') {
      sort = { priority: -1 }; // Sort by priority (high to low)
    } else if (sortBy === 'title') {
      sort = { title: 1 }; // Sort by title (A-Z)
    }
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query with pagination
  const todos = await Todo.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));
    
  // Get total count of todos matching query
  const total = await Todo.countDocuments(query);
  
  // Calculate pagination info
  const totalPages = Math.ceil(total / parseInt(limit));
  
  return {
    todos,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages
    }
  };
};

// Gets a single todo by ID and verifies the user has access to it
// Throws error if todo doesn't exist or belongs to another user
const getTodoById = async (todoId, userId) => {
  try {
    const todo = await Todo.findById(todoId);
    
    if (!todo) {
      throw createError('Todo not found', 404);
    }
    
    // Convert both IDs to strings to ensure proper comparison
    const todoUserIdStr = todo.user.toString();
    const requestUserIdStr = userId.toString();
    
    // Check if user owns todo
    if (todoUserIdStr !== requestUserIdStr) {
      throw createError('Not authorized to access this todo', 401);
    }
    
    return todo;
  } catch (error) {
    if (error.name === 'CastError') {
      throw createError('Invalid todo ID format', 400);
    }
    throw error;
  }
};

// Creates a new todo item for the specified user
// Associates the todo with the user ID
const createTodo = async (todoData, userId) => {
  // Add user to todo data
  const todoToCreate = {
    ...todoData,
    user: userId
  };
  
  const todo = await Todo.create(todoToCreate);
  
  if (!todo) {
    throw createError('Failed to create todo', 400);
  }
  
  return todo;
};

// Updates an existing todo after checking user ownership
// Returns the updated todo object
const updateTodo = async (todoId, todoData, userId) => {
  // Find todo by ID
  let todo = await Todo.findById(todoId);
  
  if (!todo) {
    throw createError('Todo not found', 404);
  }
  
  // Convert both IDs to strings to ensure proper comparison
  const todoUserIdStr = todo.user.toString();
  const requestUserIdStr = userId.toString();
  
  // Check if user owns todo
  if (todoUserIdStr !== requestUserIdStr) {
    throw createError('Not authorized to update this todo', 401);
  }
  
  // Update todo
  todo = await Todo.findByIdAndUpdate(todoId, todoData, {
    new: true,
    runValidators: true
  });
  
  return todo;
};

// Removes a todo from the database after verifying user ownership
const deleteTodo = async (todoId, userId) => {
  // Find todo by ID
  const todo = await Todo.findById(todoId);
  
  if (!todo) {
    throw createError('Todo not found', 404);
  }
  
  // Convert both IDs to strings to ensure proper comparison
  const todoUserIdStr = todo.user.toString();
  const requestUserIdStr = userId.toString();
  
  // Check if user owns todo
  if (todoUserIdStr !== requestUserIdStr) {
    throw createError('Not authorized to delete this todo', 401);
  }
  
  // Delete todo
  await todo.deleteOne();
};

// Generates statistics about a user's todos
// Includes counts by status and overdue items
const getTodoStats = async (userId) => {
  const stats = await Todo.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Convert stats array to object
  const statsObj = {
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0
  };
  
  stats.forEach(stat => {
    statsObj[stat._id] = stat.count;
    statsObj.total += stat.count;
  });
  
  // Get overdue todos count
  const overdueTodos = await Todo.countDocuments({
    user: userId,
    status: { $ne: 'completed' },
    dueDate: { $lt: new Date() }
  });
  
  statsObj.overdue = overdueTodos;
  
  // Get upcoming todos (due in the next 3 days)
  const now = new Date();
  const threeDaysLater = new Date(now);
  threeDaysLater.setDate(now.getDate() + 3);
  
  const upcomingTodos = await Todo.countDocuments({
    user: userId,
    status: { $ne: 'completed' },
    dueDate: { 
      $gte: now,
      $lte: threeDaysLater
    }
  });
  
  statsObj.upcoming = upcomingTodos;
  
  return statsObj;
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoStats
}; 