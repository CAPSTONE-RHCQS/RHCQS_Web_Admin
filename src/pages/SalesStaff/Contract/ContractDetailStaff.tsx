import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getContractDesignById,
  signContractCompletion,
} from '../../../api/Contract/ContractApi';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  FaFileDownload,
  FaUser,
  FaMapMarkerAlt,
  FaRulerCombined,
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
} from 'react-icons/fa';
import ContractStatusTracker from '../../../components/StatusTracker/ContractStatusTracker';
import { ContractDesignResponse } from '../../../types/ContractResponseTypes';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContractDetailStaff = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const [contractDetail, setContractDetail] =
    useState<ContractDesignResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
          <h2 className="text-2xl font-bold">{contractDetail.Name}</h2>
          <span className="text-gray-500 text-sm">
            Tạo lúc {new Date(contractDetail.StartDate).toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 text-lg flex items-center">
            <FaFileDownload className="mr-2" />
            <span className="font-semibold">Mã hợp đồng:</span>
            <span className="text-gray-700 ml-2">
              {contractDetail.ContractCode}
            </span>
          </div>
          <div className="mb-4 text-lg flex items-center">
            <FaUser className="mr-2" />
            <span className="font-semibold">Tên khách hàng:</span>
            <span className="text-gray-700 ml-2">
              {contractDetail.CustomerName}
            </span>
          </div>
          <div className="mb-4 text-lg flex items-center">
            <FaCalendarAlt className="mr-2" />
            <span className="font-semibold">Ngày bắt đầu:</span>
            <span className="text-gray-700 ml-2">
              {new Date(contractDetail.StartDate).toLocaleDateString()}
            </span>
          </div>
          <div className="mb-4 text-lg flex items-center">
            <FaCalendarAlt className="mr-2" />
            <span className="font-semibold">Ngày kết thúc:</span>
            <span className="text-gray-700 ml-2">
              {new Date(contractDetail.EndDate).toLocaleDateString()}
            </span>
          </div>
          <div className="mb-4 text-lg flex items-center">
            <FaClock className="mr-2" />
            <span className="font-semibold">Thời hạn hiệu lực:</span>
            <span className="text-gray-700 ml-2">
              {contractDetail.ValidityPeriod} ngày
            </span>
          </div>
          <div className="mb-4 text-lg flex items-center">
            <FaRulerCombined className="mr-2" />
            <span className="font-semibold">Diện tích:</span>
            <span className="text-gray-700 ml-2">{contractDetail.Area} m²</span>
          </div>
          <div className="mb-4 text-lg flex items-center">
            <FaMoneyBillWave className="mr-2" />
            <span className="font-semibold">Giá trị hợp đồng:</span>
            <span className="text-gray-700 ml-2">
              {contractDetail.ContractValue || 'Chưa xác định'}
            </span>
          </div>
          <div className="mb-4 text-lg flex items-center">
            <FaBoxOpen className="mr-2" />
            <span className="font-semibold">Gói thô:</span>
            <span className="text-gray-700 ml-2">
              {contractDetail.RoughPackagePrice} {contractDetail.UnitPrice}
            </span>
          </div>
          <div className="mb-4 text-lg flex items-center">
            <FaBox className="mr-2" />
            <span className="font-semibold">Gói hoàn thiện:</span>
            <span className="text-gray-700 ml-2">
              {contractDetail.FinishedPackagePrice} {contractDetail.UnitPrice}
            </span>
          </div>
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
          <div className="mb-4 text-lg flex items-center">
            <FaInfoCircle className="mr-2" />
            <span className="font-semibold">Mã số thuế:</span>
            <span className="text-gray-700 ml-2">
              {contractDetail.TaxCode || ''}
            </span>
          </div>
          <div className="mb-4 col-span-full text-lg flex items-center">
            <FaStickyNote className="mr-2" />
            <span className="font-semibold">Ghi chú:</span>
            <span className="text-gray-700 ml-2">
              {contractDetail.Note || ''}
            </span>
          </div>
          {contractDetail.Quotation.File !== '' && (
            <div className="mb-4 text-lg flex items-center">
              <FaInfoCircle className="mr-2" />
              <span className="font-semibold">
                {contractDetail.Name ===
                'Hợp đồng tư vấn và thiết kế bản vẽ nhà ở dân dụng'
                  ? 'Bảng báo giá sơ bộ nhà ở dân dụng'
                  : contractDetail.Name === 'Hợp đồng thi công nhà ở dân dụng'
                  ? 'Bảng báo giá chi tiết nhà ở dân dụng'
                  : ''}
              </span>
              <a
                href={contractDetail.Quotation.File}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline ml-2"
              >
                <FaFileDownload className="inline-block mr-1" /> Tải xuống
              </a>
            </div>
          )}
        </div>

        {contractDetail.UrlFile === null && (
          <div className="mb-4 text-lg flex items-center">
            <FaUpload className="mr-2" />
            <span className="font-semibold">Tải lên Hợp đồng đã ký:</span>
            <input type="file" onChange={handleFileChange} className="ml-2" />
            <button
              onClick={handleUpload}
              className="ml-2 bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark"
              disabled={isUploading}
            >
              {isUploading ? 'Đang tải lên...' : 'Tải lên'}
            </button>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Thanh toán đợt</h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Đợt</th>
                <th className="px-4 py-2 border text-center">Mô tả</th>
                <th className="px-4 py-2 border text-center">Giá</th>
                <th className="px-4 py-2 border text-center">Hóa đơn</th>
              </tr>
            </thead>
            <tbody>
              {contractDetail.BatchPayment.map((batch) => (
                <tr key={batch.NumberOfBatch} className="text-center">
                  <td className="px-4 py-2 border">{batch.NumberOfBatch}</td>
                  <td className="px-4 py-2 border">{batch.Description}</td>
                  <td className="px-4 py-2 border">
                    {batch.Price} {contractDetail.UnitPrice}
                  </td>
                  <td className="px-4 py-2 border">
                    {batch.InvoiceImage !== 'Chưa có hóa đơn' ? (
                      <img
                        src={batch.InvoiceImage}
                        alt={`Invoice for ${batch.Description}`}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    ) : (
                      'Chưa có hóa đơn'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ContractDetailStaff;
