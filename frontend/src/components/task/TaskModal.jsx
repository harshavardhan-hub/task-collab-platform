import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import TaskAssignee from './TaskAssignee';
import ReactMarkdown from 'react-markdown';
import { Calendar, Users, Tag, Paperclip, Trash2, Edit2, Save, AlertCircle } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useBoardStore } from '../../store/boardStore';
import { formatDate, isOverdue } from '../../utils/helpers';
import { PRIORITY_COLORS, EMOJI_LABELS } from '../../utils/constants';
import clsx from 'clsx';

const TaskModal = ({ onUpdate, onDelete, onAssign, onUnassign }) => {
  const { selectedTask, isTaskModalOpen, closeTaskModal } = useTaskStore();
  const { activeBoard } = useBoardStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    labels: [],
    dueDate: '',
  });

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title || '',
        description: selectedTask.description || '',
        priority: selectedTask.priority || 'medium',
        labels: selectedTask.labels || [],
        dueDate: selectedTask.due_date ? new Date(selectedTask.due_date).toISOString().slice(0, 16) : '',
      });
    }
  }, [selectedTask]);

  if (!selectedTask) return null;

  const handleSave = async () => {
    await onUpdate(selectedTask.id, {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      labels: formData.labels,
      dueDate: formData.dueDate || null,
    });
    setIsEditing(false);
  };

  const handleAddLabel = (emoji) => {
    if (!formData.labels.includes(emoji)) {
      const newLabels = [...formData.labels, emoji];
      setFormData({ ...formData, labels: newLabels });
    }
  };

  const handleRemoveLabel = (emoji) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter((l) => l !== emoji),
    });
  };

  const isTaskOverdue = selectedTask.due_date && isOverdue(selectedTask.due_date);

  return (
    <Modal
      isOpen={isTaskModalOpen}
      onClose={closeTaskModal}
      size="lg"
      title={isEditing ? 'Edit Task' : ''}
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          {isEditing ? (
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-2xl font-bold px-0 py-2 bg-transparent border-b-2 border-primary-500 focus:outline-none text-gray-900 dark:text-white"
              placeholder="Task title"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedTask.title}
            </h2>
          )}
        </div>

        {/* Priority & Labels */}
        <div className="flex flex-wrap gap-4">
          {/* Priority */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
            {isEditing ? (
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-sm focus-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            ) : (
              <span
                className={clsx(
                  'px-3 py-1 rounded-full text-white text-xs font-medium',
                  PRIORITY_COLORS[selectedTask.priority || 'medium']
                )}
              >
                {(selectedTask.priority || 'medium').toUpperCase()}
              </span>
            )}
          </div>

          {/* Labels */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">Labels:</span>
            <div className="flex flex-wrap gap-1">
              {formData.labels.map((label, index) => (
                <span
                  key={index}
                  className="text-lg cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => isEditing && handleRemoveLabel(label)}
                  title={isEditing ? 'Click to remove' : ''}
                >
                  {label}
                </span>
              ))}
              {isEditing && (
                <div className="relative group">
                  <button className="px-2 py-1 text-sm bg-gray-100 dark:bg-dark-hover rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                    +
                  </button>
                  <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-dark-card rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 hidden group-hover:grid grid-cols-6 gap-2 z-10">
                    {EMOJI_LABELS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddLabel(emoji)}
                        className="text-lg hover:scale-125 transition-transform"
                        type="button"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Edit2 size={16} />
            Description
          </h3>
          {isEditing ? (
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-900 dark:text-white focus-ring min-h-[150px]"
              placeholder="Add description (supports markdown)..."
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-dark-hover rounded-lg p-4">
              {selectedTask.description ? (
                <ReactMarkdown>{selectedTask.description}</ReactMarkdown>
              ) : (
                <p className="text-gray-400">No description</p>
              )}
            </div>
          )}
        </div>

        {/* Due Date */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Calendar size={16} />
            Due Date
          </h3>
          {isEditing ? (
            <input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-900 dark:text-white focus-ring"
            />
          ) : selectedTask.due_date ? (
            <div
              className={clsx(
                'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
                isTaskOverdue
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300'
              )}
            >
              <Calendar size={16} />
              <span className="text-sm font-medium">{formatDate(selectedTask.due_date)}</span>
              {isTaskOverdue && <AlertCircle size={16} />}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No due date set</p>
          )}
        </div>

        {/* Assignees */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Users size={16} />
            Assignees
          </h3>
          <TaskAssignee
            task={selectedTask}
            boardMembers={activeBoard?.members || []}
            onAssign={onAssign}
            onUnassign={onUnassign}
          />
        </div>

        {/* Attachment */}
        {selectedTask.attachment_url && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Paperclip size={16} />
              Attachment
            </h3>
            <a
              href={selectedTask.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-hover rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-base text-sm"
            >
              <Paperclip size={14} />
              View Attachment
            </a>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm('Delete this task?')) {
                onDelete(selectedTask.id);
                closeTaskModal();
              }
            }}
            leftIcon={<Trash2 size={16} />}
          >
            Delete Task
          </Button>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      title: selectedTask.title,
                      description: selectedTask.description,
                      priority: selectedTask.priority,
                      labels: selectedTask.labels || [],
                      dueDate: selectedTask.due_date ? new Date(selectedTask.due_date).toISOString().slice(0, 16) : '',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  leftIcon={<Save size={16} />}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
                leftIcon={<Edit2 size={16} />}
              >
                Edit Task
              </Button>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p>Created {formatDate(selectedTask.created_at)}</p>
          {selectedTask.updated_at !== selectedTask.created_at && (
            <p>Last updated {formatDate(selectedTask.updated_at)}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
