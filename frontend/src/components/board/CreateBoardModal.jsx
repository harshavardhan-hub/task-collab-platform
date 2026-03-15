import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { BOARD_COLORS } from '../../utils/constants';
import { Check, AlignLeft, Palette } from 'lucide-react';
import clsx from 'clsx';

const CreateBoardModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    backgroundColor: BOARD_COLORS[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', backgroundColor: BOARD_COLORS[0] });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Board" size="md">
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <Input
          label="Board Title"
          placeholder="e.g., Marketing Campaign Q4"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          fullWidth
        />

        <div>
          <label className="mb-2 text-[13px] font-semibold text-secondary-700 dark:text-secondary-300 flex items-center gap-1.5 uppercase tracking-wider">
            <AlignLeft size={16} />
            Description <span className="text-secondary-400 normal-case tracking-normal font-normal ml-1">(Optional)</span>
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-secondary-200/60 dark:border-white/10 bg-white dark:bg-[#1A1A1D]/50 text-secondary-900 dark:text-white placeholder:text-secondary-400 focus-ring transition-all min-h-[100px] resize-y custom-scrollbar text-[15px]"
            rows="3"
            placeholder="What is this board about?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-3 text-[13px] font-semibold text-secondary-700 dark:text-secondary-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Palette size={16} />
            Background Color
          </label>
          <div className="grid grid-cols-5 gap-3">
            {BOARD_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, backgroundColor: color })}
                className={clsx(
                  'relative h-12 rounded-xl transition-all hover:scale-110 active:scale-95 duration-200 shadow-sm',
                  formData.backgroundColor === color ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-[#1A1A1D] scale-105' : 'hover:shadow-md'
                )}
                style={{ backgroundColor: color }}
              >
                {formData.backgroundColor === color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check size={20} className="text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6 mt-4 border-t border-secondary-100/50 dark:border-white/5">
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
            Create Board
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBoardModal;
