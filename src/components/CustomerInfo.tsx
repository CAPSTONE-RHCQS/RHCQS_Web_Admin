import React from 'react';
import { FaUser, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

const CustomerInfo = ({ accountName, projectAddress, totalPrice }) => (
  <div>
    <div className="mb-2 text-lg flex items-center">
      <FaUser className="mr-2" />
      <span className="font-semibold">Tên khách hàng:</span>
      <span className="text-gray-700 ml-2">{accountName}</span>
    </div>
    <div className="mb-2 text-lg flex items-center">
      <FaMapMarkerAlt className="mr-2" />
      <span className="font-semibold">Địa chỉ thi công:</span>
      <span className="text-gray-700 ml-2">{projectAddress}</span>
    </div>
    <div className="mb-2 text-lg flex items-center">
      <FaMoneyBillWave className="mr-2" />
      <span className="font-semibold">Tổng chi phí:</span>
      <span className="text-gray-700 ml-2">{totalPrice.toLocaleString()} VNĐ</span>
    </div>
  </div>
);

export default CustomerInfo; 