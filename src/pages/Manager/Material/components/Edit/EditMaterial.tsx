import React, { useEffect, useState } from 'react';
import { getMaterialById } from '../../../../../api/Material/Material';

interface EditMaterialProps {
  id: string;
  onClose: () => void;
}

const EditMaterial: React.FC<EditMaterialProps> = ({ id, onClose }) => {
  const [materialDetail, setMaterialDetail] = useState<any>(null);

  useEffect(() => {
    const fetchMaterialDetail = async () => {
      try {
        const detail = await getMaterialById(id);
        setMaterialDetail(detail);
        console.log(detail);
      } catch (error) {
        console.error('Failed to fetch material detail:', error);
      }
    };

    if (id) {
      fetchMaterialDetail();
    }
  }, [id]);

  if (!materialDetail) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Chi tiết vật liệu</h1>
          <button
            onClick={onClose}
            className="text-black font-bold text-3xl mb-2"
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <strong className="font-bold">Tên:</strong>
          <input
            type="text"
            value={materialDetail.Name}
            className="border p-2 w-full rounded font-regular"
            readOnly
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Giá:</strong>
          <input
            type="number"
            value={materialDetail.Price}
            className="border p-2 w-full rounded font-regular"
            readOnly
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Đơn vị:</strong>
          <select
            value={materialDetail.Unit}
            className="border p-2 w-full rounded font-regular"
            disabled
          >
            {['cuộn', 'viên', 'm2', 'máy', 'bộ', 'cái', 'thùng', 'ống', 'bao', 'can', 'md', 'kg'].map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <strong className="font-bold">Kích thước:</strong>
          <input
            type="text"
            value={materialDetail.Size}
            className="border p-2 w-full rounded font-regular"
            readOnly
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Hình dạng:</strong>
          <select
            value={materialDetail.Shape}
            className="border p-2 w-full rounded font-regular"
          >
            {['Hình vuông', 'Hình chữ nhật', 'Hình sóng'].map((shape) => (
              <option key={shape} value={shape}>
                {shape}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <strong className="font-bold">URL Hình ảnh:</strong>
          <img
            src={materialDetail.ImgUrl}
            alt="Material"
            className="w-full h-auto rounded"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Mô tả:</strong>
          <input
            type="text"
            value={materialDetail.Description}
            className="border p-2 w-full rounded font-regular"
            readOnly
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Có sẵn:</strong>
          <input
            type="checkbox"
            checked={materialDetail.IsAvailable}
            readOnly
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Giá đơn vị:</strong>
          <input
            type="text"
            value={materialDetail.UnitPrice}
            className="border p-2 w-full rounded font-regular"
            readOnly
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Phần vật liệu:</strong>
          <input
            type="text"
            value={materialDetail.MaterialSectionName}
            className="border p-2 w-full rounded font-regular"
            readOnly
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Nhà cung cấp:</strong>
          <input
            type="text"
            value={materialDetail.SupplierName}
            className="border p-2 w-full rounded font-regular"
            readOnly
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="text-black px-4 py-2 rounded font-bold"
          >
            Hủy
          </button>
          <button className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMaterial;
