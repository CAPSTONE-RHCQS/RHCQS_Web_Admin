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
            {isEditing && <th className="px-4 py-2 border text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {editedPayments.map((payment, index) => (
            <tr key={payment.PaymentId}>
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
                    className="w-full text-center"
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
                    className="w-full text-center"
                  />
                ) : (
                  `${payment.Percents}%`
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                {payment.Price.toLocaleString()} {payment.Unit}
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
                    className="w-full text-center"
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
                    className="w-full text-center"
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
        </tbody>
      </table>
    </div>
  );
};

export default BatchPaymentTable;
