import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getContractDesignById,
  paymentContractDesign,
  approveContractBill,
} from '../../../api/Contract/ContractApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { ContractDesignResponse } from '../../../types/ContractResponseTypes';

const ContractDetailManager = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const [contractDetail, setContractDetail] =
    useState<ContractDesignResponse | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: number]: File | null;
  }>({});
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  useEffect(() => {
    fetchContractDetail();
    const interval = setInterval(fetchContractDetail, 2000);

    return () => clearInterval(interval);
  }, [contractId]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    batchNumber: number,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [batchNumber]: file,
      }));
      if (contractDetail && batchNumber < contractDetail.BatchPayment.length) {
        setSelectedBatch(batchNumber);
      } else {
        console.error('Batch number không hợp lệ');
      }
    }
  };

  const handleUpload = async (index: number) => {
    if (contractId && selectedFiles[index] && contractDetail) {
      setIsUploading(true);
      try {
        const appendix = contractDetail.BatchPayment?.[index];
        if (!appendix) {
          throw new Error('Không tìm thấy đợt thanh toán tương ứng.');
        }

        const paymentId = appendix.PaymentId;

        await paymentContractDesign(paymentId, selectedFiles[index]);

        toast.success('Tải lên thành công!');
        fetchContractDetail();
      } catch (error) {
        console.error('Error uploading signed contract:', error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Tải lên thất bại!');
        }
      } finally {
        setIsUploading(false);
      }
    } else {
      toast.error('Vui lòng chọn file và kiểm tra thông tin hợp đồng.');
    }
  };

  const handleUploadAppendices = async (index: number) => {
    if (contractId && selectedFiles[index] && contractDetail) {
      setIsUploading(true);
      try {
        const appendix = contractDetail.BatchPaymentAppendices?.[index];
        if (!appendix) {
          throw new Error('Không tìm thấy phụ lục tương ứng.');
        }

        const paymentId = appendix.PaymentId;

        await paymentContractDesign(paymentId, selectedFiles[index]);

        toast.success('Tải lên thành công!');
        fetchContractDetail();
      } catch (error) {
        console.error('Error uploading signed contract:', error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Tải lên thất bại!');
        }
      } finally {
        setIsUploading(false);
      }
    } else {
      toast.error('Vui lòng chọn file và kiểm tra thông tin hợp đồng.');
    }
  };

  const handleApproveBill = async (paymentId: string, type: string) => {
    try {
      await approveContractBill(paymentId, type);
      toast.success('Hóa đơn đã được xác nhận!');
      fetchContractDetail();
    } catch (error) {
      console.error('Error approving contract bill:', error);
      toast.error('Xác nhận hóa đơn thất bại!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const truncateFileName = (fileName: string, maxLength: number) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.slice(fileName.lastIndexOf('.'));
    return fileName.slice(0, maxLength - extension.length) + '...' + extension;
  };

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

      <div className="mt-6">
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
            {contractDetail.BatchPayment?.map((batch, index) => (
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
                  {batch.InvoiceImage !== 'Chưa có hóa đơn' &&
                  batch.Status !== 'Progress' ? (
                    <img
                      src={batch.InvoiceImage}
                      alt={`Invoice for ${batch.Description}`}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  ) : batch.InvoiceImage === 'Chưa có hóa đơn' &&
                    batch.Status === 'Progress' ? (
                    <>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, index)}
                        className="hidden"
                        id={`fileInput-${index}`}
                        accept="image/*"
                      />
                      <button
                        onClick={() =>
                          document.getElementById(`fileInput-${index}`)?.click()
                        }
                        className="ml-2 bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primaryDarkGreen"
                      >
                        Chọn tệp
                      </button>
                      {selectedFiles[index] && (
                        <span className="ml-2 text-gray-700">
                          {truncateFileName(selectedFiles[index]?.name, 20)}
                        </span>
                      )}
                      <button
                        onClick={() => handleUpload(index)}
                        className="ml-2 bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primaryDarkGreen"
                        disabled={!selectedFiles[index] || isUploading}
                      >
                        {isUploading ? 'Đang tải lên...' : <FaUpload />}
                      </button>
                      <p className="text-gray-500 text-sm mt-1">
                        Chỉ chấp nhận file hình ảnh <br />
                        (JPG, PNG, GIF).
                      </p>
                    </>
                  ) : batch.InvoiceImage !== 'Chưa có hóa đơn' &&
                    batch.Status === 'Progress' ? (
                    <>
                      <img
                        src={batch.InvoiceImage}
                        alt={`Invoice for ${batch.Description}`}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                      <button
                        onClick={() =>
                          handleApproveBill(batch.PaymentId, 'Approved')
                        }
                        className="bg-green-500 text-white px-4 py-2 mt-3 rounded shadow-md hover:bg-green-600"
                      >
                        Xác nhận
                      </button>
                    </>
                  ) : (
                    <></>
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
        <div className="mt-6">
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
              {contractDetail.BatchPaymentAppendices?.map((appendix, index) => (
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
                    ) : appendix.InvoiceImage === 'Chưa có hóa đơn' &&
                      appendix.Status === 'Progress' ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, index)}
                          className="hidden"
                          id={`fileInput-${index}`}
                          accept="image/*"
                        />
                        <button
                          onClick={() =>
                            document
                              .getElementById(`fileInput-${index}`)
                              ?.click()
                          }
                          className="ml-2 bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark"
                        >
                          Chọn tệp
                        </button>
                        {selectedFiles[index] && (
                          <span className="ml-2 text-gray-700">
                            {truncateFileName(selectedFiles[index]?.name, 20)}
                          </span>
                        )}
                        <button
                          onClick={() => handleUploadAppendices(index)}
                          className="ml-2 bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark"
                          disabled={!selectedFiles[index] || isUploading}
                        >
                          {isUploading ? 'Đang tải lên...' : <FaUpload />}
                        </button>
                        <p className="text-gray-500 text-sm mt-1">
                          Chỉ chấp nhận file hình ảnh <br />
                          (JPG, PNG, GIF).
                        </p>
                      </>
                    ) : appendix.InvoiceImage !== 'Chưa có hóa đơn' &&
                      appendix.Status === 'Progress' ? (
                      <>
                        <img
                          src={appendix.InvoiceImage}
                          alt={`Invoice for ${appendix.Description}`}
                          className="w-16 h-16 object-cover mx-auto"
                        />
                        <button
                          onClick={() =>
                            handleApproveBill(appendix.PaymentId, 'Approved')
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600"
                        >
                          Xác nhận
                        </button>
                      </>
                    ) : (
                      <></>
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
              ))}{' '}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ContractDetailManager;
