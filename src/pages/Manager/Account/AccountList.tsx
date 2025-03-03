import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import {
  UserIcon,
  BriefcaseIcon,
  PencilIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';
import useFetchAccounts from '../../../hooks/useFetchAccounts';
import { Account } from '../../../types/Account';
import AccountTable from './components/Table/AccountTable';
import CreateStaffAccountModal from './components/Modal/CreateStaffAccountModal';

type SortKey = string;

const roleClassMapping: { [key: string]: string } = {
  'Nhân viên báo giá': 'bg-blue-500 text-white',
  'Nhân viên thiết kế': 'bg-pink-500 text-white',
  'Quản lý': 'bg-purple-500 text-white',
  'Khách hàng': 'bg-primary text-white',
};

const roleIconMapping: { [key: string]: JSX.Element } = {
  'Nhân viên báo giá': <ShoppingCartIcon className="w-4 h-4" />,
  'Nhân viên thiết kế': <PencilIcon className="w-4 h-4" />,
  'Quản lý': <BriefcaseIcon className="w-4 h-4" />,
  'Khách hàng': <UserIcon className="w-4 h-4" />,
};

const AccountList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const { totalPages, isLoading, accounts, setAccounts } = useFetchAccounts(
    currentPage,
    refreshKey,
    selectedRole,
    searchTerm,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
    setCurrentPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleAccountCreated = () => {
    setRefreshKey((prev) => prev + 1);
    handleCloseCreateModal();
  };

  const columns = [
    { key: 'avatar', label: 'Ảnh Đại Diện' },
    { key: 'accountName', label: 'Tên Người Dùng' },
    { key: 'role', label: 'Vai Trò' },
    { key: 'phoneNumber', label: 'Số Điện Thoại' },
    { key: 'email', label: 'Email' },
  ];

  const updateAccountInList = (updatedAccount: Account) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account.Id === updatedAccount.Id
          ? { ...account, ...updatedAccount }
          : account,
      ),
    );
  };

  return (
    <>
      <Breadcrumb pageName="Quản lý tài khoản hệ thống" />

      <div className="rounded-lg border border-stroke bg-white px-6 pt-6 pb-3 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-2">
        <div className="flex flex-col md:flex-row md:items-center mb-5">
          <input
            type="text"
            className="h-14 w-full md:w-96 pr-8 pl-5 rounded-lg z-0 shadow focus:outline-none mb-4 md:mb-0 md:mr-4"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="h-14 w-full md:w-48 pr-8 pl-5 rounded-lg z-0 shadow focus:outline-none mb-4 md:mb-0 md:mr-4"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="">Tất cả vai trò</option>
            <option value="a3bb42ca-de7c-4c9f-8f58-d8175f96688c">
              Quản lý
            </option>
            <option value="7af0d75e-1157-48b4-899d-3196deed5fad">
              Nhân viên thiết kế
            </option>
            <option value="9959ce96-de26-40a7-b8a7-28a704062e89">
              Nhân viên báo giá
            </option>
            <option value="789dd57d-0f75-40d1-8366-ef6ab582efc8">
              Khách hàng
            </option>
          </select>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center h-11 w-full md:w-40 text-primary font-bold rounded-lg hover:bg-opacity-90 transition ml-auto"
          >
            + Tạo Tài Khoản
          </button>
        </div>
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            <span className="text-lg text-black dark:text-white"></span>
          </div>
          <ArrowPathIcon
            onClick={handleRefresh}
            className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition"
          />
        </div>
        <div className="max-w-full overflow-x-auto">
          <AccountTable
            data={accounts}
            columns={columns}
            handleSort={handleSort}
            roleClassMapping={roleClassMapping}
            roleIconMapping={roleIconMapping}
            isLoading={isLoading}
            onUpdateAccount={updateAccountInList}
            refreshKey={refreshKey}
            setRefreshKey={setRefreshKey}
          />
        </div>
        <div className="flex justify-between mt-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateStaffAccountModal
          onClose={handleCloseCreateModal}
          onAccountCreated={handleAccountCreated}
        />
      )}
    </>
  );
};

export default AccountList;
