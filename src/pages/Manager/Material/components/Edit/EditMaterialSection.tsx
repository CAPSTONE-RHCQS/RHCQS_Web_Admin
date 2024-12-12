import React, { useState } from 'react';

interface EditModalProps {
  isOpen: boolean;
  inputNameValue: string;
  inputCodeValue: string;
  onInputNameChange: (value: string) => void;
  onInputCodeChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditMaterialSection: React.FC<EditModalProps> = ({
  isOpen,
  inputNameValue,
  inputCodeValue,
  onInputNameChange,
  onInputCodeChange,
  onSave,
  onCancel,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave();
      setIsSaving(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-lg font-bold mb-4">Chỉnh sửa vật tư</h2>
        <input
          type="text"
          value={inputNameValue}
          onChange={(e) => onInputNameChange(e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập tên vật tư"
        />
        <input
          type="text"
          value={inputCodeValue}
          onChange={(e) => onInputCodeChange(e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập mã code vật tư"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="text-black px-4 py-2 rounded font-bold"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold flex items-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              'Lưu'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMaterialSection;
