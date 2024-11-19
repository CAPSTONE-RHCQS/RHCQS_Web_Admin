import React from 'react';
import { FinalQuotationItem } from '../../../../../types/FinalQuotationTypes';

interface FinalQuotationTableProps {
  items: FinalQuotationItem[];
}

const FinalQuotationTable: React.FC<FinalQuotationTableProps> = ({ items }) => {
  const totalLaborCost = items.reduce((total, item) => {
    return (
      total +
      item.QuotationItems.reduce(
        (subTotal, qItem) => subTotal + (qItem.TotalPriceLabor || 0),
        0
      )
    );
  }, 0);

  const totalRoughCost = items.reduce((total, item) => {
    return (
      total +
      item.QuotationItems.reduce(
        (subTotal, qItem) => subTotal + (qItem.TotalPriceRough || 0),
        0
      )
    );
  }, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Tên công trình</th>
            <th className="px-4 py-2 border text-center">Tên hạng mục</th>
            <th className="px-4 py-2 border text-center">Đơn vị</th>
            <th className="px-4 py-2 border text-center">Số lượng</th>
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
                    {quotationItem.UnitPriceLabor
                      ? `${quotationItem.UnitPriceLabor.toLocaleString()} VNĐ`
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.UnitPriceRough
                      ? `${quotationItem.UnitPriceRough.toLocaleString()} VNĐ`
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceLabor
                      ? `${quotationItem.TotalPriceLabor.toLocaleString()} VNĐ`
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceRough
                      ? `${quotationItem.TotalPriceRough.toLocaleString()} VNĐ`
                      : ''}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={6} className="px-4 py-2 border text-center font-bold">
              Tổng cộng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalLaborCost.toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalRoughCost.toLocaleString()} VNĐ
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinalQuotationTable;
