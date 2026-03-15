import React from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  ...props
}, ref) => {
  return (
    <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
      {label && (
        <label className="mb-1.5 text-xs font-semibold tracking-wide text-secondary-600 dark:text-gray-400 uppercase">
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500 transition-colors group-focus-within:text-primary-500">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-2.5 rounded-[10px] border border-secondary-200 dark:border-dark-border transition-all duration-200 shadow-sm',
            'bg-white dark:bg-[#1A1A1D]',
            'text-secondary-900 dark:text-gray-100 text-sm',
            'placeholder:text-secondary-400 dark:placeholder:text-secondary-500',
            'focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      
      {helperText && !error && (
        <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
