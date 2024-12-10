import React, { useState, useEffect } from 'react';
import { BatchPaymentInfo } from '../../../../../types/FinalQuotationTypes';
import { toast } from 'react-toastify';

interface BatchPaymentTableProps {
  payments: BatchPaymentInfo[];
  isEditing: boolean;
  totalPrice: number;
  onPaymentsChange: (updatedPayments: BatchPaymentInfo[]) => void;
  dateRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

const BatchPaymentTable: React.FC<BatchPaymentTableProps> = ({
  payments,
  isEditing,
  totalPrice,
  onPaymentsChange,
  dateRefs,
}) => {
  const [editedPayments, setEditedPayments] = useState(payments);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const formattedPayments = payments.map((payment) => ({
      ...payment,
      PaymentDate: payment.PaymentDate
        ? new Date(payment.PaymentDate).toLocaleDateString('en-CA')
        : '',
      PaymentPhase: payment.PaymentPhase
        ? new Date(payment.PaymentPhase).toLocaleDateString('en-CA')
        : '',
    }));
    setEditedPayments(formattedPayments);
  }, [payments]);

  useEffect(() => {
    const updatedPayments = editedPayments.map((payment) => ({
      ...payment,
      Price: (payment.Percents / 100) * totalPrice,
    }));
    setEditedPayments(updatedPayments);
    onPaymentsChange(updatedPayments);
  }, [totalPrice]);

  const handleDateChange = (
    index: number,
    field: 'PaymentDate' | 'PaymentPhase',
    value: string,
  ) => {
    const updatedPayments = [...editedPayments];

    updatedPayments[index][field] = value;

    for (let i = index + 1; i < updatedPayments.length; i++) {
      updatedPayments[i].PaymentDate = '';
      updatedPayments[i].PaymentPhase = '';
    }

    if (field === 'PaymentDate') {
      updatedPayments[index].PaymentPhase = '';
    }

    setEditedPayments(updatedPayments);
    onPaymentsChange(updatedPayments);
  };

  const calculateTotalPercents = () => {
    return editedPayments.reduce(
      (total, payment) => total + payment.Percents,
      0,
    );
  };

  const calculateTotalPrice = () => {
    return editedPayments.reduce(
      (total, payment) => total + (payment.Percents / 100) * totalPrice,
      0,
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center font-semibold">Đợt</th>
            <th className="px-4 py-2 border text-center font-semibold">
              Nội dung
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Phần trăm (%)
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Giá trị thanh toán (VNĐ)
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Ngày thanh toán
            </th>
            <th className="px-4 py-2 border text-center font-semibold">
              Ngày đáo hạn
            </th>
          </tr>
        </thead>
        <tbody>
          {editedPayments.map((payment, index) => (
            <tr key={payment.PaymentId} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-center">
                {payment.NumberOfBatch}
              </td>
              <td className="px-4 py-2 border text-left">
                {payment.Description}
              </td>
              <td className="px-4 py-2 border text-center">
                {`${payment.Percents}%`}
              </td>
              <td className="px-4 py-2 border text-center">
                {((payment.Percents / 100) * totalPrice).toLocaleString()}{' '}
                {payment.Unit}
              </td>
              <td className="px-4 py-2 border text-center">
                {isEditing ? (
                  <input
                    type="date"
                    ref={(el) => (dateRefs.current[index] = el)}
                    value={payment.PaymentDate || ''}
                    min={
                      index > 0
                        ? new Date(
                            Math.max(
                              new Date(
                                editedPayments[index - 1].PaymentDate,
                              ).getTime(),
                              new Date(today).getTime(),
                            ),
                          )
                            .toISOString()
                            .split('T')[0]
                        : today
                    }
                    onChange={(e) =>
                      handleDateChange(index, 'PaymentDate', e.target.value)
                    }
                    className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : payment.PaymentDate ? (
                  new Date(payment.PaymentDate).toLocaleDateString()
                ) : (
                  ''
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                {isEditing ? (
                  <input
                    type="date"
                    ref={(el) =>
                      (dateRefs.current[index + editedPayments.length] = el)
                    }
                    value={payment.PaymentPhase || ''}
                    min={
                      payment.PaymentDate
                        ? new Date(payment.PaymentDate)
                            .toISOString()
                            .split('T')[0]
                        : today
                    }
                    onChange={(e) => {
                      if (e.target.value !== payment.PaymentDate) {
                        handleDateChange(index, 'PaymentPhase', e.target.value);
                      } else {
                        toast.error(
                          'Ngày đáo hạn không được trùng với ngày thanh toán',
                        );
                      }
                    }}
                    className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : payment.PaymentPhase ? (
                  new Date(payment.PaymentPhase).toLocaleDateString()
                ) : (
                  ''
                )}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-200">
            <td colSpan={2} className="px-4 py-2 border text-center font-bold">
              Tổng cộng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateTotalPercents()}%
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {calculateTotalPrice().toLocaleString()}{' '}
              {editedPayments[0]?.Unit || ''}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BatchPaymentTable;
