import React, { useState } from 'react';
import { UserPlus, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { getContrastColor } from '../../utils/helpers';
import clsx from 'clsx';
import { motion } from 'framer-motion';

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

  const bgColor = board.background_color || '#5E6AD2';
  const textColor = getContrastColor(bgColor);
  const isDarkText = textColor === '#000000';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden border border-black/5 dark:border-white/5 shadow-sm"
        style={{ backgroundColor: bgColor }}
      >
        {/* Decorative Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className={clsx(
                "mt-1 p-2 rounded-xl backdrop-blur-md transition-all shadow-sm",
                isDarkText ? "bg-black/5 hover:bg-black/10 text-secondary-900" : "bg-white/10 hover:bg-white/20 text-white"
              )}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1
                className={clsx(
                  "text-3xl sm:text-4xl font-display font-bold mb-2 tracking-tight drop-shadow-sm",
                  isDarkText ? "text-secondary-900" : "text-white"
                )}
              >
                {board.title}
              </h1>
              {board.description && (
                <p
                  className={clsx(
                    "text-[15px] leading-relaxed max-w-2xl drop-shadow-sm",
                    isDarkText ? "text-secondary-900/80" : "text-white/80"
                  )}
                >
                  {board.description}
                </p>
              )}
            </div>
          </div>

          {/* Members Area */}
          <div className="flex flex-row items-center justify-between gap-4 pt-4 border-t border-white/20 dark:border-black/10 w-full overflow-hidden">
            {/* Left Box: Team Members */}
            <div className="flex flex-row items-center gap-3 overflow-x-auto flex-1">
              <span
                className={clsx(
                  "text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap shrink-0",
                  isDarkText ? "text-secondary-900/70" : "text-white/70"
                )}
              >
                Team Members
              </span>
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {board.members?.map((member) => (
                    <div key={member.id} className="relative group/avatar shrink-0">
                      <Avatar
                        user={member}
                        size="sm"
                        className="ring-2 ring-white/20 shadow-md cursor-pointer transition-transform hover:-translate-y-1 hover:z-10"
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-xl border border-white/10">
                        {member.full_name} {member.role === 'owner' && <span className="opacity-50">(Owner)</span>}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1C1C1F]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Box: Invite & Delete */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowAddMember(true)}
                className={clsx(
                  "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-xl backdrop-blur-md transition-all shadow-sm",
                  isDarkText ? "bg-black/5 hover:bg-black/10 text-secondary-900" : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                <UserPlus size={18} />
                <span className="hidden sm:inline">Invite</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-xl backdrop-blur-md transition-all shadow-sm bg-red-500/80 hover:bg-red-500 text-white"
                title="Delete Board"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        title="Invite Team Member"
        size="sm"
      >
        <form onSubmit={handleAddMember} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="member@example.com"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            required
            fullWidth
          />
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
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
              Send Invite
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

export default BoardHeader;
