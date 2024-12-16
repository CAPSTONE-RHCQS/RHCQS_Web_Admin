import React, { useEffect, useState } from 'react';
import {
  createMaterial,
  getMaterialSectionById,
} from '../../../../../api/Material/Material';
import { searchSupplier } from '../../../../../api/Supplier/Supplier';

interface CreateMaterialProps {
  id: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const CreateMaterial: React.FC<CreateMaterialProps> = ({
  id,
  onClose,
  onSuccess,
}) => {
  const [materialSectionDetail, setMaterialSectionDetail] = useState<any>(null);
  const [materialDetail, setMaterialDetail] = useState<{
    Name: string;
    Price: number;
    Unit: string;
    Size: string;
    Shape: string;
    Image: string | File;
    Description: string;
    UnitPrice: string;
    MaterialSectionType: string;
    SupplierName: string;
    Code: string;
    Type: string;
  }>({
    Name: '',
    Price: 0,
    Unit: 'cuộn',
    Size: '',
    Shape: 'Hình vuông',
    Image: '',
    Description: '',
    UnitPrice: '',
    MaterialSectionType: '',
    SupplierName: '',
    Code: '',
    Type: 'ROUGH',
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [supplierResults, setSupplierResults] = useState<any[]>([]);
  const [showSupplierDropdown, setShowSupplierDropdown] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMaterialSectionDetail = async () => {
      try {
        const detail = await getMaterialSectionById(id);
        setMaterialSectionDetail(detail as any);
      } catch (error) {
        console.error('Failed to fetch material detail:', error);
      }
    };

    if (id) {
      fetchMaterialSectionDetail();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setMaterialDetail((prevDetail) => ({
      ...prevDetail,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'SupplierName') {
      handleSupplierSearch(value);
    }
  };

  const handleSupplierSearch = async (name: string) => {
    if (name.length > 2) {
      try {
        const results = await searchSupplier(name);
        setSupplierResults(results);
        setShowSupplierDropdown(true);
      } catch (error) {
        console.error('Error searching supplier:', error);
      }
    } else {
      setShowSupplierDropdown(false);
    }
  };

  const handleSupplierSelect = (supplier: any) => {
    setMaterialDetail((prevDetail) => ({
      ...prevDetail,
      SupplierName: supplier.Name,
    }));
    setSupplierId(supplier.Id);
    setShowSupplierDropdown(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const materialData = {
      SupplierId: supplierId,
      MaterialSectionId: id,
      Name: materialDetail.Name,
      Price: materialDetail.Price,
      Unit: materialDetail.Unit,
      Size: materialDetail.Size,
      Shape: materialDetail.Shape,
      Description: materialDetail.Description,
      IsAvailable: true,
      UnitPrice: materialDetail.UnitPrice,
      Code: materialDetail.Code,
      Type: materialDetail.Type,
      Image: materialDetail.Image,
    };

    console.log(materialData);

    try {
      await createMaterial(materialData);
      onSuccess('Tạo vật liệu thành công');
      onClose();
    } catch (error) {
      console.error('Failed to create material:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setMaterialDetail((prevDetail) => ({
          ...prevDetail,
          Image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Tạo mới vật liệu</h1>
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
            name="Name"
            value={materialDetail.Name}
            onChange={handleChange}
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Giá:</strong>
          <input
            type="number"
            name="Price"
            value={materialDetail.Price}
            onChange={handleChange}
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Đơn vị:</strong>
          <select
            name="Unit"
            value={materialDetail.Unit}
            onChange={handleChange}
            className="border p-2 w-full rounded font-regular"
          >
            {[
              'm',
              'cuộn',
              'viên',
              'm2',
              'm3',
              'máy',
              'bộ',
              'cái',
              'thùng',
              'ống',
              'bao',
              'can',
              'md',
              'kg',
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
            name="Size"
            value={materialDetail.Size}
            onChange={handleChange}
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Hình dạng:</strong>
          <select
            name="Shape"
            value={materialDetail.Shape}
            onChange={handleChange}
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
          <div className="border-dashed border-2 border-gray-400 p-4 mb-4 w-40 h-40 rounded flex justify-center items-center cursor-pointer relative">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <span className="text-gray-500">+</span>
            )}
            <label className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white text-xl">+</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className="mb-4">
          <strong className="font-bold">Mô tả:</strong>
          <input
            type="text"
            name="Description"
            value={materialDetail.Description}
            onChange={handleChange}
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Giá đơn vị:</strong>
          <input
            type="text"
            name="UnitPrice"
            value={materialDetail.UnitPrice}
            onChange={handleChange}
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Mã vật liệu:</strong>
          <input
            type="text"
            name="Code"
            value={materialDetail.Code}
            onChange={handleChange}
            className="border p-2 w-full rounded font-regular"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Phần vật liệu:</strong>
          <input
            type="text"
            name="MaterialSectionName"
            value={materialSectionDetail?.Name}
            readOnly
            className="border p-2 w-full rounded font-regular bg-gray-100"
          />
        </div>
        <div className="mb-4 relative">
          <strong className="font-bold">Nhà cung cấp:</strong>
          <input
            type="text"
            name="SupplierName"
            value={materialDetail.SupplierName}
            onChange={handleChange}
            className="border p-2 w-full rounded font-regular"
          />
          {showSupplierDropdown && (
            <ul className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto z-10">
              {supplierResults.map((supplier) => (
                <li
                  key={supplier.Id}
                  onClick={() => handleSupplierSelect(supplier)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {supplier.Name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <strong className="font-bold">Loại:</strong>
          <select
            name="Type"
            value={materialDetail.Type}
            onChange={handleChange}
            className="border p-2 w-full rounded font-regular"
          >
            <option value="ROUGH">Thô</option>
            <option value="FINISHED">Hoàn thiện</option>
          </select>
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

export default CreateMaterial;
