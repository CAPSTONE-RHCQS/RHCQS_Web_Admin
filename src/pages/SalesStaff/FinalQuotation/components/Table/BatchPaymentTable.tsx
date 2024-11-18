import React, { useState, useEffect } from 'react';
import { BatchPaymentInfo } from '../../../../../types/FinalQuotationTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface BatchPaymentTableProps {
  payments: BatchPaymentInfo[];
  isEditing: boolean;
  totalPrice: number;
  onPaymentsChange: (updatedPayments: BatchPaymentInfo[]) => void;
}

const BatchPaymentTable: React.FC<BatchPaymentTableProps> = ({
  payments,
  isEditing,
  totalPrice,
  onPaymentsChange,
}) => {
  const [editedPayments, setEditedPayments] = useState(payments);

  useEffect(() => {
    setEditedPayments(payments);
  }, [payments]);

  const handlePercentChange = (index: number, newPercent: number) => {
    const updatedPayments = [...editedPayments];
    updatedPayments[index].Percents = newPercent.toString();
    updatedPayments[index].Price = (newPercent / 100) * totalPrice;
    setEditedPayments(updatedPayments);
    onPaymentsChange(updatedPayments);
  };

  const handleDeletePayment = (index: number) => {
    const updatedPayments = editedPayments.filter((_, i) => i !== index);
    setEditedPayments(updatedPayments);
    onPaymentsChange(updatedPayments);
  };

  const calculateTotalPercents = () => {
    return editedPayments.reduce((total, payment) => total + parseFloat(payment.Percents), 0);
  };

  const calculateTotalPrice = () => {
    return editedPayments.reduce((total, payment) => total + ((parseFloat(payment.Percents) / 100) * totalPrice), 0);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center font-semibold">Mô tả</th>
            <th className="px-4 py-2 border text-center font-semibold">Phần trăm</th>
            <th className="px-4 py-2 border text-center font-semibold">Giá</th>
            <th className="px-4 py-2 border text-center font-semibold">Đơn vị</th>
            <th className="px-4 py-2 border text-center font-semibold">Ngày thanh toán</th>
            <th className="px-4 py-2 border text-center font-semibold">Giai đoạn thanh toán</th>
            {isEditing && <th className="px-4 py-2 border text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {editedPayments.map((payment, index) => (
            <tr key={payment.PaymentId} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={payment.Description}
                    onChange={(e) => {
                      const updatedPayments = [...editedPayments];
                      updatedPayments[index].Description = e.target.value;
                      setEditedPayments(updatedPayments);
                      onPaymentsChange(updatedPayments);
                    }}
                    className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  payment.Description
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                {isEditing ? (
                  <input
                    type="number"
                    value={payment.Percents}
                    onChange={(e) =>
                      handlePercentChange(index, parseFloat(e.target.value))
                    }
                    className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  `${payment.Percents}%`
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                {((parseFloat(payment.Percents) / 100) * totalPrice).toLocaleString()} {payment.Unit}
              </td>
              <td className="px-4 py-2 border text-center">{payment.Unit}</td>
              <td className="px-4 py-2 border text-center">
                {isEditing ? (
                  <input
                    type="date"
                    value={
                      new Date(payment.PaymentDate).toISOString().split('T')[0]
                    }
                    onChange={(e) => {
                      const updatedPayments = [...editedPayments];
                      updatedPayments[index].PaymentDate = new Date(
                        e.target.value,
                      ).toISOString();
                      setEditedPayments(updatedPayments);
                      onPaymentsChange(updatedPayments);
                    }}
                    className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  new Date(payment.PaymentDate).toLocaleDateString()
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                {isEditing ? (
                  <input
                    type="date"
                    value={
                      new Date(payment.PaymentPhase).toISOString().split('T')[0]
                    }
                    onChange={(e) => {
                      const updatedPayments = [...editedPayments];
                      updatedPayments[index].PaymentPhase = new Date(
                        e.target.value,
                      ).toISOString();
                      setEditedPayments(updatedPayments);
                      onPaymentsChange(updatedPayments);
                    }}
                    className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  new Date(payment.PaymentPhase).toLocaleDateString()
                )}
              </td>
              {isEditing && (
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleDeletePayment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-gray-200">
            <td className="px-4 py-2 border text-center font-bold">Tổng cộng</td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateTotalPercents()}%
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateTotalPrice().toLocaleString()} {editedPayments[0]?.Unit || ''}
            </td>
            <td colSpan={4} className="px-4 py-2 border text-center"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BatchPaymentTable;
