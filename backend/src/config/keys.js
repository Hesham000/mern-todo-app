require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  environment: process.env.NODE_ENV,
  apiVersion: 'v1',
  corsOrigin: process.env.CORS_ORIGIN
}; 