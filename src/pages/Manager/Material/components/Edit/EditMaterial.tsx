import React, { useEffect, useState } from 'react';
import { getMaterialById } from '../../../../../api/Material/Material';
import { MaterialRequest } from '../../../../../types/Material';

interface EditMaterialProps {
  id: string;
  onSuccess: (id: string, materialDetail: MaterialRequest) => void;
  onClose: () => void;
}

const EditMaterial: React.FC<EditMaterialProps> = ({
  id,
  onClose,
  onSuccess,
}) => {
  const [materialDetail, setMaterialDetail] = useState<any>(null);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMaterialDetail = async () => {
      try {
        const detail = await getMaterialById(id);
        setMaterialDetail(detail);
        console.log('detail', detail);
      } catch (error) {
        console.error('Failed to fetch material detail:', error);
      }
    };

    if (id) {
      fetchMaterialDetail();
    }
  }, [id]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const updatedMaterialDetail: MaterialRequest = {
      SupplierId: materialDetail.SupplierId,
      MaterialSectionId: materialDetail.MaterialSectionId,
      Name: materialDetail.Name,
      Price: materialDetail.Price,
      Unit: materialDetail.Unit,
      Size: materialDetail.Size,
      Shape: materialDetail.Shape,
      Description: materialDetail.Description,
      IsAvailable: materialDetail.IsAvailable,
      UnitPrice: materialDetail.UnitPrice,
      Code: materialDetail.Code,
      Image: newImageFile || materialDetail.Image,
    };

    try {
      await onSuccess(id, updatedMaterialDetail);
    } catch (error) {
      console.error('Failed to save material:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            onChange={(e) =>
              setMaterialDetail({ ...materialDetail, Name: e.target.value })
            }
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Giá:</strong>
          <input
            type="number"
            value={materialDetail.Price}
            onChange={(e) =>
              setMaterialDetail({ ...materialDetail, Price: e.target.value })
            }
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Đơn vị:</strong>
          <select
            value={materialDetail.Unit}
            className="border p-2 w-full rounded font-regular"
            disabled
          >
            {[
              'Cuộn',
              'Viên',
              'm2',
              'Máy',
              'Bộ',
              'Cái',
              'Thùng',
              'Ống',
              'Bao',
              'Can',
              'Md',
              'Kg',
            ].map((unit) => (
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
            onChange={(e) =>
              setMaterialDetail({ ...materialDetail, Size: e.target.value })
            }
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Hình dạng:</strong>
          <select
            value={materialDetail.Shape}
            onChange={(e) =>
              setMaterialDetail({ ...materialDetail, Shape: e.target.value })
            }
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
          <strong className="font-bold">Hình ảnh:</strong>
          <div className="flex space-x-4">
            <div className="relative">
              <img
                src={materialDetail.ImgUrl}
                alt="Material"
                className="border-dashed border-2 border-gray-400 p-4 mb-4 w-40 h-40 rounded flex justify-center items-center cursor-pointer relative"
              />
              <span className="absolute inset-0 flex justify-center items-center text-white text-2xl font-bold bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                +
              </span>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
              <div className="text-center mt-2">Ảnh hiện tại</div>
            </div>
            {newImage && (
              <div className="relative">
                <img
                  src={newImage}
                  alt="New Material"
                  className="border-dashed border-2 border-gray-400 p-4 mb-4 w-40 h-40 rounded flex justify-center items-center"
                />
                <div className="text-center mt-2">Ảnh mới</div>
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <strong className="font-bold">Mô tả:</strong>
          <input
            type="text"
            value={materialDetail.Description}
            onChange={(e) =>
              setMaterialDetail({
                ...materialDetail,
                Description: e.target.value,
              })
            }
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Trạng thái:</strong>
          <select
            value={materialDetail.IsAvailable ? 'true' : 'false'}
            onChange={(e) =>
              setMaterialDetail({
                ...materialDetail,
                IsAvailable: e.target.value === 'true',
              })
            }
            className="border p-2 w-full rounded font-regular"
          >
            <option value="true">Đang cung cấp</option>
            <option value="false">Ngừng cung cấp</option>
          </select>
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
          <strong className="font-bold">Mã code:</strong>
          <input
            type="text"
            value={materialDetail.Code}
            onChange={(e) =>
              setMaterialDetail({ ...materialDetail, Code: e.target.value })
            }
            className="border p-2 w-full rounded font-regular"
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
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              'Lưu'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMaterial;
