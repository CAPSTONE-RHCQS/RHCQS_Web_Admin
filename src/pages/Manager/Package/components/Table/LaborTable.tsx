import React, { useState, useEffect } from 'react';
import { getAllLaborByName } from '../../../../../api/Labor/Labor';
import { Labor } from '../../../../../types/SearchContainNameTypes';
import { PackageLabor } from '../../../../../types/PackagesTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface LaborTableProps {
  labors: PackageLabor[];
  editMode: boolean;
  onLaborUpdate: (updatedLabors: PackageLabor[]) => void;
}

const LaborTable: React.FC<LaborTableProps> = ({
  labors,
  editMode,
  onLaborUpdate,
}) => {
  const [editLabors, setEditLabors] = useState<PackageLabor[]>(labors);
  const [searchResults, setSearchResults] = useState<Labor[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setEditLabors(labors);
  }, [labors]);

  useEffect(() => {
    if (JSON.stringify(editLabors) !== JSON.stringify(labors)) {
      onLaborUpdate(editLabors);
    }
  }, [editLabors, onLaborUpdate, labors]);

  const handleLaborChange = async (
    index: number,
    field: string,
    value: any,
  ) => {
    const updatedLabors = [...editLabors];
    updatedLabors[index] = { ...updatedLabors[index], [field]: value };
    setEditLabors(updatedLabors);

    if (field === 'NameOfLabor') {
      setActiveIndex(index);
      if (value.trim() === '') {
        setSearchResults([]);
        setActiveIndex(null);
      } else {
        try {
          const results = await getAllLaborByName(value);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching labor by name:', error);
        }
      }
    }
  };

  const handleSelectLabor = (index: number, selectedLabor: Labor) => {
    const updatedLabors = [...editLabors];
    updatedLabors[index] = {
      ...updatedLabors[index],
      LaborId: selectedLabor.Id,
      NameOfLabor: selectedLabor.Name,
      Type: selectedLabor.Type,
      Price: selectedLabor.Price,
      InsDate: selectedLabor.InsDate || '',
    };
    setEditLabors(updatedLabors);
    setSearchResults([]);
    setActiveIndex(null);
  };

  const handleAddLabor = () => {
    const newLabor: PackageLabor = {
      Id: Date.now().toString(),
      LaborId: '',
      NameOfLabor: '',
      Type: '',
      Price: 0,
      InsDate: new Date().toISOString(),
    };
    setEditLabors([...editLabors, newLabor]);
  };

  const handleDeleteLabor = (index: number) => {
    const updatedLabors = editLabors.filter((_, i) => i !== index);
    setEditLabors(updatedLabors);
  };

  return (
    <div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-teal-100">
          <tr>
            <th className="py-3 px-4 text-left">Tên nhân công</th>
            <th className="py-3 px-4 text-left">Loại</th>
            <th className="py-3 px-4 text-left">Giá</th>
            {editMode && <th className="py-3 px-4 text-left"></th>}
          </tr>
        </thead>
        <tbody>
          {editLabors.map((labor, index) => (
            <tr
              key={labor.Id}
              className="border-b hover:bg-gray-100 transition duration-300"
            >
              <td className="py-3 px-4">
                {editMode ? (
                  <input
                    type="text"
                    value={labor.NameOfLabor}
                    onChange={(e) =>
                      handleLaborChange(index, 'NameOfLabor', e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  labor.NameOfLabor
                )}
                {editMode &&
                  activeIndex === index &&
                  searchResults.length > 0 && (
                    <ul className="bg-white border rounded shadow-md mt-2">
                      {searchResults
                        .filter(
                          (result) =>
                            !editLabors.some((l) => l.LaborId === result.Id),
                        )
                        .map((result) => (
                          <li
                            key={result.Id}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelectLabor(index, result)}
                          >
                            {result.Name}
                          </li>
                        ))}
                    </ul>
                  )}
              </td>
              {labor.Type === 'Finished' ? (
                <td className="py-3 px-4">Hoàn thiện</td>
              ) : (
                <td className="py-3 px-4">Thô</td>
              )}
              <td className="py-3 px-4">{labor.Price.toLocaleString()} VNĐ</td>
              {editMode && (
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDeleteLabor(index)}
                    className="bg-red-500 text-white w-8 h-8 flex items-center justify-center shadow hover:bg-red-600 transition duration-300 rounded-full mx-auto"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {editMode && (
        <button
          onClick={handleAddLabor}
          className="bg-teal-500 text-white px-4 py-2 rounded mt-4 shadow-lg hover:bg-teal-600 transition duration-300"
        >
          Tạo nhân công
        </button>
      )}
    </div>
  );
};

export default LaborTable;
