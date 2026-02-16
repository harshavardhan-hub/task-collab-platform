import { create } from 'zustand';
import { generateId } from '../utils/helpers';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => set((state) => {
    const newNotification = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    return {
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    };
  }),

  markAsRead: (notificationId) => set((state) => {
    const notification = state.notifications.find((n) => n.id === notificationId);
    
    if (!notification || notification.read) {
      return state;
    }

    return {
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    };
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),

  clearNotifications: () => set({
    notifications: [],
    unreadCount: 0,
  }),

  removeNotification: (notificationId) => set((state) => {
    const notification = state.notifications.find((n) => n.id === notificationId);
    
    return {
      notifications: state.notifications.filter((n) => n.id !== notificationId),
      unreadCount: notification && !notification.read
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    };
  }),
}));
