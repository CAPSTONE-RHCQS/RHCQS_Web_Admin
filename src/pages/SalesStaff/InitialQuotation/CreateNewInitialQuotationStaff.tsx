import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchQuotationData,
  handleSave,
} from './components/handler/quotationHandlersCreateNew';
import { TableRow } from './components/types';
import ActionButtons from './components/ActionButtons';
import {
  InitialQuotationResponse,
  QuotationUtility,
} from '../../../types/InitialQuotationTypes';
import { FaCommentDots } from 'react-icons/fa';
import ChatBox from '../../../components/ChatBox';
import CreateNewQuotationSummary from './CreateNewQuotationSummary';

const InitialQuotationDetailStaff = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [quotationData, setQuotationData] =
    useState<InitialQuotationResponse | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [giaTriHopDong, setGiaTriHopDong] = useState<number>(0);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [batchPayment, setBatchPayment] = useState<any[]>([]);
  const [utilityInfos, setUtilityInfos] = useState<QuotationUtility[]>([]);
  const [promotionInfo, setPromotionInfo] = useState<any>(null);
  const [donGia, setDonGia] = useState<number>(0);
  const [othersAgreement, setOthersAgreement] = useState<string>(
    quotationData?.OthersAgreement || '',
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchQuotationData(
        projectId,
        setQuotationData,
        setTableData,
        setBatchPayment,
        setUtilityInfos,
        setDonGia,
        setPromotionInfo,
      );
    };

    fetchData();
  }, []);

  if (!quotationData) {
    return (
      <div>
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const totalArea = tableData.reduce((total, row) => {
    const dienTich = parseFloat(row.dienTich);
    return total + (isNaN(dienTich) ? 0 : dienTich);
  }, 0);

  const totalRough = totalArea * donGia;

  const totalUtilities = utilityInfos.reduce(
    (total, utility) => total + utility.price,
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
        {!showChat && (
          <button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <FaCommentDots className="text-2xl" />
          </button>
        )}

        {showChat && quotationData && (
          <ChatBox
            onClose={toggleChat}
            accountName={quotationData.AccountName}
            note={quotationData.Note}
          />
        )}
      </div>
      <ActionButtons
        isEditing={isEditing}
        isSaving={isSaving}
        handleEditToggle={handleEditToggle}
        handleSave={() =>
          handleSave(
            quotationData,
            tableData,
            batchPayment,
            utilityInfos,
            promotionInfo,
            giaTriHopDong,
            totalArea,
            totalRough,
            totalUtilities,
            navigate,
            setIsSaving,
          )
        }
      />
      <CreateNewQuotationSummary
        quotationData={quotationData}
        setQuotationData={setQuotationData}
        tableData={tableData}
        setTableData={setTableData}
        isEditing={isEditing}
        totalArea={totalArea}
        donGia={donGia}
        totalRough={totalRough}
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
      />
    </>
  );
};

export default InitialQuotationDetailStaff;
