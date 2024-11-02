import React from 'react';
import { EquipmentItem } from '../../../../types/FinalQuotationTypes';

interface EquipmentTableProps {
  items: EquipmentItem[];
}

const EquipmentTable: React.FC<EquipmentTableProps> = ({ items }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Tên thiết bị</th>
            <th className="px-4 py-2 border text-center">Đơn vị</th>
            <th className="px-4 py-2 border text-center">Số lượng</th>
            <th className="px-4 py-2 border text-center">Đơn giá</th>
            <th className="px-4 py-2 border text-center">Tổng giá</th>
            <th className="px-4 py-2 border text-center">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.Id}>
              <td className="px-4 py-2 border text-center">{item.Name}</td>
              <td className="px-4 py-2 border text-center">{item.Unit}</td>
              <td className="px-4 py-2 border text-center">{item.Quantity}</td>
              <td className="px-4 py-2 border text-center">
                {item.UnitOfMaterial.toLocaleString()} VNĐ
              </td>
              <td className="px-4 py-2 border text-center">
                {item.TotalOfMaterial.toLocaleString()} VNĐ
              </td>
              <td className="px-4 py-2 border text-center">
                {item.Note || 'null'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
