import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import TaskAssignee from './TaskAssignee';
import ReactMarkdown from 'react-markdown';
import { Calendar, Users, Tag, Paperclip, Trash2, Edit2, Save, AlertCircle, Clock, Info } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useBoardStore } from '../../store/boardStore';
import { formatDate, isOverdue } from '../../utils/helpers';
import { PRIORITY_COLORS, EMOJI_LABELS } from '../../utils/constants';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

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
      setIsEditing(false);
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
      setFormData({ ...formData, labels: [...formData.labels, emoji] });
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
      size="3xl"
      title=""
      className="p-0 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row h-full max-h-[85vh]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 lg:pr-6">
          <div className="max-w-3xl space-y-8">
            {/* Title */}
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-3xl font-display font-bold px-0 py-2 bg-transparent border-b-2 border-primary-500/50 focus:border-primary-500 focus:outline-none text-secondary-900 dark:text-white transition-colors placeholder:text-secondary-300"
                  placeholder="Task title"
                />
              ) : (
                <h2 className="text-3xl font-display font-bold text-secondary-900 dark:text-white leading-tight">
                  {selectedTask.title}
                </h2>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
                  <Edit2 size={16} />
                  Description
                </h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-medium text-secondary-400 hover:text-primary-500 transition-colors bg-secondary-50 dark:bg-white/5 py-1 px-3 rounded-full"
                  >
                    Edit Description
                  </button>
                )}
              </div>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-secondary-200/60 dark:border-white/10 bg-white/50 dark:bg-[#1A1A1D]/50 text-secondary-900 dark:text-white focus-ring min-h-[250px] resize-y custom-scrollbar text-[15px] leading-relaxed"
                  placeholder="Add a more detailed description... (Markdown supported)"
                />
              ) : (
                <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none hover:bg-secondary-50/50 dark:hover:bg-white/5 p-4 -ml-4 rounded-2xl transition-colors cursor-text group" onClick={() => setIsEditing(true)}>
                  {selectedTask.description ? (
                    <ReactMarkdown>{selectedTask.description}</ReactMarkdown>
                  ) : (
                    <p className="text-secondary-400 opacity-60 italic group-hover:opacity-100 transition-opacity">Add a more detailed description...</p>
                  )}
                </div>
              )}
            </div>

            {/* Attachment Area (Below description in main flow) */}
            {selectedTask.attachment_url && (
              <div className="pt-6 border-t border-secondary-100 dark:border-white/5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-4 flex items-center gap-2">
                  <Paperclip size={16} />
                  Attachments
                </h3>
                <a
                  href={selectedTask.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 p-4 bg-secondary-50 dark:bg-white/5 rounded-xl border border-secondary-200/50 dark:border-white/10 hover:border-primary-500/50 transition-all group"
                >
                  <div className="p-2 bg-white dark:bg-white/10 rounded-lg shadow-sm group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 text-primary-500">
                    <Paperclip size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary-900 dark:text-white">View Attached File</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">External link</p>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Metadata */}
        <div className="w-full lg:w-72 bg-secondary-50/50 dark:bg-black/20 border-l border-secondary-200/60 dark:border-white/5 p-4 lg:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          
          {/* Status / Priority */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary-400 dark:text-secondary-500">Properties</h4>
            
            <div className="flex flex-col gap-3 text-sm">
              {/* Priority */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-secondary-500 dark:text-secondary-400 text-xs flex items-center gap-1.5"><Info size={13}/> Priority</span>
                {isEditing ? (
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="px-2 py-1 rounded-md border border-secondary-200 dark:border-white/10 bg-white dark:bg-[#232326] text-[12px] font-medium focus-ring shadow-sm w-full lg:w-auto"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                ) : (
                  <span
                    className={clsx(
                      'px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow-sm',
                      PRIORITY_COLORS[selectedTask.priority || 'medium']
                    )}
                  >
                    {(selectedTask.priority || 'medium')}
                  </span>
                )}
              </div>

              {/* Due Date */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-secondary-500 dark:text-secondary-400 text-xs flex items-center gap-1.5"><Calendar size={13}/> Due Date</span>
                {isEditing ? (
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="px-2 py-1 rounded-md border border-secondary-200 dark:border-white/10 bg-white dark:bg-[#232326] text-[12px] font-medium focus-ring shadow-sm w-full lg:w-auto"
                  />
                ) : selectedTask.due_date ? (
                  <div
                    className={clsx(
                      'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium border shadow-sm',
                      isTaskOverdue
                        ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
                        : 'bg-white dark:bg-white/5 text-secondary-700 dark:text-secondary-300 border-secondary-200/60 dark:border-white/5'
                    )}
                  >
                    <span>{formatDate(selectedTask.due_date)}</span>
                    {isTaskOverdue && <AlertCircle size={12} className="text-red-500" />}
                  </div>
                ) : (
                  <span className="text-secondary-400 dark:text-secondary-500 italic text-[11px]">No date set</span>
                )}
              </div>
            </div>
          </div>

          {/* Assignees */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary-400 dark:text-secondary-500 flex items-center gap-1.5">
              <Users size={13}/> Assignees
            </h4>
            <div className="bg-white dark:bg-white/5 rounded-lg p-2 border border-secondary-200/50 dark:border-white/5 shadow-sm">
              <TaskAssignee
                task={selectedTask}
                boardMembers={activeBoard?.members || []}
                onAssign={onAssign}
                onUnassign={onUnassign}
              />
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary-400 dark:text-secondary-500 flex items-center gap-1.5">
                <Tag size={13}/> Labels
              </h4>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.labels.map((label, index) => (
                <span
                  key={index}
                  className={clsx(
                    "text-lg p-1 rounded-md bg-white dark:bg-white/10 shadow-sm border border-secondary-200/50 dark:border-white/5",
                    isEditing && "cursor-pointer hover:scale-110 hover:bg-red-50 dark:hover:bg-red-500/20 hover:border-red-200 dark:hover:border-red-500/30 transition-all"
                  )}
                  onClick={() => isEditing && handleRemoveLabel(label)}
                  title={isEditing ? 'Remove label' : label}
                >
                  {label}
                </span>
              ))}
              {!isEditing && formData.labels.length === 0 && (
                <span className="text-secondary-400 dark:text-secondary-500 italic text-[11px]">No labels</span>
              )}
              {isEditing && (
                <div className="relative group/label">
                  <button className="flex items-center justify-center w-8 h-8 border-2 border-dashed border-secondary-300 dark:border-white/20 rounded-md text-secondary-500 hover:border-primary-500 hover:text-primary-500 transition-colors">
                    <span className="text-lg leading-none mb-1">+</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 p-2 bg-white dark:bg-[#1A1A1D] rounded-xl shadow-xl border border-secondary-200 dark:border-white/10 hidden group-hover/label:grid grid-cols-5 gap-1 z-20 w-44">
                    {EMOJI_LABELS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddLabel(emoji)}
                        className="text-xl hover:scale-125 hover:bg-secondary-50 dark:hover:bg-white/10 p-1 rounded transition-all"
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

          <div className="mt-auto pt-8 flex flex-col gap-4">
            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  leftIcon={<Save size={16} />}
                  fullWidth
                  className="shadow-md"
                >
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
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
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                 <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  leftIcon={<Edit2 size={16} />}
                  className="flex-1 bg-white dark:bg-white/5"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to permanently delete this task?')) {
                      onDelete(selectedTask.id);
                      closeTaskModal();
                    }
                  }}
                  className="px-3"
                  title="Delete Task"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            )}

            {/* Metadata Footer */}
            <div className="text-[10px] text-secondary-400 dark:text-secondary-500 flex flex-col gap-0.5 border-t border-secondary-200/60 dark:border-white/5 pt-3">
              <div className="flex items-center gap-1.5"><Clock size={10}/> Created: {formatDate(selectedTask.created_at)}</div>
              {selectedTask.updated_at !== selectedTask.created_at && (
                <div className="flex items-center gap-1.5"><Edit2 size={10}/> Updated: {formatDate(selectedTask.updated_at)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
