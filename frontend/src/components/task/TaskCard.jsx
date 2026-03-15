import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Paperclip, AlertCircle, CheckSquare } from 'lucide-react';
import Avatar from '../common/Avatar';
import { useTaskStore } from '../../store/taskStore';
import { formatDueDate, isOverdue } from '../../utils/helpers';
import { PRIORITY_COLORS } from '../../utils/constants';
import clsx from 'clsx';
import { motion } from 'framer-motion';

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
    zIndex: isDragging ? 50 : 1,
  };

  const isTaskOverdue = task.due_date && isOverdue(task.due_date);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => openTaskModal(task)}
      className={clsx(
        "group relative bg-white dark:bg-[#232326] rounded-xl p-3.5 outline-none cursor-grab active:cursor-grabbing hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-all duration-200 border border-secondary-200/50 dark:border-white/5 shadow-sm",
        isDragging && "opacity-60 scale-[1.02] shadow-xl ring-2 ring-primary-500"
      )}
    >
      {/* Priority Indicator Line */}
      {task.priority && task.priority !== 'medium' && (
        <div className={clsx('absolute top-0 left-0 bottom-0 w-[4px] rounded-l-xl', PRIORITY_COLORS[task.priority])} />
      )}

      {/* Title */}
      <h4 className="text-[14px] font-semibold text-secondary-900 dark:text-white mb-2 line-clamp-2 leading-snug tracking-tight">
        {task.title}
      </h4>

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {task.labels.slice(0, 3).map((label, index) => (
            <span key={index} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-secondary-100 dark:bg-white/10 text-secondary-600 dark:text-secondary-300">
              {label}
            </span>
          ))}
          {task.labels.length > 3 && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1 py-0.5 rounded-md text-secondary-400">
               +{task.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2">
        <div className="flex items-center gap-3">
            {/* Due Date */}
            {task.due_date && (
            <div
                className={clsx(
                'flex items-center gap-1.5 text-[11px] font-semibold tracking-wide',
                isTaskOverdue ? 'text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded-md' : 'text-secondary-500 dark:text-secondary-400'
                )}
            >
                <Calendar size={13} strokeWidth={2.5} />
                <span>{formatDueDate(task.due_date)}</span>
                {isTaskOverdue && <AlertCircle size={13} strokeWidth={2.5} className="ml-0.5" />}
            </div>
            )}

            {/* Attachment Indicator */}
            {task.attachment_url && (
            <div className="flex items-center text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors">
                <Paperclip size={13} strokeWidth={2.5} />
            </div>
            )}
            
            {!task.due_date && !task.attachment_url && (
                <div className="flex items-center text-secondary-400/50">
                    <CheckSquare size={13} strokeWidth={2.5} />
                </div>
            )}
        </div>

        {/* Assignees */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-2 relative z-10 transition-transform group-hover:scale-105">
            {task.assignees.slice(0, 2).map((assignee) => (
              <Avatar
                key={assignee.id}
                user={assignee}
                size="xs"
                className="ring-[2px] ring-white dark:ring-[#232326] shadow-sm transform hover:scale-110 hover:z-20 transition-transform"
              />
            ))}
            {task.assignees.length > 2 && (
              <div className="w-6 h-6 rounded-full bg-secondary-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold ring-[2px] ring-white dark:ring-[#232326] text-secondary-600 dark:text-secondary-300">
                +{task.assignees.length - 2}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
