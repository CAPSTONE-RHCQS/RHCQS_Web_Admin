import { useState, useCallback, useMemo } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { FaRegFrown } from 'react-icons/fa';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useProjectsSalesStaff from '../../../hooks/useProjectsSalesStaff';
import { useNavigate } from 'react-router-dom';
import ProjectTableSalesStaff from './components/Table/ProjectTableSalesStaff';

const ProjectListSalesStaff = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { projects, loading, error, totalPages, handleSort } =
    useProjectsSalesStaff(currentPage, refreshKey);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  const handleViewDetails = useCallback(
    (id: string) => {
      navigate(`/project-detail-staff/${id}`);
      window.scrollTo(0, 0);
    },
    [navigate],
  );

  const typeMap: { [key: string]: string } = {
    TEMPLATE: 'Mẫu nhà',
    FINISHED: 'Hoàn thiện',
    ROUGH: 'Thô',
    ALL: 'Thô & Hoàn thiện',
    HAVE_DRAWING: 'Sẵn bản thiết kế',
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((project) => ({
        ...project,
        category: typeMap[project.category] || project.category,
      }));
  }, [projects, searchTerm]);

  const columns = useMemo(
    () => [
      { key: 'projectId', label: 'Mã Dự Án' },
      { key: 'projectName', label: 'Tên Dự Án' },
      { key: 'customerName', label: 'Khách Hàng' },
      { key: 'category', label: 'Thể loại' },
      { key: 'date', label: 'Ngày' },
      { key: 'status', label: 'Trạng thái' },
    ],
    [],
  );

  

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    },
    [totalPages],
  );

  return (
    <>
      <Breadcrumb pageName="Danh sách dự án" />
      <div className="rounded-lg border border-stroke bg-white px-6 pt-6 pb-3 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-2">
        <div className="flex flex-col md:flex-row md:items-center mb-5">
          <input
            type="text"
            className="h-14 w-full md:w-96 pr-8 pl-5 rounded-lg z-0 shadow focus:outline-none mb-4 md:mb-0 md:mr-4"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center mb-5">
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
          {filteredProjects.length > 0 ? (
            <ProjectTableSalesStaff
              data={filteredProjects}
              columns={columns}
              handleSort={handleSort}
              handleViewDetails={handleViewDetails}
              isLoading={loading}
              error={error}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <FaRegFrown className="text-4xl text-gray-500 mb-4" />
              <p className="text-lg text-gray-500">
                Hiện tại chưa có công việc nào dành cho bạn.
              </p>
            </div>
          )}
        </div>
        {filteredProjects.length > 0 && (
          <div className="flex justify-between mt-5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Trang trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectListSalesStaff;
