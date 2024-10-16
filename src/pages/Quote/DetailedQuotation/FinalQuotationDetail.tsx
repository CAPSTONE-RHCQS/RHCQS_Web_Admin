import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { getFinalQuotation } from '../../../api/Project/FinalQuotation';
import { FinalQuotationDetail as FinalQuotationDetailType } from '../../../types/QuotationTypes';
import BatchPaymentTable from './Table/BatchPaymentTable';
import EquipmentTable from './Table/EquipmentTable';
import FinalQuotationTable from './Table/FinalQuotationTable';
import FinalQuotationStatus from '../../../components/FinalQuotationStatus';
import { FaUser, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

const FinalQuotationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quotationDetail, setQuotationDetail] =
    useState<FinalQuotationDetailType | null>(null);

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
        <ClipLoader size={50} color={'#123abc'} loading={true} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold ">Thông tin báo giá chi tiết</h2>
      </div>
      <FinalQuotationStatus currentStatus={quotationDetail.Status} />
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
      <h3 className="text-xl font-bold mb-4">Các đợt thanh toán</h3>
      <BatchPaymentTable payments={quotationDetail.BatchPaymentInfos} />
      <hr className="my-4 border-gray-300" />
      <h3 className="text-xl font-bold mb-4">Chi Phí Thiết bị</h3>
      <EquipmentTable items={quotationDetail.EquipmentItems} />
      <hr className="my-4 border-gray-300" />
      <h3 className="text-xl font-bold mb-4">Các hạng mục báo giá chi tiết</h3>
      <FinalQuotationTable items={quotationDetail.FinalQuotationItems} />
    </div>
  );
};

export default FinalQuotationDetail;
