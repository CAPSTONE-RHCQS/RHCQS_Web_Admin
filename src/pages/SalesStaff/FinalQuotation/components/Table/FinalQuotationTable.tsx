import React, { useState } from 'react';
import { FinalQuotationItem } from '../../../../../types/FinalQuotationTypes';
import { getConstructionByName } from '../../../../../api/Construction/ConstructionApi';
import { getLaborByName } from '../../../../../api/Labor/Labor';
import { getMaterialByName } from '../../../../../api/Material/Material';
import {
  Construction,
  Labor,
  Material,
} from '../../../../../types/SearchContainNameTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faPlus,
  faUser,
  faCubes,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

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

  const handleAddQuotationItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].QuotationItems.push({
      Id: '',
      LaborId: '',
      MaterialId: '',
      Name: '',
      Unit: '',
      Weight: 0,
      UnitPriceLabor: null,
      UnitPriceRough: null,
      UnitPriceFinished: null,
      TotalPriceLabor: null,
      TotalPriceRough: null,
      TotalPriceFinished: null,
      InsDate: null,
      UpsDate: null,
      Note: null,
    });
    onItemsChange(updatedItems);
  };

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
        ConstructionId: construction.Id,
        SubConstructionId: construction.SubConstructionId || null,
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
    const searchType = searchTypes[`${index}-${qItemIndex}`] || 'Labor';
    const isLabor = searchType === 'Labor';

    updatedItems[index].QuotationItems[qItemIndex] = {
      ...updatedItems[index].QuotationItems[qItemIndex],
      Name: item.Name,
      UnitPriceLabor: isLabor ? item.Price || 0 : 0,
      UnitPriceRough: !isLabor ? item.Price || 0 : 0,
      Unit: !isLabor && 'Unit' in item ? item.Unit : '',
      LaborId: isLabor ? item.Id : null,
      MaterialId: !isLabor ? item.Id : null,
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

    const updatedItems = [...items];
    updatedItems[index].QuotationItems[qItemIndex] = {
      ...updatedItems[index].QuotationItems[qItemIndex],
      Name: '',
      UnitPriceLabor: null,
      UnitPriceRough: null,
      LaborId: null,
      MaterialId: null,
    };
    onItemsChange(updatedItems);
  };

  const calculateTotalPrices = (index: number, qItemIndex: number) => {
    const updatedItems = [...items];
    const quotationItem = updatedItems[index].QuotationItems[qItemIndex];
    const coefficient = updatedItems[index].Coefficient || 1;

    quotationItem.TotalPriceLabor =
      (quotationItem.UnitPriceLabor || 0) *
      coefficient *
      (quotationItem.Weight || 0);

    quotationItem.TotalPriceRough =
      (quotationItem.UnitPriceRough || 0) *
      coefficient *
      (quotationItem.Weight || 0);

    onItemsChange(updatedItems);
  };

  const handleDeleteRow = (index: number, qItemIndex: number) => {
    const updatedItems = [...items];
    updatedItems[index].QuotationItems.splice(qItemIndex, 1);
    onItemsChange(updatedItems);
  };

  const handleDeleteConstruction = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    onItemsChange(updatedItems);
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const calculateColumnTotals = () => {
    let totalLabor = 0;
    let totalRough = 0;

    items.forEach(item => {
      item.QuotationItems.forEach(quotationItem => {
        totalLabor += quotationItem.TotalPriceLabor || 0;
        totalRough += quotationItem.TotalPriceRough || 0;
      });
    });

    return { totalLabor, totalRough };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center">Tên công trình</th>
            <th className="px-4 py-2 border text-center">Tên hạng mục</th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '75px' }}
            >
              Đơn vị
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '75px' }}
            >
              Số lượng
            </th>
            <th className="px-4 py-2 border text-center">Đơn giá nhân công</th>
            <th className="px-4 py-2 border text-center">Đơn giá vật tư thô</th>
            <th className="px-4 py-2 border text-center">Tổng giá nhân công</th>
            <th className="px-4 py-2 border text-center">
              Tổng giá vật tư thô
            </th>
            {isEditing && <th className="px-4 py-2 border text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <React.Fragment key={item.Id}>
              <tr className="hover:bg-gray-50">
                <td
                  className="px-4 py-2 border text-center whitespace-normal overflow-visible relative"
                  style={{ maxWidth: '500px', verticalAlign: 'middle' }}
                  rowSpan={item.QuotationItems.length + 1}
                >
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleDeleteConstruction(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full shadow hover:bg-red-600 transition duration-300"
                      >
                        <FontAwesomeIcon icon={faTimes} size="xs" />
                      </button>
                      <textarea
                        value={item.ContructionName}
                        onChange={(e) => {
                          handleNameChange(index, e.target.value);
                          adjustTextareaHeight(e.target);
                        }}
                        className="w-full text-center whitespace-normal overflow-visible mt-8"
                        style={{
                          maxWidth: '500px',
                          resize: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                        }}
                        rows={3}
                        ref={(textarea) => {
                          if (textarea) adjustTextareaHeight(textarea);
                        }}
                      />
                      {selectedItemIndex === index &&
                        searchResults[`construction-${index}`]?.length > 0 && (
                          <ul className="bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto">
                            {searchResults[`construction-${index}`]
                              .filter(
                                (result): result is Construction =>
                                  'SubConstructionId' in result &&
                                  'Coefficient' in result,
                              )
                              .map((construction) => (
                                <li
                                  key={construction.Id}
                                  onClick={() =>
                                    handleConstructionSelect(construction)
                                  }
                                  className="cursor-pointer hover:bg-blue-100 p-2 flex items-center"
                                >
                                  <FontAwesomeIcon
                                    icon={faCubes}
                                    className="mr-2"
                                  />
                                  {construction.Name}
                                </li>
                              ))}
                          </ul>
                        )}
                    </>
                  ) : (
                    item.ContructionName
                  )}
                </td>

                {isEditing && (
                  <td colSpan={7} className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleAddQuotationItem(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faPlus} /> Thêm hạng mục
                    </button>
                  </td>
                )}
              </tr>
              {item.QuotationItems.map((quotationItem, qItemIndex) => (
                <tr
                  key={quotationItem.Id || qItemIndex}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border text-center">
                    {isEditing ? (
                      <>
                        <select
                          value={
                            searchTypes[`${index}-${qItemIndex}`] || 'Labor'
                          }
                          onChange={(e) =>
                            handleSearchTypeChange(
                              index,
                              qItemIndex,
                              e.target.value as 'Labor' | 'Material',
                            )
                          }
                          className="mb-2"
                        >
                          <option value="Labor">Nhân công</option>
                          <option value="Material">Vật tư</option>
                        </select>
                        <textarea
                          value={quotationItem.Name}
                          onChange={(e) => {
                            handleItemNameChange(
                              index,
                              qItemIndex,
                              e.target.value,
                            );
                            adjustTextareaHeight(e.target);
                          }}
                          className="w-full text-center"
                          style={{
                            resize: 'none',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                          }}
                          rows={1}
                          ref={(textarea) => {
                            if (textarea) adjustTextareaHeight(textarea);
                          }}
                        />
                        {selectedItemIndex === index &&
                          searchResults[`item-${index}-${qItemIndex}`]?.length >
                            0 && (
                            <ul className="bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto">
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
                                    className="cursor-pointer hover:bg-blue-100 p-2 flex items-center"
                                  >
                                    <FontAwesomeIcon
                                      icon={
                                        searchTypes[
                                          `${index}-${qItemIndex}`
                                        ] === 'Labor'
                                          ? faUser
                                          : faCubes
                                      }
                                      className="mr-2"
                                    />
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
                  <td
                    className="px-4 py-2 border text-center"
                    style={{ maxWidth: '80px' }}
                  >
                    {quotationItem.Unit}
                  </td>
                  <td
                    className="px-4 py-2 border text-center"
                    style={{ maxWidth: '80px' }}
                  >
                    {isEditing ? (
                      <input
                        type="number"
                        value={quotationItem.Weight || ''}
                        onChange={(e) => {
                          const updatedItems = [...items];
                          updatedItems[index].QuotationItems[
                            qItemIndex
                          ].Weight = parseFloat(e.target.value) || 0;
                          onItemsChange(updatedItems);
                          calculateTotalPrices(index, qItemIndex);
                        }}
                        className="w-full text-center"
                      />
                    ) : (
                      quotationItem.Weight
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.UnitPriceLabor
                      ? `${quotationItem.UnitPriceLabor.toLocaleString()} VNĐ`
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.UnitPriceRough
                      ? `${quotationItem.UnitPriceRough.toLocaleString()} VNĐ`
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceLabor
                      ? `${quotationItem.TotalPriceLabor.toLocaleString()} VNĐ`
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceRough
                      ? `${quotationItem.TotalPriceRough.toLocaleString()} VNĐ`
                      : ''}
                  </td>
                  {isEditing && (
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleDeleteRow(index, qItemIndex)}
                        className="bg-red-500 text-white w-8 h-8 flex items-center justify-center shadow hover:bg-red-600 transition duration-300"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={6} className="px-4 py-2 border text-center font-bold">Tổng cộng</td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateColumnTotals().totalLabor.toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateColumnTotals().totalRough.toLocaleString()} VNĐ
            </td>
            {isEditing && <td className="px-4 py-2 border text-center"></td>}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinalQuotationTable;
