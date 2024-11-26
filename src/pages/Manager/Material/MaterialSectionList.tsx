import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import {
  getMaterialList,
  getMaterialSectionList,
  createMaterialSection,
} from '../../../api/Material/Material';
import { MaterialItem, MaterialSectionItem } from '../../../types/Material';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import MaterialTable from './components/Table/MaterialTable';
import Alert from '../../../components/Alert';
import CreateMaterialSection from './components/Create/CreateMateraiSection';

const MaterialSectionList: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [dataMaterialSection, setDataMaterialSection] = useState<
    MaterialSectionItem[]
  >([]);
  const [dataMaterial, setDataMaterial] = useState<MaterialItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMaterialSection, setTotalMaterialSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inputNameValue, setInputNameValue] = useState('');
  const [inputCodeValue, setInputCodeValue] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [pageInput, setPageInput] = useState<string>(page.toString());

  useEffect(() => {
    setPageInput(page.toString());
  }, [page]);

  useEffect(() => {
    setIsLoading(true);
    getMaterialList(1, 1000).then((dataMaterial) => {
      setDataMaterial(dataMaterial.Items);
    });
    getMaterialSectionList(page, 10).then((data) => {
      setDataMaterialSection(data.Items);
      setTotalPages(data.TotalPages);
      setTotalMaterialSection(data.Total);
      console.log(data.Items);
      setIsLoading(false);
    });
  }, [page, refreshKey]);

  const toggleOpenItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

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
    try {
      await createMaterialSection({
        name: inputNameValue,
        code: inputCodeValue,
      });
      setAlertMessage('Tạo hạng mục vật tư thành công');
      setAlertType('success');
      handleRefresh();
      setIsCreateModalOpen(false);
    } catch (error) {
      setAlertMessage('Tạo hạng mục vật tư thất bại');
      setAlertType('error');
      console.error('Error creating material section:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <>
      <div>
        <Breadcrumb pageName="Quản lý vật tư" />
        <div className="bg-white p-4 rounded shadow ">
          <div className="flex items-center justify-between mb-8 ml-4 mt-4">
            <span className="text-lg text-black dark:text-white">
              Tổng số vật tư: {totalMaterialSection}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-primary font-bold"
              >
                + Thêm vật tư
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
            <MaterialTable
              dataMaterialSection={dataMaterialSection}
              dataMaterial={dataMaterial}
              openItems={openItems}
              editModalOpen={editModalOpen}
              toggleOpenItem={toggleOpenItem}
              formatPrice={formatPrice}
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
        <CreateMaterialSection
          isOpen={isCreateModalOpen}
          inputNameValue={inputNameValue}
          inputCodeValue={inputCodeValue}
          onInputNameChange={setInputNameValue}
          onInputCodeChange={setInputCodeValue}
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

export default MaterialSectionList;
