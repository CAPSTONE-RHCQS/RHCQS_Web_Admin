import React, { useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useFetchPromotions from '../../../hooks/useFetchPromotions';
import PromotionTable from './components/Table/PromotionTable';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import AddPromotionModal from './components/Modals/AddPromotionModal';

const PromotionList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { totalPages, totalPromotions, isLoading, promotions } =
    useFetchPromotions(currentPage, refreshKey);

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
      <Breadcrumb pageName="Quản lý khuyến mãi" />

      <div className="rounded-lg border border-stroke bg-white px-6 pt-6 pb-3 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-2">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            <span className="text-lg text-black dark:text-white">
              Tổng số Khuyến mãi: {totalPromotions}
            </span>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="mr-4 p-2 text-primaryGreenButton font-bold rounded-lg hover:bg-blue-600 transition"
            >
              + Thêm mới
            </button>
            <ArrowPathIcon
              onClick={handleRefresh}
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition"
            />
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <PromotionTable
            data={promotions}
            isLoading={isLoading}
            onEditSuccess={handleRefresh}
          />
        </div>
        <div className="flex justify-between mt-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>

      <AddPromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSuccess={handleAddSuccess}
      />
    </>
  );
};

export default PromotionList;
