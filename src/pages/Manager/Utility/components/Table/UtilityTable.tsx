import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { PencilIcon } from '@heroicons/react/24/solid';
import { UtilityItem } from '../../../../../types/UtilityTypes';
import { SectionItem } from '../../../../../types/UtilityTypes';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { FaEye } from 'react-icons/fa';
import EditSection from '../Edit/EditSection';

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
  const [editSectionOpen, setEditSectionOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [selectedUtility, setSelectedUtility] = useState<UtilityItem | null>(
    null,
  );
  const [selectedUtilitySections, setSelectedUtilitySections] = useState<
    SectionItem[] | null
  >(null);

  const openEditModal = (id: string) => {
    const utility = data.find((item) => item.Id === id);
    if (utility) {
      setSelectedUtility(utility);
      setEditModalOpen(true);
    }
  };

  const openEditSection = (id: string) => {
    setSelectedSectionId(id);
    setEditSectionOpen(true);
  };

  const handleUtilityNameClick = (sections: SectionItem[]) => {
    if (selectedUtilitySections === sections) {
      setSelectedUtilitySections(null);
    } else {
      setSelectedUtilitySections(sections);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={'#5BABAC'} loading={isLoading} />
        </div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {['Tên', 'Loại', 'Ngày tạo', ''].map((header) => (
                <th
                  key={header}
                  className="py-4 px-4 font-bold text-black dark:text-white"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="hover:bg-gray-100 cursor-pointer">
                  <td
                    className="py-5 px-4 dark:border-strokedark uppercase"
                    onClick={() => handleUtilityNameClick(item.Sections)}
                  >
                    <div className="flex items-center">
                      <span className="font-bold text-red-500 dark:text-white">
                        {item.Name}
                      </span>
                      <ChevronDownIcon
                        className={`w-5 h-5 ml-2 transform transition-transform ${
                          selectedUtilitySections === item.Sections
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </div>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <span className="font-bold text-black dark:text-white">
                      {item.Type}
                    </span>
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    {new Date(item.InsDate).toLocaleDateString()}
                  </td>
                  <td className="py-5 px-4 dark:border-strokedark">
                    <div className="flex justify-center relative">
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          if (item.Id) {
                            openEditModal(item.Id);
                          }
                        }}
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="w-4 h-4 text-primaryGreenButton" />
                      </button>
                    </div>
                  </td>
                </tr>
                {selectedUtilitySections &&
                  selectedUtilitySections === item.Sections && (
                    <tr>
                      <td colSpan={4} className="bg-gray-50 px-4 py-4">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-2 text-left border-b border-[#eee] dark:bg-meta-4">
                              {['Tên', 'Đơn giá', ''].map((header) => (
                                <th
                                  key={header}
                                  className="py-2 px-4 font-medium text-gray-500 dark:text-white"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedUtilitySections.map((section, idx) => (
                              <tr key={idx}>
                                <td className="py-2 px-4 font-bold text-black dark:text-white">
                                  {section.Name}
                                </td>
                                <td className="py-2 px-4">
                                  {section.UnitPrice !== null
                                    ? section.UnitPrice.toLocaleString(
                                        'vi-VN',
                                        { style: 'currency', currency: 'VND' },
                                      )
                                    : 'N/A'}
                                </td>
                                <td className="py-2 px-4">
                                  <FaEye
                                    className="text-primaryGreenButton hover:text-secondaryGreenButton transition mr-6 cursor-pointer"
                                    onClick={() => {
                                      if (section.Id) {
                                        openEditSection(section.Id);
                                      }
                                    }}
                                    title="Xem chi tiết"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      
      {editSectionOpen && selectedSectionId && (
        <EditSection
          id={selectedSectionId}
          onClose={() => setEditSectionOpen(false)}
        />
      )}
    </>
  );
};

export default UtilityTable;
