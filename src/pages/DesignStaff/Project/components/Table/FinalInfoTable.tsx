import React, { useState, useEffect, useRef } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { FinalInfo } from '../../../../../types/ProjectTypes';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  FaSpinner,
  FaBan,
  FaUserCheck,
  FaTimes,
  FaClock,
  FaUser,
  FaCheckCircle,
} from 'react-icons/fa';

interface FinalInfoTableProps {
  detailedQuoteData: FinalInfo[];
}

const statusMap: {
  [key: string]: { label: string; icon: JSX.Element; color: string };
} = {
  Pending: { label: 'Chờ xử lý', icon: <FaClock />, color: '#2196F3' },
  Processing: { label: 'Đang xử lý', icon: <FaSpinner />, color: '#FFA500' },
  Reviewing: {
    label: 'Chờ xác nhận quản lý',
    icon: <FaUser />,
    color: '#9370DB',
  },
  Approved: {
    label: 'Quản lý đã xác nhận',
    icon: <FaUserCheck />,
    color: '#5BABAC',
  },
  Rejected: { label: 'Từ chối báo giá', icon: <FaTimes />, color: '#FF6347' },
  Finalized: { label: 'Hoàn thành', icon: <FaCheckCircle />, color: '#32CD32' },
  Ended: { label: 'Đã đóng', icon: <FaBan />, color: '#EF5350' },
};

const getStatusInfo = (status: string) => {
  return (
    statusMap[status] || {
      label: 'Không xác định',
      icon: <FaTimes />,
      color: 'text-gray-500',
    }
  );
};

const FinalInfoTable: React.FC<FinalInfoTableProps> = ({
  detailedQuoteData,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleRowMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setActiveMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-2 text-left dark:bg-meta-4">
          <th className="py-4 px-4 font-medium text-black dark:text-white">
            STT
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white">
            Phiên bản
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white">
            Thời gian tạo
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white">
            Người tạo
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white">
            Trạng thái
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
        </tr>
      </thead>
      <tbody>
        {detailedQuoteData.map((item, index) => {
          return (
            <tr key={item.Id}>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {index + 1}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {item.Version ?? 'N/A'}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {item.InsDate ? new Date(item.InsDate).toLocaleString() : 'N/A'}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {item.AccountName}
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
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                <FiMoreVertical
                  className="cursor-pointer"
                  onClick={() => toggleRowMenu(item.Id)}
                />
                {activeMenu === item.Id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    <div className="py-2">
                      <Link
                        to={`/final-quotation-detail-staff/${item.Id}`}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default FinalInfoTable;
