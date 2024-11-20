import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { getHouseDesigns } from '../../../api/HouseDesignDrawing/HouseDesignDrawingApi';
import HouseDesignTable from './components/Table/HouseDesignTable';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

interface HouseDesign {
  Id: string;
  ProjectId: string;
  Name: string;
  Step: number;
  Status: string;
  Type: string;
  IsCompany: boolean;
  InsDate: string;
  Versions: any[];
}

const statusMap: { [key: string]: string } = {
  Processing: 'Đang xử lý',
  Rejected: 'Bị từ chối',
  Updating: 'Đang chỉnh sửa',
  Reviewing: 'Chờ xác nhận từ quản lý',
  Approved: 'Quản lý đã xác nhận',
  Accepted: 'Đã xác nhận',
  Canceled: 'Đã đóng',
  Finalized: 'Đã hoàn thành',
};

const HouseDesignList: React.FC = () => {
  const [designs, setDesigns] = useState<HouseDesign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const response = await getHouseDesigns(currentPage);
        setDesigns(response.data.Items);
        setTotalPages(response.data.TotalPages);
      } catch (error) {
        console.error('Error fetching house designs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [currentPage, refreshKey]);

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
      <Breadcrumb pageName="Danh sách công việc" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-lg text-black dark:text-white">
              Tổng số công việc: {designs.length}
            </span>
          </div>
          <div className="flex items-center">
            <ArrowPathIcon
              onClick={handleRefresh}
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition"
            />
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <HouseDesignTable
            data={designs.map(design => ({
              ...design,
              Status: statusMap[design.Status] || design.Status,
            }))}
            isLoading={loading}
            onEditSuccess={handleRefresh}
          />
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

export default HouseDesignList;
