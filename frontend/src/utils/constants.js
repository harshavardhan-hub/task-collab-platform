// API Base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'taskcollab_token',
  USER: 'taskcollab_user',
  THEME: 'taskcollab_theme',
};

// Task Priority Levels
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Priority Colors
export const PRIORITY_COLORS = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

// Activity Action Types
export const ACTIVITY_ACTIONS = {
  BOARD_CREATED: 'board_created',
  LIST_CREATED: 'list_created',
  LIST_UPDATED: 'list_updated',
  LIST_DELETED: 'list_deleted',
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_MOVED: 'task_moved',
  TASK_DELETED: 'task_deleted',
  USER_ASSIGNED: 'user_assigned',
  USER_UNASSIGNED: 'user_unassigned',
  MEMBER_ADDED: 'member_added',
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Default Board Colors
export const BOARD_COLORS = [
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F97316', // Orange
];

// Avatar Colors for users without avatars
export const AVATAR_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-cyan-500',
];

// Emoji Labels
export const EMOJI_LABELS = [
  '🔴', '🟡', '🟢', '🔵', '🟣', '🟠',
  '⭐', '🎯', '🚀', '💡', '🔥', '✨',
  '📌', '⚡', '🎨', '🎭', '🎪', '🎬',
];
