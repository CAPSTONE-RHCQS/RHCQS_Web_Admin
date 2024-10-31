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
            <th className="px-4 py-2 border text-center">Tên công trình</th>
            <th className="px-4 py-2 border text-center">Loại</th>
            <th className="px-4 py-2 border text-center">Hệ số</th>
            <th className="px-4 py-2 border text-center">Ngày tạo</th>
            <th className="px-4 py-2 border text-center">Tên hạng mục</th>
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
            <React.Fragment key={item.Id}>
              <tr>
                <td
                  className="px-4 py-2 border text-center"
                  rowSpan={item.QuotationItems.length + 1}
                >
                  {item.ContructionName}
                </td>
                <td
                  className="px-4 py-2 border text-center"
                  rowSpan={item.QuotationItems.length + 1}
                >
                  {item.Type}
                </td>
                <td
                  className="px-4 py-2 border text-center"
                  rowSpan={item.QuotationItems.length + 1}
                >
                  {item.Coefficient}
                </td>
                <td
                  className="px-4 py-2 border text-center"
                  rowSpan={item.QuotationItems.length + 1}
                >
                  {item.InsDate || 'null'}
                </td>
              </tr>
              {item.QuotationItems.map((quotationItem) => (
                <tr key={quotationItem.Id}>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.Name}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.Unit}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.Weight}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.UnitPriceLabor?.toLocaleString() || 'null'}{' '}
                    VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.UnitPriceRough?.toLocaleString() || 'null'}{' '}
                    VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceLabor?.toLocaleString() || 'null'}{' '}
                    VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceRough?.toLocaleString() || 'null'}{' '}
                    VNĐ
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinalQuotationTable;
