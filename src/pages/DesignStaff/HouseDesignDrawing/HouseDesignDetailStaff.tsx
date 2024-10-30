import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHouseDesignById } from '../../../api/HouseDesignDrawing/HouseDesignDrawingApi';
import { uploadFile } from '../../../api/Upload/UploadApi';
import { createDesign } from '../../../api/HouseDesignDrawing/HouseDesignVersionApi';
import { ClipLoader } from 'react-spinners';
import { CreateDesignRequest } from '../../../types/HouseDesignVersionTypes';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WorkDetailStatusTracker from '../../../components/StatusTracker/WorkDetailStatusTracker';
import {
  FiCalendar,
  FiFileText,
  FiLayers,
  FiPenTool,
  FiType,
} from 'react-icons/fi';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface VersionProps {
  Id: string;
  Name: string;
  Version: number;
  FileUrl: string;
  InsDate: string;
  PreviousDrawingId: string | null;
  NamePrevious: string | null;
  Note: string;
}

interface HouseDesignDetailProps {
  Id: string;
  ProjectId: string;
  Name: string;
  Step: number;
  Status: string;
  Type: string;
  IsCompany: boolean;
  InsDate: string;
  Versions: VersionProps[];
}

const HouseDesignDetailStaff: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [designDetail, setDesignDetail] =
    useState<HouseDesignDetailProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchDesignDetail = async () => {
      if (!id) {
        console.error('ID is undefined');
        setLoading(false);
        return;
      }

      try {
        const response = await getHouseDesignById(id);
        setDesignDetail(response.data);
      } catch (error) {
        console.error('Error fetching design detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignDetail();
  }, [id]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadFile(file, file.name);
      console.log('File uploaded successfully:', response.data.url);
      setFileUrl(response.data.url);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitDesign = async () => {
    if (!designDetail || !fileUrl) return;

    const designData: CreateDesignRequest = {
      name: designDetail.Name,
      houseDesignDrawingId: designDetail.Id,
      fileUrl: fileUrl,
    };

    try {
      const response = await createDesign(designData);
      console.log('Design submitted successfully:', response.data);
      toast.success('Design submitted successfully!');
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 flex-none">
            <div className="grid grid-cols-2 gap-4">
              <p className="flex items-center">
                <FiPenTool className="mr-2" />
                {designDetail.Name}
              </p>
              <p className="flex items-center">
                <FiLayers className="mr-2" />
                <strong className="mr-2">Bước:</strong> {designDetail.Step}
              </p>
              <p className="flex items-center">
                <FiType className="mr-2" />
                <strong className="mr-2">Loại:</strong> {designDetail.Type}
              </p>
              {/* <p className="flex items-center">
                <FiBriefcase className="mr-2" />
                <strong className="mr-2">Is Company:</strong>{' '}
                {designDetail.IsCompany ? 'Yes' : 'No'}
              </p> */}
              <p className="flex items-center">
                <FiCalendar className="mr-2" />
                <strong className="mr-2">Ngày tạo:</strong>{' '}
                {new Date(designDetail.InsDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-lg w-1/2 ml-4 flex-grow">
            <h3 className="text-xl font-bold">Versions</h3>
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
                    Ghi chú
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
                </tr>
              </thead>
              <tbody>
                {designDetail.Versions.map((version, index) => (
                  <tr key={version.Id}>
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
                      {version.Note || 'N/A'}
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
          </div>
        </div>

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
                    <span className="font-semibold">Nhấn để tải lên</span> hoặc
                    kéo thả
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
            {uploading && <p className="mt-2 text-blue-500">Đang tải lên...</p>}
          </div>
          <button
            onClick={handleSubmitDesign}
            disabled={!fileUrl}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Nộp bản vẽ
          </button>
        </div>
      </div>
      {fileUrl && (
        <div className="mt-6">
          <div className="border rounded-lg w-full max-w-4xl mx-auto">
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
          </div>
        </div>
      )}
    </>
  );
};

export default HouseDesignDetailStaff;
