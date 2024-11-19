import React, { useState } from 'react';
import { UpdateSupplierRequest } from '../../../../../types/Supplier';

interface CreateModalProps {
  isOpen: boolean;
  inputValue: UpdateSupplierRequest;
  onInputChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CreateSupplier: React.FC<CreateModalProps> = ({
  isOpen,
  inputValue,
  onInputChange,
  onSave,
  onCancel,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        onInputChange('Image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto no-scrollbar">
        <h2 className="text-lg font-bold mb-4">Tạo mới nhà cung cấp</h2>
        <strong className="font-bold">Tên nhà cung cấp:</strong>
        <input
          type="text"
          value={inputValue.Name}
          onChange={(e) => onInputChange('Name', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập tên nhà cung cấp"
        />
        <strong className="font-bold">Email:</strong>
        <input
          type="email"
          value={inputValue.Email}
          onChange={(e) => onInputChange('Email', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập email"
        />
        <strong className="font-bold">Số điện thoại:</strong>
        <input
          type="text"
          value={inputValue.ConstractPhone}
          onChange={(e) => onInputChange('ConstractPhone', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập số điện thoại"
        />
        <strong className="font-bold">Hình ảnh:</strong>
        <div
          className="border-dashed border-2 border-gray-400 p-4 mb-4 w-40 rounded flex justify-center items-center cursor-pointer"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="max-h-40" />
          ) : (
            <span className="text-gray-500">+</span>
          )}
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <strong className="font-bold">Trạng thái:</strong>
        <select
          value={inputValue.Deflag.toString()}
          onChange={(e) => onInputChange('Deflag', e.target.value === 'true')}
          className="border p-2 mb-4 w-full rounded font-regular"
        >
          <option value="true">Hoạt động</option>
          <option value="false">Ngừng hoạt động</option>
        </select>
        <strong className="font-bold">Mô tả ngắn:</strong>
        <input
          type="text"
          value={inputValue.ShortDescription}
          onChange={(e) => onInputChange('ShortDescription', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập mô tả ngắn"
        />
        <strong className="font-bold">Mô tả:</strong>
        <textarea
          value={inputValue.Description}
          onChange={(e) => onInputChange('Description', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập mô tả"
        />
        <strong className="font-bold">Mã nhà cung cấp:</strong>
        <input
          type="text"
          value={inputValue.Code}
          onChange={(e) => onInputChange('Code', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập mã nhà cung cấp"
          maxLength={5}
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
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSupplier;