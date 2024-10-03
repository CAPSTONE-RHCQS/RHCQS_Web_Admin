import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import StaffTable from '../../components/StaffTable';
import { getAccounts, getTotalAccounts } from '../../api/Account/Account';
import {
  UserIcon,
  BriefcaseIcon,
  PencilIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/solid';

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
};

type SortKey = string;

const roleMapping: { [key: string]: string } = {
  '9959ce96-de26-40a7-b8a7-28a704062e89': 'Sales Staff',
  '7af0d75e-1157-48b4-899d-3196deed5fad': 'Design Staff',
  'a3bb42ca-de7c-4c9f-8f58-d8175f96688c': 'Manager',
  '789dd57d-0f75-40d1-8366-ef6ab582efc8': 'Customer',
};


const roleClassMapping: { [key: string]: string } = {
  'Sales Staff': 'bg-blue-500 text-white',
  'Design Staff': 'bg-pink-500 text-white',
  Manager: 'bg-yellow-500 text-white',
  Customer: 'bg-green-500 text-white',
};

const roleIconMapping: { [key: string]: JSX.Element } = {
  'Sales Staff': <ShoppingCartIcon className="w-4 h-4" />,
  'Design Staff': <PencilIcon className="w-4 h-4" />,
  Manager: <BriefcaseIcon className="w-4 h-4" />,
  Customer: <UserIcon className="w-4 h-4" />,
};


const AccountList = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái isLoading

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true); // Bắt đầu loading
      try {
        const data = await getAccounts(currentPage, 10);
        const formattedData = data.Items.map((item: any) => ({
          id: item.Id,
          roleId: item.RoleId,
          email: item.Email,
          username: item.Username,
          imageUrl: item.ImageUrl || 'default-avatar-url', // Replace with a default avatar URL if needed
          phoneNumber: item.PhoneNumber || '',
          dateOfBirth: item.DateOfBirth
            ? new Date(item.DateOfBirth).toLocaleDateString()
            : '',
          insDate: item.InsDate,
          upsDate: item.UpsDate,
          avatar: item.ImageUrl || 'default-avatar-url', // Replace with a default avatar URL if needed
          staffName: item.Username,
          role: roleMapping[item.RoleId] || 'Unknown', // Map RoleId to a role name
          birthday: item.DateOfBirth
            ? new Date(item.DateOfBirth).toLocaleDateString()
            : '',
          address: '', // Add address if available
          isChecked: false,
          deflag: item.Deflag, // Add deflag status
        }));
        setStaffs(formattedData);
        setTotalPages(data.TotalPages);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    };

    const fetchTotalAccounts = async () => {
      try {
        const total = await getTotalAccounts();
        setTotalAccounts(total);
      } catch (error) {
        console.error('Failed to fetch total accounts:', error);
      }
    };

    fetchAccounts();
    fetchTotalAccounts();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectAll = () => {
    const newIsAllChecked = !isAllChecked;
    setIsAllChecked(newIsAllChecked);
    setStaffs(
      staffs.map((staff) => ({ ...staff, isChecked: newIsAllChecked })),
    );
  };

  const handleCheckboxChange = (index: number) => {
    const newStaffs = [...staffs];
    newStaffs[index].isChecked = !newStaffs[index].isChecked;
    setStaffs(newStaffs);
    setIsAllChecked(newStaffs.every((staff) => staff.isChecked));
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

    const sortedStaffs = [...staffs].sort((a, b) => {
      const aValue = a[key as keyof Staff];
      const bValue = b[key as keyof Staff];

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

    setStaffs(sortedStaffs);
  };

  const handleDelete = (id: string) => {
    setStaffs(staffs.filter((staff) => staff.id !== id));
  };

  const handleDeleteSelected = () => {
    setStaffs(staffs.filter((staff) => !staff.isChecked));
  };

  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.staffName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRole === '' || staff.role === selectedRole),
  );

  const columns = [
    { key: 'avatar', label: 'Avatar' },
    { key: 'staffName', label: 'Tên Nhân Viên' },
    { key: 'role', label: 'Vai Trò' },
    { key: 'phone', label: 'Số Điện Thoại' },
    // { key: 'deflag', label: 'Trạng Thái' }, // Bỏ cột Trạng thái
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
            {/* Thêm các vai trò khác nếu cần */}
          </select>
          <button
            onClick={handleDeleteSelected}
            className="h-14 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Xóa đã chọn
          </button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <StaffTable
            data={filteredStaffs}
            columns={columns}
            isAllChecked={isAllChecked}
            handleSelectAll={handleSelectAll}
            handleCheckboxChange={handleCheckboxChange}
            handleSort={handleSort}
            handleDelete={handleDelete}
            roleClassMapping={roleClassMapping} // Truyền roleClassMapping vào StaffTable
            roleIconMapping={roleIconMapping} // Truyền roleIconMapping vào StaffTable
            isLoading={isLoading} // Truyền isLoading vào StaffTable
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