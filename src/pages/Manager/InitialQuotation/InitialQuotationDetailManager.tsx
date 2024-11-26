import React, { useState, useEffect } from 'react';
import { FaDownload, FaShareAlt, FaCommentDots } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

import InitialQuotationStatusTracker from '../../../components/StatusTracker/InitialQuotationStatusTracker';
import ConstructionAreaTable from './Table/ConstructionAreaTable';
import { getStatusLabelInitalQuoteDetail } from '../../../utils/utils';
import {
  getInitialQuotation,
  approveInitialQuotation,
} from '../../../api/InitialQuotation/InitialQuotationApi';
import {
  BatchPaymentInfo,
  InitialQuotationResponse,
  UtilityInfo,
} from '../../../types/InitialQuotationTypes';
import ApprovalDialog from '../../../components/Modals/ApprovalDialog';
import ChatBox from '../../../components/ChatBox';

interface TableRow {
  stt: number;
  hangMuc: string;
  dTich: string;
  heSo: string;
  dienTich: string;
  donVi: string;
}

const InitialQuotationDetailManager = () => {
  const { id } = useParams<{ id: string }>();
  const [quotationData, setQuotationData] =
    useState<InitialQuotationResponse | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [giaTriHopDong, setGiaTriHopDong] = useState<number>(0);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [paymentSchedule, setPaymentSchedule] = useState<BatchPaymentInfo[]>(
    [],
  );
  const [utilityInfos, setUtilityInfos] = useState<UtilityInfo[]>([]);
  const [promotionInfo, setPromotionInfo] = useState<any>(null);
  const [donGia, setDonGia] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [type, setType] = useState('Approved');

  const fetchQuotationData = async () => {
    if (id) {
      try {
        const data: InitialQuotationResponse = await getInitialQuotation(id);
        console.log('fetch', data);
        setQuotationData(data);
        const updatedTableData = data.ItemInitial.map((item, index) => {
          const coefficient =
            item.Coefficient !== 0
              ? item.Coefficient
              : item.SubCoefficient || 0;
          return {
            stt: index + 1,
            hangMuc: item.SubConstruction || item.Name,
            dTich: item.Area.toString(),
            heSo: coefficient.toString(),
            dienTich: (item.Area * coefficient).toString(),
            donVi: 'm²',
          };
        });
        setTableData(updatedTableData);

        const totalRough = data.TotalRough;
        const area = data.Area;
        const totalUtilities = data.TotalUtilities;
        const discount: number | null | undefined = data.PromotionInfo?.Value;

        let giaTriHopDong =
          totalRough + totalUtilities - (discount ?? 0) * area;

        if (data.PromotionInfo && data.PromotionInfo.Value !== null) {
          setPromotionInfo(data.PromotionInfo);
        }

        setGiaTriHopDong(giaTriHopDong);
        setPaymentSchedule(data.BatchPaymentInfos);
        setUtilityInfos(data.UtilityInfos);
        setDonGia(data.PackageQuotationList.UnitPackageRough);
      } catch (error) {
        console.error('Error fetching quotation data:', error);
      }
    }
  };

  useEffect(() => {
    fetchQuotationData();
  }, [id]);

  if (!quotationData) {
    return (
      <div>
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof TableRow,
  ) => {
    const newData = [...tableData];
    newData[index] = { ...newData[index], [field]: e.target.value };

    if (field === 'dTich') {
      newData[index].dienTich = (
        parseFloat(newData[index].dTich) * parseFloat(newData[index].heSo)
      ).toString();
    }

    setTableData(newData);
  };

  const totalDienTich = tableData.reduce(
    (total, row) => total + parseFloat(row.dienTich),
    0,
  );

  const thanhTien = totalDienTich * donGia;
  const discount = promotionInfo?.Value * quotationData.Area;

  const handleDownload = () => {
    alert('Tải về hợp đồng');
  };

  const handleShare = () => {
    alert('Chia sẻ hợp đồng');
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const totalPercentage = paymentSchedule.reduce(
    (total, row) => total + parseFloat(row.Percents),
    0,
  );

  const totalAmount = paymentSchedule.reduce(
    (total, row) => total + row.Price,
    0,
  );

  const totalUtilityCost = utilityInfos.reduce(
    (total, utility) => total + utility.Price,
    0,
  );

  const handleApproveClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!id) return;
    try {
      await approveInitialQuotation(id, { type, reason });
      if (type === 'Accepted') {
        toast.success('Chấp nhận báo giá thành công!');
      } else if (type === 'Rejected') {
        toast.success('Từ chối báo giá thành công!');
      }

      handleCloseModal();
      fetchQuotationData();
    } catch (error: any) {
      console.error('Failed to approve/reject quotation:', error);
      if (error.response && error.response.data) {
        toast.error(`Lỗi: ${error.response.data}`);
      } else {
        toast.error('Đã xảy ra lỗi không xác định');
      }
    }
  };

  const sectionStart = tableData.length > 0 ? 3 : 2;

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
            accountName={quotationData.AccountName || ''}
            note={quotationData.Note || ''}
          />
        )}

        <InitialQuotationStatusTracker
          currentStatus={getStatusLabelInitalQuoteDetail(
            quotationData.Status || '',
          )}
        />
      </div>
      <div className="flex justify-end space-x-2">
        {quotationData.Status === 'Reviewing' && (
          <button
            onClick={handleApproveClick}
            className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center transition-colors duration-200"
          >
            Phê duyệt
          </button>
        )}
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

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">
            Thông tin báo giá sơ bộ
          </h2>
          <div className="text-right">
            <span className="font-semibold">Phiên bản:</span>
            <span className="text-gray-700 ml-2">
              {quotationData.Version || ''}
            </span>
            <div className="text-gray-500 text-sm">
              Tạo lúc{' '}
              {quotationData.InsDate
                ? new Date(quotationData.InsDate).toLocaleString()
                : ''}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mb-4">
            <p className="text-lg font-bold mb-2 text-secondary">
              1. ĐƠN GIÁ THI CÔNG:
            </p>
            <p className="mb-2">
              {quotationData.PackageQuotationList.PackageRough || ''} -{' '}
              {quotationData.PackageQuotationList.UnitPackageRough?.toLocaleString() ||
                ''}{' '}
              đồng/m²
            </p>
            {quotationData.PackageQuotationList.PackageFinished &&
              quotationData.PackageQuotationList.UnitPackageFinished !== 0 && (
                <p className="mb-2">
                  {quotationData.PackageQuotationList.PackageFinished} -{' '}
                  {quotationData.PackageQuotationList.UnitPackageFinished?.toLocaleString() ||
                    ''}{' '}
                  đồng/m²
                </p>
              )}
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <strong className="mt-4 mb text-lg inline-block text-secondary">
                Diện tích xây dựng theo phương án thiết kế:
              </strong>
            </div>
          </div>
        </div>

        <ConstructionAreaTable
          tableData={tableData}
          totalDienTich={totalDienTich}
        />

        <div className="mt-4">
          <div className="mb-4">
            <strong className="text-xl text-secondary">
              2. GIÁ TRỊ BÁO GIÁ SƠ BỘ XÂY DỰNG TRƯỚC THUẾ:
            </strong>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border text-center">
                    Tổng diện tích xây dựng
                  </th>
                  <th className="px-4 py-2 border text-center">x</th>
                  <th className="px-4 py-2 border text-center">Đơn giá</th>
                  <th className="px-4 py-2 border text-center">=</th>
                  <th className="px-4 py-2 border text-center">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border text-center">
                    {totalDienTich} m²
                  </td>
                  <td className="px-4 py-2 border text-center">x</td>
                  <td className="px-4 py-2 border text-center">
                    {donGia.toLocaleString()} đồng/m²
                  </td>
                  <td className="px-4 py-2 border text-center">=</td>
                  <td className="px-4 py-2 border text-center">
                    <strong> {thanhTien.toLocaleString()} VNĐ</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <strong className="text-xl font-bold text-secondary">
                {sectionStart}. TÙY CHỌN & TIỆN ÍCH:
              </strong>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Mô tả</th>
                <th className="px-4 py-2 border text-center">Hệ số</th>
                <th className="px-4 py-2 border text-center">Số lượng</th>
                <th className="px-4 py-2 border text-center">Đơn Giá</th>
                <th className="px-4 py-2 border text-center">Giá</th>
              </tr>
            </thead>
            <tbody>
              {utilityInfos.map((utility) => (
                <tr key={utility.Id}>
                  <td className="px-4 py-2 border text-left">
                    {utility.Description}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {utility.Coefficient !== 0 ? utility.Coefficient : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {utility.Quantity !== 0 || null ? utility.Quantity : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {utility.UnitPrice !== 0
                      ? utility.UnitPrice.toLocaleString()
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {utility.Price.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={4}>
                  <strong>Tổng chi phí tiện ích</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalUtilityCost.toLocaleString()} VNĐ</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div className="mb-4">
            <strong className="text-xl text-secondary">
              {sectionStart + 1}. KHUYẾN MÃI:
            </strong>
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border text-center">
                    Tên khuyến mãi
                  </th>
                  <th className="px-4 py-2 border text-center">Giá trị</th>
                  <th className="px-4 py-2 border text-center">Tổng giảm</th>
                </tr>
              </thead>
              <tbody>
                {promotionInfo ? (
                  <tr>
                    <td className="px-4 py-2 border text-left">
                      {promotionInfo.Name}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {promotionInfo.Value.toLocaleString()} VNĐ
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {discount.toLocaleString()} VNĐ
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="px-4 py-2 border text-center " colSpan={3}>
                      <span className="text-red-600">Không có khuyến mãi</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-4">
            <strong className="text-xl text-secondary">
              {sectionStart + 2}. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:
            </strong>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border text-center">Mô tả</th>
                  <th className="px-4 py-2 border text-center">Giá trị</th>
                  <th className="px-4 py-2 border text-center">Đơn vị</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border text-left">
                    Phần Thô Tiết Kiệm
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {thanhTien.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-center">VNĐ</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border text-left">
                    Tùy chọn & Tiện ích
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {totalUtilityCost.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-center">VNĐ</td>
                </tr>
                {promotionInfo && (
                  <tr>
                    <td className="px-4 py-2 border text-left">
                      Khuyến mãi ({promotionInfo.Name})
                    </td>
                    <td className="px-4 py-2 border text-center">
                      -{discount.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border text-center"></td>
                  </tr>
                )}
                <tr>
                  <td className="px-4 py-2 border text-center">
                    <strong>GIÁ TRỊ HỢP ĐỒNG</strong>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <strong>{giaTriHopDong.toLocaleString()} VNĐ</strong>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <strong>VNĐ</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center mt-4 mb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <strong className="text-xl text-secondary">
                {sectionStart + 3}. CÁC ĐỢT THANH TOÁN:
              </strong>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th
                  className="px-4 py-2 border text-center"
                  style={{ width: '10%' }}
                >
                  Đợt
                </th>
                <th className="px-4 py-2 border text-left">Nội dung</th>
                <th className="px-4 py-2 border text-center">T-Toán (%)</th>
                <th className="px-4 py-2 border text-center">Số tiền</th>
                <th className="px-4 py-2 border text-center">
                  Ngày thanh toán
                </th>
                <th className="px-4 py-2 border text-center">
                  Giai đoạn thanh toán
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentSchedule.map((row, index) => (
                <tr key={row.NumberOfBatch}>
                  <td
                    className="px-4 py-2 border text-center"
                    style={{ width: '10%' }}
                  >
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border text-left">
                    {row.Description}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.Percents}%
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.Price.toLocaleString()} {row.Unit}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.PaymentDate
                      ? new Date(row.PaymentDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.PaymentPhase
                      ? new Date(row.PaymentPhase).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={2}>
                  <strong>Tổng giá trị hợp đồng</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalPercentage}%</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalAmount.toLocaleString()} VNĐ</strong>
                </td>
                <td className="px-4 py-2 border text-center" colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <div className="mb-4">
            <strong className="text-xl text-secondary">
              {sectionStart + 4}. CÁC THỎA THUẬN KHÁC:
            </strong>
          </div>
          <p className="text-gray-700 whitespace-pre-line">
            {quotationData.OthersAgreement || ''}
          </p>
        </div>

        <div className="mt-4 w-1/3">
          <div className="mb-4">
            <strong className="text-xl text-secondary">
              {sectionStart + 5} THỜI GIAN THI CÔNG:
            </strong>
          </div>

          <div className="mb-4 text-right">
            <p className="flex justify-between">
              <strong>Thời gian hoàn thành công trình là:</strong>
              <span className="font-bold">
                {quotationData.TimeProcessing} Ngày
              </span>
            </p>
            <p className="text-left">
              <em>Trong đó:</em>
            </p>
            <div className="ml-5">
              <p className="flex justify-between">
                <em>Thời gian thi công phần thô:</em>
                <span className="font-italic">
                  {quotationData.TimeRough} Ngày
                </span>
              </p>
              <p className="flex justify-between">
                <em>Phối hợp với CT hoàn thiện công trình:</em>
                <span className="font-italic">
                  {quotationData.TimeOthers} Ngày
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ApprovalDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        approvalType={type}
        setApprovalType={setType}
        reason={reason}
        setReason={setReason}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default InitialQuotationDetailManager;
