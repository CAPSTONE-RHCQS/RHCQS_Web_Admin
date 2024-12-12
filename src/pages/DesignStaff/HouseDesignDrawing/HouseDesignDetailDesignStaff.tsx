import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getHouseDesignById,
  getHouseDesignDrawingStatus,
} from '../../../api/HouseDesignDrawing/HouseDesignDrawingApi';
import { uploadFile } from '../../../api/Upload/UploadApi';
import { createDesign } from '../../../api/HouseDesignDrawing/HouseDesignVersionApi';
import { ClipLoader } from 'react-spinners';
import { CreateDesignRequest } from '../../../types/HouseDesignVersionTypes';
import { HouseDesignDetailResponse } from '../../../types/HouseDesignTypes';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WorkDetailStatusTracker from '../../../components/StatusTracker/WorkDetailStatusTracker';
import {
  FiCalendar,
  FiFileText,
  FiLayers,
  FiPenTool,
  FiPhoneCall,
} from 'react-icons/fi';

const HouseDesignDetailDesignStaff: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [designDetail, setDesignDetail] =
    useState<HouseDesignDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);

  const fetchDesignDetail = useCallback(async () => {
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
  }, [id]);

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
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchDesignDetail, id]);

  useEffect(() => {
    if (currentStatus !== designDetail?.Status) {
      fetchDesignDetail();
    }
  }, [currentStatus, designDetail]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    try {
      const response = await uploadFile(file, file.name);
      setFileUrl(response.data.url);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitDesign = async () => {
    if (!designDetail || !fileUrl) return;

    const currentVersionIndex = designDetail.Versions.findIndex(
      (version) => version.Id === selectedVersionId,
    );

    const currentVersionId =
      currentVersionIndex >= 0
        ? designDetail.Versions[currentVersionIndex].Id
        : null;

    const currentDependOnVersionId = 
      designDetail.DependOnVersion && designDetail.DependOnVersion.length > 0
        ? designDetail.DependOnVersion.find(depend => depend.HouseDesignVersion === designDetail.VersionPresent)?.HouseDesginVersionId || null
        : null;

    const designData: CreateDesignRequest = {
      name: designDetail.Name,
      houseDesignDrawingId: designDetail.Id,
      fileUrl: fileUrl,
      relatedDrawingId: currentVersionId,
      previousDrawingId: currentDependOnVersionId,
    };

    try {
      const response = await createDesign(designData);
      toast.success('Tải lên bản vẽ thành công!');
      fetchDesignDetail();
    } catch (error: any) {
      console.error('Error submitting design:', error);
      const errorMessage =
        error.response?.data?.Error || 'Error submitting design';
      toast.error(errorMessage);
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
    return <div>Không tìm thấy chi tiết công việc.</div>;
  }

  return (
    <>
      <div className="p-4 mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Chi tiết công việc
        </h2>
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
                {designDetail.DependOnVersion &&
                designDetail.DependOnVersion.length > 0 ? (
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
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {['Processing', 'Updating'].includes(designDetail.Status) && (
          <div className="mt-6 flex flex-col items-center">
            <div className="w-full max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tải lên bản vẽ
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      aria-hidden="true"
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16V8m0 0l-3 3m3-3l3 3m6 8V8m0 0l-3 3m3-3l3 3"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Nhấn để tải lên</span>{' '}
                      hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              </div>
              {uploading && (
                <p className="mt-2 text-blue-500">Đang tải lên...</p>
              )}
              {fileUrl && fileName && (
                <p className="mt-2 text-gray-700">Tên file: {fileName}</p>
              )}
            </div>
            <button
              onClick={handleSubmitDesign}
              disabled={!fileUrl}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Nộp bản vẽ
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default HouseDesignDetailDesignStaff;
