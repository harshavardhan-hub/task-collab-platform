import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Paperclip, MessageSquare, AlertCircle } from 'lucide-react';
import Avatar from '../common/Avatar';
import { useTaskStore } from '../../store/taskStore';
import { formatDueDate, isOverdue } from '../../utils/helpers';
import { PRIORITY_COLORS } from '../../utils/constants';
import clsx from 'clsx';

const TaskCard = ({ task }) => {
  const { openTaskModal } = useTaskStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${task.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isTaskOverdue = task.due_date && isOverdue(task.due_date);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => openTaskModal(task)}
      className="bg-white dark:bg-dark-card rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-700 group"
    >
      {/* Priority Indicator */}
      {task.priority && task.priority !== 'medium' && (
        <div className={clsx('h-1 w-full rounded-full mb-2', PRIORITY_COLORS[task.priority])} />
      )}

      {/* Title */}
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.slice(0, 3).map((label, index) => (
            <span key={index} className="text-lg">
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        {/* Due Date */}
        {task.due_date && (
          <div
            className={clsx(
              'flex items-center gap-1 text-xs',
              isTaskOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            )}
          >
            <Calendar size={12} />
            <span>{formatDueDate(task.due_date)}</span>
            {isTaskOverdue && <AlertCircle size={12} />}
          </div>
        )}

        {/* Assignees */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-2">
            {task.assignees.slice(0, 2).map((assignee) => (
              <Avatar
                key={assignee.id}
                user={assignee}
                size="xs"
                className="ring-2 ring-white dark:ring-dark-card"
              />
            ))}
            {task.assignees.length > 2 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium ring-2 ring-white dark:ring-dark-card">
                +{task.assignees.length - 2}
              </div>
            )}
          </div>
        )}

        {/* Attachment Indicator */}
        {task.attachment_url && (
          <Paperclip size={12} className="text-gray-400" />
        )}
      </div>
    </div>
  );
};

export default TaskCard;
