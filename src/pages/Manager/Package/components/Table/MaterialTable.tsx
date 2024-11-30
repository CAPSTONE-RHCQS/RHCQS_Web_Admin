import React from 'react';
import { PackageMaterial } from '../../../../../types/PackagesTypes';
interface MaterialTableProps {
  materials: PackageMaterial[];
}

const MaterialTable: React.FC<MaterialTableProps> = ({ materials }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-teal-100">
        <tr>
          <th className="py-3 px-4 text-left">Tên vật liệu</th>
          <th className="py-3 px-4 text-left">Loại</th>
          <th className="py-3 px-4 text-left">Giá</th>
          <th className="py-3 px-4 text-left">Đơn vị</th>
          <th className="py-3 px-4 text-left">Mô tả</th>
        </tr>
      </thead>
      <tbody>
        {materials.map((material) => (
          <tr
            key={material.Id}
            className="border-b hover:bg-gray-100 transition duration-300"
          >
            <td className="py-3 px-4">{material.MaterialName}</td>
            <td className="py-3 px-4">{material.Type}</td>
            <td className="py-3 px-4">{material.Price.toLocaleString()} VND</td>
            <td className="py-3 px-4">{material.Unit}</td>
            <td className="py-3 px-4">
              {material.Description || 'Không có mô tả'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MaterialTable;
