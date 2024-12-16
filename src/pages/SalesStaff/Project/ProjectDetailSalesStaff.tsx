import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaFileContract,
  FaBuilding,
  FaUser,
  FaPhone,
  FaMailBulk,
  FaCommentDots,
} from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import ContactCard from '../../../components/ContactCard';
import House from '../../../images/house/phan-loai-cac-nha-dan-dung-2.png';
import Process from '../../../images/process.jpg';
import Fee from '../../../images/fee.jpg';
import StatusTracker from '../../../components/StatusTracker/StatusTracker';
import ContractHistoryTimeline from '../../../components/ContractHistoryTimeline';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Dialog,
} from '@material-tailwind/react';
import { getProjectDetail } from '../../../api/Project/ProjectApi';
import ClipLoader from 'react-spinners/ClipLoader';
import { ProjectDetail as ProjectDetailType } from '../../../types/ProjectTypes';
import { toast } from 'react-toastify';
import {
  isAnyInitialInfoFinalized,
  isAnyFinalInfoFinalized,
} from '../../../utils/projectUtils';
import ArrowIcon from '../../../SVG/ArrowIcon';
import InitialInfoTable from './components/Table/InitialInfoTable';
import HouseDesignDrawingInfoTable from './components/Table/HouseDesignDrawingInfoTable';
import FinalInfoTable from './components/Table/FinalInfoTable';
import ContractTable from './components/Table/ContractTable';
import { getProfile } from '../../../api/Account/AccountApi';
import CreateChatRoom from '../../../components/Chat/CreateRoom';
import { useChat } from '../../../context/ChatContext';
import { HomeModernIcon } from '@heroicons/react/24/solid';
import { formatVietnamesePhoneNumber } from '../../../utils/phoneUtils';

const getTypeInVietnamese = (type: string) => {
  switch (type) {
    case 'TEMPLATE':
      return 'Mẫu nhà';
    case 'FINISHED':
      return 'Hoàn thiện';
    case 'ROUGH':
      return 'Thô';
    case 'ALL':
      return 'Thô & Hoàn thiện';
    case 'HAVE_DRAWING':
      return 'Sẵn bản thiết kế';
    default:
      return 'Khác';
  }
};

