import React, { useState, useEffect } from 'react';
import { searchMaterialSection } from '../../../../../api/Material/Material';
import { searchLabor } from '../../../../../api/Labor/Labor';
import { MaterialItem } from '../../../../../types/Material';
import { LaborItem } from '../../../../../types/Labor';
import {
  type UpdateConstructionWork,
} from '../../../../../types/ContructionWork';
import {
  updateConstructionWork,
  getConstructionWorkById,
} from '../../../../../api/Construction/ContructionWork';
import DeleteButton from '../../../../../components/Buttonicons/DeleteButton';

export interface UpdateConstructionWorkProps {
  isOpen: boolean;
  onSave: (response: string) => void;
  onCancel: () => void;
  onError: (errorMessage: string) => void;
  currentEditId: string | null;
}

interface Resource {
  materialSectionId: string | null;
  materialSectionNorm: number | null;
  laborId: string | null;
  laborNorm: number | null;
  materialName?: string;
  laborName?: string;
  materialSearchResults?: MaterialItem[];
  laborSearchResults?: LaborItem[];
  isNew: boolean;
}

const UpdateConstructionWork: React.FC<UpdateConstructionWorkProps> = ({
  isOpen,
  onSave,
  onCancel,
  onError,
  currentEditId,
}) => {
  const [workName, setWorkName] = useState('');
  const [initialWorkName, setInitialWorkName] = useState('');
  const [materialResources, setMaterialResources] = useState<Resource[]>([]);
  const [laborResources, setLaborResources] = useState<Resource[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConstructionWork = async () => {
      if (currentEditId) {
        try {
          const data = await getConstructionWorkById(currentEditId);
          setWorkName(data.WorkName);
          setInitialWorkName(data.WorkName);

          const materials = data.Resources.filter(
            (resource: any) => resource.LaborName === null && resource.LaborNorm === null
          ).map((resource: any) => ({
            materialSectionId: resource.MaterialSectionId,
            materialSectionNorm: resource.MaterialSectionNorm,
            laborId: null,
            laborNorm: null,
            materialName: resource.MaterialSectionName,
            materialSearchResults: [],
            isNew: false,
          }));

          const labors = data.Resources.filter(
            (resource: any) => resource.MaterialSectionName === null && resource.MaterialSectionNorm === null
          ).map((resource: any) => ({
            materialSectionId: null,
            materialSectionNorm: null,
            laborId: resource.LaborId,
            laborNorm: resource.LaborNorm,
            laborName: resource.LaborName,
            laborSearchResults: [],
            isNew: false,
          }));

          setMaterialResources(materials);
          setLaborResources(labors);
        } catch (error) {
          console.error('Error fetching construction work:', error);
          onError('Không thể tải dữ liệu công tác.');
        }
      }
    };

    fetchConstructionWork();
  }, [currentEditId]);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!workName) newErrors.workName = 'Tên công tác không được để trống.';
    if (materialResources.some((resource) => !resource.materialName)) {
      newErrors.materialResources = 'Tên vật tư không được để trống.';
    }
    if (materialResources.some((resource) => !resource.materialSectionNorm)) {
      newErrors.materialResources = 'Định mức vật tư không được để trống.';
    }
    if (laborResources.some((resource) => !resource.laborName)) {
      newErrors.laborResources = 'Tên nhân công không được để trống.';
    }
    if (laborResources.some((resource) => !resource.laborNorm)) {
      newErrors.laborResources = 'Định mức nhân công không được để trống.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    console.log('Saving data for ID:', currentEditId);
    if (!validateFields()) return;

    setIsLoading(true);

    const newMaterialResources = materialResources.filter(resource => resource.isNew);
    const newLaborResources = laborResources.filter(resource => resource.isNew);

    const constructionData: UpdateConstructionWork = {
      nameConstructionWork: workName !== initialWorkName ? workName : undefined,
      resources: [...newMaterialResources, ...newLaborResources],
    };

    try {   
      const response = await updateConstructionWork(
        currentEditId as string,
        constructionData,
      );
      onSave(response);
    } catch (error: any) {
      console.error(
        'Error updating construction work:',
        error.response.data.Error,
      );
      onError(error.response.data.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };
  const handleSearchMaterial = async (name: string, index: number) => {
    try {
      const resultsMaterial = await searchMaterialSection(name);
      const newResources = [...materialResources];
      const filteredResults = resultsMaterial.filter(
        (item: MaterialItem) =>
          !materialResources.some(
            (resource) => resource.materialSectionId === item.Id,
          ),
      );
      newResources[index].materialSearchResults =
        filteredResults as MaterialItem[];
      setMaterialResources(newResources);
    } catch (error) {
      console.error('Error fetching material search results:', error);
    }
  };

  const handleSearchLabor = async (name: string, index: number) => {
    try {
      const resultsLabor = await searchLabor(name);
      const newResources = [...laborResources];
      const filteredResults = resultsLabor.filter(
        (item) =>
          !laborResources.some((resource) => resource.laborId === item.Id),
      );
      newResources[index].laborSearchResults = filteredResults as LaborItem[];
      setLaborResources(newResources);
    } catch (error) {
      console.error('Error fetching labor search results:', error);
    }
  };
  const addMaterialResource = () => {
    setMaterialResources((prevResources) => [
      ...prevResources,
      {
        materialSectionId: '',
        materialSectionNorm: 0,
        laborId: null,
        laborNorm: null,
        materialName: '',
        materialSearchResults: [],
        isNew: true,
      },
    ]);
  };

  const addLaborResource = () => {
    setLaborResources((prevResources) => [
      ...prevResources,
      {
        materialSectionId: null,
        materialSectionNorm: null,
        laborId: '',
        laborNorm: 0,
        laborName: '',
        laborSearchResults: [],
        isNew: true,
      },
    ]);
  };

  const removeMaterialResource = (index: number) => {
    if (materialResources[index].isNew) {
      setMaterialResources((prevResources) =>
        prevResources.filter((_, i) => i !== index),
      );
    }
  };

  const removeLaborResource = (index: number) => {
    if (laborResources[index].isNew) {
      setLaborResources((prevResources) =>
        prevResources.filter((_, i) => i !== index),
      );
    }
  };

  const handleChange = (field: string, value: string, index?: number) => {
    switch (field) {
      case 'workName':
        setWorkName(value);
        if (errors.workName) {
          setErrors((prevErrors) => ({ ...prevErrors, workName: '' }));
        }
        break;
      case 'materialName':
        if (index !== undefined && materialResources[index].isNew) {
          const newResources = [...materialResources];
          newResources[index].materialName = value;
          setMaterialResources(newResources);
          if (errors.materialResources) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              materialResources: '',
            }));
          }
          handleSearchMaterial(value, index);
        }
        break;
      case 'materialSectionNorm':
        if (index !== undefined && materialResources[index].isNew) {
          const newResources = [...materialResources];
          newResources[index].materialSectionNorm = Number(value);
          setMaterialResources(newResources);
        }
        break;
      case 'laborName':
        if (index !== undefined && laborResources[index].isNew) {
          const newResources = [...laborResources];
          newResources[index].laborName = value;
          setLaborResources(newResources);
          if (errors.laborResources) {
            setErrors((prevErrors) => ({ ...prevErrors, laborResources: '' }));
          }
          handleSearchLabor(value, index);
        }
        break;
      case 'laborNorm':
        if (index !== undefined && laborResources[index].isNew) {
          const newResources = [...laborResources];
          newResources[index].laborNorm = Number(value);
          setLaborResources(newResources);
        }
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 mt-10 rounded shadow-lg w-1/2 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex text-primaryGreenButton font-bold justify-between items-center mb-4">
          <h1 className="text-2xl">Cập nhật công tác</h1>
        </div>
        <strong className="font-bold">Tên công tác:</strong>
        <input
          type="text"
          value={workName}
          onChange={(e) => handleChange('workName', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập tên công tác"
        />
        {errors.workName && <p className="text-red-500">{errors.workName}</p>}

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Phần vật tư:</h3>
            <button
              onClick={addMaterialResource}
              className=" text-primaryGreenButton px-4 py-2 rounded font-bold"
            >
              + Thêm Vật Tư
            </button>
          </div>
          {materialResources.map((resource, index) => (
            <div key={index} className="mb-2 mt-2 flex items-center relative">
              <span className="font-bold text-black text-lg mr-2 mb-2">
                {index + 1}.
              </span>
              <input
                type="text"
                value={resource.materialName || ''}
                onChange={(e) =>
                  handleChange('materialName', e.target.value, index)
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
                              onClick={() => {
                                const newResources = [...materialResources];
                                newResources[index].materialName = result.Name;
                                newResources[index].materialSectionId =
                                  result.Id;
                                newResources[index].materialSearchResults = [];
                                setMaterialResources(newResources);
                              }}
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
                value={resource.materialSectionNorm || ''}
                onChange={(e) =>
                  handleChange('materialSectionNorm', e.target.value, index)
                }
                className="border p-2 mb-2 w-1/3 rounded font-regular mr-2"
                placeholder="Nhập định mức vật tư"
              />
              <div className="right-0">
                <DeleteButton onClick={() => removeMaterialResource(index)} />
              </div>
            </div>
          ))}
          {errors.materialResources && (
            <p className="text-red-500">{errors.materialResources}</p>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Phần nhân công:</h3>
            <button
              onClick={addLaborResource}
              className=" text-primaryGreenButton px-4 py-2 rounded font-bold"
            >
              + Thêm Nhân Công
            </button>
          </div>
          {laborResources.map((resource, index) => (
            <div key={index} className="mb-2 mt-2 flex items-center relative">
              <span className="mr-2 mb-2 text-lg font-bold text-black">
                {index + 1}.
              </span>
              <input
                type="text"
                value={resource.laborName || ''}
                onChange={(e) =>
                  handleChange('laborName', e.target.value, index)
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
                              onClick={() => {
                                const newResources = [...laborResources];
                                newResources[index].laborName = result.Name;
                                newResources[index].laborId = result.Id;
                                newResources[index].laborSearchResults = [];
                                setLaborResources(newResources);
                              }}
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
                value={resource.laborNorm || ''}
                onChange={(e) =>
                  handleChange('laborNorm', e.target.value, index)
                }
                className="border p-2 mb-2 w-1/3 rounded font-regular mr-2"
                placeholder="Nhập định mức nhân công"
              />
              <div className="right-0">
                <DeleteButton onClick={() => removeLaborResource(index)} />
              </div>
            </div>
          ))}
          {errors.laborResources && (
            <p className="text-red-500">{errors.laborResources}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleCancel}
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
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateConstructionWork;
