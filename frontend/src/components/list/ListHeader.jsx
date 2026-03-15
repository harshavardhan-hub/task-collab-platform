import React, { useState } from 'react';
import { MoreHorizontal, Edit2, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ListHeader = ({ list, taskCount, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [showMenu, setShowMenu] = useState(false);

  const handleSubmit = () => {
    if (title.trim() && title !== list.title) {
      onUpdate(list.id, { title: title.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(list.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between group">
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-[#232326] px-2.5 py-1.5 rounded-lg border-2 border-primary-500 shadow-sm">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[15px] text-secondary-900 dark:text-white font-semibold focus:outline-none"
            autoFocus
          />
          <button onMouseDown={(e) => { e.preventDefault(); handleSubmit(); }} className="text-primary-500 p-1">
             <Check size={16} />
          </button>
        </div>
      ) : (
        <div 
          className="flex-1 flex items-center gap-2.5 cursor-pointer rounded-lg px-1.5 py-1 -ml-1.5 hover:bg-secondary-200/50 dark:hover:bg-white/5 transition-colors"
          onClick={() => setIsEditing(true)}
        >
          <h3 className="font-display font-semibold text-[15px] text-secondary-900 dark:text-white truncate tracking-tight">
            {list.title}
          </h3>
          <span className="text-[11px] font-bold text-secondary-500 dark:text-secondary-400 bg-secondary-200/50 dark:bg-white/10 px-2 py-0.5 rounded-full">
            {taskCount}
          </span>
        </div>
      )}

      <div className="relative ml-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 rounded-lg hover:bg-secondary-200 dark:hover:bg-white/10 text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <MoreHorizontal size={18} />
        </button>

        <AnimatePresence>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, transformOrigin: 'top right' }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#232326] rounded-xl shadow-xl border border-secondary-200 dark:border-white/10 py-1 z-20"
              >
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Edit2 size={16} />
                  Rename List
                </button>
                <div className="h-px bg-secondary-200 dark:bg-white/5 my-1" />
                <button
                  onClick={() => {
                    onDelete(list.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete List
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ListHeader;
