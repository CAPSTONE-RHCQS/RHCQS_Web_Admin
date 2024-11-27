import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { postFinalQuotationByProjectId } from '../../../api/FinalQuotation/FinalQuotationApi';
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
import {
  FaUser,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import CreateNewButtonGroup from './components/Button/CreateNewButtonGroup';
import { hanldCreateNew, handleEditToggle } from './components/handlers';
import { toast } from 'react-toastify';
import PromotionTable from './components/Table/PromotionTable';
import ContractValueSummary from './components/Table/ContractValueSummary';

const CreateNewFinalQuotationStaff = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id || '';
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [quotationDetail, setQuotationDetail] =
    useState<FinalQuotationDetailType | null>(null);
  const [promotionInfo, setPromotionInfo] = useState<PromotionInfo | null>(
    null,
  );
  const [totalRough, setTotalRough] = useState(0);
  const [showContractValueSummary, setShowContractValueSummary] =
    useState(false);
  const [showBatchPayments, setShowBatchPayments] = useState(false);
  const [showPromotions, setShowPromotions] = useState(false);
  const [showEquipmentCosts, setShowEquipmentCosts] = useState(false);
  const [showDetailedItems, setShowDetailedItems] = useState(false);
  const [showUtilities, setShowUtilities] = useState(false);
  const navigate = useNavigate();

  const dateRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [utilityPrices, setUtilityPrices] = useState<number[]>([]);
  const [totalUtilities, setTotalUtilities] = useState(0);

  useEffect(() => {
    const fetchQuotationDetail = async () => {
      if (id) {
        try {
          const data = await postFinalQuotationByProjectId(id);
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

  useEffect(() => {
    if (quotationDetail && promotionInfo) {
      setQuotationDetail({
        ...quotationDetail,
        PromotionInfo: promotionInfo,
      });
    }
  }, [promotionInfo]);

  useEffect(() => {
    if (quotationDetail) {
      const total = quotationDetail.UtilityInfos.reduce((total, util) => {
        return total + (util.Price || 0);
      }, 0);
      setTotalUtilities(total);
    }
  }, [quotationDetail?.UtilityInfos]);

  const calculateTotalPrice = (
    quotationDetail: FinalQuotationDetailType | null,
  ) => {
    if (!quotationDetail) return 0;

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

    const totalEquipment = quotationDetail.EquipmentItems.reduce(
      (total, item) => {
        return total + (item.Quantity * item.UnitOfMaterial || 0);
      },
      0,
    );

    return (
      totalFinalQuotation +
      totalUtilities +
      totalEquipment -
      (quotationDetail.Discount ?? 0)
    );
  };

  const handleUtilitiesChange = (updatedUtilities: UtilityInfo[]) => {
    if (quotationDetail) {
      setQuotationDetail({
        ...quotationDetail,
        UtilityInfos: updatedUtilities,
      });
      const total = updatedUtilities.reduce((total, util) => {
        return total + (util.Price || 0);
      }, 0);
      setTotalUtilities(total);
    }
  };

  const handleEquipmentItemsChange = (updatedItems: EquipmentItem[]) => {
    if (quotationDetail) {
      const updatedQuotationDetail = {
        ...quotationDetail,
        EquipmentItems: updatedItems,
      };
      setQuotationDetail(updatedQuotationDetail);
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
      setShowPromotions(true);
      setShowContractValueSummary(true);
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

  const handlePriceChange = (prices: number[]) => {
    const total = prices.reduce((acc, price) => acc + price, 0);
    setUtilityPrices(prices);
    setTotalUtilities(total);
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

  const handleSave = async () => {
    if (quotationDetail) {
      const emptyDateIndex = quotationDetail.BatchPaymentInfos.findIndex(
        (payment) => !payment.PaymentDate || !payment.PaymentPhase,
      );

      if (emptyDateIndex !== -1) {
        toast.error('Tất cả các trường ngày phải đưc điền.');
        dateRefs.current[emptyDateIndex]?.focus();
        return;
      }

      const updatedQuotationDetail = {
        ...quotationDetail,
        UtilityInfos: quotationDetail.UtilityInfos.map((util, index) => ({
          ...util,
          Price: utilityPrices[index],
        })),
      };

      const success = await hanldCreateNew(
        updatedQuotationDetail,
        setIsSaving,
        navigate,
      );
      if (success) {
        // Handle success case
      }
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

  const totalEquipment = quotationDetail.EquipmentItems.reduce(
    (total, item) => total + (item.Quantity * item.UnitOfMaterial || 0),
    0,
  );

  const totalDiscount = quotationDetail.Discount ?? 0;

  const totalContractValue =
    totalFinalQuotation + totalUtilities + totalEquipment - totalDiscount;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <CreateNewButtonGroup
        isEditing={isEditing}
        isSaving={isSaving}
        hanldCreateNew={handleSave}
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
            {calculateTotalPrice(quotationDetail).toLocaleString()} VNĐ
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
            utilities={quotationDetail.UtilityInfos}
            isEditing={isEditing}
            onUtilitiesChange={handleUtilitiesChange}
            totalRough={totalRough}
            projectType={quotationDetail.ProjectType}
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
            totalPrice={calculateTotalPrice(quotationDetail)}
            onPaymentsChange={handleBatchPaymentsChange}
            dateRefs={dateRefs}
          />
        )}
      </div>
    </div>
  );
};

export default CreateNewFinalQuotationStaff;
