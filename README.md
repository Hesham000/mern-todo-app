# Todo App

A full-stack MERN (MongoDB, Express, React, Node.js) application for task management with modern UI using Material UI.

![Todo App](https://img.shields.io/badge/Todo-App-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Task Management**: Create, view, update, and delete tasks
- **Status Tracking**: Mark tasks as complete/incomplete
- **Due Dates**: Set and manage task deadlines
- **Filtering**: Filter tasks by status, priority, and date
- **Statistics Dashboard**: Visual analytics of your tasks
- **Responsive Design**: Optimized for all devices
- **User Authentication**: Secure login and registration
- **Data Persistence**: Store your tasks in MongoDB

## Tech Stack

### Frontend
- **React**: UI library for building component-based interfaces
- **Material UI**: Modern UI component library
- **React Router**: For navigation and routing
- **Framer Motion**: For smooth animations and transitions
- **Axios**: For handling API requests
- **React Query**: For efficient data fetching and caching
- **Day.js**: For date manipulation and formatting

### Backend
- **Node.js**: JavaScript runtime for server-side logic
- **Express**: Web framework for handling routes and middleware
- **MongoDB**: NoSQL database for storing task data
- **Mongoose**: ODM for MongoDB schema modeling
- **JWT**: For secure authentication
- **Express Validator**: For request validation

## Demo

Watch a quick demo of the app in action:

<div align="center">
  <a href="https://streamable.com/ix4we3" target="_blank">
    <img src="https://cdn.streamable.com/video/ix4we3.jpg" alt="Todo App Demo" width="600">
  </a>
</div>

## API Documentation

The API documentation is available at [https://c23h0k720q.apidog.io/](https://c23h0k720q.apidog.io/)

### API Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - Logout user

#### Users
- `PUT /users` - Update user
- `PUT /users/password` - Change password
- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user by ID
- `DELETE /users/:id` - Delete user by ID

#### Todos
- `POST /todos` - Create todo
- `GET /todos` - Get all todos
- `GET /todos/stats` - Get todo statistics
- `GET /todos/:id` - Get todo by ID
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Setup

1. Clone the repository
```bash
git clone https://github.com/Hesham000/mern-todo-app.git
cd mern-todo-app
```

2. Install dependencies for backend
```bash
cd backend
npm install
```

3. Install dependencies for frontend
```bash
cd ../frontend
npm install
```

4. Configure environment variables
   - Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

5. Start the development servers

   For backend:
   ```bash
   cd backend
   npm run dev
   ```

   For frontend:
   ```bash
   cd frontend
   npm start
   ```

## Usage

1. **Registration/Login**: 
   - Register a new account or login with existing credentials
   - Your authentication token will be stored securely

2. **Task Management**:
   - Create new tasks using the "Add Task" button
   - View your tasks on the dashboard
   - Edit or delete tasks using the action icons
   - Mark tasks as complete using the checkbox

3. **Filtering and Organization**:
   - Filter tasks by status (All, Active, Completed)
   - Sort tasks by due date or creation date
   - View tasks due today for better focus

4. **Statistics**:
   - See your productivity metrics on the dashboard
   - Track completion rate and overdue tasks

## Deployment

The application can be deployed using various platforms:

### Frontend Deployment
- **Vercel**: Best for React applications
- **Netlify**: Easy continuous deployment
- **GitHub Pages**: For static hosting

### Backend Deployment
- **Heroku**: PaaS with easy setup
- **Railway**: Modern alternative to Heroku
- **DigitalOcean**: For more control over infrastructure
- **AWS/GCP/Azure**: For enterprise-level deployment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Hesham - [hesham12ali13@gmail.com](mailto:hesham12ali13@gmail.com)

Project Link: [https://github.com/Hesham000/mern-todo-app](https://github.com/Hesham000/mern-todo-app) 