import React, { useState, useEffect, useCallback, useRef } from 'react';
import ConstructionAreaTable from './components/Table/ConstructionAreaTable';
import {
  BatchPaymentInfo,
  InitialQuotationResponse,
  PromotionInfo,
  UtilityInfo,
} from '../../../types/InitialQuotationTypes';
import { TableRow } from './components/types';
import UtilityTable from './components/Table/UtilityTable';
import ConstructionPrice from './components/Table/ConstructionPrice';
import BatchPaymentTable from './components/Table/BatchPaymentTable';
import ContractValueSummaryTable from './components/Table/ContractValueSummaryTable';
import { FaPlus, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { getPromotionByName } from '../../../api/Promotion/PromotionApi';
import { Promotion } from '../../../types/SearchContainNameTypes';
import OthersAgreementEditor from './components/Table/OthersAgreementEditor';
import PromotionTable from './components/Table/PromotionTable';
import CreateNewActionButtons from './components/CreateNewActionButtons';

interface QuotationSummaryProps {
  quotationData: InitialQuotationResponse;
  setQuotationData: React.Dispatch<
    React.SetStateAction<InitialQuotationResponse | null>
  >;
  tableData: TableRow[];
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;
  isEditing: boolean;
  totalArea: number;
  donGia: number;
  totalRough: number;
  utilityInfos: any[];
  setUtilityInfos: React.Dispatch<React.SetStateAction<UtilityInfo[]>>;
  totalUtilities: number;
  promotionInfo: PromotionInfo | null;
  setPromotionInfo: React.Dispatch<React.SetStateAction<PromotionInfo | null>>;
  giaTriHopDong: number;
  setGiaTriHopDong: React.Dispatch<React.SetStateAction<number>>;
  batchPayment: any[];
  setBatchPayment: React.Dispatch<React.SetStateAction<BatchPaymentInfo[]>>;
  totalPercentage: number;
  totalAmount: number;
  othersAgreement: string;
  setOthersAgreement: React.Dispatch<React.SetStateAction<string>>;
  onPriceChange: (prices: number[]) => void;
  quantities: (number | null)[];
  setQuantities: React.Dispatch<React.SetStateAction<(number | null)[]>>;
  isSaving: boolean;
  handleEditToggle: () => void;
  handleSave: () => void;
}

const QuotationSummary: React.FC<QuotationSummaryProps> = ({
  quotationData,
  setQuotationData,
  tableData,
  setTableData,
  isEditing,
  totalArea,
  totalRough,
  utilityInfos,
  setUtilityInfos,
  totalUtilities,
  promotionInfo,
  setPromotionInfo,
  giaTriHopDong,
  setGiaTriHopDong,
  batchPayment,
  setBatchPayment,
  totalPercentage,
  totalAmount,
  onPriceChange,
  quantities,
  setQuantities,
  isSaving,
  handleEditToggle,
  handleSave,
}) => {
  const [searchName, setSearchName] = useState<string>('');
  const [promotionList, setPromotionList] = useState<Promotion[]>([]);
  const previousSearchNameRef = useRef<string>('');
  const [totalUtility, setTotalUtility] = useState<number>(0);

  const fetchPromotions = useCallback(async () => {
    const { IdPackageFinished, IdPackageRough } =
      quotationData.PackageQuotationList;

    if (
      searchName.trim() === '' ||
      searchName === previousSearchNameRef.current
    ) {
      setPromotionList([]);
      return;
    }

    let promotionsFinished: Promotion[] = [];
    let promotionsRough: Promotion[] = [];

    try {
      if (IdPackageFinished) {
        promotionsFinished = await getPromotionByName(
          searchName,
          IdPackageFinished,
        );
      }
    } catch (error) {
      console.error('Error fetching promotions for finished package:', error);
    }

    try {
      if (IdPackageRough) {
        promotionsRough = await getPromotionByName(searchName, IdPackageRough);
      }
    } catch (error) {
      console.error('Error fetching promotions for rough package:', error);
    }

    const combinedPromotions = [...promotionsFinished, ...promotionsRough];
    setPromotionList(combinedPromotions);
    previousSearchNameRef.current = searchName;
  }, [searchName, quotationData.PackageQuotationList]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  useEffect(() => {
    setPromotionList([]);
  }, [
    quotationData.PackageQuotationList.IdPackageRough,
    quotationData.PackageQuotationList.IdPackageFinished,
  ]);

  const handlePromotionSelect = (promotion: Promotion) => {
    setPromotionInfo({
      Id: promotion.Id,
      Name: promotion.Name,
      Value: promotion.Value,
    });
    setSearchName('');
    setPromotionList([]);
  };

  const handlePromotionChange = (field: string, value: any) => {
    if (field === 'Name') {
      setSearchName(value);
    }
    if (field === 'Name' && value === '') {
      setPromotionInfo(null);
    } else if (promotionInfo) {
      setPromotionInfo({ ...promotionInfo, [field]: value });
    } else {
      setPromotionInfo({
        Id: '',
        Name: field === 'Name' ? value : null,
        Value: field === 'Value' ? value : null,
      });
    }
  };

  const addUtilityRow = () => {
    setUtilityInfos([
      ...utilityInfos,
      {
        utilitiesItemId: '',
        coefficient: 0,
        price: 0,
        unitPrice: 0,
        quantity: 0,
        description: '',
      },
    ]);
  };

  const addConstructionRow = () => {
    setTableData([
      ...tableData,
      {
        stt: tableData.length + 1,
        hangMuc: '',
        dTich: '',
        heSo: '',
        dienTich: '',
        donVi: 'm²',
        price: 0,
      },
    ]);
  };

  const addPaymentRow = () => {
    setBatchPayment([
      ...batchPayment,
      {
        NumberOfBatch: batchPayment.length + 1,
        Description: '',
        Percents: 0,
        Price: 0,
        Unit: 'VNĐ',
      },
    ]);
  };

  const handlePaymentChange = (index: number, field: string, value: any) => {
    const newSchedule = [...batchPayment];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setBatchPayment(newSchedule);
  };

  const handleDeletePayment = (index: number) => {
    const newSchedule = batchPayment.filter((_, i) => i !== index);
    setBatchPayment(newSchedule);
  };

  const sectionStart = tableData.length > 0 ? 3 : 2;

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuotationData({
      ...quotationData,
      AccountName: e.target.value,
    });
  };

  const handleProjectAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuotationData({
      ...quotationData,
      Address: e.target.value,
    });
  };

  const hasSelectedPackage =
    quotationData.PackageQuotationList.IdPackageRough !== null ||
    quotationData.PackageQuotationList.IdPackageFinished !== null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary">
          Thông tin báo giá sơ bộ
        </h2>
        <div className="text-right">
          <CreateNewActionButtons
            isEditing={isEditing}
            isSaving={isSaving}
            handleEditToggle={handleEditToggle}
            handleSave={handleSave}
          />
          <span className="font-semibold">Phiên bản:</span>
          <span className="text-gray-700 ml-2">{quotationData.Version}</span>
          <div className="text-gray-500 text-sm">
            Tạo lúc {new Date(quotationData.InsDate).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <strong className="text-lg font-bold text-secondary">
          Thông tin tài khoản:
        </strong>
        <div className="mt-2 flex items-center">
          <FaUser className="text-blue-500 mr-2" />
          <label className="block text-gray-700 font-semibold">
            Tên khách hàng:
          </label>
          {isEditing ? (
            <input
              type="text"
              value={quotationData.AccountName}
              onChange={handleCustomerNameChange}
              className="ml-2 border border-gray-300 rounded-md p-2"
            />
          ) : (
            <p className="ml-2">{quotationData.AccountName}</p>
          )}
        </div>
        <div className="mt-2 flex items-center">
          <FaMapMarkerAlt className="text-blue-500 mr-2" />
          <label className="block text-gray-700 font-semibold">
            Địa chỉ thi công:
          </label>
          {isEditing ? (
            <input
              type="text"
              value={quotationData.Address}
              onChange={handleProjectAddressChange}
              className="ml-2 border border-gray-300 rounded-md p-2"
            />
          ) : (
            <p className="ml-2">{quotationData.Address}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <div className="mb-4">
          <p className="text-lg font-bold mb-2 text-secondary">
            1. ĐƠN GIÁ THI CÔNG:
          </p>
          <ConstructionPrice
            quotationData={quotationData}
            setQuotationData={setQuotationData}
            isEditing={isEditing}
            setPromotionInfo={setPromotionInfo}
          />
        </div>
      </div>

      {tableData.length > 0 && (
        <>
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <strong className="mt-4 mb-4 text-lg inline-block text-secondary">
                  Diện tích xây dựng theo phương án thiết kế:
                </strong>
              </div>
              {isEditing && quotationData.ProjectType !== 'TEMPLATE' && (
                <button
                  onClick={addConstructionRow}
                  className="ml-4 bg-primaryGreenButton text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
                >
                  <FaPlus />
                </button>
              )}
            </div>
          </div>

          <ConstructionAreaTable
            tableData={tableData}
            isEditing={isEditing && quotationData.ProjectType !== 'TEMPLATE'}
            handleInputChange={(e, index, field) => {
              const newData = [...tableData];
              newData[index] = { ...newData[index], [field]: e.target.value };

              if (field === 'dTich' || field === 'heSo') {
                const dTich = parseFloat(newData[index].dTich) || 0;
                const heSo = parseFloat(newData[index].heSo) || 0;
                newData[index].dienTich = (dTich * heSo).toString();
              }

              setTableData(newData);
            }}
            totalArea={totalArea}
            setTableData={setTableData}
          />

          <div className="mt-4">
            <div className="mb-4">
              <strong className="text-xl text-secondary">
                2. GIÁ TRỊ BÁO GIÁ SƠ BỘ XÂY DỰNG TRƯỚC THUẾ:
              </strong>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border text-center">
                      Tổng diện tích xây dựng
                    </th>
                    <th className="px-4 py-2 border text-center">x</th>
                    <th className="px-4 py-2 border text-center">Đơn giá</th>
                    <th className="px-4 py-2 border text-center">=</th>
                    <th className="px-4 py-2 border text-center">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border text-center">
                      {totalArea} m²
                    </td>
                    <td className="px-4 py-2 border text-center">x</td>
                    <td className="px-4 py-2 border text-center">
                      {quotationData.PackageQuotationList.UnitPackageRough.toLocaleString()}{' '}
                      đồng/m²
                    </td>
                    <td className="px-4 py-2 border text-center">=</td>
                    <td className="px-4 py-2 border text-center">
                      <strong> {totalRough.toLocaleString()} VNĐ</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center mb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <strong className="text-xl font-bold text-secondary">
              {sectionStart}. TÙY CHỌN & TIỆN ÍCH:
            </strong>
          </div>
          {isEditing && (
            <button
              onClick={addUtilityRow}
              className="ml-4 bg-primaryGreenButton text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
            >
              <FaPlus />
            </button>
          )}
        </div>
      </div>

      <UtilityTable
        utilityInfos={utilityInfos}
        totalRough={totalRough}
        setUtilityInfos={setUtilityInfos}
        isEditing={isEditing}
        onPriceChange={onPriceChange}
        quantities={quantities}
        setQuantities={setQuantities}
        setTotalUtilities={setTotalUtility}
        projectType={quotationData.ProjectType}
      />

      <div className="mt-4">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionStart + 1}. KHUYẾN MÃI:
          </strong>
        </div>
        <PromotionTable
          isEditing={isEditing}
          promotionInfo={
            promotionInfo
              ? {
                  Name: promotionInfo.Name || '',
                  Value: promotionInfo.Value ?? 0,
                }
              : null
          }
          promotionList={promotionList}
          hasSelectedPackage={hasSelectedPackage}
          totalArea={totalArea}
          handlePromotionChange={handlePromotionChange}
          handlePromotionSelect={handlePromotionSelect}
        />
      </div>

      <div className="mt-4">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionStart + 2}. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:
          </strong>
        </div>
        <ContractValueSummaryTable
          totalArea={totalArea}
          totalRough={totalRough}
          totalUtilities={totalUtility}
          promotionInfo={promotionInfo}
          updateGiaTriHopDong={setGiaTriHopDong}
        />
      </div>

      <div className="flex items-center mt-4 mb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <strong className="text-xl text-secondary">
              {sectionStart + 3}. CÁC ĐỢT THANH TOÁN:
            </strong>
          </div>
          {isEditing && (
            <button
              onClick={addPaymentRow}
              className="ml-4 bg-primaryGreenButton text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
            >
              <FaPlus />
            </button>
          )}
        </div>
      </div>

      <BatchPaymentTable
        batchPayment={batchPayment}
        totalPercentage={totalPercentage}
        totalAmount={totalAmount}
        giaTriHopDong={giaTriHopDong}
        isEditing={isEditing}
        handlePaymentChange={handlePaymentChange}
        handleDeletePayment={handleDeletePayment}
      />

      <div className="mt-4">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionStart + 4}. CÁC THỎA THUẬN KHÁC:
          </strong>
        </div>
        <OthersAgreementEditor
          isEditing={isEditing}
          othersAgreement={quotationData.OthersAgreement}
          setOthersAgreement={(value) =>
            setQuotationData({ ...quotationData, OthersAgreement: value })
          }
        />
      </div>

      <div className="mt-4 w-1/3">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionStart + 5}. THỜI GIAN THI CÔNG:
          </strong>
        </div>

        <div className="mb-4 text-right">
          <p className="flex justify-between">
            <strong>Thời gian hoàn thành công trình là:</strong>
            {isEditing ? (
              <>
                <input
                  type="number"
                  value={quotationData.TimeProcessing || ''}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      TimeProcessing: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-10 p-1 border rounded text-right"
                />
              </>
            ) : (
              <span className="font-bold">
                {quotationData.TimeProcessing} Ngày
              </span>
            )}
          </p>
          <p className="text-left">
            <em>Trong đó:</em>
          </p>
          <div className="ml-5">
            <p className="flex justify-between">
              <em>Thời gian thi công phần thô:</em>
              {isEditing ? (
                <>
                  <input
                    type="number"
                    value={quotationData.TimeRough || ''}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        TimeRough: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-10 p-1 border rounded text-right"
                  />
                </>
              ) : (
                <span className="font-italic">
                  {quotationData.TimeRough} Ngày
                </span>
              )}
            </p>
            <p className="flex justify-between">
              <em>Phối hợp với CT hoàn thiện công trình:</em>
              {isEditing ? (
                <>
                  <input
                    type="number"
                    value={quotationData.TimeOthers || ''}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        TimeOthers: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-10 p-1 border rounded text-right"
                  />
                </>
              ) : (
                <span className="font-italic">
                  {quotationData.TimeOthers} Ngày
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationSummary;
