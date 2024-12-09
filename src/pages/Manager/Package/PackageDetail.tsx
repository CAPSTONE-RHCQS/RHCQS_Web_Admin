import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getPackageById, putPackage } from '../../../api/Package/PackageApi';
import { Package, PackageMaterial } from '../../../types/PackagesTypes';
import { PackagePutRequest } from '../../../types/PackageRequestTypes';
import ClipLoader from 'react-spinners/ClipLoader';
import LaborTable from './components/Table/LaborTable';
import MaterialTable from './components/Table/MaterialTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { FaCheckCircle } from 'react-icons/fa';
import { PackageLabor } from '../../../types/PackagesTypes';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [packageDetail, setPackageDetail] = useState<Package | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<PackagePutRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadPackageDetail = async () => {
      try {
        const response = await getPackageById(id);
        setPackageDetail(response.data);
        setEditData({
          packageType: response.data.PackageType,
          packageName: response.data.PackageName,
          unit: response.data.Unit,
          price: response.data.Price,
          status: response.data.Status,
          packageLabors: response.data.PackageLabors.map((labor) => ({
            laborId: labor.LaborId,
          })),
          packageMaterials: response.data.PackageMaterials.map((material) => ({
            materialId: material.Id,
          })),
          packageHouses: response.data.PackageHouses.map((house) => ({
            designTemplateId: house.DesignTemplateId,
            imgUrl: house.ImgUrl || '',
            description: null,
          })),
        });
      } catch (error) {
        console.error('Error fetching package detail:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPackageDetail();
  }, [id]);

  const handleLaborUpdate = useCallback(
    (updatedLabors: PackageLabor[]) => {
      if (
        editData &&
        JSON.stringify(editData.packageLabors) !== JSON.stringify(updatedLabors)
      ) {
        setEditData((prevEditData) => ({
          ...prevEditData!,
          packageLabors: updatedLabors.map((labor) => ({
            laborId: labor.LaborId,
          })),
        }));
      }
    },
    [editData],
  );

  const handleMaterialUpdate = useCallback(
    (updatedMaterials: PackageMaterial[]) => {
      if (
        editData &&
        JSON.stringify(editData.packageMaterials) !==
          JSON.stringify(updatedMaterials)
      ) {
        setEditData((prevEditData) => ({
          ...prevEditData!,
          packageMaterials: updatedMaterials.map((material) => ({
            materialId: material.MaterialId,
          })),
        }));
      }
    },
    [editData],
  );

  const handleSave = async () => {
    if (!editData || !id) return;
    try {
      await putPackage(id, editData);
      setEditMode(false);
      setPackageDetail((prev) => (prev ? { ...prev, ...editData } : null));
      toast.success('Cập nhật gói thành công!');
    } catch (error) {
      toast.error('Cập nhật gói thất bại!');
      console.error('Error updating package:', error);
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (status && status.toUpperCase() === 'ACTIVE') {
      return <FaCheckCircle className="text-green-500" />;
    }
    return null;
  };

  const translatePackageType = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ROUGH':
        return 'Gói thô';
      case 'FINISHED':
        return 'Gói hoàn thiện';
      default:
        return type;
    }
  };

  const handleAddLabor = () => {
    if (!packageDetail) return;
    const newLabor: PackageLabor = {
      Id: Date.now().toString(),
      LaborId: '',
      NameOfLabor: '',
      Type: '',
      Price: 0,
      InsDate: new Date().toISOString(),
    };

    const updatedLabors = [...packageDetail.PackageLabors, newLabor];
    handleLaborUpdate(updatedLabors);

    setPackageDetail((prev) => ({
      ...prev!,
      PackageLabors: updatedLabors,
    }));
  };

  const handleAddMaterial = () => {
    if (!packageDetail) return;
    const newMaterial: PackageMaterial = {
      Id: '',
      Description: '',
      MaterialId: '',
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

    const updatedMaterials = [...packageDetail.PackageMaterials, newMaterial];
    handleMaterialUpdate(updatedMaterials);
    setPackageDetail((prev) => ({
      ...prev!,
      PackageMaterials: updatedMaterials,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <ClipLoader size={50} color={'#5BABAC'} loading={true} />
      </div>
    );
  }

  if (!packageDetail) {
    return (
      <div className="text-center text-gray-500 bg-gray-100 p-4 rounded-md">
        Không tìm thấy dữ liệu
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
        <button
          onClick={() => setEditMode(!editMode)}
          className="absolute top-2 right-2 bg-teal-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-teal-600 transition duration-300"
        >
          <FontAwesomeIcon icon={editMode ? faTimes : faEdit} size="sm" />
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-600">
          {editMode ? (
            <input
              type="text"
              value={editData?.packageName || ''}
              onChange={(e) =>
                setEditData({ ...editData!, packageName: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
          ) : (
            packageDetail.PackageName
          )}
        </h1>
        <div className="mb-4 flex justify-between items-center">
          <p className="text-lg text-gray-700">
            Giá:{' '}
            {editMode ? (
              <input
                type="number"
                value={editData?.price || 0}
                onChange={(e) =>
                  setEditData({
                    ...editData!,
                    price: parseFloat(e.target.value),
                  })
                }
                className="border p-2 rounded"
              />
            ) : (
              <span className="font-semibold">
                {packageDetail.Price.toLocaleString()} VND
              </span>
            )}
          </p>
          <span className="flex items-center">
            {getStatusIcon(packageDetail.Status)}
          </span>
        </div>
        <p className="text-lg text-gray-500 mb-4">
          Loại:{' '}
          {editMode ? (
            <select
              value={editData?.packageType || ''}
              onChange={(e) =>
                setEditData({ ...editData!, packageType: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="ROUGH">Gói thô</option>
              <option value="FINISHED">Gói hoàn thiện</option>
            </select>
          ) : (
            translatePackageType(packageDetail.PackageType)
          )}
        </p>

        {packageDetail.PackageLabors.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-teal-500">
              Chi tiết nhân công
            </h2>
            <LaborTable
              labors={packageDetail.PackageLabors}
              editMode={editMode}
              onLaborUpdate={handleLaborUpdate}
            />
          </>
        ) : editMode ? (
          <button
            onClick={handleAddLabor}
            className="bg-teal-500 text-white px-4 py-2 rounded mt-4 shadow-lg hover:bg-teal-600 transition duration-300"
          >
            Tạo nhân công
          </button>
        ) : (
          <></>
        )}

        {packageDetail.PackageMaterials.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-teal-500">
              Chi tiết vật liệu
            </h2>
            <MaterialTable
              materials={packageDetail.PackageMaterials}
              editMode={editMode}
              onMaterialUpdate={handleMaterialUpdate}
            />
          </>
        ) : editMode ? (
          <button
            onClick={handleAddMaterial}
            className="bg-teal-500 text-white px-4 py-2 rounded mt-4 shadow-lg hover:bg-teal-600 transition duration-300"
          >
            Tạo vật tư
          </button>
        ) : (
          <></>
        )}

        {packageDetail.PackageHouses.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-teal-500">
              Chi tiết nhà
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packageDetail.PackageHouses.map((house) => (
                <div
                  key={house.Id}
                  className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  {house.ImgUrl ? (
                    <img
                      src={house.ImgUrl}
                      alt="House Design"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ) : (
                    <p className="text-gray-500">Không có hình ảnh</p>
                  )}
                  <p className="text-gray-500 mt-2">
                    Mẫu thiết kế: {house.DesignTemplateId}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {editMode && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-teal-500 text-white px-4 py-2 rounded mr-2 shadow-lg hover:bg-teal-600 transition duration-300"
            >
              <FontAwesomeIcon icon={faSave} /> Lưu
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-red-200 text-white px-4 py-2 rounded shadow-lg hover:bg-gray-600 transition duration-300"
            >
              <FontAwesomeIcon icon={faTimes} /> Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDetail;
