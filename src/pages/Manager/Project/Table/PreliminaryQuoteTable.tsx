import React, { useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Quote } from '../../../../types/project';

interface PreliminaryQuoteTableProps {
  quoteData: Quote[];
}

const PreliminaryQuoteTable: React.FC<PreliminaryQuoteTableProps> = ({
  quoteData,
}) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const toggleRowMenu = (id: number) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Đang chờ duyệt':
        return 'text-yellow-500';
      case 'Đã hoàn tất':
        return 'text-green-500';
      case 'Chờ khách hàng phản hồi':
        return 'text-blue-500';
      case 'Từ chối':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
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
            Nội dung
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white">
            Trạng thái
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
        </tr>
      </thead>
      <tbody>
        {quoteData.map((item, index) => (
          <tr key={index}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.id}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.version}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.createdTime}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.creator}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.content}
            </td>
            <td
              className={`border-b border-[#eee] py-5 px-4 dark:border-strokedark ${getStatusStyle(
                item.status,
              )}`}
            >
              {item.status}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
              <FiMoreVertical
                className="cursor-pointer"
                onClick={() => toggleRowMenu(item.id)}
              />
              {activeMenu === item.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <Link
                      to={`/quotedetail/`}
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

export default PreliminaryQuoteTable;
