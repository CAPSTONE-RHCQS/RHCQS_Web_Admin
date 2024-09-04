import React from 'react';

interface EmployeeCardProps {
  avatar: string;
  name: string;
  location: string;
  email: string;
  phone: string;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  avatar,
  name,
  location,
  email,
  phone,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white relative">
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
        <img
          className="w-16 h-16 rounded-full border-4 border-white"
          src={avatar}
          alt="Avatar"
        />
      </div>
      <div className="pt-10 text-center">
        <div className="text-xl font-bold">{name}</div>
        <div className="text-gray-600">{location}</div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-gray-800">
          <strong>Email:</strong> {email}
        </div>
        <div className="text-gray-800">
          <strong>Phone:</strong> {phone}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
