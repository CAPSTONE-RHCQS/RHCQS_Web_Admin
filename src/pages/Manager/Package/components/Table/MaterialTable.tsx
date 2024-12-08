import React, { useEffect, useState } from 'react';
import { PackageMaterial } from '../../../../../types/PackagesTypes';
import { Material } from '../../../../../types/SearchContainNameTypes';
import { getAllMaterialByName } from '../../../../../api/Material/Material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
interface MaterialTableProps {
  materials: PackageMaterial[];
  editMode: boolean;
  onMaterialUpdate: (updatedMaterials: PackageMaterial[]) => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({
  materials,
  editMode,
  onMaterialUpdate,
}) => {
  const [editMaterials, setEditMaterials] =
    useState<PackageMaterial[]>(materials);
  const [searchResults, setSearchResults] = useState<Material[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setEditMaterials(materials);
  }, [materials]);

  useEffect(() => {
    if (JSON.stringify(editMaterials) !== JSON.stringify(materials)) {
      onMaterialUpdate(editMaterials);
    }
  }, [editMaterials, onMaterialUpdate, materials]);

  const handleMaterialChange = async (
    index: number,
    field: string,
    value: any,
  ) => {
    const updatedMaterials = [...editMaterials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    setEditMaterials(updatedMaterials);

    if (field === 'MaterialName') {
      setActiveIndex(index);
      if (value.trim() === '') {
        setSearchResults([]);
        setActiveIndex(null);
      } else {
        try {
          const results = await getAllMaterialByName(value);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching material by name:', error);
        }
      }
    }
  };

  const handleSelectMaterial = (index: number, selectedMaterial: Material) => {
    const updatedMaterials = [...editMaterials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      Id: selectedMaterial.Id,
      MaterialName: selectedMaterial.Name,
      Type: selectedMaterial.Type,
      Price: selectedMaterial.Price,
      InsDate: '',
    };
    setEditMaterials(updatedMaterials);
    setSearchResults([]);
    setActiveIndex(null);
  };

  const handleAddMaterial = () => {
    const newMaterial: PackageMaterial = {
      Id: '',
      Description: '',
      MaterialName: '',
      MaterialSectionId: '',
      ImgUrl: '',
      MaterialSectionName: '',
      Shape: '',
      Size: '',
      Unit: '',
      Type: '',
      Price: 0,
      InsDate: new Date().toISOString(),
    };
    setEditMaterials([...editMaterials, newMaterial]);
  };

  const handleDeleteMaterial = (index: number) => {
    const updatedMaterials = editMaterials.filter((_, i) => i !== index);
    setEditMaterials(updatedMaterials);
  };

  return (
    <>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-teal-100">
          <tr>
            <th className="py-3 px-4 text-left">Tên vật liệu</th>
            <th className="py-3 px-4 text-left">Phân Loại</th>
            <th className="py-3 px-4 text-left">Đơn vị</th>
            <th className="py-3 px-4 text-left">Giá</th>
            {editMode && <th className="py-3 px-4 text-left"></th>}
          </tr>
        </thead>
        <tbody>
          {editMaterials.map((material, index) => (
            <tr
              key={material.Id}
              className="border-b hover:bg-gray-100 transition duration-300"
            >
              <td className="py-3 px-4">
                {editMode ? (
                  <input
                    type="text"
                    value={material.MaterialName}
                    onChange={(e) =>
                      handleMaterialChange(
                        index,
                        'MaterialName',
                        e.target.value,
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  material.MaterialName
                )}
                {editMode &&
                  activeIndex === index &&
                  searchResults.length > 0 && (
                    <ul className="bg-white border rounded shadow-md mt-2">
                      {searchResults
                        .filter(
                          (result) =>
                            !editMaterials.some((l) => l.Id === result.Id),
                        )
                        .map((result) => (
                          <li
                            key={result.Id}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelectMaterial(index, result)}
                          >
                            {result.Name}
                          </li>
                        ))}
                    </ul>
                  )}
              </td>
              {material.Type === 'Finished' ? (
                <td className="py-3 px-4">Hoàn thiện</td>
              ) : (
                <td className="py-3 px-4">Thô</td>
              )}
              <td className="py-3 px-4">{material.Unit}</td>
              <td className="py-3 px-4">
                {material.Price.toLocaleString()} VNĐ
              </td>
              {editMode && (
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDeleteMaterial(index)}
                    className="bg-red-500 text-white w-8 h-8 flex items-center justify-center shadow hover:bg-red-600 transition duration-300 rounded-full mx-auto"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {editMode && (
        <button
          onClick={handleAddMaterial}
          className="bg-teal-500 text-white px-4 py-2 rounded mt-4 shadow-lg hover:bg-teal-600 transition duration-300"
        >
          Tạo vật tư
        </button>
      )}
    </>
  );
};

export default MaterialTable;
