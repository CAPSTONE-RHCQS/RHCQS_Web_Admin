import React, { useState } from 'react';
import DeleteButton from '../../../../../components/Buttonicons/DeleteButton';
import {
  searchPackagesByName,
  PackageTypeSearchResponse,
} from '../../../../../api/Package/PackageApi';
import { searchMaterialByPackageId } from '../../../../../api/Material/Material';
import { searchLaborByPackageId } from '../../../../../api/Labor/Labor';
import { MaterialItem } from '../../../../../types/Material';
import { LaborItem } from '../../../../../types/Labor';
import { createPackageConstructionWork } from '../../../../../api/Construction/ContructionWork';

interface CreatePackageConstructionWorkProps {
  isOpen: boolean;
  onSave: () => void;
  onCancel: () => void;
  onError: (errorMessage: string) => void;
  constructionData?: string;
}

interface Resource {
  materialSectionId: string | null;
  price: number | null;
  laborId: string | null;
  laborPrice: number | null;
  materialName?: string;
  laborName?: string;
  materialSearchResults?: MaterialItem[];
  laborSearchResults?: LaborItem[];
}

interface Package {
  packageName: string;
  packageId: string;
  materialResources: Resource[];
  laborResources: Resource[];
}

const calculateTotal = (resources: Resource[], type: 'material' | 'labor') => {
  return resources.reduce((total, resource) => {
    const price = type === 'material' ? resource.price : resource.laborPrice;
    return total + (price || 0);
  }, 0);
};

const CreatePackageConstructionWork: React.FC<
  CreatePackageConstructionWorkProps
