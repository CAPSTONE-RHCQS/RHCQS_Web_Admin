import React from 'react';

import {
  FaPhone,
  FaPaintBrush,
  FaBuilding,
  FaCogs,
  FaDollarSign,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

interface EmployeeCardProps {
  avatar: string | null;
  name: string;
  roles: string[];
  phone: string | null;
  onSelect: () => void;
  isSelected: boolean;
}

const roleIcons: { [key: string]: IconType } = {
  SalesStaff: FaDollarSign,
  DesignStaff: FaPaintBrush,
  Manager: FaBuilding,
  Customer: FaCogs,
};

const formatPhoneNumber = (phone: string | null) => {
  if (!phone) {
    return '';
  }
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');
};

const truncateName = (name: string, maxLength: number) => {
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  avatar,
  name,
  roles,
  phone,
  onSelect,
  isSelected,
}) => {
  const roleArray = Array.isArray(roles) ? roles : [];

  return (
    <div
      className={`flex flex-col items-center p-6 border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${
        isSelected ? 'bg-customerCard100 border-customerCard500' : 'bg-white'
      } hover:shadow-lg hover:bg-customerCard50`}
      onClick={onSelect}
    >
      <div className="relative w-20 h-20 mb-4">
        <img
          src={
            avatar || 'https://png.pngtree.com/png-clipart/20240316/original/pngtree-avatar-cartoon-in-flat-style-png-image_14608459.png'
          }
          alt={name}
          className="w-full h-full rounded-full border-2 border-customerCard500"
        />
        <div className="absolute bottom-0 right-0 flex items-center justify-center bg-customerCard500 rounded-full p-1 border border-white">
          {roleArray.map((roleName) => {
            const Icon = roleIcons[roleName];
            return (
              Icon && (
                <Icon
                  key={roleName}
                  className="text-sm text-white hover:text-teal-700"
                />
              )
            );
          })}
        </div>
      </div>
      <h4 className="text-base font-semibold text-gray-800 mb-2">
        {truncateName(name, 11)}
      </h4>
      <div className="text-left w-full">
        {phone && (
          <p className="text-sm text-graydark flex items-center">
            <FaPhone className="mr-1 text-customerCard500" />{' '}
            {formatPhoneNumber(phone)}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
