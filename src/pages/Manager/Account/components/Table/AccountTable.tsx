import React, { useState } from 'react';
import { getAccountById } from '../../../../../api/Account/AccountApi';
import DetailButton from '../../../../../components/Buttonicons/DetailButton';
import SortIcon from '../../../../../components/Buttonicons/SortIcon';
import AccountDetailModal from '../../../../../components/Account/AccountDetailModal';
import { ClipLoader } from 'react-spinners';
import { Account } from '../../../../../types/Account';
import UserOne from '../../../../../images/user/user-01.png';

type SortKey = string;

interface AccountTableProps {
  data: Account[];
  columns: { key: string; label: string; width?: string }[];
  handleSort: (key: SortKey) => void;
  roleClassMapping: { [key: string]: string };
  roleIconMapping: { [key: string]: JSX.Element };
  isLoading: boolean;
  onUpdateAccount?: (updatedAccount: Account) => void;
  refreshKey: number;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const TableHeader: React.FC<{
  columns: any[];
  handleSort: (key: SortKey) => void;
}> = ({ columns, handleSort }) => (
  <thead>
    <tr className="bg-gray-200 text-left dark:bg-meta-4">
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
);

const TableRow: React.FC<{
  item: Account;
  index: number;
  columns: any[];
  handleDetailClick: (id: string) => void;
  roleClassMapping: any;
  roleIconMapping: any;
}> = ({
  item,
  index,
  columns,
  handleDetailClick,
  roleClassMapping,
  roleIconMapping,
}) => (
  <tr
    key={index}
    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
    {columns.map((column) => (
      <td
        key={column.key}
        className={`border-b border-gray-300 py-5 px-4 dark:border-strokedark ${
          ['role'].includes(column.key) ? 'text-center' : ''
        }`}
        style={{ width: column.key === 'role' ? '170px' : column.width }}
      >
        {column.key === 'avatar' ? (
          <div className="relative w-20 h-20">
            <img
              src={item.avatar || UserOne}
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
          <p className="text-black dark:text-white">{item[column.key]}</p>
        )}
      </td>
    ))}
    <td className="border-b border-gray-300 py-5 px-4 dark:border-strokedark">
      <div className="flex items-center space-x-3.5">
        <DetailButton onClick={() => handleDetailClick(item.id)} />
      </div>
    </td>
  </tr>
);

const AccountTable: React.FC<AccountTableProps> = ({
  data,
  columns,
  handleSort,
  roleClassMapping,
  roleIconMapping,
  isLoading,
  onUpdateAccount,
  setRefreshKey,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

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
          <ClipLoader size={50} color={'#5BABAC'} loading={isLoading} />
        </div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <TableHeader columns={columns} handleSort={handleSort} />
          <tbody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                item={item}
                index={index}
                columns={columns}
                handleDetailClick={handleDetailClick}
                roleClassMapping={roleClassMapping}
                roleIconMapping={roleIconMapping}
              />
            ))}
          </tbody>
        </table>
      )}

      {selectedAccount && onUpdateAccount && (
        <AccountDetailModal
          account={selectedAccount}
          onClose={handleCloseModal}
          onUpdateAccount={onUpdateAccount}
          setRefreshKey={setRefreshKey}
        />
      )}
    </>
  );
};

export default AccountTable;
