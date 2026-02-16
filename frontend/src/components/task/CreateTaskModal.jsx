import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Calendar, Tag, AlertCircle } from 'lucide-react';
import { PRIORITY_COLORS, EMOJI_LABELS } from '../../utils/constants';
import clsx from 'clsx';

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
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <Input
          label="Task Title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          fullWidth
          autoFocus
        />

        {/* Description */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
            Description (Optional)
          </label>
          <textarea
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus-ring transition-base"
            rows="4"
            placeholder="Enter task description (supports markdown)..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <AlertCircle size={16} />
            Priority
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['low', 'medium', 'high', 'urgent'].map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setFormData({ ...formData, priority })}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  formData.priority === priority
                    ? `${PRIORITY_COLORS[priority]} text-white ring-2 ring-offset-2 dark:ring-offset-dark-bg`
                    : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Tag size={16} />
            Labels (Optional)
          </label>
          
          {/* Selected Labels */}
          {formData.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
              {formData.labels.map((label, index) => (
                <span
                  key={index}
                  className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleRemoveLabel(label)}
                  title="Click to remove"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Label Picker */}
          <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
            {EMOJI_LABELS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleAddLabel(emoji)}
                disabled={formData.labels.includes(emoji)}
                className={clsx(
                  'text-2xl p-2 rounded-lg transition-all hover:scale-110',
                  formData.labels.includes(emoji)
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-white dark:hover:bg-dark-card cursor-pointer'
                )}
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Calendar size={16} />
            Due Date (Optional)
          </label>
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-900 dark:text-white focus-ring transition-base"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
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
