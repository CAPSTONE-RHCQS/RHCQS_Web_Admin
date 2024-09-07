import React, { useState } from 'react';
import EmployeeCard from '../EmployeeCard';

interface Employee {
  avatar: string;
  name: string;
  phone: string;
  position: string;
  email: string;
  birthYear: number;
}

interface AllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onConfirm: (employee: Employee, note: string) => void;
}

const AllocationModal: React.FC<AllocationModalProps> = ({ isOpen, onClose, employees, onConfirm }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedEmployee) {
      onConfirm(selectedEmployee, note);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center">Phân bổ nhân viên</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-80 pt-6 mb-6">
          {employees.map((employee, index) => (
            <EmployeeCard
              key={index}
              employee={employee}
              onSelect={() => setSelectedEmployee(employee)}
              isSelected={selectedEmployee?.name === employee.name}
            />
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú"
          className="w-full p-3 border rounded mb-6"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllocationModal;
