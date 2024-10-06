import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useFetchConstructions from '../../hooks/useFetchConstructions';
import ConstructionTable from './components/Table/ConstructionTable';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

const ConstructionList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    totalPages,
    totalConstructions,
    isLoading,
    constructions,
    setConstructions,
  } = useFetchConstructions(currentPage, refreshKey);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <Breadcrumb pageName="Quản lý hạng mục" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-lg text-black dark:text-white">
              Tổng số Hạng mục: {totalConstructions}
            </span>
          </div>
          <ArrowPathIcon
            onClick={handleRefresh}
            className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition"
          />
        </div>
        <div className="max-w-full overflow-x-auto">
          <ConstructionTable data={constructions} isLoading={isLoading} />
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
    </>
  );
};

export default ConstructionList;
