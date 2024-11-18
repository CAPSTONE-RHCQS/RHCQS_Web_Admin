import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaCommentDots,
  FaUser,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaEdit,
  FaFileContract,
  FaBuilding,
} from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import ContactCard from '../../../components/ContactCard';
import Avatar from '../../../images/user/user-01.png';
import House from '../../../images/house/phan-loai-cac-nha-dan-dung-2.png';
import Process from '../../../images/process.jpg';
import Fee from '../../../images/fee.jpg';
import StatusTracker from '../../../components/StatusTracker/StatusTracker';
import ContractHistoryTimeline from '../../../components/ContractHistoryTimeline';
import { Dialog } from '@material-tailwind/react';
import ChatBox from '../../../components/ChatBox';
import { getProjectDetail } from '../../../api/Project/ProjectApi';
import ClipLoader from 'react-spinners/ClipLoader';
import { ProjectDetail as ProjectDetailType } from '../../../types/ProjectTypes';
import InitialInfoTable from './components/Table/InitialInfoTable';
import HouseDesignDrawingInfoTable from './components/Table/HouseDesignDrawingInfoTable';
import FinalInfoTable from './components/Table/FinalInfoTable';
import ContractTable from './components/Table/ContractTable';
import { postFinalQuotationByProjectId } from '../../../api/FinalQuotation/FinalQuotationApi';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  isAnyInitialInfoFinalized,
  isAnyFinalInfoFinalized,
} from '../../../utils/projectUtils';

