import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { connectDB } from './config/database.js';
import { initializeSocket } from './config/socket.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import listRoutes from './routes/listRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// CORS Configuration - FIXED!
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://task-collab-platform.vercel.app', // Your Vercel URL
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      callback(null, true); // Allow anyway for debugging - REMOVE IN PRODUCTION
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {});
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    allowedOrigins: allowedOrigins,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', boardRoutes);
app.use('/api', listRoutes);
app.use('/api', taskRoutes);
app.use('/api', activityRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  logger.info(`🚀 Server running on port ${PORT}`, {});
  logger.info(`📡 Socket.IO initialized`, {});
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`, {});
  logger.info(`✅ Allowed origins: ${allowedOrigins.join(', ')}`, {});
  
  // Connect to database
  await connectDB();
});

// Make io available globally
app.set('io', io);

export { io };
