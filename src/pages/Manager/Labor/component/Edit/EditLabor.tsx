import React, { useState } from 'react';

interface EditLaborProps {
  isOpen: boolean;
  inputValue: {
    Name: string;
    Price: number;
    Type: string;
    Deflag: boolean;
  };
  onInputChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditLabor: React.FC<EditLaborProps> = ({
  isOpen,
  inputValue,
  onInputChange,
  onSave,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto no-scrollbar">
        <h2 className="text-lg font-bold mb-4">Chỉnh sửa lao động</h2>
        <strong className="font-bold">Tên:</strong>
        <input
          type="text"
          value={inputValue.Name}
          onChange={(e) => onInputChange('Name', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập tên"
        />
        <strong className="font-bold">Giá:</strong>
        <input
          type="number"
          value={inputValue.Price}
          onChange={(e) => onInputChange('Price', parseFloat(e.target.value))}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập giá"
        />
        <strong className="font-bold">Loại:</strong>
        <select
          value={inputValue.Type}
          onChange={(e) => onInputChange('Type', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
        >
          <option value="Rough">Thô</option>
          <option value="Finished">Hoàn thiện</option>
        </select>
        <strong className="font-bold">Trạng thái:</strong>
        <select
          value={inputValue.Deflag?.toString()}
          onChange={(e) => onInputChange('Deflag', e.target.value === 'true')}
          className="border p-2 mb-4 w-full rounded font-regular"
        >
          <option value="true">Đang hoạt động</option>
          <option value="false">Ngừng hoạt động</option>
        </select>
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

export default EditLabor;