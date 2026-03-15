import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ListHeader from './ListHeader';
import TaskCard from '../task/TaskCard';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const List = ({ list, onAddTask, onUpdateList, onDeleteList }) => {
  const { setNodeRef } = useDroppable({
    id: `list-${list.id}`,
  });

  const taskIds = (list.tasks || []).map((task) => `task-${task.id}`);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 w-[320px] bg-secondary-50/50 dark:bg-[#1A1A1D]/80 border border-secondary-200/60 dark:border-white/5 rounded-2xl flex flex-col max-h-[calc(100vh-16rem)] shadow-sm backdrop-blur-sm"
    >
      <div className="p-4 pb-2 border-b border-secondary-200/60 dark:border-white/5">
        <ListHeader
          list={list}
          taskCount={list.tasks?.length || 0}
          onUpdate={onUpdateList}
          onDelete={onDeleteList}
        />
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar min-h-[100px]"
      >
        <div className="space-y-3">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {(list.tasks || []).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>

        {list.tasks?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 opacity-50">
            <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Empty list</p>
          </div>
        )}
      </div>

      <div className="p-3 pt-0">
        <button
          onClick={() => onAddTask(list.id)}
          className="group flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-transparent hover:border-secondary-200 dark:hover:border-dark-border bg-transparent hover:bg-white dark:hover:bg-[#232326] text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white transition-all text-[13px] font-semibold tracking-wide shadow-sm hover:shadow"
        >
          <Plus size={16} className="transition-transform group-hover:scale-110" />
          Create Task
        </button>
      </div>
    </motion.div>
  );
};

export default List;
