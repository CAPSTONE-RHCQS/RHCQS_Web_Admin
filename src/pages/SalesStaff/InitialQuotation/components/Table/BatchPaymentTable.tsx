import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface BatchPaymentTableProps {
  batchPayment: any[];
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
            <th
              className="px-4 py-2 border text-center"
              style={{ width: '10%' }}
            >
              Đợt
            </th>
            <th className="px-4 py-2 border text-left">Nội dung</th>
            <th className="px-4 py-2 border text-center">Phần trăm (%)</th>
            <th className="px-4 py-2 border text-center">Số tiền</th>
            {isEditing && <th className="px-4 py-2 border text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {batchPayment.map((row, index) => (
            <tr key={row.Id}>
              <td
                className="px-4 py-2 border text-center"
                style={{ width: '10%' }}
              >
                {index + 1}
              </td>
              <td className="px-4 py-2 border text-left">
                {isEditing ? (
                  <input
                    type="text"
                    value={row.Description}
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
                {isEditing ? (
                  <input
                    type="number"
                    value={row.Percents}
                    onChange={(e) =>
                      handlePaymentChange(index, 'Percents', e.target.value)
                    }
                    className="w-full text-center"
                  />
                ) : (
                  `${row.Percents}%`
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                {((row.Percents / 100) * giaTriHopDong).toLocaleString()} VNĐ
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
          <tr>
            <td className="px-4 py-2 border text-center" colSpan={2}>
              <strong>Tổng giá trị hợp đồng</strong>
            </td>
            <td className="px-4 py-2 border text-center">
              <strong>{totalPercentage}%</strong>
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
