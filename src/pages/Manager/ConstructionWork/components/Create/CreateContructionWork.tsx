import React, { useState } from 'react';
import { searchMaterialSection } from '../../../../../api/Material/Material';
import { searchLabor } from '../../../../../api/Labor/Labor';
import { MaterialItem } from '../../../../../types/Material';
import { LaborItem } from '../../../../../types/Labor';
import {
  CreateConstructionWork as CreateConstructionWorkType,
  SearchConstructionWorkItem,
} from '../../../../../types/ContructionWork';
import {
  createConstructionWork,
  searchConstructionWorkItem,
} from '../../../../../api/Construction/ContructionWork';
import DeleteButton from '../../../../../components/Buttonicons/DeleteButton';

export interface CreateConstructionWorkProps {
  isOpen: boolean;
  onSave: (response: string) => void;
  onCancel: () => void;
  onError: (errorMessage: string) => void;
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
}

const CreateConstructionWork: React.FC<CreateConstructionWorkProps> = ({
  isOpen,
  onSave,
  onCancel,
  onError,
}) => {
  const [workName, setWorkName] = useState('');
  const [construction, setConstruction] = useState('');
  const [inputCodeValue, setInputCodeValue] = useState('');
  const [unit, setUnit] = useState('m');
  const [constructionResponse, setConstructionResponse] = useState<string>('');
  const [constructionSearchResults, setConstructionSearchResults] = useState<
    SearchConstructionWorkItem[]
  >([]);
  const [selectedConstructionId, setSelectedConstructionId] =
    useState<string>('');
  const [materialResources, setMaterialResources] = useState<Resource[]>([
    {
      materialSectionId: '',
      materialSectionNorm: 0,
      laborId: null,
      laborNorm: null,
      materialName: '',
      materialSearchResults: [],
    },
  ]);
  const [laborResources, setLaborResources] = useState<Resource[]>([
    {
      materialSectionId: null,
      materialSectionNorm: null,
      laborId: '',
      laborNorm: 0,
      laborName: '',
      laborSearchResults: [],
    },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!workName) newErrors.workName = 'Tên công tác không được để trống.';
    if (!construction)
      newErrors.construction = 'Tên hạng mục không được để trống.';
    if (!inputCodeValue)
      newErrors.inputCodeValue = 'Mã công tác không được để trống.';
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
    if (!validateFields()) return;

    const combinedResources = [...materialResources, ...laborResources];

    const constructionData: CreateConstructionWorkType = {
      workName: workName,
      constructionId: selectedConstructionId,
      unit: unit,
      code: inputCodeValue,
      resources: combinedResources.map((resource) => ({
        materialSectionId: resource.materialSectionId || null,
        materialSectionNorm: resource.materialSectionNorm || null,
        laborId: resource.laborId || null,
        laborNorm: resource.laborNorm || null,
      })),
    };

    try {
      const response = await createConstructionWork(constructionData);
      console.log('Construction created successfully:', response);
      setConstructionResponse(response);
      onSave(response);
    } catch (error: any) {
      console.error(
        'Error creating construction work:',
        error.response.data.Error,
      );
      onError(error.response.data.Error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSearchConstruction = async (name: string) => {
    try {
      const results = await searchConstructionWorkItem(name);
      console.log(results);
      setConstructionSearchResults(results as SearchConstructionWorkItem[]);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
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

  const handleSelectConstruction = (name: string, id: string) => {
    setConstruction(name);
    setSelectedConstructionId(id);
    setConstructionSearchResults([]);
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
      },
    ]);
  };

  const removeMaterialResource = (index: number) => {
    if (materialResources.length > 1) {
      setMaterialResources((prevResources) =>
        prevResources.filter((_, i) => i !== index),
      );
    }
  };

  const removeLaborResource = (index: number) => {
    if (laborResources.length > 1) {
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
      case 'construction':
        setConstruction(value);
        if (errors.construction) {
          setErrors((prevErrors) => ({ ...prevErrors, construction: '' }));
        }
        handleSearchConstruction(value);
        break;
      case 'inputCodeValue':
        setInputCodeValue(value);
        if (errors.inputCodeValue) {
          setErrors((prevErrors) => ({ ...prevErrors, inputCodeValue: '' }));
        }
        break;
      case 'materialName':
        if (index !== undefined) {
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
        if (index !== undefined) {
          const newResources = [...materialResources];
          newResources[index].materialSectionNorm = Number(value);
          setMaterialResources(newResources);
        }
        break;
      case 'laborName':
        if (index !== undefined) {
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
        if (index !== undefined) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 mt-10 rounded shadow-lg w-1/2 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex text-primaryGreenButton font-bold justify-between items-center mb-4">
          <h1 className="text-2xl">Tạo mới công tác</h1>
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
        <strong className="font-bold">Tên hạng mục:</strong>
        <input
          type="text"
          value={construction}
          onChange={(e) => handleChange('construction', e.target.value)}
          className="relative border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập tên hạng mục"
        />
        {errors.construction && (
          <p className="text-red-500">{errors.construction}</p>
        )}
        {constructionSearchResults.length > 0 && (
          <div className="absolute bg-white border rounded shadow-lg max-h-40 overflow-y-auto w-1/3 z-10 no-scrollbar flex flex-col">
            <table className="w-full">
              <tbody>
                {constructionSearchResults.map((result) => (
                  <tr key={result.ConstructionId}>
                    <td
                      className="border-b border-primaryGreenButton p-2 cursor-pointer text-black"
                      onClick={() =>
                        handleSelectConstruction(
                          result.Name,
                          result.ConstructionId,
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
        <strong className="font-bold">Mã công tác:</strong>
        <input
          type="text"
          value={inputCodeValue}
          onChange={(e) => handleChange('inputCodeValue', e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập mã công tác"
        />
        {errors.inputCodeValue && (
          <p className="text-red-500">{errors.inputCodeValue}</p>
        )}
        <strong className="font-bold">Đơn vị:</strong>
        <select
          name="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
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
            'tấn',
          ].map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>

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
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateConstructionWork;