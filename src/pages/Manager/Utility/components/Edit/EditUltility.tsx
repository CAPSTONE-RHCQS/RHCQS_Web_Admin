import React, { useState, useEffect } from 'react';
import { getUtilityById, putUtility } from '../../../../../api/Utility/UtilityApi';

interface EditUtilityProps {
  id: string;
  onSave: () => void;
  onClose: () => void;
  onError: (message: string) => void;
}

const EditUtility: React.FC<EditUtilityProps> = ({ id, onClose, onSave, onError }) => {
  const [utilityDetail, setUtilityDetail] = useState<any>(null);

  useEffect(() => {
    const fetchUtilityDetail = async () => {
      const detail = await getUtilityById(id);
      setUtilityDetail(detail);
    };
    fetchUtilityDetail();
  }, [id]);

  const handleSave = async () => {
    const utilityData = {
      utility: {
        id: utilityDetail?.Id ,
        name: utilityDetail?.Name,
        type: utilityDetail?.Type,
      },
      sections: null,
      items: null,
    };

    try {
      await putUtility(utilityData);
      onSave();
    } catch (error: any) {
      console.error('Error updating utility:', error);
      onError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <div className="flex text-primaryGreenButton font-bold justify-between items-center mb-4">
            <h1 className="text-2xl">Cập nhật tiện ích</h1>
          </div>
          <button
            onClick={onClose}
            className="text-black font-bold text-3xl mb-2"
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <strong className="font-bold">Tên tiện ích:</strong>
          <input
            type="text"
            value={utilityDetail?.Name || ''}
            onChange={(e) =>
              setUtilityDetail({ ...utilityDetail, Name: e.target.value })
            }
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Loại tiện ích:</strong>
          <select
            value={utilityDetail?.Type || ''}
            onChange={(e) =>
              setUtilityDetail({ ...utilityDetail, Type: e.target.value })
            }
            className="border p-2 w-full rounded font-regular"
          >
            <option value="ROUGH">THÔ</option>
            <option value="FINISHED">HOÀN THIỆN</option>
            <option value="TEMPLATE">MẪU NHÀ</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="text-black px-4 py-2 rounded font-bold"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUtility;