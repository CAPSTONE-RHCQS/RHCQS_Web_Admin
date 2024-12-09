import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getContractDesignById,
  signContractCompletion,
  createContractAppendix,
} from '../../../api/Contract/ContractApi';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  FaFileDownload,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaInfoCircle,
  FaBoxOpen,
  FaBox,
  FaFileContract,
  FaPaperclip,
  FaStickyNote,
  FaUpload,
  FaCheckCircle,
  FaBan,
} from 'react-icons/fa';
import ContractStatusTracker from '../../../components/StatusTracker/ContractStatusTracker';
import {
  ContractDesignResponse,
  BatchPayment,
  BatchPaymentRequest,
} from '../../../types/ContractResponseTypes';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContractDetailStaff = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const [contractDetail, setContractDetail] =
    useState<ContractDesignResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState<BatchPayment[]>([]);
  const [batchPaymentRequests, setBatchPaymentRequests] = useState<
    BatchPaymentRequest[]
  >([]);
  const navigate = useNavigate();
  const [appendixNote, setAppendixNote] = useState('');
  const [isCreatingAppendix, setIsCreatingAppendix] = useState(false);
  const [appendixStartDate, setAppendixStartDate] = useState('');
  const [appendixEndDate, setAppendixEndDate] = useState('');

  useEffect(() => {
    const fetchContractDetail = async () => {
      if (contractId) {
        try {
          const data = await getContractDesignById(contractId);
          setContractDetail(data);
        } catch (error) {
          console.error('Error fetching contract detail:', error);
        }
      } else {
        console.error('Contract ID is undefined');
      }
    };

    fetchContractDetail();
    const interval = setInterval(fetchContractDetail, 2000);

    return () => clearInterval(interval);
  }, [contractId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (contractId && selectedFile) {
      setIsUploading(true);
      try {
        await signContractCompletion(contractId, selectedFile);
        toast.success('Tải lên thành công!');
        const data = await getContractDesignById(contractId);
        setContractDetail(data);
      } catch (error) {
        console.error('Error uploading signed contract:', error);
        toast.error('Tải lên thất bại!');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBatches([]);
    setBatchPaymentRequests([]);
    setAppendixStartDate('');
    setAppendixEndDate('');
    setAppendixNote('');
  };

  const handleBatchSelection = (batch: BatchPayment) => {
    if (batch.Status === 'Progress') {
      const isSelected = selectedBatches.some(
        (selected) => selected.NumberOfBatch === batch.NumberOfBatch,
      );
      if (isSelected) {
        const updatedBatches = selectedBatches.filter(
          (selected) => selected.NumberOfBatch !== batch.NumberOfBatch,
        );
        const updatedRequests = batchPaymentRequests.filter(
          (request) => request.NumberOfBatches !== batch.NumberOfBatch,
        );
        setSelectedBatches(updatedBatches);
        setBatchPaymentRequests(updatedRequests);
      } else {
        setSelectedBatches([...selectedBatches, batch]);
        setBatchPaymentRequests([
          ...batchPaymentRequests,
          {
            NumberOfBatches: batch.NumberOfBatch,
            Price: 0,
            PaymentDate: '',
            PaymentPhase: '',
            Percents: 0,
            Description: '',
          },
        ]);
      }
    }
  };

  const handleInputChange = (
    index: number,
    field: keyof BatchPaymentRequest,
    value: string | number,
  ) => {
    const updatedRequests = [...batchPaymentRequests];

    if (field === 'Percents') {
      const percentValue =
        typeof value === 'number' ? value : parseFloat(value);

      const currentTotalPercents =
        updatedRequests.reduce((total, request) => {
          return total + (request.Percents || 0);
        }, 0) -
        (updatedRequests[index].Percents || 0) +
        percentValue;

      const totalPercents =
        contractDetail?.BatchPayment?.reduce((total, batch) => {
          return batch.Status === 'Progress' ? total + batch.Percents : total;
        }, 0) || 0;

      if (currentTotalPercents > totalPercents) {
        toast.error(
          'Tổng phần trăm của phụ lục không được lớn hơn tổng phần trăm của các đợt thanh toán có trạng thái "Chờ thanh toán"!',
        );
        return;
      }

      updatedRequests[index].Price =
        (contractDetail?.ContractValue || 0) * (percentValue / 100);
    }

    updatedRequests[index] = {
      ...updatedRequests[index],
      [field]: value,
    };

    setBatchPaymentRequests(updatedRequests);
  };

  const handleCreateAppendix = async () => {
    if (!contractDetail || !contractId) {
      console.error('Contract detail or contract ID is missing');
      return;
    }

    if (!appendixStartDate || !appendixEndDate) {
      toast.error('Vui lòng nhập ngày bắt đầu và ngày kết thúc cho phụ lục!');
      return;
    }

    const startDate = new Date(appendixStartDate).getTime();
    const endDate = new Date(appendixEndDate).getTime();
    const validityPeriod = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

    setIsCreatingAppendix(true);

    const totalPercents =
      contractDetail.BatchPayment?.reduce((total, batch) => {
        return batch.Status === 'Progress' ? total + batch.Percents : total;
      }, 0) || 0;

    const appendixTotalPercents = batchPaymentRequests.reduce(
      (total, request) => {
        return total + request.Percents;
      },
      0,
    );

    if (appendixTotalPercents > totalPercents) {
      toast.error(
        'Tổng phần trăm của phụ lục không được lớn hơn tổng phần trăm của các đợt thanh toán có trạng thái "Chờ thanh toán"!',
      );
      return;
    }

    const data = {
      contractId: contractId,
      startDate: appendixStartDate,
      endDate: appendixEndDate,
      validityPeriod: validityPeriod,
      taxCode: contractDetail.TaxCode || '',
      contractValue: contractDetail.ContractValue,
      urlFile: '',
      note: appendixNote,
      cancelBatchPaymnetContract: selectedBatches.map((batch) => ({
        batchPaymentId: batch.BatchPaymentId,
      })),
      batchPaymentRequests: batchPaymentRequests.map((request) => ({
        numberOfBatches: request.NumberOfBatches,
        price: request.Price,
        paymentDate: request.PaymentDate,
        paymentPhase: request.PaymentPhase,
        percents: request.Percents,
        description: request.Description,
      })),
    };

    try {
      await createContractAppendix(data);
      toast.success('Phụ lục hợp đồng đã được tạo thành công!');
      closeModal();
      navigate(-1);
    } catch (error) {
      console.error('Error creating contract appendix:', error);
      toast.error('Tạo phụ lục hợp đồng thất bại!');
    } finally {
      setIsCreatingAppendix(false);
    }
  };

  const hasProgressBatch = contractDetail?.BatchPayment?.some(
    (batch) => batch.Status === 'Progress',
  );

  const isCreateAppendixEnabled =
    selectedBatches.length > 0 &&
    batchPaymentRequests.every(
      (request) =>
        request.Percents > 0 &&
        request.PaymentDate !== '' &&
        request.PaymentPhase !== '' &&
        request.Description !== '',
    );

  if (!contractDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={'#5BABAC'} loading={true} />
      </div>
    );
  }

  const statusMap: { [key: string]: string } = {
    Processing: 'Đang xử lý',
    Completed: 'Hoàn thành',
    Finished: 'Đã thanh toán',
    Ended: 'Chấm dứt hợp đồng',
  };

  const mappedStatus = statusMap[contractDetail.Status] || 'Đang xử lý';

  const contractTemplateUrl =
    contractDetail.Type === 'Design'
      ? 'https://res.cloudinary.com/de7pulfdj/image/upload/v1732348518/Contract/Hop_dong_thiet_ke_a30cfe5d-d683-482b-8172-9eb2292dc75e.pdf'
      : contractDetail.Type === 'Construction'
      ? 'https://res.cloudinary.com/de7pulfdj/image/upload/v1731897883/Contract/Hop_dong_thi_cong_17e47746-0598-4caa-801e-261e01da1f9e.pdf'
      : null;

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Chi tiết hợp đồng
          </h2>
        </div>
      </div>

      <ContractStatusTracker currentStatus={mappedStatus} />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">
            {contractDetail?.Name}
          </h2>
          {contractDetail?.Quotation?.File !== '' && (
            <>
              {contractDetail.Type === 'Design' ? (
                <a
                  href={contractDetail.Quotation.File}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-gray-500 text-sm cursor-pointer hover:text-blue-500 flex items-center">
                    <FaFileDownload className="inline-block mr-2" />
                    <span className="font-semibold">
                      Thông tin báo giá sơ bộ
                    </span>
                  </div>
                </a>
              ) : contractDetail.Type === 'Construction' ? (
                <a
                  href={contractDetail.Quotation.File}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-gray-500 text-sm cursor-pointer hover:text-blue-500 flex items-center">
                    <FaFileDownload className="inline-block mr-2" />
                    <span className="font-semibold">
                      Thông tin báo giá chi tiết
                    </span>
                  </div>
                </a>
              ) : (
                <></>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="mb-4 text-lg flex items-center">
              <FaFileContract className="mr-2" />
              <span className="font-semibold">Mã hợp đồng:</span>
              <span className="text-gray-700 ml-2">
                {contractDetail.ContractCode}
              </span>
            </div>
            <div className="mb-4 text-lg flex items-center">
              <FaInfoCircle className="mr-2" />
              <span className="font-semibold">Mã số thuế:</span>
              <span className="text-gray-700 ml-2">
                {contractDetail.TaxCode || ''}
              </span>
            </div>
            <div className="mb-4 text-lg flex items-center">
              <FaUser className="mr-2" />
              <span className="font-semibold">Chủ đầu tư:</span>
              <span className="text-gray-700 ml-2">
                {contractDetail.CustomerName}
              </span>
            </div>

            <div className="mb-4 text-lg flex items-center">
              <FaBoxOpen className="mr-2" />
              <span className="font-semibold">Thi công Phần thô:</span>
              <span className="text-gray-700 ml-2">
                {contractDetail.RoughPackagePrice !== null
                  ? contractDetail.RoughPackagePrice.toLocaleString()
                  : ''}{' '}
                {contractDetail.UnitPrice}
              </span>
            </div>
            <div className="mb-4 text-lg flex items-center">
              <FaBox className="mr-2" />
              <span className="font-semibold">Thi công Phần hoàn thiện:</span>
              <span className="text-gray-700 ml-2">
                {contractDetail.FinishedPackagePrice !== null
                  ? contractDetail.FinishedPackagePrice.toLocaleString()
                  : ''}{' '}
                {contractDetail.UnitPrice}
              </span>
            </div>
            <div className="mb-4 text-lg flex items-center">
              <FaMoneyBillWave className="mr-2" />
              <span className="font-semibold">Giá trị hợp đồng:</span>
              <span className="text-gray-700 ml-2">
                {contractDetail.ContractValue !== null
                  ? contractDetail.ContractValue.toLocaleString()
                  : ''}{' '}
                VNĐ
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-4 text-lg flex items-center">
              <FaClock className="mr-2" />
              <span className="font-semibold">Thời hạn hiệu lực:</span>
              <span className="text-gray-700 ml-2">
                {contractDetail.ValidityPeriod} ngày
              </span>
            </div>
            <div className="mb-4 text-lg flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span className="font-semibold">Từ ngày </span>
              <span className="text-gray-700 ml-2 mr-2">
                {new Date(contractDetail.StartDate).toLocaleDateString()}
              </span>
              <span className="font-semibold">tới ngày </span>
              <span className="text-gray-700 ml-2">
                {new Date(contractDetail.EndDate).toLocaleDateString()}
              </span>
            </div>
            {contractTemplateUrl && (
              <div className="mb-4 text-lg flex items-center">
                <FaFileContract className="mr-2" />
                <span className="font-semibold">Bản hợp đồng mẫu:</span>
                <a
                  href={contractTemplateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline ml-2"
                >
                  <FaFileDownload className="inline-block mr-1" /> Tải xuống
                </a>
              </div>
            )}
            {contractDetail.UrlFile && (
              <div className="mb-4 text-lg flex items-center">
                <FaPaperclip className="mr-2" />
                <span className="font-semibold">Hợp đồng đã ký:</span>
                <a
                  href={contractDetail.UrlFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline ml-2"
                >
                  <FaFileDownload className="inline-block mr-1" /> Tải xuống
                </a>
              </div>
            )}
            {contractDetail.UrlFile === null && (
              <div className="mb-4 text-lg flex items-center">
                <FaUpload className="mr-2" />
                <span className="font-semibold">Tải lên Hợp đồng đã ký:</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="ml-2"
                />
                <button
                  onClick={handleUpload}
                  className="ml-2 bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark"
                  disabled={isUploading}
                >
                  {isUploading ? 'Đang tải lên...' : 'Tải lên'}
                </button>
              </div>
            )}
            <div className="mb-4 col-span-full text-lg flex items-center">
              <FaStickyNote className="mr-2" />
              <span className="font-semibold">Ghi chú:</span>
              <span className="text-gray-700 ml-2">
                {contractDetail.Note || ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 mb-4">
        <h3 className="text-xl font-semibold mb-4">Các đợt thanh toán</h3>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">Đợt</th>
              <th className="px-4 py-2 border text-center">Mô tả</th>
              <th className="px-4 py-2 border text-center">Phần trăm (%)</th>
              <th className="px-4 py-2 border text-center">
                Giá trị thanh toán (VNĐ)
              </th>
              <th className="px-4 py-2 border text-center">Ngày thanh toán</th>
              <th className="px-4 py-2 border text-center">Ngày đáo hạn</th>
              <th className="px-4 py-2 border text-center">Hóa đơn</th>
              <th className="px-4 py-2 border text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {contractDetail.BatchPayment?.map((batch) => (
              <tr key={batch.NumberOfBatch} className="text-center">
                <td className="px-4 py-2 border">{batch.NumberOfBatch}</td>
                <td className="px-4 py-2 border">{batch.Description}</td>
                <td className="px-4 py-2 border">{batch.Percents} %</td>
                <td className="px-4 py-2 border">
                  {batch.Price.toLocaleString()} {contractDetail.UnitPrice}
                </td>
                <td className="px-4 py-2 border">
                  {formatDate(batch.PaymentDate)}
                </td>
                <td className="px-4 py-2 border">
                  {formatDate(batch.PaymentPhase)}
                </td>
                <td className="px-4 py-2 border">
                  {batch.InvoiceImage !== 'Chưa có hóa đơn' ? (
                    <img
                      src={batch.InvoiceImage}
                      alt={`Invoice for ${batch.Description}`}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  ) : (
                    ''
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {batch.Status === 'Paid' ? (
                    <span className="text-green-500 flex items-center">
                      <FaCheckCircle className="mr-1" /> Đã thanh toán
                    </span>
                  ) : batch.Status === 'Cancel' ? (
                    <span className="text-red-500 flex items-center">
                      <FaBan className="mr-1" /> Đã chấm dứt
                    </span>
                  ) : (
                    <span className="text-blue-500 flex items-center">
                      <FaClock className="mr-1" /> Chờ thanh toán
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contractDetail.BatchPaymentAppendices ? (
        <div className="mt-6 mb-4">
          <h3 className="text-xl font-semibold mb-4">Phụ lục hợp đồng</h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Đợt</th>
                <th className="px-4 py-2 border text-center">Mô tả</th>
                <th className="px-4 py-2 border text-center">Phần trăm (%)</th>
                <th className="px-4 py-2 border text-center">
                  Giá trị thanh toán (VNĐ)
                </th>
                <th className="px-4 py-2 border text-center">
                  Ngày thanh toán
                </th>
                <th className="px-4 py-2 border text-center">Ngày đáo hạn</th>
                <th className="px-4 py-2 border text-center">Hóa đơn</th>
                <th className="px-4 py-2 border text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {contractDetail.BatchPaymentAppendices?.map((appendix) => (
                <tr key={appendix.NumberOfBatch} className="text-center">
                  <td className="px-4 py-2 border">{appendix.NumberOfBatch}</td>
                  <td className="px-4 py-2 border">{appendix.Description}</td>
                  <td className="px-4 py-2 border">{appendix.Percents} %</td>
                  <td className="px-4 py-2 border">
                    {appendix.Price.toLocaleString()} {contractDetail.UnitPrice}
                  </td>
                  <td className="px-4 py-2 border">
                    {formatDate(appendix.PaymentDate)}
                  </td>
                  <td className="px-4 py-2 border">
                    {formatDate(appendix.PaymentPhase)}
                  </td>
                  <td className="px-4 py-2 border">
                    {appendix.InvoiceImage !== 'Chưa có hóa đơn' ? (
                      <img
                        src={appendix.InvoiceImage}
                        alt={`Invoice for ${appendix.Description}`}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {appendix.Status === 'Paid' ? (
                      <span className="text-green-500 flex items-center">
                        <FaCheckCircle className="mr-1" /> Đã thanh toán
                      </span>
                    ) : appendix.Status === 'Cancel' ? (
                      <span className="text-red-500 flex items-center">
                        <FaBan className="mr-1" /> Đã chấm dứt
                      </span>
                    ) : (
                      <span className="text-blue-500 flex items-center">
                        <FaClock className="mr-1" /> Chờ thanh toán
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        hasProgressBatch && (
          <button
            onClick={openModal}
            className="bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark"
          >
            Tạo Phụ Lục Hợp Đồng
          </button>
        )
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ml-40"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl relative ml-20 mt-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Tạo Phụ Lục Hợp Đồng</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">Ngày bắt đầu:</h3>
              <input
                type="date"
                value={appendixStartDate}
                onChange={(e) => setAppendixStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Ngày kết thúc:</h3>
              <input
                type="date"
                value={appendixEndDate}
                onChange={(e) => setAppendixEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                required
                min={
                  appendixStartDate || new Date().toISOString().split('T')[0]
                }
              />
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">
                Chọn các đợt thanh toán cần thay đổi:
              </h3>
              <ul>
                {contractDetail.BatchPayment?.filter(
                  (batch) => batch.Status === 'Progress',
                ).map((batch) => (
                  <li key={batch.NumberOfBatch}>
                    <input
                      type="checkbox"
                      checked={selectedBatches.some(
                        (selected) =>
                          selected.NumberOfBatch === batch.NumberOfBatch,
                      )}
                      onChange={() => handleBatchSelection(batch)}
                    />
                    <span className="ml-2">{batch.Description}</span>
                  </li>
                ))}
              </ul>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 border-b border-gray-300 border-r">
                    Đợt
                  </th>
                  <th className="py-2 border-b border-gray-300 border-r">
                    Mô tả
                  </th>
                  <th className="py-2 border-b border-gray-300 border-r w-27 text-center">
                    Phần trăm (%)
                  </th>
                  <th className="py-2 border-b border-gray-300 border-r w-60">
                    Giá trị thanh toán (VNĐ)
                  </th>
                  <th className="py-2 border-b border-gray-300 border-r w-50">
                    Ngày thanh toán
                  </th>
                  <th className="py-2 border-b border-gray-300 border-r w-50">
                    Ngày đáo hạn
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedBatches.map((batch, index) => (
                  <tr
                    key={batch.NumberOfBatch}
                    className="border-b border-gray-300"
                  >
                    <td className="py-2 text-center border-r border-gray-300">
                      {batch.NumberOfBatch}
                    </td>
                    <td className="px-4 py-2 border text-center align-middle">
                      <input
                        type="text"
                        value={batchPaymentRequests[index].Description}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            'Description',
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
                        type="number"
                        value={batchPaymentRequests[index].Percents}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            'Percents',
                            parseFloat(e.target.value),
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
                      {batchPaymentRequests[index].Price.toLocaleString(
                        'vi-VN',
                      )}
                    </td>
                    <td className="py-2 border-r border-gray-300">
                      <input
                        type="date"
                        value={batchPaymentRequests[index].PaymentDate}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            'PaymentDate',
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg bg-transparent py-1 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </td>
                    <td className="py-2 border-r border-gray-300">
                      <input
                        type="date"
                        value={batchPaymentRequests[index].PaymentPhase}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            'PaymentPhase',
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg bg-transparent py-1 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4">
              <h3 className="font-semibold">Ghi chú:</h3>
              <textarea
                value={appendixNote}
                onChange={(e) => setAppendixNote(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                rows={4}
              />
            </div>
            <button
              onClick={handleCreateAppendix}
              className={`mt-4 px-4 py-2 rounded shadow-md ${
                isCreateAppendixEnabled && !isCreatingAppendix
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isCreateAppendixEnabled || isCreatingAppendix}
            >
              {isCreatingAppendix ? 'Đang tạo...' : 'Tạo Phụ Lục'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContractDetailStaff;
