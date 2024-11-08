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
  giaTriHopDong: number;
  setGiaTriHopDong: React.Dispatch<React.SetStateAction<number>>;
  batchPayment: any[];
  setBatchPayment: React.Dispatch<React.SetStateAction<any[]>>;
  totalPercentage: number;
  totalAmount: number;
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
  giaTriHopDong,
  setGiaTriHopDong,
  batchPayment,
  setBatchPayment,
  totalPercentage,
  totalAmount,
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

  const handlePaymentChange = (index: number, field: string, value: any) => {
    const newSchedule = [...batchPayment];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setBatchPayment(newSchedule);
  };

  const handleDeletePayment = (index: number) => {
    const newSchedule = batchPayment.filter((_, i) => i !== index);
    setBatchPayment(newSchedule);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Thông tin báo giá sơ bộ</h2>
        <div className="text-right">
          <span className="font-semibold">Phiên bản:</span>
          <span className="text-gray-700 ml-2">{quotationData.Version}</span>
          <div className="text-gray-500 text-sm">
            Tạo lúc {new Date(quotationData.InsDate).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <div className="mb-4">
          <p className="text-lg font-bold mb-2">1. ĐƠN GIÁ THI CÔNG</p>
          <ConstructionPrice
            quotationData={quotationData}
            setQuotationData={setQuotationData}
            isEditing={isEditing}
          />
        </div>
      </div>

      <div className="flex items-center mb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <strong className="text-xl font-bold">
              2. DIỆN TÍCH XÂY DỰNG THEO PHƯƠNG ÁN THIẾT KẾ:
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

      <p className="text-lg mb-4">
        <strong>Giá trị báo giá sơ bộ xây dựng trước thuế:</strong>
      </p>

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

      <div className="flex items-center mb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <strong className="text-xl font-bold">
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
        setUtilityInfos={setUtilityInfos}
        isEditing={isEditing}
      />

      <p className="text-lg mb-4">
        <strong>4. KHUYẾN MÃI:</strong>
      </p>
      {/* <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">Tên khuyến mãi</th>
              <th className="px-4 py-2 border text-center">Giá trị (%)</th>
            </tr>
          </thead>
          <tbody>
            {promotionInfo ? (
              <tr>
                <td className="px-4 py-2 border text-left">
                  {promotionInfo.Name}
                </td>
                <td className="px-4 py-2 border text-center">
                  {promotionInfo.Value}%
                </td>
              </tr>
            ) : (
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={2}>
                  Không có khuyến mãi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}

      <div className="mb-4">
        <p className="text-lg">
          <strong>5. CÁC THỎA THUẬN KHÁC:</strong>
        </p>
        <p className="text-gray-700 whitespace-pre-line">
          {quotationData.OthersAgreement}
        </p>
      </div>

      <p className="text-lg mb-4">
        <strong>6. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:</strong>
      </p>
      <ContractValueSummaryTable
        thanhTien={thanhTien}
        totalUtilityCost={totalUtilityCost}
        promotionInfo={promotionInfo}
        updateGiaTriHopDong={setGiaTriHopDong}
      />
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <strong className="text-xl font-bold">
              7. CÁC ĐỢT THANH TOÁN:
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
