import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const CreateListModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(title);
    setTitle('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New List" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="List Title"
          placeholder="Enter list title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          autoFocus
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={!title.trim()}
          >
            Create List
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateListModal;
