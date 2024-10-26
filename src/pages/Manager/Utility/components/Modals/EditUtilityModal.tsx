import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { putUtility } from '../../../../../api/Utility/UtilityApi.ts';
import {
  ItemRequest,
  SectionRequest,
  UtilityItem,
} from '../../../../../types/UtilityTypes.ts';

interface EditUtilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  utility: UtilityItem;
}

const EditUtilityModal: React.FC<EditUtilityModalProps> = ({
  isOpen,
  onClose,
  onEditSuccess,
  utility,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('ROUGH');
  const [sections, setSections] = useState<SectionRequest[]>([]);
  const [items, setItems] = useState<ItemRequest[]>([]);
  const [showSections, setShowSections] = useState(false);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    if (isOpen && utility) {
      setName(utility.Name);
      setType(utility.Type);
      setSections(
        (utility.Sections || []).map((section) => ({
          id: section.Id || '',
          name: section.Name || '',
          description: section.Description || '',
          unitPrice: section.UnitPrice || 0,
          unit: section.Unit || '',
        })),
      );
      setItems(
        (utility.Items || []).map((item) => ({
          name: item.Name || '',
          coefficient: item.Coefficient || 0,
        })),
      );
    }
  }, [isOpen, utility]);

  const updateSection = (
    index: number,
    field: keyof SectionRequest,
    value: any,
  ) => {
    const updatedSections = sections.map((section, i) =>
      i === index ? { ...section, [field]: value } : section,
    );
    setSections(updatedSections);
  };

  const updateItem = (index: number, field: keyof ItemRequest, value: any) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    try {
      const utilityData = {
        id: utility.Id,
        name,
        type,
        sections,
        items,
      };

      if (
        utility.Id &&
        (name !== utility.Name ||
          type !== utility.Type ||
          JSON.stringify(sections) !== JSON.stringify(utility.Sections) ||
          JSON.stringify(items) !== JSON.stringify(utility.Items))
      ) {
        await putUtility(utility.Id, utilityData);
        toast.success('Chỉnh sửa thành công!');
        onEditSuccess();
      } else {
        toast.info('Không có thay đổi nào được thực hiện.');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Chỉnh sửa thất bại!');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Chỉnh sửa Utility
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <input
            type="text"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
            required
          >
            <option value="" disabled>
              Chọn loại
            </option>
            <option value="ROUGH">ROUGH</option>
            <option value="FINISHED">FINISHED</option>
          </select>
        </div>
        <h3
          onClick={() => setShowSections(!showSections)}
          className="text-lg font-medium mb-4 cursor-pointer"
        >
          Sections
        </h3>
        {showSections && (
          <>
            {sections.map((section, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 mb-4 items-center"
              >
                <input
                  type="text"
                  placeholder="Tên Section"
                  value={section.name}
                  onChange={(e) => updateSection(index, 'name', e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={section.description}
                  onChange={(e) =>
                    updateSection(index, 'description', e.target.value)
                  }
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
                <input
                  type="number"
                  placeholder="Giá đơn vị"
                  value={section.unitPrice}
                  onChange={(e) =>
                    updateSection(
                      index,
                      'unitPrice',
                      parseFloat(e.target.value),
                    )
                  }
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
                <input
                  type="text"
                  placeholder="Đơn vị"
                  value={section.unit}
                  onChange={(e) => updateSection(index, 'unit', e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
                <button
                  type="button"
                  onClick={() =>
                    setSections(sections.filter((_, i) => i !== index))
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setSections([
                  ...sections,
                  { id: '', name: '', description: '', unitPrice: 0, unit: '' },
                ])
              }
              className="mb-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Thêm Section
            </button>
          </>
        )}
        <h3
          onClick={() => setShowItems(!showItems)}
          className="text-lg font-medium mb-4 cursor-pointer"
        >
          Items
        </h3>
        {showItems && (
          <>
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-2 mb-4 items-center"
              >
                <input
                  type="text"
                  placeholder="Tên Item"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                  required
                />
                <input
                  type="number"
                  placeholder="Hệ số"
                  value={item.coefficient}
                  onChange={(e) =>
                    updateItem(index, 'coefficient', parseFloat(e.target.value))
                  }
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => setItems([...items, { name: '', coefficient: 0 }])}
              className="mb-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Thêm Item
            </button>
          </>
        )}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 bg-gray-300 rounded mr-2 hover:bg-gray-400 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUtilityModal;
