import React, { useState, useEffect } from 'react';
import {
  FaDownload,
  FaShareAlt,
  FaCommentDots,
  FaUser,
  FaMapMarkerAlt,
  FaFileInvoiceDollar,
  FaPhone,
  FaMailBulk,
  FaMoneyBillWave,
  FaTimes,
  FaStickyNote,
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

import InitialQuotationStatusTracker from '../../../components/StatusTracker/InitialQuotationStatusTracker';
import ConstructionAreaTable from './Table/ConstructionAreaTable';
import { getStatusLabelInitalQuoteDetail } from '../../../utils/utils';
import {
  getInitialQuotation,
  approveInitialQuotation,
  getInitialQuotationStatus,
} from '../../../api/InitialQuotation/InitialQuotationApi';
import {
  BatchPaymentInfo,
  InitialQuotationResponse,
  UtilityInfo,
} from '../../../types/InitialQuotationTypes';
import ApprovalDialog from '../../../components/Modals/ApprovalDialog';
import { HiHomeModern } from 'react-icons/hi2';
import { TbHomePlus } from 'react-icons/tb';
import EditRequestDialog from '../../../components/EditRequestDialog';
import RejectDialog from '../../../components/RejectDialog';
import { formatVietnamesePhoneNumber } from '../../../utils/phoneUtils';

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
  const [unitPackageRough, setUnitPackageRough] = useState<number>(0);
  const [unitPackageFinished, setUnitPackageFinished] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [type, setType] = useState('Approved');
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusChecked, setIsStatusChecked] = useState(false);
  const [isEditRequestDialogOpen, setIsEditRequestDialogOpen] = useState(true);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(true);

  const fetchQuotationData = async () => {
    if (id) {
      try {
        const data: InitialQuotationResponse = await getInitialQuotation(id);
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
            dienTich: item.AreaConstruction
              ? item.AreaConstruction.toString()
              : '0',
            donVi: 'm²',
          };
        });
        setTableData(updatedTableData);

        const total = data.TotalRough + data.TotalFinished;
        const area = data.Area;
        const totalUtilities = data.TotalUtilities;
        const discount: number | null | undefined = data.PromotionInfo?.Value;

        let giaTriHopDong = total + totalUtilities - (discount ?? 0) * area;

        if (data.PromotionInfo && data.PromotionInfo.Value !== null) {
          setPromotionInfo(data.PromotionInfo);
        }

        setGiaTriHopDong(giaTriHopDong);
        setPaymentSchedule(data.BatchPaymentInfos);
        setUtilityInfos(data.UtilityInfos);
        setUnitPackageRough(data.PackageQuotationList.UnitPackageRough);
        setUnitPackageFinished(data.PackageQuotationList.UnitPackageFinished);
      } catch (error) {
        console.error('Error fetching quotation data:', error);
      } finally {
        if (isStatusChecked) {
          setIsLoading(false);
        }
      }
    }
  };

  const checkStatus = async () => {
    if (id) {
      try {
        const status = await getInitialQuotationStatus(id);
        if (status !== currentStatus) {
          setCurrentStatus(status);
        }
        setIsStatusChecked(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    }
  };

  useEffect(() => {
    fetchQuotationData();
    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [id]);

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

  if (isLoading) {
    return (
      <div>
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  if (!quotationData) {
    return (
      <div>
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  const totalDienTich =
    tableData.length > 0
      ? tableData.reduce((total, row) => total + parseFloat(row.dienTich), 0)
      : quotationData.Area;

  const thanhTien = totalDienTich * (unitPackageRough + unitPackageFinished);
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
    (total, row) => total + row.Percents,
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
    setType('Approved');
    setReason('');
  };

  const handleSubmit = async () => {
    if (!id) return;
    try {
      await approveInitialQuotation(id, { type, reason });
      if (type === 'Approved') {
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

  const projectTypeMap: { [key: string]: string } = {
    TEMPLATE: 'Mẫu nhà',
    FINISHED: 'Phần Hoàn thiện',
    ROUGH: 'Phần Thô',
    ALL: 'Phần Thô & Hoàn thiện',
    HAVE_DRAWING: 'Có sẵn bản thiết kế',
  };

  const projectTypeInVietnamese =
    projectTypeMap[quotationData.ProjectType] || 'Không xác định';

  return (
    <>
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

      <div>
        <InitialQuotationStatusTracker
          currentStatus={getStatusLabelInitalQuoteDetail(currentStatus)}
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

        <>
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
        </>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <h2 className="mb-4 text-2xl font-bold text-primary">
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

        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2">
            <div className="mb-2 text-lg flex items-center">
              <HiHomeModern className="mr-2 text-secondary" />
              <span className="font-semibold">Công trình:</span>
              <span className="text-gray-700 ml-2">Nhà ở Dân dụng</span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <TbHomePlus className="mr-2 text-secondary" />
              <span className="font-semibold">Phân loại dự án:</span>
              <span className="text-gray-700 ml-2">
                {projectTypeInVietnamese}
              </span>
            </div>
            <div className="mb-2 text-lg flex flex-col items-start">
              <div className="flex items-center mb-2">
                <FaFileInvoiceDollar className="mr-2 text-secondary" />
                <span className="font-semibold mr-2">Đơn giá thi công:</span>
              </div>

              {quotationData.PackageQuotationList.PackageRough &&
                quotationData.PackageQuotationList.UnitPackageRough !== 0 && (
                  <p className="mb-2">
                    {quotationData.PackageQuotationList.PackageRough || ''} -{' '}
                    {quotationData.PackageQuotationList.UnitPackageRough?.toLocaleString() ||
                      ''}{' '}
                    đồng/m²
                  </p>
                )}

              {quotationData.PackageQuotationList.PackageFinished &&
                quotationData.PackageQuotationList.UnitPackageFinished !==
                  0 && (
                  <p>
                    {quotationData.PackageQuotationList.PackageFinished} -{' '}
                    {quotationData.PackageQuotationList.UnitPackageFinished?.toLocaleString() ||
                      ''}{' '}
                    đồng/m²
                  </p>
                )}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mb-2 text-lg flex items-center">
              <FaMapMarkerAlt className="mr-2 text-secondary" />
              <span className="font-semibold">Địa chỉ thi công:</span>
              <span className="text-gray-700 ml-2">
                {quotationData.Address}
              </span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaUser className="mr-2 text-secondary" />
              <span className="font-semibold">Chủ đầu tư:</span>
              <span className="text-gray-700 ml-2">
                {quotationData.AccountName}
              </span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaPhone className="mr-2 text-secondary" />
              <span className="font-semibold">Số điện thoại:</span>
              <span className="text-gray-700 ml-2">
                {formatVietnamesePhoneNumber(quotationData.PhoneNumber)}
              </span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaMailBulk className="mr-2 text-secondary" />
              <span className="font-semibold">Địa chỉ email:</span>
              <span className="text-gray-700 ml-2">{quotationData.Email}</span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaMoneyBillWave className="mr-2 text-secondary" />
              <span className="font-semibold">Tổng giá trị hợp đồng:</span>
              <span className="text-gray-700 ml-2">
                {giaTriHopDong.toLocaleString()} VNĐ
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <strong className="text-xl text-secondary">
                1. DIỆN TÍCH XÂY DỰNG THEO PHƯƠNG ÁN THIẾT KẾ:
              </strong>
            </div>
          </div>
        </div>

        <ConstructionAreaTable
          tableData={tableData}
          totalDienTich={totalDienTich}
          projectType={quotationData.ProjectType}
        />

        <div className="mt-4">
          <div className="mb-4">
            <strong className="text-xl text-secondary">
              2. GIÁ TRỊ BÁO GIÁ SƠ BỘ XÂY DỰNG:
            </strong>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border text-center"></th>
                  <th className="px-4 py-2 border text-center">
                    Tổng diện tích xây dựng
                  </th>
                  <th className="px-4 py-2 border text-center">x</th>
                  <th className="px-4 py-2 border text-center">Đơn giá</th>
                  <th className="px-4 py-2 border text-center">=</th>
                  <th className="px-4 py-2 border text-center">Thành tiền</th>
                  <th className="px-4 py-2 border text-center">Đơn vị</th>
                </tr>
              </thead>
              <tbody>
                {quotationData.ProjectType === 'FINISHED' ? (
                  <tr>
                    <td className="px-4 py-2 border text-left ">
                      <strong className="text-primary">Phần hoàn thiện</strong>
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {totalDienTich} m²
                    </td>
                    <td className="px-4 py-2 border text-center">x</td>
                    <td className="px-4 py-2 border text-center">
                      {unitPackageFinished.toLocaleString()} đồng/m²
                    </td>
                    <td className="px-4 py-2 border text-center">=</td>
                    <td className="px-4 py-2 border text-center">
                      <strong>
                        {(totalDienTich * unitPackageFinished).toLocaleString()}
                      </strong>
                    </td>
                    <td className="px-4 py-2 border text-center">VNĐ</td>
                  </tr>
                ) : quotationData.ProjectType === 'ROUGH' ? (
                  <tr>
                    <td className="px-4 py-2 border text-left">
                      <strong className="text-primary">Phần thô</strong>
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {totalDienTich} m²
                    </td>
                    <td className="px-4 py-2 border text-center">x</td>
                    <td className="px-4 py-2 border text-center">
                      {unitPackageRough.toLocaleString()} đồng/m²
                    </td>
                    <td className="px-4 py-2 border text-center">=</td>
                    <td className="px-4 py-2 border text-center">
                      <strong>
                        {(totalDienTich * unitPackageRough).toLocaleString()}
                      </strong>
                    </td>
                    <td className="px-4 py-2 border text-center">VNĐ</td>
                  </tr>
                ) : (
                  <>
                    {' '}
                    <tr>
                      <td className="px-4 py-2 border text-left">
                        <strong className="text-primary">Phần thô</strong>
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {totalDienTich} m²
                      </td>
                      <td className="px-4 py-2 border text-center">x</td>
                      <td className="px-4 py-2 border text-center">
                        {unitPackageRough.toLocaleString()} đồng/m²
                      </td>
                      <td className="px-4 py-2 border text-center">=</td>
                      <td className="px-4 py-2 border text-center">
                        <strong>
                          {(totalDienTich * unitPackageRough).toLocaleString()}
                        </strong>
                      </td>
                      <td className="px-4 py-2 border text-center">VNĐ</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-left ">
                        <strong className="text-primary">
                          Phần hoàn thiện
                        </strong>
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {totalDienTich} m²
                      </td>
                      <td className="px-4 py-2 border text-center">x</td>
                      <td className="px-4 py-2 border text-center">
                        {unitPackageFinished.toLocaleString()} đồng/m²
                      </td>
                      <td className="px-4 py-2 border text-center">=</td>
                      <td className="px-4 py-2 border text-center">
                        <strong>
                          {(
                            totalDienTich * unitPackageFinished
                          ).toLocaleString()}
                        </strong>
                      </td>
                      <td className="px-4 py-2 border text-center">VNĐ</td>
                    </tr>
                  </>
                )}
                <tr className="bg-gray-200">
                  <td
                    className="px-4 py-2 border text-center font-bold"
                    colSpan={5}
                  >
                    Tổng giá trị báo giá sơ bộ xây dựng
                  </td>
                  <td className="px-4 py-2 border text-center ">
                    <strong>{thanhTien.toLocaleString()}</strong>
                  </td>
                  <td className="px-4 py-2 border text-center font-bold">
                    VNĐ
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
                3. TÙY CHỌN & TIỆN ÍCH:
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
                <th className="px-4 py-2 border text-center">
                  Giá trị thanh toán
                </th>
                <th className="px-4 py-2 border text-center">Đơn vị</th>
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
                    {utility.Coefficient === 0 &&
                    (utility.Quantity !== 0 || null)
                      ? utility.Quantity
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {utility.UnitPrice !== 0
                      ? utility.UnitPrice.toLocaleString()
                      : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {utility.Price.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-center">VNĐ</td>
                </tr>
              ))}
              <tr className="bg-gray-200">
                <td className="px-4 py-2 border text-center" colSpan={4}>
                  <strong>Tổng chi phí dịch vụ & tiện ích</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalUtilityCost.toLocaleString()}</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>VNĐ</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div className="mb-4">
            <strong className="text-xl text-secondary">4. KHUYẾN MÃI:</strong>
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
              5. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:
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
                {thanhTien !== 0 && (
                  <tr>
                    <td className="px-4 py-2 border text-left">
                      Giá trị báo giá sơ bộ xây dựng
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {thanhTien.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border text-center">VNĐ</td>
                  </tr>
                )}
                {totalUtilityCost !== 0 && (
                  <tr>
                    <td className="px-4 py-2 border text-left">
                      Tùy chọn & Tiện ích
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {totalUtilityCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border text-center">VNĐ</td>
                  </tr>
                )}
                {promotionInfo && (
                  <tr>
                    <td className="px-4 py-2 border text-left">
                      Khuyến mãi ({promotionInfo.Name})
                    </td>
                    <td className="px-4 py-2 border text-center">
                      -{discount.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border text-center">VNĐ</td>
                  </tr>
                )}
                <tr className="bg-gray-200">
                  <td className="px-4 py-2 border text-center">
                    <strong>TỔNG GIÁ TRỊ HỢP ĐỒNG</strong>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <strong>{giaTriHopDong.toLocaleString()}</strong>
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
                6. CÁC ĐỢT THANH TOÁN:
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
                <th className="px-4 py-2 border text-center">Nội dung</th>
                <th className="px-4 py-2 border text-center">Phần trăm (%)</th>
                <th className="px-4 py-2 border text-center">
                  Giá trị thanh toán (VNĐ)
                </th>
                <th className="px-4 py-2 border text-center">
                  Ngày thanh toán
                </th>
                <th className="px-4 py-2 border text-center">Ngày đáo hạn</th>
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
              <tr className="bg-gray-200">
                <td className="px-4 py-2 border text-center" colSpan={2}>
                  <strong>Tổng cộng</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalPercentage}%</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalAmount.toLocaleString()} VNĐ</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <div className="mb-4">
            <strong className="text-xl text-secondary">
              7. CÁC THỎA THUẬN KHÁC:
            </strong>
          </div>
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{
              __html: quotationData.OthersAgreement || '',
            }}
          />
        </div>

        <div className="mt-4 w-1/3">
          <div className="mb-4">
            <strong className="text-xl text-secondary">
              8. THỜI GIAN THI CÔNG:
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
                <em>Phối hợp với CĐT hoàn thiện công trình:</em>
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
