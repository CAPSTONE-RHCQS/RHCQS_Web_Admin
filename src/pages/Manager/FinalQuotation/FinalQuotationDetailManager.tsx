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
  FaCommentDots,
} from 'react-icons/fa';
import UtilityInfoTable from './components/Table/UtilityInfoTable';
import ApprovalDialog from '../../../components/Modals/ApprovalDialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatBox from '../../../components/ChatBox';
import PromotionTable from './components/Table/PromotionTable';
import ContractValueSummary from './components/Table/ContractValueSummary';
import { getStatusLabelFinalQuoteDetail } from '../../../utils/utils';
import ConstructionAreaTable from './components/Table/ConstructionAreaTable';

const FinalQuotationDetailManager = () => {
  const { id } = useParams<{ id: string }>();
  const [quotationDetail, setQuotationDetail] =
    useState<FinalQuotationDetailType | null>(null);
  const [showContractValueSummary, setShowContractValueSummary] =
    useState(true);
  const [showBatchPayments, setShowBatchPayments] = useState(true);
  const [showEquipmentCosts, setShowEquipmentCosts] = useState(true);
  const [showDetailedItems, setShowDetailedItems] = useState(true);
  const [showConstructionAreaTable, setShowConstructionAreaTable] =
    useState(true);
  const [showUtilities, setShowUtilities] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [approvalType, setApprovalType] = useState('Approved');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPromotions, setShowPromotions] = useState(true);
  const [totalConstructionValue, setTotalConstructionValue] = useState(0);
  const [totalUtilities, setTotalUtilities] = useState(0);
  const [totalEquipmentCost, setTotalEquipmentCost] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

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

  useEffect(() => {
    if (quotationDetail) {
      const totalConstruction = quotationDetail.FinalQuotationItems.reduce(
        (acc, item) =>
          acc +
          item.QuotationItems.reduce(
            (subAcc, qItem) =>
              subAcc +
              (qItem.TotalPriceLabor || 0) +
              (qItem.TotalPriceRough || 0),
            0,
          ),
        0,
      );

      const totalUtilities = quotationDetail.UtilityInfos.reduce(
        (total, util) => total + (util.Price || 0),
        0,
      );

      const totalEquipment = quotationDetail.EquipmentItems.reduce(
        (total, item) => total + (item.Quantity * item.UnitOfMaterial || 0),
        0,
      );

      const totalDiscount = quotationDetail.Discount ?? 0;

      setTotalConstructionValue(totalConstruction);
      setTotalUtilities(totalUtilities);
      setTotalEquipmentCost(totalEquipment);
      setTotalDiscount(totalDiscount);
    }
  }, [quotationDetail]);

  const totalContractValue =
    totalConstructionValue +
    totalUtilities +
    totalEquipmentCost -
    totalDiscount;

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

      if (approvalType === 'Approved') {
        toast.success('Chấp nhận báo giá thành công');
      } else if (approvalType === 'Rejected') {
        toast.success('Từ chối báo giá thành công');
      }

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

  const toggleChat = () => {
    setShowChat(!showChat);
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
    <div className="bg-gray-100 min-h-screen">
      {!showChat && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <FaCommentDots className="text-2xl" />
        </button>
      )}

      {showChat && quotationDetail && (
        <ChatBox
          onClose={toggleChat}
          accountName={quotationDetail.AccountName}
          note={quotationDetail.Note}
        />
      )}

      <FinalQuotationStatus
        currentStatus={getStatusLabelFinalQuoteDetail(quotationDetail.Status)}
      />

      <div className="flex justify-end space-x-2 mb-4">
        {quotationDetail.Status === 'Reviewing' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center transition-colors duration-200"
          >
            <FaCheck className="text-lg" />
            <span className="ml-2">Phê duyệt</span>
          </button>
        )}
      </div>

      <ApprovalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        approvalType={approvalType}
        setApprovalType={setApprovalType}
        reason={reason}
        setReason={setReason}
        onSubmit={handleApprove}
      />

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">
            Thông tin báo giá chi tiết
          </h2>
          <div className="text-right">
            <div className="flex justify-end space-x-2 mb-4">
              <button
                onClick={handleDownload}
                className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center transition-colors duration-200"
              >
                <FaDownload className="text-lg" />
              </button>

              <button
                onClick={handleShare}
                className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center transition-colors duration-200"
              >
                <FaShareAlt className="text-lg" />
              </button>
            </div>
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
          <FaUser className="mr-2 text-secondary" />
          <span className="font-semibold">Tên khách hàng:</span>
          <span className="text-gray-700 ml-2">
            {quotationDetail.AccountName}
          </span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMapMarkerAlt className="mr-2 text-secondary" />
          <span className="font-semibold">Địa chỉ thi công:</span>
          <span className="text-gray-700 ml-2">
            {quotationDetail.ProjectAddress}
          </span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMoneyBillWave className="mr-2 text-secondary" />
          <span className="font-semibold">Tổng chi phí:</span>
          <span className="text-gray-700 ml-2">
            {quotationDetail.TotalPrice.toLocaleString()} VNĐ
          </span>
        </div>

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() =>
            setShowConstructionAreaTable(!showConstructionAreaTable)
          }
        >
          1. Tổng diện tích xây dựng theo phương án thiết kế:
          {showConstructionAreaTable ? (
            <FaChevronUp className="ml-2 text-secondary" />
          ) : (
            <FaChevronDown className="ml-2 text-secondary" />
          )}
        </h3>
        {showConstructionAreaTable && (
          <ConstructionAreaTable
            initQuotationInfos={quotationDetail.InitQuotationInfos}
          />
        )}

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() => setShowDetailedItems(!showDetailedItems)}
        >
          2. Các hạng mục báo giá chi tiết:
          {showDetailedItems ? (
            <FaChevronUp className="ml-2 text-secondary" />
          ) : (
            <FaChevronDown className="ml-2 text-secondary" />
          )}
        </h3>
        {showDetailedItems && (
          <FinalQuotationTable items={quotationDetail.FinalQuotationItems} />
        )}

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() => setShowUtilities(!showUtilities)}
        >
          3. Tùy chọn & Tiện ích:
          {showUtilities ? (
            <FaChevronUp className="ml-2 text-secondary" />
          ) : (
            <FaChevronDown className="ml-2 text-secondary" />
          )}
        </h3>
        {showUtilities && (
          <UtilityInfoTable utilities={quotationDetail.UtilityInfos} />
        )}

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() => setShowEquipmentCosts(!showEquipmentCosts)}
        >
          4. Chi Phí Thiết bị:
          {showEquipmentCosts ? (
            <FaChevronUp className="ml-2 text-secondary" />
          ) : (
            <FaChevronDown className="ml-2 text-secondary" />
          )}
        </h3>
        {showEquipmentCosts && (
          <EquipmentTable items={quotationDetail.EquipmentItems} />
        )}

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() => setShowPromotions(!showPromotions)}
        >
          5. Khuyến mãi:
          {showPromotions ? (
            <FaChevronUp className="ml-2 text-secondary" />
          ) : (
            <FaChevronDown className="ml-2 text-secondary" />
          )}
        </h3>
        {showPromotions && (
          <PromotionTable
            promotionInfo={quotationDetail.PromotionInfo}
            discount={quotationDetail.Discount}
          />
        )}

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() => setShowContractValueSummary(!showContractValueSummary)}
        >
          6. Tổng hợp giá trị hợp đồng:
          {showContractValueSummary ? (
            <FaChevronUp className="ml-2 text-secondary" />
          ) : (
            <FaChevronDown className="ml-2 text-secondary" />
          )}
        </h3>
        {showContractValueSummary && (
          <ContractValueSummary
            totalConstructionValue={totalConstructionValue}
            totalUtilities={totalUtilities}
            totalEquipmentCost={totalEquipmentCost}
            totalDiscount={totalDiscount}
            totalContractValue={totalContractValue}
          />
        )}

        <hr className="my-4 border-gray-300" />

        <h3
          className="text-xl font-bold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() => setShowBatchPayments(!showBatchPayments)}
        >
          7. Các đợt thanh toán:
          {showBatchPayments ? (
            <FaChevronUp className="ml-2 text-secondary" />
          ) : (
            <FaChevronDown className="ml-2 text-secondary" />
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
