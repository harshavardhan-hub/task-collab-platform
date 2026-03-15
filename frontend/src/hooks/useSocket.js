import { useEffect, useCallback, useRef } from 'react';
import socketService from '../services/socket';
import { useBoardStore } from '../store/boardStore';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';

export const useSocket = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    addList, updateList, deleteList,
    addTask, updateTask, deleteTask, moveTask, updateBoard,
    setOnlineUser, removeOnlineUser, clearOnlineUsers,
  } = useBoardStore();
  const { addNotification } = useNotificationStore();
  const hasConnected = useRef(false);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Helper to show browser notification
  const showBrowserNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg',
      });
    }
  };

  // Connect socket ONCE
  useEffect(() => {
    if (isAuthenticated && !hasConnected.current) {
      socketService.connect();
      hasConnected.current = true;
    }

    // Only disconnect on unmount or auth change
    return () => {
      if (!isAuthenticated) {
        socketService.disconnect();
        hasConnected.current = false;
      }
    };
  }, [isAuthenticated]);

  // Join board — retry until socket is connected
  const joinBoard = useCallback((boardId) => {
    const tryJoin = () => {
      if (socketService.isConnected()) {
        socketService.joinBoard(boardId);
      } else {
        // Socket not yet connected, wait for connect event
        socketService.socket?.once('connect', () => {
          socketService.joinBoard(boardId);
        });
        // Also kick off connection if not already connecting
        if (!socketService.socket) {
          socketService.connect();
          socketService.socket?.once('connect', () => {
            socketService.joinBoard(boardId);
          });
        }
      }
    };
    tryJoin();
  }, []);

  // Leave board
  const leaveBoard = useCallback((boardId) => {
    socketService.leaveBoard(boardId);
    clearOnlineUsers();
  }, [clearOnlineUsers]);

  // Setup board event listeners
  const setupBoardListeners = useCallback(() => {
    // Board events
    socketService.on('board_updated', ({ board }) => {
      updateBoard(board.id, board);
      addNotification({
        type: 'info',
        message: 'Board updated',
      });
    });

    // List events
    socketService.on('list_created', ({ list }) => {
      addList(list);
      const message = 'New list created';
      addNotification({ type: 'success', message });
      showBrowserNotification('List Created', message);
    });

    socketService.on('list_updated', ({ list }) => {
      updateList(list.id, list);
    });

    socketService.on('list_deleted', ({ listId }) => {
      deleteList(listId);
      addNotification({ type: 'info', message: 'List deleted' });
    });

    // Task events
    socketService.on('task_created', ({ task }) => {
      addTask(task.list_id, task);
      const message = 'New task created';
      addNotification({ type: 'success', message });
      showBrowserNotification('Task Created', message);
    });

    socketService.on('task_updated', ({ task }) => {
      updateTask(task.id, task);
    });

    socketService.on('task_moved', ({ task, newListId, newPosition }) => {
      moveTask(task.id, newListId, newPosition);
    });

    socketService.on('task_deleted', ({ taskId }) => {
      deleteTask(taskId);
      addNotification({ type: 'info', message: 'Task deleted' });
    });

    socketService.on('task_assigned', ({ task }) => {
      updateTask(task.id, task);
      const message = 'User assigned to task';
      addNotification({ type: 'success', message });
      showBrowserNotification('Task Assignment', message);
    });

    // Online presence events
    socketService.on('user_online', ({ userId, userEmail }) => {
      setOnlineUser(userId, { userId, userEmail });
      const message = `${userEmail} joined the board`;
      addNotification({ type: 'info', message });
      showBrowserNotification('User Joined', message);
    });

    socketService.on('user_offline', ({ userId }) => {
      removeOnlineUser(userId);
    });

    // Receive current online users when first joining a board
    socketService.on('online_users_in_board', ({ onlineUsers }) => {
      onlineUsers.forEach(({ userId, userEmail }) => {
        setOnlineUser(userId, { userId, userEmail });
      });
    });
  }, [
    addList, updateList, deleteList,
    addTask, updateTask, deleteTask, moveTask, updateBoard,
    addNotification, setOnlineUser, removeOnlineUser,
  ]);

  // Cleanup listeners
  const cleanupBoardListeners = useCallback(() => {
    socketService.removeAllListeners('board_updated');
    socketService.removeAllListeners('list_created');
    socketService.removeAllListeners('list_updated');
    socketService.removeAllListeners('list_deleted');
    socketService.removeAllListeners('task_created');
    socketService.removeAllListeners('task_updated');
    socketService.removeAllListeners('task_moved');
    socketService.removeAllListeners('task_deleted');
    socketService.removeAllListeners('task_assigned');
    socketService.removeAllListeners('user_online');
    socketService.removeAllListeners('user_offline');
    socketService.removeAllListeners('online_users_in_board');
  }, []);

  return {
    joinBoard,
    leaveBoard,
    setupBoardListeners,
    cleanupBoardListeners,
    isConnected: socketService.isConnected(),
  };
};
