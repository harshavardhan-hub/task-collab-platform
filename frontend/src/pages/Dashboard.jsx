import React, { useEffect, useState } from 'react';
import { Plus, Search, TrendingUp } from 'lucide-react';
import Button from '../components/common/Button';
import BoardList from '../components/board/BoardList';
import CreateBoardModal from '../components/board/CreateBoardModal';
import { useBoardStore } from '../store/boardStore';
import { boardAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/common/Toast';

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
    totalTasks: boards.reduce((sum, board) => sum + (parseInt(board.task_count) || 0), 0),
    totalLists: boards.reduce((sum, board) => sum + (parseInt(board.list_count) || 0), 0),
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your boards and collaborate with your team
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Boards</h3>
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.totalBoards}</p>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Lists</h3>
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.totalLists}</p>
        </div>

        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Tasks</h3>
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.totalTasks}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder:text-gray-400 focus-ring"
          />
        </div>

        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          leftIcon={<Plus size={20} />}
        >
          Create Board
        </Button>
      </div>

      {/* Boards Grid */}
      <BoardList boards={filteredBoards} loading={isLoading} />

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBoard}
      />
    </div>
  );
};

export default Dashboard;
