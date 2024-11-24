import React, { useState, useEffect } from 'react';
import { UtilityInfo } from '../../../../../types/FinalQuotationTypes';
import { getUtilityByName } from '../../../../../api/Utility/UtilityApi';
import { Utility } from '../../../../../types/SearchContainNameTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface UtilityInfoTableProps {
  utilities: UtilityInfo[];
  isEditing: boolean;
  onUtilitiesChange: (updatedUtilities: UtilityInfo[]) => void;
}

const UtilityInfoTable: React.FC<UtilityInfoTableProps> = ({
  utilities,
  isEditing,
  onUtilitiesChange,
}) => {
  const [editableUtilities, setEditableUtilities] = useState(utilities);

  useEffect(() => {
    setEditableUtilities(utilities);
  }, [utilities]);

  const [searchResults, setSearchResults] = useState<Utility[]>([]);
  const [selectedUtilityIndex, setSelectedUtilityIndex] = useState<
    number | null
  >(null);

  const handleInputChange = async (
    index: number,
    field: keyof UtilityInfo,
    value: string | number,
  ) => {
    const updatedUtilities = [...editableUtilities];
    updatedUtilities[index] = { ...updatedUtilities[index], [field]: value };
    setEditableUtilities(updatedUtilities);
    onUtilitiesChange(updatedUtilities);

    if (field === 'Name' && typeof value === 'string') {
      try {
        const results = await getUtilityByName(value);
        setSearchResults(results);
        setSelectedUtilityIndex(index);
      } catch (error) {
        console.error('Error fetching utilities:', error);
      }
    }
  };

  const handleUtilitySelect = (utility: Utility) => {
    if (selectedUtilityIndex !== null) {
      const updatedUtilities = [...editableUtilities];
      updatedUtilities[selectedUtilityIndex] = {
        ...updatedUtilities[selectedUtilityIndex],
        Name: utility.Name,
        Coefficient: utility.Coefficient,
        Price: utility.UnitPrice,
        utilitiesItemId: utility.UtilityItemId,
        utilitiesSectionId: utility.UtilitySectionId,
      };
      setEditableUtilities(updatedUtilities);
      onUtilitiesChange(updatedUtilities);
      setSearchResults([]);
      setSelectedUtilityIndex(null);
    }
  };

  const calculateTotalPrice = () => {
    return editableUtilities.reduce(
      (total, util) => total + (util.Price || 0),
      0,
    );
  };

  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center font-semibold">Tên</th>
            <th className="px-4 py-2 border text-center font-semibold">
              Hệ số
            </th>
            <th className="px-4 py-2 border text-center font-semibold">Giá</th>
            {isEditing && <th className="px-4 py-2 border text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {editableUtilities.map((util, index) => (
            <tr key={util.Id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-left">
                <input
                  type="text"
                  value={util.Name}
                  onChange={(e) =>
                    handleInputChange(index, 'Name', e.target.value)
                  }
                  className="w-full text-left border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
                {selectedUtilityIndex === index && searchResults.length > 0 && (
                  <ul className="bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                    {searchResults.map((result, idx) => (
                      <li
                        key={`${result.UtilityItemId}-${idx}`}
                        onClick={() => handleUtilitySelect(result)}
                        className="cursor-pointer hover:bg-gray-200 p-2"
                      >
                        {result.Name}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                <span>{util.Coefficient}</span>
              </td>
              <td className="px-4 py-2 border text-center">
                <span>{util.Price.toLocaleString()}</span>
              </td>

              {isEditing && (
                <td className="px-4 py-2 border text-center align-middle">
                  <button
                    onClick={() => {
                      const newData = editableUtilities.filter(
                        (_, i) => i !== index,
                      );
                      setEditableUtilities(newData);
                      onUtilitiesChange(newData);
                    }}
                    className="bg-red-500 text-white w-8 h-8 flex items-center justify-center shadow hover:bg-red-600 transition duration-300 rounded-full mx-auto"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={2} className="px-4 py-2 border text-center font-bold">
              Tổng cộng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateTotalPrice().toLocaleString()} VNĐ
            </td>
            {isEditing && <td className="px-4 py-2 border text-center"></td>}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UtilityInfoTable;
