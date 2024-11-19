import React, { useState } from 'react';
import { UpdateSupplierRequest } from '../../../../../types/Supplier';

interface EditModalProps {
  isOpen: boolean;
  inputValue: UpdateSupplierRequest;
  onInputChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditSupplier: React.FC<EditModalProps> = ({
  isOpen,
  inputValue,
  onInputChange,
  onSave,
  onCancel,
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto no-scrollbar">
        <h2 className="text-lg font-bold mb-4">Chỉnh sửa nhà cung cấp</h2>
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
        <div className="mb-4 relative group">
          <img
            src={newImageUrl || inputValue.ImgUrl || ''}
            alt="Supplier"
            className="h-48 object-cover rounded"
          />
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-2xl">+</span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
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
          className="border p-2 mb-4 w-full rounded font-regular"
          onChange={(e) => onInputChange('Code', e.target.value)}
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
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;
