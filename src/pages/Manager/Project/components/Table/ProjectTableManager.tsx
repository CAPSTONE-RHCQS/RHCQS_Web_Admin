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
import RejectionModal from '../../../../../components/Modals/RejectionModal';
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
  handleDelete: (id: string) => void;
  handleViewDetails: (id: string) => void;
  isLoading: boolean;
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
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmReject = (reason: string) => {
    console.log('Rejected with reason:', reason);
    setShowModal(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={'#5BABAC'} loading={isLoading} />
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

export default ProjectTableManager;
