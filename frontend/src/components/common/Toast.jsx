import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} className="text-green-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-blue-500" />,
    warning: <AlertTriangle size={18} className="text-yellow-500" />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={clsx(
        'flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border',
        'bg-white dark:bg-[#1C1C1F] border-secondary-200 dark:border-dark-border',
        'min-w-[320px] max-w-md pointer-events-auto'
      )}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-sm font-medium text-secondary-900 dark:text-white">
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-gray-300 hover:bg-secondary-100 dark:hover:bg-dark-hover rounded-md transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
