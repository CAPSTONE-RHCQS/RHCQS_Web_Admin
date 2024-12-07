import React, { useState, useRef } from 'react';
import {
  ConstructionWorkItem,
  Resource,
  WorkTemplate,
} from '../../../../../types/ContructionWork';
import { PencilIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import Alert from '../../../../../components/Alert';
import { getConstructionWorkById } from '../../../../../api/Construction/ContructionWork';
import EditConstructionWork from '../Edit/EditConstructionWork';

interface ConstructionWorkTableProps {
  dataConstructionWork: ConstructionWorkItem[];
  editModalOpen: boolean;
  openEditModal: (id: string) => void;
  currentEditId: string | null;
  refreshData: () => void;
}

const ConstructionWorkTable: React.FC<ConstructionWorkTableProps> = ({
  dataConstructionWork,
  editModalOpen,
  refreshData,
  openEditModal,
  currentEditId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(editModalOpen);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const editRef = useRef<HTMLDivElement | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [workTemplates, setWorkTemplates] = useState<WorkTemplate[]>([]);

  const handleRowClick = async (id: string) => {
    try {
      if (expandedId === id) {
        setExpandedId(null);
        setResources([]);
      } else {
        const response = await getConstructionWorkById(id);
        setResources(response.Resources);
        setWorkTemplates(response.WorkTemplates);
        setExpandedId(id);
      }
    } catch (error) {
      console.error('Error fetching construction work details:', error);
    }
  };
  const handleSave = async () => {
    refreshData();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleError = (errorMessage: string) => {
    setAlertMessage(errorMessage);
    setAlertType('error');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleEditClick = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    setIsModalOpen(editModalOpen);
    openEditModal(id);
  };

  return (
    <>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {['Tên công tác', 'Mã công tác', 'Đơn vị', 'Ngày tạo', ''].map(
              (header) => (
                <th
                  key={header}
                  className="py-4 px-4 font-bold text-black dark:text-white"
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {dataConstructionWork.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="hover:bg-gray-100 cursor-pointer">
                <td
                  className="border-b border-[#eee] py-5 px-4 dark:border-strokedark uppercase"
                  onClick={() => handleRowClick(item.Id)}
                >
                  <div className="flex items-center">
                    <span className="font-bold text-red-500 dark:text-white">
                      {item.WorkName}
                    </span>
                    <ChevronDownIcon
                      className={`w-5 h-5 ml-2 transform transition-transform ${
                        expandedId === item.Id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <span className="py-5 px-4 dark:border-strokedark font-bold text-primaryGreenButton dark:text-white">
                    {item.Code}
                  </span>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <span className="font-bold text-black dark:text-white">
                    {item.Unit}
                  </span>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.InsDate && formatDate(item.InsDate)}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex justify-center relative" ref={editRef}>
                    <button
                      className="cursor-pointer"
                      onClick={(event) => handleEditClick(event, item.Id)}
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="w-4 h-4 text-primaryGreenButton" />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedId === item.Id && (
                <tr>
                  <td colSpan={6} className="bg-gray-50 px-4 py-4">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4 text-center">
                          <th className="py-2 px-4 text-left w-1/8 text-center border border-gray-300">
                            Nguồn
                          </th>
                          <th className="py-2 px-4 text-left w-2/8 text-center border border-gray-300">
                            Vật tư cần thiết
                          </th>
                          <th className="py-2 px-4 text-left w-2/8 text-center border border-gray-300">
                            Định mức
                          </th>
                          <th className="py-2 px-4 text-left w-1/8 text-center border border-gray-300">
                            Gói
                          </th>
                          <th className="py-2 px-4 text-left w-1/8 text-center border border-gray-300">
                            Giá vật tư thô
                          </th>
                          <th className="py-2 px-4 text-left w-1/8 text-center border border-gray-300">
                            Giá vật tư hoàn thiện
                          </th>
                          <th className="py-2 px-4 text-left w-1/8 text-center border border-gray-300">
                            Gia nhân công
                          </th>
                          <th className="py-2 px-4 text-left w-1/8 text-center border border-gray-300">
                            Tổng tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="font-bold py-2 px-4 text-center border border-gray-300">
                            Vật tư
                          </td>
                          <td className="py-2 px-4 text-left border border-gray-300">
                            {resources
                              .filter((resource) => resource.MaterialSectionId)
                              .map((resource) => (
                                <div key={resource.MaterialSectionId}>
                                  {resource.MaterialSectionName}
                                </div>
                              ))}
                          </td>
                          <td className="py-2 px-4 text-center border border-gray-300">
                            {resources
                              .filter((resource) => resource.MaterialSectionId)
                              .map((resource) => (
                                <div key={resource.MaterialSectionId}>
                                  {resource.MaterialSectionNorm?.toLocaleString(
                                    'vi-VN',
                                  )}
                                </div>
                              ))}
                          </td>
                          <td
                            className="py-2 px-4 text-center border border-gray-300"
                            rowSpan={2}
                          >
                            {workTemplates.map((template) => (
                              <div
                                key={template.PackageName}
                                className="border-b last:border-b-0 py-3"
                              >
                                {template.PackageName}
                              </div>
                            ))}
                          </td>
                          <td
                            className="py-2 px-4 text-center border border-gray-300"
                            rowSpan={2}
                          >
                            {workTemplates.map((template) => (
                              <div
                                key={template.PackageName}
                                className="border-b last:border-b-0 py-3"
                              >
                                {template.MaterialCost.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </div>
                            ))}
                          </td>
                          <td
                            className="py-2 px-4 text-center border border-gray-300"
                            rowSpan={2}
                          >
                            {workTemplates.map((template) => (
                              <div
                                key={template.PackageName}
                                className="border-b last:border-b-0 py-3"
                              >
                                {template.MaterialFinishedCost
                                  ? template.MaterialFinishedCost.toLocaleString(
                                      'vi-VN',
                                      {
                                        style: 'currency',
                                        currency: 'VND',
                                      },
                                    )
                                  : '0'}
                              </div>
                            ))}
                          </td>
                          <td
                            className="py-2 px-4 text-center border border-gray-300"
                            rowSpan={2}
                          >
                            {workTemplates.map((template) => (
                              <div
                                key={template.PackageName}
                                className="border-b last:border-b-0 py-3"
                              >
                                {template.LaborCost.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </div>
                            ))}
                          </td>
                          <td
                            className="py-2 px-4 text-center border border-gray-300"
                            rowSpan={2}
                          >
                            {workTemplates.map((template) => (
                              <div
                                key={template.PackageName}
                                className="border-b last:border-b-0 py-3"
                              >
                                {template.TotalCost.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </div>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold py-2 px-4 text-center border border-gray-300">
                            Nhân công
                          </td>
                          <td className="py-2 px-4 text-left border border-gray-300">
                            {resources
                              .filter((resource) => resource.LaborId)
                              .map((resource) => (
                                <div key={resource.LaborId}>
                                  {resource.LaborName}
                                </div>
                              ))}
                          </td>
                          <td className="py-2 px-4 text-center border border-gray-300">
                            {resources
                              .filter((resource) => resource.LaborId)
                              .map((resource) => (
                                <div key={resource.LaborId}>
                                  {resource.LaborNorm?.toLocaleString('vi-VN')}
                                </div>
                              ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EditConstructionWork
          isOpen={isModalOpen}
          onSave={handleSave}
          onCancel={handleCancel}
          onError={handleError}
          currentEditId={currentEditId}
        />
      )}

      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
};

export default ConstructionWorkTable;
