import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/solid';
import EditPromotionModal from '../Modals/EditPromotionModal';
import { PromotionItem } from '../../../../types/PromotionTypes';

export interface PromotionTableProps {
  data: PromotionItem[];
  isLoading: boolean;
  onEditSuccess: () => void;
}

const PromotionTable: React.FC<PromotionTableProps> = ({
  data,
  isLoading,
  onEditSuccess,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionItem | null>(null);

  const openEditModal = (id: string) => {
    const promotion = data.find((item) => item.Id === id);
    if (promotion) {
      setSelectedPromotion(promotion);
      setEditModalOpen(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={'#123abc'} loading={isLoading} />
        </div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {['Tên', 'Mã', 'Giá trị', 'Ngày tạo', 'Bắt đầu', 'Kết thúc', 'Đang chạy', 'Hành động'].map(
                (header) => (
                  <th
                    key={header}
                    className="py-4 px-4 font-medium text-black dark:text-white"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="cursor-pointer">
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.Name}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.Code || 'N/A'}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.Value.toLocaleString()} VND
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {new Date(item.InsDate).toLocaleDateString()}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {new Date(item.StartTime).toLocaleDateString()}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {new Date(item.ExpTime).toLocaleDateString()}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.IsRunning ? 'Có' : 'Không'}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <PencilIcon
                    className="w-4 h-4 text-blue-500 cursor-pointer"
                    onClick={() => openEditModal(item.Id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editModalOpen && selectedPromotion && (
        <EditPromotionModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onEditSuccess={() => {
            setEditModalOpen(false);
            onEditSuccess();
          }}
          promotion={selectedPromotion}
        />
      )}
    </>
  );
};

export default PromotionTable;
