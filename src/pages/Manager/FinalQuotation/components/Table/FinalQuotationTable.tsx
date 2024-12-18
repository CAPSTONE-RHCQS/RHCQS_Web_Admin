import React from 'react';
import { FinalQuotationItem } from '../../../../../types/FinalQuotationTypes';

interface FinalQuotationTableProps {
  items: FinalQuotationItem[];
  projectType: string;
}

const FinalQuotationTable: React.FC<FinalQuotationTableProps> = ({
  items,
  projectType,
}) => {
  const calculateTotalsByType = () => {
    let totalLaborRough = 0;
    let totalRough = 0;
    let totalLaborFinished = 0;
    let totalFinished = 0;

    items.forEach((item) => {
      item.QuotationItems.forEach((qItem) => {
        if (item.Type === 'WORK_ROUGH') {
          totalLaborRough += qItem.TotalPriceLabor || 0;
        } else if (item.Type === 'WORK_FINISHED') {
          totalLaborFinished += qItem.TotalPriceLabor || 0;
        }

        totalRough += qItem.TotalPriceRough || 0;
        totalFinished += qItem.TotalPriceFinished || 0;
      });
    });

    return { totalLaborRough, totalRough, totalLaborFinished, totalFinished };
  };

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

  const totalsByType = calculateTotalsByType();

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
              Vật tư Thô
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
            <td colSpan={6} className="px-4 py-2 border text-center font-bold">
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

      <h3 className="text-lg font-bold mt-4 text-primary">
        GIÁ TRỊ BÁO GIÁ CHI TIẾT XÂY DỰNG:
      </h3>
      <table className="min-w-full bg-white border border-gray-200 mt-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center"></th>
            <th className="px-4 py-2 border text-center">Tổng giá nhân công</th>
            <th className="px-4 py-2 border text-center">+</th>
            <th className="px-4 py-2 border text-center">Tổng giá vật tư</th>
            <th className="px-4 py-2 border text-center">=</th>
            <th className="px-4 py-2 border text-center">Tổng giá trị</th>
            <th className="px-4 py-2 border text-center">Đơn vị</th>
          </tr>
        </thead>
        <tbody>
          {projectType !== 'FINISHED' && (
            <tr>
              <td className="px-4 py-2 border text-left font-bold text-primary">
                Phần Thô
              </td>
              <td className="px-4 py-2 border text-center">
                {totalsByType.totalLaborRough.toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">+</td>
              <td className="px-4 py-2 border text-center">
                {totalsByType.totalRough.toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">=</td>
              <td className="px-4 py-2 border text-center font-bold">
                {(
                  totalsByType.totalLaborRough + totalsByType.totalRough
                ).toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
          )}
          {projectType !== 'ROUGH' && (
            <tr>
              <td className="px-4 py-2 border text-left font-bold text-primary">
                Phần Hoàn thiện
              </td>
              <td className="px-4 py-2 border text-center">
                {totalsByType.totalLaborFinished.toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">+</td>
              <td className="px-4 py-2 border text-center">
                {totalsByType.totalFinished.toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">=</td>
              <td className="px-4 py-2 border text-center font-bold">
                {(
                  totalsByType.totalLaborFinished + totalsByType.totalFinished
                ).toLocaleString()}
              </td>
              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
          )}
          <tr className="bg-gray-200">
            <td className="px-4 py-2 border text-center font-bold" colSpan={5}>
              Tổng giá trị xây dựng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {(
                totalsByType.totalLaborRough +
                totalsByType.totalRough +
                totalsByType.totalLaborFinished +
                totalsByType.totalFinished
              ).toLocaleString()}
            </td>
            <td className="px-4 py-2 border text-center font-bold">VNĐ</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinalQuotationTable;
