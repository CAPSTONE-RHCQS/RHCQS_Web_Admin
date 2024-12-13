import React from 'react';

interface ContractValueSummaryProps {
  totalConstructionValue: number;
  totalUtilities: number;
  totalEquipmentCost: number;
  totalDiscount: number;
  totalContractValue: number;
}

const ContractValueSummary: React.FC<ContractValueSummaryProps> = ({
  totalConstructionValue,
  totalUtilities,
  totalEquipmentCost,
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
          {totalConstructionValue !== 0 && (
            <tr>
              <td className="px-4 py-2 border text-left">
                Giá trị báo giá sơ bộ xây dựng
              </td>
              <td className="px-4 py-2 border text-center">
                {totalConstructionValue.toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
          )}
          {totalUtilities !== 0 && (
            <tr>
              <td className="px-4 py-2 border text-left">
                Tùy chọn & Tiện ích
              </td>
              <td className="px-4 py-2 border text-center">
                {totalUtilities.toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
          )}
          {totalEquipmentCost !== 0 && (
            <tr>
              <td className="px-4 py-2 border text-left">Chi Phí Thiết bị</td>
              <td className="px-4 py-2 border text-center">
                {totalEquipmentCost.toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
          )}
          {totalDiscount !== 0 && (
            <tr>
              <td className="px-4 py-2 border text-left">Khuyến mãi</td>
              <td className="px-4 py-2 border text-center">
                -{totalDiscount.toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
          )}
          <tr className="bg-gray-200">
            <td className="px-4 py-2 border text-center font-bold">
             TỔNG GIÁ TRỊ HỢP ĐỒNG
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalContractValue.toLocaleString()}
            </td>
            <td className="px-4 py-2 border text-center font-bold">VNĐ</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContractValueSummary;
