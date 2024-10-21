import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createContractDesign } from '../../api/Contract/ContractApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type BatchPayment = {
  price: string;
  percents: string;
  description: string;
  paymentDate: string;
  paymentPhase: string;
};

const CreateContractDesign = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [contractDetails, setContractDetails] = useState({
    type: 'Design',
    startDate: '',
    endDate: '',
    validityPeriod: '',
    taxCode: '',
    contractValue: '',
    urlFile: '',
    note: '',
  });

  const [batchPayments, setBatchPayments] = useState<BatchPayment[]>([
    {
      price: '',
      percents: '',
      description: '',
      paymentDate: '',
      paymentPhase: '',
    },
  ]);

  const handleChangeContractDetails = (field: string, value: string) => {
    setContractDetails({ ...contractDetails, [field]: value });
  };

  const handleBatchPaymentChange = (
    index: number,
    field: keyof BatchPayment,
    value: string,
  ) => {
    const newBatchPayments = [...batchPayments];
    newBatchPayments[index][field] = value;
    setBatchPayments(newBatchPayments);
  };

  const addBatchPayment = () => {
    setBatchPayments([
      ...batchPayments,
      {
        price: '',
        percents: '',
        description: '',
        paymentDate: '',
        paymentPhase: '',
      },
    ]);
  };

  const removeBatchPayment = (index: number) => {
    setBatchPayments(batchPayments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestBody = {
      projectId: projectId || '',
      type: contractDetails.type,
      startDate: contractDetails.startDate,
      endDate: contractDetails.endDate,
      validityPeriod: parseInt(contractDetails.validityPeriod, 10),
      taxCode: contractDetails.taxCode,
      contractValue: parseFloat(contractDetails.contractValue),
      urlFile: contractDetails.urlFile,
      note: contractDetails.note,
      batchPaymentRequests: batchPayments.map((payment) => ({
        numberOfBatches: 1,
        price: parseFloat(payment.price),
        paymentDate: payment.paymentDate,
        paymentPhase: payment.paymentPhase,
        percents: payment.percents,
        description: payment.description,
      })),
    };

    console.log('Request Body:', requestBody);

    try {
      const response = await createContractDesign(requestBody);
      console.log('Contract created successfully:', response);
      toast.success('Tạo hợp đồng thiết kế thành công!');
      navigate(`/project-detail-staff/${projectId}`);
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error('Có lỗi xảy ra khi tạo hợp đồng.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo hợp đồng thiết kế</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Loại hợp đồng:
              </label>
              <input
                type="text"
                value={contractDetails.type}
                onChange={(e) =>
                  handleChangeContractDetails('type', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
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
                URL file:
              </label>
              <input
                type="text"
                value={contractDetails.urlFile}
                onChange={(e) =>
                  handleChangeContractDetails('urlFile', e.target.value)
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
                  handleChangeContractDetails('contractValue', e.target.value)
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
                onChange={(e) =>
                  handleChangeContractDetails('endDate', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Thời hạn hiệu lực:
              </label>
              <input
                type="number"
                value={contractDetails.validityPeriod}
                onChange={(e) =>
                  handleChangeContractDetails('validityPeriod', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
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

        <h3 className="text-xl font-semibold mb-4">Phương thức thanh toán</h3>
        {batchPayments.map((payment, index) => (
          <div
            key={index}
            className="flex flex-wrap md:flex-nowrap gap-4 mb-4 items-center"
          >
            <div className="flex-1">
              <label className="block text-lg font-medium mb-2">
                Giá trị thanh toán (VNĐ):
              </label>
              <input
                type="number"
                value={payment.price}
                onChange={(e) =>
                  handleBatchPaymentChange(index, 'price', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-medium mb-2">
                Phần trăm:
              </label>
              <input
                type="text"
                value={payment.percents}
                onChange={(e) =>
                  handleBatchPaymentChange(index, 'percents', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-medium mb-2">Mô tả:</label>
              <input
                type="text"
                value={payment.description}
                onChange={(e) =>
                  handleBatchPaymentChange(index, 'description', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-medium mb-2">
                Ngày thanh toán:
              </label>
              <input
                type="date"
                value={payment.paymentDate}
                onChange={(e) =>
                  handleBatchPaymentChange(index, 'paymentDate', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-medium mb-2">
                Giai đoạn thanh toán:
              </label>
              <input
                type="text"
                value={payment.paymentPhase}
                onChange={(e) =>
                  handleBatchPaymentChange(
                    index,
                    'paymentPhase',
                    e.target.value,
                  )
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>
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
          </div>
        ))}
        <button
          type="button"
          onClick={addBatchPayment}
          className="bg-secondary hover:bg-opacity-90 text-white px-4 py-2 rounded mb-4"
        >
          Thêm đợt thanh toán
        </button>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContractDesign;
