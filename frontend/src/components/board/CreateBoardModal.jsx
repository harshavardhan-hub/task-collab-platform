import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { BOARD_COLORS } from '../../utils/constants';
import { Check } from 'lucide-react';
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Board Title"
          placeholder="Enter board title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          fullWidth
        />

        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
            Description (Optional)
          </label>
          <textarea
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus-ring transition-base"
            rows="3"
            placeholder="Enter board description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Background Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {BOARD_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, backgroundColor: color })}
                className={clsx(
                  'relative h-12 rounded-lg transition-all hover:scale-105',
                  formData.backgroundColor === color && 'ring-4 ring-primary-500 ring-offset-2 dark:ring-offset-dark-card'
                )}
                style={{ backgroundColor: color }}
              >
                {formData.backgroundColor === color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check size={20} className="text-white drop-shadow-lg" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
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
