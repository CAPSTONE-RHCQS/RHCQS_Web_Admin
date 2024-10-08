import React, { useState } from 'react';
import { postConstruction } from '../../../../api/Construction/Construction';

interface AddConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
}

const AddConstructionModal: React.FC<AddConstructionModalProps> = ({
  isOpen,
  onClose,
  onAddSuccess,
}) => {
  const [name, setName] = useState('');
  const [coefficient, setCoefficient] = useState(0);
  const [unit, setUnit] = useState('');
  const [type, setType] = useState('ROUGH');
  const [subConstructions, setSubConstructions] = useState([
    { name: '', coefficient: 0, unit: '' },
  ]);

  const handleAddSubConstruction = () => {
    setSubConstructions([
      ...subConstructions,
      { name: '', coefficient: 0, unit: '' },
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
      await postConstruction({
        name,
        coefficient,
        unit,
        type,
        subConstructionRequests: subConstructions,
      });
      onAddSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to add construction:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4">Thêm mới Construction</h2>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 p-2 border"
        />
        <input
          type="number"
          placeholder="Hệ số"
          value={coefficient}
          onChange={(e) => setCoefficient(Number(e.target.value))}
          className="mb-2 p-2 border"
        />
        <input
          type="text"
          placeholder="Đơn vị"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="mb-2 p-2 border"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mb-2 p-2 border"
        >
          <option value="ROUGH">ROUGH</option>
          <option value="FINISH">FINISH</option>
        </select>
        <h3 className="text-lg mb-2">Sub Constructions</h3>
        {subConstructions.map((sub, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              placeholder="Tên Mục Con"
              value={sub.name}
              onChange={(e) =>
                handleSubConstructionChange(index, 'name', e.target.value)
              }
              className="p-2 border"
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
              className="p-2 border"
            />
            <input
              type="text"
              placeholder="Đơn vị"
              value={sub.unit}
              onChange={(e) =>
                handleSubConstructionChange(index, 'unit', e.target.value)
              }
              className="p-2 border"
            />
          </div>
        ))}
        <button
          onClick={handleAddSubConstruction}
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          Thêm Mục Con
        </button>
        <div className="flex justify-end">
          <button onClick={onClose} className="p-2 bg-gray-300 rounded mr-2">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="p-2 bg-green-500 text-white rounded"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddConstructionModal;
