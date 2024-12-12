import React, { useState } from 'react';
import {
  FaCheck,
  FaFileContract,
  FaBan,
  FaEye,
  FaBoxOpen,
  FaHome,
  FaUser,
  FaSignature,
} from 'react-icons/fa';
import RejectionModal from '../../../../../components/Modals/RejectionModal';
import SortIcon from '../../../../../components/Buttonicons/SortIcon';
import { ClipLoader } from 'react-spinners';

type DataItem = {
  [key: string]: any;
};

type SortKey = string;

interface ProjectTableSalesStaffProps {
  data: DataItem[];
  columns: { key: string; label: string }[];
  handleSort: (key: SortKey) => void;
  handleViewDetails: (id: string) => void;
  isLoading: boolean;
  error: string | null;
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

const ProjectTableSalesStaff: React.FC<ProjectTableSalesStaffProps> = ({
  data,
  columns,
  handleSort,
  handleViewDetails,
  isLoading,
  error,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmReject = (reason: string) => {
    setShowModal(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={'#5BABAC'} loading={isLoading} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FaBoxOpen className="mx-auto mb-4 text-4xl text-primary" />
          <span>Hiện tại chưa có dự án nào...</span>
        </div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  {column.label}
                  <SortIcon onClick={() => handleSort(column.key)} />
                </th>
              ))}
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
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
                        <span className="text-primaryGreenButton">
                          {item[column.key]}
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
      )}

      {showModal && (
        <RejectionModal
          title="Xác nhận từ chối"
          message="Bạn có chắc chắn muốn từ chối? Vui lòng nhập lý do từ chối."
          onConfirm={handleConfirmReject}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ProjectTableSalesStaff;
