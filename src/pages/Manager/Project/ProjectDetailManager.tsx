import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaUser,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaBan,
  FaHome,
  FaMailBulk,
  FaPhone,
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
import {
  getProjectDetail,
  cancelProject,
} from '../../../api/Project/ProjectApi';
import ClipLoader from 'react-spinners/ClipLoader';
import { ProjectDetail as ProjectDetailType } from '../../../types/ProjectTypes';
import InitialInfoTable from './components/Table/InitialInfoTable';
import HouseDesignDrawingInfoTable from './components/Table/HouseDesignDrawingInfoTable';
import FinalInfoTable from './components/Table/FinalInfoTable';
import ContractTable from './components/Table/ContractTable';
import Modal from '../../../components/Modals/Modal';
import { toast } from 'react-toastify';
import HouseDesignDrawingEmployeeList from './components/Modals/HouseDesignDrawingEmployeeList';
import { createHouseDesign } from '../../../api/HouseDesignDrawing/HouseDesignDrawingApi';
import AssignModal from './components/Modals/AssignModal';
import EmployeeList from './components/Employee/EmployeeList';
import ArrowIcon from '../../../SVG/ArrowIcon';
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
const ProjectDetailManager = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [projectDetail, setProjectDetail] = useState<ProjectDetailType | null>(
    null,
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<{
    [key: string]: any;
  }>({});
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [showEmployeeListModal, setShowEmployeeListModal] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [open, setOpen] = useState(0);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [cancelReason, setCancelReason] = useState('');

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  const fetchProjectDetail = async () => {
    if (projectId) {
      try {
        const data = await getProjectDetail(projectId);
        setProjectDetail(data);
      } catch (error) {
        console.error('Error fetching project detail:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProjectDetail();
    const interval = setInterval(fetchProjectDetail, 3000);

    return () => clearInterval(interval);
  }, [projectId]);

  const handleCancelProject = async () => {
    if (!projectId) {
      toast.error('Không tìm thấy ID dự án.');
      return;
    }

    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do chấm dứt dự án.');
      return;
    }

    try {
      await cancelProject(projectId, cancelReason);
      toast.success('Dự án đã được chấm dứt thành công!');
      fetchProjectDetail();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi chấm dứt dự án.');
    }
    setIsModalOpen(false);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setCancelReason('');
  };

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
    } else if (item === 'assign') {
      if (projectDetail.Status === 'Ended') {
        toast.error('Dự án đã chấm dứt, không thể phân công nhân viên.');
        return;
      }
      if (projectDetail.StaffName) {
        toast.error('Dự án đã có nhân viên đảm nhận.');
      } else if (
        projectDetail.Type === 'HAVE_DRAWING' &&
        !projectDetail.HouseDesignDrawingInfo.every(
          (info) => info.Status === 'Finalized',
        )
      ) {
        toast.error('Chưa hoàn thành 4 bản vẽ từ khách hàng.');
      } else if (
        projectDetail.Type === 'HAVE_DRAWING' &&
        projectDetail.HouseDesignDrawingInfo.length === 0
      ) {
        toast.error('Khách hàng chưa cung cấp bản vẽ.');
      } else {
        setShowEmployeeListModal(true);
      }
    }
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const statusMap: { [key: string]: string } = {
    Processing: 'Đang xử lý',
    Designed: 'Đã thiết kế',
    Reviewing: 'Chờ xác nhận',
    'Signed Contract': 'Đã ký hợp đồng',
    Finalized: 'Hoàn thành',
    Ended: 'Đã chấm dứt',
  };

  const mappedStatus = statusMap[projectDetail.Status] || 'Đang xử lý';

  const handleCloseEmployeeDialog = () => {
    setShowEmployeeDialog(false);
  };

  const handleSelectEmployee = (id: string, employeeData: any) => {
    if (currentCategory) {
      setSelectedEmployees((prev) => ({
        ...prev,
        [currentCategory]: {
          id,
          ...employeeData,
        },
      }));
      setShowEmployeeDialog(false);
    }
  };

  const handleAssignDesigners = async () => {
    const requiredCategories = [
      'Phối cảnh',
      'Kiến trúc',
      'Kết cấu',
      'Điện nước',
    ];
    const hasAllIds = requiredCategories.every(
      (category) => selectedEmployees[category],
    );

    if (!hasAllIds) {
      toast.error('Vui lòng chọn đủ nhân viên cho tất cả các hạng mục.');
      return;
    }

    try {
      const data = {
        projectId: projectDetail.Id,
        designerPerspective: selectedEmployees['Phối cảnh'].id,
        designerArchitecture: selectedEmployees['Kiến trúc'].id,
        designerStructure: selectedEmployees['Kết cấu'].id,
        designerElectricityWater: selectedEmployees['Điện nước'].id,
      };
      await createHouseDesign(data);
      toast.success('Phân công thành công!');
      setIsAssignModalOpen(false);
      fetchProjectDetail();
    } catch (error: any) {
      console.error('Error assigning designers:', error);
      if (error.response && error.response.status === 409) {
        toast.error(
          error.response.data.Error || 'Có lỗi xảy ra khi phân công.',
        );
      } else {
        toast.error('Có lỗi xảy ra khi phân công.');
      }
    }
  };

  const refreshProjectDetail = () => {
    fetchProjectDetail();
  };

  const isInitialInfoFinalized = projectDetail.InitialInfo?.some(
    (info) => info.Status === 'Finalized',
  );
  const hasDesignContract = projectDetail.ContractInfo?.some(
    (contract) =>
      contract.Name === 'Hợp đồng tư vấn và thiết kế bản vẽ nhà ở dân dụng',
  );

  const resetSelectedEmployees = () => {
    setSelectedEmployees({});
  };

  const resetSelectedEmployeeId = () => {
    setSelectedEmployeeId(null);
  };

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
                  {/* <a
                    href="#"
                    onClick={() => handleMenuItemClick('history')}
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                  >
                    <FaHistory className="mr-2" />
                    Lịch sử chỉnh sửa
                  </a> */}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (projectDetail.Status === 'Ended') {
                        toast.error('Dự án đã được chấm dứt.');
                      } else {
                        setIsModalOpen(true);
                      }
                    }}
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                  >
                    <FaBan className="mr-2" />
                    Chấm dứt dự án
                  </a>
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
              phoneNumber:
                formatVietnamesePhoneNumber(projectDetail.Phone) || '',
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
              staffName: projectDetail.StaffName || 'Phân công nhân viên',
              staffPhone:
                formatVietnamesePhoneNumber(projectDetail.StaffPhone) || '',
            }}
            fields={[
              { key: 'staffName', label: 'Name' },
              { key: 'staffPhone', label: 'Phone' },
            ]}
            onClick={() =>
              projectDetail.StaffName === '' && handleMenuItemClick('assign')
            }
            avatarUrl={projectDetail.StaffAvatar || Fee}
          />
        </div>

        <StatusTracker currentStatus={mappedStatus} />
        {projectDetail.Status === 'Ended' && projectDetail.ReasonCanceled && (
          <div className="p-4 bg-red-100 text-red-800 rounded">
            <strong>Dự án đã chấm dứt vì: </strong>
            {projectDetail.ReasonCanceled}
          </div>
        )}
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Thông tin dự án</h2>
          <span className="text-gray-500 text-sm">
            Từ lúc {new Date(projectDetail.InsDate).toLocaleString()}
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
          </div>
        </div>

        <div className="mt-4">
          {/* <!-- Báo giá sơ bộ--> */}
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
            <AccordionBody className="mb-7 pt-0 text-base font-normal font-montserrat">
              {projectDetail.InitialInfo &&
                projectDetail.InitialInfo.length > 0 && (
                  <InitialInfoTable quoteData={projectDetail.InitialInfo} />
                )}
            </AccordionBody>
          </Accordion>
          {/* <!-- Báo giá sơ bộ --> */}

          {/* <!-- Thiết kế bản vẽ --> */}
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
              {projectDetail.HouseDesignDrawingInfo &&
              projectDetail.HouseDesignDrawingInfo.length === 0 &&
              projectDetail.StaffName &&
              isInitialInfoFinalized &&
              hasDesignContract &&
              projectDetail.ContractInfo.length > 0 &&
              projectDetail.ContractInfo[0].FileContract !== null ? (
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="mb-4 bg-primaryGreenButton text-white p-2 rounded font-montserrat"
                >
                  Phân công nhân viên
                </button>
              ) : (
                <AccordionBody className="mb-7 pt-0 text-base font-normal font-montserrat">
                  {projectDetail.HouseDesignDrawingInfo &&
                    projectDetail.HouseDesignDrawingInfo.length > 0 && (
                      <HouseDesignDrawingInfoTable
                        designData={projectDetail.HouseDesignDrawingInfo}
                      />
                    )}
                </AccordionBody>
              )}
            </Accordion>
          )}
          {isAssignModalOpen && (
            <AssignModal
              onClose={() => {
                setIsAssignModalOpen(false);
                resetSelectedEmployees();
              }}
              onAssign={handleAssignDesigners}
              setCurrentCategory={setCurrentCategory}
              setShowEmployeeDialog={setShowEmployeeDialog}
              selectedEmployees={selectedEmployees}
              resetSelectedEmployees={resetSelectedEmployees}
              resetSelectedEmployeeId={resetSelectedEmployeeId}
            />
          )}
          {showEmployeeDialog && (
            <HouseDesignDrawingEmployeeList
              onSelectEmployee={handleSelectEmployee}
              onClose={handleCloseEmployeeDialog}
              selectedEmployees={selectedEmployees}
            />
          )}
          {/* <!-- Thiết kế bản vẽ --> */}

          {/* <!-- Báo giá chi tiết --> */}
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
            <AccordionBody className="mb-7 pt-0 text-base font-normal font-montserrat">
              {projectDetail.FinalInfo &&
                projectDetail.FinalInfo.length > 0 && (
                  <FinalInfoTable detailedQuoteData={projectDetail.FinalInfo} />
                )}
            </AccordionBody>
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
      {isModalOpen && (
        <Modal
          title="Xác nhận"
          message="Bạn có muốn chấm dứt dự án này không?"
          onConfirm={handleCancelProject}
          onCancel={handleCancelModal}
        >
          <textarea
            placeholder="Lý do chấm dứt dự án"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mt-2 h-24"
          />
        </Modal>
      )}
      {showEmployeeListModal && projectId && (
        <Dialog
          open={showEmployeeListModal}
          handler={() => setShowEmployeeListModal(false)}
        >
          <EmployeeList
            onSelectEmployee={(id, note) => {
              setShowEmployeeListModal(false);
            }}
            projectId={projectId}
            onRefreshProjectDetail={refreshProjectDetail}
          />
        </Dialog>
      )}
    </>
  );
};

export default ProjectDetailManager;
