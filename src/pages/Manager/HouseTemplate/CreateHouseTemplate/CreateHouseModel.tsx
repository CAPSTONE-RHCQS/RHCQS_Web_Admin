import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PackageTypeSearchResponse,
  searchPackagesByName,
} from '../../../../api/Package/PackageApi';
import CreateAreaHouse, { AreaData } from './components/CreateAreaHouse';
import { createHouseTemplate } from '../../../../api/HouseTemplate/HouseTemplateApi';
import { CreateHouseTemplateRequest } from '../../../../types/HouseTemplateTypes';
import Alert from '../../../../components/Alert';

const CreateHouseModel: React.FC = () => {
  const [name, setName] = useState('');
  const [floors, setFloors] = useState('');
  const [rooms, setRooms] = useState('');
  const [packageType, setPackageType] = useState('');
  const [description, setDescription] = useState('');
  const [searchPackageResults, setSearchPackageResults] = useState<
    PackageTypeSearchResponse[]
  >([]);
  const [completedPackage, setCompletedPackage] = useState<
    PackageTypeSearchResponse[]
  >([]);
  const [selectedPackagePrice, setSelectedPackagePrice] = useState<number>(0);
  const [selectedPackageName, setSelectedPackageName] = useState('');
  const [areas, setAreas] = useState<AreaData[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageTypes = async () => {
      try {
        const response = await searchPackagesByName('thô');
        setSearchPackageResults(response.data);
        const responseCompletedPackage = await searchPackagesByName(
          'hoàn thiện',
        );
        setCompletedPackage(responseCompletedPackage.data);
        console.log(responseCompletedPackage.data);
      } catch (error) {
        console.error('Error fetching package types:', error);
      }
    };

    fetchPackageTypes();
  }, []);

  const handlePackageTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedPackageId = e.target.value;
      setPackageType(selectedPackageId);

      const selectedPackage = searchPackageResults.find(
        (pkg) => pkg.PackageId === selectedPackageId,
      );
      setSelectedPackagePrice(selectedPackage ? selectedPackage.Price : 0);
      setSelectedPackageName(
        selectedPackage ? selectedPackage.PackageName : '',
      );
    },
    [searchPackageResults],
  );

  const formatCurrency = useCallback((value: number) => {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const data: CreateHouseTemplateRequest = {
      name,
      description,
      numberOfFloor: parseInt(floors, 10),
      numberOfBed: parseInt(rooms, 10),
      packageRoughId: packageType,
      descriptionPackage: selectedPackageName,
      subTemplates: areas.map((area) => ({
        buildingArea: parseFloat(area.buildingArea) || 0,
        floorArea: parseFloat(area.floorArea) || 0,
        size: area.size,
        totalRough: area.totalRough,
        templateItems: area.selectedItems.map((item) => ({
          constructionItemId: item.Id,
          subConstructionItemId: item.SubConstructionId,
          name: item.Name,
          area: item.area,
          unit: 'm²',
        })),
      })),
      packageFinished: completedPackage.map((pkg) => ({
        packageId: pkg.PackageId,
        description: pkg.PackageName,
      })),
    };

    try {
      const response = await createHouseTemplate(data);
      setAlert({ message: 'Tạo mẫu nhà thành công!', type: 'success' });
      setTimeout(() => {
        navigate('/add-image-house', {
          state: { responseData: response, packageFinished: data.packageFinished },
        });
      }, 5000);
    } catch (error) {
      console.error('Error submitting data:', error);
      setAlert({ message: 'Tạo mẫu nhà thất bại!', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAreaDataChange = useCallback((updatedAreas: AreaData[]) => {
    setAreas(updatedAreas);
  }, []);

  return (
    <>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Tạo mẫu nhà */}
      <div>
        <h1 className="text-2xl font-bold mb-4 text-black">
          Bước 1 - Tạo mẫu nhà
        </h1>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          <h3 className="text-2xl font-bold mb-4">Thông tin nhà mẫu</h3>
          <div className="flex">
            <div className="w-1/3 pr-2">
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1 mt-1">
                  Tên nhà mẫu:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1">
                  Số tầng:
                </label>
                <input
                  type="text"
                  value={floors}
                  onChange={(e) => setFloors(e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1">
                  Số phòng:
                </label>
                <input
                  type="text"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1">
                  Gói thi công:
                </label>
                <select
                  value={packageType}
                  onChange={handlePackageTypeChange}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                >
                  {searchPackageResults.map((pkg) => (
                    <option key={pkg.PackageId} value={pkg.PackageId}>
                      {pkg.PackageName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-2/3 pl-2">
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Mô tả:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-40 rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diện tích nhà mẫu */}
      <div>
        <CreateAreaHouse
          searchPackageResults={searchPackageResults}
          selectedPackagePrice={selectedPackagePrice}
          formatCurrency={formatCurrency}
          onAreaDataChange={handleAreaDataChange}
        />
      </div>

      {/* Gói hoàn thiện */}
      <div>
        <h1 className="text-2xl font-bold mb-4 mt-8 text-black">
          Bước 3 - Tạo gói hoàn thiện
        </h1>
        <div className="flex space-x-4">
          {completedPackage.map((pkg) => (
            <div
              key={pkg.PackageId}
              className="border border-primary rounded-lg p-4 text-center"
            >
              {pkg.PackageName}
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="mt-4 bg-primary text-white py-2 px-4 rounded flex items-center justify-center"
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
            'Gửi dữ liệu'
          )}
        </button>
      </div>
    </>
  );
};

export default CreateHouseModel;
