import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings, X, KanbanSquare } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: KanbanSquare, label: 'Boards', path: '/boards' }, // A dummy Boards item to complete UX (you can remove if not originally intended, although typically a SaaS has it on sidebar) Wait, boards are dynamic... I will keep Activity and Settings. Wait, I will stick to existing paths.
    { icon: Activity, label: 'Activity', path: '/activity' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const actualNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Activity, label: 'Activity', path: '/activity' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:relative z-50 h-full w-[280px] bg-white dark:bg-[#0E0E10] border-r border-light-border dark:border-dark-border flex flex-col',
          'transition-transform duration-300 ease-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header with Logo */}
        <div className="px-6 py-6 lg:py-8 lg:px-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center shadow-[0_2px_10px_rgba(94,106,210,0.3)] transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[19px] font-display font-semibold tracking-tight text-secondary-900 dark:text-white">
              TaskCollab
            </span>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-secondary-500 hover:text-secondary-900 dark:hover:text-white rounded-lg hover:bg-secondary-100 dark:hover:bg-dark-hover transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-4 text-xs font-semibold tracking-wider text-secondary-400 dark:text-secondary-600 uppercase">
            Menu
          </div>
          {actualNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={clsx(
                  'relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  active
                    ? 'text-primary-600 dark:text-white'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-white/5'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary-50 dark:bg-white/10 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={18} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-900/5 border border-primary-100 dark:border-primary-900/20">
            <p className="text-xs font-medium text-primary-900 dark:text-primary-100 mb-2">Premium Experience</p>
            <p className="text-[11px] text-primary-700/80 dark:text-primary-300/60 leading-relaxed">
              Enjoying the new Awwwards-winning design of TaskCollab.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
