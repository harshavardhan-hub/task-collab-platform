import React, { useState } from 'react';
import { Settings, UserPlus, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { getContrastColor } from '../../utils/helpers';

const BoardHeader = ({ board, onAddMember, onDelete }) => {
  const navigate = useNavigate();
  const [showAddMember, setShowAddMember] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAddMember(memberEmail);
    setLoading(false);
    setMemberEmail('');
    setShowAddMember(false);
  };

  const handleDeleteBoard = async () => {
    setDeleteLoading(true);
    await onDelete(board.id);
    setDeleteLoading(false);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        className="rounded-2xl p-6 mb-6 shadow-lg"
        style={{ backgroundColor: board.background_color }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: getContrastColor(board.background_color) }}
              >
                {board.title}
              </h1>
              {board.description && (
                <p
                  className="text-sm opacity-90"
                  style={{ color: getContrastColor(board.background_color) }}
                >
                  {board.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddMember(true)}
              className="text-white hover:bg-white/20"
              title="Add Member"
            >
              <UserPlus size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-white hover:bg-red-500/30"
              title="Delete Board"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium opacity-90"
            style={{ color: getContrastColor(board.background_color) }}
          >
            Members:
          </span>
          <div className="flex -space-x-2">
            {board.members?.map((member) => (
              <div key={member.id} className="relative group">
                <Avatar
                  user={member}
                  size="sm"
                  className="ring-2 ring-white dark:ring-dark-card cursor-pointer"
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {member.full_name} {member.role === 'owner' && '(Owner)'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        title="Add Member"
        size="sm"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="member@example.com"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            required
            fullWidth
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => setShowAddMember(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Add Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Board"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Warning: This action cannot be undone
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Deleting this board will permanently remove:
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside mt-2 space-y-1">
                <li>All lists and tasks</li>
                <li>All task assignments</li>
                <li>All activity history</li>
                <li>All board members</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Board: <span className="font-semibold">{board.title}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              fullWidth
              loading={deleteLoading}
              onClick={handleDeleteBoard}
            >
              Delete Board
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BoardHeader;
