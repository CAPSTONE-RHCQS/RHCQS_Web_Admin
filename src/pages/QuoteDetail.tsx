import React, { useEffect, useRef, useState } from 'react';
import { FaDownload, FaShareAlt, FaCommentDots } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import ContactCard from '../components/ContactCard';
import Avatar from '../images/user/user-01.png';
import House from '../images/house/phan-loai-cac-nha-dan-dung-2.png';
import Process from '../images/process.jpg';
import Fee from '../images/fee.jpg';
import { formatCurrencyShort } from '../utils/format';
import StatusTracker from '../components/StatusTracker';
import ContractHistoryTimeline from '../components/ContractHistoryTimeline';
import CustomerChat from '../components/CustomerChat';
import { Dialog } from '@material-tailwind/react';
import ChatBox from '../components/ChatBox';

const ContractDetail = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);

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

  const tableData = [
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
      hangMuc: 'Hầm (DTSD >= 70m2: độ sâu 1,0m -> 1,3m)',
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
      hangMuc: 'Thông Tầng Lầu 1 (Thông tầng > 8m2)',

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
  ];

  const totalDienTich = tableData.reduce(
    (total, row) => total + parseFloat(row.dienTich),

    0,
  );

  const donGia = 3350000;
  const thanhTien = totalDienTich * donGia;

  const comboSoLuong = 1;

  const comboDonGia = 18000000;

  const comboThanhTien = comboSoLuong * comboDonGia;

  const phanThoTietKiem = 1532625000;
  const giaTriHopDong = phanThoTietKiem + comboThanhTien;

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
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                  >
                    Thay đổi trạng thái
                  </a>
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

        <>
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
        </>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Thông tin chi tiết hợp đồng</h2>

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
          </div>
        </div>

        <div className="mb-4">
          <p className="text-lg">
            <strong>TÊN KHÁCH HÀNG:</strong> ĐỒ
          </p>

          <p className="text-lg">
            <strong>ĐỊA CHỈ THI CÔNG:</strong> HCM
          </p>

          <p className="text-lg">
            <strong>Được tạo lúc:</strong> 11:06:49 01/09/2024
          </p>

          <p className="text-lg">
            <strong>ĐƠN GIÁ THI CÔNG PHẦN THÔ TIẾT KIỆM:</strong> 3,350,000
            đồng/m²
          </p>

          <p className="text-lg">
            <strong>DIỆN TÍCH XÂY DỰNG THEO PHƯƠNG ÁN THIẾT KẾ:</strong>
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

                  <td className="px-4 py-2 border text-center">
                    {row.hangMuc}
                  </td>
                  <td className="px-4 py-2 border text-center">{row.dTich}</td>
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
                  {totalDienTich}
                </td>
                <td className="px-4 py-2 border text-center">m²</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-lg mb-4">
          <strong>GIÁ TRỊ HỢP ĐỒNG XÂY DỰNG TRƯỚC THUẾ:</strong>
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
                  {thanhTien.toLocaleString()} đồng
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Hạng mục</th>

                <th className="px-4 py-2 border text-center">Thành tiền</th>
                <th className="px-4 py-2 border text-center">Đơn vị tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-center">
                  Phần Thô Tiết Kiệm
                </td>
                <td className="px-4 py-2 border text-center">
                  {phanThoTietKiem.toLocaleString()} VNĐ
                </td>

                <td className="px-4 py-2 border text-center">VNĐ</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border text-center">
                  Combo Giấy Phép
                </td>
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

                <td className="px-4 py-2 border text-center">VNĐ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ContractDetail;
