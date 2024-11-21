import React, { useState } from 'react';

interface CreateLaborProps {
  isOpen: boolean;
  onCreate: (newLabor: any) => void;
  onCancel: () => void;
}

const CreateLabor: React.FC<CreateLaborProps> = ({
  isOpen,
  onCreate,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState({
    name: '',
    price: 0,
    type: 'Rough',
    deflag: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setInputValue((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto no-scrollbar">
        <h2 className="text-lg font-bold mb-4">Thêm nhân công mới</h2>
        <strong className="font-bold">Tên:</strong>
        <input
          type="text"
          value={inputValue.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập tên"
        />
        <strong className="font-bold">Giá:</strong>
        <input
          type="number"
          value={inputValue.price}
          onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập giá"
        />
        <strong className="font-bold">Loại:</strong>
        <select
          value={inputValue.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
        >
          <option value="Rough">Thô</option>
          <option value="Finished">Hoàn thiện</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="text-black px-4 py-2 rounded font-bold"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              console.log('Creating labor with:', inputValue);
              onCreate(inputValue);
            }}
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold"
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLabor;