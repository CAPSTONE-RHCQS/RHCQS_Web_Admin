// src/pages/Manager/DesignPrice/component/Create/CreateDesignPrice.tsx
import React, { useState } from 'react';
import { DesignPriceRequest } from '../../../../../types/DesignPrice';

interface CreateModalProps {
  isOpen: boolean;
  inputValue: DesignPriceRequest;
  onInputChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CreateDesignPrice: React.FC<CreateModalProps> = ({
  isOpen,
  inputValue,
  onInputChange,
  onSave,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        <h2 className="text-lg font-bold mb-4">Tạo giá thiết kế</h2>
        
        <strong className="font-bold">Diện tích từ:</strong>
        <input
          type="number"
          value={inputValue.areaFrom}
          onChange={(e) => onInputChange('areaFrom', parseFloat(e.target.value))}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập diện tích từ"
          step="0.01"
        />
        
        <strong className="font-bold">Diện tích đến:</strong>
        <input
          type="number"
          value={inputValue.areaTo}
          onChange={(e) => onInputChange('areaTo', parseFloat(e.target.value))}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập diện tích đến"
          step="0.01"
        />
        
        <strong className="font-bold">Giá:</strong>
        <input
          type="number"
          value={inputValue.price}
          onChange={(e) => onInputChange('price', parseFloat(e.target.value))}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập giá"
          step="0.01"
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

export default CreateDesignPrice;