import React, { useState, useEffect } from 'react';
import { Package } from '../../../../../types/SearchContainNameTypes';
import { getPackageByName } from '../../../../../api/Package/PackageApi';
import { PromotionInfo } from '../../../../../types/InitialQuotationTypes';

interface ConstructionPriceProps {
  quotationData: any;
  setQuotationData: React.Dispatch<React.SetStateAction<any>>;
  isEditing: boolean;
  setPromotionInfo: React.Dispatch<React.SetStateAction<PromotionInfo | null>>;
}

const ConstructionPrice: React.FC<ConstructionPriceProps> = ({
  quotationData,
  setQuotationData,
  isEditing,
  setPromotionInfo,
}) => {
  const [searchResultsRough, setSearchResultsRough] = useState<Package[]>([]);
  const [searchResultsFinished, setSearchResultsFinished] = useState<Package[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packages = await getPackageByName("Gói");
        const filteredPackagesRough = packages.filter((pkg) => pkg.Type === 'ROUGH');
        const filteredPackagesFinished = packages.filter((pkg) => pkg.Type === 'FINISHED');
        setSearchResultsRough(filteredPackagesRough);
        setSearchResultsFinished(filteredPackagesFinished);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const handleSelectPackage = (
    selectedPackage: Package,
    type: 'ROUGH' | 'FINISHED',
  ) => {
    const newQuotationData = { ...quotationData };
    if (type === 'ROUGH') {
      newQuotationData.PackageQuotationList.PackageRough = selectedPackage.PackageName;
      newQuotationData.PackageQuotationList.UnitPackageRough = selectedPackage.Price;
      newQuotationData.PackageQuotationList.IdPackageRough = selectedPackage.PackageId;
    } else if (type === 'FINISHED') {
      newQuotationData.PackageQuotationList.PackageFinished = selectedPackage.PackageName;
      newQuotationData.PackageQuotationList.UnitPackageFinished = selectedPackage.Price;
      newQuotationData.PackageQuotationList.IdPackageFinished = selectedPackage.PackageId;
    }
    setQuotationData(newQuotationData);
    setPromotionInfo(null);
  };

  return (
    <>
      {isEditing && searchResultsRough.length > 0 && quotationData.PackageQuotationList.IdPackageRough !== null && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Gói Thi Công Thô:</label>
          <select
            value={quotationData.PackageQuotationList.PackageRough || ''}
            onChange={(e) => {
              const selectedPackage = searchResultsRough.find(pkg => pkg.PackageName === e.target.value);
              if (selectedPackage) handleSelectPackage(selectedPackage, 'ROUGH');
            }}
            className="border rounded px-2 py-1 w-full mb-2"
            disabled={quotationData.ProjectType === 'TEMPLATE'}
          >
            <option value="">Chọn gói</option>
            {searchResultsRough.map((pkg) => (
              <option key={pkg.PackageId} value={pkg.PackageName}>
                {pkg.PackageName} - {pkg.Price.toLocaleString()} đồng/m²
              </option>
            ))}
          </select>
        </div>
      )}
      {isEditing && searchResultsFinished.length > 0 && quotationData.PackageQuotationList.IdPackageFinished !== null && (
        <div>
          <label className="block font-semibold mb-1">Gói Thi Công Hoàn Thiện:</label>
          <select
            value={quotationData.PackageQuotationList.PackageFinished || ''}
            onChange={(e) => {
              const selectedPackage = searchResultsFinished.find(pkg => pkg.PackageName === e.target.value);
              if (selectedPackage) handleSelectPackage(selectedPackage, 'FINISHED');
            }}
            className="border rounded px-2 py-1 w-full mb-2"
          >
            <option value="">Chọn gói</option>
            {searchResultsFinished.map((pkg) => (
              <option key={pkg.PackageId} value={pkg.PackageName}>
                {pkg.PackageName} - {pkg.Price.toLocaleString()} đồng/m²
              </option>
            ))}
          </select>
        </div>
      )}
      {!isEditing &&
        quotationData.PackageQuotationList.IdPackageRough !== null &&
        quotationData.PackageQuotationList.UnitPackageRough !== 0 && (
          <p className="mb-2">
            {quotationData.PackageQuotationList.PackageRough} -{' '}
            {quotationData.PackageQuotationList.UnitPackageRough.toLocaleString()}{' '}
            đồng/m²
          </p>
        )}
      {!isEditing &&
        quotationData.PackageQuotationList.IdPackageFinished !== null &&
        quotationData.PackageQuotationList.UnitPackageFinished !== 0 && (
          <p>
            {quotationData.PackageQuotationList.PackageFinished} -{' '}
            {quotationData.PackageQuotationList.UnitPackageFinished.toLocaleString()}{' '}
            đồng/m²
          </p>
        )}
    </>
  );
};

export default ConstructionPrice;
