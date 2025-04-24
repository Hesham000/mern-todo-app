const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const keys = require('./config/keys');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const configurePassport = require('./config/passport');
const applySecurityMiddleware = require('./middlewares/securityMiddleware');
const { logger, morganMiddleware } = require('./utils/logger');
const path = require('path');
const { cleanupExpiredTokens } = require('./utils/tokenCleanup');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const todoRoutes = require('./routes/todo.routes');

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10kb' })); // Limit JSON body size
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());

// Apply security middleware (helmet, rate limiting, etc.)
applySecurityMiddleware(app);

// Setup CORS
app.use(cors({
  origin: keys.corsOrigin,
  credentials: true,
  optionsSuccessStatus: 204
}));

// Setup logging
app.use(morganMiddleware);

// Initialize Passport
const passport = configurePassport();
app.use(passport.initialize());

// Create logs directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// API version prefix
const API_PREFIX = `/api/${keys.apiVersion}`;

// Mount routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/todos`, todoRoutes);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Todo API is running',
    version: keys.apiVersion,
    environment: keys.environment
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = keys.port;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${keys.environment} mode on port ${PORT}`);
  
  // Schedule token cleanup to run every hour
  setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

module.exports = app; // Export for testing 