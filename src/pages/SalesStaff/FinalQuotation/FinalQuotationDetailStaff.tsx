import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { getFinalQuotation } from '../../../api/Project/FinalQuotationApi';
import { FinalQuotationDetail as FinalQuotationDetailType } from '../../../types/QuotationTypes';
import BatchPaymentTable from './Table/BatchPaymentTable';
import EquipmentTable from './Table/EquipmentTable';
import FinalQuotationTable from './Table/FinalQuotationTable';
import FinalQuotationStatus from '../../../components/StatusTracker/FinalQuotationStatus';
import {
  FaUser,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaDownload,
  FaShareAlt,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

const FinalQuotationDetailStaff = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [quotationDetail, setQuotationDetail] =
    useState<FinalQuotationDetailType | null>(null);
  const [showBatchPayments, setShowBatchPayments] = useState(false);
  const [showEquipmentCosts, setShowEquipmentCosts] = useState(false);
  const [showDetailedItems, setShowDetailedItems] = useState(false);

  useEffect(() => {
    const fetchQuotationDetail = async () => {
      if (id) {
        try {
          const data = await getFinalQuotation(id);
          setQuotationDetail(data);
        } catch (error) {
          console.error('Error fetching quotation detail:', error);
        }
      } else {
        console.error('Quotation ID is undefined');
      }
    };

    fetchQuotationDetail();
  }, [id]);

  if (!quotationDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={'#5BABAC'} loading={true} />
      </div>
    );
  }

  const handleDownload = () => {
    // Logic tải xuống
  };

  const handleShare = () => {
    // Logic chia sẻ
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <FinalQuotationStatus currentStatus={quotationDetail.Status} />

      <div className="flex justify-end space-x-2">
        <button
          onClick={handleEditToggle}
          className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
        >
          {isEditing ? 'Lưu' : 'Chỉnh sửa'}
        </button>
        <button
          onClick={handleDownload}
          className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
        >
          <FaDownload className="text-lg" />
        </button>

        <button
          onClick={handleShare}
          className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
        >
          <FaShareAlt className="text-lg" />
        </button>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Thông tin báo giá chi tiết</h2>
          <div className="text-right">
            <span className="font-semibold">Phiên bản:</span>
            <span className="text-gray-700 ml-2">
              {quotationDetail.Version}
            </span>
            <div className="text-gray-500 text-sm">
              Tạo lúc {new Date(quotationDetail.InsDate).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mb-2 text-lg flex items-center">
          <FaUser className="mr-2" />
          <span className="font-semibold">Tên khách hàng:</span>
          <span className="text-gray-700 ml-2">
            {quotationDetail.AccountName}
          </span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          <span className="font-semibold">Địa chỉ thi công:</span>
          <span className="text-gray-700 ml-2">
            {quotationDetail.ProjectAddress}
          </span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMoneyBillWave className="mr-2" />
          <span className="font-semibold">Tổng chi phí:</span>
          <span className="text-gray-700 ml-2">
            {quotationDetail.TotalPrice.toLocaleString()} VNĐ
          </span>
        </div>
        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer"
          onClick={() => setShowBatchPayments(!showBatchPayments)}
        >
          1. Các đợt thanh toán:
          {showBatchPayments ? (
            <FaChevronUp className="ml-2" />
          ) : (
            <FaChevronDown className="ml-2" />
          )}
        </h3>
        {showBatchPayments && (
          <BatchPaymentTable payments={quotationDetail.BatchPaymentInfos} />
        )}

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer"
          onClick={() => setShowEquipmentCosts(!showEquipmentCosts)}
        >
          2. Chi Phí Thiết bị:
          {showEquipmentCosts ? (
            <FaChevronUp className="ml-2" />
          ) : (
            <FaChevronDown className="ml-2" />
          )}
        </h3>
        {showEquipmentCosts && (
          <EquipmentTable items={quotationDetail.EquipmentItems} />
        )}

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer"
          onClick={() => setShowDetailedItems(!showDetailedItems)}
        >
          3. Các hạng mục báo giá chi tiết:
          {showDetailedItems ? (
            <FaChevronUp className="ml-2" />
          ) : (
            <FaChevronDown className="ml-2" />
          )}
        </h3>
        {showDetailedItems && (
          <FinalQuotationTable items={quotationDetail.FinalQuotationItems} />
        )}
      </div>
    </div>
  );
};

export default FinalQuotationDetailStaff;
