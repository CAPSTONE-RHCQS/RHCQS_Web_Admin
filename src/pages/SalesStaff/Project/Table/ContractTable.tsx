import React, { useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

interface ContractTableProps {
  contractData: {
    Name: string;
    Status: string;
    Note: string;
  }[];
}

const ContractTable: React.FC<ContractTableProps> = ({ contractData }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const toggleRowMenu = (id: number) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-2 text-left dark:bg-meta-4">
          <th className="py-4 px-4 font-medium text-black dark:text-white">
            STT
          </th>

          <th className="py-4 px-4 font-medium text-black dark:text-white">
            Loại hợp đồng
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white">
            Người tạo
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white">
            Trạng thái
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white">
            Nội dung
          </th>
          <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
        </tr>
      </thead>
      <tbody>
        {contractData.map((item, index) => (
          <tr key={index}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {index + 1}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.Name}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.creator}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.Status}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {item.Note}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
              <FiMoreVertical
                className="cursor-pointer"
                onClick={() => toggleRowMenu(item.id)}
              />
              {activeMenu === item.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                    >
                      Chỉnh sửa
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                    >
                      Xóa
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                    >
                      Xem chi tiết
                    </a>
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

export default ContractTable;
