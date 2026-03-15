import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Calendar, Tag, AlertCircle, AlignLeft } from 'lucide-react';
import { PRIORITY_COLORS, EMOJI_LABELS } from '../../utils/constants';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const CreateTaskModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    labels: [],
    dueDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueDate: formData.dueDate || null,
    });
    setFormData({ 
      title: '', 
      description: '', 
      priority: 'medium', 
      labels: [], 
      dueDate: '' 
    });
  };

  const handleAddLabel = (emoji) => {
    if (!formData.labels.includes(emoji)) {
      setFormData({ 
        ...formData, 
        labels: [...formData.labels, emoji] 
      });
    }
  };

  const handleRemoveLabel = (emoji) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter((l) => l !== emoji),
    });
  };

  const handleClose = () => {
    setFormData({ 
      title: '', 
      description: '', 
      priority: 'medium', 
      labels: [], 
      dueDate: '' 
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* Title */}
        <Input
          label="Task Title"
          placeholder="e.g. Implement new authentication flow"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          fullWidth
          autoFocus
        />

        {/* Description */}
        <div>
          <label className="mb-2 text-[13px] font-semibold text-secondary-700 dark:text-secondary-300 flex items-center gap-1.5 uppercase tracking-wider">
            <AlignLeft size={16} />
            Description <span className="text-secondary-400 normal-case tracking-normal font-normal ml-1">(Optional)</span>
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-secondary-200/60 dark:border-white/10 bg-white dark:bg-[#1A1A1D]/50 text-secondary-900 dark:text-white placeholder:text-secondary-400 focus-ring transition-all min-h-[120px] resize-y custom-scrollbar text-[15px]"
            rows="4"
            placeholder="Add detailed information about this task... (Markdown supported)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
            <label className="mb-2 text-[13px] font-semibold text-secondary-700 dark:text-secondary-300 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle size={16} />
                Priority
            </label>
            <div className="grid grid-cols-2 gap-2">
                {['low', 'medium', 'high', 'urgent'].map((priority) => (
                <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={clsx(
                    'px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all border outline-none',
                    formData.priority === priority
                        ? 'border-transparent bg-secondary-900 dark:bg-white text-white dark:text-secondary-900 shadow-md ring-2 ring-primary-500/50 ring-offset-2 dark:ring-offset-[#1A1A1D]'
                        : 'border-secondary-200/60 dark:border-white/10 bg-secondary-50 dark:bg-white/5 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-white/10'
                    )}
                >
                    {/* Add color dot for visual weight */}
                    <div className="flex items-center justify-center gap-2">
                        <div className={clsx("w-2 h-2 rounded-full", formData.priority !== priority ? PRIORITY_COLORS[priority] : "bg-current opacity-80")} />
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </div>
                </button>
                ))}
            </div>
            </div>

            {/* Due Date */}
            <div>
            <label className="mb-2 text-[13px] font-semibold text-secondary-700 dark:text-secondary-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar size={16} />
                Due Date <span className="text-secondary-400 normal-case tracking-normal font-normal ml-1">(Optional)</span>
            </label>
            <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-[13px] rounded-xl border border-secondary-200/60 dark:border-white/10 bg-secondary-50 dark:bg-white/5 text-secondary-900 dark:text-white focus-ring transition-all hover:border-secondary-300 dark:hover:border-white/20 outline-none text-[14px]"
            />
            </div>
        </div>

        {/* Labels */}
        <div>
          <label className="mb-2 text-[13px] font-semibold text-secondary-700 dark:text-secondary-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Tag size={16} />
            Labels <span className="text-secondary-400 normal-case tracking-normal font-normal ml-1">(Optional)</span>
          </label>
          
          <div className="p-4 bg-secondary-50 dark:bg-white/5 rounded-xl border border-secondary-200/60 dark:border-white/10 shadow-sm">
            {/* Selected Labels */}
            {formData.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-secondary-200/60 dark:border-white/10">
                {formData.labels.map((label, index) => (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={index}
                        className="text-2xl p-2 bg-white dark:bg-white/10 rounded-lg shadow-sm border border-secondary-100 dark:border-white/5 cursor-pointer hover:border-red-300 dark:hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        onClick={() => handleRemoveLabel(label)}
                        title="Click to remove"
                    >
                    {label}
                    </motion.div>
                ))}
                </div>
            )}

            {/* Label Picker */}
            <div className="flex flex-wrap gap-2">
                {EMOJI_LABELS.map((emoji) => (
                <button
                    key={emoji}
                    type="button"
                    onClick={() => handleAddLabel(emoji)}
                    disabled={formData.labels.includes(emoji)}
                    className={clsx(
                    'text-2xl p-2.5 rounded-xl transition-all',
                    formData.labels.includes(emoji)
                        ? 'opacity-25 cursor-not-allowed scale-95'
                        : 'hover:bg-white dark:hover:bg-white/10 hover:shadow-sm hover:-translate-y-1 active:scale-95'
                    )}
                    title={emoji}
                >
                    {emoji}
                </button>
                ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 mt-6 border-t border-secondary-100/50 dark:border-white/5">
          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={!formData.title.trim()}
          >
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
