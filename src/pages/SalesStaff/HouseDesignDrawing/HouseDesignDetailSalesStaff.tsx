import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getHouseDesignById,
  getHouseDesignDrawingStatus,
} from '../../../api/HouseDesignDrawing/HouseDesignDrawingApi';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiFileText,
  FiPenTool,
  FiLayers,
  FiCalendar,
  FiPhoneCall,
  FiInfo,
} from 'react-icons/fi';
import WorkDetailStatusTracker from '../../../components/StatusTracker/WorkDetailStatusTracker';
import { HouseDesignDetailResponse } from '../../../types/HouseDesignTypes';

const HouseDesignDetailSalesStaff: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [designDetail, setDesignDetail] =
    useState<HouseDesignDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const navigate = useNavigate();

  const fetchDesignDetail = async () => {
    if (!id) {
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

  const handleViewInitialQuotation = () => {
    if (designDetail?.InitialQuotationId) {
      navigate(
        `/initial-quotation-detail-staff/${designDetail.InitialQuotationId}`,
      );
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
              <p
                className="flex items-center cursor-pointer hover:text-blue-600"
                onClick={handleViewInitialQuotation}
              >
                <FiInfo className="mr-2" />
                <strong className="mr-2">Xem báo giá sơ bộ</strong>
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

            {designDetail.DependOnVersion &&
              designDetail.DependOnVersion?.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mt-6">
                    Phụ thuộc vào phiên bản
                  </h3>
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
                      {designDetail.DependOnVersion &&
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
                                className=" hover:underline"
                              >
                                <FiFileText className="inline-block" />
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HouseDesignDetailSalesStaff;
