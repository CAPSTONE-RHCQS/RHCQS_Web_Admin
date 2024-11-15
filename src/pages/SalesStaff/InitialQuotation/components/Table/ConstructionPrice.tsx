import React, { useState } from 'react';
import { Package } from '../../../../../types/SearchContainNameTypes';
import { getPackageByName } from '../../../../../api/Package/PackageApi';

interface ConstructionPriceProps {
  quotationData: any;
  setQuotationData: React.Dispatch<React.SetStateAction<any>>;
  isEditing: boolean;
}

const ConstructionPrice: React.FC<ConstructionPriceProps> = ({
  quotationData,
  setQuotationData,
  isEditing,
}) => {
  const [searchResultsRough, setSearchResultsRough] = useState<Package[]>([]);
  const [searchResultsFinished, setSearchResultsFinished] = useState<Package[]>(
    [],
  );

  const handleSearchPackage = async (
    name: string,
    type: 'ROUGH' | 'FINISHED',
  ) => {
    try {
      const packages = await getPackageByName(name);
      const filteredPackages = packages.filter((pkg) => pkg.Type === type);
      if (type === 'ROUGH') {
        setSearchResultsRough(filteredPackages);
      } else if (type === 'FINISHED') {
        setSearchResultsFinished(filteredPackages);
      }
    } catch (error) {
      console.error('Error searching package:', error);
    }
  };

  const handleSelectPackage = (
    selectedPackage: Package,
    type: 'ROUGH' | 'FINISHED',
  ) => {
    const newQuotationData = { ...quotationData };
    if (type === 'ROUGH') {
      newQuotationData.PackageQuotationList.PackageRough =
        selectedPackage.PackageName;
      newQuotationData.PackageQuotationList.UnitPackageRough =
        selectedPackage.Price;
      newQuotationData.PackageQuotationList.IdPackageRough =
        selectedPackage.PackageId;
      setSearchResultsRough([]);
    } else if (type === 'FINISHED') {
      newQuotationData.PackageQuotationList.PackageFinished =
        selectedPackage.PackageName;
      newQuotationData.PackageQuotationList.UnitPackageFinished =
        selectedPackage.Price;
      newQuotationData.PackageQuotationList.IdPackageFinished =
        selectedPackage.PackageId;
      setSearchResultsFinished([]);
    }
    setQuotationData(newQuotationData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'ROUGH' | 'FINISHED',
  ) => {
    const newQuotationData = { ...quotationData };
    const value = e.target.value;

    if (type === 'ROUGH') {
      newQuotationData.PackageQuotationList.PackageRough = value;
      if (value === '') {
        newQuotationData.PackageQuotationList.UnitPackageRough = 0;
        newQuotationData.PackageQuotationList.IdPackageRough = null;
      }
    } else if (type === 'FINISHED') {
      newQuotationData.PackageQuotationList.PackageFinished = value;
      if (value === '') {
        newQuotationData.PackageQuotationList.UnitPackageFinished = 0;
        newQuotationData.PackageQuotationList.IdPackageFinished = null;
      }
    }

    setQuotationData(newQuotationData);
    handleSearchPackage(value, type);
  };

  return (
    <>
      {isEditing ? (
        <>
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Gói Thi Công Thô:
            </label>
            <input
              type="text"
              value={quotationData.PackageQuotationList.PackageRough}
              onChange={(e) => handleInputChange(e, 'ROUGH')}
              className="border rounded px-2 py-1 w-full mb-2"
            />
            {searchResultsRough.length > 0 && (
              <ul className="border rounded mt-2">
                {searchResultsRough.map((pkg) => (
                  <li
                    key={pkg.PackageId}
                    onClick={() => handleSelectPackage(pkg, 'ROUGH')}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                  >
                    {pkg.PackageName} - {pkg.Price.toLocaleString()} đồng
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Gói Thi Công Hoàn Thiện:
            </label>
            <input
              type="text"
              value={quotationData.PackageQuotationList.PackageFinished}
              onChange={(e) => handleInputChange(e, 'FINISHED')}
              className="border rounded px-2 py-1 w-full mb-2"
            />
            {searchResultsFinished.length > 0 && (
              <ul className="border rounded mt-2">
                {searchResultsFinished.map((pkg) => (
                  <li
                    key={pkg.PackageId}
                    onClick={() => handleSelectPackage(pkg, 'FINISHED')}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                  >
                    {pkg.PackageName} - {pkg.Price.toLocaleString()} đồng
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <>
          {quotationData.PackageQuotationList.IdPackageRough !== null &&
            quotationData.PackageQuotationList.UnitPackageRough !== 0 && (
              <p className="mb-2">
                {quotationData.PackageQuotationList.PackageRough} -{' '}
                {quotationData.PackageQuotationList.UnitPackageRough.toLocaleString()}{' '}
                đồng/m²
              </p>
            )}
          {quotationData.PackageQuotationList.IdPackageFinished !== null &&
            quotationData.PackageQuotationList.UnitPackageFinished !== 0 && (
              <p className="mb-2">
                {quotationData.PackageQuotationList.PackageFinished} -{' '}
                {quotationData.PackageQuotationList.UnitPackageFinished.toLocaleString()}{' '}
                đồng/m²
              </p>
            )}
        </>
      )}
    </>
  );
};

export default ConstructionPrice;
