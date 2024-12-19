import React from 'react';
import SalesStaffIcon from '../../SVG/RoleIcon/SalesStaffIcon';
import DesignStaffIcon from '../../SVG/RoleIcon/DesignStaffIcon';
import CustomerIcon from '../../SVG/RoleIcon/CustomerIcon';

interface CardDataStatsCombinedProps {
  saleStaff: number;
  designerStaff: number;
  customer: number;
}

const CardDataStatsCombined: React.FC<CardDataStatsCombinedProps> = ({
  saleStaff,
  designerStaff,
  customer,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-3 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mt-4">
        <h4 className="text-title-md font-bold text-black dark:text-white"></h4>
        <div className="mt-2 flex items-center">
          <SalesStaffIcon
            className="mr-2 fill-primary dark:fill-white"
            width="30"
            height="30"
          />
          <span className="ml-2 text-lg font-medium">
            {saleStaff} nhân viên báo giá
          </span>
        </div>
        <div className="mt-2 flex items-center">
          <DesignStaffIcon
            className="mr-2 fill-primary dark:fill-white"
            width="30"
            height="30"
          />
          <span className="ml-2 text-lg font-medium">
            {designerStaff} nhân viên thiết kế
          </span>
        </div>
        <div className="mt-2 flex items-center">
          <CustomerIcon
            className="mr-2 fill-primary dark:fill-white"
            width="30"
            height="30"
          />
          <span className="ml-2 text-lg font-medium">
            {customer} khách hàng
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardDataStatsCombined;
