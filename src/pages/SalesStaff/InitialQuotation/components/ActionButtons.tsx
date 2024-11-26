import { Console } from 'console';
import React from 'react';
import { FaDownload, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ActionButtonsProps {
  isEditing: boolean;
  isSaving: boolean;
  handleEditToggle: () => void;
  handleSave: () => void;
  quotationData: { Status: string };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isEditing,
  isSaving,
  handleEditToggle,
  handleSave,
  quotationData,
}) => {
  const handleDownload = () => {
    toast.info('Tải về hợp đồng');
  };

  const handleShare = () => {
    toast.info('Chia sẻ hợp đồng');
  };
  console.log('coc', quotationData.Status);
  return (
    <div className="flex justify-end space-x-2">
      {(quotationData.Status === 'Processing' ||
        quotationData.Status === 'Rejected') && (
        <>
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
        </>
      )}
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
