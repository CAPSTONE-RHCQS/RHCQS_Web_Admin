import React, { useState, useEffect, useRef } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import {
  FaCheckCircle,
  FaBan,
  FaFileContract,
  FaSpinner,
} from 'react-icons/fa';
import { ContractInfo } from '../../../../../types/ProjectTypes';
import { Link } from 'react-router-dom';

interface ContractTableProps {
  contractData: ContractInfo[];
}

const statusColorMap: { [key: string]: string } = {
  Processing: '#FFA500',
  Completed: '#32CD32',
  Ended: '#EF5350',
  Finished: '#5BABAC',
};

const statusLabelMap: { [key: string]: { label: string; icon: JSX.Element } } =
  {
    Processing: { label: 'Đang xử lý', icon: <FaSpinner /> },
    Completed: { label: 'Hoàn thành', icon: <FaCheckCircle /> },
    Finished: { label: 'Đã thanh toán', icon: <FaFileContract /> },
    Ended: { label: 'Chấm dứt hợp đồng', icon: <FaBan /> },
  };

const getStatusInfo = (status: string | null) => {
  if (!status) {
    return { style: 'text-gray-500', label: 'Không xác định', icon: null };
  }

  const color = statusColorMap[status] || 'text-gray-500';
  const labelInfo = statusLabelMap[status] || {
    label: 'Không xác định',
    icon: null,
  };

  return { style: color, label: labelInfo.label, icon: labelInfo.icon };
};

const ContractTable: React.FC<ContractTableProps> = ({ contractData }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleRowMenu = (id: number) => {
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
            Loại hợp đồng
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
        {contractData.map((item, index) => {
          const { style, label, icon } = getStatusInfo(item.Status);
          return (
            <tr key={index}>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {index + 1}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {item.Name}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-white whitespace-nowrap"
                  style={{ backgroundColor: style }}
                >
                  {icon} <span className="ml-2">{label} </span>
                </span>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {item.Note ?? ''}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                <FiMoreVertical
                  className="cursor-pointer"
                  onClick={() => toggleRowMenu(index)}
                />
                {activeMenu === index && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    <div className="py-2">
                      <Link
                        to={`/contract-detail-manager/${item.Id}`}
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

export default ContractTable;
