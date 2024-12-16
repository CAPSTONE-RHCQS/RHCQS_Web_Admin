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

  const totalFinishedCost = items.reduce((total, item) => {
    return (
      total +
      item.QuotationItems.reduce(
        (subTotal, qItem) => subTotal + (qItem.TotalPriceFinished || 0),
        0,
      )
    );
  }, 0);

  const totalConstructionValue =
    totalLaborCost + totalRoughCost + totalFinishedCost;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center" rowSpan={2}>
              Nội dung công việc
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '75px' }}
              rowSpan={2}
            >
              Đơn vị
            </th>
            <th
              className="px-4 py-2 border text-center"
              style={{ maxWidth: '75px' }}
              rowSpan={2}
            >
              Khối lượng
            </th>
            <th className="px-4 py-2 border text-center" colSpan={3}>
              Đơn giá
            </th>
            <th className="px-4 py-2 border text-center" colSpan={3}>
              Thành tiền
            </th>
            <th className="px-4 py-2 border text-center" rowSpan={2}>
              Ghi chú
            </th>
          </tr>

          <tr>
            <th
              className="px-2 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Nhân công
            </th>
            <th
              className="px-2 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Vật tư thô
            </th>
            <th
              className="px-2 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Vật tư H.T
            </th>
            <th
              className="px-2 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Nhân công
            </th>
            <th
              className="px-2 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Vật tư
            </th>
            <th
              className="px-2 py-2 border text-center"
              style={{ maxWidth: '150px' }}
            >
              Vật tư H.T
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <React.Fragment key={item.Id}>
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-2 border text-left font-bold relative bg-gray-200"
                >
                  {item.ContructionName}
                </td>
              </tr>
              {item.QuotationItems.map((quotationItem) => (
                <tr key={quotationItem.Id}>
                  <td className="px-4 py-2 border text-left font-bold">
                    {quotationItem.WorkName}
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
                    {quotationItem.UnitPriceFinished
                      ? `${quotationItem.UnitPriceFinished.toLocaleString()} `
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
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.TotalPriceFinished
                      ? `${quotationItem.TotalPriceFinished.toLocaleString()} `
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {quotationItem.Note || ''}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={7} className="px-4 py-2 border text-center font-bold">
              Tổng cộng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalLaborCost.toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalRoughCost.toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalFinishedCost.toLocaleString()} VNĐ
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="text-lg font-bold mt-4">
        GIÁ TRỊ BÁO GIÁ CHI TIẾT XÂY DỰNG:
      </h3>
      <table className="min-w-full bg-white border border-gray-200 mt-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center">Tổng giá nhân công</th>
            <th className="px-4 py-2 border text-center">+</th>

            <th className="px-4 py-2 border text-center">
              Tổng giá vật tư thô
            </th>
            <th className="px-4 py-2 border text-center">+</th>
            <th className="px-4 py-2 border text-center">
              Tổng giá vật tư hoàn thiện
            </th>
            <th className="px-4 py-2 border text-center">=</th>
            <th className="px-4 py-2 border text-center">
              Tổng giá trị xây dựng
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border text-center">
              {totalLaborCost.toLocaleString()}
            </td>
            <td className="px-4 py-2 border text-center">+</td>
            <td className="px-4 py-2 border text-center">
              {totalRoughCost.toLocaleString()}
            </td>
            <td className="px-4 py-2 border text-center">+</td>
            <td className="px-4 py-2 border text-center">
              {totalFinishedCost.toLocaleString()}
            </td>
            <td className="px-4 py-2 border text-center">=</td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalConstructionValue.toLocaleString()} VNĐ
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinalQuotationTable;
