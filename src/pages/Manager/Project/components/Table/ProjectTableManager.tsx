import React from 'react';
import {
  FaCheck,
  FaFileContract,
  FaBan,
  FaEye,
  FaSignature,
  FaUser,
  FaHome,
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
  type: string;
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

const statusMap: Record<
  string,
  { label: string; icon: JSX.Element; color: string }
> = {
  Processing: { label: 'Đang xử lý', icon: <FaHome />, color: '#5BABAC' },
  Designed: {
    label: 'Đã thiết kế',
    icon: <FaFileContract />,
    color: '#E91E63',
  },
  Reviewing: {
    label: 'Chờ xác nhận',
    icon: <FaUser />,
    color: '#2196F3',
  },
  'Signed Contract': {
    label: 'Đã ký hợp đồng',
    icon: <FaSignature />,
    color: '#9C27B0',
  },
  Finalized: { label: 'Hoàn thành', icon: <FaCheck />, color: '#4CAF50' },
  Ended: { label: 'Đã chấm dứt', icon: <FaBan />, color: '#F44336' },
};

const getStatusInfo = (status: string) => {
  return (
    statusMap[status] || {
      label: 'Không xác định',
      icon: null,
      color: '#B0B0B0',
    }
  );
};

const typeOptions = (type: string) => {
  const typeOptions: { [key: string]: string } = {
    TEMPLATE: 'Mẫu nhà',
    FINISHED: 'Hoàn thiện',
    ROUGH: 'Thô',
    ALL: 'Thô & Hoàn thiện',
    HAVE_DRAWING: 'Sẵn bản thiết kế',
  };
  return typeOptions[type] || 'Không xác định';
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
              {data.map((item, index) => {
                const { label, icon, color } = getStatusInfo(item.status);
                return (
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
                            style={{ backgroundColor: color }}
                          >
                            {icon}
                            <span className="ml-2">{label}</span>
                          </span>
                        ) : column.key === 'projectId' ? (
                          <strong style={{ color: '#FF5733' }}>
                            {item[column.key]}
                          </strong>
                        ) : column.key === 'category' ? (
                          <span className="flex items-center">
                            <span className="text-primaryGreenButton font-medium mr-2">
                              {typeOptions(item[column.key])}
                            </span>
                          </span>
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
                );
              })}
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
