import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaCommentDots,
  FaUser,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaEdit,
  FaUserPlus,
  FaEllipsisH,
  FaBan,
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

const ProjectDetail = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [projectDetail, setProjectDetail] = useState<ProjectDetailType | null>(
    null,
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showInitialInfo, setShowInitialInfo] = useState(false);
  const [showDesignDrawing, setShowDesignDrawing] = useState(false);
  const [showFinalInfo, setShowFinalInfo] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<{
    [key: string]: any;
  }>({});
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [showEmployeeListModal, setShowEmployeeListModal] = useState(false);

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
  }, [projectId]);

  const handleCancelProject = async () => {
    if (!projectId) {
      toast.error('Không tìm thấy ID dự án.');
      return;
    }

    try {
      await cancelProject(projectId);
      toast.success('Dự án đã được chấm dứt thành công!');
      fetchProjectDetail();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi chấm dứt dự án.');
    }
    setIsModalOpen(false);
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
      } else {
        setShowEmployeeListModal(true);
      }
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
    console.log('Refreshing project detail...');
  };

  const isInitialInfoFinalized = projectDetail.InitialInfo?.some(
    (info) => info.Status === 'Finalized',
  );
  const hasDesignContract = projectDetail.ContractInfo?.some(
    (contract) =>
      contract.Name === 'Hợp đồng tư vấn và thiết kế bản vẽ nhà ở dân dụng',
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
                  {/* <Link
                      to={`/editquote`}
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                    >
                      <FaEdit className="mr-2" />
                      Chỉnh sửa hợp đồng
                    </Link> */}
                  <a
                    href="#"
                    onClick={() => handleMenuItemClick('assign')}
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                  >
                    <FaUserPlus className="mr-2" />
                    Phân công nhân viên
                  </a>
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
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
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
        projectDetail.HouseDesignDrawingInfo.length === 0 &&
        projectDetail.StaffName &&
        isInitialInfoFinalized &&
        hasDesignContract ? (
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="bg-primaryGreenButton text-white p-2 rounded"
          >
            Phân công nhân viên
          </button>
        ) : (
          projectDetail.HouseDesignDrawingInfo &&
          projectDetail.HouseDesignDrawingInfo.length > 0 &&
          showDesignDrawing && (
            <HouseDesignDrawingInfoTable
              designData={projectDetail.HouseDesignDrawingInfo}
            />
          )
        )}

        {isAssignModalOpen && (
          <AssignModal
            onClose={() => setIsAssignModalOpen(false)}
            onAssign={handleAssignDesigners}
            setCurrentCategory={setCurrentCategory}
            setShowEmployeeDialog={setShowEmployeeDialog}
            selectedEmployees={selectedEmployees}
          />
        )}

        {showEmployeeDialog && (
          <Dialog open={showEmployeeDialog} handler={handleCloseEmployeeDialog}>
            <div className="p-4">
              <HouseDesignDrawingEmployeeList
                onSelectEmployee={handleSelectEmployee}
              />
            </div>
          </Dialog>
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
      {isModalOpen && (
        <Modal
          title="Xác nhận"
          message="Bạn có muốn chấm dứt dự án này không?"
          onConfirm={handleCancelProject}
          onCancel={() => setIsModalOpen(false)}
        />
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

export default ProjectDetail;
