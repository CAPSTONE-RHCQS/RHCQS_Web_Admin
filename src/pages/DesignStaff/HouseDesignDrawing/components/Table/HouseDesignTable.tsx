import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { PencilIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { HouseDesign } from '../../../../../types/HouseDesignTypes';
import { FaEye } from 'react-icons/fa';

export interface HouseDesignTableProps {
  data: HouseDesign[];
  isLoading: boolean;
  onEditSuccess: () => void;
}

const HouseDesignTable: React.FC<HouseDesignTableProps> = ({
  data,
  isLoading,
  onEditSuccess,
}) => {
  const navigate = useNavigate();

  const viewDetails = (id: string) => {
    navigate(`/house-design-detail-staff/${id}`);
    onEditSuccess();
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
              {['Tên', 'Bước', 'Trạng thái', 'Loại', 'Ngày tạo', ''].map(
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
                  {item.Step}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.Status}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.Type}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {new Date(item.InsDate).toLocaleDateString()}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {/* <PencilIcon
                    className="w-4 h-4 text-blue-500 cursor-pointer"
                    onClick={() => openEditModal(item.Id)}
                  /> */}
                  <button
                    onClick={() => viewDetails(item.Id)}
                    className="text-primaryGreenButton hover:text-secondaryGreenButton transition mr-2"
                  >
                    <FaEye className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* {editModalOpen && selectedDesign && (
        <EditHouseDesignModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onEditSuccess={() => {
            setEditModalOpen(false);
            onEditSuccess();
          }}
          design={selectedDesign}
        />
      )} */}
    </>
  );
};

export default HouseDesignTable;
