import { useState } from 'react';
import CheckboxTwo from '../components/Checkboxes/CheckboxTwo';
import DeleteButton from '../components/Buttonicons/DeleteButton';
import EditButton from '../components/Buttonicons/EditButton';
import DownloadButton from '../components/Buttonicons/DownloadButton';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import SortIcon from '../components/Buttonicons/SortIcon';
import PriceQuoteTable from '../components/PriceQuoteTable';

type Email = {
  id: string;
  projectName: string;
  customerName: string;
  category: string;
  serviceType: string;
  date: string;
  contractValue: number;
  status: string;
  isChecked: boolean;
};

type SortKey = string;

const PriceQuote = () => {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      projectName: 'Khu Công Nghiệp Bình An',
      customerName: 'Nguyễn Văn A',
      category: 'Nhà cổ',
      serviceType: 'Báo giá thô',
      date: '12.08.2019',
      contractValue: 1000000,
      status: 'Chờ xác nhận',
      isChecked: false,
    },
    {
      id: '2',
      projectName: 'Khu Công Nghiệp Sóng Thần',
      customerName: 'Trần Văn B',
      category: 'Nhà cổ',
      serviceType: 'Báo giá thô',
      date: '01.12.2024',
      contractValue: 2000000,
      status: 'Hoàn thành',
      isChecked: false,
    },
    {
      id: '3',
      projectName: 'Khu Công Nghệ Cao',
      customerName: 'Lê Thị C',
      category: 'Nhà cổ',
      serviceType: 'Báo giá thô',
      date: '25.11.2024',
      contractValue: 3000000,
      status: 'Đang xử lý',
      isChecked: false,
    },
    {
      id: '4',
      projectName: 'Khu Dân Cư',
      customerName: 'Phạm Văn D',
      category: 'Nhà cổ',
      serviceType: 'Báo giá thô',
      date: '30.04.2024',
      contractValue: 4000000,
      status: 'Hủy',
      isChecked: false,
    },
  ]);

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = () => {
    const newIsAllChecked = !isAllChecked;
    setIsAllChecked(newIsAllChecked);
    setEmails(
      emails.map((email) => ({ ...email, isChecked: newIsAllChecked })),
    );
  };

  const handleCheckboxChange = (index: number) => {
    const newEmails = [...emails];
    newEmails[index].isChecked = !newEmails[index].isChecked;
    setEmails(newEmails);
    setIsAllChecked(newEmails.every((email) => email.isChecked));
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

    const sortedEmails = [...emails].sort((a, b) => {
      const aValue = a[key as keyof Email];
      const bValue = b[key as keyof Email];

      if (key === 'date' && typeof aValue === 'string' && typeof bValue === 'string') {
        const dateA = new Date(aValue.split('.').reverse().join('-'));
        const dateB = new Date(bValue.split('.').reverse().join('-'));
        return direction === 'ascending'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'ascending'
          ? aValue - bValue
          : bValue - aValue;
      }
      return 0;
    });

    setEmails(sortedEmails);
  };

  const handleDelete = (id: string) => {
    setEmails(emails.filter((email) => email.id !== id));
  };

  const handleDeleteSelected = () => {
    setEmails(emails.filter((email) => !email.isChecked));
  };

  const filteredEmails = emails.filter((email) =>
    email.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    { key: 'projectName', label: 'Tên Dự Án' },
    { key: 'customerName', label: 'Khách Hàng' },
    { key: 'category', label: 'Thể loại' },
    { key: 'serviceType', label: 'Dịch vụ' },
    { key: 'date', label: 'Ngày' },
    { key: 'contractValue', label: 'Hợp Đồng' },
    { key: 'status', label: 'Trạng thái' },
  ];

  return (
    <>
      <Breadcrumb pageName="Báo giá" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Danh sách báo giá
        </h4>
        <input
          type="text"
          className="h-14 w-96 pr-8 pl-5 rounded z-0 shadow focus:outline-none"
          placeholder="Search anything..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleDeleteSelected}
          className="mb-4 p-2 bg-red-500 text-white"
        >
          Xóa đã chọn
        </button>
        <div className="max-w-full overflow-x-auto">
          <PriceQuoteTable
            data={emails}
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

export default PriceQuote;
