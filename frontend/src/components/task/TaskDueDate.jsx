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
        className="px-3 py-1.5 rounded-lg border border-secondary-200 dark:border-white/10 bg-white dark:bg-[#232326] text-[13px] font-medium focus-ring shadow-sm outline-none"
      />
    );
  }

  if (!task.due_date) {
    return (
      <p className="text-[13px] italic text-secondary-500 dark:text-secondary-400">No date set</p>
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium border shadow-sm transition-colors',
        isTaskOverdue
          ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
          : 'bg-white dark:bg-white/5 text-secondary-700 dark:text-secondary-300 border-secondary-200/60 dark:border-white/5'
      )}
    >
      <Calendar size={14} className={isTaskOverdue ? "text-red-500" : "text-secondary-400 dark:text-secondary-500"} />
      <span>{formatDueDate(task.due_date)}</span>
      {isTaskOverdue && <AlertCircle size={14} className="text-red-500" />}
    </div>
  );
};

export default TaskDueDate;
