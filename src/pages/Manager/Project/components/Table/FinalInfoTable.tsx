import React, { useState, useEffect, useRef } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { FinalInfo } from '../../../../../types/ProjectTypes';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface FinalInfoTableProps {
  detailedQuoteData: FinalInfo[];
}

const statusColorMap: { [key: string]: string } = {
  Processing: '#FFA500',
  Rejected: '#FF0000',
  Reviewing: '#FFD700',
  Approved: '#008000',
  Canceled: '#808080',
  Finalized: '#4B0082',
};

const statusLabelMap: { [key: string]: string } = {
  Processing: 'Đang xử lý',
  Rejected: 'Bị từ chối',
  Reviewing: 'Chờ xác nhận quản lý',
  Approved: 'Đã xác nhận',
  Canceled: 'Đã đóng',
  Finalized: 'Đã hoàn thành',
};

const getStatusStyle = (status: string | null) => {
  return status ? statusColorMap[status] || 'text-gray-500' : 'text-gray-500';
};

const getStatusLabel = (status: string | null) => {
  return status ? statusLabelMap[status] || 'Không xác định' : 'Không xác định';
};

const FinalInfoTable: React.FC<FinalInfoTableProps> = ({
  detailedQuoteData,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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
        {detailedQuoteData.map((item, index) => (
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
                className={`inline-flex items-center px-3 py-1 rounded-full text-white`}
                style={{ backgroundColor: getStatusStyle(item.Status) }}
              >
                {getStatusLabel(item.Status)}
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
                      to={`/final-quotation-detail-manager/${item.Id}`}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FinalInfoTable;
