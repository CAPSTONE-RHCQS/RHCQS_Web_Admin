import React, { useState } from 'react';
import {
  FaCheck,
  FaSpinner,
  FaFileContract,
  FaClipboardCheck,
  FaHourglassHalf,
  FaBan,
  FaEye,
} from 'react-icons/fa';
import SortIcon from '../../../../../components/Buttonicons/SortIcon';
import { ClipLoader } from 'react-spinners';

type Project = {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  category: string;
  date: string;
  status: string;
  isChecked: boolean;
};

type SortKey = keyof Project;

interface ProjectTableManagerProps {
  data: Project[];
  columns: { key: SortKey; label: string }[];
  handleSort: (key: SortKey) => void;
  handleViewDetails: (id: string) => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Processing':
      return { backgroundColor: '#FFB347', icon: <FaSpinner /> };
    case 'Designed':
      return { backgroundColor: '#4CAF50', icon: <FaFileContract /> };
    case 'Reviewing':
      return { backgroundColor: '#FFD700', icon: <FaHourglassHalf /> };
    case 'Signed Contract':
      return { backgroundColor: '#4D4DFF', icon: <FaClipboardCheck /> };
    case 'Finalized':
      return { backgroundColor: '#4CAF50', icon: <FaCheck /> };
    case 'Ended':
      return { backgroundColor: '#FF6666', icon: <FaBan /> };
    default:
      return { backgroundColor: '#B0B0B0', icon: null };
  }
};

const getStatusLabel = (status: string) => {
  const statusLabelMap: { [key: string]: string } = {
    Processing: 'Đang xử lý',
    Designed: 'Đã thiết kế',
    Reviewing: 'Chờ xác nhận',
    'Signed Contract': 'Đã ký hợp đồng',
    Finalized: 'Hoàn thành',
    Ended: 'Đã chấm dứt',
  };
  return statusLabelMap[status] || 'Không xác định';
};

const ProjectTableManager: React.FC<ProjectTableManagerProps> = ({
  data,
  columns,
  handleSort,
  handleViewDetails,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i ? 'bg-primary text-white' : 'bg-gray-200'
          } hover:bg-primary hover:text-white transition`}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={'#5BABAC'} loading={isLoading} />
        </div>
      ) : (
        <>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left dark:bg-meta-4">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`py-4 px-4 font-medium text-black dark:text-white ${
                      column.key === 'customerName'
                        ? 'min-w-[200px]'
                        : 'min-w-[150px]'
                    }`}
                  >
                    {column.label}
                    <SortIcon onClick={() => handleSort(column.key)} />
                  </th>
                ))}
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-300 dark:border-strokedark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="border-b border-gray-300 py-5 px-4 dark:border-strokedark"
                    >
                      {column.key === 'status' ? (
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-white whitespace-nowrap"
                          style={{
                            backgroundColor: getStatusStyle(item[column.key])
                              .backgroundColor,
                          }}
                        >
                          {getStatusStyle(item[column.key]).icon}
                          <span className="ml-2">
                            {getStatusLabel(item[column.key])}
                          </span>
                        </span>
                      ) : column.key === 'projectId' ? (
                        <strong style={{ color: '#FF5733' }}>
                          {item[column.key]}
                        </strong>
                      ) : (
                        item[column.key]
                      )}
                    </td>
                  ))}
                  <td className="border-b border-gray-300 py-5 px-4 dark:border-strokedark">
                    <button
                      onClick={() => handleViewDetails(item.id)}
                      className="text-primaryGreenButton hover:text-secondaryGreenButton transition mr-2"
                    >
                      <FaEye className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Trang trước
            </button>
            <div className="flex">{renderPageNumbers()}</div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Trang sau
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ProjectTableManager;