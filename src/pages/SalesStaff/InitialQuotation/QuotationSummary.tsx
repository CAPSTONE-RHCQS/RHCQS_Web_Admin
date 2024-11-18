import React, { useState } from 'react';
import ConstructionAreaTable from './components/Table/ConstructionAreaTable';
import { InitialQuotationResponse } from '../../../types/InitialQuotationTypes';
import { TableRow } from './components/types';
import UtilityTable from './components/Table/UtilityTable';
import ConstructionPrice from './components/Table/ConstructionPrice';
import BatchPaymentTable from './components/Table/BatchPaymentTable';
import ContractValueSummaryTable from './components/Table/ContractValueSummaryTable';
import { FaPlus } from 'react-icons/fa';

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
  promotionInfo: any;
  setPromotionInfo: React.Dispatch<React.SetStateAction<any[]>>;
  giaTriHopDong: number;
  setGiaTriHopDong: React.Dispatch<React.SetStateAction<number>>;
  batchPayment: any[];
  setBatchPayment: React.Dispatch<React.SetStateAction<any[]>>;
  totalPercentage: number;
  totalAmount: number;
  othersAgreement: string;
  setOthersAgreement: React.Dispatch<React.SetStateAction<string>>;
}

const QuotationSummary: React.FC<QuotationSummaryProps> = ({
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

  const handlePromotionChange = (field: string, value: any) => {
    setPromotionInfo({ ...promotionInfo, [field]: value });
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

      <div>
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionStart + 1}. KHUYẾN MÃI:
          </strong>
        </div>
        <input
          type="text"
          placeholder="Tên khuyến mãi"
          value={promotionInfo?.Name || ''}
          onChange={(e) => handlePromotionChange('Name', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Giá trị (%)"
          value={promotionInfo?.Value || ''}
          onChange={(e) => handlePromotionChange('Value', e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />
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

      <div className="mt-4">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionStart + 3}. CÁC THỎA THUẬN KHÁC:
          </strong>
        </div>
        {isEditing ? (
          <textarea
            value={othersAgreement}
            onChange={(e) => setOthersAgreement(e.target.value)}
            className="w-full p-2 border rounded h-32"
            placeholder="Nhập nội dung thỏa thuận khác..."
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-line">
            {quotationData.OthersAgreement}
          </p>
        )}
      </div>

      <div className="flex items-center mt-4 mb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <strong className="text-xl text-secondary">
              {sectionStart + 4}. CÁC ĐỢT THANH TOÁN:
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
    </div>
  );
};

export default QuotationSummary;
