import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Avatar from '../common/Avatar';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full h-20 flex items-center bg-transparent">
      <div className="w-full px-8 flex flex-row items-center justify-between">
        {/* Left Side (Breadcrumbs could go here if wanted) */}
        <div className="flex-1 flex items-center">
          <div className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
            {/* Minimal left area */}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 border border-secondary-200 dark:border-dark-border bg-white/70 dark:bg-dark-card/50 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-sm">
          {/* Theme Toggle */}
          <ThemeToggle />

          <div className="w-px h-5 bg-secondary-200 dark:bg-dark-border" />

          {/* Notifications */}
          <NotificationBell />

          <div className="w-px h-5 bg-secondary-200 dark:bg-dark-border" />

          {/* Profile Dropdown */}
          <div className="flex items-center gap-2 pl-1">
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar user={user} size="sm" showBorder />
              <span className="text-sm font-semibold text-secondary-900 dark:text-white hidden md:block">
                {user?.full_name?.split(' ')[0] || 'User'}
              </span>
            </Link>

            <button
              onClick={logout}
              className="p-2 ml-1 text-secondary-400 hover:text-red-500 rounded-lg hover:bg-secondary-100 dark:hover:bg-dark-hover transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
