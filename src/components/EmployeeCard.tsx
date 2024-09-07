import React from 'react';
import { PhoneIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface EmployeeCardProps {
  employee: {
    avatar: string;
    name: string;
    phone: string;
    position: string;
    email: string;
    birthYear: number;
  };
  onSelect: () => void;
  isSelected: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onSelect, isSelected }) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4 cursor-pointer transition-transform transform hover:scale-105 w-full sm:w-72 ${
        isSelected ? 'border-2 border-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      <img
        src={employee.avatar}
        alt={employee.name}
        className="w-24 h-24 rounded-full mb-4"
      />
      <h3 className="text-xl font-bold text-center">{employee.name}</h3>
      <p className="text-gray-500 text-center">{employee.position}</p>
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center space-x-2">
          <PhoneIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm">Số điện thoại:</span>
        </div>
        <p className="text-right text-sm truncate">{employee.phone}</p>
      </div>
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center space-x-2">
          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm">Email:</span>
        </div>
        <p className="text-right text-sm truncate">{employee.email}</p>
      </div>
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm">Sinh nhật:</span>
        </div>
        <p className="text-right text-sm truncate">{employee.birthYear}</p>
      </div>
    </div>
  );
};

export default EmployeeCard;
