import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { BatchPaymentInfo } from '../../../../../types/InitialQuotationTypes';

interface BatchPaymentTableProps {
  batchPayment: BatchPaymentInfo[];
  totalPercentage: number;
  totalAmount: number;
  giaTriHopDong: number;
  isEditing: boolean;
  handlePaymentChange: (index: number, field: string, value: any) => void;
  handleDeletePayment: (index: number) => void;
}

const BatchPaymentTable: React.FC<BatchPaymentTableProps> = ({
  batchPayment,
  totalPercentage,
  totalAmount,
  giaTriHopDong,
  isEditing,
  handlePaymentChange,
  handleDeletePayment,
}) => {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Đợt</th>
            <th className="px-4 py-2 border text-center">Nội dung</th>
            <th className="px-4 py-2 border text-center">Phần trăm (%)</th>
            <th className="px-4 py-2 border text-center">
              Giá trị thanh toán (VNĐ)
            </th>
            {isEditing && <th className="px-4 py-2 border text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {batchPayment.map((row, index) => (
            <tr key={row.PaymentId}>
              <td className="px-4 py-2 border text-center">{index + 1}</td>
              <td className="px-4 py-2 border text-left">
                {isEditing ? (
                  <input
                    type="text"
                    value={row.Description || ''}
                    onChange={(e) =>
                      handlePaymentChange(index, 'Description', e.target.value)
                    }
                    className="w-full text-left"
                  />
                ) : (
                  row.Description
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                <div className="flex items-center justify-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={row.Percents || ''}
                      onChange={(e) =>
                        handlePaymentChange(index, 'Percents', e.target.value)
                      }
                      className="w-7 bg-transparent text-right"
                    />
                  ) : (
                    `${row.Percents || 0}`
                  )}
                  <span className="ml-0.5">%</span>
                </div>
              </td>
              <td className="px-4 py-2 border text-center">
                {(
                  (parseFloat(row.Percents || '0') / 100) *
                  giaTriHopDong
                ).toLocaleString()}{' '}
                VNĐ
              </td>
              {isEditing && (
                <td className="px-4 py-2 border text-center">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => handleDeletePayment(index)}
                      className="bg-red-500 text-white w-8 h-8 flex items-center justify-center shadow hover:bg-red-600 transition duration-300 rounded-full"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          <tr>
            <td className="px-4 py-2 border text-center" colSpan={2}>
              <strong>TỔNG GIÁ TRỊ HỢP ĐỒNG</strong>
            </td>
            <td className="px-4 py-2 border text-center">
              <strong>
                {totalPercentage}
                <span className="ml-0.5">%</span>
              </strong>
            </td>
            <td className="px-4 py-2 border text-center">
              <strong>{totalAmount.toLocaleString()} VNĐ</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BatchPaymentTable;
