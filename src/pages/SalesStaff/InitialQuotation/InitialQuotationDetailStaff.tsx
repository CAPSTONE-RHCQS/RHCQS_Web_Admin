import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import InitialQuotationStatusTracker from '../../../components/StatusTracker/InitialQuotationStatusTracker';
import { getStatusLabelInitalQuoteDetail } from '../../../utils/utils';
import { fetchQuotationData, handleSave } from './components/quotationHandlers';
import { TableRow, OptionRow } from './components/types';
import ActionButtons from './components/ActionButtons';
import QuotationSummary from './QuotationSummary';
import {
  InitialQuotationResponse,
  QuotationUtility,
} from '../../../types/InitialQuotationTypes';
import { FaCommentDots } from 'react-icons/fa';

const InitialQuotationDetailStaff = () => {
  const { id } = useParams<{ id: string }>();
  const [quotationData, setQuotationData] =
    useState<InitialQuotationResponse | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [giaTriHopDong, setGiaTriHopDong] = useState<number>(0);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [optionData, setOptionData] = useState<OptionRow[]>([]);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([]);
  const [utilityInfos, setUtilityInfos] = useState<QuotationUtility[]>([]);
  const [promotionInfo, setPromotionInfo] = useState<any>(null);
  const [donGia, setDonGia] = useState<number>(0);
  const [version, setVersion] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchQuotationData(
        id,
        setQuotationData,
        setVersion,
        setTableData,
        setGiaTriHopDong,
        setPaymentSchedule,
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

  // Tính toán các giá trị cần thiết
  const totalDienTich = tableData.reduce((total, row) => {
    const dienTich = parseFloat(row.dienTich);
    return total + (isNaN(dienTich) ? 0 : dienTich);
  }, 0);

  const thanhTien = totalDienTich * donGia;

  const totalUtilityCost = utilityInfos.reduce(
    (total, utility) => total + utility.price,
    0,
  );

  const totalPercentage = paymentSchedule.reduce(
    (total, row) => total + parseFloat(row.Percents),
    0,
  );

  const totalAmount = paymentSchedule.reduce(
    (total, row) => total + row.Price,
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

        <InitialQuotationStatusTracker
          currentStatus={getStatusLabelInitalQuoteDetail(quotationData.Status)}
        />
      </div>
      <ActionButtons
        isEditing={isEditing}
        handleEditToggle={handleEditToggle}
        handleSave={() =>
          handleSave(
            quotationData,
            tableData,
            version,
            paymentSchedule,
            utilityInfos,
            promotionInfo,
            navigate,
          )
        }
      />
      <QuotationSummary
        quotationData={quotationData}
        tableData={tableData}
        setTableData={setTableData}
        isEditing={isEditing}
        totalDienTich={totalDienTich}
        donGia={donGia}
        thanhTien={thanhTien}
        utilityInfos={utilityInfos}
        setUtilityInfos={setUtilityInfos}
        totalUtilityCost={totalUtilityCost}
        promotionInfo={promotionInfo}
        giaTriHopDong={giaTriHopDong}
        paymentSchedule={paymentSchedule}
        totalPercentage={totalPercentage}
        totalAmount={totalAmount}
      />
    </>
  );
};

export default InitialQuotationDetailStaff;
