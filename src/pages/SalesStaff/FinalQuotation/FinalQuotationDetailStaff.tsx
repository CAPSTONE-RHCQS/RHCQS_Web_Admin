import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { getFinalQuotation } from '../../../api/FinalQuotation/FinalQuotationApi';
import {
  FinalQuotationDetail as FinalQuotationDetailType,
  UtilityInfo,
  EquipmentItem,
  BatchPaymentInfo,
  FinalQuotationItem,
  PromotionInfo,
} from '../../../types/FinalQuotationTypes';
import BatchPaymentTable from './components/Table/BatchPaymentTable';
import EquipmentTable from './components/Table/EquipmentTable';
import FinalQuotationTable from './components/Table/FinalQuotationTable';
import UtilityInfoTable from './components/Table/UtilityInfoTable';
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
import ButtonGroup from './components/Button/ButtonGroup';
import { handleSeva } from './components/handlers';
import ChatBox from '../../../components/ChatBox';
import { toast } from 'react-toastify';
import PromotionTable from './components/Table/PromotionTable';
import ContractValueSummary from './components/Table/ContractValueSummary';

const FinalQuotationDetailStaff = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [quotationDetail, setQuotationDetail] =
    useState<FinalQuotationDetailType | null>(null);
  const [promotionInfo, setPromotionInfo] = useState<PromotionInfo | null>(
    null,
  );
  const [totalRough, setTotalRough] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [showContractValueSummary, setShowContractValueSummary] =
    useState(false);
  const [showBatchPayments, setShowBatchPayments] = useState(false);
  const [showPromotions, setShowPromotions] = useState(false);
  const [showEquipmentCosts, setShowEquipmentCosts] = useState(false);
  const [showDetailedItems, setShowDetailedItems] = useState(false);
  const [showUtilities, setShowUtilities] = useState(false);

  const dateRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [utilityPrices, setUtilityPrices] = useState<number[]>([]);

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

  useEffect(() => {
    if (quotationDetail) {
      setPromotionInfo(quotationDetail.PromotionInfo || null);
      const total = quotationDetail.FinalQuotationItems.reduce(
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
      setTotalRough(total);
    }
  }, [quotationDetail]);

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

  const toggleChat = () => {
    setShowChat(!showChat);
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
        Quantity: null,
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

  const calculateTotalPrice = () => {
    const totalFinalQuotation = quotationDetail.FinalQuotationItems.reduce(
      (total, item) => {
        return (
          total +
          item.QuotationItems.reduce((subTotal, qItem) => {
            return (
              subTotal +
              (qItem.TotalPriceLabor || 0) +
              (qItem.TotalPriceRough || 0)
            );
          }, 0)
        );
      },
      0,
    );

    const totalUtilities = quotationDetail.UtilityInfos.reduce(
      (total, util) => {
        return total + (util.Price || 0);
      },
      0,
    );

    const totalEquipment = quotationDetail.EquipmentItems.reduce(
      (total, item) => {
        return total + (item.Quantity * item.UnitOfMaterial || 0);
      },
      0,
    );

    const promotionValue = quotationDetail.PromotionInfo?.Value || 0;

    return (
      totalFinalQuotation + totalUtilities + totalEquipment - promotionValue
    );
  };

  const handlePriceChange = (prices: number[]) => {
    setUtilityPrices(prices);
  };

  const handleSave = async () => {
    if (quotationDetail) {
      const updatedQuotationDetail = {
        ...quotationDetail,
        UtilityInfos: quotationDetail.UtilityInfos.map((util, index) => ({
          ...util,
          Price: util.Coefficient !== 0
            ? util.Coefficient * totalRough
            : util.UnitPrice * (util.Quantity || 0),
        })),
      };

      const success = await handleSeva(
        updatedQuotationDetail,
        setIsEditing,
        setIsSaving,
      );
      if (success) {
        // Handle success case
      }
    }
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (quotationDetail) {
      setQuotationDetail({
        ...quotationDetail,
        AccountName: e.target.value,
      });
    }
  };

  const handleProjectAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (quotationDetail) {
      setQuotationDetail({
        ...quotationDetail,
        ProjectAddress: e.target.value,
      });
    }
  };

  const totalFinalQuotation = quotationDetail.FinalQuotationItems.reduce(
    (total, item) => {
      return (
        total +
        item.QuotationItems.reduce((subTotal, qItem) => {
          return (
            subTotal +
            (qItem.TotalPriceLabor || 0) +
            (qItem.TotalPriceRough || 0)
          );
        }, 0)
      );
    },
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

  const totalContractValue =
    totalFinalQuotation + totalUtilities + totalEquipment - totalDiscount;

  return (
    <div className="bg-gray-100 min-h-screen">
      {showChat && quotationDetail && (
        <ChatBox
          onClose={toggleChat}
          accountName={quotationDetail.AccountName}
          note={quotationDetail.Note}
        />
      )}
      <FinalQuotationStatus currentStatus={quotationDetail.Status} />

      <ButtonGroup
        isEditing={isEditing}
        isSaving={isSaving}
        isFinalized={
          quotationDetail.Status === 'Processing' ||
          quotationDetail.Status === 'Rejected'
        }
        handleSave={handleSave}
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
          {isEditing ? (
            <input
              type="text"
              value={quotationDetail.AccountName}
              onChange={handleCustomerNameChange}
              className="ml-2 border border-gray-300 rounded-md p-2"
            />
          ) : (
            <span className="text-gray-700 ml-2">
              {quotationDetail.AccountName}
            </span>
          )}
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMapMarkerAlt className="mr-2 text-secondary" />
          <span className="font-semibold">Địa chỉ thi công:</span>
          {isEditing ? (
            <input
              type="text"
              value={quotationDetail.ProjectAddress}
              onChange={handleProjectAddressChange}
              className="ml-2 border border-gray-300 rounded-md p-2"
            />
          ) : (
            <span className="text-gray-700 ml-2">
              {quotationDetail.ProjectAddress}
            </span>
          )}
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMoneyBillWave className="mr-2 text-secondary" />
          <span className="font-semibold">Tổng chi phí:</span>
          <span className="text-gray-700 ml-2">
            {calculateTotalPrice().toLocaleString()} VNĐ
          </span>
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
              {isEditing && quotationDetail?.ProjectType !== 'TEMPLATE' && (
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
            projectType={quotationDetail.ProjectType}
            quotationPackage={quotationDetail.PackageQuotationList}
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
            totalRough={totalRough}
            utilities={quotationDetail.UtilityInfos}
            isEditing={isEditing}
            projectType={quotationDetail.ProjectType}
            onUtilitiesChange={handleUtilitiesChange}
            onPriceChange={handlePriceChange}
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
              onClick={() => setShowPromotions(!showPromotions)}
            >
              <h3 className="text-xl font-bold flex items-center cursor-pointer text-primary">
                4. Khuyến mãi:
                {showPromotions ? (
                  <FaChevronUp className="ml-2 text-secondary" />
                ) : (
                  <FaChevronDown className="ml-2 text-secondary" />
                )}
              </h3>
            </div>
          </div>
        </div>
        {showPromotions && (
          <PromotionTable
            promotionInfo={promotionInfo}
            discount={quotationDetail.Discount}
          />
        )}

        <hr className="my-4 border-gray-300" />
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center justify-between w-full"
              onClick={() =>
                setShowContractValueSummary(!showContractValueSummary)
              }
            >
              <h3 className="text-xl font-bold flex items-center cursor-pointer text-primary">
                5. Tổng hợp giá trị hợp đồng:
                {showContractValueSummary ? (
                  <FaChevronUp className="ml-2 text-secondary" />
                ) : (
                  <FaChevronDown className="ml-2 text-secondary" />
                )}
              </h3>
            </div>
          </div>
        </div>
        {showContractValueSummary && (
          <ContractValueSummary
            totalFinalQuotation={totalFinalQuotation}
            totalUtilities={totalUtilities}
            totalEquipment={totalEquipment}
            totalDiscount={totalDiscount}
            totalContractValue={totalContractValue}
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
                6. Các đợt thanh toán:
                {showBatchPayments ? (
                  <FaChevronUp className="ml-2 text-secondary" />
                ) : (
                  <FaChevronDown className="ml-2 text-secondary" />
                )}
              </h3>
            </div>
          </div>
        </div>
        {showBatchPayments && (
          <BatchPaymentTable
            payments={quotationDetail.BatchPaymentInfos}
            isEditing={isEditing}
            totalPrice={calculateTotalPrice()}
            onPaymentsChange={handleBatchPaymentsChange}
            dateRefs={dateRefs}
          />
        )}
      </div>
    </div>
  );
};

export default FinalQuotationDetailStaff;
