import React, { useState, useEffect } from 'react';
import { FaDownload, FaShareAlt, FaCommentDots } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import ContactCard from '../../components/ContactCard';
import Avatar from '../../images/user/user-01.png';
import House from '../../images/house/phan-loai-cac-nha-dan-dung-2.png';
import Process from '../../images/process.jpg';
import Fee from '../../images/fee.jpg';
import { formatCurrencyShort } from '../../utils/format';
import StatusTracker from '../../components/StatusTracker';
import ContractHistoryTimeline from '../../components/ContractHistoryTimeline';
import { Dialog } from '@material-tailwind/react';
import ChatBox from '../../components/ChatBox';
import { Link } from 'react-router-dom';

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

const QuoteDetail = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [tableData, setTableData] = useState<TableRow[]>([
    {
      stt: 1,
      hangMuc: 'Móng',
      dTich: '90',
      heSo: '0.5',
      dienTich: '45',
      donVi: 'm²',
    },
    {
      stt: 2,
      hangMuc: 'Hầm (DTSD >= 70m²: độ sâu 1,0m -> 1,3m)',
      dTich: '90',
      heSo: '1.5',
      dienTich: '135',
      donVi: 'm²',
    },
    {
      stt: 3,
      hangMuc: 'Trệt',
      dTich: '90',
      heSo: '1',
      dienTich: '90',
      donVi: 'm²',
    },
    {
      stt: 4,
      hangMuc: 'Sân',
      dTich: '10',
      heSo: '0.7',
      dienTich: '7',
      donVi: 'm²',
    },
    {
      stt: 5,
      hangMuc: 'Lầu 1',
      dTich: '90',
      heSo: '1',
      dienTich: '90',
      donVi: 'm²',
    },
    {
      stt: 6,
      hangMuc: 'Thông Tầng Lầu 1 (Thông tầng > 8m²)',
      dTich: '1',
      heSo: '0.5',
      dienTich: '0.5',
      donVi: 'm²',
    },
    {
      stt: 7,
      hangMuc: 'Sân thượng có mái che',
      dTich: '45',
      heSo: '1',
      dienTich: '45',
      donVi: 'm²',
    },
    {
      stt: 8,
      hangMuc: 'Sân thượng không mái che',
      dTich: '45',
      heSo: '0.5',
      dienTich: '22.5',
      donVi: 'm²',
    },
    {
      stt: 9,
      hangMuc: 'Mái che (Mái BTCT)',
      dTich: '45',
      heSo: '0.5',
      dienTich: '22.5',
      donVi: 'm²',
    },
  ]);

  const [optionData, setOptionData] = useState<OptionRow[]>([
    {
      stt: 1,
      hangMuc: 'Chí phí thi công sàn ho hơn 70m2',
      soLuong: 1,
      heSo: 0.05,
      thanhTien: 0,
    },
    {
      stt: 2,
      hangMuc: 'Chi phí thi công công trình hẻm nhỏ',
      soLuong: 1,
      heSo: 0.01,
      thanhTien: 0,
    },
    {
      stt: 3,
      hangMuc: 'Hỗ trợ bãi tập kết, điều kiện thi công khó khăn',
      soLuong: 1,
      heSo: 0.04,
      thanhTien: 0,
    },
    {
      stt: 4,
      hangMuc: 'Chi phí thi công nhà 2 mặt tiền trở lên',
      soLuong: 1,
      heSo: 0.02,
      thanhTien: 0,
    },
    {
      stt: 5,
      hangMuc: 'Chi phí thi công công trình tỉnh',
      soLuong: 1,
      heSo: 0.03,
      thanhTien: 0,
    },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof TableRow,
  ) => {
    const newData = [...tableData];
    newData[index] = { ...newData[index], [field]: e.target.value };

    // Tính toán lại diện tích
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

    // Tính toán lại thành tiền
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

  const donGia = 3350000;
  const thanhTien = totalDienTich * donGia;

  const comboSoLuong = 1;
  const comboDonGia = 18000000;
  const comboThanhTien = comboSoLuong * comboDonGia;

  const totalChiPhi = optionData.reduce(
    (total, row) => total + row.soLuong * row.heSo * thanhTien,
    0,
  );

  const giaTriHopDong = thanhTien + totalChiPhi + comboThanhTien;

  const handleDownload = () => {
    // Logic tải về hợp đồng
    alert('Tải về hợp đồng');
  };

  const handleShare = () => {
    // Logic chia sẻ hợp đồng
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

  const paymentSchedule = [
    { period: '1', content: 'Ký hợp đồng', percentage: 10 },
    { period: '2', content: 'Đổ xong Móng', percentage: 15 },
    { period: '3', content: 'Đổ xong Lầu 1', percentage: 15 },
    { period: '4', content: 'Đổ xong sàn mái', percentage: 20 },
    {
      period: '5',
      content: 'Hoàn thành 80% khối lượng xây tô',
      percentage: 15,
    },
    {
      period: '6',
      content: 'Lát gạch các tầng lầu (trừ tầng trệt)',
      percentage: 10,
    },
    { period: '7', content: 'Hoàn thiện và bàn giao', percentage: 10 },
    { period: '8', content: 'Bảo hành sau 1 năm', percentage: 5 },
  ];

  const totalPercentage = paymentSchedule.reduce(
    (total, row) => total + row.percentage,
    0,
  );
  const totalAmount = paymentSchedule.reduce(
    (total, row) => total + Math.round(giaTriHopDong * (row.percentage / 100)),
    0,
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Chi tiết báo giá
          </h2>
          <div
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
            className="relative"
          >
            <FiMoreVertical className="text-xl text-black dark:text-white" />
            {menuVisible && (
              <div
                className="absolute right-4 top-1 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-opacity duration-300 ease-in-out"
                style={{ opacity: menuVisible ? 1 : 0 }}
              >
                <div className="py-2">
                  <a
                    href="#"
                    onClick={() => handleMenuItemClick('history')}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                  >
                    Lịch sử chỉnh sửa
                  </a>
                  <Link
                    to={`/editquote`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                  >
                    Chỉnh sửa hợp đồng
                  </Link>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                  >
                    Menu Item 3
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <Dialog open={showHistory} handler={handleCloseHistory}>
          <ContractHistoryTimeline onClose={handleCloseHistory} />
        </Dialog>
        {showChat && <ChatBox onClose={toggleChat} />}
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

        <StatusTracker currentStatus="Đang Xử Lý" />
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
            <strong>PHẦN THÔ TIẾT KIỆM </strong>(Đơn giá: 3,350,000 đồng/m²)
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
          <strong>TÙY CHỌN & TIỆN ÍCH: </strong>
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">STT</th>
                <th className="px-4 py-2 border text-center">
                  Hạng mục tùy chọn
                </th>
                <th className="px-4 py-2 border text-center">Số lượng</th>
                <th className="px-4 py-2 border text-center">Hệ số</th>
                <th className="px-4 py-2 border text-center">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {optionData.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border text-center">{row.stt}</td>
                  <td className="px-4 py-2 border text-center border-2 border-green-300">
                    <input
                      type="text"
                      value={row.hangMuc}
                      onChange={(e) => handleOptionChange(e, index, 'hangMuc')}
                      className="w-full text-left"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.soLuong}
                  </td>
                  <td className="px-4 py-2 border text-center">{row.heSo}</td>
                  <td className="px-4 py-2 border text-center">
                    {(row.soLuong * row.heSo * thanhTien).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={4}>
                  <strong>Tổng chi phí:</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalChiPhi.toLocaleString()}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-lg mb-4">
          <strong>CÁC CHI PHÍ KHÁC:</strong>
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
          <strong>TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:</strong>
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th
                  className="px-4 py-2 border text-center"
                  style={{ width: '30%' }}
                >
                  Hạng mục
                </th>
                <th className="px-4 py-2 border text-center">Thành tiền</th>
                <th className="px-4 py-2 border text-center">Đơn vị tiền</th>
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
                  {totalChiPhi.toLocaleString()} VNĐ
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
          <strong>CÁC ĐỢT THANH TOÁN:</strong>
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
                <th className="px-4 py-2 border text-center">
                  T-Toán (% GTHĐ)
                </th>
                <th className="px-4 py-2 border text-center">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {paymentSchedule.map((row, index) => (
                <tr key={index}>
                  <td
                    className="px-4 py-2 border text-center"
                    style={{ width: '10%' }}
                  >
                    {row.period}
                  </td>
                  <td className="px-4 py-2 border text-left">{row.content}</td>
                  <td className="px-4 py-2 border text-center">
                    {row.percentage}%
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {Math.round(
                      giaTriHopDong * (row.percentage / 100),
                    ).toLocaleString()}{' '}
                    VNĐ
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
        <p className="text-lg mb-4">
          <strong>THỜI GIAN THI CÔNG</strong>
        </p>
        <div className="mb-4">
          <table className="w-1/2 bg-white border border-gray-200">
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-left">
                  Thời gian hoàn thành công trình là:
                </td>
                <td className="px-4 py-2 border text-right">
                  <strong>165</strong> ngày
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border text-left">
                  <em>Thời gian thi công phần thô:</em>
                </td>
                <td className="px-4 py-2 border text-right">
                  <strong>100</strong> ngày
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border text-left">
                  <em>Phối hợp với CĐT hoàn thiện công trình:</em>
                </td>
                <td className="px-4 py-2 border text-right">
                  <strong>65</strong> ngày
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default QuoteDetail;
