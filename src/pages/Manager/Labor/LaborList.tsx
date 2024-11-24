import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
// import LaborTable from './component/Table/LaborTable';
import Alert from '../../../components/Alert';
import { createLabor, getLabor } from '../../../api/Labor/Labor';
import { LaborItem } from '../../../types/Labor';
import LaborTable from './component/Table/LaborTable';
import CreateLabor from './component/Create/CreateLabor';

const LaborList: React.FC = () => {
  const [dataLabor, setDataLabor] = useState<LaborItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLabor, setTotalLabor] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [pageInput, setPageInput] = useState<string>(page.toString());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  useEffect(() => {
    setPageInput(page.toString());
  }, [page]);

  useEffect(() => {
    setIsLoading(true);
    getLabor(page, 10).then((data: any) => {
      setDataLabor(data.Items);
      setTotalPages(data.TotalPages);
      setTotalLabor(data.Total);
      console.log(data.Items);
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
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = e.target.value;
    setPageInput(newPage);
  };

  const handleCreateLabor = async (newLabor: any) => {
    try {
      await createLabor(newLabor);
      setAlertMessage('Tạo nhân công thành công');
      setAlertType('success');
      setIsCreateModalOpen(false);
      handleRefresh();
    } catch (error) {
      setAlertMessage('Tạo nhân công thất bại');
      setAlertType('error');
    } finally {
      setTimeout(() => {
        setIsCreateModalOpen(false);
      }, 1000);
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    }
  };

  return (
    <>
      <div>
        <Breadcrumb pageName="Quản lý lao động" />
        <div className="bg-white p-4 rounded shadow ">
          <div className="flex items-center justify-between mb-8 ml-4 mt-4">
            <span className="text-lg text-black dark:text-white">
              Tổng số lao động: {totalLabor}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-primary font-bold"
              >
                + Thêm nhân công
              </button>
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
            <LaborTable
              dataLabor={dataLabor}
              refreshData={handleRefresh}
              openEditModal={openEditModal}
              currentEditId={currentEditId}
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
                type="number"
                value={pageInput}
                onChange={handlePageInputChange}
                onKeyDown={handlePageInputKeyDown}
                className="w-12 text-center border rounded mx-2 no-spin"
                min={1}
                max={totalPages}
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
        <CreateLabor
          isOpen={isCreateModalOpen}
          onCreate={handleCreateLabor}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      )}

      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
};

export default LaborList;
