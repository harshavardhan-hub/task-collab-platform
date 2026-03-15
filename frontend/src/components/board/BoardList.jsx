import React from 'react';
import BoardCard from './BoardCard';
import { BoardCardSkeleton } from '../common/Skeleton';
import { motion } from 'framer-motion';
import { KanbanSquare } from 'lucide-react';

const BoardList = ({ boards, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <BoardCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-secondary-200 dark:border-dark-border rounded-3xl bg-white/50 dark:bg-[#1A1A1D]/50 backdrop-blur-sm"
      >
        <div className="w-20 h-20 mb-6 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center shadow-inner">
          <KanbanSquare size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-display font-semibold text-secondary-900 dark:text-white mb-3 tracking-tight">
          No boards yet
        </h3>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 max-w-sm mb-8 leading-relaxed">
          Get started by creating your first board. Organize tasks, collaborate with your team, and ship faster.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
};

export default BoardList;
