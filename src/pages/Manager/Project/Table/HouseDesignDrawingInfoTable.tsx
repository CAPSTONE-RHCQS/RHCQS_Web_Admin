import React, { useState } from 'react';
import EmployeeAllocationDialog from '../../components/Employee/EmployeeAllocationDialog';
import { designEmployees } from '../../../../types/Employee';

interface HouseDesignDrawingInfoTableProps {
  designData: {
    Id: string;
    InsDate: string;
    Status: string;
  }[];
}

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
                {item.Id}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {new Date(item.InsDate).toLocaleString()}
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {item.Status}
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
