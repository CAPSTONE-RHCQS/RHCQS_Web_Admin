import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { PencilIcon } from '@heroicons/react/24/solid';
import EditUtilityModal from '../../../Utility/components/Modals/EditUtilityModal';
import { UtilityItem } from '../../../../../types/UtilityTypes';

export interface UtilityTableProps {
  data: UtilityItem[];
  isLoading: boolean;
  onEditSuccess: () => void;
}

const UtilityTable: React.FC<UtilityTableProps> = ({
  data,
  isLoading,
  onEditSuccess,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUtility, setSelectedUtility] = useState<UtilityItem | null>(
    null,
  );

  const openEditModal = (id: string) => {
    const utility = data.find((item) => item.Id === id);
    if (utility) {
      setSelectedUtility(utility);
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
              {['Tên', 'Loại', 'Ngày tạo', 'Ngày cập nhật', 'Hành động'].map(
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
                  {item.Type}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {new Date(item.InsDate).toLocaleDateString()}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {new Date(item.UpsDate).toLocaleDateString()}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <PencilIcon
                    className="w-4 h-4 text-blue-500 cursor-pointer"
                    onClick={() => {
                      if (item.Id) {
                        openEditModal(item.Id);
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editModalOpen && selectedUtility && (
        <EditUtilityModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onEditSuccess={() => {
            setEditModalOpen(false);
            onEditSuccess();
          }}
          utility={selectedUtility}
        />
      )}
    </>
  );
};

export default UtilityTable;
