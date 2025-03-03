import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import { FaCommentDots, FaStickyNote, FaTimes } from 'react-icons/fa';

import InitialQuotationStatusTracker from '../../../components/StatusTracker/InitialQuotationStatusTracker';
import { getStatusLabelInitalQuoteDetail } from '../../../utils/utils';
import {
  fetchQuotationData,
  handleSave,
} from './components/handler/quotationHandlers';
import { TableRow } from './components/types';
import QuotationSummary from './QuotationSummary';
import {
  InitialQuotationResponse,
  UtilityInfo,
} from '../../../types/InitialQuotationTypes';
import { getInitialQuotationStatus } from '../../../api/InitialQuotation/InitialQuotationApi';
import EditRequestDialog from '../../../components/EditRequestDialog';
import RejectDialog from '../../../components/RejectDialog';

const InitialQuotationDetailStaff = () => {
  const { id } = useParams<{ id: string }>();
  const [quotationData, setQuotationData] =
    useState<InitialQuotationResponse | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [giaTriHopDong, setGiaTriHopDong] = useState<number>(0);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [batchPayment, setBatchPayment] = useState<any[]>([]);
  const [utilityInfos, setUtilityInfos] = useState<UtilityInfo[]>([]);
  const [promotionInfo, setPromotionInfo] = useState<any>(null);
  const [donGia, setDonGia] = useState<number>(0);
  const [version, setVersion] = useState<number | null>(null);
  const [othersAgreement, setOthersAgreement] = useState<string>(
    quotationData?.OthersAgreement || '',
  );
  const [utilityPrices, setUtilityPrices] = useState<number[]>([]);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [quantities, setQuantities] = useState<(number | null)[]>([]);
  const [status, setStatus] = useState<string>('');
  const [isEditRequestDialogOpen, setIsEditRequestDialogOpen] = useState(true);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchQuotationData(
        id,
        setQuotationData,
        setVersion,
        setTableData,
        setBatchPayment,
        setUtilityInfos,
        setDonGia,
        setPromotionInfo,
        setQuantities,
      );
    };

    fetchData();

    const intervalId = setInterval(async () => {
      if (id) {
        const newStatus = await getInitialQuotationStatus(id);
        if (newStatus !== status) {
          setStatus(newStatus);
          await fetchData();
        }
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [id, status]);

  if (!quotationData) {
    return (
      <div>
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  const handleCloseEditRequestDialog = () => {
    setIsEditRequestDialogOpen(false);
  };

  const handleToggleEditRequestDialog = () => {
    setIsEditRequestDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setIsRejectDialogOpen(false);
  };

  const handleToggleRejectDialog = () => {
    setIsRejectDialogOpen(true);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const totalArea =
    tableData.length > 0
      ? tableData.reduce((total, row) => {
          const dienTich = parseFloat(row.dienTich);
          return total + (isNaN(dienTich) ? 0 : dienTich);
        }, 0)
      : quotationData.Area;

  const totalRough =
    totalArea * quotationData.PackageQuotationList.UnitPackageRough;

  const totalFinished =
    totalArea * quotationData.PackageQuotationList.UnitPackageFinished;

  const totalUtilities = utilityInfos.reduce(
    (total, utility) => total + utility.Price,
    0,
  );

  const totalPercentage = batchPayment.reduce(
    (total, row) => total + parseFloat(row.Percents),
    0,
  );

  const totalAmount = batchPayment.reduce(
    (total, row) => total + (row.Percents / 100) * giaTriHopDong,
    0,
  );

  return (
    <>
      <div>
        {/* <div
          className={`fixed bottom-4 right-0 flex items-center group transition-transform duration-300 ${
            isPanelVisible ? 'translate-x-0' : 'translate-x-90'
          }`}
        >
          <button
            onClick={togglePanel}
            className={`p-2 rounded-full shadow-lg transition-colors duration-200 ${
              isPanelVisible
                ? 'bg-[#d9d9d9] hover:bg-[#8d8b8b] text-black opacity-0 group-hover:opacity-100'
                : 'bg-[#d9d9d9] hover:bg-[#8d8b8b] text-black'
            }`}
          >
            {isPanelVisible ? (
              <FaChevronRight className="text-xl" />
            ) : (
              <FaChevronLeft className="text-xl" />
            )}
          </button>

          <div className="flex space-x-4 ml-2">
            {!showChat && (
              <button
                onClick={toggleChat}
                className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <FaCommentDots className="text-2xl" />
              </button>
            )}

            <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg flex items-center h-12">
              <FaRulerCombined className="mr-2" />
              <span className="font-bold">{totalArea} m²</span>
            </div>
            <div className="bg-green-500 text-white p-3 rounded-full shadow-lg flex items-center h-12">
              <FaFileInvoiceDollar className="mr-2" />
              <span className="font-bold">
                {giaTriHopDong.toLocaleString()} VNĐ
              </span>
            </div>
          </div>
        </div> */}
        {isEditRequestDialogOpen && quotationData?.Note && (
          <EditRequestDialog
            note={quotationData.Note}
            onClose={handleCloseEditRequestDialog}
            accountName={quotationData.AccountName}
          />
        )}

        {isRejectDialogOpen && quotationData?.ReasonReject && (
          <RejectDialog
            note={quotationData.ReasonReject}
            onClose={handleCloseRejectDialog}
          />
        )}

        <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-50">
          {!isRejectDialogOpen && (
            <button
              onClick={handleToggleRejectDialog}
              className="bg-[#ff6347] text-white p-4 rounded-full shadow-lg hover:bg-[#ea5c43] transition-colors duration-200"
            >
              <FaTimes className="text-2xl" />
            </button>
          )}

          {!isEditRequestDialogOpen && (
            <button
              onClick={handleToggleEditRequestDialog}
              className="bg-[#ff8c00] text-white p-4 rounded-full shadow-lg hover:bg-[#e58006] transition-colors duration-200"
            >
              <FaStickyNote className="text-2xl" />
            </button>
          )}

          {/* {!showChat && (
            <button
              onClick={toggleChat}
              className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <FaCommentDots className="text-2xl" />
            </button>
          )} */}
        </div>

        <InitialQuotationStatusTracker
          currentStatus={getStatusLabelInitalQuoteDetail(quotationData.Status)}
        />
      </div>
      <QuotationSummary
        quotationData={quotationData}
        setQuotationData={setQuotationData}
        tableData={tableData}
        setTableData={setTableData}
        isEditing={isEditing}
        totalArea={totalArea}
        donGia={donGia}
        totalRough={totalRough}
        totalFinished={totalFinished}
        utilityInfos={utilityInfos}
        setUtilityInfos={setUtilityInfos}
        totalUtilities={totalUtilities}
        promotionInfo={promotionInfo}
        setPromotionInfo={setPromotionInfo}
        giaTriHopDong={giaTriHopDong}
        setGiaTriHopDong={setGiaTriHopDong}
        batchPayment={batchPayment}
        setBatchPayment={setBatchPayment}
        totalPercentage={totalPercentage}
        totalAmount={totalAmount}
        othersAgreement={othersAgreement}
        setOthersAgreement={setOthersAgreement}
        onPriceChange={setUtilityPrices}
        isSaving={isSaving}
        handleEditToggle={handleEditToggle}
        handleSave={() =>
          handleSave(
            quotationData,
            tableData,
            version,
            batchPayment,
            utilityInfos,
            promotionInfo,
            giaTriHopDong,
            totalArea,
            totalRough,
            totalFinished,
            totalUtilities,
            navigate,
            setIsSaving,
            quantities,
          )
        }
      />
    </>
  );
};

export default InitialQuotationDetailStaff;
