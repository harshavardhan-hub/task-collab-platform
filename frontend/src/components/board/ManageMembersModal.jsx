import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Avatar from '../common/Avatar';
import { UserPlus, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import clsx from 'clsx';

const ManageMembersModal = ({ isOpen, onClose, board, onAddMember, onRemoveMember }) => {
  const { user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const isOwner = user?.id === board?.owner_id;

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await onAddMember(email);
      setEmail('');
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId) => {
    setRemovingId(memberId);
    try {
      await onRemoveMember(memberId);
    } catch (error) {
      // Error handled by parent
    } finally {
      setRemovingId(null);
    }
  };

  if (!board) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Board Members"
      size="md"
    >
      <div className="space-y-6">
        {/* Invite Section */}
        <div className="bg-secondary-50 dark:bg-[#1C1C1F] p-4 rounded-xl border border-secondary-200 dark:border-white/5">
          <h4 className="text-sm font-semibold text-secondary-900 dark:text-white mb-3 flex items-center gap-2">
            <UserPlus size={16} className="text-primary-500" />
            Invite New Member
          </h4>
          <form onSubmit={handleInvite} className="flex gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                fullWidth
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!email || loading}
              loading={loading}
              className="flex-shrink-0"
            >
              Invite
            </Button>
          </form>
        </div>

        {/* Members List */}
        <div>
          <h4 className="text-sm font-semibold text-secondary-900 dark:text-white mb-3">
            Current Members ({board.members?.length || 0})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
            {board.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1A1A1D] border border-secondary-200 dark:border-white/5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar user={member} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                      {member.full_name}
                      {member.id === board.owner_id && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                          Owner
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {member.email}
                    </p>
                  </div>
                </div>

                {isOwner && member.id !== board.owner_id && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    disabled={removingId === member.id}
                    className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove member"
                  >
                    {removingId === member.id ? (
                      <div className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                    ) : (
                      <X size={16} strokeWidth={2.5} />
                    )}
                  </button>
                )}
              </div>
            ))}
            
            {(!board.members || board.members.length === 0) && (
              <p className="text-sm text-center text-secondary-500 py-4">No members found.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ManageMembersModal;
