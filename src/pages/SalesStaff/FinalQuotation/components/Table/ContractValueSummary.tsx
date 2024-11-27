import React from 'react';

interface ContractValueSummaryProps {
  totalFinalQuotation: number;
  totalUtilities: number;
  totalEquipment: number;
  totalDiscount: number;
  totalContractValue: number;
}

const ContractValueSummary: React.FC<ContractValueSummaryProps> = ({
  totalFinalQuotation,
  totalUtilities,
  totalEquipment,
  totalDiscount,
  totalContractValue,
}) => {
  return (
    <div>
      <table className="min-w-full bg-white border border-gray-200 mt-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center">Mô tả</th>
            <th className="px-4 py-2 border text-center">Giá trị</th>
            <th className="px-4 py-2 border text-center">Đơn vị</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border text-center">
              Tổng giá trị xây dựng
            </td>
            <td className="px-4 py-2 border text-center">
              {totalFinalQuotation.toLocaleString()} 
            </td>
            <td className="px-4 py-2 border text-center">VNĐ</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border text-center">
              Tùy chọn & Tiện ích
            </td>
            <td className="px-4 py-2 border text-center">
              {totalUtilities.toLocaleString()} 
            </td>
            <td className="px-4 py-2 border text-center">VNĐ</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border text-center">Chi Phí Thiết bị</td>
            <td className="px-4 py-2 border text-center">
              {totalEquipment.toLocaleString()} 
            </td>
            <td className="px-4 py-2 border text-center">VNĐ</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border text-center">Khuyến mãi</td>
            <td className="px-4 py-2 border text-center">
              -{totalDiscount.toLocaleString()} 
            </td>
            <td className="px-4 py-2 border text-center">VNĐ</td>
          </tr>
          <tr className="bg-gray-200">
            <td className="px-4 py-2 border text-center font-bold">
              GIÁ TRỊ HỢP ĐỒNG
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalContractValue.toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center font-bold">VNĐ</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContractValueSummary;
