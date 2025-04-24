const { body } = require('express-validator');

/**
 * Validation rules for creating/updating todos
 */
const todoValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters')
    .trim(),
    
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters')
    .trim(),
    
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed'),
    
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),
    
  body('dueDate')
    .optional()
    .custom(value => {
      // Check if the value is a valid date
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Due date must be a valid date');
      }
      return true;
    }),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom(tags => {
      if (tags && tags.length > 0) {
        // Check if all tags are strings
        const allStrings = tags.every(tag => typeof tag === 'string');
        if (!allStrings) {
          throw new Error('All tags must be strings');
        }
        
        // Check if all tags have valid length
        const validLengths = tags.every(tag => tag.length <= 20);
        if (!validLengths) {
          throw new Error('Tags must be 20 characters or less');
        }
      }
      return true;
    })
];

module.exports = {
  todoValidator
}; 