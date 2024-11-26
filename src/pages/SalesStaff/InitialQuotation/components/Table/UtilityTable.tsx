import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { getUtilityByName } from '../../../../../api/Utility/UtilityApi';
import { QuotationUtility } from '../../../../../types/InitialQuotationTypes';
import { Utility } from '../../../../../types/SearchContainNameTypes';
import { UtilityInfo } from '../../../../../types/FinalQuotationTypes';

interface UtilityTableProps {
  utilityInfos: UtilityInfo[];
  totalRough: number;
  setUtilityInfos: React.Dispatch<React.SetStateAction<any[]>>;
  isEditing: boolean;
  onPriceChange: (prices: number[]) => void;
  quantities: (any | null)[];
  setQuantities: React.Dispatch<React.SetStateAction<(number | null)[]>>;
  setTotalUtilities: React.Dispatch<React.SetStateAction<number>>;
  projectType: string;
}

const UtilityTable: React.FC<UtilityTableProps> = ({
  utilityInfos,
  totalRough,
  setUtilityInfos,
  isEditing,
  onPriceChange,
  quantities,
  setQuantities,
  setTotalUtilities,
  projectType,
}) => {
  const [searchResults, setSearchResults] = useState<Utility[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [totalUtilityCost, setTotalUtilityCost] = useState<number>(0);

  useEffect(() => {
    const totalCost = utilityInfos.reduce((total, utility, index) => {
      const quantity = quantities[index] || 0;
      return (
        total +
        (utility.Coefficient === 0
          ? utility.UnitPrice * quantity
          : utility.Coefficient * totalRough)
      );
    }, 0);
    setTotalUtilityCost(totalCost);
    setTotalUtilities(totalCost);

    const prices = utilityInfos.map((utility, index) => {
      const quantity = quantities[index] || 0;
      return utility.Coefficient === 0
        ? utility.Price * quantity
        : utility.Coefficient * totalRough;
    });
    onPriceChange(prices);
  }, [utilityInfos, quantities, totalRough, onPriceChange, setTotalUtilities]);

  const handleDeleteRow = (index: number) => {
    const newData = utilityInfos.filter((_, i) => i !== index);
    setUtilityInfos(newData);
    setQuantities(quantities.filter((_, i) => i !== index));
  };

  const handleSearchAndEdit = async (value: string, index: number) => {
    if (!isEditing) return;
    handleEditUtility(index, 'description', value);
    try {
      const results = await getUtilityByName(value, projectType);
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
              Id: utility.UtilityItemId || utility.UtilitySectionId,
              Description: utility.Name,
              Coefficient: utility.Coefficient,
              UnitPrice: utility.UnitPrice,
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

  const handleQuantityChange = (index: number, value: number) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value || null;
    console.log('Updated Quantities:', newQuantities);
    setQuantities(newQuantities);
  };

  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Mô tả</th>
            <th className="px-2 py-2 border text-center w-20">Hệ số</th>
            <th className="px-2 py-2 border text-center w-24">Số lượng</th>
            <th className="px-4 py-2 border text-center">Đơn giá</th>
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
                  value={utility.Description}
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
              <td className="px-2 py-2 border text-center w-20">
                {utility.Coefficient !== 0 ? utility.Coefficient : ''}
              </td>
              <td className="px-2 py-2 border text-center w-24">
                {utility.Coefficient === 0 ? (
                  <input
                    type="number"
                    min="0"
                    value={quantities[index] || ''}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value))
                    }
                    className="w-full text-center"
                    disabled={!isEditing}
                  />
                ) : (
                  <span></span>
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                {utility.UnitPrice ? utility.UnitPrice.toLocaleString() : ''}
              </td>
              <td className="px-4 py-2 border text-center">
                <span>
                  {utility.Coefficient === 0
                    ? (
                        (utility.UnitPrice || 0) * (quantities[index] || 0)
                      ).toLocaleString()
                    : (utility.Coefficient * totalRough).toLocaleString()}
                </span>
              </td>
              {isEditing && (
                <td className="px-4 py-2 border text-center">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => handleDeleteRow(index)}
                      className="bg-red-500 text-white w-8 h-8 flex items-center justify-center shadow hover:bg-red-600 transition duration-300 rounded-full"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          <tr>
            <td className="px-4 py-2 border text-center" colSpan={4}>
              <strong>Tổng chi phí tiện ích</strong>
            </td>
            <td className="px-4 py-2 border text-center">
              <strong>{`${totalUtilityCost.toLocaleString(
                'vi-VN',
              )} VNĐ`}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UtilityTable;
