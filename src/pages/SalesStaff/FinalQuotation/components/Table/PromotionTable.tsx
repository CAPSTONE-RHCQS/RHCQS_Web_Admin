import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PromotionInfo } from '../../../../../types/FinalQuotationTypes';
import { getPromotionByName } from '../../../../../api/Promotion/PromotionApi';
import { Promotion } from '../../../../../types/SearchContainNameTypes';

interface PromotionTableProps {
  promotionInfo: PromotionInfo | null;
  isEditing: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPromotionInfo: React.Dispatch<React.SetStateAction<PromotionInfo | null>>;
}

const PromotionTable: React.FC<PromotionTableProps> = ({
  promotionInfo,
  isEditing,
  onNameChange,
  setPromotionInfo,
}) => {
  const [searchName, setSearchName] = useState<string>('');
  const [promotionList, setPromotionList] = useState<Promotion[]>([]);
  const previousSearchNameRef = useRef<string>('');

  const fetchPromotions = useCallback(async () => {
    if (
      searchName.trim() === '' ||
      searchName === previousSearchNameRef.current
    ) {
      setPromotionList([]);
      return;
    }

    try {
      const promotions: Promotion[] = await getPromotionByName(searchName);
      setPromotionList(promotions);
      previousSearchNameRef.current = searchName;
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  }, [searchName]);

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
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={promotionInfo?.Name || ''}
                    onChange={(e) => {
                      setSearchName(e.target.value);
                      onNameChange(e);
                    }}
                    className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    list="promotion-suggestions"
                  />
                  {promotionList.length > 0 && (
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
                </>
              ) : (
                <span>{promotionInfo?.Name || 'Chưa có khuyến mãi'}</span>
              )}
            </td>
            <td className="px-4 py-2 border text-center">
              {isEditing ? (
                <span>{(promotionInfo?.Value ?? 0).toLocaleString()} VNĐ</span>
              ) : (
                <span>{(promotionInfo?.Value ?? 0).toLocaleString()} VNĐ</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PromotionTable;
