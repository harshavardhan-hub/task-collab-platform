import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            className="flex items-center gap-2 px-2 py-1.5 pr-3 bg-secondary-50 dark:bg-white/5 rounded-full border border-secondary-200/50 dark:border-white/5 group transition-all hover:border-red-200 dark:hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <Avatar user={assignee} size="sm" className="shadow-sm" />
            <span className="text-[13px] font-medium text-secondary-900 dark:text-white">
              {assignee.full_name}
            </span>
            <button
              onClick={() => onUnassign(task.id, assignee.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-secondary-400 hover:text-red-500 -ml-1 flex items-center justify-center p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20"
              title="Remove assignee"
            >
              <X size={14} strokeWidth={2.5}/>
            </button>
          </div>
        ))}

        {/* Add Assignee Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 pl-2 py-1.5 bg-white dark:bg-white/5 border border-dashed border-secondary-300 dark:border-white/20 text-secondary-600 dark:text-secondary-400 rounded-full hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors shadow-sm"
          >
            <div className="bg-secondary-100 dark:bg-white/10 rounded-full p-1 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                <Plus size={14} className="stroke-[3px]" />
            </div>
            <span className="text-[13px] font-medium pr-1">Assign</span>
          </button>

          <AnimatePresence>
            {showMenu && (
                <>
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                />
                <motion.div 
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#1A1A1D] rounded-xl shadow-xl border border-secondary-200/80 dark:border-white/10 py-2 z-20 max-h-64 overflow-y-auto custom-scrollbar"
                >
                    <div className="px-4 py-2 border-b border-secondary-100 dark:border-white/5 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary-400">Select Member</span>
                    </div>

                    {unassignedMembers.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-secondary-500 dark:text-secondary-400 italic text-center">
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
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 dark:hover:bg-white/5 transition-colors focus:outline-none focus:bg-secondary-50 dark:focus:bg-white/5"
                        >
                        <Avatar user={member} size="sm" />
                        <div className="text-left flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-secondary-900 dark:text-white truncate">
                            {member.full_name}
                            </p>
                            <p className="text-[11px] text-secondary-500 dark:text-secondary-400 truncate">
                            {member.email}
                            </p>
                        </div>
                        </button>
                    ))
                    )}
                </motion.div>
                </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignee;
