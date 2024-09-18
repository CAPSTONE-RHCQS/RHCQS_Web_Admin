import { useState } from 'react';
import CheckboxTwo from '../../components/Checkboxes/CheckboxTwo';
import DeleteButton from '../../components/Buttonicons/DeleteButton';
import EditButton from '../../components/Buttonicons/EditButton';
import DownloadButton from '../../components/Buttonicons/DownloadButton';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SortIcon from '../../components/Buttonicons/SortIcon';
import StaffTable from '../../components/StaffTable';

type Staff = {
  id: string;
  avatar: string;
  staffName: string;
  role: string;
  birthday: string;
  address: string;
  email: string;
  phone: string;
  isChecked: boolean;
};

type SortKey = string;

const AccountList = () => {
  const [staffs, setStaffs] = useState<Staff[]>([
    {
      id: '1',
      avatar:
        'https://htmediagroup.vn/wp-content/uploads/2022/04/Anh-CV-2_avatar-min-1170x780.jpg',
      staffName: 'Nguyễn Văn A',
      role: 'Quản lý',
      birthday: '12.08.1980',
      address: '123 Đường A, Quận 1, TP.HCM',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      isChecked: false,
    },
    {
      id: '2',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvIuSnnn519WMlA0pP5tITLJLe678hfRFw4hKrk-_RSSsNLmZwoqXMUBXtVLa5fYqHqWo&usqp=CAU',
      staffName: 'Trần Văn B',
      role: 'Nhân viên',
      birthday: '01.12.1990',
      address: '456 Đường B, Quận 2, TP.HCM',
      email: 'tranvanb@example.com',
      phone: '0902345678',
      isChecked: false,
    },
    {
      id: '3',
      avatar: 'https://studiochupanhdep.com/Upload/Images/Album/anh-cv-dep.jpg',
      staffName: 'Lê Văn C',
      role: 'Khách hàng',
      birthday: '01.12.1990',
      address: '456 Đường B, Quận 3, TP.HCM',
      email: 'levanc@example.com',
      phone: '0902345678',
      isChecked: false,
    },
    // ... thêm dữ liệu nhân viên khác ...
  ]);

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

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
    { key: 'birthday', label: 'Ngày Sinh' },
    { key: 'address', label: 'Địa Chỉ' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Số Điện Thoại' },
  ];

  return (
    <>
      <Breadcrumb pageName="Quản lý tài khoản hệ thống" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Quản lý tài khoản
        </h4>
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
            <option value="Quản lý">Quản lý</option>
            <option value="Nhân viên">Nhân viên</option>
            <option value="Khách hàng">Khách hàng</option>
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
          />
        </div>
      </div>
    </>
  );
};

export default AccountList;
