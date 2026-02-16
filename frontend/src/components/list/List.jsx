import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ListHeader from './ListHeader';
import TaskCard from '../task/TaskCard';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

const List = ({ list, onAddTask, onUpdateList, onDeleteList }) => {
  const { setNodeRef } = useDroppable({
    id: `list-${list.id}`,
  });

  const taskIds = (list.tasks || []).map((task) => `task-${task.id}`);

  return (
    <div className="flex-shrink-0 w-80 bg-gray-100 dark:bg-dark-hover rounded-xl p-4 flex flex-col max-h-[calc(100vh-16rem)]">
      <ListHeader
        list={list}
        taskCount={list.tasks?.length || 0}
        onUpdate={onUpdateList}
        onDelete={onDeleteList}
      />

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-3 py-2"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {(list.tasks || []).map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {list.tasks?.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
            No tasks yet
          </div>
        )}
      </div>

      <button
        onClick={() => onAddTask(list.id)}
        className="mt-3 flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-base text-sm font-medium"
      >
        <Plus size={16} />
        Add Task
      </button>
    </div>
  );
};

export default List;
