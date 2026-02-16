import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import clsx from 'clsx';

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
    <div className="flex items-center justify-between mb-3">
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 rounded bg-white dark:bg-dark-card text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
          autoFocus
        />
      ) : (
        <div className="flex-1 flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {list.title}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-card px-2 py-0.5 rounded">
            {taskCount}
          </span>
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-base"
        >
          <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-dark-card rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-20">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover transition-base"
              >
                <Edit2 size={14} />
                Rename List
              </button>
              <button
                onClick={() => {
                  onDelete(list.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-base"
              >
                <Trash2 size={14} />
                Delete List
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListHeader;
