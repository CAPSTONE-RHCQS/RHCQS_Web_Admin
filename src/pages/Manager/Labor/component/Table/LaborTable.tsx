import React from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import Alert from '../../../../../components/Alert';

import { LaborItem } from '../../../../../types/Labor';

interface LaborTableProps {
  dataLabor: LaborItem[];
  refreshData: () => void;
}

const LaborTable: React.FC<LaborTableProps> = ({
  dataLabor,
  refreshData,
}) => {
  return (
    <>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {['Tên nhân công', 'Giá', 'Ngày tạo', 'Loại', ''].map((header) => (
              <th
                key={header}
                className="py-4 px-4 font-medium text-black dark:text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataLabor.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="cursor-pointer">
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark flex items-center">
                  {item.Name}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.Price}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.InsDate}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.Type}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                  <div className="flex justify-center relative">
                    <PencilIcon className="w-4 h-4 text-primaryGreenButton" />
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* <Alert
        message="Thông báo"
        type="success"
        onClose={() => {}}
      /> */}
    </>
  );
};

export default LaborTable;