const ProjectDetailSalesStaff = () => {
  const { id } = useParams<{ id: string }>();
  const [projectDetail, setProjectDetail] = useState<ProjectDetailType | null>(
    null,
  );
  const [user, setUser] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [open, setOpen] = useState(0);
  const navigate = useNavigate();
  const [showChatBox, setShowChatBox] = useState(false);
  const { setIsDropdownOpen } = useChat();
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfile();
      setUser(profile);
    };
    fetchProfile();
  }, []);

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
    const interval = setInterval(fetchProjectDetail, 3000);

    return () => clearInterval(interval);
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

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const handleOpenChat = async () => {
    setShowChatBox(true);
    setIsDropdownOpen(true);
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

  const handleCreateContractDesign = () => {
    if (isAnyInitialInfoFinalized(projectDetail.InitialInfo)) {
      navigate(`/create-contract-design/${id}`);
    } else {
      toast.error(
        'Chưa hoàn thành báo giá sơ bộ. Không thể tạo hợp đồng thiết kế.',
      );
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

  const isContractDesignEnabled =
    projectDetail.Type === 'TEMPLATE' || projectDetail.Type === 'HAVE_DRAWING';

  const isContractHidden =
    projectDetail.ContractInfo.some(
      (contract) =>
        contract.Name === 'Hợp đồng tư vấn và thiết kế bản vẽ nhà ở dân dụng',
    ) &&
    projectDetail.ContractInfo.some(
      (contract) => contract.Name === 'Hợp đồng thi công nhà ở dân dụng',
    );

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
            {!isContractHidden && (
              <>
                <FiMoreVertical className="text-2xl text-primary dark:text-white cursor-pointer" />
                {menuVisible && (
                  <div className="absolute right-4 top-1 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-opacity duration-300 ease-in-out">
                    <div className="py-2">
                      {!isContractDesignEnabled &&
                        !projectDetail.ContractInfo.some(
                          (contract) =>
                            contract.Name ===
                            'Hợp đồng tư vấn và thiết kế bản vẽ nhà ở dân dụng',
                        ) && (
                          <div
                            onClick={handleCreateContractDesign}
                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                          >
                            <FaFileContract className="mr-2" />
                            Tạo hợp đồng thiết kế
                          </div>
                        )}
                      {!projectDetail.ContractInfo.some(
                        (contract) =>
                          contract.Name === 'Hợp đồng thi công nhà ở dân dụng',
                      ) && (
                        <div
                          onClick={handleCreateConstructionContract}
                          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                        >
                          <FaBuilding className="mr-2" />
                          Tạo hợp đồng thi công
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
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
              number: projectDetail.ProjectCode || '',
            }}
            fields={[
              { key: 'title', label: 'Name' },
              { key: 'number', label: 'Code' },
            ]}
            avatarUrl={Process}
          />
          <ContactCard
            data={{
              fullName: projectDetail.AccountName || '',
              phoneNumber: projectDetail.Phone || '',
              mail: projectDetail.Mail || '',
            }}
            fields={[
              { key: 'fullName', label: 'Name' },
              { key: 'phoneNumber', label: 'Phone' },
              { key: 'mail', label: 'Mail' },
            ]}
            avatarUrl={projectDetail.Avatar}
          />
          <ContactCard
            data={{
              // nameHouse: 'Nhà ở dân dụng',
              address: projectDetail.Address || '',
            }}
            fields={[
              // { key: 'nameHouse', label: 'Name' },
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
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2">
            <div className="mb-2 text-lg flex items-center">
              <HomeModernIcon className="mr-2 text-secondary h-5 w-5" />
              <span className="font-semibold">Tên dự án:</span>
              <span className="text-gray-700 ml-2">{projectDetail.Name}</span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaHome className="mr-2 text-secondary" />
              <span className="font-semibold">Phân loại dự án:</span>
              <span className="text-gray-700 ml-2">
                {getTypeInVietnamese(projectDetail.Type)}
              </span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaMapMarkerAlt className="mr-2 text-secondary" />
              <span className="font-semibold">Địa chỉ thi công:</span>
              <span className="text-gray-700 ml-2">
                {projectDetail.Address}
              </span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaRulerCombined className="mr-2 text-secondary" />
              <span className="font-semibold">Diện tích xây dựng:</span>
              <span className="text-gray-700 ml-2">
                {projectDetail.Area} m²
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mb-2 text-lg flex items-center">
              <FaUser className="mr-2 text-secondary" />
              <span className="font-semibold">Chủ đầu tư:</span>
              <span className="text-gray-700 ml-2">
                {projectDetail.AccountName}
              </span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaPhone className="mr-2 text-secondary" />
              <span className="font-semibold">Số điện thoại:</span>
              <span className="text-gray-700 ml-2">
                {formatVietnamesePhoneNumber(projectDetail.Phone)}
              </span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaMailBulk className="mr-2 text-secondary" />
              <span className="font-semibold">Địa chỉ email:</span>
              <span className="text-gray-700 ml-2">{projectDetail.Mail}</span>
            </div>
            <div className="mb-2 text-lg flex items-center">
              <FaCommentDots className="mr-2 text-primaryGreenButton" />
              <button
                onClick={handleOpenChat}
                className="font-semibold text-primaryGreenButton"
              >
                Liên hệ với khách hàng
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Báo giá sơ bộ--> */}
        <div className="mt-4">
          <Accordion
            open={open === 1}
            icon={
              projectDetail.InitialInfo &&
              projectDetail.InitialInfo.length > 0 ? (
                <ArrowIcon id={1} open={open} />
              ) : null
            }
            className="mb-2 rounded-lg border border-blue-gray-100 px-4"
          >
            <AccordionHeader
              onClick={
                projectDetail.InitialInfo &&
                projectDetail.InitialInfo.length > 0
                  ? () => handleOpen(1)
                  : undefined
              }
              className={`border-b-0 transition-colors ${
                open === 1
                  ? 'text-secondary hover:text-secondaryBlue'
                  : 'text-primary hover:text-primaryDarkGreen'
              } font-montserrat`}
            >
              Báo giá sơ bộ
            </AccordionHeader>
            {projectDetail.InitialInfo &&
            projectDetail.InitialInfo.length === 0 ? (
              <button
                className="mb-4 bg-primaryGreenButton text-white px-4 py-2 rounded hover:bg-secondaryGreenButton transition-colors duration-200 font-montserrat"
                onClick={() => navigate(`/create-initial-quote/${id}`)}
              >
                Khởi tạo báo giá sơ bộ
              </button>
            ) : (
              <AccordionBody className="mb-7 pt-0 text-base font-normal font-montserrat">
                {projectDetail.InitialInfo &&
                  projectDetail.InitialInfo.length > 0 && (
                    <InitialInfoTable quoteData={projectDetail.InitialInfo} />
                  )}
              </AccordionBody>
            )}
          </Accordion>
          {/* <!-- Báo giá sơ bộ --> */}

          {/* <!-- Bản vẽ thiết kế --> */}
          {projectDetail.Type !== 'TEMPLATE' && (
            <Accordion
              open={open === 2}
              icon={
                projectDetail.HouseDesignDrawingInfo &&
                projectDetail.HouseDesignDrawingInfo.length > 0 ? (
                  <ArrowIcon id={2} open={open} />
                ) : null
              }
              className="mb-2 rounded-lg border border-blue-gray-100 px-4"
            >
              <AccordionHeader
                onClick={
                  projectDetail.HouseDesignDrawingInfo &&
                  projectDetail.HouseDesignDrawingInfo.length > 0
                    ? () => handleOpen(2)
                    : undefined
                }
                className={`border-b-0 transition-colors ${
                  open === 2
                    ? 'text-secondary hover:text-secondaryBlue'
                    : 'text-primary hover:text-primaryDarkGreen'
                } font-montserrat`}
              >
                Thiết kế bản vẽ
              </AccordionHeader>
              <AccordionBody className="mb-7 pt-0 text-base font-normal font-montserrat">
                {projectDetail.HouseDesignDrawingInfo &&
                  projectDetail.HouseDesignDrawingInfo.length > 0 && (
                    <HouseDesignDrawingInfoTable
                      designData={projectDetail.HouseDesignDrawingInfo}
                    />
                  )}
              </AccordionBody>
            </Accordion>
          )}
          {/* <!-- Bản vẽ thiết kế --> */}

          {/* <!-- Báo giá chi tiết--> */}
          <Accordion
            open={open === 3}
            icon={
              projectDetail.FinalInfo && projectDetail.FinalInfo.length > 0 ? (
                <ArrowIcon id={3} open={open} />
              ) : null
            }
            className="mb-2 rounded-lg border border-blue-gray-100 px-4"
          >
            <AccordionHeader
              onClick={
                projectDetail.FinalInfo && projectDetail.FinalInfo.length > 0
                  ? () => handleOpen(3)
                  : undefined
              }
              className={`border-b-0 transition-colors ${
                open === 3
                  ? 'text-secondary hover:text-secondaryBlue'
                  : 'text-primary hover:text-primaryDarkGreen'
              } font-montserrat`}
            >
              Báo giá chi tiết
            </AccordionHeader>
            {(projectDetail.FinalInfo &&
              projectDetail.FinalInfo.length === 0 &&
              isFinalized &&
              projectDetail.ContractInfo.some(
                (info) => info.Status === 'Finished',
              ) &&
              projectDetail.HouseDesignDrawingInfo.some(
                (info) =>
                  info.Type === 'DIENNUOC' && info.Status === 'Finalized',
              )) ||
            (projectDetail.FinalInfo.length === 0 &&
              isContractDesignEnabled &&
              isFinalized &&
              projectDetail.HouseDesignDrawingInfo.some(
                (info) =>
                  info.Type === 'DIENNUOC' && info.Status === 'Finalized',
              )) ||
            (projectDetail.FinalInfo.length === 0 &&
              isFinalized &&
              projectDetail.Type === 'TEMPLATE') ? (
              <button
                className="mb-4 bg-primaryGreenButton text-white px-4 py-2 rounded hover:bg-secondaryGreenButton transition-colors duration-200 font-montserrat"
                onClick={() =>
                  navigate(`/create-new-final-quotation-staff/${id}`)
                }
              >
                Khởi tạo báo giá chi tiết
              </button>
            ) : (
              <AccordionBody className="mb-7 pt-0 text-base font-normal font-montserrat">
                {projectDetail.FinalInfo &&
                  projectDetail.FinalInfo.length > 0 && (
                    <FinalInfoTable
                      detailedQuoteData={projectDetail.FinalInfo}
                    />
                  )}
              </AccordionBody>
            )}
          </Accordion>
          {/* <!-- Báo giá chi tiết --> */}

          {/* <!-- Hợp đồng --> */}
          <Accordion
            open={open === 4}
            icon={
              projectDetail.ContractInfo &&
              projectDetail.ContractInfo.length > 0 ? (
                <ArrowIcon id={4} open={open} />
              ) : null
            }
            className="mb-2 rounded-lg border border-blue-gray-100 px-4"
          >
            <AccordionHeader
              onClick={
                projectDetail.ContractInfo &&
                projectDetail.ContractInfo.length > 0
                  ? () => handleOpen(4)
                  : undefined
              }
              className={`border-b-0 transition-colors ${
                open === 4
                  ? 'text-secondary hover:text-secondaryBlue'
                  : 'text-primary hover:text-primaryDarkGreen'
              } font-montserrat`}
            >
              Hợp đồng
            </AccordionHeader>
            <AccordionBody className="mb-7 pt-0 text-base font-normal font-montserrat">
              {projectDetail.ContractInfo &&
                projectDetail.ContractInfo.length > 0 && (
                  <ContractTable contractData={projectDetail.ContractInfo} />
                )}
            </AccordionBody>
          </Accordion>
          {/* <!-- Hợp đồng --> */}
        </div>
      </div>

      {showChatBox && (
        <CreateChatRoom
          saleName={user?.Username}
          salesId={user.Id}
          cusId={projectDetail?.CustomerId}
          onClose={() => setShowChatBox(false)}
        />
      )}
    </>
  );
};

export default ProjectDetailSalesStaff;
