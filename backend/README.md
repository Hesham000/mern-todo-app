# Todo App API

A RESTful API for a Todo List application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- User registration and login
- User profile management
- Todo CRUD operations
- Todo filtering, searching, and pagination
- Role-based authorization

## Security Features

The API implements several security best practices:

- **Helmet** - Sets secure HTTP headers to protect against common web vulnerabilities
- **Express Rate Limit** - Protects against brute force and DDoS attacks
- **Express Validator** - Validates and sanitizes user input to prevent injection attacks
- **CORS** - Restricts which domains can access the API
- **Mongoose** - Enforces schema validation and sanitizes data
- **Passport JWT** - Provides robust authentication and authorization
- **Custom MongoDB Sanitization** - Prevents NoSQL injection attacks
- **Winston & Morgan** - Comprehensive logging for security auditing and debugging
- **Request Size Limiting** - Prevents large payload attacks
- **Password Hashing** - Uses bcrypt to securely hash passwords
- **Error Handling** - Centralized error handling with appropriate security responses
- **Global Exception Handling** - Graceful handling of uncaught exceptions

## Project Structure

```
📁src/
│
├── 📁config/                  # App config files
│   ├── db.js                  # MongoDB connection
│   ├── keys.js                # JWT secret, app constants
│   └── passport.js            # Passport JWT configuration
│
├── 📁controllers/             # Route logic
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── todo.controller.js
│
├── 📁models/                  # Mongoose schemas
│   ├── User.js
│   └── Todo.js
│
├── 📁routes/                  # API route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── todo.routes.js
│
├── 📁middlewares/             # Express middleware
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── securityMiddleware.js
│   └── validateRequest.js
│
├── 📁validators/              # Input validation logic
│   ├── authValidator.js
│   └── todoValidator.js
│
├── 📁utils/                   # Utility functions (e.g., token helpers)
│   ├── generateToken.js
│   ├── errorUtils.js
│   └── logger.js
│
├── 📁services/                # Business logic layer
│   ├── userService.js
│   └── todoService.js
│
└── server.js                  # Express app initialization
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todo-app
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

### Running the API

- Development mode:
  ```
  npm run dev
  ```
- Production mode:
  ```
  npm start
  ```

## API Documentation

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get token
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/logout` - Logout

### User Management

- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/password` - Change password

### Admin Routes

- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID (admin only)
- `PUT /api/v1/users/:id` - Update user (admin only)
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Todo Management

- `GET /api/v1/todos` - Get all todos (with filtering, searching, pagination)
- `POST /api/v1/todos` - Create a todo
- `GET /api/v1/todos/stats` - Get todo statistics
- `GET /api/v1/todos/:id` - Get a todo by ID
- `PUT /api/v1/todos/:id` - Update a todo
- `DELETE /api/v1/todos/:id` - Delete a todo 