> = ({ isOpen, onSave, onCancel, constructionData }) => {
  const [packages, setPackages] = useState<Package[]>([
    {
      packageName: '',
      packageId: '',
      materialResources: [
        {
          materialSectionId: '',
          price: 0,
          laborId: null,
          laborPrice: null,
          materialName: '',
          materialSearchResults: [],
        },
      ],
      laborResources: [
        {
          materialSectionId: null,
          price: null,
          laborId: '',
          laborPrice: 0,
          laborName: '',
          laborSearchResults: [],
        },
      ],
    },
  ]);

  const [searchResults, setSearchResults] = useState<
    PackageTypeSearchResponse[][]
  >([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<Set<string>>(
    new Set(),
  );

  const handleSearchPackage = async (name: string, packageIndex: number) => {
    try {
      const response = await searchPackagesByName(name);
      const filteredResults = response.data.filter(
        (pkg) => !selectedPackageIds.has(pkg.PackageId),
      );
      const newSearchResults = [...searchResults];
      newSearchResults[packageIndex] = filteredResults;
      setSearchResults(newSearchResults);
    } catch (error) {
      console.error('Error searching packages:', error);
    }
  };

  const handleSearchMaterial = async (
    name: string,
    packageIndex: number,
    resourceIndex: number,
  ) => {
    try {
      const results = await searchMaterialByPackageId(
        name,
        packages[packageIndex].packageId,
      );
      const newPackages = [...packages];
      const selectedMaterials = new Set(
        newPackages[packageIndex].materialResources.map(
          (res) => res.materialName,
        ),
      );
      const filteredResults = results.filter(
        (material) => !selectedMaterials.has(material.Name),
      );
      newPackages[packageIndex].materialResources[
        resourceIndex
      ].materialSearchResults = filteredResults;
      setPackages(newPackages);
    } catch (error) {
      console.error('Error searching materials:', error);
    }
  };

  const handleSearchLabor = async (
    name: string,
    packageIndex: number,
    resourceIndex: number,
  ) => {
    try {
      const results = await searchLaborByPackageId(
        name,
        packages[packageIndex].packageId,
      );
      const newPackages = [...packages];
      const selectedLabors = new Set(
        newPackages[packageIndex].laborResources.map((res) => res.laborName),
      );
      const filteredResults = results.filter(
        (labor) => !selectedLabors.has(labor.Name),
      );
      newPackages[packageIndex].laborResources[
        resourceIndex
      ].laborSearchResults = filteredResults;
      setPackages(newPackages);
    } catch (error) {
      console.error('Error searching labor:', error);
    }
  };
  const handleSelectPackage = (
    packageName: string,
    packageId: string,
    packageIndex: number,
  ) => {
    const newPackages = [...packages];
    newPackages[packageIndex].packageName = packageName;
    newPackages[packageIndex].packageId = packageId;
    setPackages(newPackages);

    const newSelectedPackageIds = new Set(selectedPackageIds);
    newSelectedPackageIds.add(packageId);
    setSelectedPackageIds(newSelectedPackageIds);

    const newSearchResults = [...searchResults];
    newSearchResults[packageIndex] = [];
    setSearchResults(newSearchResults);
  };

  const handleSelectMaterial = (
    material: MaterialItem,
    packageIndex: number,
    resourceIndex: number,
  ) => {
    const newPackages = [...packages];
    newPackages[packageIndex].materialResources[resourceIndex].materialName =
      material.Name;
    newPackages[packageIndex].materialResources[resourceIndex].price =
      material.Price || 0;
    newPackages[packageIndex].materialResources[
      resourceIndex
    ].materialSearchResults = [];
    setPackages(newPackages);
  };

  const handleSelectLabor = (
    labor: LaborItem,
    packageIndex: number,
    resourceIndex: number,
  ) => {
    const newPackages = [...packages];
    newPackages[packageIndex].laborResources[resourceIndex].laborName =
      labor.Name;
    newPackages[packageIndex].laborResources[resourceIndex].laborPrice =
      labor.Price;
    newPackages[packageIndex].laborResources[resourceIndex].laborSearchResults =
      [];
    setPackages(newPackages);
  };

  const handleChange = (
    field: string,
    value: string,
    packageIndex: number,
    resourceIndex?: number,
    resourceType?: 'material' | 'labor',
  ) => {
    const newPackages = [...packages];
    if (resourceType && resourceIndex !== undefined) {
      const resources =
        resourceType === 'material'
          ? newPackages[packageIndex].materialResources
          : newPackages[packageIndex].laborResources;
      switch (field) {
        case 'materialName':
          resources[resourceIndex].materialName = value;
          handleSearchMaterial(value, packageIndex, resourceIndex);
          break;
        case 'laborName':
          resources[resourceIndex].laborName = value;
          handleSearchLabor(value, packageIndex, resourceIndex);
          break;
        case 'price':
        case 'laborPrice':
          resources[resourceIndex].price = Number(value);
          break;
        default:
          break;
      }
    } else {
      newPackages[packageIndex].packageName = value;
      handleSearchPackage(value, packageIndex);
    }
    setPackages(newPackages);
  };

  const addPackage = () => {
    setPackages((prevPackages) => [
      ...prevPackages,
      {
        packageName: '',
        packageId: '',
        materialResources: [
          {
            materialSectionId: '',
            price: 0,
            laborId: null,
            laborPrice: null,
            materialName: '',
            materialSearchResults: [],
          },
        ],
        laborResources: [
          {
            materialSectionId: null,
            price: null,
            laborId: '',
            laborPrice: 0,
            laborName: '',
            laborSearchResults: [],
          },
        ],
      },
    ]);
  };

  const removePackage = (index: number) => {
    if (packages.length > 1) {
      setPackages((prevPackages) => prevPackages.filter((_, i) => i !== index));
    }
  };

  const addMaterialResource = (packageIndex: number) => {
    const newPackages = [...packages];
    newPackages[packageIndex].materialResources.push({
      materialSectionId: '',
      price: 0,
      laborId: null,
      laborPrice: null,
      materialName: '',
      materialSearchResults: [],
    });
    setPackages(newPackages);
  };

  const addLaborResource = (packageIndex: number) => {
    const newPackages = [...packages];
    newPackages[packageIndex].laborResources.push({
      materialSectionId: null,
      price: null,
      laborId: '',
      laborPrice: 0,
      laborName: '',
      laborSearchResults: [],
    });
    setPackages(newPackages);
  };

  const removeMaterialResource = (
    packageIndex: number,
    resourceIndex: number,
  ) => {
    const newPackages = [...packages];
    if (newPackages[packageIndex].materialResources.length > 1) {
      newPackages[packageIndex].materialResources = newPackages[
        packageIndex
      ].materialResources.filter((_, i) => i !== resourceIndex);
      setPackages(newPackages);
    }
  };

  const removeLaborResource = (packageIndex: number, resourceIndex: number) => {
    const newPackages = [...packages];
    if (newPackages[packageIndex].laborResources.length > 1) {
      newPackages[packageIndex].laborResources = newPackages[
        packageIndex
      ].laborResources.filter((_, i) => i !== resourceIndex);
      setPackages(newPackages);
    }
  };

  const handleSave = async () => {
    const packageData = packages.map((pkg) => {
      const laborCost = calculateTotal(pkg.laborResources, 'labor');
      const materialCost = calculateTotal(pkg.materialResources, 'material');
      const totalCost = laborCost + materialCost;

      return {
        constructionWorkId: constructionData,
        packageId: pkg.packageId,
        laborCost: laborCost,
        materialCost: materialCost,
        materialFinishedCost: 0,
        totalCost: totalCost,
      };
    });

    try {
      await createPackageConstructionWork(packageData);
      onSave();
    } catch (error: any) {
      console.error(
        'Error creating package construction work:',
        error.response.data.Error,
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 mt-10 rounded shadow-lg w-1/2 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex text-primaryGreenButton font-bold justify-between items-center mb-4">
          <h1 className="text-2xl">Tạo mới gói công tác</h1>
          <h1 className="text-2xl">{constructionData}</h1>
          <button
            onClick={addPackage}
            className="text-primaryGreenButton px-4 py-2 rounded font-bold"
          >
            + Thêm Gói
          </button>
        </div>
        {packages.map((pkg, packageIndex) => (
          <div key={packageIndex} className="mb-4 border-b pb-4">
            <strong className="font-bold">Gói {packageIndex + 1}:</strong>
            <input
              type="text"
              value={pkg.packageName}
              onChange={(e) =>
                handleChange('packageName', e.target.value, packageIndex)
              }
              className="relative border p-2 mb-4 w-full rounded font-regular"
              placeholder="Nhập tên gói"
            />
            {searchResults[packageIndex] &&
              searchResults[packageIndex].length > 0 && (
                <div className=" bg-white border rounded shadow-lg max-h-40 overflow-y-auto w-1/2 z-10 no-scrollbar flex flex-col">
                  <table className="w-full">
                    <tbody>
                      {searchResults[packageIndex].map((result) => (
                        <tr key={result.PackageId}>
                          <td
                            className="border-b border-primaryGreenButton p-2 cursor-pointer text-black"
                            onClick={() =>
                              handleSelectPackage(
                                result.PackageName,
                                result.PackageId,
                                packageIndex,
                              )
                            }
                          >
                            {result.PackageName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            <div className="mt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Phần vật tư:</h3>
                <button
                  onClick={() => addMaterialResource(packageIndex)}
                  className=" text-primaryGreenButton px-4 py-2 rounded font-bold"
                >
                  + Thêm Vật Tư
                </button>
              </div>
              {pkg.materialResources.map((resource, resourceIndex) => (
                <div
                  key={resourceIndex}
                  className="mb-2 mt-2 flex items-center relative"
                >
                  <span className="font-bold text-black text-lg mr-2 mb-2">
                    {resourceIndex + 1}.
                  </span>
                  <input
                    type="text"
                    value={resource.materialName || ''}
                    onChange={(e) =>
                      handleChange(
                        'materialName',
                        e.target.value,
                        packageIndex,
                        resourceIndex,
                        'material',
                      )
                    }
                    className="border p-2 mb-2 w-2/3 rounded font-regular mr-2"
                    placeholder="Nhập tên vật tư"
                  />
                  {resource.materialSearchResults &&
                    resource.materialSearchResults.length > 0 && (
                      <div className="absolute top-full left-0 bg-white border rounded shadow-lg max-h-40 overflow-y-auto w-full z-10 no-scrollbar">
                        <table className="w-full">
                          <tbody>
                            {resource.materialSearchResults.map((result) => (
                              <tr key={result.Id}>
                                <td
                                  className="border-b border-primaryGreenButton p-2 cursor-pointer text-black"
                                  onClick={() =>
                                    handleSelectMaterial(
                                      result,
                                      packageIndex,
                                      resourceIndex,
                                    )
                                  }
                                >
                                  {result.Name}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  <input
                    type="number"
                    value={resource.price || ''}
                    onChange={(e) =>
                      handleChange(
                        'price',
                        e.target.value,
                        packageIndex,
                        resourceIndex,
                        'material',
                      )
                    }
                    className="border p-2 mb-2 w-1/3 rounded font-regular mr-2"
                    placeholder="Nhập giá tiền"
                  />
                  <div className="right-0">
                    <DeleteButton
                      onClick={() =>
                        removeMaterialResource(packageIndex, resourceIndex)
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="font-bold text-right">
                Tổng tiền vật tư:{' '}
                {calculateTotal(pkg.materialResources, 'material')}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Phần nhân công:</h3>
                <button
                  onClick={() => addLaborResource(packageIndex)}
                  className=" text-primaryGreenButton px-4 py-2 rounded font-bold"
                >
                  + Thêm Nhân Công
                </button>
              </div>
              {pkg.laborResources.map((resource, resourceIndex) => (
                <div
                  key={resourceIndex}
                  className="mb-2 mt-2 flex items-center relative"
                >
                  <span className="mr-2 mb-2 text-lg font-bold text-black">
                    {resourceIndex + 1}.
                  </span>
                  <input
                    type="text"
                    value={resource.laborName || ''}
                    onChange={(e) =>
                      handleChange(
                        'laborName',
                        e.target.value,
                        packageIndex,
                        resourceIndex,
                        'labor',
                      )
                    }
                    className="border p-2 mb-2 w-2/3 rounded font-regular mr-2"
                    placeholder="Nhập tên nhân công"
                  />
                  {resource.laborSearchResults &&
                    resource.laborSearchResults.length > 0 && (
                      <div className="absolute top-full left-0 bg-white border rounded shadow-lg max-h-40 overflow-y-auto w-full z-10">
                        <table className="w-full">
                          <tbody>
                            {resource.laborSearchResults.map((result) => (
                              <tr key={result.Id}>
                                <td
                                  className="border-b border-primaryGreenButton p-2 cursor-pointer text-black"
                                  onClick={() =>
                                    handleSelectLabor(
                                      result,
                                      packageIndex,
                                      resourceIndex,
                                    )
                                  }
                                >
                                  {result.Name}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  <input
                    type="number"
                    value={resource.laborPrice || ''}
                    onChange={(e) =>
                      handleChange(
                        'laborPrice',
                        e.target.value,
                        packageIndex,
                        resourceIndex,
                        'labor',
                      )
                    }
                    className="border p-2 mb-2 w-1/3 rounded font-regular mr-2"
                    placeholder="Nhập giá tiền"
                  />
                  <div className="right-0">
                    <DeleteButton
                      onClick={() =>
                        removeLaborResource(packageIndex, resourceIndex)
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="font-bold text-right">
                Tổng tiền nhân công:{' '}
                {calculateTotal(pkg.laborResources, 'labor')}
              </div>
            </div>

            <div className="font-bold text-right mt-4">
              Tổng tiền gói:{' '}
              {calculateTotal(pkg.materialResources, 'material') +
                calculateTotal(pkg.laborResources, 'labor')}
            </div>

            <div className="flex justify-end">
              <DeleteButton onClick={() => removePackage(packageIndex)} />
            </div>
          </div>
        ))}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onCancel}
            className="text-black px-4 py-2 rounded font-bold"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePackageConstructionWork;
