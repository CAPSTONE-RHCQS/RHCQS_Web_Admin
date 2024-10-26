import React, { useState, useEffect, useRef } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface InitialInfoTableProps {
  quoteData: {
    Id: string;
    AccountName: string;
    Version: number;
    InsDate: string;
    Status: string;
  }[];
}

const InitialInfoTable: React.FC<InitialInfoTableProps> = ({ quoteData }) => {
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

  const statusColorMap: { [key: string]: string } = {
    Pending: '#FFA500',
    Processing: '#0000FF',
    Reviewing: '#FFD700',
    Approved: '#008000',
    Rejected: '#FF0000',
    Finalized: '#4B0082',
    Canceled: '#808080',
  };

  const statusLabelMap: { [key: string]: string } = {
    Pending: 'Chờ xử lý',
    Processing: 'Đang xử lý',
    Reviewing: 'Chờ xác nhận từ quản lý',
    Approved: 'Đã xác nhận',
    Rejected: 'Từ chối báo giá SB',
    Finalized: 'Đã hoàn thành',
    Canceled: 'Đã đóng',
  };

  const getStatusStyle = (status: string) => {
    return statusColorMap[status] || 'text-gray-500';
  };

  const getStatusLabel = (status: string) => {
    return statusLabelMap[status] || 'Không xác định';
  };

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
        {quoteData.map((item, index) => (
          <tr key={item.Id}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {index + 1}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.Version}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {new Date(item.InsDate).toLocaleString()}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.AccountName}
            </td>
            <td
              className={`border-b border-[#eee] py-5 px-4 dark:border-strokedark`}
            >
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
                      to={`/initial-quotation-detail-manager/${item.Id}`}
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

export default InitialInfoTable;
