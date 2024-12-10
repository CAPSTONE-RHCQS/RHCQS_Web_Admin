import React, { useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useFetchUtilities from '../../../hooks/useFetchUtilities';
import UtilityTable from './components/Table/UtilityTable';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import CreateUtility from './components/Create/CreateUltility';
import CreateSection from './components/Create/CreateSection';
import Alert from '../../../components/Alert';

const UtilityList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
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
    setIsModalOpen(false);
    setAlertMessage('Thêm tiện ích thành công!');
    setAlertType('success');
  };

  const handleSectionAddSuccess = () => {
    handleRefresh();
    setIsSectionModalOpen(false);
    setAlertMessage('Thêm phần tiện ích thành công!');
    setAlertType('success');
  };

  const handleError = (message: string) => {
    setAlertMessage(message);
    setAlertType('error');
  };

  return (
    <>
      <Breadcrumb pageName="Quản lý Dịch vụ và Tiện ích" />
      <div className="rounded-lg border border-stroke bg-white px-6 pt-6 pb-3 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-2">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            <span className="text-lg text-black dark:text-white">
              Tổng số Dịch vụ và Tiện ích: {totalUtilities}
            </span>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="mr-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Thêm mới
            </button>
            <button
              onClick={() => setIsSectionModalOpen(true)}
              className="mr-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Thêm phần
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

      <CreateUtility
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSuccess}
        onCancel={() => setIsModalOpen(false)}
        onError={handleError}
      />
      <CreateSection
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSave={handleSectionAddSuccess}
        onCancel={() => setIsSectionModalOpen(false)}
        onError={handleError}
      />
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType || 'success'}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
};

export default UtilityList;
