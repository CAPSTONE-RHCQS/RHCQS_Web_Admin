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
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ProjectTableSalesStaff from '../components/Table/ProjectTableSalesStaff';
import useProjectsSalesStaff from '../../../hooks/useProjectsSalesStaff';
import { useNavigate } from 'react-router-dom';

type Email = {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  category: string;
  date: string;
  status: string;
  isChecked: boolean;
};

type SortKey = string;

const ProjectListSalesStaff = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const {
    emails,
    loading,
    error,
    totalPages,
    isAllChecked,
    handleSelectAll,
    handleCheckboxChange,
    handleSort,
  } = useProjectsSalesStaff(currentPage, refreshKey);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleDelete = (id: string) => {
    const updatedEmails = emails.filter((email) => email.id !== id);
  };

  const handleDeleteSelected = () => {
    const updatedEmails = emails.filter((email) => !email.isChecked);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/project-detail-staff/${id}`);
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

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Danh sách dự án" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <>
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
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="text-lg text-black dark:text-white">
                Tổng số Dự án: {emails.length}
              </span>
            </div>
            <ArrowPathIcon
              onClick={handleRefresh}
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition"
            />
          </div>
          <div className="max-w-full overflow-x-auto">
            <ProjectTableSalesStaff
              data={filteredEmails}
              columns={columns}
              isAllChecked={isAllChecked}
              handleSelectAll={handleSelectAll}
              handleCheckboxChange={handleCheckboxChange}
              handleSort={handleSort}
              handleDelete={handleDelete}
              handleViewDetails={handleViewDetails}
              isLoading={loading}
              error={error}
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Trang trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        </>
      </div>
    </>
  );
};

export default ProjectListSalesStaff;
