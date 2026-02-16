import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

// Initialize Socket.IO server
export const initializeSocket = (server) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://task-collab-platform.vercel.app', // Your Vercel URL
    process.env.CLIENT_URL,
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    transports: ['websocket', 'polling'],
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;
      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join board rooms
    socket.on('join_board', (boardId) => {
      socket.join(`board_${boardId}`);
      console.log(`User ${socket.userId} joined board ${boardId}`);
      
      // Notify others that user is online
      socket.to(`board_${boardId}`).emit('user_online', {
        userId: socket.userId,
        userEmail: socket.userEmail,
      });
    });

    // Leave board rooms
    socket.on('leave_board', (boardId) => {
      socket.leave(`board_${boardId}`);
      console.log(`User ${socket.userId} left board ${boardId}`);
      
      // Notify others that user went offline
      socket.to(`board_${boardId}`).emit('user_offline', {
        userId: socket.userId,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

// Get Socket.IO instance
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

export default { initializeSocket, getIO };
