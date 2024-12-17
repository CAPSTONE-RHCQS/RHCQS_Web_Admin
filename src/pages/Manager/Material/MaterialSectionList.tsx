import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { FaDownload } from 'react-icons/fa';
import {
  getMaterialList,
  getMaterialSectionList,
  createMaterialSection,
  importExcelMaterial,
  searchMaterialSectionAllName,
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
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inputNameValue, setInputNameValue] = useState('');
  const [inputCodeValue, setInputCodeValue] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [pageInput, setPageInput] = useState<string>(page.toString());
  const [file, setFile] = useState<File | null>(null);
  const [searchName, setSearchName] = useState<string>('');

  useEffect(() => {
    setPageInput(page.toString());
  }, [page]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (isSearching) {
        const data = await searchMaterialSectionAllName(searchName, page, 10);
        setDataMaterialSection(data.Items);
        setTotalPages(data.TotalPages);
      } 
      const dataMaterial = await getMaterialList(1, 1000);
      setDataMaterial(dataMaterial.Items);
      
      if (!isSearching) {
        const data = await getMaterialSectionList(page, 10);
        setDataMaterialSection(data.Items);
        setTotalPages(data.TotalPages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, refreshKey, searchName]);

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
    fetchData();
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
      setInputNameValue('');
      setInputCodeValue('');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setAlertMessage(null);
    setAlertType('success');

    try {
      await importExcelMaterial(formData);
      setAlertMessage('Tải lên tệp Excel thành công');
      setAlertType('success');
      setFile(null);
      handleRefresh();
    } catch (error: any) {
      console.error('Error importing excel material:', error);
      const errorMessage = error || 'Tải lên tệp Excel thất bại';
      setAlertMessage(errorMessage);
      setAlertType('error');
      formData.delete('file');
    }
  };

  const handleCloseAlert = () => {
    setAlertMessage(null);
    setAlertType('success');
  };

  const handleSearchChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setEditModalOpen(false);
      setIsSearching(true);
      setPage(1);
    };
  return (
    <>
      <div>
        <Breadcrumb pageName="Quản lý vật tư" />
        <div className="bg-white p-4 rounded shadow ">
          <div className="flex items-center justify-between mb-8 ml-4 mt-4">
            <div className="flex flex-col space-y-2 w-2/3">
              <label className="text-sm font-bold text-black">
                Tìm kiếm vật tư
              </label>
              <input
                type="text"
                placeholder="Nhập tên vật tư..."
                value={searchName}
                onChange={handleSearchChange(setSearchName)}
                className="border p-2 w-full rounded-md focus:outline-none"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-primary font-bold"
              >
                + Thêm vật tư
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
          onClose={handleCloseAlert}
        />
      )}
    </>
  );
};

export default MaterialSectionList;
