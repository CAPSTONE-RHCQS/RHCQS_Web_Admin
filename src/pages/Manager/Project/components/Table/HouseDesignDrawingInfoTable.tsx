import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEye,
  FaClock,
  FaCog,
  FaEdit,
  FaCheckCircle,
  FaBan,
  FaCheck,
  FaPaintBrush,
  FaPaintRoller,
  FaUser,
  FaUserCheck,
  FaTimes,
} from 'react-icons/fa';

interface HouseDesignDrawingInfoTableProps {
  designData: {
    Id: string;
    Step: number;
    Name: string;
    Type: string;
    InsDate: string;
    Status: string;
  }[];
}

const statusMap: {
  [key: string]: { color: string; label: string; icon: JSX.Element };
} = {
  Pending: { color: '#2196F3', label: 'Đang chờ', icon: <FaClock /> },
  Processing: {
    color: '#FFA500',
    label: 'Đang thiết kế',
    icon: <FaPaintBrush />,
  },
  Reviewing: {
    color: '#9370DB',
    label: 'Chờ xác nhận quản lý',
    icon: <FaUser />,
  },
  Approved: {
    color: '#5BABAC',
    label: 'Quản lý đã xác nhận',
    icon: <FaUserCheck />,
  },
  Rejected: { color: '#FF6347', label: 'Bị từ chối', icon: <FaTimes /> },
  Updating: { color: '#1E90FF', label: 'Đang chỉnh sửa', icon: <FaEdit /> },
  Accepted: { color: '#C0CA33', label: 'Chấp nhận bản vẽ', icon: <FaCheck /> },
  Finalized: {
    color: '#32CD32',
    label: 'Hoàn thành',
    icon: <FaCheckCircle />,
  },
  Ended: { color: '#EF5350', label: 'Đã đóng', icon: <FaBan /> },
  Canceled: { color: '#EF5350', label: 'Đã chấm dứt', icon: <FaBan /> },
};

const getStatusInfo = (status: string | null) => {
  if (!status) {
    return { color: 'text-gray-500', label: 'Không xác định', icon: <FaCog /> };
  }
  return (
    statusMap[status] || {
      color: 'text-gray-500',
      label: 'Không xác định',
      icon: <FaCog />,
    }
  );
};

const HouseDesignDrawingInfoTable: React.FC<
  HouseDesignDrawingInfoTableProps
> = ({ designData }) => {
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/house-design-detail-manager/${id}`);
  };

  return (
    <>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="py-4 px-4 font-medium text-black dark:text-white">
              STT
            </th>
            <th className="py-4 px-4 font-medium text-black dark:text-white">
              Bản vẽ
            </th>
            <th className="py-4 px-4 font-medium text-black dark:text-white">
              Thời gian tạo
            </th>
            <th className="py-4 px-4 font-medium text-black dark:text-white">
              Trạng thái
            </th>
            <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
          </tr>
        </thead>
        <tbody>
          {designData.map((item, index) => (
            <tr key={item.Id}>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {index + 1}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {item.Name}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {new Date(item.InsDate).toLocaleString()}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-white whitespace-nowrap"
                  style={{
                    backgroundColor: getStatusInfo(item.Status).color,
                  }}
                >
                  {getStatusInfo(item.Status).icon}
                  <span className="ml-2">
                    {getStatusInfo(item.Status).label}
                  </span>
                </span>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <button
                  onClick={() => handleViewDetails(item.Id)}
                  className="text-primaryGreenButton hover:text-secondaryGreenButton transition mr-2"
                >
                  <FaEye className="text-xl" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default HouseDesignDrawingInfoTable;
