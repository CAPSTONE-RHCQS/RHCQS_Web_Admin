import React, { useState, useEffect, useRef } from 'react';
import {
  FinalQuotationItem,
  PackageQuotationList,
  QuotationItem,
} from '../../../../../types/FinalQuotationTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClose,
  faPlus,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { searchConstructionWork } from '../../../../../api/Construction/ConstructionApi';
import { ConstructionWork } from '../../../../../types/ConstructionTypes';
import { getConstructionByType } from '../../../../../api/Construction/ConstructionApi';
import { ConstructionTypeResponse } from '../../../../../types/ConstructionTypeResponse';
import { getConstructionWork } from '../../../../../api/Construction/ConstructionApi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import {
  uploadConstructionWork,
  ConstructionWorkResponse,
  ConstructionItem,
  WorkTemplates,
} from '../../../../../api/Construction/uploadConstructionWorkApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [constructionOptions, setConstructionOptions] = useState<
    ConstructionTypeResponse[]
  >([]);
  const [selectedRoughConstruction, setSelectedRoughConstruction] = useState<
    string | null
  >(null);
  const [selectedFinishedConstruction, setSelectedFinishedConstruction] =
    useState<string | null>(null);

  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const weightInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    items.map(() => true),
  );

  const [isRoughModalOpen, setIsRoughModalOpen] = useState(false);
  const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);

  const [uploadedData, setUploadedData] =
    useState<ConstructionWorkResponse | null>(null);

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

  useEffect(() => {
    const fetchConstructionOptions = async () => {
      try {
        let roughConstructions: ConstructionTypeResponse[] = [];
        let finishedConstructions: ConstructionTypeResponse[] = [];

        if (quotationPackage.IdPackageRough) {
          roughConstructions = await getConstructionByType(
            quotationPackage.IdPackageRough,
            'WORK_ROUGH',
          );
        }

        if (quotationPackage.IdPackageFinished) {
          finishedConstructions = await getConstructionByType(
            quotationPackage.IdPackageFinished,
            'WORK_FINISHED',
          );
        }

        setConstructionOptions([
          ...roughConstructions,
          ...finishedConstructions,
        ]);
      } catch (error) {
        console.error('Error fetching construction options:', error);
      }
    };

    fetchConstructionOptions();
  }, [quotationPackage]);

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

    try {
      const constructionItemId = items[constructionIndex].ConstructionId;
      const constructionType = items[constructionIndex].Type;

      const packageId =
        constructionType === 'WORK_ROUGH'
          ? quotationPackage.IdPackageRough
          : quotationPackage.IdPackageFinished;

      if (packageId) {
        const results = await searchConstructionWork(
          packageId,
          constructionItemId,
          newValue,
        );
        setSearchResults(results);
      } else {
        console.warn(
          'Package ID is not available for the construction type:',
          constructionType,
        );
      }
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

  const handleCreateRoughConstruction = async () => {
    if (selectedRoughConstruction) {
      const construction = roughConstructionOptions.find(
        (c) => c.Id === selectedRoughConstruction,
      );
      if (construction) {
        try {
          const constructionWorks = await getConstructionWork(
            quotationPackage.IdPackageRough as string,
            construction.Id,
          );

          const newQuotationItems = constructionWorks.map((work) => ({
            Id: '',
            WorkTemplateId: work.WorkTemplateId,
            WorkName: work.ConstructionWorkName,
            Unit: work.Unit,
            Weight: 0,
            UnitPriceLabor: work.LaborCost,
            UnitPriceRough: work.MaterialRoughCost,
            UnitPriceFinished: work.MaterialFinishedCost,
            TotalPriceLabor: 0,
            TotalPriceRough: 0,
            TotalPriceFinished: 0,
            InsDate: null,
            UpsDate: null,
            Note: null,
          }));

          const newItem: FinalQuotationItem = {
            Id: '',
            ConstructionId: construction.Id,
            SubConstructionId: null,
            ContructionName: construction.Name,
            Area: null,
            Type: construction.Type,
            InsDate: new Date().toISOString(),
            QuotationItems: newQuotationItems,
          };

          onItemsChange([...items, newItem]);
          setSelectedRoughConstruction(null);
        } catch (error) {
          console.error('Error fetching construction work:', error);
        }
      }
    }
  };

  const handleCreateFinishedConstruction = async () => {
    if (selectedFinishedConstruction) {
      const construction = finishedConstructionOptions.find(
        (c) => c.Id === selectedFinishedConstruction,
      );
      if (construction) {
        try {
          const constructionWorks = await getConstructionWork(
            quotationPackage.IdPackageFinished as string,
            construction.Id,
          );

          const newQuotationItems = constructionWorks.map((work) => ({
            Id: '',
            WorkTemplateId: work.WorkTemplateId,
            WorkName: work.ConstructionWorkName,
            Unit: work.Unit,
            Weight: 0,
            UnitPriceLabor: work.LaborCost,
            UnitPriceRough: work.MaterialRoughCost,
            UnitPriceFinished: work.MaterialFinishedCost,
            TotalPriceLabor: 0,
            TotalPriceRough: 0,
            TotalPriceFinished: 0,
            InsDate: null,
            UpsDate: null,
            Note: null,
          }));

          const newItem: FinalQuotationItem = {
            Id: '',
            ConstructionId: construction.Id,
            SubConstructionId: null,
            ContructionName: construction.Name,
            Area: null,
            Type: construction.Type,
            InsDate: new Date().toISOString(),
            QuotationItems: newQuotationItems,
          };

          onItemsChange([...items, newItem]);
          setSelectedFinishedConstruction(null);
        } catch (error) {
          console.error('Error fetching construction work:', error);
        }
      }
    }
  };

  const handleDeleteConstruction = (constructionIndex: number) => {
    const updatedItems = items.filter(
      (_, index) => index !== constructionIndex,
    );
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

  const roughConstructionOptions = constructionOptions.filter(
    (construction) => construction.Type === 'WORK_ROUGH',
  );

  const finishedConstructionOptions = constructionOptions.filter(
    (construction) => construction.Type === 'WORK_FINISHED',
  );

  const toggleVisibility = (index: number) => {
    setVisibleItems((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const handleRoughUploadClick = () => {
    setIsRoughModalOpen(true);
  };

  const handleFinishedUploadClick = () => {
    setIsFinishedModalOpen(true);
  };

  const handleCloseRoughModal = () => {
    setIsRoughModalOpen(false);
    setUploadedData(null);
  };

  const handleCloseFinishedModal = () => {
    setIsFinishedModalOpen(false);
    setUploadedData(null);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    isRough: boolean,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedData(null);
      const packageId = isRough
        ? quotationPackage.IdPackageRough
        : quotationPackage.IdPackageFinished;
      if (!packageId) {
        console.error('Package ID is not available.');
        return;
      }
      try {
        const data = await uploadConstructionWork(file, packageId);
        setUploadedData(data);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Lỗi! Không thể tải lên file.');
        event.target.value = '';
      }
    }
  };

  const handleConfirmUpload = () => {
    if (uploadedData) {
      const newItems = uploadedData.map((construction: ConstructionItem) => ({
        Id: '',
        ConstructionId: construction.ConstructionId,
        SubConstructionId: null,
        ContructionName: construction.ConstructionName,
        Area: null,
        Type: 'WORK_UPLOADED',
        InsDate: new Date().toISOString(),
        QuotationItems: construction.WorkTemplates.map(
          (work: WorkTemplates) => {
            const totalPriceLabor = (work.LaborCost ?? 0) * (work.Weight ?? 0);
            const totalPriceRough =
              (work.MaterialCost ?? 0) * (work.Weight ?? 0);
            const totalPriceFinished =
              (work.MaterialFinishedCost ?? 0) * (work.Weight ?? 0);

            return {
              Id: '',
              WorkTemplateId: work.WorkTemplateId,
              WorkName: work.ConstructionWorkName,
              Unit: work.Unit,
              Weight: work.Weight,
              UnitPriceLabor: work.LaborCost,
              UnitPriceRough: work.MaterialCost,
              UnitPriceFinished: work.MaterialFinishedCost,
              TotalPriceLabor: totalPriceLabor,
              TotalPriceRough: totalPriceRough,
              TotalPriceFinished: totalPriceFinished,
              InsDate: null,
              UpsDate: null,
              Note: null,
            };
          },
        ),
      }));
      onItemsChange([...items, ...newItems]);
      setIsRoughModalOpen(false);
      setIsFinishedModalOpen(false);
      setUploadedData(null);
    }
  };

  const handleAddConstructionWork = () => {
    const newConstructionWork: FinalQuotationItem = {
      Id: '',
      ConstructionId: '',
      SubConstructionId: null,
      ContructionName: 'New Construction Work',
      Area: null,
      Type: 'WORK_NEW',
      InsDate: new Date().toISOString(),
      QuotationItems: [],
    };
    onItemsChange([...items, newConstructionWork]);
  };

  return (
    <div>
      {isEditing && (
        <div className="flex flex-col md:flex-row items-center mb-4 space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <select
              value={selectedRoughConstruction || ''}
              onChange={(e) => setSelectedRoughConstruction(e.target.value)}
              className="border p-2"
            >
              <option value="" disabled>
                Chọn công trình Thô
              </option>
              {roughConstructionOptions.map((construction) => (
                <option key={construction.Id} value={construction.Id}>
                  {construction.Name}
                </option>
              ))}
            </select>
            <button
              className="bg-primaryGreenButton hover:bg-secondaryGreenButton text-white px-4 py-2 rounded"
              onClick={handleCreateRoughConstruction}
              disabled={!selectedRoughConstruction}
            >
              <FontAwesomeIcon icon={faPlus} /> Tạo công trình Thô
            </button>
          </div>
          <button
            className="bg-primaryGreenButton hover:bg-secondaryGreenButton text-white px-4 py-2 rounded"
            onClick={handleRoughUploadClick}
          >
            <FontAwesomeIcon icon={faUpload} />
          </button>

          <div className="flex items-center space-x-2">
            <select
              value={selectedFinishedConstruction || ''}
              onChange={(e) => setSelectedFinishedConstruction(e.target.value)}
              className="border p-2"
            >
              <option value="" disabled>
                Chọn công trình Hoàn thiện
              </option>
              {finishedConstructionOptions.map((construction) => (
                <option key={construction.Id} value={construction.Id}>
                  {construction.Name}
                </option>
              ))}
            </select>
            <button
              className="bg-primaryGreenButton hover:bg-secondaryGreenButton text-white px-4 py-2 rounded"
              onClick={handleCreateFinishedConstruction}
              disabled={!selectedFinishedConstruction}
            >
              <FontAwesomeIcon icon={faPlus} /> Tạo công trình Hoàn thiện
            </button>
          </div>
          <button
            className="bg-primaryGreenButton hover:bg-secondaryGreenButton text-white px-4 py-2 rounded"
            onClick={handleFinishedUploadClick}
          >
            <FontAwesomeIcon icon={faUpload} />
          </button>
        </div>
      )}

      {isRoughModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseRoughModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl relative ml-20 mt-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Tải lên công trình Thô</h2>
              <button
                onClick={handleCloseRoughModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => handleFileUpload(e, true)}
              className="mb-4"
            />
            {uploadedData && (
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="min-w-full bg-white border border-gray-200 mt-2">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 border text-center" rowSpan={2}>
                        Tên công việc
                      </th>
                      <th className="px-4 py-2 border text-center" rowSpan={2}>
                        Đơn vị
                      </th>
                      <th className="px-4 py-2 border text-center" rowSpan={2}>
                        Khối lượng
                      </th>
                      <th className="px-4 py-2 border text-center" colSpan={3}>
                        Đơn giá
                      </th>
                      <th className="px-4 py-2 border text-center" colSpan={3}>
                        Thành tiền
                      </th>
                    </tr>
                    <tr>
                      <th className="px-4 py-2 border text-center">
                        Nhân công
                      </th>
                      <th className="px-4 py-2 border text-center">
                        Vật tư thô
                      </th>
                      <th className="px-4 py-2 border text-center">
                        Vật tư H.T
                      </th>
                      <th className="px-4 py-2 border text-center">
                        Nhân công
                      </th>
                      <th className="px-4 py-2 border text-center">
                        Vật tư thô
                      </th>
                      <th className="px-4 py-2 border text-center">
                        Vật tư H.T
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedData.map(
                      (construction: ConstructionItem, index: number) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td
                              colSpan={9}
                              className="px-4 py-2 border text-left font-bold bg-gray-200"
                            >
                              {construction.ConstructionName}
                            </td>
                          </tr>
                          {construction.WorkTemplates.map(
                            (work: WorkTemplates, workIndex: number) => (
                              <tr key={workIndex}>
                                <td className="px-4 py-2 border text-center">
                                  {work.ConstructionWorkName}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {work.Unit}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {work.Weight}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {work.LaborCost.toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {work.MaterialCost.toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {work.MaterialFinishedCost.toLocaleString(
                                    'vi-VN',
                                  )}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {(
                                    work.LaborCost * work.Weight
                                  ).toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {(
                                    work.MaterialCost * work.Weight
                                  ).toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {(
                                    work.MaterialFinishedCost * work.Weight
                                  ).toLocaleString('vi-VN')}
                                </td>
                              </tr>
                            ),
                          )}
                        </React.Fragment>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleConfirmUpload}
                className="bg-primaryGreenButton hover:bg-secondaryGreenButton text-white px-4 py-2 rounded mt-4"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {isFinishedModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseFinishedModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl relative ml-20 mt-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Tải lên công trình Hoàn thiện
              </h2>
              <button
                onClick={handleCloseFinishedModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => handleFileUpload(e, false)}
              className="mb-4"
            />
            {uploadedData && (
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="min-w-full bg-white border border-gray-200 mt-2">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 border text-center" rowSpan={2}>
                        Tên công việc
                      </th>
                      <th className="px-4 py-2 border text-center" rowSpan={2}>
                        Đơn vị
                      </th>
                      <th className="px-4 py-2 border text-center" rowSpan={2}>
                        Khối lượng
                      </th>
                      <th className="px-4 py-2 border text-center" colSpan={3}>
                        Đơn giá
                      </th>
                      <th className="px-4 py-2 border text-center" colSpan={3}>
                        Thành tiền
                      </th>
                    </tr>
                    <tr>
                      <th className="px-4 py-2 border text-center">
                        Nhân công
                      </th>
                      <th className="px-4 py-2 border text-center">
                        Vật tư thô
                      </th>
                      <th className="px-4 py-2 border text-center">
                        Vật tư H.T
                      </th>
                      <th className="px-4 py-2 border text-center">
                        Nhân công
                      </th>
                      <th className="px-4 py-2 border text-center">
                        Vật tư thô
                      </th>
                      <th className="px-4 py-2 border text-center">
                        Vật tư H.T
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedData.map(
                      (construction: ConstructionItem, index: number) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td
                              colSpan={9}
                              className="px-4 py-2 border text-left font-bold bg-gray-200"
                            >
                              {construction.ConstructionName}
                            </td>
                          </tr>
                          {construction.WorkTemplates.map(
                            (work: WorkTemplates, workIndex: number) => (
                              <tr key={workIndex}>
                                <td className="px-4 py-2 border text-center">
                                  {work.ConstructionWorkName}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {work.Unit}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {work.Weight}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {work.LaborCost.toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {work.MaterialCost.toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {work.MaterialFinishedCost.toLocaleString(
                                    'vi-VN',
                                  )}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {(
                                    work.LaborCost * work.Weight
                                  ).toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {(
                                    work.MaterialCost * work.Weight
                                  ).toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  {(
                                    work.MaterialFinishedCost * work.Weight
                                  ).toLocaleString('vi-VN')}
                                </td>
                              </tr>
                            ),
                          )}
                        </React.Fragment>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleConfirmUpload}
                className="bg-primaryGreenButton hover:bg-secondaryGreenButton text-white px-4 py-2 rounded mt-4"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

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
              <tr
                onClick={() => toggleVisibility(itemIndex)}
                className="cursor-pointer"
              >
                <td
                  colSpan={isEditing ? 10 : 9}
                  className="px-4 py-2 border text-left font-bold relative bg-gray-200"
                >
                  <div className="flex items-center">
                    <span>{item.ContructionName}</span>
                    <span className="ml-2 text-blue-500 hover:text-blue-700">
                      {visibleItems[itemIndex] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </span>
                    {isEditing && (
                      <button
                        className="text-red-500 hover:text-red-700 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConstruction(itemIndex);
                        }}
                      >
                        <FontAwesomeIcon icon={faClose} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {visibleItems[itemIndex] &&
                item.QuotationItems.map((qItem, qItemIndex) => (
                  <React.Fragment key={qItemIndex}>
                    <tr>
                      <td className="px-4 py-2 border text-left align-top">
                        {isEditing ? (
                          <textarea
                            ref={(el) =>
                              (textareaRefs.current[qItemIndex] = el)
                            }
                            value={qItem.WorkName}
                            className="w-full font-bold text-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                            placeholder="Nhập tên công việc"
                            rows={2}
                            style={{
                              resize: 'none',
                              overflow: 'hidden',
                              minHeight: '100px',
                              maxHeight: '400px',
                              width: '100%',
                              border: '1px solid #ccc',
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
                                    className="mr-2 text-blue-500 "
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
                            step="0.0001"
                            ref={(el) =>
                              (weightInputRefs.current[qItemIndex] = el)
                            }
                            value={
                              qItem.Weight !== undefined ? qItem.Weight : ''
                            }
                            className="w-full text-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                            style={{
                              maxWidth: '70px',
                              overflow: 'hidden',
                              minHeight: '30px',
                              resize: 'vertical',
                              border: '1px solid #ccc',
                            }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                handleWeightChange(itemIndex, qItemIndex, 0);
                              } else {
                                const newValue = parseFloat(value);
                                if (!isNaN(newValue) && newValue >= 0) {
                                  handleWeightChange(
                                    itemIndex,
                                    qItemIndex,
                                    newValue,
                                  );
                                } else {
                                  e.target.value = qItem.Weight.toString();
                                }
                              }
                            }}
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
        GIÁ TRỊ BÁO GIÁ CHI TIẾT XÂY DỰNG:
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
