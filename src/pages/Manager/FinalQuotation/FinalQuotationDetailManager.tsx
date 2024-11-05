import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  approveFinalQuotation,
  getFinalQuotation,
} from '../../../api/FinalQuotation/FinalQuotationApi';
import { FinalQuotationDetail as FinalQuotationDetailType } from '../../../types/FinalQuotationTypes';
import BatchPaymentTable from './components/Table/BatchPaymentTable';
import EquipmentTable from './components/Table/EquipmentTable';
import FinalQuotationTable from './components/Table/FinalQuotationTable';
import FinalQuotationStatus from '../../../components/StatusTracker/FinalQuotationStatus';
import {
  FaUser,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaDownload,
  FaShareAlt,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
} from 'react-icons/fa';
import UtilityInfoTable from './components/Table/UtilityInfoTable';
import { Dialog } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FinalQuotationDetailManager = () => {
  const { id } = useParams<{ id: string }>();
  const [quotationDetail, setQuotationDetail] =
    useState<FinalQuotationDetailType | null>(null);
  const [showBatchPayments, setShowBatchPayments] = useState(false);
  const [showEquipmentCosts, setShowEquipmentCosts] = useState(false);
  const [showDetailedItems, setShowDetailedItems] = useState(false);
  const [showUtilities, setShowUtilities] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalType, setApprovalType] = useState('Approved');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchQuotationDetail = async () => {
    if (id) {
      try {
        const data = await getFinalQuotation(id);
        setQuotationDetail(data);
      } catch (error) {
        console.error('Error fetching quotation detail:', error);
        toast.error('Error fetching quotation detail');
      } finally {
        setLoading(false);
      }
    } else {
      console.error('Quotation ID is undefined');
      toast.error('Quotation ID is undefined');
    }
  };

  useEffect(() => {
    fetchQuotationDetail();
  }, [id]);

  const handleApprove = async () => {
    if (!id) {
      console.error('Quotation ID is undefined');
      toast.error('Quotation ID is undefined');
      return;
    }

    try {
      await approveFinalQuotation(id, {
        type: approvalType,
        reason,
      });
      toast.success('Phê duyệt báo giá thành công');
      setIsModalOpen(false);
      fetchQuotationDetail();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.Error) {
        console.error('Error:', error.response.data.Error);
        toast.error(`Error: ${error.response.data.Error}`);
      } else {
        console.error('Error approving quotation:', error);
        toast.error('Error approving quotation');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={'#5BABAC'} loading={true} />
      </div>
    );
  }

  if (!quotationDetail) {
    return <div>Error: Quotation detail not found.</div>;
  }

  const handleDownload = () => {};

  const handleShare = () => {};

  return (
    <div>
      <FinalQuotationStatus currentStatus={quotationDetail.Status} />

      <div className="flex justify-end space-x-2">
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

        {quotationDetail.Status === 'Reviewing' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
          >
            <FaCheck className="text-lg" />
            <span className="ml-2">Phê duyệt</span>
          </button>
        )}
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-8 rounded shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl">
            <Dialog.Title className="text-2xl font-bold">
              Phê duyệt báo giá
            </Dialog.Title>
            <div className="mt-6">
              <select
                value={approvalType}
                onChange={(e) => setApprovalType(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm text-lg"
              >
                <option value="Approved">Approved</option>
                <option value="Reject">Reject</option>
              </select>
            </div>
            <div className="mt-6">
              <label className="block text-lg font-medium text-gray-700">
                Lý do
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm text-lg"
                rows={4}
              />
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded text-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleApprove}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded text-lg"
              >
                Xác nhận
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

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
        {/* Thêm thông tin PromotionInfo */}
        {/* {quotationDetail.PromotionInfo && (
          <div className="mb-2 text-lg flex items-center">
            <span className="font-semibold">Khuyến mãi:</span>
            <span className="text-gray-700 ml-2">
              {quotationDetail.PromotionInfo.Name} -{' '}
              {quotationDetail.PromotionInfo.Percents}%
            </span>
          </div>
        )} */}

        {/* Thêm thông tin ConstructionRough và ConstructionFinished */}
        <div className="mb-2 text-lg">
          <span className="font-semibold">Chi tiết xây dựng:</span>
          <div className="ml-6">
            <div className="text-gray-700">
              <span className="font-semibold">Thô:</span>{' '}
              {quotationDetail.ConstructionRough.TotalPriceRough.toLocaleString()}{' '}
              VNĐ
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">Hoàn thiện:</span>{' '}
              {quotationDetail.ConstructionFinished.TotalPriceRough.toLocaleString()}{' '}
              VNĐ
            </div>
          </div>
        </div>

        {/* Thêm thông tin Equitment */}
        <div className="mb-2 text-lg">
          <span className="font-semibold">Thiết bị:</span>
          <div className="ml-6">
            <div className="text-gray-700">
              <span className="font-semibold">Thô:</span>{' '}
              {quotationDetail.Equitment.TotalPriceRough.toLocaleString()} VNĐ
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">Hoàn thiện:</span>{' '}
              {quotationDetail.Equitment.TotalPriceLabor.toLocaleString()} VNĐ
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer"
          onClick={() => setShowDetailedItems(!showDetailedItems)}
        >
          1. Các hạng mục báo giá chi tiết:
          {showDetailedItems ? (
            <FaChevronUp className="ml-2" />
          ) : (
            <FaChevronDown className="ml-2" />
          )}
        </h3>
        {showDetailedItems && (
          <FinalQuotationTable items={quotationDetail.FinalQuotationItems} />
        )}

        <hr className="my-4 border-gray-300" />
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setShowUtilities(!showUtilities)}
            >
              <strong className="text-xl font-bold">
                2. Tùy chọn & Tiện ích:
              </strong>
              {showUtilities ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </div>
          </div>
        </div>
        {showUtilities && (
          <UtilityInfoTable utilities={quotationDetail.UtilityInfos} />
        )}

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer"
          onClick={() => setShowEquipmentCosts(!showEquipmentCosts)}
        >
          3. Chi Phí Thiết bị:
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
          onClick={() => setShowBatchPayments(!showBatchPayments)}
        >
          4. Các đợt thanh toán:
          {showBatchPayments ? (
            <FaChevronUp className="ml-2" />
          ) : (
            <FaChevronDown className="ml-2" />
          )}
        </h3>
        {showBatchPayments && (
          <BatchPaymentTable payments={quotationDetail.BatchPaymentInfos} />
        )}
      </div>
    </div>
  );
};

export default FinalQuotationDetailManager;
