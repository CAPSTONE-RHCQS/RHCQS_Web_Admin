import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { getFinalQuotation } from '../../../api/FinalQuotation/FinalQuotationApi';
import {
  FinalQuotationDetail as FinalQuotationDetailType,
  UtilityInfo,
  EquipmentItem,
  BatchPaymentInfo,
  FinalQuotationItem,
} from '../../../types/FinalQuotationTypes';
import BatchPaymentTable from './Table/BatchPaymentTable';
import EquipmentTable from './Table/EquipmentTable';
import FinalQuotationTable from './Table/FinalQuotationTable';
import UtilityInfoTable from './Table/UtilityInfoTable';
import FinalQuotationStatus from '../../../components/StatusTracker/FinalQuotationStatus';
import {
  FaUser,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import ButtonGroup from './ButtonGroup';
import { handleSave, handleEditToggle } from './handlers';

const FinalQuotationDetailStaff = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [quotationDetail, setQuotationDetail] =
    useState<FinalQuotationDetailType | null>(null);
  const [showBatchPayments, setShowBatchPayments] = useState(false);
  const [showEquipmentCosts, setShowEquipmentCosts] = useState(false);
  const [showDetailedItems, setShowDetailedItems] = useState(false);
  const [showUtilities, setShowUtilities] = useState(false);

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

  const handleUtilitiesChange = (updatedUtilities: UtilityInfo[]) => {
    if (quotationDetail) {
      setQuotationDetail({
        ...quotationDetail,
        UtilityInfos: updatedUtilities,
      });
    }
  };

  const handleEquipmentItemsChange = (updatedItems: EquipmentItem[]) => {
    if (quotationDetail) {
      setQuotationDetail({
        ...quotationDetail,
        EquipmentItems: updatedItems,
      });
    }
  };

  const handleBatchPaymentsChange = (updatedPayments: BatchPaymentInfo[]) => {
    if (quotationDetail) {
      setQuotationDetail({
        ...quotationDetail,
        BatchPaymentInfos: updatedPayments,
      });
    }
  };

  const addBatchPaymentRow = () => {
    if (quotationDetail) {
      const newPayment: BatchPaymentInfo = {
        PaymentId: '',
        PaymentTypeId: '',
        PaymentTypeName: '',
        ContractId: '',
        InsDate: new Date().toISOString(),
        Status: 'Pending',
        UpsDate: new Date().toISOString(),
        Description: '',
        Percents: '0',
        Price: 0,
        Unit: 'VNĐ',
        PaymentDate: new Date().toISOString(),
        PaymentPhase: new Date().toISOString(),
      };
      const updatedPayments = [
        ...quotationDetail.BatchPaymentInfos,
        newPayment,
      ];
      setQuotationDetail({
        ...quotationDetail,
        BatchPaymentInfos: updatedPayments,
      });
      console.log('Added new payment row:', newPayment);
    } else {
      console.error('Quotation detail is null');
    }
  };

  const handleFinalQuotationItemsChange = (
    updatedItems: FinalQuotationItem[],
  ) => {
    if (quotationDetail) {
      setQuotationDetail({
        ...quotationDetail,
        FinalQuotationItems: updatedItems,
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setShowBatchPayments(true);
      setShowEquipmentCosts(true);
      setShowDetailedItems(true);
      setShowUtilities(true);
    }
  };

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

  const addUtilityRow = () => {
    if (quotationDetail) {
      const newUtility: UtilityInfo = {
        Id: '',
        utilitiesItemId: '',
        utilitiesSectionId: '',
        Name: '',
        Coefficient: 0,
        UnitPrice: 0,
        Price: 0,
        Unit: '',
        Description: '',
      };
      const updatedUtilities = [...quotationDetail.UtilityInfos, newUtility];
      setQuotationDetail({
        ...quotationDetail,
        UtilityInfos: updatedUtilities,
      });
    }
  };

  const addConstructionRow = () => {
    if (quotationDetail) {
      const newConstruction: FinalQuotationItem = {
        Id: '',
        ConstructionId: '',
        ContructionName: '',
        SubConstructionId: '',
        Coefficient: 0,
        Type: '',
        InsDate: new Date().toISOString(),
        QuotationItems: [],
      };
      const updatedItems = [
        ...quotationDetail.FinalQuotationItems,
        newConstruction,
      ];
      setQuotationDetail({
        ...quotationDetail,
        FinalQuotationItems: updatedItems,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <FinalQuotationStatus currentStatus={quotationDetail.Status} />

      <ButtonGroup
        isEditing={isEditing}
        isSaving={isSaving}
        handleSave={() =>
          handleSave(quotationDetail, setIsEditing, setIsSaving)
        }
        handleEditToggle={handleEditToggle}
        handleDownload={handleDownload}
        handleShare={handleShare}
      />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">
            Thông tin báo giá chi tiết
          </h2>
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
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center justify-between w-full"
              onClick={() => setShowDetailedItems(!showDetailedItems)}
            >
              <h3 className="text-xl font-bold flex items-center cursor-pointer text-primary">
                1. Các hạng mục báo giá chi tiết:
                {showDetailedItems ? (
                  <FaChevronUp className="ml-2 text-secondary" />
                ) : (
                  <FaChevronDown className="ml-2 text-secondary" />
                )}
              </h3>
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addConstructionRow();
                  }}
                  className="ml-4 bg-primaryGreenButton text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
                >
                  <FaPlus />
                </button>
              )}
            </div>
          </div>
        </div>
        {showDetailedItems && (
          <FinalQuotationTable
            items={quotationDetail.FinalQuotationItems}
            onItemsChange={handleFinalQuotationItemsChange}
            isEditing={isEditing}
          />
        )}

        <hr className="my-4 border-gray-300" />
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center justify-between w-full"
              onClick={() => setShowUtilities(!showUtilities)}
            >
              <h3 className="text-xl font-bold flex items-center cursor-pointer text-primary">
                2. Tùy chọn & Tiện ích:
                {showUtilities ? (
                  <FaChevronUp className="ml-2 text-secondary" />
                ) : (
                  <FaChevronDown className="ml-2 text-secondary" />
                )}
              </h3>
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addUtilityRow();
                  }}
                  className="ml-4 bg-primaryGreenButton text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
                >
                  <FaPlus />
                </button>
              )}
            </div>
          </div>
        </div>
        {showUtilities && (
          <UtilityInfoTable
            utilities={quotationDetail.UtilityInfos}
            isEditing={isEditing}
            onUtilitiesChange={handleUtilitiesChange}
          />
        )}

        <hr className="my-4 border-gray-300" />
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center justify-between w-full"
              onClick={() => setShowEquipmentCosts(!showEquipmentCosts)}
            >
              <h3 className="text-xl font-bold flex items-center cursor-pointer text-primary">
                3. Chi Phí Thiết bị:
                {showEquipmentCosts ? (
                  <FaChevronUp className="ml-2 text-secondary" />
                ) : (
                  <FaChevronDown className="ml-2 text-secondary" />
                )}
              </h3>
            </div>
          </div>
        </div>
        {showEquipmentCosts && (
          <EquipmentTable
            items={quotationDetail.EquipmentItems}
            isEditing={isEditing}
            onItemsChange={handleEquipmentItemsChange}
          />
        )}
        <hr className="my-4 border-gray-300" />
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center justify-between w-full"
              onClick={() => setShowBatchPayments(!showBatchPayments)}
            >
              <h3 className="text-xl font-bold flex items-center cursor-pointer text-primary">
                4. Các đợt thanh toán:
                {showBatchPayments ? (
                  <FaChevronUp className="ml-2 text-secondary" />
                ) : (
                  <FaChevronDown className="ml-2 text-secondary" />
                )}
              </h3>
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addBatchPaymentRow();
                  }}
                  className="ml-4 bg-primaryGreenButton text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
                >
                  <FaPlus />
                </button>
              )}
            </div>
          </div>
        </div>
        {showBatchPayments && (
          <BatchPaymentTable
            payments={quotationDetail.BatchPaymentInfos}
            isEditing={isEditing}
            totalPrice={quotationDetail.TotalPrice}
            onPaymentsChange={handleBatchPaymentsChange}
          />
        )}
      </div>
    </div>
  );
};

export default FinalQuotationDetailStaff;
