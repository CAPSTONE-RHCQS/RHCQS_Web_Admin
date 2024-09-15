import { useState } from 'react';
import {
  FaSpinner,
  FaClipboardCheck,
  FaFileContract,
  FaHourglassHalf,
  FaCheck,
  FaBan,
  FaList,
} from 'react-icons/fa';
import CheckboxTwo from '../../../components/Checkboxes/CheckboxTwo';
import DeleteButton from '../../../components/Buttonicons/DeleteButton';
import EditButton from '../../../components/Buttonicons/EditButton';
import DownloadButton from '../../../components/Buttonicons/DownloadButton';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SortIcon from '../../../components/Buttonicons/SortIcon';
import QuoteManagerTable from '../components/QuoteManagerTable';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';

type Email = {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  category: string;
  serviceType: string;
  date: string;
  status: string;
  isChecked: boolean;
};

type SortKey = string;

const ProjectManager = () => {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      projectId: 'P001',
      projectName: 'Khu Công Nghiệp Bình An',
      customerName: 'Nguyễn Văn A',
      category: 'Nhà cổ',
      serviceType: 'Báo giá thô',
      date: '12.08.2019',
      status: 'Đang xử lý',
      isChecked: false,
    },
    {
      id: '2',
      projectId: 'P002',
      projectName: 'Khu Công Nghiệp Sóng Thần',
      customerName: 'Trần Văn B',
      category: 'Nhà cổ',
      serviceType: 'Báo giá thô & Hoàn thiện',
      date: '01.12.2024',
      status: 'Đã thiết kế',
      isChecked: false,
    },
    {
      id: '3',
      projectId: 'P003',
      projectName: 'Khu Công Nghệ Cao',
      customerName: 'Lê Thị C',
      category: 'Nhà cổ',
      serviceType: 'Báo giá thô & Hoàn thiện',
      date: '25.11.2024',
      status: 'Đã tạo hợp đồng thiết kế',
      isChecked: false,
    },
    {
      id: '4',
      projectId: 'P004',
      projectName: 'Khu Dân Cư',
      customerName: 'Phạm Văn D',
      category: 'Nhà cổ',
      serviceType: 'Báo giá thô',
      date: '30.04.2024',
      status: 'Đang chờ kiểm tra',
      isChecked: false,
    },
    {
      id: '5',
      projectId: 'P005',
      projectName: 'Khu Đô Thị Mới',
      customerName: 'Nguyễn Thị E',
      category: 'Nhà hiện đại',
      serviceType: 'Báo giá thô',
      date: '15.05.2023',
      status: 'Đã tạo hợp đồng',
      isChecked: false,
    },
    {
      id: '6',
      projectId: 'P006',
      projectName: 'Khu Chung Cư Cao Cấp',
      customerName: 'Trần Văn F',
      category: 'Nhà hiện đại',
      serviceType: 'Báo giá thô & Hoàn thiện',
      date: '20.06.2023',
      status: 'Đã hoàn thành',
      isChecked: false,
    },
    {
      id: '7',
      projectId: 'P007',
      projectName: 'Khu Nghỉ Dưỡng',
      customerName: 'Lê Thị G',
      category: 'Nhà hiện đại',
      serviceType: 'Báo giá thô & Hoàn thiện',
      date: '10.07.2023',
      status: 'Hợp đồng đã chấm dứt',
      isChecked: false,
    },
  ]);

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Tất cả');

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

      if (
        key === 'date' &&
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
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'ascending' ? aValue - bValue : bValue - aValue;
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

  const handleViewDetails = (id: string) => {
    // Logic xử lý khi nhấn nút "Xem chi tiết"
    console.log('View details for:', id);
  };

  const handleDownload = (id: string) => {
    // Logic xử lý khi nhấn nút "Tải về"
    console.log('Download for:', id);
  };

  const filteredEmails = emails.filter((email) =>
    activeTab === 'Tất cả'
      ? email.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      : email.status === activeTab &&
        email.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    { key: 'projectId', label: 'Mã Dự Án' },
    { key: 'projectName', label: 'Tên Dự Án' },
    { key: 'customerName', label: 'Khách Hàng' },
    { key: 'category', label: 'Thể loại' },
    { key: 'serviceType', label: 'Dịch vụ' },
    { key: 'date', label: 'Ngày' },
    { key: 'status', label: 'Trạng thái' },
  ];

  const tabs = [
    { label: 'Tất cả', icon: <FaList /> },
    { label: 'Đang xử lý', icon: <FaSpinner /> },
    { label: 'Đã thiết kế', icon: <FaClipboardCheck /> },
    { label: 'Đã tạo hợp đồng thiết kế', icon: <FaFileContract /> },
    { label: 'Đang chờ kiểm tra', icon: <FaHourglassHalf /> },
    { label: 'Đã tạo hợp đồng', icon: <FaFileContract /> },
    { label: 'Đã hoàn thành', icon: <FaCheck /> },
    { label: 'Hợp đồng đã chấm dứt', icon: <FaBan /> },
  ];

  return (
    <>
      <Breadcrumb pageName="Danh sách dự án" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-4">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map((tab) => (
              <li
                key={tab.label}
                className={`mr-1 ${
                  activeTab === tab.label
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500'
                } transition-colors duration-300`}
              >
                <button
                  className="inline-block py-2 px-4 font-semibold flex items-center transition-transform duration-300 transform hover:scale-105"
                  onClick={() => setActiveTab(tab.label)}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col md:flex-row md:items-center mb-4">
          <input
            type="text"
            className="h-14 w-full md:w-96 pr-8 pl-5 rounded z-0 shadow focus:outline-none mb-4 md:mb-0 md:mr-4"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleDeleteSelected}
            className="h-14 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Xóa đã chọn
          </button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <QuoteManagerTable
            data={filteredEmails}
            columns={columns}
            isAllChecked={isAllChecked}
            handleSelectAll={handleSelectAll}
            handleCheckboxChange={handleCheckboxChange}
            handleSort={handleSort}
            handleDelete={handleDelete}
            handleViewDetails={handleViewDetails}
            handleDownload={handleDownload}
          />
        </div>
      </div>
    </>
  );
};

export default ProjectManager;
