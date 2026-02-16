# 🚀 TaskCollab -- Real‑Time Task Collaboration Platform

A **production‑quality real‑time task collaboration platform** built
using **React, Node.js, PostgreSQL, and Socket.IO**.\
Designed with **clean architecture, scalable backend, modern UI, and
real‑time sync**, perfect for portfolios, hackathons, and real-world
applications.

------------------------------------------------------------------------

## 🌐 Live Deployment

- **Live Demo Link:** https://task-collab-platform.vercel.app

- **Frontend (Vercel):** https://task-collab-platform.vercel.app
- **Backend (Render):** https://task-collab-backend.onrender.com

------------------------------------------------------------------------

# 📌 Table of Contents

-   Features
-   Tech Stack
-   Folder Structure
-   Setup Instructions
-   API Documentation
-   WebSocket Events
-   Architecture
-   Security
-   Deployment Guide
-   Testing Strategy
-   Future Enhancements
-   Demo Credentials
-   Author

------------------------------------------------------------------------

# ✨ Features

## ✅ Core Features

-   JWT Authentication (Signup / Login)
-   Board Creation & Management
-   Lists inside Boards
-   Tasks with full CRUD
-   Drag & Drop Tasks
-   Real‑Time Sync using Socket.IO
-   Assign Users to Tasks
-   Activity Tracking Logs
-   Search + Pagination
-   Fully Responsive UI

## ⭐ Premium Features

-   Dark / Light Theme
-   Markdown Task Description
-   Due Dates & Priority Levels
-   Emoji Labels
-   File Attachments (URL based)
-   Notifications
-   Online Presence Indicators

------------------------------------------------------------------------

# 🛠️ Tech Stack

## Frontend

-   React 18
-   Vite
-   Tailwind CSS
-   Zustand
-   Socket.IO Client
-   React Router
-   @dnd-kit
-   Axios
-   Lucide Icons

## Backend

-   Node.js + Express
-   PostgreSQL
-   Socket.IO
-   JWT Authentication
-   bcrypt Password Hashing

------------------------------------------------------------------------

# 📁 Folder Structure

    task-collab-platform/
    │
    ├── backend/
    │   ├── src/
    │   │   ├── config/
    │   │   ├── controllers/
    │   │   ├── middleware/
    │   │   ├── routes/
    │   │   ├── services/
    │   │   ├── socket/
    │   │   ├── utils/
    │   │   └── server.js
    │   ├── migrations/
    │   └── package.json
    │
    └── frontend/
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   ├── store/
        │   ├── hooks/
        │   ├── services/
        │   ├── utils/
        │   ├── App.jsx
        │   └── main.jsx
        └── package.json

------------------------------------------------------------------------

# ⚙️ Setup Instructions

## 1️⃣ Prerequisites

-   Node.js v18+
-   PostgreSQL v14+
-   npm / yarn

------------------------------------------------------------------------

## 2️⃣ Database Setup

``` sql
CREATE DATABASE task_collab;
```

Run migration file:

    backend/migrations/001_initial_schema.sql

------------------------------------------------------------------------

## 3️⃣ Backend Setup

``` bash
cd backend
npm install
```

Create `.env` file:

    PORT=5000
    DATABASE_URL=postgresql://username:password@localhost:5432/task_collab
    JWT_SECRET=your_secret
    JWT_EXPIRES_IN=7d
    CORS_ORIGIN=http://localhost:5173

Run server:

``` bash
npm run dev
```

Backend → http://localhost:5000

------------------------------------------------------------------------

## 4️⃣ Frontend Setup

``` bash
cd frontend
npm install
```

Create `.env` file:

    VITE_API_URL=http://localhost:5000
    VITE_SOCKET_URL=http://localhost:5000

Run app:

``` bash
npm run dev
```

Frontend → http://localhost:5173

------------------------------------------------------------------------

# 📡 API Overview

## Auth

POST /api/auth/signup\
POST /api/auth/login\
GET /api/auth/profile

## Boards

GET /api/boards\
POST /api/boards\
PUT /api/boards/:id\
DELETE /api/boards/:id

## Lists

POST /api/boards/:boardId/lists\
PUT /api/lists/:id\
DELETE /api/lists/:id

## Tasks

POST /api/lists/:listId/tasks\
PUT /api/tasks/:id\
DELETE /api/tasks/:id\
PUT /api/tasks/:id/move

## Activity

GET /api/boards/:boardId/activity

------------------------------------------------------------------------

# 🔌 WebSocket Events

### Client → Server

-   join_board
-   leave_board

### Server → Client

-   board_updated
-   list_created / updated / deleted
-   task_created / updated / moved / deleted
-   task_assigned
-   user_online / offline

------------------------------------------------------------------------

# 🏗️ Architecture

### Frontend

-   Component‑Based Design
-   Zustand Global State
-   Socket.IO Real‑Time Updates
-   Optimistic UI

### Backend

-   Routes → Controllers → Services → DB
-   PostgreSQL Transactions
-   Socket Rooms per Board
-   Activity Logs for Audit Trail

------------------------------------------------------------------------

# 🔒 Security

-   JWT Auth
-   bcrypt Password Hashing
-   SQL Injection Protection
-   Input Validation
-   CORS Protection
-   XSS Safety

------------------------------------------------------------------------

# 🚀 Deployment

## Backend

-   Deploy on Render / Railway
-   Setup PostgreSQL
-   Add Environment Variables
-   Run migrations

## Frontend

-   Deploy on Vercel / Netlify
-   Build → `npm run build`
-   Deploy dist folder

------------------------------------------------------------------------

# 🧪 Testing Strategy

-   Backend Unit Tests
-   API Integration Tests
-   WebSocket Testing
-   Frontend Component Tests
-   E2E User Flow Tests

------------------------------------------------------------------------

# 🔮 Future Enhancements

-   Mobile App (React Native)
-   Advanced Roles & Permissions
-   Email Notifications
-   Calendar View
-   Gantt Charts
-   Time Tracking
-   Analytics Dashboard

------------------------------------------------------------------------

# 👥 Demo Credentials

Email: demo@taskcollab.com\
Password: 123456

------------------------------------------------------------------------

# 👨‍💻 Author

Built by **Harsha Vardhan Yanakandla** as a **production‑level full‑stack
project**\
Showcasing modern MERN + PostgreSQL + WebSocket architecture.

Built with ❤️ using React, Node.js, PostgreSQL, Socket.IO

