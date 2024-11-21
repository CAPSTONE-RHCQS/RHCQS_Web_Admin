import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import Alert from '../../../../../components/Alert';

import { LaborItem } from '../../../../../types/Labor';
import EditLabor from '../Edit/EditLabor';
import { updateLabor } from '../../../../../api/Labor/Labor';

interface LaborTableProps {
  openEditModal: (id: string) => void;
  currentEditId: string | null;
  dataLabor: LaborItem[];
  refreshData: () => void;
}

const LaborTable: React.FC<LaborTableProps> = ({
  dataLabor,
  openEditModal,
  currentEditId,
  refreshData,
}) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<LaborItem>({
    Id: currentEditId || '',
    Name: '',
    Price: 0,
    Deflag: true,
    Type: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setInputValue((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (item: LaborItem) => {
    openEditModal(item.Id || '');
    console.log(item.Id);
    setInputValue(item);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await updateLabor(currentEditId || '', inputValue);
      setAlertMessage('Sửa nhân công thành công');
      setAlertType('success');
      setIsEditModalOpen(false);
      refreshData();
    } catch (error) {
      setAlertMessage('Sửa nhân công thất bại');
      setAlertType('error');
    } finally {
      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 1000);
    }
  };

  return (
    <>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {['Tên nhân công', 'Giá', 'Ngày tạo', 'Loại', ''].map((header) => (
              <th
                key={header}
                className="py-4 px-4 font-medium text-black dark:text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataLabor.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="cursor-pointer">
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark flex items-center">
                  {item.Name}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.Price}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.InsDate}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.Type}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                  <div
                    className="flex justify-center relative"
                    onClick={() => handleEditClick(item)}
                  >
                    <PencilIcon className="w-4 h-4 text-primaryGreenButton" />
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {isEditModalOpen && (
        <EditLabor
          isOpen={isEditModalOpen}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSave={handleSave}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}

      {alertMessage && (
        <Alert message={alertMessage} type={alertType} onClose={() => {}} />
      )}
    </>
  );
};

export default LaborTable;
