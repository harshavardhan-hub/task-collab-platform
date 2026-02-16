import { getIO } from '../config/socket.js';

// Broadcast to specific board room
export const broadcastToBoardRoom = (boardId, event, data) => {
  const io = getIO();
  io.to(`board_${boardId}`).emit(event, data);
};

// Broadcast to all users
export const broadcastToAll = (event, data) => {
  const io = getIO();
  io.emit(event, data);
};

// Get online users in a board room
export const getOnlineUsersInBoard = async (boardId) => {
  const io = getIO();
  const room = io.sockets.adapter.rooms.get(`board_${boardId}`);
  
  if (!room) return [];

  const socketIds = Array.from(room);
  const onlineUsers = [];

  for (const socketId of socketIds) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      onlineUsers.push({
        userId: socket.userId,
        userEmail: socket.userEmail,
      });
    }
  }

  return onlineUsers;
};

export default {
  broadcastToBoardRoom,
  broadcastToAll,
  getOnlineUsersInBoard,
};
