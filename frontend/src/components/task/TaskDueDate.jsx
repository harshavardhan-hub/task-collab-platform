import React from 'react';
import { formatDueDate, isOverdue } from '../../utils/helpers';
import { Calendar, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const TaskDueDate = ({ task, isEditing, onChange }) => {
  const isTaskOverdue = task.due_date && isOverdue(task.due_date);

  if (isEditing) {
    return (
      <input
        type="datetime-local"
        value={task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : ''}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-900 dark:text-white focus-ring"
      />
    );
  }

  if (!task.due_date) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">No due date set</p>
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
        isTaskOverdue
          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300'
      )}
    >
      <Calendar size={16} />
      <span className="text-sm font-medium">{formatDueDate(task.due_date)}</span>
      {isTaskOverdue && <AlertCircle size={16} />}
    </div>
  );
};

export default TaskDueDate;
