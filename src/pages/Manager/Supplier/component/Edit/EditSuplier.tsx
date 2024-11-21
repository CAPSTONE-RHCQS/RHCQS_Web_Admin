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
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      onInputChange('Image', file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave();
    } finally {
      setIsLoading(false);
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
        <div className="flex space-x-4 mb-4">
          <div className="relative">
            <img
              src={inputValue.ImgUrl || ''}
              alt="Supplier"
              className="border-dashed border-2 border-gray-400 p-4 mb-4 w-40 h-40 rounded flex justify-center items-center cursor-pointer relative object-cover"
            />
            <span className="absolute inset-0 flex justify-center items-center text-white text-2xl font-bold bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
              +
            </span>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
            <div className="text-center mt-2">Ảnh hiện tại</div>
          </div>
          {newImageUrl && (
            <div className="relative">
              <img
                src={newImageUrl}
                alt="New Supplier"
                className="border-dashed border-2 border-gray-400 p-4 mb-4 w-40 h-40 rounded flex justify-center items-center object-cover"
              />
              <div className="text-center mt-2">Ảnh mới</div>
            </div>
          )}
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
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
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
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;