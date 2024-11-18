import React, { useState } from 'react';

interface EditModalProps {
  isOpen: boolean;
  inputValue: {
    name: string;
    email: string;
    constractPhone: string;
    imgUrl: string;
    deflag: boolean;
    shortDescription: string;
    description: string;
  };
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
          value={inputValue.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập tên nhà cung cấp"
        />
        <strong className="font-bold">Email:</strong>
        <input
          type="email"
          value={inputValue.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập email"
        />
        <strong className="font-bold">Số điện thoại:</strong>
        <input
          type="text"
          value={inputValue.constractPhone}
          onChange={(e) => onInputChange('constractPhone', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập số điện thoại"
        />
        <strong className="font-bold">Hình ảnh:</strong>
        <div className="mb-4 relative group">
          <img
            src={newImageUrl || inputValue.imgUrl}
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
          value={inputValue.deflag.toString()}
          onChange={(e) => onInputChange('deflag', e.target.value === 'true')}
          className="border p-2 mb-4 w-full rounded font-regular"
        >
          <option value="true">Hoạt động</option>
          <option value="false">Ngừng hoạt động</option>
        </select>
        <strong className="font-bold">Mô tả ngắn:</strong>
        <input
          type="text"
          value={inputValue.shortDescription}
          onChange={(e) => onInputChange('shortDescription', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập mô tả ngắn"
        />
        <strong className="font-bold">Mô tả:</strong>
        <textarea
          value={inputValue.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập mô tả"
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
