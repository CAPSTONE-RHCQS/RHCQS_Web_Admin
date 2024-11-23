import React, { useState, useEffect, useCallback, useRef } from 'react';
import ConstructionAreaTable from './components/Table/ConstructionAreaTable';
import {
  InitialQuotationResponse,
  PromotionInfo,
} from '../../../types/InitialQuotationTypes';
import { TableRow } from './components/types';
import UtilityTable from './components/Table/UtilityTable';
import ConstructionPrice from './components/Table/ConstructionPrice';
import BatchPaymentTable from './components/Table/BatchPaymentTable';
import ContractValueSummaryTable from './components/Table/ContractValueSummaryTable';
import { FaPlus, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { getPromotionByName } from '../../../api/Promotion/PromotionApi';
import { Promotion } from '../../../types/SearchContainNameTypes';

interface QuotationSummaryProps {
  quotationData: InitialQuotationResponse;
  setQuotationData: React.Dispatch<
    React.SetStateAction<InitialQuotationResponse | null>
  >;
  tableData: TableRow[];
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;
  isEditing: boolean;
  totalDienTich: number;
  donGia: number;
  thanhTien: number;
  utilityInfos: any[];
  setUtilityInfos: React.Dispatch<React.SetStateAction<any[]>>;
  totalUtilityCost: number;
  promotionInfo: PromotionInfo | null;
  setPromotionInfo: React.Dispatch<React.SetStateAction<PromotionInfo | null>>;
  giaTriHopDong: number;
  setGiaTriHopDong: React.Dispatch<React.SetStateAction<number>>;
  batchPayment: any[];
  setBatchPayment: React.Dispatch<React.SetStateAction<any[]>>;
  totalPercentage: number;
  totalAmount: number;
  othersAgreement: string;
  setOthersAgreement: React.Dispatch<React.SetStateAction<string>>;
}

const CreateNewQuotationSummary: React.FC<QuotationSummaryProps> = ({
  quotationData,
  setQuotationData,
  tableData,
  setTableData,
  isEditing,
  totalDienTich,
  donGia,
  thanhTien,
  utilityInfos,
  setUtilityInfos,
  totalUtilityCost,
  promotionInfo,
  setPromotionInfo,
  giaTriHopDong,
  setGiaTriHopDong,
  batchPayment,
  setBatchPayment,
  totalPercentage,
  totalAmount,
  othersAgreement,
  setOthersAgreement,
}) => {
  const [searchName, setSearchName] = useState<string>('');
  const [promotionList, setPromotionList] = useState<Promotion[]>([]);
  const previousSearchNameRef = useRef<string>('');

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

    try {
      const promotionsFinished: Promotion[] = IdPackageFinished
        ? await getPromotionByName(searchName, IdPackageFinished)
        : [];

      const promotionsRough: Promotion[] = IdPackageRough
        ? await getPromotionByName(searchName, IdPackageRough)
        : [];
      setPromotionList([...promotionsFinished, ...promotionsRough]);
      previousSearchNameRef.current = searchName;
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  }, [searchName, quotationData.PackageQuotationList]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

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
    if (promotionInfo) {
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
        Id: batchPayment.length + 1,
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">
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
              {isEditing && (
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
            isEditing={isEditing}
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
            totalDienTich={totalDienTich}
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
                      {totalDienTich} m²
                    </td>
                    <td className="px-4 py-2 border text-center">x</td>
                    <td className="px-4 py-2 border text-center">
                      {donGia.toLocaleString()} đồng/m²
                    </td>
                    <td className="px-4 py-2 border text-center">=</td>
                    <td className="px-4 py-2 border text-center">
                      <strong> {thanhTien.toLocaleString()} đồng</strong>
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
        setUtilityInfos={setUtilityInfos}
        isEditing={isEditing}
      />

      <div className="mt-4">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionStart + 1}. KHUYẾN MÃI:
          </strong>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Tên khuyến mãi</th>
                <th className="px-4 py-2 border text-center">Giá trị</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Tên khuyến mãi"
                      value={promotionInfo?.Name || ''}
                      onChange={(e) =>
                        handlePromotionChange('Name', e.target.value)
                      }
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      list="promotion-suggestions"
                    />
                  ) : (
                    <span>{promotionInfo?.Name || 'Không có'}</span>
                  )}
                  {isEditing && promotionList.length > 0 && (
                    <ul className="promotion-list border border-gray-300 rounded mt-2">
                      {promotionList.map((promotion) => (
                        <li
                          key={promotion.Id}
                          onClick={() => handlePromotionSelect(promotion)}
                          className="promotion-item cursor-pointer hover:bg-gray-200 p-2"
                        >
                          {promotion.Name}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-2 border text-center">
                  <span>{promotionInfo?.Value || 0} đồng</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionStart + 2}. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:
          </strong>
        </div>
        <ContractValueSummaryTable
          thanhTien={thanhTien}
          totalUtilityCost={totalUtilityCost}
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
        {isEditing ? (
          <textarea
            value={othersAgreement}
            onChange={(e) => setOthersAgreement(e.target.value)}
            className="w-full p-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập nội dung thỏa thuận khác..."
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-line">
            {quotationData.OthersAgreement}
          </p>
        )}
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

export default CreateNewQuotationSummary;
