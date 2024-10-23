import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContractDesignById } from '../../../api/Contract/ContractApi';
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
} from 'react-icons/fa';
import ContractStatusTracker from '../../../components/StatusTracker/ContractStatusTracker';

const ContractDetail = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const [contractDetail, setContractDetail] = useState<any | null>(null);

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

  if (!contractDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={'#123abc'} loading={true} />
      </div>
    );
  }

  const statusMap: { [key: string]: string } = {
    Processing: 'Chờ xác nhận từ quản lý',
    Created: 'Đã tạo hợp đồng',
    Completed: 'Hoàn thành',
    Ended: 'Chấm dứt hợp đồng',
  };

  const mappedStatus =
    statusMap[contractDetail.Status] || 'Chờ xác nhận từ quản lý';

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
            <FaInfoCircle className="mr-2" />
            <span className="font-semibold">Trạng thái:</span>
            <span className="text-gray-700 ml-2">{contractDetail.Status}</span>
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
          <div className="mb-4 text-lg flex items-center">
            <FaFileContract className="mr-2" />
            <span className="font-semibold">Loại hợp đồng:</span>
            <span className="text-gray-700 ml-2">{contractDetail.Type}</span>
          </div>
          <div className="mb-4 text-lg flex items-center">
            <FaPaperclip className="mr-2" />
            <span className="font-semibold">Tệp đính kèm:</span>
            <a
              href={contractDetail.UrlFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-2"
            >
              <FaFileDownload className="inline-block mr-1" /> Tải xuống
            </a>
          </div>
          <div className="mb-4 col-span-full text-lg flex items-center">
            <FaStickyNote className="mr-2" />
            <span className="font-semibold">Ghi chú:</span>
            <span className="text-gray-700 ml-2">
              {contractDetail.Note || 'Không có ghi chú'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContractDetail;
