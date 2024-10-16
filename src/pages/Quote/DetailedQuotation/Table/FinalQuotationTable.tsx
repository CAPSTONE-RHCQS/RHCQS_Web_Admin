import React from 'react';
import { FinalQuotationItem } from '../../../../types/QuotationTypes';

interface FinalQuotationTableProps {
  items: FinalQuotationItem[];
}

const FinalQuotationTable: React.FC<FinalQuotationTableProps> = ({ items }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Tên hạng mục</th>
            <th className="px-4 py-2 border text-center">Loại</th>
            <th className="px-4 py-2 border text-center">Đơn vị</th>
            <th className="px-4 py-2 border text-center">Khối lượng</th>
            <th className="px-4 py-2 border text-center">Đơn giá nhân công</th>
            <th className="px-4 py-2 border text-center">Đơn giá vật tư thô</th>
            <th className="px-4 py-2 border text-center">Tổng giá nhân công</th>
            <th className="px-4 py-2 border text-center">
              Tổng giá vật tư thô
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.Id}>
              <td className="px-4 py-2 border text-center">{item.Name}</td>
              <td className="px-4 py-2 border text-center">{item.Type}</td>
              <td className="px-4 py-2 border text-center">{item.Unit}</td>
              <td className="px-4 py-2 border text-center">{item.Weight}</td>
              <td className="px-4 py-2 border text-center">
                {item.UnitPriceLabor?.toLocaleString() || 'N/A'} VNĐ
              </td>
              <td className="px-4 py-2 border text-center">
                {item.UnitPriceRough?.toLocaleString() || 'N/A'} VNĐ
              </td>
              <td className="px-4 py-2 border text-center">
                {item.TotalPriceLabor?.toLocaleString() || 'N/A'} VNĐ
              </td>
              <td className="px-4 py-2 border text-center">
                {item.TotalPriceRough?.toLocaleString() || 'N/A'} VNĐ
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinalQuotationTable;
