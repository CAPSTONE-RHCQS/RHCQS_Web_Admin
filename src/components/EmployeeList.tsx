import React, { useState } from 'react';
import EmployeeCard from './EmployeeCard';
import AllocationModal from './Modals/AllocationModal';

type Employee = {
  avatar: string;
  name: string;
  phone: string;
  position: string;
  email: string;
  birthYear: number;
};

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

const EmployeeList: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {sampleEmployees.map((employee, index) => (
        <EmployeeCard
          key={index}
          employee={employee}
          onSelect={() => handleSelect(employee)}
          isSelected={selectedEmployee?.name === employee.name}
        />
      ))}
      {selectedEmployee && (
        <AllocationModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          employees={sampleEmployees}
          onConfirm={(employee, note) => {
            console.log('Phân bổ nhân viên:', employee, 'Ghi chú:', note);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeList;
