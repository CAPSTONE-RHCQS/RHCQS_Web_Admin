import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { FaDownload } from 'react-icons/fa';

import { ConstructionWorkType } from '../../../types/ContructionWork';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Alert from '../../../components/Alert';
import {
  getConstructionWorks,
  importConstructionWorkByExcel,
  multipleSearchConstructionWorkItem,
} from '../../../api/Construction/ContructionWork';
import ConstructionWorkTable from './components/Table/ConstructionWorkTable';
import CreateContructionWork from './components/Create/CreateContructionWork';
import CreatePackageConstructionWork from './components/Create/CreatePackageConstructionWork';

const ConstructionWorkList: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [dataConstructionWork, setDataConstructionWork] = useState<
    ConstructionWorkType['Items']
  >([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalConstructionWork, setTotalConstructionWork] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [pageInput, setPageInput] = useState<string>(page.toString());
  const [constructionResponse, setConstructionResponse] = useState<string>('');
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchUnit, setSearchUnit] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setPageInput(page.toString());
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (isSearching) {
          const data = await multipleSearchConstructionWorkItem(
            page,
            10,
            searchCode,
            searchName,
            searchUnit,
          );
          setDataConstructionWork(data.Items);
          setTotalPages(data.TotalPages);
          setTotalConstructionWork(data.Total);
        } else {
          const data = await getConstructionWorks(page, 10);
          setDataConstructionWork(data.Items);
          setTotalPages(data.TotalPages);
          setTotalConstructionWork(data.Total);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, refreshKey, searchCode, searchName, searchUnit, isSearching]);

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

  const handleSave = async (response: string) => {
    setIsCreateModalOpen(false);
    setConstructionResponse(response);
    setAlertMessage('Công tác hạng mục đã được lưu thành công!');
    setAlertType('success');
    handleRefresh();
  };

  const handleError = (errorMessage: string) => {
    setAlertMessage(errorMessage);
    setAlertType('error');
  };

  const handleCloseAlert = () => {
    setAlertMessage(null);
    setAlertType('success');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await importConstructionWorkByExcel(formData);
        setAlertMessage('Công tác đã được thêm thành công!');
        setAlertType('success');
        handleRefresh();
      } catch (error: any) {
        setAlertMessage(error.response.data.Error);
        setAlertType('error');
      }
    }
  };

  const handleSearchChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setIsSearching(true);
      setPage(1);
    };

  return (
    <>
      <div>
        <Breadcrumb pageName="Công tác hạng mục" />
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-8 ml-4 mt-4">
            <div className="flex items-center justify-start space-x-2">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Tên công tác</label>
                <input
                  type="text"
                  placeholder="Nhập tên công tác"
                  value={searchName}
                  onChange={handleSearchChange(setSearchName)}
                  className="border rounded px-2 py-1"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Mã công tác</label>
                <input
                  type="text"
                  placeholder="Nhập mã công tác"
                  value={searchCode}
                  onChange={handleSearchChange(setSearchCode)}
                  className="border rounded px-2 py-1"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Đơn vị</label>
                <input
                  type="text"
                  placeholder="Nhập đơn vị"
                  value={searchUnit}
                  onChange={handleSearchChange(setSearchUnit)}
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2">
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
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <ArrowPathIcon
                onClick={handleRefresh}
                className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition"
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
          onError={handleError}
        />
      )}

      {constructionResponse && (
        <CreatePackageConstructionWork
          isOpen={!!constructionResponse}
          onSave={() => {
            setConstructionResponse('');
            setAlertMessage('Công tác hạng mục tạo thành công!');
            handleRefresh();
            setAlertType('success');
          }}
          onCancel={() => setConstructionResponse('')}
          constructionData={constructionResponse}
          onError={handleError}
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
