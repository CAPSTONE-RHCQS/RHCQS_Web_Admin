import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SupplierTable from './component/Table/SupplierTable';
import Alert from '../../../components/Alert';
import {
  getSupplierList,
  createSupplier,
} from '../../../api/Supplier/Supplier';
import { SupplierItem, UpdateSupplierRequest } from '../../../types/Supplier';
import CreateSupplier from './component/Create/CreateSupplier';

const SupplierList: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [dataSupplier, setDataSupplier] = useState<SupplierItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSupplier, setTotalSupplier] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<UpdateSupplierRequest>({
    name: '',
    email: '',
    constractPhone: '',
    imgUrl: '',
    deflag: false,
    shortDescription: '',
    description: '',
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    setIsLoading(true);
    getSupplierList(page, 10).then((data: any) => {
      setDataSupplier(data.Items);
      setTotalPages(data.TotalPages);
      setTotalSupplier(data.Total);
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

  const handleInputChange = (field: string, value: string) => {
    setInputValue((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await createSupplier(inputValue);
      setAlertMessage('Tạo nhà cung cấp thành công');
      setAlertType('success');
      handleRefresh();
    } catch (error) {
      setAlertMessage('Tạo nhà cung cấp thất bại');
      setAlertType('error');
      console.error('Error creating supplier:', error);
    }
  };
  return (
    <>
      <div>
        <Breadcrumb pageName="Quản lý nhà cung cấp" />
        <div className="bg-white p-4 rounded shadow ">
          <div className="flex items-center justify-between mb-8 ml-4 mt-4">
            <span className="text-lg text-black dark:text-white">
              Tổng số nhà cung cấp: {totalSupplier}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-primary font-bold"
              >
                + Thêm nhà cung cấp
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
            <SupplierTable
              dataSupplier={dataSupplier}
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
              Trang {page} / {totalPages}
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
        <CreateSupplier
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

export default SupplierList;
