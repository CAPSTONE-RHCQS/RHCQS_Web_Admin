import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  putConstruction,
  SubConstructionRequest,
} from '../../../../api/Construction/Construction';
import {
  ConstructionItem,
  SubConstructionItem,
} from '../Table/ConstructionTable';

interface EditConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  construction: ConstructionItem;
}

const EditConstructionModal: React.FC<EditConstructionModalProps> = ({
  isOpen,
  onClose,
  onEditSuccess,
  construction,
}) => {
  const [name, setName] = useState('');
  const [coefficient, setCoefficient] = useState(0);
  const [unit, setUnit] = useState('');
  const [type, setType] = useState('ROUGH');
  const [subConstructions, setSubConstructions] = useState<SubConstructionItem[]>([]);

  useEffect(() => {
    if (isOpen && construction) {
      setName(construction.Name);
      setCoefficient(construction.Coefficient);
      setUnit(construction.Unit);
      setSubConstructions(construction.SubConstructionItems || []);
    }
  }, [isOpen, construction]);

  const handleSubConstructionChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setSubConstructions((prev) => {
      const newSubConstructions = [...prev];
      newSubConstructions[index] = {
        ...newSubConstructions[index],
        [field]: value,
      };
      return newSubConstructions;
    });
  };

  const handleSubmit = async () => {
    try {
      const subRequests: SubConstructionRequest[] = subConstructions.map((sub) => ({
        id: sub.Id,
        name: sub.Name,
        coefficient: sub.Coefficient,
        unit: sub.Unit,
      }));

      const constructionData = {
        name,
        coefficient,
        unit,
        type,
        subRequests,
      };

      if (
        name !== construction.Name ||
        coefficient !== construction.Coefficient ||
        unit !== construction.Unit ||
        JSON.stringify(subRequests) !== JSON.stringify(construction.SubConstructionItems)
      ) {
        await putConstruction(construction.Id, constructionData);
        toast.success('Chỉnh sửa thành công!');
        onEditSuccess();
      } else {
        toast.info('Không có thay đổi nào được thực hiện.');
      }
      onClose();
    } catch (error) {
      console.error('Failed to edit construction:', error);
      toast.error('Chỉnh sửa thất bại!');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-1/3 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Chỉnh sửa Construction
        </h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
            required
          />
          <input
            type="number"
            placeholder="Hệ số"
            value={coefficient}
            onChange={(e) => setCoefficient(Number(e.target.value))}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
            required
          />
          <input
            type="text"
            placeholder="Đơn vị"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
          >
            <option value="ROUGH">ROUGH</option>
            <option value="FINISH">FINISH</option>
          </select>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Sub Constructions</h3>
          {subConstructions.map((sub, index) => (
            <div key={index} className="mb-2 grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Tên Mục Con"
                value={sub.Name}
                onChange={(e) =>
                  handleSubConstructionChange(index, 'Name', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                required
              />
              <input
                type="number"
                placeholder="Hệ số"
                value={sub.Coefficient}
                onChange={(e) =>
                  handleSubConstructionChange(
                    index,
                    'Coefficient',
                    Number(e.target.value),
                  )
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                required
              />
              <input
                type="text"
                placeholder="Đơn vị"
                value={sub.Unit}
                onChange={(e) =>
                  handleSubConstructionChange(index, 'Unit', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                required
              />
            </div>
          ))}
        </div>
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

export default EditConstructionModal;
