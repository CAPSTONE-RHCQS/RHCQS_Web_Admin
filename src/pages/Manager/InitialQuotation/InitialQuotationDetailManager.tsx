import React, { useState, useEffect } from 'react';
import { FaDownload, FaShareAlt, FaCommentDots } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

import InitialQuotationStatusTracker from '../../../components/StatusTracker/InitialQuotationStatusTracker';
import ConstructionAreaTable from '../../Quote/components/Table/ConstructionAreaTable';
import { getStatusLabelInitalQuoteDetail } from '../../../utils/utils';
import { formatCurrencyShort } from '../../../utils/format';
import {
  getInitialQuotation,
  updateInitialQuotation,
  approveInitialQuotation,
} from '../../../api/Project/InitialQuotationApi';
import {
  InitialQuotationResponse,
  UpdateInitialQuotationRequest,
} from '../../../types/InitialQuotationTypes';

interface TableRow {
  stt: number;
  hangMuc: string;
  dTich: string;
  heSo: string;
  dienTich: string;
  donVi: string;
}

interface OptionRow {
  stt: number;
  hangMuc: string;
  soLuong: number;
  heSo: number;
  thanhTien: number;
}

const InitialQuotationDetailManager = () => {
  const { id } = useParams<{ id: string }>();
  const [quotationData, setQuotationData] =
    useState<InitialQuotationResponse | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [giaTriHopDong, setGiaTriHopDong] = useState<number>(0);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [optionData, setOptionData] = useState<OptionRow[]>([]);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([]);
  const [utilityInfos, setUtilityInfos] = useState<any[]>([]);
  const [promotionInfo, setPromotionInfo] = useState<any>(null);
  const [donGia, setDonGia] = useState<number>(0);
  const [version, setVersion] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [type, setType] = useState('Approved');

  const fetchQuotationData = async () => {
    if (id) {
      try {
        const data: InitialQuotationResponse = await getInitialQuotation(id);
        setQuotationData(data);
        setVersion(data.Version || null);

        const comboDonGia = data.PackageQuotationList.UnitPackageFinished || 0;

        const updatedTableData = data.ItemInitial.map((item, index) => {
          const coefficient =
            item.Coefficient !== 0
              ? item.Coefficient
              : item.SubCoefficient || 0;
          return {
            stt: index + 1,
            hangMuc: item.Name,
            dTich: item.Area.toString(),
            heSo: coefficient.toString(),
            dienTich: (item.Area * coefficient).toString(),
            donVi: 'm²',
          };
        });
        setTableData(updatedTableData);

        const totalRough = data.TotalRough;
        const totalUtilities = data.TotalUtilities;
        const totalUtilityCost = data.UtilityInfos.reduce(
          (total, utility) => total + utility.Price,
          0,
        );

        let giaTriHopDong = totalRough + totalUtilities + comboDonGia;

        if (data.PromotionInfo) {
          const discountValue =
            giaTriHopDong * (data.PromotionInfo.Value / 100);
          giaTriHopDong -= discountValue;
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

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof OptionRow,
  ) => {
    const newData = [...optionData];
    newData[index] = { ...newData[index], [field]: parseFloat(e.target.value) };

    if (field === 'soLuong' || field === 'heSo') {
      newData[index].thanhTien =
        newData[index].soLuong * newData[index].heSo * thanhTien;
    }

    setOptionData(newData);
  };

  const totalDienTich = tableData.reduce(
    (total, row) => total + parseFloat(row.dienTich),
    0,
  );

  const thanhTien = totalDienTich * donGia;

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
      console.log('Quotation approved/rejected successfully');
      toast.success('Phê duyệt thành công!');
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
      <div className="flex justify-end space-x-2">
        {quotationData.Status === 'Reviewing' && (
          <button
            onClick={handleApproveClick}
            className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
          >
            Phê duyệt
          </button>
        )}
        <button
          onClick={handleDownload}
          className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
        >
          <FaDownload className="text-lg" />
        </button>

        <button
          onClick={handleShare}
          className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
        >
          <FaShareAlt className="text-lg" />
        </button>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Thông tin báo giá sơ bộ</h2>
          <div className="text-right">
            <span className="font-semibold">Phiên bản:</span>
            <span className="text-gray-700 ml-2">{quotationData.Version}</span>
            <div className="text-gray-500 text-sm">
              Tạo lúc {new Date(quotationData.InsDate).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="mt-4 mb-4 text-lg">
            <strong>1. ĐƠN GIÁ THI CÔNG</strong>
          </p>
          <p className="mb-2">
            {quotationData.PackageQuotationList.PackageRough} -{' '}
            {quotationData.PackageQuotationList.UnitPackageRough.toLocaleString()}{' '}
            đồng/m²
          </p>
          {quotationData.PackageQuotationList.PackageFinished &&
            quotationData.PackageQuotationList.UnitPackageFinished !== 0 && (
              <p className="mb-2">
                {quotationData.PackageQuotationList.PackageFinished} -{' '}
                {quotationData.PackageQuotationList.UnitPackageFinished.toLocaleString()}{' '}
                đồng/m²
              </p>
            )}

          <p className="mb-4 text-lg">
            <strong>Diện tích xây dựng theo phương án thiết kế:</strong>
          </p>
        </div>

        <ConstructionAreaTable
          tableData={tableData}
          handleInputChange={handleInputChange}
          totalDienTich={totalDienTich}
        />

        <p className="text-lg mb-4">
          <strong>Giá trị báo giá sơ bộ xây dựng trước thuế:</strong>
        </p>

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
                  <strong> {thanhTien.toLocaleString()} đồng</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-lg mb-4">
          <strong>2. TÙY CHỌN & TIỆN ÍCH:</strong>
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Mô tả</th>
                <th className="px-4 py-2 border text-center">Hệ số</th>
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
                    {utility.Coefficient}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {utility.Price.toLocaleString()} VNĐ
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={2}>
                  <strong>Tổng chi phí tiện ích</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalUtilityCost.toLocaleString()} VNĐ</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-lg mb-4">
          <strong>3. KHUYẾN MÃI:</strong>
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Tên khuyến mãi</th>
                <th className="px-4 py-2 border text-center">Giá trị (%)</th>
              </tr>
            </thead>
            <tbody>
              {promotionInfo ? (
                <tr>
                  <td className="px-4 py-2 border text-left">
                    {promotionInfo.Name}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {promotionInfo.Value}%
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="px-4 py-2 border text-center" colSpan={2}>
                    Không có khuyến mãi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <p className="text-lg">
            <strong>4. CÁC THỎA THUẬN KHÁC:</strong>
          </p>
          <p className="text-gray-700 whitespace-pre-line">
            {quotationData.OthersAgreement}
          </p>
        </div>

        <p className="text-lg mb-4">
          <strong>5. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:</strong>
        </p>
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
                  {thanhTien.toLocaleString()} VNĐ
                </td>
                <td className="px-4 py-2 border text-center">VNĐ</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border text-left">
                  Tùy chọn & Tiện ích
                </td>
                <td className="px-4 py-2 border text-center">
                  {totalUtilityCost.toLocaleString()} VNĐ
                </td>
                <td className="px-4 py-2 border text-center">VNĐ</td>
              </tr>
              {promotionInfo && (
                <tr>
                  <td className="px-4 py-2 border text-left">
                    Khuyến mãi ({promotionInfo.Name})
                  </td>
                  <td className="px-4 py-2 border text-center">
                    -
                    {(
                      giaTriHopDong *
                      (promotionInfo.Value / 100)
                    ).toLocaleString()}{' '}
                    VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center">VNĐ</td>
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

        <p className="text-lg mb-4">
          <strong>6. CÁC ĐỢT THANH TOÁN:</strong>
        </p>
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
              </tr>
            </thead>
            <tbody>
              {paymentSchedule.map((row, index) => (
                <tr key={row.Id}>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Xác nhận hoặc từ chối báo giá
            </h2>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Approved">Xác nhận</option>
              <option value="Rejected">Từ chối</option>
            </select>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Gửi
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InitialQuotationDetailManager;