const ProjectDetailSalesStaff = () => {
  const { id } = useParams<{ id: string }>();
  const [projectDetail, setProjectDetail] = useState<ProjectDetailType | null>(
    null,
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInitialInfo, setShowInitialInfo] = useState(false);
  const [showDesignDrawing, setShowDesignDrawing] = useState(false);
  const [showFinalInfo, setShowFinalInfo] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  if (!projectDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={'#5BABAC'} loading={true} />
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
    Processing: 'Đang xử lý',
    Designed: 'Đã thiết kế',
    Reviewing: 'Chờ xác nhận',
    'Signed Contract': 'Đã ký hợp đồng',
    Finalized: 'Hoàn thành',
    Ended: 'Đã chấm dứt',
  };

  const mappedStatus = statusMap[projectDetail.Status] || 'Đang Xử Lý';

  const handleInitializeFinalQuotation = () => {
    if (id) {
      navigate(`/create-new-final-quotation-staff/${id}`);
    } else {
      toast.error('Không tìm thấy ID dự án.');
    }
  };

  const handleCreateContractDesign = () => {
    if (isAnyInitialInfoFinalized(projectDetail.InitialInfo)) {
      navigate(`/create-contract-design/${id}`);
    } else {
      toast.error(
        'Chưa hoàn thành báo giá sơ bộ. Không thể tạo hợp đồng thiết kế.',
      );
      setShowInitialInfo(true);
    }
  };

  const handleCreateConstructionContract = () => {
    if (isAnyFinalInfoFinalized(projectDetail.FinalInfo)) {
      navigate(`/create-construction-contract/${id}`);
    } else {
      toast.error(
        'Chưa hoàn thành báo giá chi tiết. Không thể tạo hợp đồng thi công.',
      );
    }
  };

  const isFinalized = isAnyInitialInfoFinalized(projectDetail.InitialInfo);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-primary dark:text-white">
            Chi tiết dự án
          </h2>
          <div
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
            className="relative"
          >
            <FiMoreVertical className="text-2xl text-primary dark:text-white cursor-pointer" />
            {menuVisible && (
              <div
                className="absolute right-4 top-1 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-opacity duration-300 ease-in-out"
                style={{ opacity: menuVisible ? 1 : 0 }}
              >
                <div className="py-2">
                  <a
                    href="#"
                    onClick={() => handleMenuItemClick('history')}
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                  >
                    <FaHistory className="mr-2" />
                    Lịch sử chỉnh sửa
                  </a>
                  <Link
                    to={`/editquote`}
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                  >
                    <FaEdit className="mr-2" />
                    Chỉnh sửa hợp đồng
                  </Link>
                  <div
                    onClick={handleCreateContractDesign}
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    <FaFileContract className="mr-2" />
                    Tạo hợp đồng thiết kế
                  </div>
                  <div
                    onClick={handleCreateConstructionContract}
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    <FaBuilding className="mr-2" />
                    Tạo hợp đồng thi công
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Dialog open={showHistory} handler={handleCloseHistory}>
          <ContractHistoryTimeline onClose={handleCloseHistory} />
        </Dialog>

        <div className="flex flex-row gap-3 justify-between">
          <ContactCard
            data={{
              title: 'Mã Dự Án',
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
          <h2 className="text-2xl font-bold text-primary">Thông tin dự án</h2>
          <span className="text-gray-500 text-sm">
            Tạo lúc {new Date(projectDetail.InsDate).toLocaleString()}
          </span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaUser className="mr-2 text-secondary" />
          <span className="font-semibold">Tên khách hàng:</span>
          <span className="text-gray-700 ml-2">
            {projectDetail.AccountName}
          </span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMapMarkerAlt className="mr-2 text-secondary" />
          <span className="font-semibold">Địa chỉ thi công:</span>
          <span className="text-gray-700 ml-2">{projectDetail.Address}</span>
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaRulerCombined className="mr-2 text-secondary" />
          <span className="font-semibold">Diện tích:</span>
          <span className="text-gray-700 ml-2"> {projectDetail.Area} m²</span>
        </div>

        <hr className="my-4 border-gray-300" />
        <h3
          className="text-xl font-semibold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() => setShowInitialInfo(!showInitialInfo)}
        >
          Báo giá sơ bộ
          {projectDetail.InitialInfo &&
            projectDetail.InitialInfo.length > 0 &&
            (showInitialInfo ? (
              <FaChevronUp className="ml-2 text-secondary" />
            ) : (
              <FaChevronDown className="ml-2 text-secondary" />
            ))}
        </h3>
        {projectDetail.InitialInfo &&
          projectDetail.InitialInfo.length === 0 && (
            <button
              className="bg-primaryGreenButton text-white px-4 py-2 rounded hover:bg-secondaryGreenButton transition-colors duration-200 mb-4"
              onClick={() => navigate(`/create-initial-quote/${id}`)}
            >
              Khởi tạo báo giá
            </button>
          )}
        {projectDetail.InitialInfo &&
          projectDetail.InitialInfo.length > 0 &&
          showInitialInfo && (
            <InitialInfoTable quoteData={projectDetail.InitialInfo} />
          )}

        <hr className="my-4 border-gray-300" />
        <h3
          className="text-xl font-semibold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() => setShowDesignDrawing(!showDesignDrawing)}
        >
          Thiết kế bản vẽ
          {projectDetail.HouseDesignDrawingInfo &&
            projectDetail.HouseDesignDrawingInfo.length > 0 &&
            (showDesignDrawing ? (
              <FaChevronUp className="ml-2 text-secondary" />
            ) : (
              <FaChevronDown className="ml-2 text-secondary" />
            ))}
        </h3>
        {projectDetail.HouseDesignDrawingInfo &&
          projectDetail.HouseDesignDrawingInfo.length > 0 &&
          showDesignDrawing && (
            <HouseDesignDrawingInfoTable
              designData={projectDetail.HouseDesignDrawingInfo}
            />
          )}

        <hr className="my-4 border-gray-300" />
        <h3
          className="text-xl font-semibold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() => setShowFinalInfo(!showFinalInfo)}
        >
          Báo giá chi tiết
          {projectDetail.FinalInfo &&
            projectDetail.FinalInfo.length > 0 &&
            (showFinalInfo ? (
              <FaChevronUp className="ml-2 text-secondary" />
            ) : (
              <FaChevronDown className="ml-2 text-secondary" />
            ))}
        </h3>
        {projectDetail.FinalInfo &&
          projectDetail.FinalInfo.length === 0 &&
          isFinalized && (
            <button
              className="bg-primaryGreenButton text-white px-4 py-2 rounded hover:bg-secondaryGreenButton transition-colors duration-200 mb-4"
              onClick={handleInitializeFinalQuotation}
            >
              Khởi tạo báo giá
            </button>
          )}
        {projectDetail.FinalInfo &&
          projectDetail.FinalInfo.length > 0 &&
          showFinalInfo && (
            <FinalInfoTable detailedQuoteData={projectDetail.FinalInfo} />
          )}

        <hr className="my-4 border-gray-300" />
        <h3
          className="text-xl font-semibold mb-4 flex items-center cursor-pointer text-primary"
          onClick={() => setShowContract(!showContract)}
        >
          Hợp đồng
          {projectDetail.ContractInfo &&
            projectDetail.ContractInfo.length > 0 &&
            (showContract ? (
              <FaChevronUp className="ml-2 text-secondary" />
            ) : (
              <FaChevronDown className="ml-2 text-secondary" />
            ))}
        </h3>
        {projectDetail.ContractInfo &&
          projectDetail.ContractInfo.length > 0 &&
          showContract && (
            <ContractTable contractData={projectDetail.ContractInfo} />
          )}
      </div>
    </>
  );
};

export default ProjectDetailSalesStaff;
