import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { postUtility } from '../../../../../api/Utility/UtilityApi';
import {
  UtilityRequest,
  SectionRequest,
  ItemRequest,
} from '../../../../../types/UtilityTypes.ts';

interface AddUtilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
}

const AddUtilityModal: React.FC<AddUtilityModalProps> = ({
  isOpen,
  onClose,
  onAddSuccess,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('ROUGH');
  const [sections, setSections] = useState<SectionRequest[]>([]);
  const [items, setItems] = useState<ItemRequest[]>([]);
  const [showSections, setShowSections] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [utilityId, setUtilityId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName('');
    setType('ROUGH');
    setSections([]);
    setItems([]);
    setShowSections(false);
    setShowItems(false);
    setUtilityId(null);
  };

  const addSection = () => {
    setSections([
      ...sections,
      { id: '', name: '', description: '', unitPrice: 0, unit: '' },
    ]);
  };

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

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems([...items, { name: '', coefficient: 0 }]);
  };

  const updateItem = (index: number, field: keyof ItemRequest, value: any) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (!name || !type) {
        toast.error('Vui lòng điền đầy đủ thông tin.');
        return;
      }

      const utilityData: UtilityRequest = {
        id: utilityId,
        name,
        type,
        sections,
        items,
      };

      await postUtility(utilityData);
      toast.success('Thêm mới thành công!');
      onAddSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Thêm mới thất bại!');
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
          Thêm mới Utility
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <select
            onChange={(e) => {
              const selectedId = e.target.value;
              if (selectedId) {
                setUtilityId(selectedId);
                setName(e.target.options[e.target.selectedIndex].text);
              } else {
                setUtilityId(null);
                setName('');
              }
            }}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
          >
            <option value="">Tạo Tiện ích mới</option>
            <option value="002E459A-E010-493F-8585-D729D3CF357B">
              Điều kiện thi công không thuận lợi
            </option>
            <option value="2367DEC1-E649-4549-B81B-701F2DBC1A7B">
              Nâng cao chất lượng phần thô
            </option>
            <option value="04F30A66-9758-45DB-88A7-6F098EDC4837">
              Dịch vụ tiện ích thêm
            </option>
            <option value="05430765-97FE-4186-900D-D5DC850E8CDB">
              Tiện ích công trình
            </option>
          </select>
          {utilityId === null && (
            <input
              type="text"
              placeholder="Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
              required
            />
          )}
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
                  onClick={() => removeSection(index)}
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
              onClick={addSection}
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
                  onClick={() => removeItem(index)}
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
              onClick={addItem}
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
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUtilityModal;
