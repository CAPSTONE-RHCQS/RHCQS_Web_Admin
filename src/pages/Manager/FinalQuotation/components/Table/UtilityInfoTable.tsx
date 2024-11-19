import React from 'react';
import { UtilityInfo } from '../../../../../types/FinalQuotationTypes';

interface UtilityInfoTableProps {
  utilities: UtilityInfo[];
}

const UtilityInfoTable: React.FC<UtilityInfoTableProps> = ({ utilities }) => {
  const totalPrice = utilities.reduce((total, util) => total + util.Price, 0);

  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Tên</th>
            <th className="px-4 py-2 border text-center">Hệ số</th>
            <th className="px-4 py-2 border text-center">Giá</th>
          </tr>
        </thead>
        <tbody>
          {utilities.map((util) => (
            <tr key={util.Id}>
              <td className="px-4 py-2 border text-left">{util.Name}</td>
              <td className="px-4 py-2 border text-center">
                {util.Coefficient}
              </td>
              <td className="px-4 py-2 border text-center">{util.Price}</td>
            </tr>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={2} className="px-4 py-2 border text-center font-bold">
              Tổng cộng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalPrice.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UtilityInfoTable;
