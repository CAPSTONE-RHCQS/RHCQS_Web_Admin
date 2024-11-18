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
import { getProjectsByMultiFilter } from '../../../api/Project/ProjectApi';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const navigate = useNavigate();

  const columns: { key: SortKey; label: string }[] = [
    { key: 'projectId', label: 'Mã Dự Án' },
    { key: 'projectName', label: 'Tên Dự Án' },
    { key: 'customerName', label: 'Khách Hàng' },
    { key: 'category', label: 'Thể loại' },
    { key: 'date', label: 'Ngày' },
    { key: 'status', label: 'Trạng thái' },
  ];

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectsByMultiFilter(
        currentPage,
        5,
        startTime,
        status,
        type,
        code,
        phone,
      );

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
      setTotalProjects(data.Total);
    } catch (err: any) {
      setProjects([]);
      if (err.response && err.response.data && err.response.data.Error) {
        setError(err.response.data.Error);
      } else {
        setError('Có lỗi xảy ra khi lấy dữ liệu dự án');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchProjects();
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
    setProjects((prevProjects) =>
      [...prevProjects].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }),
    );
  };

  const handleViewDetails = (projectId: string) => {
    navigate(`/project-detail-manager/${projectId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Danh sách dự án" />

      <div className="rounded-lg border border-stroke bg-white px-6 pt-6 pb-3 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-2">
        <div className="mb-5 flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Từ ngày</label>
            <input
              type="date"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
              placeholder="Chọn ngày"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Mã dự án</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
              placeholder="Nhập mã dự án"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Dịch vụ</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
            >
              <option value="">Tất cả</option>
              <option value="TEMPLATE">Mẫu nhà</option>
              <option value="FINISHED">Hoàn thiện</option>
              <option value="ROUGH">Thô</option>
              <option value="ALL">Thô & Hoàn thiện</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
            >
              <option value="">Tất cả</option>
              <option value="Processing">Đang xử lý</option>
              <option value="Designed">Đã thiết kế</option>
              <option value="Reviewing">Chờ xác nhận</option>
              <option value="Signed Contract">Đã ký hợp đồng</option>
              <option value="Finalized">Hoàn thành</option>
              <option value="Ended">Đã chấm dứt</option>
            </select>
          </div>
          <div className="flex">
            <button
              onClick={handleApplyFilters}
              className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={50} color={'#5BABAC'} loading={loading} />
            </div>
          ) : projects.length > 0 ? (
            <ProjectTableManager
              data={projects}
              columns={columns}
              handleSort={handleSort}
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
        <div className="flex justify-between mt-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Trang sau
          </button>
        </div>
      </div>
    </>
  );
};

export default ProjectListManager;
