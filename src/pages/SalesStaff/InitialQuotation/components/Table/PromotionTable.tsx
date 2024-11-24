import React from 'react';
import { Promotion } from '../../../../../types/SearchContainNameTypes';

interface PromotionTableProps {
  isEditing: boolean;
  promotionInfo: { Name: string; Value: number } | null;
  promotionList: Promotion[];
  hasSelectedPackage: boolean;
  totalArea: number;
  handlePromotionChange: (field: string, value: any) => void;
  handlePromotionSelect: (promotion: Promotion) => void;
}

const PromotionTable: React.FC<PromotionTableProps> = ({
  isEditing,
  promotionInfo,
  promotionList,
  hasSelectedPackage,
  totalArea,
  handlePromotionChange,
  handlePromotionSelect,
}) => {
  const totalDiscount = promotionInfo ? totalArea * promotionInfo.Value : 0;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Tên khuyến mãi</th>
            <th className="px-4 py-2 border text-center">Giá trị khuyến mãi</th>
            <th className="px-4 py-2 border text-center">Tổng giảm</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border text-center">
              {isEditing ? (
                hasSelectedPackage ? (
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
                  <span className="text-red-500">Chưa chọn gói thi công!</span>
                )
              ) : (
                <span>{promotionInfo?.Name || 'Không có'}</span>
              )}
              {isEditing && hasSelectedPackage && promotionList.length > 0 && (
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
              <span>{promotionInfo?.Value.toLocaleString() || 0} VNĐ</span>
            </td>
            <td className="px-4 py-2 border text-center">
              <span>{totalDiscount.toLocaleString()} VNĐ</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PromotionTable;
