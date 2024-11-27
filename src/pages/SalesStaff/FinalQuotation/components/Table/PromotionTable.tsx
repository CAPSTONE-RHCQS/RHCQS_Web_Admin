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
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center font-semibold">
              Khuyến mãi
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Giá trị giảm
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border text-center">
              <span>{promotionInfo?.Name || 'Chưa có khuyến mãi'}</span>
            </td>
            <td className="px-4 py-2 border text-center">
              <span>{(discount ?? 0).toLocaleString()} VNĐ</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PromotionTable;
