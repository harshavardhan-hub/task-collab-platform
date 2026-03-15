import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[10px] transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-[0_2px_8px_rgba(94,106,210,0.25)]',
    secondary: 'bg-secondary-900 hover:bg-secondary-800 dark:bg-white dark:hover:bg-gray-100 dark:text-secondary-900 text-white shadow-sm',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-sm',
    outline: 'border border-secondary-200 dark:border-dark-border text-secondary-700 dark:text-gray-300 hover:bg-secondary-50 dark:hover:bg-dark-hover',
    ghost: 'text-secondary-600 dark:text-gray-400 hover:bg-secondary-100 dark:hover:bg-dark-hover',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };

  return (
    <motion.button
      whileHover={{ y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="mr-2 flex items-center">{leftIcon}</span>
      ) : null}
      
      {children}
      
      {!loading && rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;
