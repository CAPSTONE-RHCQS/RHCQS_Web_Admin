import React, { useState, useEffect } from 'react';
import { FaDownload, FaShareAlt, FaCommentDots } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import { Dialog } from '@material-tailwind/react';
import { ClipLoader } from 'react-spinners';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import ContactCard from '../../components/ContactCard';
import InitialQuotationStatusTracker from '../../components/InitialQuotationStatusTracker'; // Import component mới
import ContractHistoryTimeline from '../../components/ContractHistoryTimeline';
import ChatBox from '../../components/ChatBox';

import Avatar from '../../images/user/user-01.png';
import House from '../../images/house/phan-loai-cac-nha-dan-dung-2.png';
import Process from '../../images/process.jpg';
import Fee from '../../images/fee.jpg';

import { formatCurrencyShort } from '../../utils/format';
import { getInitialQuotation } from '../../api/Project/InitialQuotation';

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

// Hàm ánh xạ trạng thái từ tiếng Anh sang tiếng Việt
const getStatusLabel = (status: string) => {
  const statusLabelMap: { [key: string]: string } = {
    Pending: 'Đang xử lý',
    Processing: 'Chờ xác nhận',
    Rejected: 'Từ chối báo giá SB',
    Reviewing: 'Chờ xác nhận từ quản lý',
    Approved: 'Đã xác nhận',
    Canceled: 'Đã đóng',
    Finalized: 'Đã hoàn thành',
  };
  return statusLabelMap[status] || 'Không xác định';
};

const InitialQuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quotationData, setQuotationData] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [giaTriHopDong, setGiaTriHopDong] = useState<number>(0);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [optionData, setOptionData] = useState<OptionRow[]>([]);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([]);
  const [utilityInfos, setUtilityInfos] = useState<any[]>([]);
  const [promotionInfo, setPromotionInfo] = useState<any>(null);
  const [donGia, setDonGia] = useState<number>(0);
  const [version, setVersion] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuotationData = async () => {
      if (id) {
        try {
          const data = await getInitialQuotation(id);
          setQuotationData(data);
          setVersion(data.Version || null);

          const comboDonGia =
            data.PackageQuotationList.UnitPackageFinished || 0;

          const updatedTableData = data.ItemInitial.map(
            (item: any, index: number) => ({
              stt: index + 1,
              hangMuc: item.Name,
              dTich: item.Area.toString(),
              heSo: item.Coefficient.toString(),
              dienTich: (item.Area * item.Coefficient).toString(),
              donVi: 'm²',
            }),
          );
          setTableData(updatedTableData);

          const totalRough = data.TotalRough;
          const totalUtilities = data.TotalUtilities;
          const totalUtilityCost = data.UtilityInfos.reduce(
            (total: number, utility: { Price: number }) =>
              total + utility.Price,
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

  const comboSoLuong = 1;
  const comboDonGia = 18000000;
  const comboThanhTien = comboSoLuong * comboDonGia;

  const handleDownload = () => {
    alert('Tải về hợp đồng');
  };

  const handleShare = () => {
    alert('Chia sẻ hợp đồng');
  };

  const contactData1 = {
    fullName: 'Trần Minh Thiện',
    phoneNumber: '0965486940',
    emailAddress: 'email@fpt.edu.vn',
  };

  const contactFields1 = [
    { key: 'fullName', label: 'Name' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'emailAddress', label: 'Email' },
  ];

  const contactData2 = {
    nameHouse: 'Nhà ở dân dụng',
    address: 'Thủ Đức, HCM',
  };

  const contactFields2 = [
    { key: 'nameHouse', label: 'Name' },
    { key: 'address', label: 'Phone' },
  ];

  const contactData3 = {
    title: 'Mã số xử lý',
    number: '#70841',
  };

  const contactFields3 = [
    { key: 'title', label: 'Name' },
    { key: 'number', label: 'Phone' },
  ];

  const contactData4 = {
    title: 'Dự phí',
    priceQuote: formatCurrencyShort(giaTriHopDong),
  };

  const contactFields4 = [
    { key: 'title', label: 'Name' },
    { key: 'priceQuote', label: 'Phone' },
  ];

  const showMenu = () => {
    setMenuVisible(true);
  };

  const hideMenu = () => {
    setMenuVisible(false);
  };

  const handleMenuItemClick = (item: string) => {
    if (item === 'history') {
      setShowHistory(true);
    }
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
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

        <div className="flex flex-row gap-3">
          <ContactCard
            data={contactData3}
            fields={contactFields3}
            avatarUrl={Process}
          />
          <ContactCard
            data={contactData1}
            fields={contactFields1}
            avatarUrl={Avatar}
          />
          <ContactCard
            data={contactData2}
            fields={contactFields2}
            avatarUrl={House}
          />
          <ContactCard
            data={contactData4}
            fields={contactFields4}
            avatarUrl={Fee}
          />
        </div>

        <InitialQuotationStatusTracker currentStatus={getStatusLabel(quotationData.Status)} /> {/* Sử dụng hàm ánh xạ */}
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Thông tin báo giá sơ bộ</h2>

          <div className="flex space-x-2">
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

            <button
              onClick={handleEditToggle}
              className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
            >
              {isEditing ? 'Lưu' : 'Chỉnh sửa'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="mt-4 mb-4 text-lg">
            <strong>1. PHẦN THÔ TIẾT KIỆM </strong>(Đơn giá:{' '}
            {donGia.toLocaleString()} đồng/m²)
          </p>

          <p className="mb-4 text-lg">
            <strong>Diện tích xây dựng theo phương án thiết kế:</strong>
          </p>
        </div>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">STT</th>
                <th className="px-4 py-2 border text-center">Hạng mục</th>
                <th className="px-4 py-2 border text-center">D-Tích</th>
                <th className="px-4 py-2 border text-center">Hệ số</th>
                <th className="px-4 py-2 border text-center">Diện tích</th>
                <th className="px-4 py-2 border text-center">Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border text-center">{row.stt}</td>
                  <td className="px-4 py-2 border text-center border-2 border-green-300">
                    <input
                      type="text"
                      value={row.hangMuc}
                      onChange={(e) => handleInputChange(e, index, 'hangMuc')}
                      className="w-full text-left"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-4 py-2 border text-center border-2 border-green-300">
                    <input
                      type="text"
                      value={row.dTich}
                      onChange={(e) => handleInputChange(e, index, 'dTich')}
                      className="w-full text-center"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">{row.heSo}</td>
                  <td className="px-4 py-2 border text-center">
                    {row.dienTich}
                  </td>
                  <td className="px-4 py-2 border text-center">{row.donVi}</td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={4}>
                  <strong>Tổng diện tích xây dựng theo thiết kế:</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalDienTich}</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>m²</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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

        <p className="text-lg mb-4">
          <strong>4. CÁC CHI PHÍ KHÁC:</strong>
        </p>

        <p className="text-lg mb-4">
          <strong>Combo Giấy Phép</strong>
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Số lượng</th>
                <th className="px-4 py-2 border text-center">x</th>
                <th className="px-4 py-2 border text-center">Đơn giá</th>
                <th className="px-4 py-2 border text-center">=</th>
                <th className="px-4 py-2 border text-center">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-center">{comboSoLuong}</td>
                <td className="px-4 py-2 border text-center">x</td>
                <td className="px-4 py-2 border text-center">
                  {comboDonGia.toLocaleString()} đồng
                </td>
                <td className="px-4 py-2 border text-center">=</td>
                <td className="px-4 py-2 border text-center">
                  {comboThanhTien.toLocaleString()} đồng
                </td>
              </tr>
            </tbody>
          </table>
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
              <tr>
                <td className="px-4 py-2 border text-left">Combo Giấy Phép</td>
                <td className="px-4 py-2 border text-center">
                  {comboThanhTien.toLocaleString()} VNĐ
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
    </>
  );
};

export default InitialQuoteDetail;
