import { useState, useEffect } from 'react';
import {
  FaSpinner,
  FaClipboardCheck,
  FaFileContract,
  FaHourglassHalf,
  FaCheck,
  FaBan,
  FaList,
  FaBoxOpen,
} from 'react-icons/fa';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ProjectTableManager from './components/Table/ProjectTableManager';
import {
  getProjectsList,
  getProjectsListWithType,
} from '../../../api/Project/ProjectApi';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const getStatusLabel = (status: string) => {
  const statusLabelMap: { [key: string]: string } = {
    Processing: 'Đang xử lý',
    Designed: 'Đã thiết kế',
    Reviewing: 'Chờ xác nhận',
    'Signed Contract': 'Đã ký hợp đồng',
    Finalized: 'Hoàn thành',
    Ended: 'Đã chấm dứt',
  };
  return statusLabelMap[status] || 'Không xác định';
};

type Project = {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  category: string;
  date: string;
  status: string;
  isChecked: boolean;
};

type SortKey = keyof Project;

const ProjectListManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchProjects = async (page: number) => {
    setLoading(true);
    try {
      let data;
      if (activeTab === 'Tất cả') {
        data = await getProjectsList(page, 10);
      } else {
        const statusMap: { [key: string]: string } = {
          'Đang xử lý': 'Processing',
          'Đã thiết kế': 'Designed',
          'Chờ xác nhận': 'Reviewing',
          'Đã ký hợp đồng': 'Signed Contract',
          'Hoàn thành': 'Finalized',
          'Đã chấm dứt': 'Ended',
        };
        const type = statusMap[activeTab];
        data = await getProjectsListWithType(page, 10, type);
      }

      const formattedData = data.Items.map((item: any) => ({
        id: item.Id,
        projectId: item.ProjectCode,
        projectName: item.Name,
        customerName: item.AccountName,
        category: item.Type,
        date: new Date(item.InsDate).toLocaleDateString('vi-VN'),
        status: item.Status,
        isChecked: false,
      }));
      setProjects(formattedData);
      setTotalPages(data.TotalPages);
    } catch (err) {
      setError('Có lỗi xảy ra khi lấy dữ liệu dự án');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage, activeTab]);

  const handleRefresh = () => {
    setLoading(true);
    setProjects([]);
    fetchProjects(currentPage).finally(() => {
      setLoading(false);
    });
  };

  const handleSelectAll = () => {
    const newIsAllChecked = !isAllChecked;
    setIsAllChecked(newIsAllChecked);
    setProjects(
      projects.map((project) => ({ ...project, isChecked: newIsAllChecked })),
    );
  };

  const handleCheckboxChange = (index: number) => {
    const newProjects = [...projects];
    newProjects[index].isChecked = !newProjects[index].isChecked;
    setProjects(newProjects);
    setIsAllChecked(newProjects.every((project) => project.isChecked));
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

    const sortedProjects = [...projects].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

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

    setProjects(sortedProjects);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const handleDeleteSelected = () => {
    setProjects(projects.filter((project) => !project.isChecked));
  };

  const handleViewDetails = (id: string) => {
    navigate(`/project-detail/${id}`);
    window.scrollTo(0, 0);
  };

  const filteredProjects = projects.filter((project) =>
    activeTab === 'Tất cả'
      ? project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      : getStatusLabel(project.status) === activeTab &&
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns: { key: SortKey; label: string }[] = [
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
    { label: 'Đã thiết kế', icon: <FaFileContract /> },
    { label: 'Chờ xác nhận', icon: <FaHourglassHalf /> },
    { label: 'Đã ký hợp đồng', icon: <FaClipboardCheck /> },
    { label: 'Hoàn thành', icon: <FaCheck /> },
    { label: 'Đã chấm dứt', icon: <FaBan /> },
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
                      ? 'border-primary text-primary'
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
                Tổng số Dự án: {projects.length}
              </span>
            </div>
            <ArrowPathIcon
              onClick={handleRefresh}
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition"
            />
          </div>
          <div className="max-w-full overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <ClipLoader size={50} color={'#123abc'} loading={loading} />
              </div>
            ) : filteredProjects.length > 0 ? (
              <ProjectTableManager
                data={filteredProjects}
                columns={columns}
                isAllChecked={isAllChecked}
                handleSelectAll={handleSelectAll}
                handleCheckboxChange={handleCheckboxChange}
                handleSort={handleSort}
                handleDelete={handleDelete}
                handleViewDetails={handleViewDetails}
                isLoading={loading}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FaBoxOpen className="mx-auto mb-4 text-4xl text-primary" />
                Không có dữ liệu để hiển thị.
              </div>
            )}
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

export default ProjectListManager;
