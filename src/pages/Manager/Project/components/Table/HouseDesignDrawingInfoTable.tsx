import React from 'react';

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

const statusColorMap: { [key: string]: string } = {
  Processing: '#FFA500',
  Rejected: '#FF0000',
  Updating: '#1E90FF',
  Reviewing: '#FFD700',
  Approved: '#008000',
  Accepted: '#32CD32',
  Canceled: '#808080',
  Finalized: '#4B0082',
};

const statusLabelMap: { [key: string]: string } = {
  Processing: 'Đang xử lý',
  Rejected: 'Bị từ chối',
  Updating: 'Đang chỉnh sửa',
  Reviewing: 'Chờ xác nhận từ quản lý',
  Approved: 'Quản lý đã xác nhận',
  Accepted: 'Đã xác nhận',
  Canceled: 'Đã đóng',
  Finalized: 'Đã hoàn thành',
};

const getStatusStyle = (status: string | null) => {
  return status ? statusColorMap[status] || 'text-gray-500' : 'text-gray-500';
};

const getStatusLabel = (status: string | null) => {
  return status ? statusLabelMap[status] || 'Không xác định' : 'Không xác định';
};

const HouseDesignDrawingInfoTable: React.FC<
  HouseDesignDrawingInfoTableProps
> = ({ designData }) => {
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
                  className={`inline-flex items-center px-3 py-1 rounded-full text-white`}
                  style={{ backgroundColor: getStatusStyle(item.Status) }}
                >
                  {getStatusLabel(item.Status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default HouseDesignDrawingInfoTable;
