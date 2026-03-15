import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { getRelativeTime } from '../../utils/helpers';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className={clsx(
          "relative p-2.5 rounded-xl transition-all shadow-sm hover:shadow-md border",
          showDropdown 
            ? "bg-secondary-100 dark:bg-dark-hover border-secondary-200 dark:border-dark-border" 
            : "bg-white dark:bg-dark-hover border-transparent hover:border-secondary-200 dark:hover:border-dark-border"
        )}
      >
        <Bell size={18} className="text-secondary-600 dark:text-secondary-300" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#1E1E21] shadow-sm"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed sm:absolute right-4 sm:right-0 top-20 sm:top-[calc(100%+12px)] w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-[#1C1C1F] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-light-border dark:border-dark-border z-40 max-h-[70vh] sm:max-h-[500px] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-light-border dark:border-dark-border">
              <h3 className="font-display font-semibold text-secondary-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-wider"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <AnimatePresence mode="popLayout">
                {notifications.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 px-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-secondary-50 dark:bg-white/5 flex items-center justify-center mb-4">
                      <Bell size={24} className="text-secondary-300 dark:text-secondary-600" />
                    </div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-white mb-1">You're all caught up</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">No new notifications right now.</p>
                  </motion.div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.9 }}
                      key={notification.id}
                      className={clsx(
                        'group relative p-3.5 mb-1 rounded-xl transition-all duration-200',
                        !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'hover:bg-secondary-50 dark:hover:bg-white/5'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {!notification.read && (
                           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-md" />
                        )}
                        <div className="flex-1 min-w-0 pl-1">
                          <p className={clsx("text-sm mb-1 leading-snug", !notification.read ? "text-secondary-900 dark:text-white font-medium" : "text-secondary-600 dark:text-secondary-300")}>
                            {notification.message}
                          </p>
                          <p className="text-[11px] font-medium text-secondary-400 dark:text-secondary-500 uppercase tracking-wider">
                            {getRelativeTime(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                              className="p-1.5 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-green-500 dark:hover:border-green-500 rounded-lg shadow-sm transition-colors text-secondary-400 hover:text-green-500"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
                            className="p-1.5 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-red-500 dark:hover:border-red-500 rounded-lg shadow-sm transition-colors text-secondary-400 hover:text-red-500"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
