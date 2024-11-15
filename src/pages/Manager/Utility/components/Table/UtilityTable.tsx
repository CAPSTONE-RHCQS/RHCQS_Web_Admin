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
          <ClipLoader size={50} color={'#5BABAC'} loading={isLoading} />
        </div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              {['Tên', 'Loại', 'Ngày tạo', 'Ngày cập nhật', ''].map(
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
              <tr
                key={index}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="border-b border-gray-300 py-5 px-4 dark:border-strokedark">
                  {item.Name}
                </td>
                <td className="border-b border-gray-300 py-5 px-4 dark:border-strokedark">
                  {item.Type}
                </td>
                <td className="border-b border-gray-300 py-5 px-4 dark:border-strokedark">
                  {new Date(item.InsDate).toLocaleDateString()}
                </td>
                <td className="border-b border-gray-300 py-5 px-4 dark:border-strokedark">
                  {new Date(item.UpsDate).toLocaleDateString()}
                </td>
                <td className="border-b border-gray-300 py-5 px-4 dark:border-strokedark">
                  <PencilIcon
                    className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-600 transition"
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
