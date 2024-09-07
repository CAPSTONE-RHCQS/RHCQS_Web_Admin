import React, { useState } from 'react';
import AllocationModal from './Modals/AllocationModal';
import ApprovalModal from './Modals/ApprovalModal';
import CheckboxTwo from './Checkboxes/CheckboxTwo';
import SortIcon from './Buttonicons/SortIcon';

type Employee = {
  avatar: string;
  name: string;
  phone: string;
  position: string;
  email: string;
  birthYear: number;
};

type DataItem = {
  [key: string]: any;
};

type SortKey = string;

interface QuoteManagerTableProps {
  data: DataItem[];
  columns: { key: string; label: string }[];
  isAllChecked: boolean;
  handleSelectAll: () => void;
  handleCheckboxChange: (index: number) => void;
  handleSort: (key: SortKey) => void;
  handleDelete: (id: string) => void;
}

const sampleEmployees: Employee[] = [
  {
    avatar: 'https://via.placeholder.com/150',
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    position: 'Developer',
    email: 'a.nguyen@example.com',
    birthYear: 1990,
  },
  {
    avatar: 'https://via.placeholder.com/150',
    name: 'Trần Thị B',
    phone: '0987654321',
    position: 'Designer',
    email: 'b.tran@example.com',
    birthYear: 1992,
  },
  {
    avatar: 'https://via.placeholder.com/150',
    name: 'Lê Văn C',
    phone: '0123987654',
    position: 'Manager',
    email: 'c.le@example.com',
    birthYear: 1985,
  },
  // Thêm các nhân viên khác nếu cần
];

const QuoteManagerTable: React.FC<QuoteManagerTableProps> = ({
  data,
  columns,
  isAllChecked,
  handleSelectAll,
  handleCheckboxChange,
  handleSort,
  handleDelete,
}) => {
  const [isAllocationModalOpen, setAllocationModalOpen] = useState(false);
  const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);

  const handleAllocationClick = () => {
    setAllocationModalOpen(true);
  };

  const handleApprovalClick = () => setApprovalModalOpen(true);

  const handleConfirmAllocation = (employee: Employee, note: string) => {
    console.log('Phân bổ nhân viên:', employee, 'Ghi chú:', note);
  };

  return (
    <>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
              <CheckboxTwo
                id="select-all"
                isChecked={isAllChecked}
                onChange={handleSelectAll}
              />
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
              >
                {column.label}
                <SortIcon onClick={() => handleSort(column.key)} />
              </th>
            ))}
            <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <CheckboxTwo
                  id={`checkbox-${index}`}
                  isChecked={item.isChecked}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                >
                  {column.key === 'status' ? (
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        item[column.key] === 'Hoàn thành'
                          ? 'bg-success text-success'
                          : item[column.key] === 'Chờ xác nhận'
                          ? 'bg-warning text-warning'
                          : item[column.key] === 'Đang xử lý'
                          ? 'bg-info text-info'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {item[column.key]}
                    </p>
                  ) : column.key === 'contractValue' ? (
                    <p className="text-black dark:text-white">
                      {item[column.key].toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </p>
                  ) : (
                    <p className="text-black dark:text-white">
                      {item[column.key]}
                    </p>
                  )}
                </td>
              ))}
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <div className="flex items-center space-x-3.5">
                  {item.status === 'Đang xử lý' && (
                    <button
                      onClick={handleAllocationClick}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition whitespace-nowrap"
                    >
                      Phân bổ
                    </button>
                  )}
                  {item.status === 'Chờ xác nhận' && (
                    <button
                      onClick={handleApprovalClick}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition whitespace-nowrap"
                    >
                      Phê duyệt
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AllocationModal
        isOpen={isAllocationModalOpen}
        onClose={() => setAllocationModalOpen(false)}
        employees={sampleEmployees}
        onConfirm={handleConfirmAllocation}
      />
      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
      />
    </>
  );
};

export default QuoteManagerTable;
