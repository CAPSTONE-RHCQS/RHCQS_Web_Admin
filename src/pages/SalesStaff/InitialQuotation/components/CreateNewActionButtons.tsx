import React from 'react';
import { FaDownload, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ActionButtonsProps {
  isEditing: boolean;
  isSaving: boolean;
  handleEditToggle: () => void;
  handleSave: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isEditing,
  isSaving,
  handleEditToggle,
  handleSave,
}) => {
  return (
    <div className="flex justify-end space-x-2">
      {isEditing && (
        <button
          onClick={handleEditToggle}
          disabled={isSaving}
          className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
        >
          Hủy
        </button>
      )}
      <button
        onClick={isEditing ? handleSave : handleEditToggle}
        disabled={isSaving}
        className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
      >
        {isSaving ? 'Đang lưu...' : isEditing ? 'Lưu' : 'Chỉnh sửa'}
      </button>
    </div>
  );
};

export default ActionButtons;
