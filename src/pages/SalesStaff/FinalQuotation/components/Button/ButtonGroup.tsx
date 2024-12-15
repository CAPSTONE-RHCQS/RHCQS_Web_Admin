import React from 'react';
import { FaDownload, FaShareAlt } from 'react-icons/fa';

interface ButtonGroupProps {
  isEditing: boolean;
  isSaving: boolean;
  isFinalized: boolean;
  handleSave: () => void;
  handleEditToggle: () => void;
  handleDownload: () => void;
  handleShare: () => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  isEditing,
  isSaving,
  isFinalized,
  handleSave,
  handleEditToggle,
  handleDownload,
  handleShare,
}) => {
  return (
    <div className="flex justify-end space-x-2">
      {isFinalized && (
        <>
          <button
            onClick={handleEditToggle}
            disabled={isSaving}
            className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
          >
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu'}
            </button>
          )}
        </>
      )}
      {/* <button
        onClick={handleDownload}
        className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
      >
        <FaDownload className="text-lg" />
      </button>
      <button
        onClick={handleShare}
        className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
      >
        <FaShareAlt className="text-lg" />
      </button> */}
    </div>
  );
};

export default ButtonGroup;
