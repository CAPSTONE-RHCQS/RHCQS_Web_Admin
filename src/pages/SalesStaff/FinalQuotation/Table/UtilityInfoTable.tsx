import React, { useState, useEffect } from 'react';
import { UtilityInfo } from '../../../../types/FinalQuotationTypes';
import { getUtilityByName } from '../../../../api/Utility/UtilityApi';
import { Utility } from '../../../../types/SearchContainNameTypes';
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

  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Tên</th>
            <th className="px-4 py-2 border text-center">Hệ số</th>
            <th className="px-4 py-2 border text-center">Giá</th>
            {isEditing && <th className="px-4 py-2 border text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {editableUtilities.map((util, index) => (
            <tr key={util.Id}>
              <td className="px-4 py-2 border text-left">
                <input
                  type="text"
                  value={util.Name}
                  onChange={(e) =>
                    handleInputChange(index, 'Name', e.target.value)
                  }
                  className="w-full text-left"
                  disabled={!isEditing}
                />
                {selectedUtilityIndex === index && searchResults.length > 0 && (
                  <ul className="bg-white border border-gray-300 mt-1">
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
                <input
                  type="number"
                  value={util.Coefficient}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'Coefficient',
                      parseFloat(e.target.value),
                    )
                  }
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="number"
                  value={util.Price}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'UnitPrice',
                      parseFloat(e.target.value),
                    )
                  }
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>

              {isEditing && (
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => {
                      const newData = editableUtilities.filter(
                        (_, i) => i !== index,
                      );
                      setEditableUtilities(newData);
                      onUtilitiesChange(newData);
                    }}
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
    </div>
  );
};

export default UtilityInfoTable;
