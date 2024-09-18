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
import PreliminaryQuoteTable from './Table/PreliminaryQuoteTable';
import DrawingDesignTable from './Table/DrawingDesignTable';
import DetailedQuoteTable from './Table/DetailedQuoteTable';
import ContractTable from './Table/ContractTable';

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
        <PreliminaryQuoteTable quoteData={quoteData} />
        <hr className="my-4 border-gray-300" />
        <h3 className="text-xl font-semibold mb-4">Thiết kế bản vẽ</h3>
        <DrawingDesignTable designData={designData} />
        <hr className="my-4 border-gray-300" />
        <h3 className="text-xl font-semibold mb-4">Báo giá chi tiết</h3>
        <DetailedQuoteTable detailedQuoteData={detailedQuoteData} />
        <hr className="my-4 border-gray-300" />
        <h3 className="text-xl font-semibold mb-4">Hợp đồng</h3>
        <ContractTable contractData={contractData} />
        {/* <!-- Thêm nội dung khác ở đây --> */}
      </div>
    </>
  );
};

export default ProjectDetail;
