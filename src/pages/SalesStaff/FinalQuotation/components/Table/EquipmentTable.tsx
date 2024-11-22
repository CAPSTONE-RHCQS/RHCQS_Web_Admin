import React, { useState, useEffect } from 'react';
import { EquipmentItem } from '../../../../../types/FinalQuotationTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { uploadEquipmentExcel } from '../../../../../api/Equipment/EquipmentApi';
import { convertApiResponseToFinalEquipmentItem } from '../../../../../utils/dataTransformers';

interface EquipmentTableProps {
  items: EquipmentItem[];
  isEditing: boolean;
  onItemsChange: (updatedItems: EquipmentItem[]) => void;
}

const EquipmentTable: React.FC<EquipmentTableProps> = ({
  items,
  isEditing,
  onItemsChange,
}) => {
  const [editableItems, setEditableItems] = useState(items);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setEditableItems(items);
  }, [items]);

  const handleInputChange = (
    index: number,
    field: keyof EquipmentItem,
    value: string | number,
  ) => {
    const updatedItems = [...editableItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditableItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const handleAddItem = () => {
    const newItem: EquipmentItem = {
      Id: '',
      Name: '',
      Unit: '',
      Quantity: 0,
      UnitOfMaterial: 0,
      TotalOfMaterial: 0,
      Note: '',
      Type: '',
    };
    setEditableItems([...editableItems, newItem]);
    onItemsChange([...editableItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = editableItems.filter((_, i) => i !== index);
    setEditableItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const calculateTotalPrice = () => {
    return editableItems.reduce((total, item) => {
      return total + (item.Quantity * item.UnitOfMaterial || 0);
    }, 0);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setIsUploading(true);
      try {
        const apiData = await uploadEquipmentExcel(file);
        const convertedData = convertApiResponseToFinalEquipmentItem(apiData);
        setEditableItems(convertedData);
        onItemsChange(convertedData);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const autoResizeTextarea = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="overflow-x-auto mb-4">
      {isEditing && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tải lên tệp Excel
          </label>
          <div className="flex items-center">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer bg-primaryGreenButton text-white px-4 py-2 rounded shadow-md hover:bg-secondaryGreenButton ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Đang tải lên...' : 'Chọn tệp'}
            </label>
            {selectedFileName && (
              <span className="ml-2 text-sm text-gray-600">
                {selectedFileName}
              </span>
            )}
          </div>
        </div>
      )}
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center font-semibold">
              Tên thiết bị
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Đơn vị
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Số lượng
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Đơn giá
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Tổng giá
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Ghi chú
            </th>
            {isEditing && <th className="px-4 py-2 border text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {editableItems.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-center align-middle">
                <textarea
                  value={item.Name}
                  onChange={(e) => {
                    handleInputChange(index, 'Name', e.target.value);
                    autoResizeTextarea(e);
                  }}
                  className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={!isEditing}
                  rows={1}
                  style={{
                    overflow: 'hidden',
                    minHeight: '60px',
                    resize: 'vertical',
                  }}
                />
              </td>
              <td className="px-4 py-2 border text-center align-middle">
                <input
                  type="text"
                  value={item.Unit}
                  onChange={(e) =>
                    handleInputChange(index, 'Unit', e.target.value)
                  }
                  className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center align-middle">
                <input
                  type="number"
                  value={item.Quantity}
                  onChange={(e) =>
                    handleInputChange(index, 'Quantity', Number(e.target.value))
                  }
                  className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center align-middle">
                <input
                  type="number"
                  value={item.UnitOfMaterial}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'UnitOfMaterial',
                      Number(e.target.value),
                    )
                  }
                  className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center align-middle">
                <span>
                  {(item.Quantity * item.UnitOfMaterial).toLocaleString()} VNĐ
                </span>
              </td>
              <td className="px-4 py-2 border text-center align-middle">
                <textarea
                  value={item.Note ?? ''}
                  onChange={(e) => {
                    handleInputChange(index, 'Note', e.target.value);
                    autoResizeTextarea(e);
                  }}
                  className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={!isEditing}
                  rows={1}
                  style={{
                    overflow: 'hidden',
                    minHeight: '60px',
                    resize: 'vertical',
                  }}
                />
              </td>
              {isEditing && (
                <td className="px-4 py-2 border text-center align-middle">
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="bg-red-500 text-white w-8 h-8 flex items-center justify-center shadow hover:bg-red-600 transition duration-300 rounded-full mx-auto"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={4} className="px-4 py-2 border text-center font-bold">
              Tổng cộng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateTotalPrice().toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center"></td>
            {isEditing && <td className="px-4 py-2 border text-center"></td>}
          </tr>
        </tbody>
      </table>
      {isEditing && (
        <button
          onClick={handleAddItem}
          className="mt-2 bg-primaryGreenButton text-white px-4 py-2 rounded shadow-md hover:bg-secondaryGreenButton"
        >
          Thêm thiết bị
        </button>
      )}
    </div>
  );
};

export default EquipmentTable;
