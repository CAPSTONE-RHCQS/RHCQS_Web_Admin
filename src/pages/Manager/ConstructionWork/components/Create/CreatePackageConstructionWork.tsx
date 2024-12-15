import React, { useState, useEffect } from 'react';
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
import { getConstructionWorkById } from '../../../../../api/Construction/ContructionWork';

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
  roughMaterialResources: Resource[];
  finishedMaterialResources: Resource[];
  laborResources: Resource[];
}

const calculateTotal = (resources: Resource[], type: 'material' | 'labor') => {
  return resources.reduce((total, resource) => {
    const price = type === 'material' ? resource.price : resource.laborPrice;
    return total + (price || 0);
  }, 0);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

const CreatePackageConstructionWork: React.FC<
  CreatePackageConstructionWorkProps
> = ({ isOpen, onSave, onCancel, constructionData }) => {
  const [packages, setPackages] = useState<Package[]>([
    {
      packageName: '',
      packageId: '',
      roughMaterialResources: [
        {
          materialSectionId: '',
          price: 0,
          laborId: null,
          laborPrice: null,
          materialName: '',
          materialSearchResults: [],
        },
      ],
      finishedMaterialResources: [
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
  const [workName, setWorkName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [constructionWorkData, setConstructionWorkData] = useState<any>(null);

  useEffect(() => {
    const fetchWorkName = async () => {
      if (constructionData) {
        try {
          const data = await getConstructionWorkById(constructionData);
          setWorkName(data.WorkName);
          setConstructionWorkData(data);
        } catch (error) {
          console.error('Error fetching construction work:', error);
        }
      }
    };

    if (isOpen) {
      fetchWorkName();
    }
  }, [isOpen, constructionData]);

  const handleSearchPackage = async (name: string, packageIndex: number) => {
    try {
      const response = await searchPackagesByName(name);

      let filteredResults = response.data.filter(
        (pkg) => !selectedPackageIds.has(pkg.PackageId),
      );

      if (constructionWorkData && constructionWorkData.WorkTemplates) {
        const existingPackageIds = new Set(
          constructionWorkData.WorkTemplates.map(
            (template: any) => template.PackageId,
          ),
        );

        filteredResults = filteredResults.filter(
          (pkg) => !existingPackageIds.has(pkg.PackageId),
        );
      }

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
    type: 'ROUGH' | 'FINISHED',
  ) => {
    try {
      const results = await searchMaterialByPackageId(
        name,
        packages[packageIndex].packageId,
      );
      const newPackages = [...packages];
      const resources =
        type === 'ROUGH'
          ? newPackages[packageIndex].roughMaterialResources
          : newPackages[packageIndex].finishedMaterialResources;

      const selectedMaterials = new Set(
        resources.map((res) => res.materialName),
      );
      const filteredResults = results.filter(
        (material) =>
          !selectedMaterials.has(material.Name) && material.Type === type,
      );
      resources[resourceIndex].materialSearchResults = filteredResults;
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
    resourceType: 'roughMaterial' | 'finishedMaterial',
  ) => {
    const newPackages = [...packages];
    const resources =
      resourceType === 'roughMaterial'
        ? newPackages[packageIndex].roughMaterialResources
        : newPackages[packageIndex].finishedMaterialResources;

    let finalPrice = material.Price || 0;
    if (constructionWorkData && constructionWorkData.Resources) {
      const matchingResource = constructionWorkData.Resources.find(
        (resource: any) =>
          resource.MaterialSectionId === material.MaterialSectionId,
      );
      if (matchingResource) {
        finalPrice =
          (material.Price || 0) * matchingResource.MaterialSectionNorm;
      }
    }

    resources[resourceIndex].materialName = material.Name;
    resources[resourceIndex].price = finalPrice;
    resources[resourceIndex].materialSearchResults = [];
    setPackages(newPackages);
  };

  const handleSelectLabor = (
    labor: LaborItem,
    packageIndex: number,
    resourceIndex: number,
  ) => {
    const newPackages = [...packages];

    let finalPrice = labor.Price;
    if (constructionWorkData && constructionWorkData.Resources) {
      const matchingResource = constructionWorkData.Resources.find(
        (resource: any) => resource.LaborId === labor.Id,
      );
      if (matchingResource) {
        finalPrice = labor.Price * matchingResource.LaborNorm;
      }
    }

    newPackages[packageIndex].laborResources[resourceIndex].laborName =
      labor.Name;
    newPackages[packageIndex].laborResources[resourceIndex].laborPrice =
      finalPrice;
    newPackages[packageIndex].laborResources[resourceIndex].laborSearchResults =
      [];
    setPackages(newPackages);
  };

  const handleChange = (
    field: string,
    value: string,
    packageIndex: number,
    resourceIndex?: number,
    resourceType?: 'roughMaterial' | 'finishedMaterial' | 'labor',
  ) => {
    const newPackages = [...packages];
    if (resourceType && resourceIndex !== undefined) {
      const resources =
        resourceType === 'roughMaterial'
          ? newPackages[packageIndex].roughMaterialResources
          : resourceType === 'finishedMaterial'
          ? newPackages[packageIndex].finishedMaterialResources
          : newPackages[packageIndex].laborResources;
      switch (field) {
        case 'materialName':
          resources[resourceIndex].materialName = value;
          handleSearchMaterial(
            value,
            packageIndex,
            resourceIndex,
            resourceType === 'roughMaterial' ? 'ROUGH' : 'FINISHED',
          );
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
        roughMaterialResources: [
          {
            materialSectionId: '',
            price: 0,
            laborId: null,
            laborPrice: null,
            materialName: '',
            materialSearchResults: [],
          },
        ],
        finishedMaterialResources: [
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

  const addMaterialResource = (
    packageIndex: number,
    resourceType: 'roughMaterial' | 'finishedMaterial',
  ) => {
    const newPackages = [...packages];
    const resources =
      resourceType === 'roughMaterial'
        ? newPackages[packageIndex].roughMaterialResources
        : newPackages[packageIndex].finishedMaterialResources;
    resources.push({
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
    resourceType: 'roughMaterial' | 'finishedMaterial',
  ) => {
    const newPackages = [...packages];
    const resources =
      resourceType === 'roughMaterial'
        ? newPackages[packageIndex].roughMaterialResources
        : newPackages[packageIndex].finishedMaterialResources;
    if (resources.length > 1) {
      resources.splice(resourceIndex, 1);
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
    setIsLoading(true);

    const packageData = packages.map((pkg) => {
      const laborCost = calculateTotal(pkg.laborResources, 'labor');
      const materialCost = calculateTotal(
        pkg.roughMaterialResources,
        'material',
      );
      const materialFinishedCost = calculateTotal(
        pkg.finishedMaterialResources,
        'material',
      );
      const totalCost = laborCost + materialCost;

      return {
        constructionWorkId: constructionData,
        packageId: pkg.packageId,
        laborCost: laborCost,
        materialCost: materialCost,
        materialFinishedCost: materialFinishedCost,
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
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 mt-10 rounded shadow-lg w-1/2 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex text-primaryGreenButton font-bold justify-between items-center mb-4">
          <h1 className="text-2xl">Tạo gói công tác "{workName}"</h1>
        </div>
        {packages.map((pkg, packageIndex) => (
          <div
            key={packageIndex}
            className="mb-4 border-2 border rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <strong className="font-bold text-black text-lg">
                Gói thi công {packageIndex + 1}:
              </strong>
              <div className="flex justify-end">
                <button
                  onClick={() => removePackage(packageIndex)}
                  className="text-red-500 px-4 py-2 rounded font-bold"
                >
                  Hủy gói
                </button>
              </div>
            </div>
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
              <div className="flex justify-between items-center text-black">
                <h3 className="font-bold">Phần vật tư thô:</h3>
                <button
                  onClick={() =>
                    addMaterialResource(packageIndex, 'roughMaterial')
                  }
                  className="bg-primaryGreenButton text-white w-8 h-5 rounded-full flex items-center justify-center text-lg mr-2 mb-2"
                >
                  +
                </button>
              </div>
              {pkg.roughMaterialResources.map((resource, resourceIndex) => (
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
                        'roughMaterial',
                      )
                    }
                    className="border p-2 mb-2 w-2/3 rounded font-regular mr-2"
                    placeholder="Nhập tên vật tư thô"
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
                                      'roughMaterial',
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
                        'roughMaterial',
                      )
                    }
                    className="border p-2 mb-2 w-1/3 rounded font-regular mr-2"
                    placeholder="Nhập giá tiền"
                    readOnly
                  />
                  <div className="right-0">
                    <DeleteButton
                      onClick={() =>
                        removeMaterialResource(
                          packageIndex,
                          resourceIndex,
                          'roughMaterial',
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="text-left">
                <span className="font-regular text-sm">
                  Tổng tiền vật tư thô:
                </span>{' '}
                <span className="text-primary font-bold">
                  {formatCurrency(
                    calculateTotal(pkg.roughMaterialResources, 'material'),
                  )}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center text-black">
                <h3 className="font-bold">Vật tư hoàn thiện:</h3>
                <button
                  onClick={() =>
                    addMaterialResource(packageIndex, 'finishedMaterial')
                  }
                  className="bg-primaryGreenButton text-white w-8 h-5 rounded-full flex items-center justify-center text-lg mr-2 mb-2"
                >
                  +
                </button>
              </div>
              {pkg.finishedMaterialResources.map((resource, resourceIndex) => (
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
                        'finishedMaterial',
                      )
                    }
                    className="border p-2 mb-2 w-2/3 rounded font-regular mr-2"
                    placeholder="Nhập tên vật tư hoàn thiện"
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
                                      'finishedMaterial',
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
                        'finishedMaterial',
                      )
                    }
                    className="border p-2 mb-2 w-1/3 rounded font-regular mr-2"
                    placeholder="Nhập giá tiền"
                    readOnly
                  />
                  <div className="right-0">
                    <DeleteButton
                      onClick={() =>
                        removeMaterialResource(
                          packageIndex,
                          resourceIndex,
                          'finishedMaterial',
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="text-left">
                <span className="font-regular text-sm">
                  Tổng tiền vật tư hoàn thiện:
                </span>{' '}
                <span className="text-primary font-bold">
                  {formatCurrency(
                    calculateTotal(pkg.finishedMaterialResources, 'material'),
                  )}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center text-black">
                <h3 className="font-bold">Nhân công:</h3>
                <button
                  onClick={() => addLaborResource(packageIndex)}
                  className="bg-primaryGreenButton text-white w-8 h-5 rounded-full flex items-center justify-center text-lg mr-2 mb-2"
                >
                  +
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
                    readOnly
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
              <div className="text-left">
                <span className="font-regular text-sm">
                  Tổng tiền nhân công:
                </span>{' '}
                <span className="text-primary font-bold">
                  {formatCurrency(calculateTotal(pkg.laborResources, 'labor'))}
                </span>
              </div>
            </div>

            <div className="font-bold text-right mt-4">
              <span className="text-black">Tổng tiền gói:</span>{' '}
              <span className="text-primary">
                {formatCurrency(
                  calculateTotal(pkg.roughMaterialResources, 'material') +
                    calculateTotal(pkg.laborResources, 'labor'),
                )}
              </span>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={addPackage}
            className="text-primaryGreenButton px-4 py-2 rounded font-bold"
          >
            + Thêm Gói
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onCancel}
              className="text-black px-4 py-2 rounded font-bold"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold flex items-center"
              disabled={isLoading}
            >
              {isLoading && (
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
              )}
              Tạo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePackageConstructionWork;
