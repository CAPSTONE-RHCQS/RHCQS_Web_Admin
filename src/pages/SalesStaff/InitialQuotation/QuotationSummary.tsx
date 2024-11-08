import React, { useState } from 'react';
import ConstructionAreaTable from './components/Table/ConstructionAreaTable';
import { InitialQuotationResponse } from '../../../types/InitialQuotationTypes';
import { TableRow } from './components/types';
import UtilityTable from './components/Table/UtilityTable';
import ConstructionPrice from './components/Table/ConstructionPrice';
import BatchPaymentTable from './components/Table/BatchPaymentTable';
import ContractValueSummaryTable from './components/Table/ContractValueSummaryTable';

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
        <div className="mb-4">
          <div className="flex items-center">
            <p className="mt-4 mb-4 text-lg inline-block">
              <strong>Diện tích xây dựng theo phương án thiết kế:</strong>
            </p>
            {isEditing && (
              <button
                onClick={addConstructionRow}
                className="bg-primaryGreenButton text-white w-10 h-10 flex items-center justify-center ml-4 rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200 inline-block"
              >
                +
              </button>
            )}
          </div>
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
      <div className="flex items-center">
        <p className="mt-4 mb-4 text-lg inline-block">
          <strong>2. TÙY CHỌN & TIỆN ÍCH:</strong>
        </p>
        {isEditing && (
          <button
            onClick={addUtilityRow}
            className="bg-primaryGreenButton text-white w-10 h-10 flex items-center justify-center ml-4 rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
          >
            +
          </button>
        )}
      </div>

      <UtilityTable
        utilityInfos={utilityInfos}
        setUtilityInfos={setUtilityInfos}
        isEditing={isEditing}
      />

      <p className="text-lg mb-4">
        <strong>3. KHUYẾN MÃI:</strong>
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
          <strong>4. CÁC THỎA THUẬN KHÁC:</strong>
        </p>
        <p className="text-gray-700 whitespace-pre-line">
          {quotationData.OthersAgreement}
        </p>
      </div>

      <p className="text-lg mb-4">
        <strong>5. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:</strong>
      </p>
      <ContractValueSummaryTable
        thanhTien={thanhTien}
        totalUtilityCost={totalUtilityCost}
        promotionInfo={promotionInfo}
        updateGiaTriHopDong={setGiaTriHopDong}
      />

      <div className="flex items-center">
        <p className="mt-4 mb-4 text-lg inline-block">
          <strong>6. CÁC ĐỢT THANH TOÁN:</strong>
        </p>
        {isEditing && (
          <button
            onClick={addPaymentRow}
            className="bg-primaryGreenButton text-white w-10 h-10 flex items-center justify-center ml-4 rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
          >
            +
          </button>
        )}
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
