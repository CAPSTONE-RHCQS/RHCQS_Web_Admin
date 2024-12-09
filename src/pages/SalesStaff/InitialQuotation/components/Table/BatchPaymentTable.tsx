import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { BatchPaymentInfo } from '../../../../../types/InitialQuotationTypes';
import { toast } from 'react-toastify';

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
  const today = new Date().toISOString().split('T')[0];

  const handlePercentsChange = (index: number, value: string) => {
    const newPercents = parseFloat(value) || 0;
    const currentTotal = batchPayment.reduce(
      (total, row) => total + (row.Percents || 0),
      0,
    );

    if (
      currentTotal - (batchPayment[index].Percents || 0) + newPercents <=
      100
    ) {
      handlePaymentChange(index, 'Percents', newPercents);
    } else {
      toast.error('Tổng phần trăm không được vượt quá 100%');
    }
  };

  return (
    <div className="overflow-x-auto mb-4">
      {batchPayment.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">Đợt</th>
              <th className="px-4 py-2 border text-center">Nội dung</th>
              <th className="px-4 py-2 border text-center">Phần trăm (%)</th>
              <th className="px-4 py-2 border text-center">
                Giá trị thanh toán (VNĐ)
              </th>
              <th className="px-4 py-2 border text-center">Ngày thanh toán</th>
              <th className="px-4 py-2 border text-center">Ngày đáo hạn</th>
              {isEditing && <th className="px-4 py-2 border text-center"></th>}
            </tr>
          </thead>
          <tbody>
            {batchPayment.map((row, index) => (
              <tr key={row.PaymentId || index}>
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      value={row.Description || ''}
                      onChange={(e) =>
                        handlePaymentChange(
                          index,
                          'Description',
                          e.target.value,
                        )
                      }
                      className="w-full text-left border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        border: '1px solid #ccc',
                      }}
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
                          handlePercentsChange(index, e.target.value)
                        }
                        className="w-12 bg-transparent text-right border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          border: '1px solid #ccc',
                        }}
                      />
                    ) : (
                      `${row.Percents || 0}`
                    )}
                    <span className="ml-0.5">%</span>
                  </div>
                </td>
                <td className="px-4 py-2 border text-center">
                  {(
                    ((row.Percents || 0) / 100) *
                    giaTriHopDong
                  ).toLocaleString()}{' '}
                  VNĐ
                </td>
                <td className="px-4 py-2 border text-center">
                  {isEditing ? (
                    <input
                      type="date"
                      value={
                        row.PaymentDate
                          ? new Date(row.PaymentDate)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      min={
                        index > 0
                          ? new Date(
                              Math.max(
                                new Date(
                                  batchPayment[index - 1].PaymentDate || today,
                                ).getTime(),
                                new Date(today).getTime(),
                              ),
                            )
                              .toISOString()
                              .split('T')[0]
                          : today
                      }
                      onChange={(e) =>
                        handlePaymentChange(
                          index,
                          'PaymentDate',
                          e.target.value,
                        )
                      }
                      className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : row.PaymentDate ? (
                    new Date(row.PaymentDate).toLocaleDateString()
                  ) : (
                    ''
                  )}
                </td>
                <td className="px-4 py-2 border text-center">
                  {isEditing ? (
                    <input
                      type="date"
                      value={
                        row.PaymentPhase
                          ? new Date(row.PaymentPhase)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      min={
                        row.PaymentDate
                          ? new Date(
                              Math.max(
                                new Date(row.PaymentDate).getTime(),
                                new Date(today).getTime(),
                              ),
                            )
                              .toISOString()
                              .split('T')[0]
                          : today
                      }
                      onChange={(e) => {
                        const newPaymentPhase = e.target.value;
                        if (newPaymentPhase === row.PaymentDate) {
                          toast.error('Ngày đáo hạn không được trùng với ngày thanh toán');
                        } else {
                          handlePaymentChange(index, 'PaymentPhase', newPaymentPhase);
                        }
                      }}
                      className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : row.PaymentPhase ? (
                    new Date(row.PaymentPhase).toLocaleDateString()
                  ) : (
                    ''
                  )}
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
      ) : (
        <p className="text-center text-gray-500">
          Cần khởi tạo đợt thanh toán...
        </p>
      )}
    </div>
  );
};

export default BatchPaymentTable;
