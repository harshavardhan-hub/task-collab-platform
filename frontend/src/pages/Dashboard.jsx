import React, { useEffect, useState } from 'react';
import { Plus, Search, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import BoardList from '../components/board/BoardList';
import CreateBoardModal from '../components/board/CreateBoardModal';
import { useBoardStore } from '../store/boardStore';
import { boardAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/common/Toast';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { boards, setBoards, addBoard, isLoading, setLoading } = useBoardStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = await boardAPI.getAll();
      setBoards(response.data.boards);
    } catch (err) {
      error('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (formData) => {
    try {
      const response = await boardAPI.create(formData);
      addBoard(response.data.board);
      setShowCreateModal(false);
      success('Board created successfully!');
    } catch (err) {
      error('Failed to create board');
    }
  };

  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalBoards: boards.length,
    totalLists: boards.reduce((sum, board) => sum + (parseInt(board.list_count) || 0), 0),
    totalTasks: boards.reduce((sum, board) => sum + (parseInt(board.task_count) || 0), 0),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto pb-12"
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-white mb-2 tracking-tight">
            Overview
          </h1>
          <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
            Monitor your team's progress and manage your projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
           {/* Additional quick actions could go here */}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white dark:bg-[#1A1A1D] border border-secondary-200 dark:border-dark-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-bl-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-110" />
          <div className="flex flex-col relative z-10">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
              <Layers size={20} />
            </div>
            <p className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-1">Total Boards</p>
            <h3 className="text-3xl font-display font-bold text-secondary-900 dark:text-white">{stats.totalBoards}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1D] border border-secondary-200 dark:border-dark-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-bl-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-110" />
          <div className="flex flex-col relative z-10">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 flex items-center justify-center mb-4">
              <TrendingUp size={20} />
            </div>
            <p className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-1">Total Lists</p>
            <h3 className="text-3xl font-display font-bold text-secondary-900 dark:text-white">{stats.totalLists}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1D] border border-secondary-200 dark:border-dark-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-110" />
          <div className="flex flex-col relative z-10">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-1">Total Tasks</p>
            <h3 className="text-3xl font-display font-bold text-secondary-900 dark:text-white">{stats.totalTasks}</h3>
          </div>
        </div>
      </motion.div>

      {/* Actions Bar & Boards */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-secondary-900 dark:text-white">Your Boards</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 group">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-[#1A1A1D] text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
            />
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus size={18} />}
            className="whitespace-nowrap rounded-xl shadow-[0_2px_10px_rgba(94,106,210,0.3)]"
          >
            New Board
          </Button>
        </div>
      </motion.div>

      {/* Boards Grid */}
      <motion.div variants={itemVariants}>
        <BoardList boards={filteredBoards} loading={isLoading} />
      </motion.div>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBoard}
      />
    </motion.div>
  );
};

export default Dashboard;
