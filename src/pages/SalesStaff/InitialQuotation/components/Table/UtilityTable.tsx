import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { getUtilityByName } from '../../../../../api/Utility/UtilityApi';
import { QuotationUtility } from '../../../../../types/InitialQuotationTypes';
import { Utility } from '../../../../../types/SearchContainNameTypes';

interface UtilityTableProps {
  utilityInfos: QuotationUtility[];
  setUtilityInfos: React.Dispatch<React.SetStateAction<QuotationUtility[]>>;
  isEditing: boolean;
}

const convertToQuotationUtility = (utility: Utility): QuotationUtility => {
  return {
    utilitiesItemId: utility.UtilityItemId || utility.UtilitySectionId,
    coefficient: utility.Coefficient,
    price: utility.UnitPrice,
    description: utility.Name,
  };
};

const UtilityTable: React.FC<UtilityTableProps> = ({
  utilityInfos,
  setUtilityInfos,
  isEditing,
}) => {
  const [searchResults, setSearchResults] = useState<Utility[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [totalUtilityCost, setTotalUtilityCost] = useState<number>(0);

  useEffect(() => {
    const totalCost = utilityInfos.reduce(
      (total, utility) => total + (utility.price || 0),
      0,
    );
    setTotalUtilityCost(totalCost);
  }, [utilityInfos]);

  const handleDeleteRow = (index: number) => {
    const newData = utilityInfos.filter((_, i) => i !== index);
    setUtilityInfos(newData);
  };

  const handleSearchAndEdit = async (value: string, index: number) => {
    if (!isEditing) return;
    handleEditUtility(index, 'description', value);
    try {
      const results = await getUtilityByName(value);
      setSearchResults(results);
      setSelectedRowIndex(index);
    } catch (error) {
      console.error('Error searching utility:', error);
    }
  };

  const handleSelectUtility = (utility: Utility) => {
    if (selectedRowIndex !== null) {
      const newData = utilityInfos.map((info, index) =>
        index === selectedRowIndex
          ? {
              ...convertToQuotationUtility(utility),
              description: utility.Name,
            }
          : info,
      );

      setUtilityInfos(newData);
      setSearchResults([]);
      setSelectedRowIndex(null);
    }
  };

  const handleEditUtility = (
    index: number,
    field: keyof QuotationUtility,
    value: any,
  ) => {
    const newData = [...utilityInfos];
    newData[index] = { ...newData[index], [field]: value };
    setUtilityInfos(newData);
  };

  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Mô tả</th>
            <th className="px-4 py-2 border text-center">Hệ số</th>
            <th className="px-4 py-2 border text-center">Giá</th>
            {isEditing && <th className="px-4 py-2 border text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {utilityInfos.map((utility, index) => (
            <tr key={utility.utilitiesItemId || index}>
              <td className="px-4 py-2 border text-left">
                <input
                  type="text"
                  value={utility.description}
                  onChange={(e) => handleSearchAndEdit(e.target.value, index)}
                  className="w-full text-left"
                  disabled={!isEditing}
                />
                {selectedRowIndex === index && searchResults.length > 0 && (
                  <ul className="bg-white border border-gray-300 mt-1">
                    {searchResults.map((result, idx) => (
                      <li
                        key={`${result.UtilityItemId}-${idx}`}
                        onClick={() => handleSelectUtility(result)}
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
                  value={utility.coefficient}
                  onChange={(e) =>
                    handleEditUtility(
                      index,
                      'coefficient',
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
                  value={utility.price}
                  onChange={(e) =>
                    handleEditUtility(
                      index,
                      'price',
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
                    onClick={() => handleDeleteRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr>
            <td className="px-4 py-2 border text-center" colSpan={2}>
              <strong>Tổng chi phí tiện ích</strong>
            </td>
            <td className="px-4 py-2 border text-center">
              <strong>{totalUtilityCost.toLocaleString()} VNĐ</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UtilityTable;
