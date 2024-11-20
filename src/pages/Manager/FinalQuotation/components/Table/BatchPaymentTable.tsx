import React from 'react';
import { BatchPaymentInfo } from '../../../../../types/FinalQuotationTypes';

interface BatchPaymentTableProps {
  payments: BatchPaymentInfo[];
}

const BatchPaymentTable: React.FC<BatchPaymentTableProps> = ({ payments }) => {
  const totalPercents = payments.reduce(
    (total, payment) => total + Number(payment.Percents || 0),
    0,
  );
  const totalPrice = payments.reduce(
    (total, payment) => total + Number(payment.Price || 0),
    0,
  );

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
            <tr key={payment.PaymentId}>
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
          <tr className="bg-gray-200">
            <td className="px-4 py-2 border text-center font-bold">
              Tổng cộng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalPercents}%
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalPrice.toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center"></td>
            <td className="px-4 py-2 border text-center"></td>
            <td className="px-4 py-2 border text-center"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BatchPaymentTable;
