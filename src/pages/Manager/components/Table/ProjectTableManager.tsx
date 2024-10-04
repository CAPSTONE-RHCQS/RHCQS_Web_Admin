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
import RejectionModal from '../../../../components/Modals/RejectionModal';
import CheckboxTwo from '../../../../components/Checkboxes/CheckboxTwo';
import SortIcon from '../../../../components/Buttonicons/SortIcon';
import { ClipLoader } from 'react-spinners';

type DataItem = {
  [key: string]: any;
};

type SortKey = string;

interface ProjectTableManagerProps {
  data: DataItem[];
  columns: { key: string; label: string }[];
  isAllChecked: boolean;
  handleSelectAll: () => void;
  handleCheckboxChange: (index: number) => void;
  handleSort: (key: SortKey) => void;
  handleDelete: (id: string) => void;
  handleViewDetails: (id: string) => void;
  isLoading: boolean;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Processing':
      return { backgroundColor: '#FFB347', icon: <FaSpinner /> };
    case 'Đã thiết kế':
      return { backgroundColor: '#4D4DFF', icon: <FaClipboardCheck /> };
    case 'Đã tạo hợp đồng thiết kế':
      return { backgroundColor: '#4CAF50', icon: <FaFileContract /> };
    case 'Đang chờ':
      return { backgroundColor: '#4D4DFF', icon: <FaHourglassHalf /> };
    case 'Đã tạo hợp đồng':
      return { backgroundColor: '#4CAF50', icon: <FaFileContract /> };
    case 'Đã hoàn thành':
      return { backgroundColor: '#4CAF50', icon: <FaCheck /> };
    case 'Đã hủy':
      return { backgroundColor: '#FF6666', icon: <FaBan /> };
    default:
      return { backgroundColor: '#B0B0B0', icon: null };
  }
};

const ProjectTableManager: React.FC<ProjectTableManagerProps> = ({
  data,
  columns,
  isAllChecked,
  handleSelectAll,
  handleCheckboxChange,
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
          <ClipLoader size={50} color={'#123abc'} loading={isLoading} />
        </div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                <CheckboxTwo
                  id="select-all"
                  isChecked={isAllChecked}
                  onChange={handleSelectAll}
                />
              </th>
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
                className="border-b border-[#eee] dark:border-strokedark"
              >
                <td className="py-5 px-4">
                  <CheckboxTwo
                    id={`select-${item.id}`}
                    isChecked={item.isChecked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
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
                        <span className="ml-2">{item[column.key]}</span>
                      </span>
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
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
