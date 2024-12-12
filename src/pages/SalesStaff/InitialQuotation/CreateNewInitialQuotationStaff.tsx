import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchQuotationData,
  handleSave,
} from './components/handler/quotationHandlersCreateNew';
import { TableRow } from './components/types';
import CreateNewQuotationSummary from './CreateNewQuotationSummary';
import {
  InitialQuotationResponse,
  UtilityInfo,
} from '../../../types/InitialQuotationTypes';

const InitialQuotationDetailStaff = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [quotationData, setQuotationData] =
    useState<InitialQuotationResponse | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [giaTriHopDong, setGiaTriHopDong] = useState<number>(0);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [batchPayment, setBatchPayment] = useState<any[]>([]);
  const [utilityInfos, setUtilityInfos] = useState<UtilityInfo[]>([]);
  const [promotionInfo, setPromotionInfo] = useState<any>(null);
  const [donGia, setDonGia] = useState<number>(0);
  const [othersAgreement, setOthersAgreement] = useState<string>(
    quotationData?.OthersAgreement || '',
  );
  const navigate = useNavigate();
  const [utilityPrices, setUtilityPrices] = useState<number[]>([]);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [quantities, setQuantities] = useState<(number | null)[]>([]);

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
        setQuantities,
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
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
      <CreateNewQuotationSummary
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
        handleSave={() => {
          handleSave(
            quotationData,
            tableData,
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
          );
        }}
      />
    </>
  );
};

export default InitialQuotationDetailStaff;
