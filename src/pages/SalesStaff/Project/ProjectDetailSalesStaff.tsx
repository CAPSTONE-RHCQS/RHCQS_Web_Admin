import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaCommentDots,
  FaUser,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import ContactCard from '../../../components/ContactCard';
import Avatar from '../../../images/user/user-01.png';
import House from '../../../images/house/phan-loai-cac-nha-dan-dung-2.png';
import Process from '../../../images/process.jpg';
import Fee from '../../../images/fee.jpg';
import StatusTracker from '../../../components/StatusTracker';
import ContractHistoryTimeline from '../../../components/ContractHistoryTimeline';
import { Dialog } from '@material-tailwind/react';
import ChatBox from '../../../components/ChatBox';
import { getProjectDetail } from '../../../api/Project/Project';
import ClipLoader from 'react-spinners/ClipLoader';
import { ProjectDetail as ProjectDetailType } from '../../../types/ProjectTypes';
import InitialInfoTable from './Table/InitialInfoTable';
import HouseDesignDrawingInfoTable from './Table/HouseDesignDrawingInfoTable';
import FinalInfoTable from './Table/FinalInfoTable';
import ContractTable from './Table/ContractTable';

const ProjectDetailSalesStaff = () => {
  const { id } = useParams<{ id: string }>();
  const [projectDetail, setProjectDetail] = useState<ProjectDetailType | null>(
    null,
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (id) {
        try {
          const data = await getProjectDetail(id);
          setProjectDetail(data);
        } catch (error) {
          console.error('Error fetching project detail:', error);
        }
      } else {
        console.error('Project ID is undefined');
      }
    };

    fetchProjectDetail();
  }, [id]);

  if (!projectDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={'#123abc'} loading={true} />
      </div>
    );
  }

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

  const statusMap: { [key: string]: string } = {
    Processing: 'Đang Xử Lý',
    Designing: 'Đang Thiết Kế',
    Quoting: 'Đang Báo Giá',
    Completed: 'Hoàn Thành',
  };

  const mappedStatus = statusMap[projectDetail.Status] || 'Đang Xử Lý';

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

        <div className="flex flex-row gap-3 justify-between">
          <ContactCard
            data={{
              title: 'Mã số xử lý',
              number: projectDetail.ProjectCode || 'N/A',
            }}
            fields={[
              { key: 'title', label: 'Name' },
              { key: 'number', label: 'Code' },
            ]}
            avatarUrl={Process}
          />
          <ContactCard
            data={{
              fullName: projectDetail.AccountName || 'N/A',
              // phoneNumber: '0965486940',
              // emailAddress: 'email@fpt.edu.vn',
            }}
            fields={[
              { key: 'fullName', label: 'Name' },
              { key: 'phoneNumber', label: 'Phone' },
              { key: 'emailAddress', label: 'Email' },
            ]}
            avatarUrl={Avatar}
          />
          <ContactCard
            data={{
              nameHouse: 'Nhà ở dân dụng',
              address: projectDetail.Address || 'N/A',
            }}
            fields={[
              { key: 'nameHouse', label: 'Name' },
              { key: 'address', label: 'Address' },
            ]}
            avatarUrl={House}
          />

          <ContactCard
            data={{
              staffName: projectDetail.StaffName || 'Chờ phân công...',
              staffPhone: projectDetail.StaffPhone || '',
            }}
            fields={[
              { key: 'staffName', label: 'Name' },
              { key: 'staffPhone', label: 'Phone' },
            ]}
            avatarUrl={projectDetail.StaffAvatar || Fee}
          />
        </div>

        <StatusTracker currentStatus={mappedStatus} />
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Thông tin dự án</h2>
          <span className="text-gray-500 text-sm">
            Tạo lúc {new Date(projectDetail.InsDate).toLocaleString()}
          </span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaUser className="mr-2" />
          <span className="font-semibold">Tên khách hàng:</span>
          <span className="text-gray-700 ml-2">
            {projectDetail.AccountName}
          </span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          <span className="font-semibold">Địa chỉ thi công:</span>
          <span className="text-gray-700 ml-2">{projectDetail.Address}</span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaRulerCombined className="mr-2" />
          <span className="font-semibold">Diện tích:</span>
          <span className="text-gray-700 ml-2"> {projectDetail.Area} m²</span>
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
        <InitialInfoTable quoteData={projectDetail.InitialInfo || []} />
        <hr className="my-4 border-gray-300" />
        <h3 className="text-xl font-semibold mb-4">Thiết kế bản vẽ</h3>
        <HouseDesignDrawingInfoTable
          designData={projectDetail.HouseDesignDrawingInfo || []}
        />
        <hr className="my-4 border-gray-300" />
        <h3 className="text-xl font-semibold mb-4">Báo giá chi tiết</h3>
        <FinalInfoTable detailedQuoteData={projectDetail.FinalInfo || []} />
        <hr className="my-4 border-gray-300" />
        <h3 className="text-xl font-semibold mb-4">Hợp đồng</h3>
        <ContractTable contractData={projectDetail.ContractInfo || []} />
      </div>
    </>
  );
};

export default ProjectDetailSalesStaff;
