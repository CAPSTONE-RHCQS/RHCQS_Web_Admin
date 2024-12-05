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
import {
  FaPlus,
  FaUser,
  FaMapMarkerAlt,
  FaFileInvoiceDollar,
  FaPhone,
  FaMailBulk,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { getPromotionByName } from '../../../api/Promotion/PromotionApi';
import { Promotion } from '../../../types/SearchContainNameTypes';
import OthersAgreementEditor from './components/Table/OthersAgreementEditor';
import PromotionTable from './components/Table/PromotionTable';
import ActionButtons from './components/ActionButtons';
import { HiHomeModern } from 'react-icons/hi2';
import { TbHomePlus } from 'react-icons/tb';
import { toast } from 'react-toastify';

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
  totalFinished: number;
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
  totalFinished,
  utilityInfos,
  setUtilityInfos,
  promotionInfo,
  setPromotionInfo,
  giaTriHopDong,
  setGiaTriHopDong,
  batchPayment,
  setBatchPayment,
  totalPercentage,
  totalAmount,
  onPriceChange,
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

  const projectTypeMap: { [key: string]: string } = {
    TEMPLATE: 'Mẫu nhà',
    FINISHED: 'Phần Hoàn thiện',
    ROUGH: 'Phần Thô',
    ALL: 'Phần Thô & Hoàn thiện',
    HAVE_DRAWING: 'Có sẵn bản thiết kế',
  };

  const projectTypeInVietnamese =
    projectTypeMap[quotationData.ProjectType] || 'Không xác định';

  useEffect(() => {
    const totalTime = quotationData.TimeRough + quotationData.TimeOthers;
    if (totalTime > 400) {
      toast.error(
        'Tổng thời gian hoàn thành công trình không được vượt quá 400 ngày!',
      );
    }
  }, [quotationData.TimeRough, quotationData.TimeOthers]);

  return (
    <>
      <ActionButtons
        isEditing={isEditing}
        isSaving={isSaving}
        handleEditToggle={handleEditToggle}
        handleSave={handleSave}
        quotationData={quotationData}
      />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <h2 className="mb-4 text-2xl font-bold text-primary">
            Thông tin báo giá sơ bộ
          </h2>

          <div className="text-right">
            <span className="font-semibold">Phiên bản:</span>
            <span className="text-gray-700 ml-2">{quotationData.Version}</span>
            <div className="text-gray-500 text-sm">
              Tạo lúc {new Date(quotationData.InsDate).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2">
            <div className="mb-2 text-lg flex items-center">
              <HiHomeModern className="mr-2 text-secondary" />
              <span className="font-semibold">Công trình:</span>
              <span className="text-gray-700 ml-2">Nhà ở Dân dụng</span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <TbHomePlus className="mr-2 text-secondary" />
              <span className="font-semibold">Phân loại dự án:</span>
              <span className="text-gray-700 ml-2">
                {projectTypeInVietnamese}
              </span>
            </div>
            <div className="mb-2 text-lg flex flex-col items-start">
              <div className="flex items-center mb-2">
                <FaFileInvoiceDollar className="mr-2 text-secondary" />
                <span className="font-semibold mr-2">Đơn giá thi công:</span>
              </div>
              <ConstructionPrice
                quotationData={quotationData}
                setQuotationData={setQuotationData}
                isEditing={isEditing}
                setPromotionInfo={setPromotionInfo}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mb-2 text-lg flex items-center">
              <FaMapMarkerAlt className="mr-2 text-secondary" />
              <span className="font-semibold">Địa chỉ thi công:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={quotationData.Address}
                  onChange={handleProjectAddressChange}
                  className="ml-2 border border-gray-300 rounded-md p-2"
                />
              ) : (
                <span className="text-gray-700 ml-2">
                  {quotationData.Address}
                </span>
              )}
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaUser className="mr-2 text-secondary" />
              <span className="font-semibold">Chủ đầu tư:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={quotationData.AccountName}
                  onChange={handleCustomerNameChange}
                  className="ml-2 border border-gray-300 rounded-md p-2"
                />
              ) : (
                <span className="text-gray-700 ml-2">
                  {quotationData.AccountName}
                </span>
              )}
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaPhone className="mr-2 text-secondary" />
              <span className="font-semibold">Số điện thoại:</span>
              <span className="text-gray-700 ml-2">
                {quotationData.PhoneNumber}
              </span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaMailBulk className="mr-2 text-secondary" />
              <span className="font-semibold">Địa chỉ email:</span>
              <span className="text-gray-700 ml-2">{quotationData.Email}</span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaMoneyBillWave className="mr-2 text-secondary" />
              <span className="font-semibold">Tổng giá trị hợp đồng:</span>
              <span className="text-gray-700 ml-2">
                {giaTriHopDong.toLocaleString()} VNĐ
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <strong className="text-xl text-secondary">
                1. DIỆN TÍCH XÂY DỰNG THEO PHƯƠNG ÁN THIẾT KẾ:
              </strong>
            </div>
            {isEditing &&
              quotationData.ProjectType !== 'TEMPLATE' &&
              quotationData.ProjectType !== 'FINISHED' && (
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
          area={quotationData.Area}
          totalArea={totalArea}
          projectType={quotationData.ProjectType}
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
                  <th className="px-4 py-2 border text-center"></th>
                  <th className="px-4 py-2 border text-center">
                    Tổng diện tích xây dựng
                  </th>
                  <th className="px-4 py-2 border text-center">x</th>
                  <th className="px-4 py-2 border text-center">Đơn giá</th>
                  <th className="px-4 py-2 border text-center">=</th>
                  <th className="px-4 py-2 border text-center">Thành tiền</th>
                  <th className="px-4 py-2 border text-center">Đơn vị</th>
                </tr>
              </thead>
              <tbody>
                {quotationData.ProjectType === 'FINISHED' ? (
                  <tr>
                    <td className="px-4 py-2 border text-left">
                      <strong className="text-primary">Phần hoàn thiện</strong>
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {totalArea} m²
                    </td>
                    <td className="px-4 py-2 border text-center">x</td>
                    <td className="px-4 py-2 border text-center">
                      {quotationData.PackageQuotationList.UnitPackageFinished.toLocaleString()}{' '}
                      đồng/m²
                    </td>
                    <td className="px-4 py-2 border text-center">=</td>
                    <td className="px-4 py-2 border text-center">
                      <strong> {totalFinished.toLocaleString()} VNĐ</strong>
                    </td>
                    <td className="px-4 py-2 border text-center">VNĐ</td>
                  </tr>
                ) : quotationData.ProjectType === 'ROUGH' ? (
                  <tr>
                    <td className="px-4 py-2 border text-left">
                      <strong className="text-primary">Phần thô</strong>
                    </td>
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
                    <td className="px-4 py-2 border text-center">VNĐ</td>
                  </tr>
                ) : (
                  <>
                    <tr>
                      <td className="px-4 py-2 border text-left">
                        <strong className="text-primary">Phần thô</strong>
                      </td>
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
                      <td className="px-4 py-2 border text-center">VNĐ</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-left">
                        <strong className="text-primary">
                          Phần hoàn thiện
                        </strong>
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {totalArea} m²
                      </td>
                      <td className="px-4 py-2 border text-center">x</td>
                      <td className="px-4 py-2 border text-center">
                        {quotationData.PackageQuotationList.UnitPackageFinished.toLocaleString()}{' '}
                        đồng/m²
                      </td>
                      <td className="px-4 py-2 border text-center">=</td>
                      <td className="px-4 py-2 border text-center">
                        <strong> {totalFinished.toLocaleString()} VNĐ</strong>
                      </td>
                      <td className="px-4 py-2 border text-center">VNĐ</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td
                    className="px-4 py-2 border text-center font-bold"
                    colSpan={5}
                  >
                    Tổng giá trị báo giá sơ bộ xây dựng trước thuế
                  </td>
                  <td className="px-4 py-2 border text-center ">
                    <strong>
                      {(totalRough + totalFinished).toLocaleString()} VNĐ
                    </strong>
                  </td>
                  <td className="px-4 py-2 border text-center font-bold">
                    VNĐ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <strong className="text-xl font-bold text-secondary">
                3. TÙY CHỌN & TIỆN ÍCH:
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
          setTotalUtilities={setTotalUtility}
          projectType={quotationData.ProjectType}
        />
        <div className="mt-4">
          <div className="mb-4">
            <strong className="text-xl text-secondary">4. KHUYẾN MÃI:</strong>
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
              5. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:
            </strong>
          </div>
          <ContractValueSummaryTable
            totalArea={totalArea}
            totalRough={totalRough}
            totalFinished={totalFinished}
            totalUtilities={totalUtility}
            promotionInfo={promotionInfo}
            updateGiaTriHopDong={setGiaTriHopDong}
          />
        </div>
        <div className="flex items-center mt-4 mb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <strong className="text-xl text-secondary">
                6. CÁC ĐỢT THANH TOÁN:
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
              7. CÁC THỎA THUẬN KHÁC:
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
              8. THỜI GIAN THI CÔNG:
            </strong>
          </div>
          <div className="mb-4 text-right">
            <p className="flex justify-between">
              <strong>Thời gian hoàn thành công trình là:</strong>
              <span className="font-bold">
                {quotationData.TimeRough + quotationData.TimeOthers} Ngày
              </span>
            </p>
            <p className="text-left">
              <em>Trong đó:</em>
            </p>
            <div className="ml-5">
              <p className="flex justify-between">
                <strong>Thời gian thi công phần thô:</strong>
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      value={quotationData.TimeRough || ''}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        const totalTime = newValue + quotationData.TimeOthers;
                        if (totalTime <= 400) {
                          setQuotationData({
                            ...quotationData,
                            TimeRough: newValue,
                          });
                        } else {
                          toast.error(
                            'Tổng thời gian hoàn thành công trình không được vượt quá 400 ngày!',
                          );
                        }
                      }}
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
                <strong>Phối hợp với CT hoàn thiện công trình:</strong>
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      value={quotationData.TimeOthers || ''}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        const totalTime = quotationData.TimeRough + newValue;
                        if (totalTime <= 400) {
                          setQuotationData({
                            ...quotationData,
                            TimeOthers: newValue,
                          });
                        } else {
                          toast.error(
                            'Tổng thời gian hoàn thành công trình không được vượt quá 400 ngày!',
                          );
                        }
                      }}
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
    </>
  );
};

export default QuotationSummary;
