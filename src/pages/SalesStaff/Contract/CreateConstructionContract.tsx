import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postConstructionContract } from '../../../api/Construction/ConstructionApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateConstructionContract = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [contractDetails, setContractDetails] = useState({
    startDate: '',
    endDate: '',
    validityPeriod: '',
    taxCode: '',
    contractValue: '',
    urlFile: '',
    note: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeContractDetails = (field: string, value: string) => {
    setContractDetails({ ...contractDetails, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requestBody = {
      projectId: projectId || '',
      startDate: contractDetails.startDate,
      endDate: contractDetails.endDate,
      validityPeriod: parseInt(contractDetails.validityPeriod, 10),
      taxCode: contractDetails.taxCode,
      contractValue: parseFloat(contractDetails.contractValue),
      urlFile: contractDetails.urlFile,
      note: contractDetails.note,
    };

    try {
      const response = await postConstructionContract(requestBody);
      console.log('Contract created successfully:', response);
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo hợp đồng thi công</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  handleChangeContractDetails('contractValue', e.target.value)
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

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateConstructionContract;
