import React, { useEffect, useState } from 'react';
import { fetchPackages } from '../../../api/Package/PackageApi';
import { Package } from '../../../types/PackagesTypes';
import { FaHammer, FaPaintBrush } from 'react-icons/fa';

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const response = await fetchPackages();
        if (Array.isArray(response.data.Items)) {
          setPackages(response.data.Items);
        } else {
          console.error('API response is not an array:', response.data.Items);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  const getPackageTypeName = (packageTypeId: string): string => {
    switch (packageTypeId.toUpperCase()) {
      case 'E4F968ED-74B2-4164-A8BE-3F83220BE61D':
        return 'Phần thô';
      case '313B205D-8DBD-438C-9935-8B460F3B7237':
        return 'Phần hoàn thiện';
      default:
        return 'Không xác định';
    }
  };

  const getPackageTypeIcon = (packageTypeId: string) => {
    switch (packageTypeId.toUpperCase()) {
      case 'E4F968ED-74B2-4164-A8BE-3F83220BE61D':
        return <FaHammer className="text-blue-500" />;
      case '313B205D-8DBD-438C-9935-8B460F3B7237':
        return <FaPaintBrush className="text-green-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách gói xây dựng</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <li
            key={pkg.Id}
            className="bg-white shadow-md rounded-lg p-4 flex items-center"
          >
            <div className="mr-4">{getPackageTypeIcon(pkg.PackageTypeId)}</div>
            <div>
              <h2 className="text-xl font-semibold">{pkg.PackageName}</h2>
              <p className="text-gray-700">
                Giá: {pkg.Price.toLocaleString()} VND
              </p>
              <p className="text-gray-500">Trạng thái: {pkg.Status}</p>
              <p className="text-gray-500">
                Loại: {getPackageTypeName(pkg.PackageTypeId)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PackageList;
