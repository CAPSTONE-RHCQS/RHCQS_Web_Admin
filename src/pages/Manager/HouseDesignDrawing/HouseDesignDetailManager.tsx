import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHouseDesignById, getHouseDesignDrawingStatus } from '../../../api/HouseDesignDrawing/HouseDesignDrawingApi';
import { approveDesign } from '../../../api/HouseDesignDrawing/HouseDesignVersionApi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiFileText,
  FiPenTool,
  FiLayers,
  FiCalendar,
  FiPhoneCall,
} from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';
import WorkDetailStatusTracker from '../../../components/StatusTracker/WorkDetailStatusTracker';
import ApprovalDialog from '../../../components/Modals/ApprovalDialog';
import { HouseDesignDetailResponse } from '../../../types/HouseDesignTypes';

const HouseDesignDetailManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [designDetail, setDesignDetail] =
    useState<HouseDesignDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [approvalType, setApprovalType] = useState<string>('Approved');
  const [reason, setReason] = useState<string>('');
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );
  const [currentStatus, setCurrentStatus] = useState<string>('');

  const fetchDesignDetail = async () => {
    if (!id) {
      console.error('ID is undefined');
      setLoading(false);
      return;
    }

    try {
      const response = await getHouseDesignById(id);
      const designData = response.data;
      setDesignDetail(designData);

      const defaultVersion = designData.Versions.find(
        (version) => version.Version === designData.VersionPresent,
      );
      if (defaultVersion) {
        setSelectedVersionId(defaultVersion.Id);
      }
    } catch (error) {
      console.error('Error fetching design detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentStatus = async () => {
    if (id) {
      const status = await getHouseDesignDrawingStatus(id);
      setCurrentStatus(status);
    }
  };

  useEffect(() => {
    fetchDesignDetail();
    const interval = setInterval(() => {
      fetchCurrentStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (currentStatus !== designDetail?.Status) {
      fetchDesignDetail();
    }
  }, [currentStatus, designDetail]);

  const handleApproveDesign = async () => {
    if (!selectedVersionId) return;

    try {
      await approveDesign(selectedVersionId, {
        type: approvalType,
        reason,
      });

      if (approvalType === 'Approved') {
        toast.success('Chấp nhận bản vẽ thành công');
      } else if (approvalType === 'Rejected') {
        toast.success('Từ chối bản vẽ thành công');
      } else {
        toast.success('Xét duyệt thành công');
      }

      setIsModalOpen(false);
      fetchDesignDetail();
    } catch (error) {
      console.error('Error approving design:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <ClipLoader size={50} color="#123456" />
      </div>
    );
  }

  if (!designDetail) {
    return <div>Không tìm thấy chi tiết bản vẽ thiết kế.</div>;
  }

  const isSelectable =
    designDetail.Status === 'Reviewing' || designDetail.Status === 'Updated';

  return (
    <>
      <div className="p-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-center">
            Chi tiết bản vẽ thiết kế
          </h2>
          {isSelectable && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (selectedVersionId) {
                    setIsModalOpen(true);
                  } else {
                    toast.error(
                      'Vui lòng chọn một phiên bản trước khi phê duyệt.',
                    );
                  }
                }}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-800 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200"
              >
                <FaCheck className="mr-2" />
                Phê duyệt bản vẽ
              </button>
            </div>
          )}
        </div>
        <WorkDetailStatusTracker currentStatus={designDetail.Status} />
        <div className="flex items-start">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/5 flex-none">
            <div className="flex flex-col gap-4">
              <p className="flex items-center">
                <FiPenTool className="mr-2" />
                {designDetail.Name}
              </p>
              <p className="flex items-center">
                <FiLayers className="mr-2" />
                <strong className="mr-2">Bước:</strong> {designDetail.Step}
              </p>
              <p className="flex items-center">
                <FiPhoneCall className="mr-2" />
                {designDetail.StaffName}
              </p>
              <p className="flex items-center">
                <FiCalendar className="mr-2" />
                <strong className="mr-2">Ngày tạo:</strong>
                {new Date(designDetail.InsDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-lg w-4/5 ml-4 flex-grow">
            <h3 className="text-xl font-bold">Phiên bản</h3>
            <table className="w-full table-auto mt-4">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    STT
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Tên
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Phiên bản
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Ngày tạo
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Ghi chú khách hàng
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Lý do từ chối
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
                </tr>
              </thead>
              <tbody>
                {designDetail.Versions.map((version, index) => (
                  <tr
                    key={version.Id}
                    onClick={() => {
                      if (isSelectable) {
                        setSelectedVersionId(version.Id);
                      }
                    }}
                    className={`cursor-pointer ${
                      selectedVersionId === version.Id
                        ? 'bg-primary text-white'
                        : ''
                    }`}
                  >
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {index + 1}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {version.Name}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {version.Version}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {new Date(version.InsDate).toLocaleDateString()}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {version.Note || ''}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {version.Reason || ''}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <a
                        href={version.FileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" hover:underline"
                      >
                        <FiFileText className="inline-block" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="text-xl font-bold mt-6">Phụ thuộc vào phiên bản</h3>
            <table className="w-full table-auto mt-4">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Tên phiên bản
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Phiên bản
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Tệp
                  </th>
                </tr>
              </thead>
              <tbody>
                {designDetail.DependOnVersion && designDetail.DependOnVersion.length > 0 ? (
                  designDetail.DependOnVersion.map((depend) => (
                    <tr key={depend.HouseDesginVersionId}>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {depend.HouseDesignVersionName}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {depend.HouseDesignVersion}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <a
                          href={depend.FileDesignVersion}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          <FiFileText className="inline-block" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark" colSpan={3}>
                      <span className="text-red-600">Không có phiên bản phụ thuộc</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ApprovalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        approvalType={approvalType}
        setApprovalType={setApprovalType}
        reason={reason}
        setReason={setReason}
        onSubmit={handleApproveDesign}
      />
    </>
  );
};

export default HouseDesignDetailManager;
