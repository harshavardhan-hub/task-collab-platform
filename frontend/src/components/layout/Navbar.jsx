import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import Avatar from '../common/Avatar';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationStore } from '../../store/notificationStore';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotificationStore();

  return (
    <nav className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Empty div for spacing on desktop, mobile menu button will be in Layout */}
          <div className="flex-1"></div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <NotificationBell />

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-base"
              >
                <Avatar user={user} size="sm" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                  {user?.full_name}
                </span>
              </Link>

              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 transition-base"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
