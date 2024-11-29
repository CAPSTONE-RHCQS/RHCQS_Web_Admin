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
        0,
      )
    );
  }, 0);

  const totalRoughCost = items.reduce((total, item) => {
    return (
      total +
      item.QuotationItems.reduce(
        (subTotal, qItem) => subTotal + (qItem.TotalPriceRough || 0),
        0,
      )
    );
  }, 0);

  const totalConstructionValue = totalLaborCost + totalRoughCost;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center">Tên hạng mục</th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '75px' }}
            >
              Đơn vị
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '75px' }}
            >
              Số lượng
            </th>
            <th
              className="px-2 py-2 border text-center"
              style={{ maxWidth: '80px' }}
            >
              Đơn giá nhân công
            </th>
            <th
              className="px-2 py-2 border text-center"
              style={{ maxWidth: '80px' }}
            >
              Đơn giá vật tư thô
            </th>
            <th
              className="px-2 py-2 border text-center"
              style={{ maxWidth: '80px' }}
            >
              Tổng giá nhân công
            </th>
            <th
              className="px-2 py-2 border text-center"
              style={{ maxWidth: '80px' }}
            >
              Tổng giá vật tư
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <React.Fragment key={item.Id}>
              <tr>
                <td
                  className="px-4 py-2 border text-left font-bold relative"
                  colSpan={7}
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
                      ? `${quotationItem.UnitPriceLabor.toLocaleString()} `
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.UnitPriceRough
                      ? `${quotationItem.UnitPriceRough.toLocaleString()} `
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceLabor
                      ? `${quotationItem.TotalPriceLabor.toLocaleString()} `
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceRough
                      ? `${quotationItem.TotalPriceRough.toLocaleString()} `
                      : ''}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={5} className="px-4 py-2 border text-center font-bold">
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

      <h3 className="text-lg font-bold mt-4">
        GIÁ TRỊ BÁO GIÁ CHI TIẾT XÂY DỰNG TRƯỚC THUẾ:
      </h3>
      <table className="min-w-full bg-white border border-gray-200 mt-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center">Tổng giá nhân công</th>
            <th className="px-4 py-2 border text-center">
              Tổng giá vật tư thô
            </th>
            <th className="px-4 py-2 border text-center">+</th>
            <th className="px-4 py-2 border text-center">
              Tổng giá trị xây dựng
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border text-center">
              {totalLaborCost.toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center">
              {totalRoughCost.toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center">+</td>
            <td className="px-4 py-2 border text-center">
              {totalConstructionValue.toLocaleString()} VNĐ
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinalQuotationTable;
