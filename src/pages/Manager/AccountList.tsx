import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import {
  UserIcon,
  BriefcaseIcon,
  PencilIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/solid';
import useFetchAccounts from '../../hooks/useFetchAccounts';
import { Account } from '../../types/Account';
import AccountTable from './components/Table/AccountTable';

type SortKey = string;

const roleClassMapping: { [key: string]: string } = {
  'Sales Staff': 'bg-blue-500 text-white',
  'Design Staff': 'bg-pink-500 text-white',
  Manager: 'bg-purple-500 text-white',
  Customer: 'bg-green-500 text-white',
};

const roleIconMapping: { [key: string]: JSX.Element } = {
  'Sales Staff': <ShoppingCartIcon className="w-4 h-4" />,
  'Design Staff': <PencilIcon className="w-4 h-4" />,
  Manager: <BriefcaseIcon className="w-4 h-4" />,
  Customer: <UserIcon className="w-4 h-4" />,
};

const AccountList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    accounts: fetchedAccounts,
    totalPages,
    totalAccounts,
    isLoading,
  } = useFetchAccounts(currentPage);
  const [accounts, setAccounts] = useState<Account[]>(fetchedAccounts);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    setAccounts(fetchedAccounts);
  }, [fetchedAccounts]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectAll = () => {
    const newIsAllChecked = !isAllChecked;
    setIsAllChecked(newIsAllChecked);
    setAccounts(
      accounts.map((account) => ({ ...account, isChecked: newIsAllChecked })),
    );
  };

  const handleCheckboxChange = (index: number) => {
    const newAccounts = [...accounts];
    newAccounts[index].isChecked = !newAccounts[index].isChecked;
    setAccounts(newAccounts);
    setIsAllChecked(newAccounts.every((account) => account.isChecked));
  };

  const handleSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedAccount = [...accounts].sort((a, b) => {
      const aValue = a[key as keyof Account];
      const bValue = b[key as keyof Account];

      if (
        key === 'birthday' &&
        typeof aValue === 'string' &&
        typeof bValue === 'string'
      ) {
        const dateA = new Date(aValue.split('.').reverse().join('-'));
        const dateB = new Date(bValue.split('.').reverse().join('-'));
        return direction === 'ascending'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

    setAccounts(sortedAccount);
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  const handleDeleteSelected = () => {
    setAccounts(accounts.filter((account) => !account.isChecked));
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRole === '' || account.role === selectedRole),
  );

  const columns = [
    { key: 'avatar', label: 'Avatar' },
    { key: 'accountName', label: 'Tên Nhân Viên' },
    { key: 'phoneNumber', label: 'Số Điện Thoại' },
    { key: 'role', label: 'Vai Trò' },
  ];

  return (
    <>
      <Breadcrumb pageName="Quản lý tài khoản hệ thống" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <p className="mb-4 text-lg text-black dark:text-white">
          Tổng số Tài khoản: {totalAccounts}
        </p>
        <div className="flex flex-col md:flex-row md:items-center mb-4">
          <input
            type="text"
            className="h-14 w-full md:w-96 pr-8 pl-5 rounded z-0 shadow focus:outline-none mb-4 md:mb-0 md:mr-4"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="h-14 w-full md:w-48 pr-8 pl-5 rounded z-0 shadow focus:outline-none mb-4 md:mb-0 md:mr-4"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="Manager">Quản lý</option>
            <option value="Design Staff">Nhân viên thiết kế</option>
            <option value="Sales Staff">Nhân viên bán hàng</option>
            <option value="Customer">Khách hàng</option>
          </select>
          <button
            onClick={handleDeleteSelected}
            className="h-14 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Xóa đã chọn
          </button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <AccountTable
            data={filteredAccounts}
            columns={columns}
            isAllChecked={isAllChecked}
            handleSelectAll={handleSelectAll}
            handleCheckboxChange={handleCheckboxChange}
            handleSort={handleSort}
            handleDelete={handleDelete}
            roleClassMapping={roleClassMapping}
            roleIconMapping={roleIconMapping}
            isLoading={isLoading}
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>
    </>
  );
};

export default AccountList;
