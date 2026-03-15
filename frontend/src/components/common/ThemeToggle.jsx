import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white dark:bg-dark-hover border border-secondary-200 dark:border-dark-border shadow-sm hover:shadow-md transition-shadow"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {theme === 'dark' ? (
          <Moon size={18} className="text-primary-400" />
        ) : (
          <Sun size={18} className="text-accent-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
