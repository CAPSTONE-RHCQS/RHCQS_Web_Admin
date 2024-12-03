import React, { useState } from 'react';
import {
  getConstructionByName,
  searchConstructionWork,
} from '../../../../../api/Construction/ConstructionApi';
import { ConstructionSearchResponse } from '../../../../../types/ConstructionTypes';
import {
  searchMaterial,
  searchMaterialSection,
} from '../../../../../api/Material/Material';
import { searchLabor } from '../../../../../api/Labor/Labor';
import { MaterialItem } from '../../../../../types/Material';
import { LaborItem } from '../../../../../types/Labor';
import { CreateConstructionWork as CreateConstructionWorkType, SearchConstructionWorkItem } from '../../../../../types/ContructionWork';
import { createConstructionWork, searchConstructionWorkItem } from '../../../../../api/Construction/ContructionWork';

interface CreateConstructionWorkProps {
  isOpen: boolean;
  onSave: () => void;
  onCancel: () => void;
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
}) => {
  const [workName, setWorkName] = useState('');
  const [construction, setConstruction] = useState('');
  const [inputCodeValue, setInputCodeValue] = useState('');
  const [unit, setUnit] = useState('m');
  const [materialSectionName, setMaterialSectionName] = useState('');
  const [laborName, setLaborName] = useState('');
  const [constructionSearchResults, setConstructionSearchResults] = useState<
    SearchConstructionWorkItem[]
  >([]);
  const [materialSearchResults, setMaterialSearchResults] = useState<
    MaterialItem[]
  >([]);
  const [laborSearchResults, setLaborSearchResults] = useState<LaborItem[]>([]);
  const [selectedConstructionId, setSelectedConstructionId] = useState<
    string
  >('');
  const [materialResources, setMaterialResources] = useState<Resource[]>([]);
  const [laborResources, setLaborResources] = useState<Resource[]>([]);

  const handleSave = async () => {
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
    console.log(constructionData);

    try {
      const response = await createConstructionWork(constructionData);
      console.log('Construction created successfully:', response);
      onSave();
    } catch (error) {
      console.error('Error creating construction work:', error);
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
      newResources[index].materialSearchResults =
        resultsMaterial as MaterialItem[];
      setMaterialResources(newResources);
    } catch (error) {
      console.error('Error fetching material search results:', error);
    }
  };

  const handleSearchLabor = async (name: string, index: number) => {
    try {
      const resultsLabor = await searchLabor(name);
      const newResources = [...laborResources];
      newResources[index].laborSearchResults = resultsLabor as LaborItem[];
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

  const handleSelectMaterial = (name: string, id: string) => {
    setMaterialSectionName(name);
    setMaterialResources((prevResources) => [
      ...prevResources,
      {
        materialSectionId: id,
        materialSectionNorm: 0,
        laborId: null,
        laborNorm: null,
        materialName: '',
        materialSearchResults: [],
      },
    ]);
    setMaterialSearchResults([]);
  };

  const handleSelectLabor = (name: string, id: string) => {
    setLaborName(name);
    setLaborResources((prevResources) => [
      ...prevResources,
      {
        materialSectionId: null,
        materialSectionNorm: null,
        laborId: id,
        laborNorm: 0,
        laborName: '',
        laborSearchResults: [],
      },
    ]);
    setLaborSearchResults([]);
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
    setMaterialResources((prevResources) =>
      prevResources.filter((_, i) => i !== index),
    );
  };

  const removeLaborResource = (index: number) => {
    setLaborResources((prevResources) =>
      prevResources.filter((_, i) => i !== index),
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Tạo mới công trình</h1>
        </div>
        <strong className="font-bold">Tên công trình:</strong>
        <input
          type="text"
          value={workName}
          onChange={(e) => setWorkName(e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập tên công trình"
        />
        <strong className="font-bold">Tên hạng mục:</strong>
        <input
          type="text"
          value={construction}
          onChange={(e) => {
            setConstruction(e.target.value);
            handleSearchConstruction(e.target.value);
          }}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập tên hạng mục"
        />
        {constructionSearchResults.length > 0 && (
          <div className="absolute bg-white border rounded shadow-lg max-h-40 overflow-y-auto w-1/2 z-10">
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
        <strong className="font-bold">Mã công trình:</strong>
        <input
          type="text"
          value={inputCodeValue}
          onChange={(e) => setInputCodeValue(e.target.value)}
          className="border p-2 mb-4 w-full rounded font-regular"
          placeholder="Nhập mã công trình"
        />
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
          <h3 className="font-bold">Phần vật tư:</h3>
          {materialResources.map((resource, index) => (
            <div key={index} className="mb-2 mt-2 flex items-center">
              <span className="font-bold text-black text-lg mr-2 mb-2">
                {index + 1}.
              </span>
              <input
                type="text"
                value={resource.materialName || ''}
                onChange={(e) => {
                  const newResources = [...materialResources];
                  newResources[index].materialName = e.target.value;
                  setMaterialResources(newResources);
                  handleSearchMaterial(e.target.value, index);
                }}
                className="border p-2 mb-2 w-2/3 rounded font-regular mr-2"
                placeholder="Nhập tên vật tư"
              />
              {resource.materialSearchResults &&
                resource.materialSearchResults.length > 0 && (
                  <div className="absolute bg-white border rounded shadow-lg max-h-40 overflow-y-auto w-1/2 z-10">
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
                onChange={(e) => {
                  const newResources = [...materialResources];
                  newResources[index].materialSectionNorm = Number(
                    e.target.value,
                  );
                  setMaterialResources(newResources);
                }}
                className="border p-2 mb-2 w-1/3 rounded font-regular mr-2"
                placeholder="Nhập định mức vật tư"
              />
              <button
                onClick={() => removeMaterialResource(index)}
                className="text-red-500 font-bold mb-2"
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            onClick={addMaterialResource}
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold"
          >
            Thêm Vật Tư
          </button>
        </div>

        <div className="mt-4">
          <h3 className="font-bold">Phần nhân công:</h3>
          {laborResources.map((resource, index) => (
            <div key={index} className="mb-2 mt-2 flex items-center">
              <span className="mr-2 mb-2 text-lg font-bold text-black">
                {index + 1}.
              </span>
              <input
                type="text"
                value={resource.laborName || ''}
                onChange={(e) => {
                  const newResources = [...laborResources];
                  newResources[index].laborName = e.target.value;
                  setLaborResources(newResources);
                  handleSearchLabor(e.target.value, index);
                }}
                className="border p-2 mb-2 w-2/3 rounded font-regular mr-2"
                placeholder="Nhập tên nhân công"
              />
              {resource.laborSearchResults &&
                resource.laborSearchResults.length > 0 && (
                  <div className="absolute bg-white border rounded shadow-lg max-h-40 overflow-y-auto w-1/2 z-10">
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
                onChange={(e) => {
                  const newResources = [...laborResources];
                  newResources[index].laborNorm = Number(e.target.value);
                  setLaborResources(newResources);
                }}
                className="border p-2 mb-2 w-1/3 rounded font-regular mr-2"
                placeholder="Nhập định mức nhân công"
              />
              <button
                onClick={() => removeLaborResource(index)}
                className="text-red-500 font-bold mb-2"
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            onClick={addLaborResource}
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold"
          >
            Thêm Nhân Công
          </button>
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
