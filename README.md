# Todo App

A full-stack MERN (MongoDB, Express, React, Node.js) application for task management with modern UI using Material UI.

## Features

- Create, view, update, and delete tasks
- Mark tasks as complete/incomplete
- Set due dates for tasks
- Filter tasks by status and date
- Dashboard with task analytics
- Responsive design for all devices

## Tech Stack

### Frontend
- React
- Material UI
- React Router
- Framer Motion for animations
- Axios for API requests
- React Query for data fetching
- Day.js for date management

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication

## Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)

### Setup

1. Clone the repository
```
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

2. Install dependencies for backend
```
cd backend
npm install
```

3. Install dependencies for frontend
```
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
   ```

5. Start the development servers

   For backend:
   ```
   cd backend
   npm run dev
   ```

   For frontend:
   ```
   cd frontend
   npm start
   ```

## Usage

- Register a new account or login with an existing one
- Create new tasks using the "Add Task" button
- View your tasks on the dashboard
- Edit or delete tasks using the icons on each task card
- Mark tasks as complete using the checkbox
- Filter tasks by status using the filter buttons

## Deployment

The application can be deployed using various platforms:

- Frontend: Vercel, Netlify, or GitHub Pages
- Backend: Heroku, Railway, or any cloud provider

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 