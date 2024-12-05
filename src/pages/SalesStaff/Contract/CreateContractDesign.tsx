import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createContractDesign } from '../../../api/Contract/ContractApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CreateContractDesignRequest,
  BatchPaymentRequest,
} from '../../../types/ContractTypes';

const CreateContractDesign = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [contractDetails, setContractDetails] =
    useState<CreateContractDesignRequest>({
      projectId: projectId || '',
      type: 'Design',
      startDate: '',
      endDate: '',
      validityPeriod: 0,
      taxCode: '',
      contractValue: 0,
      urlFile: null,
      note: '',
      batchPaymentRequests: [],
    });

  const [batchPayments, setBatchPayments] = useState<BatchPaymentRequest[]>([
    {
      numberOfBatches: 1,
      price: 0,
      paymentDate: '',
      paymentPhase: '',
      percents: '',
      description: '',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeContractDetails = (
    field: keyof CreateContractDesignRequest,
    value: string | number,
  ) => {
    if (field === 'contractValue' && typeof value === 'number' && value < 0) {
      toast.error('Giá trị hợp đồng không được nhỏ hơn 0');
      return;
    }

    setContractDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (contractDetails.startDate && contractDetails.endDate) {
      const start = new Date(contractDetails.startDate);
      const end = new Date(contractDetails.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setContractDetails((prevDetails) => ({
        ...prevDetails,
        validityPeriod: diffDays,
      }));
    }
  }, [contractDetails.startDate, contractDetails.endDate]);

  useEffect(() => {
    setBatchPayments((prevBatchPayments) =>
      prevBatchPayments.map((payment) => {
        const percentValue = parseFloat(payment.percents) / 100;
        return {
          ...payment,
          price: contractDetails.contractValue * percentValue,
        };
      }),
    );
  }, [contractDetails.contractValue]);

  const handleBatchPaymentChange = (
    index: number,
    field: keyof BatchPaymentRequest,
    value: string | number,
  ) => {
    setBatchPayments((prevBatchPayments) => {
      const newBatchPayments = [...prevBatchPayments];
      const payment = newBatchPayments[index];

      if (field === 'percents') {
        const newPercents = parseFloat(value as string);
        const totalPercents = newBatchPayments.reduce((sum, p, i) => {
          return sum + (i === index ? newPercents : parseFloat(p.percents));
        }, 0);

        if (totalPercents > 100) {
          toast.error('Tổng phần trăm không được vượt quá 100%');
          return prevBatchPayments;
        }

        payment.percents = value as string;
        const percentValue = newPercents / 100;
        payment.price = contractDetails.contractValue * percentValue;
      } else if (field === 'price' || field === 'numberOfBatches') {
        payment[field] = typeof value === 'number' ? value : parseFloat(value);
      } else {
        payment[field] = value as string;
      }

      return newBatchPayments;
    });
  };

  const addBatchPayment = () => {
    setBatchPayments((prevBatchPayments) => [
      ...prevBatchPayments,
      {
        numberOfBatches: prevBatchPayments.length + 1,
        price: 0,
        paymentDate: '',
        paymentPhase: '',
        percents: '',
        description: '',
      },
    ]);
  };

  const removeBatchPayment = (index: number) => {
    setBatchPayments((prevBatchPayments) => {
      const newBatchPayments = prevBatchPayments.filter((_, i) => i !== index);
      return newBatchPayments.map((payment, idx) => ({
        ...payment,
        numberOfBatches: idx + 1,
      }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (contractDetails.contractValue < 0) {
      toast.error('Giá trị hợp đồng không được nhỏ hơn 0');
      return;
    }

    setIsSubmitting(true);

    const requestBody: CreateContractDesignRequest = {
      ...contractDetails,
      batchPaymentRequests: batchPayments.map((payment) => ({
        ...payment,
        price: parseFloat(payment.price.toString()),
      })),
    };

    try {
      const response = await createContractDesign(requestBody);
      toast.success('Tạo hợp đồng thiết kế thành công!');
      navigate(`/project-detail-staff/${projectId}`);
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error('Có lỗi xảy ra khi tạo hợp đồng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo hợp đồng thiết kế</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Mã số thuế:
              </label>
              <input
                type="text"
                value={contractDetails.taxCode}
                onChange={(e) =>
                  handleChangeContractDetails('taxCode', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Giá trị hợp đồng (VNĐ):
              </label>
              <input
                type="number"
                value={contractDetails.contractValue}
                onChange={(e) =>
                  handleChangeContractDetails(
                    'contractValue',
                    parseFloat(e.target.value),
                  )
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Ngày bắt đầu:
              </label>
              <input
                type="date"
                value={contractDetails.startDate}
                min={today}
                onChange={(e) =>
                  handleChangeContractDetails('startDate', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Ngày kết thúc:
              </label>
              <input
                type="date"
                value={contractDetails.endDate}
                min={contractDetails.startDate || today}
                onChange={(e) =>
                  handleChangeContractDetails('endDate', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Thời hạn hiệu lực (ngày):
              </label>
              <input
                type="number"
                value={contractDetails.validityPeriod}
                readOnly
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Ghi chú:</label>
          <textarea
            value={contractDetails.note}
            onChange={(e) =>
              handleChangeContractDetails('note', e.target.value)
            }
            className="w-full h-32 rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>

        <hr className="my-4 border-gray-300" />

        <h3 className="text-xl font-semibold mb-4">
          Các đợt thanh toán Hợp đồng thiết kế:
        </h3>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 border-b border-gray-300 border-r">Đợt</th>
              <th className="py-2 border-b border-gray-300 border-r">Mô tả</th>
              <th className="py-2 border-b border-gray-300 border-r w-27 text-center">
                Phần trăm
              </th>
              <th className="py-2 border-b border-gray-300 border-r w-60">
                Giá trị thanh toán (VNĐ)
              </th>
              <th className="py-2 border-b border-gray-300 border-r w-20">
                Ngày thanh toán
              </th>
              <th className="py-2 border-b border-gray-300 border-r w-50">
                Ngày đáo hạn
              </th>
              <th className="py-2 border-b border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {batchPayments.map((payment, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-2 text-center border-r border-gray-300">
                  {payment.numberOfBatches}
                </td>
                <td className="px-4 py-2 border text-center align-middle">
                  <input
                    value={payment.description}
                    onChange={(e) =>
                      handleBatchPaymentChange(
                        index,
                        'description',
                        e.target.value,
                      )
                    }
                    style={{
                      overflow: 'hidden',
                      minHeight: '60px',
                      resize: 'vertical',
                      border: '1px solid #ccc',
                    }}
                    className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </td>
                <td className="px-4 py-2 border text-center align-middle">
                  <input
                    type="text"
                    value={payment.percents}
                    onChange={(e) =>
                      handleBatchPaymentChange(
                        index,
                        'percents',
                        e.target.value,
                      )
                    }
                    style={{
                      overflow: 'hidden',
                      minHeight: '60px',
                      resize: 'vertical',
                      border: '1px solid #ccc',
                    }}
                    className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </td>
                <td className="py-2 text-center border-r border-gray-300">
                  {payment.price.toLocaleString('vi-VN')}
                </td>
                <td className="py-2 border-r border-gray-300">
                  <input
                    type="date"
                    value={payment.paymentDate}
                    min={today}
                    onChange={(e) =>
                      handleBatchPaymentChange(
                        index,
                        'paymentDate',
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg bg-transparent py-1 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    required
                  />
                </td>
                <td className="py-2 border-r border-gray-300">
                  <input
                    type="date"
                    value={payment.paymentPhase}
                    min={today}
                    onChange={(e) =>
                      handleBatchPaymentChange(
                        index,
                        'paymentPhase',
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg bg-transparent py-1 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    required
                  />
                </td>
                <td className="py-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeBatchPayment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            <tr className="font-bold border-t border-gray-300">
              <td
                className="py-2 text-center border-t border-gray-300 border-r"
                colSpan={2}
              >
                Tổng
              </td>
              <td className="py-2 text-center border-t border-gray-300 border-r">
                {batchPayments.reduce(
                  (sum, payment) => sum + parseFloat(payment.percents),
                  0,
                )}
                %
              </td>
              <td className="py-2 text-center border-t border-gray-300 border-r">
                {batchPayments
                  .reduce((sum, payment) => sum + payment.price, 0)
                  .toLocaleString('vi-VN')}{' '}
                VNĐ
              </td>
              <td className="py-2 border-t border-gray-300" colSpan={3}></td>
            </tr>
          </tbody>
        </table>
        <button
          type="button"
          onClick={addBatchPayment}
          className="mt-4 bg-secondary hover:bg-opacity-90 text-white px-4 py-2 rounded mb-4"
        >
          Thêm đợt thanh toán
        </button>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContractDesign;
