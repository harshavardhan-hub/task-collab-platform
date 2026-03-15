import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Users, Trash2, AlertTriangle } from 'lucide-react';
import Avatar from '../common/Avatar';
import ManageMembersModal from './ManageMembersModal';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { getContrastColor } from '../../utils/helpers';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useState } from 'react';
import { boardAPI } from '../../services/api';
import { useBoardStore } from '../../store/boardStore';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/useToast';

const BoardCard = ({ board }) => {
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { updateBoard, deleteBoard } = useBoardStore();
  const { user } = useAuthStore();
  const { success, error } = useToast();

  const isOwner = user?.id === board?.owner_id;

  const handleAddMember = async (email) => {
    try {
      const response = await boardAPI.addMember(board.id, email);
      const newMember = response.data.member;
      updateBoard(board.id, { members: [...(board.members || []), newMember] });
      success('Member added!');
    } catch (err) {
      error(err?.response?.data?.error || 'Failed to add member');
      throw err;
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await boardAPI.removeMember(board.id, memberId);
      updateBoard(board.id, { members: board.members.filter(m => m.id !== memberId) });
      success('Member removed!');
    } catch (err) {
      error(err?.response?.data?.error || 'Failed to remove member');
      throw err;
    }
  };

  const handleDeleteBoard = async () => {
    setDeleteLoading(true);
    try {
      await boardAPI.delete(board.id);
      deleteBoard(board.id);
      success('Board deleted successfully!');
      setShowDeleteConfirm(false);
    } catch (err) {
      error(err?.response?.data?.error || 'Failed to delete board');
    } finally {
      setDeleteLoading(false);
    }
  };

  const bgColor = board.background_color || '#5E6AD2';
  const textColor = getContrastColor(bgColor);
  const isDarkText = textColor === '#000000';

  return (
    <>
      <motion.div
        whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
        whileTap={{ scale: 0.98 }}
      >
      <Link
        to={`/boards/${board.id}`}
        className="block group outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-[20px]"
      >
        <div
          className="relative h-44 rounded-[20px] p-6 shadow-sm group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-shadow duration-300 overflow-hidden border border-black/5 dark:border-white/5"
          style={{ backgroundColor: bgColor }}
        >
          {/* Subtle overlay gradients */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3
                className={clsx("text-[22px] font-display font-bold mb-1.5 truncate tracking-tight drop-shadow-sm", isDarkText ? 'text-secondary-900' : 'text-white')}
              >
                {board.title}
              </h3>
              {board.description && (
                <p
                  className={clsx("text-sm truncate-2 drop-shadow-sm leading-snug", isDarkText ? 'text-secondary-800/80' : 'text-white/80')}
                >
                  {board.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              {/* Members */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2.5">
                  {board.members?.slice(0, 3).map((member) => (
                    <Avatar
                      key={member.id}
                      user={member}
                      size="sm"
                      className="ring-2 ring-white/20 shadow-sm"
                    />
                  ))}
                  {board.members?.length > 3 && (
                    <div
                      className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white/20 shadow-sm backdrop-blur-md bg-white/20",
                        isDarkText ? 'text-secondary-900' : 'text-white'
                      )}
                    >
                      +{board.members.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-1 cursor-default">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowManageMembers(true);
                    }}
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ring-2 ring-white/20 border border-transparent backdrop-blur-md bg-white/10 hover:bg-white/30",
                      isDarkText ? 'text-secondary-900' : 'text-white'
                    )}
                    title="Manage Board Members"
                  >
                    <Users size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ring-2 ring-white/20 border border-transparent backdrop-blur-md bg-red-500/80 hover:bg-red-500 text-white"
                    title="Delete Board"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div 
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-md bg-white/20 border border-white/10 shadow-sm transition-colors",
                  isDarkText ? 'text-secondary-900' : 'text-white'
                )}
              >
                <CheckSquare size={14} className={isDarkText ? 'opacity-70' : 'opacity-80'} strokeWidth={2.5} />
                <span className="text-xs font-bold">{board.task_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
        </Link>
      </motion.div>

      <ManageMembersModal
        isOpen={showManageMembers}
        onClose={() => setShowManageMembers(false)}
        board={board}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Board"
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400">
              <AlertTriangle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-300 mb-1.5">
                Are you absolutely sure?
              </h4>
              <p className="text-[13px] text-red-700 dark:text-red-400/80 leading-relaxed">
                This action cannot be undone. This will permanently delete the <strong>{board.title}</strong> board, all of its lists, tasks, activity history, and assigned members.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
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
              Yes, delete board
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BoardCard;
