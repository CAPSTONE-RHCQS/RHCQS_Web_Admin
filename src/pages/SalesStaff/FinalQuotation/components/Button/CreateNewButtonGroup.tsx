import React from 'react';

interface CreateNewButtonGroupProps {
  isEditing: boolean;
  isSaving: boolean;
  hanldCreateNew: () => void;
  handleEditToggle: () => void;
  handleDownload: () => void;
  handleShare: () => void;
}

const CreateNewButtonGroup: React.FC<CreateNewButtonGroupProps> = ({
  isEditing,
  isSaving,
  hanldCreateNew,
  handleEditToggle,
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <button
        onClick={handleEditToggle}
        disabled={isSaving}
        className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
      >
        {isEditing ? 'Hủy' : 'Chỉnh sửa'}
      </button>
      {isEditing && (
        <button
          onClick={hanldCreateNew}
          disabled={isSaving}
          className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
        >
          {isSaving ? 'Đang lưu...' : 'Lưu'}
        </button>
      )}
    </div>
  );
};

export default CreateNewButtonGroup;
