import React, { useState } from 'react';
import { FinalQuotationItem } from '../../../../types/FinalQuotationTypes';
import { getConstructionByName } from '../../../../api/Construction/ConstructionApi';
import { getLaborByName } from '../../../../api/Labor/Labor';
import { getMaterialByName } from '../../../../api/Material/Material';
import {
  Construction,
  Labor,
  Material,
} from '../../../../types/SearchContainNameTypes';

interface FinalQuotationTableProps {
  items: FinalQuotationItem[];
  onItemsChange: (updatedItems: FinalQuotationItem[]) => void;
  isEditing: boolean;
}

const FinalQuotationTable: React.FC<FinalQuotationTableProps> = ({
  items,
  onItemsChange,
  isEditing,
}) => {
  const [searchResults, setSearchResults] = useState<{
    [key: string]: (Construction | Labor | Material)[];
  }>({});
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );
  const [searchTypes, setSearchTypes] = useState<{
    [key: string]: 'Labor' | 'Material';
  }>({});

  const handleNameChange = async (index: number, name: string) => {
    const updatedItems = [...items];
    updatedItems[index].ContructionName = name;
    onItemsChange(updatedItems);

    try {
      const results = await getConstructionByName(name);
      setSearchResults((prev) => ({
        ...prev,
        [`construction-${index}`]: results,
      }));
      setSelectedItemIndex(index);
    } catch (error) {
      console.error('Error fetching construction by name:', error);
    }
  };

  const handleItemNameChange = async (
    index: number,
    qItemIndex: number,
    name: string,
  ) => {
    const updatedItems = [...items];
    updatedItems[index].QuotationItems[qItemIndex].Name = name;
    onItemsChange(updatedItems);

    try {
      const searchType = searchTypes[`${index}-${qItemIndex}`] || 'Labor';
      let results;
      if (searchType === 'Labor') {
        results = await getLaborByName(name);
      } else {
        results = await getMaterialByName(name);
      }
      setSearchResults((prev) => ({
        ...prev,
        [`item-${index}-${qItemIndex}`]: results,
      }));
      setSelectedItemIndex(index);
    } catch (error) {
      console.error('Error fetching data by name:', error);
    }
  };

  const handleConstructionSelect = (construction: Construction) => {
    if (selectedItemIndex !== null) {
      const updatedItems = [...items];
      updatedItems[selectedItemIndex] = {
        ...updatedItems[selectedItemIndex],
        ContructionId: construction.SubConstructionId || construction.Id,
        ContructionName: construction.Name,
      };
      onItemsChange(updatedItems);
      setSearchResults((prev) => ({
        ...prev,
        [`construction-${selectedItemIndex}`]: [],
      }));
      setSelectedItemIndex(null);
    }
  };

  const handleItemSelect = (
    item: Labor | Material,
    index: number,
    qItemIndex: number,
  ) => {
    const updatedItems = [...items];
    const isLabor = 'Type' in item && item.Type === 'Labor';

    updatedItems[index].QuotationItems[qItemIndex] = {
      ...updatedItems[index].QuotationItems[qItemIndex],
      Name: item.Name,
      UnitPriceLabor: isLabor ? item.Price || 0 : 0,
      UnitPriceRough: !isLabor ? item.Price || 0 : 0,
      Unit: !isLabor && 'Unit' in item ? item.Unit : '',
      QuotationLabors: isLabor
        ? [
            {
              Id: `labor-${Date.now()}`,
              LaborId: item.Id,
              LaborName: item.Name,
              LaborPrice: item.Price || 0,
            },
          ]
        : [],
      QuotationMaterials: !isLabor
        ? [
            {
              Id: `material-${Date.now()}`,
              MaterialId: item.Id,
              MaterialName: item.Name,
              MaterialPrice: item.Price || 0,
              Unit: 'Unit' in item ? item.Unit : '',
            },
          ]
        : [],
    };

    onItemsChange(updatedItems);
    setSearchResults((prev) => ({
      ...prev,
      [`item-${index}-${qItemIndex}`]: [],
    }));
    calculateTotalPrices(index, qItemIndex);
  };

  const handleSearchTypeChange = (
    index: number,
    qItemIndex: number,
    type: 'Labor' | 'Material',
  ) => {
    setSearchTypes((prev) => ({
      ...prev,
      [`${index}-${qItemIndex}`]: type,
    }));
  };

  const calculateTotalPrices = (index: number, qItemIndex: number) => {
    const updatedItems = [...items];
    const quotationItem = updatedItems[index].QuotationItems[qItemIndex];
    const coefficient = updatedItems[index].Coefficient || 1;

    quotationItem.TotalPriceLabor = 
      (quotationItem.Weight || 0) * 
      (quotationItem.UnitPriceLabor || 0) * 
      coefficient;

    quotationItem.TotalPriceRough = 
      (quotationItem.Weight || 0) * 
      (quotationItem.UnitPriceRough || 0) * 
      coefficient;

    onItemsChange(updatedItems);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Tên công trình</th>
            <th className="px-4 py-2 border text-center">Loại</th>
            <th className="px-4 py-2 border text-center" style={{ maxWidth: '110px' }}>Hệ số</th>
            <th className="px-4 py-2 border text-center">Tên hạng mục</th>
            <th className="px-4 py-2 border text-center" style={{ maxWidth: '75px' }}>Đơn vị</th>
            <th className="px-4 py-2 border text-center" style={{ maxWidth: '75px' }}>Khối lượng</th>
            <th className="px-4 py-2 border text-center">Đơn giá nhân công</th>
            <th className="px-4 py-2 border text-center">Đơn giá vật tư thô</th>
            <th className="px-4 py-2 border text-center">Tổng giá nhân công</th>
            <th className="px-4 py-2 border text-center">
              Tổng giá vật tư thô
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <React.Fragment key={item.Id}>
              <tr>
                <td
                  className="px-4 py-2 border text-center whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ maxWidth: '200px' }}
                  rowSpan={item.QuotationItems.length + 1}
                >
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={item.ContructionName}
                        onChange={(e) =>
                          handleNameChange(index, e.target.value)
                        }
                        className="w-full text-center"
                      />
                      {selectedItemIndex === index &&
                        searchResults[`construction-${index}`]?.length > 0 && (
                          <ul className="bg-white border border-gray-300 mt-1">
                            {searchResults[`construction-${index}`].map(
                              (result, idx) => (
                                <li
                                  key={`${result.Id}-${idx}`}
                                  onClick={() => {
                                    if (
                                      'SubConstructionId' in result ||
                                      'Coefficientts' in result
                                    ) {
                                      handleConstructionSelect(
                                        result as Construction,
                                      );
                                    }
                                  }}
                                  className="cursor-pointer hover:bg-gray-200 p-2"
                                >
                                  {result.Name}
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                    </>
                  ) : (
                    item.ContructionName
                  )}
                </td>
                <td
                  className="px-4 py-2 border text-center"
                  rowSpan={item.QuotationItems.length + 1}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.Type}
                      onChange={(e) => {
                        const updatedItems = [...items];
                        updatedItems[index].Type = e.target.value;
                        onItemsChange(updatedItems);
                      }}
                      className="w-full text-center"
                    />
                  ) : (
                    item.Type
                  )}
                </td>
                <td
                  className="px-4 py-2 border text-center"
                  style={{ maxWidth: '120px' }}
                  rowSpan={item.QuotationItems.length + 1}
                >
                  {isEditing ? (
                    <input
                      type="number"
                      value={item.Coefficient}
                      onChange={(e) => {
                        const updatedItems = [...items];
                        updatedItems[index].Coefficient = parseFloat(e.target.value);
                        onItemsChange(updatedItems);
                        item.QuotationItems.forEach((_, qItemIndex) => {
                          calculateTotalPrices(index, qItemIndex);
                        });
                      }}
                      className="w-full text-center"
                    />
                  ) : (
                    item.Coefficient
                  )}
                </td>
              </tr>
              {item.QuotationItems.map((quotationItem, qItemIndex) => (
                <tr key={quotationItem.Id}>
                  <td className="px-4 py-2 border text-center">
                    {isEditing ? (
                      <>
                        <select
                          value={searchTypes[`${index}-${qItemIndex}`] || 'Labor'}
                          onChange={(e) =>
                            handleSearchTypeChange(
                              index,
                              qItemIndex,
                              e.target.value as 'Labor' | 'Material',
                            )
                          }
                          className="mb-2"
                        >
                          <option value="Labor">Labor</option>
                          <option value="Material">Material</option>
                        </select>
                        <input
                          type="text"
                          value={quotationItem.Name}
                          onChange={(e) =>
                            handleItemNameChange(
                              index,
                              qItemIndex,
                              e.target.value,
                            )
                          }
                          className="w-full text-center"
                        />
                        {selectedItemIndex === index &&
                          searchResults[`item-${index}-${qItemIndex}`]?.length >
                            0 && (
                            <ul className="bg-white border border-gray-300 mt-1">
                              {searchResults[`item-${index}-${qItemIndex}`].map(
                                (result, idx) => (
                                  <li
                                    key={`${result.Id}-${idx}`}
                                    onClick={() =>
                                      handleItemSelect(
                                        result as Labor | Material,
                                        index,
                                        qItemIndex,
                                      )
                                    }
                                    className="cursor-pointer hover:bg-gray-200 p-2"
                                  >
                                    {result.Name}
                                  </li>
                                ),
                              )}
                            </ul>
                          )}
                      </>
                    ) : (
                      quotationItem.Name
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center" style={{ maxWidth: '80px' }}>
                    {quotationItem.Unit}
                  </td>
                  <td className="px-4 py-2 border text-center" style={{ maxWidth: '80px' }}>
                    {quotationItem.Weight}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        value={quotationItem.UnitPriceLabor || ''}
                        onChange={(e) => {
                          const updatedItems = [...items];
                          updatedItems[index].QuotationItems[qItemIndex].UnitPriceLabor = parseFloat(e.target.value);
                          onItemsChange(updatedItems);
                          calculateTotalPrices(index, qItemIndex);
                        }}
                        className="w-full text-center"
                      />
                    ) : (
                      quotationItem.UnitPriceLabor?.toLocaleString() || 'null'
                    )}{' '}
                    VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        value={quotationItem.UnitPriceRough || ''}
                        onChange={(e) => {
                          const updatedItems = [...items];
                          updatedItems[index].QuotationItems[qItemIndex].UnitPriceRough = parseFloat(e.target.value);
                          onItemsChange(updatedItems);
                          calculateTotalPrices(index, qItemIndex);
                        }}
                        className="w-full text-center"
                      />
                    ) : (
                      quotationItem.UnitPriceRough?.toLocaleString() || 'null'
                    )}{' '}
                    VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceLabor?.toLocaleString() || 'null'}{' '}
                    VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceRough?.toLocaleString() || 'null'}{' '}
                    VNĐ
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinalQuotationTable;
