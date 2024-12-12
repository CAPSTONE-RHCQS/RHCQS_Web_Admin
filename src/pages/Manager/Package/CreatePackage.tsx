import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPackage } from '../../../api/Package/PackageApi';
import { PackagePutRequest } from '../../../types/PackageRequestTypes';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const CreatePackage: React.FC = () => {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<PackagePutRequest>({
    packageType: 'ROUGH',
    packageName: '',
    unit: 'm²',
    price: 0,
    status: 'ACTIVE',
    packageLabors: [],
    packageMaterials: [],
    packageHouses: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setPackageData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!packageData.packageName.trim()) {
      toast.error('Vui lòng nhập tên gói');
      return;
    }

    if (packageData.price <= 0) {
      toast.error('Giá phải lớn hơn 0');
      return;
    }

    try {
      const response = await createPackage(packageData);
      toast.success('Tạo gói thành công!');
      navigate(`/package-list-manager`);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const apiError = error.response.data;
        toast.error(apiError.Error || 'Tạo gói thất bại!');
      } else {
        toast.error('Tạo gói thất bại!');
      }
      console.error('Error creating package:', error);
    }
  };

  const handleCancel = () => {
    navigate('/package-list-manager');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-600">
          Tạo Gói Mới
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Tên Gói
            </label>
            <input
              type="text"
              name="packageName"
              value={packageData.packageName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập tên gói"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Giá (VND)
            </label>
            <input
              type="number"
              name="price"
              value={packageData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập giá"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Đơn Vị</label>
            <input
              type="text"
              name="unit"
              value={packageData.unit}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập đơn vị (mặc định m²)"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Loại Gói
            </label>
            <select
              name="packageType"
              value={packageData.packageType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="ROUGH">Gói Thô</option>
              <option value="FINISHED">Gói Hoàn Thiện</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Trạng Thái
            </label>
            <select
              name="status"
              value={packageData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="ACTIVE">Hoạt Động</option>
              <option value="INACTIVE">Không Hoạt Động</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-teal-500 text-white px-4 py-2 rounded mr-2 shadow-lg hover:bg-teal-600 transition duration-300"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" /> Lưu
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-200 text-white px-4 py-2 rounded shadow-lg hover:bg-gray-600 transition duration-300"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" /> Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePackage;
