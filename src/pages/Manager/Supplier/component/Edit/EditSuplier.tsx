import React from 'react';

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
        <div className="mb-4">
          <img
            src={inputValue.imgUrl}
            alt="Supplier"
            className="h-48 object-cover rounded"
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
