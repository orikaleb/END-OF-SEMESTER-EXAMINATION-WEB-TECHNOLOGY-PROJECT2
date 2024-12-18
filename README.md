# EventFlow Application

A full-stack event management application built with Express.js backend and MongoDB database.

## Features

- User Authentication and Authorization
- Event Management (Create, Read, Update, Delete)
- Admin Dashboard
- Event Registration and Tracking
- User Preferences
- Error Handling and Logging

## Tech Stack

### Frontend
- HTML5
- CSS3 with Flexbox/Grid
- JavaScript (ES6+)
- Font Awesome Icons
- Responsive Design

### Deployment
The application is deployed and accessible at:
- Frontend: https://luminous-babka-8cb047.netlify.app/



### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Express Validator
- Multer for file uploads
- CORS enabled

### Environment Variables

Create a `.env` file in the backend directory with the following variables: 


The server will start on port 3000 by default, or the next available port if 3000 is in use.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get specific event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Admin
- `GET /api/admin` - Admin dashboard access
- `POST /api/admin/users` - Manage users

## Initial Setup

### Create Admin User