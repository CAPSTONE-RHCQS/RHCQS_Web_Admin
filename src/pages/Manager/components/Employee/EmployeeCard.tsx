import React from 'react';

import {
  FaMapMarkerAlt,
  FaPhone,
  FaPaintBrush,
  FaBuilding,
  FaCogs,
  FaWater,
  FaDollarSign,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

interface EmployeeCardProps {
  avatar: string;
  name: string;
  roles: string[];
  address: string;
  phone: string;
  onSelect: () => void;
  isSelected: boolean;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('');
};

const roleIcons: { [key: string]: IconType } = {
  'Thiết kế phối cảnh': FaPaintBrush,
  'Thiết kế kiến trúc': FaBuilding,
  'Thiết kế kết cấu': FaCogs,
  'Thiết kế điện & nước': FaWater,
  'Nhân viên báo giá': FaDollarSign,
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  avatar,
  name,
  roles,
  address,
  phone,
  onSelect,
  isSelected,
}) => {
  return (
    <div
      className={`flex flex-col items-center p-6 border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${
        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white'
      }`}
      onClick={onSelect}
    >
      {avatar ? (
        <img src={avatar} alt={name} className="w-20 h-20 rounded-full mb-4" />
      ) : (
        <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center bg-blue-500 text-white text-2xl">
          {getInitials(name)}
        </div>
      )}
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{name}</h4>
      <div className="text-left w-full">
        <div className="flex justify-center mb-2">
          {Object.keys(roleIcons).map((role) => {
            const Icon = roleIcons[role];
            return (
              <Icon
                key={role}
                className={`mx-1 text-2xl ${
                  roles.includes(role) ? 'text-blue-500' : 'text-gray-300'
                }`}
              />
            );
          })}
        </div>
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <FaMapMarkerAlt className="mr-2" /> {address}
        </p>
        <p className="text-sm text-gray-600 flex items-center">
          <FaPhone className="mr-2" /> {phone}
        </p>
      </div>
    </div>
  );
};

export default EmployeeCard;
