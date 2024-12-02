import React, { useState, useEffect, useRef } from 'react';
import {
  FinalQuotationItem,
  PackageQuotationList,
  QuotationItem,
} from '../../../../../types/FinalQuotationTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { searchConstructionWork } from '../../../../../api/Construction/ConstructionApi';
import { ConstructionWork } from '../../../../../types/ConstructionTypes';

interface FinalQuotationTableProps {
  items: FinalQuotationItem[];
  quotationPackage: PackageQuotationList;
  onItemsChange: (updatedItems: FinalQuotationItem[]) => void;
  isEditing: boolean;
}

const FinalQuotationTable: React.FC<FinalQuotationTableProps> = ({
  items,
  quotationPackage,
  onItemsChange,
  isEditing,
}) => {
  const [searchResults, setSearchResults] = useState<ConstructionWork[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
    constructionIndex: number;
    qItemIndex: number;
  } | null>(null);

  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const weightInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    items.forEach((item, itemIndex) => {
      item.QuotationItems.forEach((_, qItemIndex) => {
        const textarea = textareaRefs.current[qItemIndex];
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      });
    });
  }, [items]);

  const handleAddNewItem = (constructionIndex: number) => {
    const newItem: QuotationItem = {
      Id: '',
      WorkTemplateId: null,
      WorkName: '',
      Unit: '',
      Weight: 0,
      UnitPriceLabor: 0,
      UnitPriceRough: 0,
      UnitPriceFinished: 0,
      TotalPriceLabor: 0,
      TotalPriceRough: 0,
      TotalPriceFinished: 0,
      InsDate: null,
      UpsDate: null,
      Note: null,
    };
    items[constructionIndex].QuotationItems.push(newItem);
    onItemsChange([...items]);
  };

  const handleWorkNameChange = async (
    constructionIndex: number,
    qItemIndex: number,
    newValue: string,
  ) => {
    const updatedItems = [...items];
    updatedItems[constructionIndex].QuotationItems[qItemIndex].WorkName =
      newValue;
    setSelectedItem({ constructionIndex, qItemIndex });

    // Gọi API tìm kiếm với IdPackageRough
    try {
      const results = await searchConstructionWork(
        quotationPackage.IdPackageRough || '',
        newValue,
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching construction work:', error);
    }
  };

  const handleSelectSearchResult = (
    constructionIndex: number,
    qItemIndex: number,
    selectedWork: ConstructionWork,
  ) => {
    const updatedItems = [...items];
    const qItem = updatedItems[constructionIndex].QuotationItems[qItemIndex];
    qItem.WorkName = selectedWork.ConstructionWorkName;
    qItem.WorkTemplateId = selectedWork.WorkTemplateId;
    qItem.Unit = selectedWork.Unit;
    qItem.UnitPriceLabor = selectedWork.LaborCost;
    qItem.UnitPriceRough = selectedWork.MaterialRoughCost;
    qItem.UnitPriceFinished = selectedWork.MaterialFinishedCost;
    qItem.Weight = qItem.Weight || 0;
    qItem.TotalPriceLabor = (qItem.UnitPriceLabor ?? 0) * qItem.Weight;
    qItem.TotalPriceRough = (qItem.UnitPriceRough ?? 0) * qItem.Weight;
    qItem.TotalPriceFinished = (qItem.UnitPriceFinished ?? 0) * qItem.Weight;
    setSearchResults([]);
    onItemsChange(updatedItems);

    const weightInput = weightInputRefs.current[qItemIndex];
    if (weightInput) {
      weightInput.focus();
    }
  };

  const handleWeightChange = (
    constructionIndex: number,
    qItemIndex: number,
    newValue: number,
  ) => {
    const updatedItems = [...items];
    const qItem = updatedItems[constructionIndex].QuotationItems[qItemIndex];
    qItem.Weight = newValue;
    qItem.TotalPriceLabor = (qItem.UnitPriceLabor ?? 0) * newValue;
    qItem.TotalPriceRough = (qItem.UnitPriceRough ?? 0) * newValue;
    qItem.TotalPriceFinished = (qItem.UnitPriceFinished ?? 0) * newValue;
    onItemsChange(updatedItems);
  };

  const handleDeleteItem = (constructionIndex: number, qItemIndex: number) => {
    const updatedItems = [...items];
    updatedItems[constructionIndex].QuotationItems.splice(qItemIndex, 1);
    onItemsChange(updatedItems);
  };

  const calculateTotals = () => {
    let totalLabor = 0;
    let totalRough = 0;
    let totalFinished = 0;

    items.forEach((item) => {
      item.QuotationItems.forEach((qItem) => {
        totalLabor += qItem.TotalPriceLabor || 0;
        totalRough += qItem.TotalPriceRough || 0;
        totalFinished += qItem.TotalPriceFinished || 0;
      });
    });

    return { totalLabor, totalRough, totalFinished };
  };

  const totals = calculateTotals();

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-200 mt-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center" rowSpan={2}>
              Nội dung công việc
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '75px' }}
              rowSpan={2}
            >
              Đơn vị
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '75px' }}
              rowSpan={2}
            >
              Khối lượng
            </th>
            <th className="px-4 py-2 border text-center" colSpan={3}>
              Đơn giá
            </th>
            <th className="px-4 py-2 border text-center" colSpan={3}>
              Thành tiền
            </th>
            {isEditing && (
              <th className="px-4 py-2 border text-center" rowSpan={2}></th>
            )}
          </tr>
          <tr>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Nhân công
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Vật tư thô
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Vật tư H.T
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Nhân công
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Vật tư thô
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Vật tư H.T
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, itemIndex) => (
            <React.Fragment key={itemIndex}>
              <tr>
                <td
                  colSpan={isEditing ? 10 : 9}
                  className="px-4 py-2 border text-left font-bold bg-gray-200"
                >
                  {item.ContructionName}
                </td>
              </tr>
              {item.QuotationItems.map((qItem, qItemIndex) => (
                <React.Fragment key={qItemIndex}>
                  <tr>
                    <td className="px-4 py-2 border text-left align-top">
                      {isEditing ? (
                        <textarea
                          ref={(el) => (textareaRefs.current[qItemIndex] = el)}
                          value={qItem.WorkName}
                          className="w-full border-none p-2 font-bold"
                          placeholder="Nhập tên công việc"
                          rows={2}
                          style={{
                            resize: 'none',
                            overflow: 'hidden',
                            minHeight: '100px',
                            maxHeight: '400px',
                            width: '100%',
                          }}
                          onChange={(e) => {
                            handleWorkNameChange(
                              itemIndex,
                              qItemIndex,
                              e.target.value,
                            );
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                        />
                      ) : (
                        <span className="font-bold">{qItem.WorkName}</span>
                      )}
                      {isEditing &&
                        selectedItem?.constructionIndex === itemIndex &&
                        selectedItem?.qItemIndex === qItemIndex &&
                        searchResults.length > 0 && (
                          <ul
                            className="bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto"
                            style={{ width: '100%' }}
                          >
                            {searchResults.map((result, resultIndex) => (
                              <li
                                key={resultIndex}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() =>
                                  handleSelectSearchResult(
                                    itemIndex,
                                    qItemIndex,
                                    result,
                                  )
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  className="mr-2 text-blue-500"
                                />
                                <span className="font-bold">
                                  {result.ConstructionWorkName}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {qItem.Unit}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          ref={(el) =>
                            (weightInputRefs.current[qItemIndex] = el)
                          }
                          value={qItem.Weight || ''}
                          className="w-full border-none text-center"
                          style={{ maxWidth: '50px' }}
                          onChange={(e) =>
                            handleWeightChange(
                              itemIndex,
                              qItemIndex,
                              parseFloat(e.target.value),
                            )
                          }
                          required
                        />
                      ) : qItem.Weight !== 0 ? (
                        qItem.Weight
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {qItem.UnitPriceLabor !== null &&
                      qItem.UnitPriceLabor !== 0
                        ? qItem.UnitPriceLabor.toLocaleString('vi-VN')
                        : ''}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {qItem.UnitPriceRough !== null &&
                      qItem.UnitPriceRough !== 0
                        ? qItem.UnitPriceRough.toLocaleString('vi-VN')
                        : ''}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {qItem.UnitPriceFinished !== null &&
                      qItem.UnitPriceFinished !== 0
                        ? qItem.UnitPriceFinished.toLocaleString('vi-VN')
                        : ''}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {qItem.TotalPriceLabor !== null &&
                      qItem.TotalPriceLabor !== 0
                        ? qItem.TotalPriceLabor.toLocaleString('vi-VN')
                        : ''}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {qItem.TotalPriceRough !== null &&
                      qItem.TotalPriceRough !== 0
                        ? qItem.TotalPriceRough.toLocaleString('vi-VN')
                        : ''}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {qItem.TotalPriceFinished !== null &&
                      qItem.TotalPriceFinished !== 0
                        ? qItem.TotalPriceFinished.toLocaleString('vi-VN')
                        : ''}
                    </td>
                    {isEditing && (
                      <td className="px-4 py-2 border text-center">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDeleteItem(itemIndex, qItemIndex)
                          }
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    )}
                  </tr>
                </React.Fragment>
              ))}
              {isEditing && (
                <tr>
                  <td colSpan={10} className="px-4 py-2 border text-center">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleAddNewItem(itemIndex)}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Thêm hạng mục
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={6} className="px-4 py-2 border text-center font-bold">
              Tổng cộng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateTotals().totalLabor.toLocaleString('vi-VN')} VNĐ
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateTotals().totalRough.toLocaleString('vi-VN')} VNĐ
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateTotals().totalFinished.toLocaleString('vi-VN')} VNĐ
            </td>
            {isEditing && <td className="px-4 py-2 border text-center"></td>}
          </tr>
        </tbody>
      </table>

      <h3 className="text-lg font-bold mt-4">
        GIÁ TRỊ BÁO GIÁ CHI TIẾT XÂY DỰNG TRƯỚC THUẾ:
      </h3>
      <table className="min-w-full bg-white border border-gray-200 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center font-semibold">
              Tổng giá nhân công
            </th>
            <th className="px-4 py-2 border text-center font-semibold">+</th>
            <th className="px-4 py-2 border text-center font-semibold">
              Tổng giá vật tư thô
            </th>
            <th className="px-4 py-2 border text-center font-semibold">+</th>
            <th className="px-4 py-2 border text-center font-semibold">
              Tổng giá vật tư hoàn thiện
            </th>
            <th className="px-4 py-2 border text-center font-semibold">=</th>
            <th className="px-4 py-2 border text-center font-semibold">
              Tổng giá trị xây dựng
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border text-center">
              {totals.totalLabor.toLocaleString('vi-VN')}
            </td>
            <td className="px-4 py-2 border text-center">+</td>
            <td className="px-4 py-2 border text-center">
              {totals.totalRough.toLocaleString('vi-VN')}
            </td>
            <td className="px-4 py-2 border text-center">+</td>
            <td className="px-4 py-2 border text-center">
              {totals.totalFinished.toLocaleString('vi-VN')}
            </td>
            <td className="px-4 py-2 border text-center">=</td>
            <td className="px-4 py-2 border text-center font-bold">
              {(
                totals.totalLabor +
                totals.totalRough +
                totals.totalFinished
              ).toLocaleString('vi-VN')}{' '}
              VNĐ
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinalQuotationTable;
