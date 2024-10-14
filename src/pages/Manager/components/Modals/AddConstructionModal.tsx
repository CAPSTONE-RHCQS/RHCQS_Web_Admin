import React, { useState, useEffect } from 'react';
import {
  ConstructionRequest,
  postConstruction,
} from '../../../../api/Construction/Construction';

interface AddConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
}

const DEFAULT_UNIT = 'm2';
const DEFAULT_TYPE = 'ROUGH';

const AddConstructionModal: React.FC<AddConstructionModalProps> = ({
  isOpen,
  onClose,
  onAddSuccess,
}) => {
  const [name, setName] = useState('');
  const [coefficient, setCoefficient] = useState(0);
  const [unit, setUnit] = useState(DEFAULT_UNIT);
  const [type, setType] = useState(DEFAULT_TYPE);
  const [subConstructions, setSubConstructions] = useState([
    { name: '', coefficient: 0, unit: DEFAULT_UNIT },
  ]);
  const [showSubConstructions, setShowSubConstructions] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName('');
    setCoefficient(0);
    setUnit(DEFAULT_UNIT);
    setType(DEFAULT_TYPE);
    setSubConstructions([{ name: '', coefficient: 0, unit: DEFAULT_UNIT }]);
    setShowSubConstructions(false);
  };

  const handleAddSubConstruction = () => {
    setSubConstructions([
      ...subConstructions,
      { name: '', coefficient: 0, unit: DEFAULT_UNIT },
    ]);
  };

  const handleSubConstructionChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newSubConstructions = [...subConstructions];
    newSubConstructions[index] = {
      ...newSubConstructions[index],
      [field]: value,
    };
    setSubConstructions(newSubConstructions);
  };

  const handleSubmit = async () => {
    try {
      const validSubConstructions = subConstructions.filter(
        (sub) => sub.name && sub.unit,
      );

      if (!name || !unit) {
        console.error('Please fill in all required fields.');
        return;
      }

      const constructionData: ConstructionRequest = {
        name,
        coefficient,
        unit,
        type,
        subConstructionRequests: validSubConstructions,
      };

      await postConstruction(constructionData);
      onAddSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to add construction:', error);
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
        <h2 className="text-2xl font-semibold mb-6 text-center">Thêm mới Construction</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
          <input
            type="number"
            placeholder="Hệ số"
            value={coefficient}
            onChange={(e) => setCoefficient(Number(e.target.value))}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Đơn vị"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          >
            <option value="ROUGH">ROUGH</option>
            <option value="FINISH">FINISH</option>
          </select>
        </div>
        <h3
          onClick={() => setShowSubConstructions(!showSubConstructions)}
          className="text-lg font-medium mb-4 cursor-pointer"
        >
          Sub Constructions
        </h3>
        {showSubConstructions && (
          <>
            {subConstructions.map((sub, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Tên Mục Con"
                  value={sub.name}
                  onChange={(e) =>
                    handleSubConstructionChange(index, 'name', e.target.value)
                  }
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Hệ số"
                  value={sub.coefficient}
                  onChange={(e) =>
                    handleSubConstructionChange(
                      index,
                      'coefficient',
                      Number(e.target.value),
                    )
                  }
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Đơn vị"
                  value={sub.unit}
                  onChange={(e) =>
                    handleSubConstructionChange(index, 'unit', e.target.value)
                  }
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  required
                />
              </div>
            ))}
            <button
              onClick={handleAddSubConstruction}
              className="mb-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Thêm Mục Con
            </button>
          </>
        )}
        <div className="flex justify-end">
          <button onClick={onClose} className="p-2 bg-gray-300 rounded mr-2 hover:bg-gray-400 transition-colors">
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

export default AddConstructionModal;