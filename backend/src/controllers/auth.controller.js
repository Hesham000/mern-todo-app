const userService = require('../services/userService');
const { catchAsync } = require('../utils/errorUtils');
const { logger } = require('../utils/logger');

// Register a new user
exports.register = catchAsync(async (req, res) => {
  logger.debug('Register request received:', req.body);
  try {
    const result = await userService.registerUser(req.body);
    logger.debug('Registration successful');
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    logger.error('Registration error:', error);
    throw error;
  }
});

// Login user with credentials
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  logger.debug('Login attempt for email:', email);
  const result = await userService.loginUser(email, password);
  res.status(result.statusCode).json(result.body);
});

// Get current user profile
exports.getMe = catchAsync(async (req, res) => {
  const userData = await userService.getUserProfile(req.user._id);
  res.status(200).json({
    success: true,
    data: userData
  });
});

// Logout user and invalidate tokens
exports.logout = catchAsync(async (req, res) => {
  // If using cookies, clear the token cookie
  if (req.cookies.token) {
    res.clearCookie('token');
  }
  
  // If using Bearer token, add it to the blacklist
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    await userService.blacklistToken(token, req.user._id);
  }
  
  res.status(200).json({
    success: true,
    message: 'Successfully logged out'
  });
}); 