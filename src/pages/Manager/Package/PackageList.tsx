import React, { useEffect, useState } from 'react';
import { fetchPackages } from '../../../api/Package/PackageApi';
import { Package } from '../../../types/PackagesTypes';
import { FaHammer, FaPaintBrush, FaCheckCircle } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const getPackageTypeName = (packageType: string | undefined): string => {
    if (!packageType) return 'Không xác định';
    switch (packageType.toUpperCase()) {
      case 'ROUGH':
        return 'Gói thô';
      case 'FINISHED':
        return 'Gói hoàn thiện';
      default:
        return 'Không xác định';
    }
  };

  const getPackageTypeIcon = (packageType: string | undefined) => {
    if (!packageType) return null;
    switch (packageType.toUpperCase()) {
      case 'ROUGH':
        return <FaHammer className="text-blue-500" />;
      case 'FINISHED':
        return <FaPaintBrush className="text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (status && status.toUpperCase() === 'ACTIVE') {
      return <div className="absolute top-0 right-0 m-2 text-green-500"><FaCheckCircle /></div>;
    }
    return null;
  };

  const handleViewDetails = (id: string) => {
    navigate(`/package-detail-manager/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={'#5BABAC'} loading={true} />
      </div>
    );
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
            className="bg-white shadow-md rounded-lg p-4 flex items-center relative"
          >
            {getStatusIcon(pkg.Status)}
            <div className="mr-4">{getPackageTypeIcon(pkg.PackageType)}</div>
            <div>
              <h2 className="text-xl font-semibold">{pkg.PackageName}</h2>
              <p className="text-gray-700">
                Giá: {pkg.Price.toLocaleString()} VND
              </p>
              <p className="text-gray-500">
                Loại: {getPackageTypeName(pkg.PackageType)}
              </p>
              <button
                onClick={() => handleViewDetails(pkg.Id)}
                className="mt-2 text-blue-500 hover:underline"
              >
                Xem chi tiết
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PackageList;
