import React, { useState } from 'react';
import EmployeeAllocationDialog from '../../../Manager/components/Employee/EmployeeAllocationDialog';
import { designEmployees } from '../../../../types/Employee';

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
  Reviewing: 'Đang chờ phản hồi',
  Approved: 'Quản lý đã xác nhận',
  Accepted: 'Khách hàng đã xác nhận',
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
  const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedDesignEmployees, setSelectedDesignEmployees] = useState<{
    [key: string]: string[];
  }>({
    'Thiết kế phối cảnh': [],
    'Thiết kế kiến trúc': [],
    'Thiết kế kết cấu': [],
    'Thiết kế điện & nước': [],
  });
  const [notes, setNotes] = useState<string>('');
  const [currentDrawing, setCurrentDrawing] = useState<string>('');

  const handleConfirmAllocation = () => {
    console.log('Design Employees allocated:', selectedDesignEmployees);
    console.log('Notes:', notes);
    setApprovalModalOpen(false);
  };

  const handleSelectDesignEmployee = (role: string, name: string) => {
    setSelectedDesignEmployees((prev) => ({
      ...prev,
      [role]: prev[role].includes(name)
        ? prev[role].filter((employee) => employee !== name)
        : [...prev[role], name],
    }));
  };

  const openAllocationDialog = (drawing: string) => {
    setCurrentDrawing(drawing);
    setApprovalModalOpen(true);
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
                  className={`inline-flex items-center px-3 py-1 rounded-full text-white`}
                  style={{ backgroundColor: getStatusStyle(item.Status) }}
                >
                  {getStatusLabel(item.Status)}
                </span>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <button
                  className="text-primaryGreenButton hover:text-secondaryGreenButton"
                  onClick={() => openAllocationDialog(item.Id)}
                >
                  Phân công
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EmployeeAllocationDialog
        isOpen={isApprovalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        handleConfirmAllocation={handleConfirmAllocation}
        designEmployees={designEmployees}
        selectedDesignEmployees={selectedDesignEmployees}
        handleSelectDesignEmployee={handleSelectDesignEmployee}
        notes={notes}
        setNotes={setNotes}
        currentDrawing={currentDrawing}
      />
    </>
  );
};

export default HouseDesignDrawingInfoTable;
