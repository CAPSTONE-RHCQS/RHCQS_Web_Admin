import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFinalToContractConstruction } from '../../../api/Construction/ConstructionApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BatchPaymentRequest } from '../../../types/ContractResponseTypes';
import { createConstructionContract } from '../../../api/Contract/ContractApi';

const CreateConstructionContract = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [contractDetails, setContractDetails] = useState({
    startDate: '',
    endDate: '',
    taxCode: '',
    contractValue: '',
    urlFile: null,
    note: '',
  });

  const [batchPayments, setBatchPayments] = useState<BatchPaymentRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBatchPayments = async () => {
      if (projectId) {
        try {
          const data = await getFinalToContractConstruction(projectId);
          setBatchPayments(data.BatchPaymentRequests);
          setContractDetails((prevDetails) => ({
            ...prevDetails,
            contractValue: data.ContractValue.toString(),
          }));
        } catch (error) {
          console.error('Error fetching batch payments:', error);
        }
      }
    };

    fetchBatchPayments();
  }, [projectId]);

  const handleChangeContractDetails = (field: string, value: string) => {
    setContractDetails({ ...contractDetails, [field]: value });
  };

  const calculateValidityPeriod = () => {
    const { startDate, endDate } = contractDetails;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requestBody = {
      projectId: projectId || '',
      startDate: contractDetails.startDate,
      endDate: contractDetails.endDate,
      validityPeriod: calculateValidityPeriod(),
      taxCode: contractDetails.taxCode,
      contractValue: parseFloat(contractDetails.contractValue),
      urlFile: contractDetails.urlFile,
      note: contractDetails.note,
    };

    try {
      const response = await createConstructionContract(requestBody);
      toast.success('Tạo hợp đồng thi công thành công!');
      navigate(`/project-detail-staff/${projectId}`);
    } catch (error: any) {
      console.error('Error creating contract:', error);
      const errorMessage =
        error.response?.data?.Error || 'Có lỗi xảy ra khi tạo hợp đồng.';
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo hợp đồng thi công</h2>
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
              <p className="text-lg text-gray-800">
                {contractDetails.contractValue.toLocaleString()} VNĐ
              </p>
            </div>
          </div>
          <div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-lg font-medium mb-2">
                  Ngày bắt đầu:
                </label>
                <input
                  type="date"
                  value={contractDetails.startDate}
                  onChange={(e) =>
                    handleChangeContractDetails('startDate', e.target.value)
                  }
                  min={today}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2">
                  Ngày kết thúc:
                </label>
                <input
                  type="date"
                  value={contractDetails.endDate}
                  onChange={(e) =>
                    handleChangeContractDetails('endDate', e.target.value)
                  }
                  min={contractDetails.startDate || today}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  required
                />
              </div>
            </div>
            <span className="block text-lg font-medium mb-2">
              Thời hạn hiệu lực: {calculateValidityPeriod().toString()} ngày
            </span>
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
      </form>

      <hr className="my-4 border-gray-300" />

      <h3 className="text-xl font-bold mt-8 mb-4">
        Các đợt thanh toán Hợp đồng thi công
      </h3>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Đợt</th>
            <th className="px-4 py-2 border text-center">Nội dung</th>
            <th className="px-4 py-2 border text-center">Phần trăm (%) </th>
            <th className="px-4 py-2 border text-center">
              Giá trị thanh toán (VNĐ)
            </th>
            <th className="px-4 py-2 border text-center">Ngày thanh toán</th>
            <th className="px-4 py-2 border text-center">Ngày đáo hạn</th>
          </tr>
        </thead>
        <tbody>
          {batchPayments.map((batch, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border">{batch.NumberOfBatches}</td>
              <td className="px-4 py-2 border">{batch.Description}</td>
              <td className="px-4 py-2 border">{batch.Percents}%</td>
              <td className="px-4 py-2 border">
                {batch.Price.toLocaleString()}
              </td>
              <td className="px-4 py-2 border">
                {formatDate(batch.PaymentDate)}
              </td>
              <td className="px-4 py-2 border">
                {formatDate(batch.PaymentPhase)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default CreateConstructionContract;
