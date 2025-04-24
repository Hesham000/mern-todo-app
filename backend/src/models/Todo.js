const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create index for title for search functionality
todoSchema.index({ title: 'text', description: 'text' });

// Create compound index for user and created time
todoSchema.index({ user: 1, createdAt: -1 });

// Middleware to set completedAt date when status is changed to completed
todoSchema.pre('save', function(next) {
  // If status is changing to completed, set completedAt to current date
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  // If status is changing from completed to another status, clear completedAt
  if (this.isModified('status') && this.status !== 'completed') {
    this.completedAt = undefined;
  }
  
  next();
});

// Virtual field for calculating if the todo is overdue
todoSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return new Date() > this.dueDate && this.status !== 'completed';
});

// Configure toJSON to include virtuals
todoSchema.set('toJSON', { virtuals: true });
todoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Todo', todoSchema); 