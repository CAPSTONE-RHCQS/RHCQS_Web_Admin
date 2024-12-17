// src/pages/Manager/DesignPrice/DesignPriceList.tsx
import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

import Alert from '../../../components/Alert';
import {
  getDesignPrice,
  createDesignPrice,
} from '../../../api/DesignPrice/DesignPrice';
import {
  DesignPriceItem,
  DesignPriceRequest,
} from '../../../types/DesignPrice';
import CreateDesignPrice from './component/Create/CreateDessignPrice';
import DesignPriceTable from './component/Table/DesignPriceTable';

const DesignPriceList: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [dataDesignPrice, setDataDesignPrice] = useState<DesignPriceItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<DesignPriceRequest>({
    areaFrom: 0,
    areaTo: 0,
    price: 0,
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [pageInput, setPageInput] = useState<string>(page.toString());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setPageInput(page.toString());
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getDesignPrice();
        setDataDesignPrice(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, refreshKey, searchTerm, isSearching]);

  const openEditModal = (id: string) => {
    setCurrentEditId(id);
    setEditModalOpen(true);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setEditModalOpen(false);
    setIsCreateModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setEditModalOpen(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setInputValue((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const designPriceData = { ...inputValue }; // Thay đổi tên biến
      await createDesignPrice(designPriceData); // Thay đổi API
      setAlertMessage('Tạo giá thiết kế thành công'); // Thay đổi thông báo
      setAlertType('success');
      setIsCreateModalOpen(false);
      handleRefresh();
    } catch (error) {
      setAlertMessage('Tạo giá thiết kế thất bại'); // Thay đổi thông báo
      setAlertType('error');
      console.error('Error creating design price:', error); // Thay đổi thông báo
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

  const handleSearch = () => {
    setIsSearching(!!searchTerm);
  };

  return (
    <>
      <div>
        <Breadcrumb pageName="Quản lý giá thiết kế" />
        <div className="bg-white p-4 rounded shadow ">
          <div className="flex items-center justify-between mb-8 ml-4 mt-4">
            <div className="flex space-x-2 w-2/3">
              <div className="flex flex-col space-y-2 w-2/3">
                <h2 className="text-lg font-bold text-red-600 mb-4">
                  Giá này chỉ áp dụng với{' '}
                  <span className="font-extrabold">NHÀ Ở DÂN DỤNG</span>
                </h2>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-primary font-bold"
              >
                + Thêm giá thiết kế
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
            <DesignPriceTable
              dataDesignPrice={dataDesignPrice}
              openItems={openItems}
              editModalOpen={editModalOpen}
              openEditModal={openEditModal}
              currentEditId={currentEditId || ''}
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
        <CreateDesignPrice
          isOpen={isCreateModalOpen}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSave={handleSave}
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

export default DesignPriceList;
