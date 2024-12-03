import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { FaDownload } from 'react-icons/fa';

import { ConstructionWorkType } from '../../../types/ContructionWork';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Alert from '../../../components/Alert';
import { getConstructionWorks } from '../../../api/Construction/ContructionWork';
import ConstructionWorkTable from './components/Table/ConstructionWorkTable';
import CreateContructionWork from './components/Create/CreateContructionWork';

const ConstructionWorkList: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [dataConstructionWork, setDataConstructionWork] = useState<ConstructionWorkType['Items']>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalConstructionWork, setTotalConstructionWork] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [pageInput, setPageInput] = useState<string>(page.toString());

  useEffect(() => {
    setPageInput(page.toString());
  }, [page]);

  useEffect(() => {
    setIsLoading(true);
    getConstructionWorks(page, 10).then((data) => {
      setDataConstructionWork(data.Items);
      setTotalPages(data.TotalPages);
      setTotalConstructionWork(data.Total);
      setIsLoading(false);
    });
  }, [page, refreshKey]);

  const openEditModal = (id: string) => {
    setCurrentEditId(id);
    setEditModalOpen(true);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setEditModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setEditModalOpen(false);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = e.target.value;
    setPageInput(newPage);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    }
  };

  const handleSave = async () => {
    // Logic để lưu công việc xây dựng mới
    setIsCreateModalOpen(false);
    setAlertMessage('Công tác hạng mục đã được lưu thành công!');
    setAlertType('success');
    handleRefresh();
  };

  const handleCloseAlert = () => {
    setAlertMessage(null);
    setAlertType('success');
  };

  return (
    <>
      <div>
        <Breadcrumb pageName="Công tác hạng mục" />
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-8 ml-4 mt-4">
            <span className="text-lg text-black dark:text-white">
              Tổng số công tác hạng mục: {totalConstructionWork}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-primary font-bold"
              >
                + Thêm công tác hạng mục
              </button>
              <button
                onClick={() => document.getElementById('fileInput')?.click()}
                className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center transition-colors duration-200"
              >
                <FaDownload className="text-lg" />
              </button>
              <input type="file" id="fileInput" style={{ display: 'none' }} />
              <ArrowPathIcon
                onClick={handleRefresh}
                className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition mt-2"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={50} color={'#5BABAC'} loading={isLoading} />
            </div>
          ) : (
            <ConstructionWorkTable
              dataConstructionWork={dataConstructionWork}
              openItems={openItems}
              editModalOpen={editModalOpen}
              openEditModal={openEditModal}
              currentEditId={currentEditId}
              refreshData={handleRefresh}
            />
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
            >
              Trang trước
            </button>
            <span>
              Trang
              <input
                type="text"
                value={pageInput}
                onChange={handlePageInputChange}
                onKeyDown={handlePageInputKeyDown}
                className="w-12 text-center border rounded mx-2"
              />
              / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateContructionWork
          isOpen={isCreateModalOpen}
          onSave={handleSave}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      )}
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={handleCloseAlert}
        />
      )}
    </>
  );
};

export default ConstructionWorkList;
