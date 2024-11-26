import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getContractDesignById,
  paymentContractDesign,
  paymentContractConstruction,
} from '../../../api/Contract/ContractApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  FaFileDownload,
  FaUser,
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

const ContractDetailManager = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const [contractDetail, setContractDetail] =
    useState<ContractDesignResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
  }, [contractId]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    batchNumber: number,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setSelectedBatch(batchNumber);
    }
  };

  const handleUpload = async (index: number) => {
    if (
      contractId &&
      selectedFile &&
      contractDetail &&
      selectedBatch !== null
    ) {
      setIsUploading(true);
      try {
        const paymentId = contractDetail.BatchPayment[selectedBatch].PaymentId;
        if (
          contractDetail.Name ===
          'Hợp đồng tư vấn và thiết kế bản vẽ nhà ở dân dụng'
        ) {
          await paymentContractDesign(paymentId, selectedFile);
        } else if (contractDetail.Name === 'Hợp đồng thi công nhà ở dân dụng') {
          await paymentContractConstruction(paymentId, selectedFile);
        } else {
          throw new Error('Loại hợp đồng không được hỗ trợ để tải lên.');
        }

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
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

  const attachment = contractDetail.UrlFile
    ? {
        icon: <FaPaperclip />,
        label: 'Hợp đồng đã ký',
        value: (
          <a
            href={contractDetail.UrlFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline ml-2"
          >
            <FaFileDownload className="inline-block mr-1" /> Tải xuống
          </a>
        ),
      }
    : null;

  const details = [
    {
      icon: <FaFileDownload />,
      label: 'Mã hợp đồng',
      value: contractDetail.ContractCode,
    },
    {
      icon: <FaUser />,
      label: 'Tên khách hàng',
      value: contractDetail.CustomerName,
    },
    {
      icon: <FaCalendarAlt />,
      label: 'Ngày bắt đầu',
      value: formatDate(contractDetail.StartDate),
    },
    {
      icon: <FaCalendarAlt />,
      label: 'Ngày kết thúc',
      value: formatDate(contractDetail.EndDate),
    },
    {
      icon: <FaClock />,
      label: 'Thời hạn hiệu lực',
      value: `${contractDetail.ValidityPeriod} ngày`,
    },
    {
      icon: <FaRulerCombined />,
      label: 'Diện tích',
      value: `${contractDetail.Area} m²`,
    },
    {
      icon: <FaMoneyBillWave />,
      label: 'Giá trị hợp đồng',
      value: `${contractDetail.ContractValue.toLocaleString()} ${
        contractDetail.UnitPrice
      }`,
    },
    {
      icon: <FaBoxOpen />,
      label: 'Gói thô',
      value: `${contractDetail.RoughPackagePrice.toLocaleString()} ${
        contractDetail.UnitPrice
      }`,
    },
    {
      icon: <FaBox />,
      label: 'Gói hoàn thiện',
      value: `${contractDetail.FinishedPackagePrice.toLocaleString()} ${
        contractDetail.UnitPrice
      }`,
    },
    attachment,
    {
      icon: <FaStickyNote />,
      label: 'Ghi chú',
      value: contractDetail.Note || '',
    },
    {
      icon: <FaInfoCircle />,
      label: 'Mã số thuế',
      value: contractDetail.TaxCode || '',
    },
    {
      icon: <FaInfoCircle />,
      label:
        contractDetail.Name ===
        'Hợp đồng tư vấn và thiết kế bản vẽ nhà ở dân dụng'
          ? 'Bảng báo giá sơ bộ nhà ở dân dụng'
          : contractDetail.Name === 'Hợp đồng thi công nhà ở dân dụng'
          ? 'Bảng báo giá chi tiết nhà ở dân dụng'
          : 'Báo giá chi tiết',
      value: (
        <a
          href={contractDetail.Quotation.File}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline ml-2"
        >
          <FaFileDownload className="inline-block mr-1" /> Tải xuống
        </a>
      ),
    },
  ].filter(Boolean);

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
            Tạo lúc {formatDate(contractDetail.StartDate)}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((item, index) => (
            <div
              key={index}
              className="mb-4 text-lg flex items-center bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              {item && (
                <>
                  {item.icon}
                  <span className="font-semibold ml-2">{item.label}:</span>
                  <span className="text-gray-700 ml-2">{item.value}</span>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Thanh toán đợt</h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Đợt</th>
                <th className="px-4 py-2 border text-center">Mô tả</th>
                <th className="px-4 py-2 border text-center">Giá</th>
                <th className="px-4 py-2 border text-center">
                  Ngày thanh toán
                </th>
                <th className="px-4 py-2 border text-center">
                  Giai đoạn thanh toán
                </th>
                <th className="px-4 py-2 border text-center">Hóa đơn</th>
              </tr>
            </thead>
            <tbody>
              {contractDetail.BatchPayment.map((batch, index) => (
                <tr key={batch.NumberOfBatch} className="text-center">
                  <td className="px-4 py-2 border">{batch.NumberOfBatch}</td>
                  <td className="px-4 py-2 border">{batch.Description}</td>
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
                      'Chưa có hóa đơn'
                    )}
                  </td>
                  {batch.InvoiceImage === 'Chưa có hóa đơn' && (
                    <td className="px-4 py-2 border">
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, index)}
                          className="ml-2"
                        />
                        <button
                          onClick={() => handleUpload(index)}
                          className="ml-2 bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark"
                          disabled={isUploading}
                        >
                          {isUploading ? 'Đang tải lên...' : <FaUpload />}
                        </button>
                      </>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ContractDetailManager;
