import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { getHouseDesigns } from '../../../api/HouseDesignDrawing/HouseDesignDrawingApi';
import HouseDesignTable from './components/Table/HouseDesignTable';
import {
  FaSyncAlt,
  FaRegFrown,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaEye,
} from 'react-icons/fa';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

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
  Pending: 'Đang chờ',
  Processing: 'Đang xử lý',
  Reviewing: 'Chờ xác nhận từ quản lý',
  Updating: 'Đang chỉnh sửa',
  Updated: 'Đã chỉnh sửa',
  Approved: 'Quản lý đã xác nhận',
  Accepted: 'Đã xác nhận',
  Finalized: 'Đã hoàn thành',
  Canceled: 'Đã đóng',
};

export const statusStyles: {
  [key: string]: {
    backgroundColor: string;
    borderColor: string;
    icon: JSX.Element;
  };
} = {
  Pending: {
    backgroundColor: '#0084ff',
    borderColor: '#0084ff',
    icon: <FaSyncAlt className="text-white" />,
  },
  Processing: {
    backgroundColor: '#FFA500',
    borderColor: '#FFD700',
    icon: <FaSyncAlt className="text-white" />,
  },
  Rejected: {
    backgroundColor: '#FF6347',
    borderColor: '#FF0000',
    icon: <FaTimesCircle className="text-white" />,
  },
  Updating: {
    backgroundColor: '#1E90FF',
    borderColor: '#007BFF',
    icon: <FaEdit className="text-white" />,
  },
  Reviewing: {
    backgroundColor: '#9370DB',
    borderColor: '#800080',
    icon: <FaSyncAlt className="text-white" />,
  },
  Approved: {
    backgroundColor: '#32CD32',
    borderColor: '#008000',
    icon: <FaCheckCircle className="text-white" />,
  },
  Accepted: {
    backgroundColor: '#32CD32',
    borderColor: '#008000',
    icon: <FaCheckCircle className="text-white" />,
  },
  Canceled: {
    backgroundColor: '#A9A9A9',
    borderColor: '#808080',
    icon: <FaTimesCircle className="text-white" />,
  },
  Finalized: {
    backgroundColor: '#32CD32',
    borderColor: '#008000',
    icon: <FaCheckCircle className="text-white" />,
  },
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
          {designs.length > 0 ? (
            <HouseDesignTable
              data={designs.map((design) => ({
                ...design,
                Status: statusMap[design.Status] || design.Status,
                style: statusStyles[design.Status] || {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D3D3D3',
                  icon: <FaSyncAlt className="text-gray-500" />,
                },
              }))}
              isLoading={loading}
              onEditSuccess={handleRefresh}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <FaRegFrown className="text-4xl text-gray-500 mb-4" />
              <p className="text-lg text-gray-500">
                Hiện tại chưa có công việc nào dành cho bạn.
              </p>
            </div>
          )}
        </div>
        {designs.length > 0 && (
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
        )}
      </div>
    </>
  );
};

export default HouseDesignList;
