import React from 'react';

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
            onClick={onSave}
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMaterialSection;
