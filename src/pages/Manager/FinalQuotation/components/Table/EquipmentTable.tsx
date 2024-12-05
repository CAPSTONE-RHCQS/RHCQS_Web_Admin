import React from 'react';
import { EquipmentItem } from '../../../../../types/FinalQuotationTypes';

interface EquipmentTableProps {
  items: EquipmentItem[];
}

const EquipmentTable: React.FC<EquipmentTableProps> = ({ items }) => {
  const totalMaterialCost = items.reduce(
    (total, item) => total + item.TotalOfMaterial,
    0,
  );

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
              <td className="px-4 py-2 border text-left">{item.Name}</td>
              <td className="px-4 py-2 border text-center">{item.Unit}</td>
              <td className="px-4 py-2 border text-center">{item.Quantity}</td>
              <td className="px-4 py-2 border text-center">
                {item.UnitOfMaterial.toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">
                {item.TotalOfMaterial.toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">
                {item.Note || ''}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={4} className="px-4 py-2 border text-center font-bold">
              Tổng cộng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalMaterialCost.toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
