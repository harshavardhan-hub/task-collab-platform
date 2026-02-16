import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow } from 'date-fns';
import { AVATAR_COLORS } from './constants';

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isTomorrow(dateObj)) {
    return `Tomorrow at ${format(dateObj, 'HH:mm')}`;
  }
  
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

// Format date for due date display
export const formatDueDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  }
  
  return format(dateObj, 'MMM dd, yyyy');
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 120) return 'a minute ago';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 7200) return 'an hour ago';
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 172800) return 'yesterday';
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 1209600) return 'a week ago';
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  
  return format(past, 'MMM dd, yyyy');
};

// Check if date is overdue
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// Get avatar color based on user ID
export const getAvatarColor = (userId) => {
  if (!userId) return AVATAR_COLORS[0];
  
  const index = typeof userId === 'string' 
    ? userId.charCodeAt(0) % AVATAR_COLORS.length 
    : userId % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get contrast color (black or white) based on background
export const getContrastColor = (hexColor) => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Sort tasks by position
export const sortByPosition = (items) => {
  return [...items].sort((a, b) => a.position - b.position);
};

// Get activity message - FIXED: Handle both object and string metadata
export const getActivityMessage = (activity) => {
  if (!activity) return '';
  
  // Parse metadata - handle both string and object
  let metadata = {};
  try {
    if (typeof activity.metadata === 'string') {
      metadata = JSON.parse(activity.metadata);
    } else if (typeof activity.metadata === 'object' && activity.metadata !== null) {
      metadata = activity.metadata;
    }
  } catch (error) {
    console.error('Failed to parse activity metadata:', error);
    metadata = {};
  }
  
  switch (activity.action) {
    case 'board_created':
      return `created board "${metadata.title || 'Untitled'}"`;
    case 'list_created':
      return `created list "${metadata.title || 'Untitled'}"`;
    case 'list_updated':
      return `updated list "${metadata.title || 'Untitled'}"`;
    case 'list_deleted':
      return `deleted list "${metadata.title || 'Untitled'}"`;
    case 'task_created':
      return `created task "${metadata.title || 'Untitled'}"`;
    case 'task_updated':
      return `updated task "${metadata.title || metadata.taskTitle || 'Untitled'}"`;
    case 'task_moved':
      return `moved task "${metadata.title || 'Untitled'}"`;
    case 'task_deleted':
      return `deleted task "${metadata.title || 'Untitled'}"`;
    case 'user_assigned':
      return `assigned ${metadata.assignedUser || 'a user'} to task "${metadata.taskTitle || 'task'}"`;
    case 'user_unassigned':
      return `unassigned user from task "${metadata.taskTitle || 'task'}"`;
    case 'member_added':
      return `added ${metadata.memberEmail || 'a member'} to board`;
    default:
      return activity.action ? activity.action.replace(/_/g, ' ') : 'performed an action';
  }
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Download file
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
