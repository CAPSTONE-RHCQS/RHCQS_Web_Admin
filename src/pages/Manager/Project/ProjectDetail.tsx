import React, { useState, useEffect } from 'react';
import {
  FaDownload,
  FaShareAlt,
  FaCommentDots,
  FaUser,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ContactCard from '../../../components/ContactCard';
import Avatar from '../../../images/user/user-01.png';
import House from '../../../images/house/phan-loai-cac-nha-dan-dung-2.png';
import Process from '../../../images/process.jpg';
import Fee from '../../../images/fee.jpg';
import { formatCurrencyShort } from '../../../utils/format';
import StatusTracker from '../../../components/StatusTracker';
import ContractHistoryTimeline from '../../../components/ContractHistoryTimeline';
import { Dialog } from '@material-tailwind/react';
import ChatBox from '../../../components/ChatBox';
import { Link } from 'react-router-dom';
import { Contract, Design, DetailedQuote, Quote } from '../../../types/project';

const ProjectDetail = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [quoteData, setQuoteData] = useState<Quote[]>([]);
  const [designData, setDesignData] = useState<Design[]>([]);
  const [detailedQuoteData, setDetailedQuoteData] = useState<DetailedQuote[]>(
    [],
  );
  const [contractData, setContractData] = useState<Contract[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null); // Trạng thái cho menu ẩn hiện
  const [activeDetailedMenu, setActiveDetailedMenu] = useState<number | null>(
    null,
  );
  const [activeContractMenu, setActiveContractMenu] = useState<number | null>(
    null,
  );

  useEffect(() => {
    fetch('/src/data/project/quoteData.json')
      .then((response) => response.json())
      .then((data) => setQuoteData(data));

    fetch('/src/data/project/designData.json')
      .then((response) => response.json())
      .then((data) => setDesignData(data));

    fetch('/src/data/project/detailedQuoteData.json')
      .then((response) => response.json())
      .then((data) => setDetailedQuoteData(data));

    fetch('/src/data/project/contractData.json')
      .then((response) => response.json())
      .then((data) => setContractData(data));
  }, []);

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
    priceQuote: formatCurrencyShort(1780518752),
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

  const toggleRowMenu = (id: number) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const toggleDetailedRowMenu = (id: number) => {
    setActiveDetailedMenu(activeDetailedMenu === id ? null : id);
  };

  const toggleContractRowMenu = (id: number) => {
    setActiveContractMenu(activeContractMenu === id ? null : id);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Đang chờ duyệt':
        return 'text-yellow-500';
      case 'Đã hoàn tất':
        return 'text-green-500';
      case 'Chờ khách hàng phản hồi':
        return 'text-blue-500';
      case 'Từ chối':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Chi tiết dự án
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
          <h2 className="text-2xl font-bold">Thông tin dự án</h2>
          <span className="text-gray-500 text-sm">
            Tạo lúc 10:33:40 13/09/2024
          </span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaUser className="mr-2" />
          <span className="font-semibold">Tên khách hàng:</span>
          <span className="text-gray-700 ml-2"> Trần Minh Thiện</span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          <span className="font-semibold">Địa chỉ thi công:</span>
          <span className="text-gray-700 ml-2"> Thủ Đức, HCM</span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaRulerCombined className="mr-2" />
          <span className="font-semibold">Diện tích xây dựng:</span>
          <span className="text-gray-700 ml-2"> 120m²</span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMoneyBillWave className="mr-2" />
          <span className="font-semibold">Đơn giá thi công:</span>
          <ul className="list-disc list-inside ml-2">
            <li>Thi công thô: 3.450.000đ/m²</li>
            <li>Thi công hoàn thiện: 3.550.000đ/m²</li>
          </ul>
        </div>
        <hr className="my-4 border-gray-300" />
        <h3 className="text-xl font-semibold mb-4">Báo giá sơ bộ</h3>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                STT
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Phiên bản
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Thời gian tạo
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Người tạo
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Nội dung
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Trạng thái
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {quoteData.map((item, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.id}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.version}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.createdTime}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.creator}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.content}
                </td>
                <td
                  className={`border-b border-[#eee] py-5 px-4 dark:border-strokedark ${getStatusStyle(
                    item.status,
                  )}`}
                >
                  {item.status}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                  <FiMoreVertical
                    className="cursor-pointer"
                    onClick={() => toggleRowMenu(item.id)}
                  />
                  {activeMenu === item.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          Chỉnh sửa
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          Xóa
                        </a>
                        <Link
                          to={`/quotedetail/`}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="my-4 border-gray-300" />
        <h3 className="text-xl font-semibold mb-4">Thiết kế bản vẽ</h3>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                STT
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Bản vẽ
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Thời gian tạo
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Người thực hiện
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Trạng thái
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {designData.map((item, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.id}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.drawing}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.createdTime}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.executor}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.status}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <button className="text-primaryGreenButton hover:text-secondaryGreenButton">
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="my-4 border-gray-300" />
        <h3 className="text-xl font-semibold mb-4">Báo giá chi tiết</h3>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                STT
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Phiên bản
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Thời gian tạo
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Người tạo
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Nội dung
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {detailedQuoteData.map((item, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.id}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.version}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.createdTime}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.creator}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.content}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                  <FiMoreVertical
                    className="cursor-pointer"
                    onClick={() => toggleDetailedRowMenu(item.id)}
                  />
                  {activeDetailedMenu === item.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          Chỉnh sửa
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          Xóa
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          Xem chi tiết
                        </a>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="my-4 border-gray-300" />
        <h3 className="text-xl font-semibold mb-4">Hợp đồng</h3>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                STT
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Phiên bản
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Loại hợp đồng
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Người tạo
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Trạng thái
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Nội dung
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {contractData.map((item, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.id}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.version}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.contractType}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.creator}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.status}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.content}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                  <FiMoreVertical
                    className="cursor-pointer"
                    onClick={() => toggleContractRowMenu(item.id)}
                  />
                  {activeContractMenu === item.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          Chỉnh sửa
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          Xóa
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          Xem chi tiết
                        </a>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <!-- Thêm nội dung khác ở đây --> */}
      </div>
    </>
  );
};

export default ProjectDetail;
