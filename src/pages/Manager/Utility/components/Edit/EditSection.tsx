import React, { useState, useEffect } from 'react';
import {
  getSectionById,
  putUtility,
} from '../../../../../api/Utility/UtilityApi';

interface EditSectionProps {
  id: string;
  onClose: () => void;
}

const EditSection: React.FC<EditSectionProps> = ({ id, onClose }) => {
  const [sectionDetail, setSectionDetail] = useState<any>(null);

  useEffect(() => {
    const fetchSectionDetail = async () => {
      const detail = await getSectionById(id);
      setSectionDetail(detail);
    };
    fetchSectionDetail();
  }, [id]);

  const handleSave = async () => {
    const utilityData = {
      utility: null,
      sections: {
        id: sectionDetail?.Id,
        name: sectionDetail?.Name,
        description: sectionDetail?.Description,
        unitPrice: sectionDetail?.UnitPrice,
        unit: sectionDetail?.Unit,
      },

      items: sectionDetail?.Items.map((item: any) => ({
        id: item.Id,
        name: item.Name,
        coefficient: item.Coefficient,
      })),
    };
    console.log(utilityData);

    try {
      await putUtility(utilityData);
      onClose();
    } catch (error) {
      console.error('Error updating utility:', error);
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
            value={sectionDetail?.Name || ''}
            onChange={(e) =>
              setSectionDetail({ ...sectionDetail, Name: e.target.value })
            }
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Mô tả:</strong>
          <input
            type="text"
            value={sectionDetail?.Description || ''}
            onChange={(e) =>
              setSectionDetail({
                ...sectionDetail,
                Description: e.target.value,
              })
            }
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4 flex space-x-2">
          <div className="flex-grow">
            <strong className="font-bold">Đơn giá:</strong>
            <input
              type="number"
              value={sectionDetail?.UnitPrice || 0}
              onChange={(e) =>
                setSectionDetail({
                  ...sectionDetail,
                  UnitPrice: parseFloat(e.target.value),
                })
              }
              className="border p-2 w-full rounded font-regular"
            />
          </div>
          <div className="w-1/4">
            <strong className="font-bold">Đơn vị:</strong>
            <input
              type="text"
              value={sectionDetail?.Unit || ''}
              onChange={(e) =>
                setSectionDetail({
                  ...sectionDetail,
                  Unit: e.target.value,
                })
              }
              className="border p-2 w-full rounded font-regular"
            />
          </div>
        </div>
        {sectionDetail?.Items?.length > 0 && (
          <>
            <div className="mb-4">
              <strong className="font-bold">Tùy chọn tiện ích:</strong>
            </div>
            {sectionDetail?.Items?.map((item: any, index: number) => (
              <>
                <div key={index} className="mb-4 flex space-x-2">
                  <input
                    type="text"
                    value={item.Name}
                    onChange={(e) => {
                      const newItems = [...sectionDetail.Items];
                      newItems[index].Name = e.target.value;
                      setSectionDetail({ ...sectionDetail, Items: newItems });
                    }}
                    className="border p-2 flex-grow rounded font-regular"
                  />
                  <input
                    type="number"
                    value={item.Coefficient}
                    onChange={(e) => {
                      const newItems = [...sectionDetail.Items];
                      newItems[index].Coefficient = parseFloat(e.target.value);
                      setSectionDetail({ ...sectionDetail, Items: newItems });
                    }}
                    className="border p-2 w-1/4 rounded font-regular"
                  />
                </div>
              </>
            ))}
          </>
        )}
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

export default EditSection;
