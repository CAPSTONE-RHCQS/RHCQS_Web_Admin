import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useFetchConstructions from '../../../hooks/useFetchConstructions';
import ConstructionTable from './components/Table/ConstructionTable';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import AddConstructionModal from './components/Modals/AddConstructionModal';
import { searchConstruction } from '../../../api/Construction/ConstructionApi';
import { ConstructionTypeResponse } from '../../../types/ConstructionTypeResponse';

const ConstructionList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState<string>(currentPage.toString());
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { totalPages, isLoading, constructions } =
    useFetchConstructions(currentPage, refreshKey);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ConstructionTypeResponse[]>([]);

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

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

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = e.target.value;
    setPageInput(newPage);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    }
  };

  const handleSearch = async () => {
    try {
      const results = await searchConstruction(searchQuery, currentPage, 10);
      setSearchResults(results.Items);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching constructions:', error);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch();
  };

  return (
    <>
      <Breadcrumb pageName="Quản lý hạng mục" />

      <div className="rounded-lg border border-stroke bg-white px-6 pt-6 pb-3 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-8 xl:pb-2">
        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-col space-y-2 w-2/3">
            <label className="text-sm font-bold text-black">
              Tìm kiếm hạng mục
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Tên hạng mục"
              className="border rounded px-4 py-1 mr-2 w-1/2"
            />
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-primary font-bold"
            >
              + Thêm hạng mục mới
            </button>
            <ArrowPathIcon
              onClick={handleRefresh}
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition"
            />
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <ConstructionTable
            data={searchQuery ? searchResults : constructions}
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>

      <AddConstructionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSuccess={handleAddSuccess}
      />
    </>
  );
};

export default ConstructionList;
