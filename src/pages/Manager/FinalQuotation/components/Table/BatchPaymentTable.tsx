import React from 'react';
import { BatchPaymentInfo } from '../../../../../types/FinalQuotationTypes';

interface BatchPaymentTableProps {
  payments: BatchPaymentInfo[];
}

const BatchPaymentTable: React.FC<BatchPaymentTableProps> = ({ payments }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Mô tả</th>
            <th className="px-4 py-2 border text-center">Phần trăm</th>
            <th className="px-4 py-2 border text-center">Giá</th>
            <th className="px-4 py-2 border text-center">Đơn vị</th>
            <th className="px-4 py-2 border text-center">Ngày thanh toán</th>
            <th className="px-4 py-2 border text-center">
              Giai đoạn thanh toán
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.Id}>
              <td className="px-4 py-2 border text-center">
                {payment.Description}
              </td>
              <td className="px-4 py-2 border text-center">
                {payment.Percents}
              </td>
              <td className="px-4 py-2 border text-center">
                {payment.Price.toLocaleString()} {payment.Unit}
              </td>
              <td className="px-4 py-2 border text-center">{payment.Unit}</td>
              <td className="px-4 py-2 border text-center">
                {new Date(payment.PaymentDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border text-center">
                {new Date(payment.PaymentPhase).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BatchPaymentTable;
