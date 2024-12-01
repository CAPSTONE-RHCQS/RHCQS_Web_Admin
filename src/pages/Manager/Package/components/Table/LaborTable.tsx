import React from 'react';
import { PackageLabor } from '../../../../../types/PackagesTypes';

interface LaborTableProps {
  labors: PackageLabor[];
}

const LaborTable: React.FC<LaborTableProps> = ({ labors }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-teal-100">
        <tr>
          <th className="py-3 px-4 text-left">Tên nhân công</th>
          <th className="py-3 px-4 text-left">Loại</th>
          <th className="py-3 px-4 text-left">Giá</th>
          <th className="py-3 px-4 text-left">Ngày thêm</th>
        </tr>
      </thead>
      <tbody>
        {labors.map((labor) => (
          <tr
            key={labor.Id}
            className="border-b hover:bg-gray-100 transition duration-300"
          >
            <td className="py-3 px-4">{labor.NameOfLabor}</td>
            <td className="py-3 px-4">{labor.Type}</td>
            <td className="py-3 px-4">{labor.Price.toLocaleString()} VND</td>
            <td className="py-3 px-4">
              {new Date(labor.InsDate).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LaborTable;
