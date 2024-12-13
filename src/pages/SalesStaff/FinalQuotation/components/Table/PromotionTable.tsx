import React from 'react';
import { PromotionInfo } from '../../../../../types/FinalQuotationTypes';

interface PromotionTableProps {
  promotionInfo: PromotionInfo | null;
  discount: number | null;
}

const PromotionTable: React.FC<PromotionTableProps> = ({
  promotionInfo,
  discount,
}) => {
  if (!promotionInfo) {
    return <div>Không có khuyến mãi</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center font-semibold">
              Tên Khuyến mãi
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Giá trị
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border text-center">
              {promotionInfo.Name || 'Không có'}
            </td>
            <td className="px-4 py-2 border text-center">
              {discount?.toLocaleString()} VNĐ
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default PromotionTable;
