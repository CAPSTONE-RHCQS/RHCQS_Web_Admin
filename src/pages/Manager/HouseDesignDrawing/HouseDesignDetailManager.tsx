import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHouseDesignById } from '../../../api/HouseDesignDrawing/HouseDesignDrawingApi';
import { approveDesign } from '../../../api/HouseDesignDrawing/HouseDesignVersionApi';
import { ClipLoader } from 'react-spinners';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiMoreVertical } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';

interface HouseDesignDetailProps {
  Id: string;
  ProjectId: string;
  Name: string;
  Step: number;
  Status: string;
  Type: string;
  IsCompany: boolean;
  InsDate: string;
  Versions: any[];
}

const HouseDesignDetailManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [designDetail, setDesignDetail] =
    useState<HouseDesignDetailProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [approvalType, setApprovalType] = useState<string>('Approved');
  const [reason, setReason] = useState<string>('');

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

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  const handleApproveDesign = async () => {
    if (!designDetail) return;

    try {
      await approveDesign(designDetail.Id, {
        type: approvalType,
        reason,
      });
      toast.success('Design approved successfully!');
      setModalVisible(false);
    } catch (error) {}
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
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-center">Chi tiết công việc</h2>
          <div
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
            className="relative"
          >
            <FiMoreVertical className="text-xl text-black dark:text-white cursor-pointer" />
            {menuVisible && (
              <div
                className="absolute right-2 top-2 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-opacity duration-300 ease-in-out"
                style={{ opacity: menuVisible ? 1 : 0 }}
              >
                <div className="py-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalVisible(true);
                    }}
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200"
                  >
                    <FaCheck className="mr-2" />
                    Phê duyệt bản vẽ
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>ID:</strong> {designDetail.Id}
            </p>
            <p>
              <strong>Tên:</strong> {designDetail.Name}
            </p>
            <p>
              <strong>Bước:</strong> {designDetail.Step}
            </p>
            <p>
              <strong>Trạng thái:</strong> {designDetail.Status}
            </p>
            <p>
              <strong>Loại:</strong> {designDetail.Type}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{' '}
              {new Date(designDetail.InsDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Phê duyệt bản vẽ
            </h2>
            <select
              value={approvalType}
              onChange={(e) => setApprovalType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Approved">Approved</option>
              <option value="Updated">Updated</option>
            </select>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleApproveDesign}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Gửi
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-300 text-black px-5 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HouseDesignDetailManager;
