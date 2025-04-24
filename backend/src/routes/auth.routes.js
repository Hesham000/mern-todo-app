const express = require('express');
const { 
  register, 
  login, 
  getMe,
  logout
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/authMiddleware');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validateRequest = require('../middlewares/validateRequest');
const { logger } = require('../utils/logger');

const router = express.Router();

// Debug route to test registration without validation
router.post('/test-register', (req, res, next) => {
  logger.debug('Test register endpoint called with body:', req.body);
  next();
}, register);

// Public routes - temporarily disable validation for registration
router.post('/register', /*registerValidator, validateRequest,*/ register);
router.post('/login', loginValidator, validateRequest, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router; 