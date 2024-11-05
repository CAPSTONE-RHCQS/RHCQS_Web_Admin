import React from 'react';
import { FaDownload, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ActionButtonsProps {  
  isEditing: boolean;
  handleEditToggle: () => void;
  handleSave: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isEditing,
  handleEditToggle,
  handleSave,
}) => {
  const handleDownload = () => {
    toast.info('Tải về hợp đồng');
  };

  const handleShare = () => {
    toast.info('Chia sẻ hợp đồng');
  };

  return (
    <div className="flex justify-end space-x-2">
      <button
        onClick={isEditing ? handleSave : handleEditToggle}
        className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
      >
        {isEditing ? 'Lưu' : 'Chỉnh sửa'}
      </button>
      <button
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
      </button>
    </div>
  );
};

export default ActionButtons;
