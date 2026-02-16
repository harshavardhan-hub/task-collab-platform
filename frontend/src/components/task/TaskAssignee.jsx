import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import { Plus, X } from 'lucide-react';

const TaskAssignee = ({ task, boardMembers, onAssign, onUnassign }) => {
  const [showMenu, setShowMenu] = useState(false);

  const assignedIds = (task.assignees || []).map((a) => a.id);
  const unassignedMembers = boardMembers.filter((m) => !assignedIds.includes(m.id));

  return (
    <div className="space-y-3">
      {/* Current Assignees */}
      <div className="flex flex-wrap gap-2">
        {(task.assignees || []).map((assignee) => (
          <div
            key={assignee.id}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-dark-hover rounded-lg group"
          >
            <Avatar user={assignee} size="sm" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {assignee.full_name}
            </span>
            <button
              onClick={() => onUnassign(task.id, assignee.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Add Assignee Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-base"
          >
            <Plus size={16} />
            <span className="text-sm font-medium">Assign</span>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-20 max-h-64 overflow-y-auto custom-scrollbar">
                {unassignedMembers.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    All members assigned
                  </p>
                ) : (
                  unassignedMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        onAssign(task.id, member.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover transition-base"
                    >
                      <Avatar user={member} size="sm" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.full_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskAssignee;
