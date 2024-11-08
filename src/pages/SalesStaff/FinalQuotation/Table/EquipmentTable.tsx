import React, { useState, useEffect } from 'react';
import { EquipmentItem } from '../../../../types/FinalQuotationTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
    };
    setEditableItems([...editableItems, newItem]);
    onItemsChange([...editableItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = editableItems.filter((_, i) => i !== index);
    setEditableItems(updatedItems);
    onItemsChange(updatedItems);
  };

  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Tên thiết bị</th>
            <th className="px-4 py-2 border text-center">Đơn vị</th>
            <th className="px-4 py-2 border text-center">Số lượng</th>
            <th className="px-4 py-2 border text-center">Đơn giá</th>
            <th className="px-4 py-2 border text-center">Tổng giá</th>
            <th className="px-4 py-2 border text-center">Ghi chú</th>
            {isEditing && <th className="px-4 py-2 border text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {editableItems.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border text-center">
                <input
                  type="text"
                  value={item.Name}
                  onChange={(e) =>
                    handleInputChange(index, 'Name', e.target.value)
                  }
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="text"
                  value={item.Unit}
                  onChange={(e) =>
                    handleInputChange(index, 'Unit', e.target.value)
                  }
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="number"
                  value={item.Quantity}
                  onChange={(e) =>
                    handleInputChange(index, 'Quantity', Number(e.target.value))
                  }
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center">
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
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="number"
                  value={item.TotalOfMaterial}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'TotalOfMaterial',
                      Number(e.target.value),
                    )
                  }
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="text"
                  value={item.Note ?? ''}
                  onChange={(e) =>
                    handleInputChange(index, 'Note', e.target.value)
                  }
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>
              {isEditing && (
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isEditing && (
        <button
          onClick={handleAddItem}
          className="mt-2 bg-primary text-white px-4 py-2 rounded"
        >
          Thêm thiết bị
        </button>
      )}
    </div>
  );
};

export default EquipmentTable;
