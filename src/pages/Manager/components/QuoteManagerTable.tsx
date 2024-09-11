import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import RejectionModal from '../../../components/Modals/RejectionModal';
import CheckboxTwo from '../../../components/Checkboxes/CheckboxTwo';
import SortIcon from '../../../components/Buttonicons/SortIcon';
import EmployeeCard from './EmployeeCard';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from '@material-tailwind/react';
import { quoteEmployees, designEmployees } from '../../../types/Employee';

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

const QuoteManagerTable: React.FC<QuoteManagerTableProps> = ({
  data,
  columns,
  isAllChecked,
  handleSelectAll,
  handleCheckboxChange,
  handleSort,
  handleDelete,
}) => {
  const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedQuoteEmployee, setSelectedQuoteEmployee] = useState<
    string | null
  >(null);
  const [selectedDesignEmployees, setSelectedDesignEmployees] = useState<{
    [key: string]: string[];
  }>({
    'Thiết kế phối cảnh': [],
    'Thiết kế kiến trúc': [],
    'Thiết kế kết cấu': [],
    'Thiết kế điện & nước': [],
  });
  const [notes, setNotes] = useState<string>('');

  const handleApproveClick = () => {
    setApprovalModalOpen(true);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleConfirmAllocation = () => {
    // Logic xử lý phân bổ nhân viên
    console.log('Quote Employee allocated:', selectedQuoteEmployee);
    console.log('Design Employees allocated:', selectedDesignEmployees);
    console.log('Notes:', notes);
    setApprovalModalOpen(false);
  };

  const handleSelectQuoteEmployee = (name: string) => {
    setSelectedQuoteEmployee(name);
  };

  const handleSelectDesignEmployee = (role: string, name: string) => {
    setSelectedDesignEmployees((prev) => ({
      ...prev,
      [role]: prev[role].includes(name)
        ? prev[role].filter((employee) => employee !== name)
        : [...prev[role], name],
    }));
  };

  const handleRejectClick = () => {
    setShowModal(true);
  };

  const handleConfirmReject = (reason: string) => {
    // Logic xử lý từ chối với lý do rejectionReason
    console.log('Rejected with reason:', reason);
    setShowModal(false);
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
                          : item[column.key] === 'Đang tạo hợp đồng'
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
                  {item.status === 'Chờ xác nhận' && (
                    <>
                      <button
                        onClick={handleApproveClick}
                        className="p-2 bg-primaryGreenButton text-white rounded hover:bg-secondaryGreenButton transition"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={handleRejectClick}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog
        open={isApprovalModalOpen}
        handler={setApprovalModalOpen}
        dismiss={{ enabled: true, outsidePress: true }}
      >
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <span>Phân bổ nhân viên</span>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => setApprovalModalOpen(false)}
            >
              <FaTimes />
            </IconButton>
          </div>
        </DialogHeader>
        <DialogBody className="max-h-[80vh] overflow-y-auto">
          {step === 1 && (
            <>
              <h5 className="text-xl font-semibold mb-4">
                Phân bổ nhân viên báo giá
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quoteEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.name}
                    avatar={employee.avatar}
                    name={employee.name}
                    roles={employee.roles}
                    address={employee.address}
                    phone={employee.phone}
                    onSelect={() => handleSelectQuoteEmployee(employee.name)}
                    isSelected={selectedQuoteEmployee === employee.name}
                  />
                ))}
              </div>
              <textarea
                placeholder="Ghi chú"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-4 p-2 border rounded"
              />
              <button
                onClick={handleNextStep}
                className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Tiếp tục
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <h5 className="text-xl font-semibold mb-4">
                Phân bổ nhân viên thiết kế
              </h5>
              <div className="space-y-4">
                {[
                  'Thiết kế phối cảnh',
                  'Thiết kế kiến trúc',
                  'Thiết kế kết cấu',
                  'Thiết kế điện & nước',
                ].map((role) => (
                  <div key={role}>
                    <h6 className="text-lg font-semibold mb-2">{role}</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {designEmployees
                        .filter((employee) => employee.roles.includes(role))
                        .map((employee) => (
                          <EmployeeCard
                            key={employee.name}
                            avatar={employee.avatar}
                            name={employee.name}
                            roles={employee.roles}
                            address={employee.address}
                            phone={employee.phone}
                            onSelect={() =>
                              handleSelectDesignEmployee(role, employee.name)
                            }
                            isSelected={selectedDesignEmployees[role].includes(
                              employee.name,
                            )}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              <textarea
                placeholder="Ghi chú"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-4 p-2 border rounded"
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousStep}
                  className="p-2 bg-primaryGreenButton text-white rounded hover:bg-secondaryGreenButton transition"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleConfirmAllocation}
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Phân bổ
                </button>
              </div>
            </>
          )}
        </DialogBody>
      </Dialog>
      {showModal && (
        <RejectionModal
          title="Xác nhận từ chối"
          message="Bạn có chắc chắn muốn từ chối? Vui lòng nhập lý do từ chối."
          onConfirm={handleConfirmReject}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default QuoteManagerTable;
