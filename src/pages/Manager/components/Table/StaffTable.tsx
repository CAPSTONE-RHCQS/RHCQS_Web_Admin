import React, { useState } from 'react';
import { getAccountById } from '../../../../api/Account/Account';
import CheckboxTwo from '../../../../components/Checkboxes/CheckboxTwo';
import DetailButton from '../../../../components/Buttonicons/DetailButton';
import DeleteButton from '../../../../components/Buttonicons/DeleteButton';
import DownloadButton from '../../../../components/Buttonicons/DownloadButton';
import SortIcon from '../../../../components/Buttonicons/SortIcon';
import AccountDetailModal from '../../../../components/Account/AccountDetailModal';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ClipLoader } from 'react-spinners';

type Staff = {
  id: string;
  roleId: string;
  email: string;
  username: string;
  imageUrl: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  insDate: string;
  upsDate: string;
  avatar: string;
  staffName: string;
  role: string;
  birthday: string;
  address: string;
  isChecked: boolean;
  deflag: boolean;
  [key: string]: any; // Để cho phép các thuộc tính khác nếu cần
};

type SortKey = string;

interface StaffTableProps {
  data: Staff[];
  columns: { key: string; label: string; width?: string }[];
  isAllChecked: boolean;
  handleSelectAll: () => void;
  handleCheckboxChange: (index: number) => void;
  handleSort: (key: SortKey) => void;
  handleDelete: (id: string) => void;
  roleClassMapping: { [key: string]: string };
  roleIconMapping: { [key: string]: JSX.Element };
  isLoading: boolean; // Thêm thuộc tính isLoading
}

const StaffTable: React.FC<StaffTableProps> = ({
  data,
  columns,
  isAllChecked,
  handleSelectAll,
  handleCheckboxChange,
  handleSort,
  handleDelete,
  roleClassMapping,
  roleIconMapping,
  isLoading, // Nhận thuộc tính isLoading
}) => {
  const [selectedAccount, setSelectedAccount] = useState<Staff | null>(null);

  const handleDetailClick = async (id: string) => {
    try {
      const account = await getAccountById(id);
      setSelectedAccount(account);
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedAccount(null);
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
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                <CheckboxTwo
                  id="select-all"
                  isChecked={isAllChecked}
                  onChange={handleSelectAll}
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`py-4 px-4 font-medium text-black dark:text-white ${
                    ['role'].includes(column.key) ? 'text-center' : ''
                  }`}
                  style={{ width: column.width, whiteSpace: 'nowrap' }}
                >
                  <div
                    className={`flex items-center space-x-1 ${
                      ['role'].includes(column.key) ? 'justify-center' : ''
                    }`}
                  >
                    <span>{column.label}</span>
                    <SortIcon onClick={() => handleSort(column.key)} />
                  </div>
                </th>
              ))}
              <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <CheckboxTwo
                    id={`checkbox-${index}`}
                    isChecked={item.isChecked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`border-b border-[#eee] py-5 px-4 dark:border-strokedark ${
                      ['role'].includes(column.key) ? 'text-center' : ''
                    }`}
                    style={{
                      width: column.key === 'role' ? '170px' : column.width,
                    }}
                  >
                    {column.key === 'avatar' ? (
                      <div className="relative w-20 h-20">
                        <img
                          src={item.avatar}
                          alt="Avatar"
                          className="w-full h-full rounded-full border-2 border-gray-300 shadow-lg"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white`}
                          style={{ backgroundColor: item.deflag ? '#00FF00' : '#D3D3D3' }}
                        ></span>
                      </div>
                    ) : column.key === 'role' ? (
                      <div
                        className={`flex items-center justify-center space-x-2 ${
                          roleClassMapping[item.role]
                        } px-3 py-1.5 rounded-full`}
                      >
                        <span className="flex items-center justify-center w-4 h-4 text-white">
                          {roleIconMapping[item.role]}
                        </span>
                        <span className="text-white text-sm">{item.role}</span>
                      </div>
                    ) : (
                      <p className="text-black dark:text-white">
                        {item[column.key]}
                      </p>
                    )}
                  </td>
                ))}
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <DetailButton onClick={() => handleDetailClick(item.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedAccount && (
        <AccountDetailModal
          account={selectedAccount}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default StaffTable;
