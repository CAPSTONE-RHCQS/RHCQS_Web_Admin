import React, { useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useFetchUtilities from '../../../hooks/useFetchUtilities';
import UtilityTable from './components/Table/UtilityTable';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import AddUtilityModal from './components/Modals/AddUtilityModal';

const UtilityList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { totalPages, totalUtilities, isLoading, utilities } =
    useFetchUtilities(currentPage, refreshKey);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleAddSuccess = () => {
    handleRefresh();
  };

  return (
    <>
      <Breadcrumb pageName="Quản lý Tùy chọn và Tiện ích" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-lg text-black dark:text-white">
              Tổng số Tùy chọn và Tiện ích: {totalUtilities}
            </span>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="mr-4 p-2 bg-blue-500 text-white rounded"
            >
              Thêm mới
            </button>
            <ArrowPathIcon
              onClick={handleRefresh}
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition"
            />
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <UtilityTable
            data={utilities}
            isLoading={isLoading}
            onEditSuccess={handleRefresh}
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

      <AddUtilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSuccess={handleAddSuccess}
      />
    </>
  );
};

export default UtilityList;
