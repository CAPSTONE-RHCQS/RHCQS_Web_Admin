import { useState, useEffect } from 'react';
import { FaBoxOpen, FaSync } from 'react-icons/fa';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ProjectTableManager from './components/Table/ProjectTableManager';
import { getProjectsByMultiFilter } from '../../../api/Project/ProjectApi';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

type Project = {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  category: string;
  date: string;
  status: string;
  type: string;
  isChecked: boolean;
};

type SortKey = keyof Project;

const PAGE_SIZE = 5;

const ProjectListManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    startTime: '',
    endTime: '',
    status: '',
    type: '',
    code: '',
    phone: '',
  });
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

  const typeOptions = {
    TEMPLATE: 'Mẫu nhà',
    FINISHED: 'Hoàn thiện',
    ROUGH: 'Thô',
    ALL: 'Thô & Hoàn thiện',
    HAVE_DRAWING: 'Sẵn bản thiết kế',
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectsByMultiFilter(
        currentPage,
        PAGE_SIZE,
        filters.startTime,
        filters.status,
        filters.type,
        filters.code,
        filters.phone,
      );

      const formattedData = data.Items.map((item: any) => ({
        id: item.Id,
        projectId: item.ProjectCode,
        projectName: item.Name,
        customerName: item.AccountName,
        category: item.Type,
        date: new Date(item.InsDate).toLocaleDateString('vi-VN'),
        status: item.Status,
        type: item.Type,
        isChecked: false,
      }));
      setProjects(formattedData);
      setTotalPages(data.TotalPages);
    } catch (err: any) {
      setProjects([]);
      setError(
        err.response?.data?.Error || 'Có lỗi xảy ra khi lấy dữ liệu dự án',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, filters]);

  const handleSort = (key: SortKey) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    setSortConfig({ key, direction });
    setProjects((prevProjects) =>
      [...prevProjects].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
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

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    setCurrentPage(1);
  };

  const handleRefreshProjects = () => {
    fetchProjects();
  };

  return (
    <>
      <Breadcrumb pageName="Danh sách dự án" />

      <div className="rounded-lg border border-stroke bg-white px-6 pt-6 pb-3 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-2">
        <div className="mb-5 flex flex-wrap items-end gap-4">
          {['startTime', 'phone', 'code'].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="mb-1 text-sm font-medium">
                {field === 'startTime'
                  ? 'Từ ngày'
                  : field === 'phone'
                  ? 'Số điện thoại'
                  : 'Mã dự án'}
              </label>
              <input
                type={field === 'startTime' ? 'date' : 'text'}
                name={field}
                value={filters[field as keyof typeof filters]}
                onChange={handleFilterChange}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
                placeholder={
                  field === 'startTime'
                    ? 'Chọn ngày'
                    : `Nhập ${field === 'phone' ? 'số điện thoại' : 'mã dự án'}`
                }
              />
            </div>
          ))}
          {['type', 'status'].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="mb-1 text-sm font-medium">
                {field === 'type' ? 'Dịch vụ' : 'Trạng thái'}
              </label>
              <select
                name={field}
                value={filters[field as keyof typeof filters]}
                onChange={handleFilterChange}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
              >
                <option value="">
                  {field === 'type' ? 'Tất cả' : 'Tất cả'}
                </option>
                {field === 'type' ? (
                  Object.entries(typeOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Processing">Đang xử lý</option>
                    <option value="Designed">Đã thiết kế</option>
                    <option value="Reviewing">Chờ xác nhận</option>
                    <option value="Signed Contract">Đã ký hợp đồng</option>
                    <option value="Finalized">Hoàn thành</option>
                    <option value="Ended">Đã chấm dứt</option>
                  </>
                )}
              </select>
            </div>
          ))}
          <div className="flex items-end">
            <ArrowPathIcon
              onClick={handleRefreshProjects}
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition"
            />
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
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FaBoxOpen className="mx-auto mb-4 text-4xl text-primary" />
              Không có dữ liệu để hiển thị.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectListManager;
