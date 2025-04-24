const winston = require('winston');
const morgan = require('morgan');
const path = require('path');
const keys = require('../config/keys');

// Define log format
const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ''
    }`;
  }
);

// Create Winston logger
const logger = winston.createLogger({
  level: keys.environment === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    logFormat
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error'
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log')
    })
  ],
  exitOnError: false
});

// Create Morgan middleware using Winston
const morganMiddleware = morgan(
  // Define log format
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  {
    // Stream logs through Winston
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }
);

module.exports = {
  logger,
  morganMiddleware
}; 