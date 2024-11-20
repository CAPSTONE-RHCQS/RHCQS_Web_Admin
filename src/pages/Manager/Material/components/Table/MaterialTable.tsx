import React, { useState, useEffect, useRef } from 'react';
import {
  MaterialItem,
  MaterialRequest,
  MaterialSectionItem,
} from '../../../../../types/Material';
import { FaEye, FaEdit, FaPlus } from 'react-icons/fa';
import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/solid';
import EditMaterialSection from '../Edit/EditMaterialSection';
import EditMaterial from '../Edit/EditMaterial';
import {
  updateMaterialSection,
  updateMaterial,
} from '../../../../../api/Material/Material';
import Alert from '../../../../../components/Alert';
import CreateMaterial from '../Create/CreateMaterial';

interface MaterialTableProps {
  dataMaterialSection: MaterialSectionItem[];
  dataMaterial: MaterialItem[];
  openItems: Set<number>;
  editModalOpen: boolean;
  toggleOpenItem: (index: number) => void;
  formatPrice: (price: number) => string;
  openEditModal: (id: string) => void;
  currentEditId: string | null;
  refreshData: () => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({
  dataMaterialSection,
  dataMaterial,
  openItems,
  editModalOpen,
  toggleOpenItem,
  formatPrice,
  openEditModal,
  currentEditId,
  refreshData,
}) => {
  const [activeEditIndex, setActiveEditIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(editModalOpen);
  const [inputNameValue, setInputNameValue] = useState<string>('');
  const [inputCodeValue, setInputCodeValue] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null,
  );
  const editRef = useRef<HTMLDivElement | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);

  useEffect(() => {
    setIsModalOpen(editModalOpen);
  }, [editModalOpen]);

  const handleCreateClick = (sectionId: string) => {
    setCurrentSectionId(sectionId);
    setIsCreateModalOpen(true);
  };

  const handleEditSuccess = async (
    id: string,
    materialDetail: MaterialRequest,
  ) => {
    await updateMaterial(id, materialDetail);
    setAlertMessage('Sửa vật liệu thành công');
    setAlertType('success');
    refreshData();
    setSelectedMaterialId(null);
  };

  const handleEditClick = (
    event: React.MouseEvent,
    id: string,
    name: string,
    code: string,
  ) => {
    event.stopPropagation();
    setInputNameValue(name);
    setInputCodeValue(code);
    setIsModalOpen(true);
    openEditModal(id);
  };

  const handleViewDetail = (id: string) => {
    setSelectedMaterialId(id);
  };

  const handleSave = async () => {
    try {
      if (currentEditId) {
        await updateMaterialSection(currentEditId, {
          name: inputNameValue,
          code: inputCodeValue,
        });
        setAlertMessage('Sửa vật liệu thành công');
        setAlertType('success');
        refreshData();
      }
    } catch (error) {
      setAlertMessage('Sửa vật liệu thất bại');
      setAlertType('error');
    } finally {
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCreateSuccess = (message: string) => {
    setAlertMessage(message);
    setAlertType('success');
    refreshData();
  };

  return (
    <>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {['Tên', 'Ngày tạo', ''].map((header) => (
              <th
                key={header}
                className="py-4 px-4 font-medium text-black dark:text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataMaterialSection.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="cursor-pointer">
                <td
                  className="border-b border-[#eee] py-5 px-4 dark:border-strokedark flex items-center"
                  onClick={() => toggleOpenItem(index)}
                >
                  {item.Name}
                  <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                </td>
                <td
                  className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                  onClick={() => toggleOpenItem(index)}
                >
                  {new Date(item.InsDate).toLocaleDateString()}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                  <div className="flex justify-center relative" ref={editRef}>
                    {activeEditIndex === index ? (
                      <div className="absolute flex space-x-2 mt-[-6px]">
                        <button
                          className="cursor-pointer text-blue-500 mr-10"
                          onClick={(event) =>
                            handleEditClick(
                              event,
                              item.Id.toString(),
                              item.Name,
                              item.Code,
                            )
                          }
                          title="Chỉnh sửa vật tư"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          className="cursor-pointer text-green-500"
                          onClick={() => handleCreateClick(item.Id.toString())}
                          title="Thêm mới vật tư"
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          setActiveEditIndex(index);
                        }}
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="w-4 h-4 text-primaryGreenButton" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {openItems.has(index) && (
                <tr>
                  <td
                    colSpan={3}
                    className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                  >
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-100 text-left dark:bg-meta-5">
                          {['Tên', 'Giá', 'Đơn vị', 'Nhà cung cấp', ''].map(
                            (header) => (
                              <th
                                key={header}
                                className="py-2 px-4 font-medium text-black dark:text-white"
                              >
                                {header}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {dataMaterial
                          .filter(
                            (material) =>
                              material.MaterialSectionId === item.Id,
                          )
                          .map((material, materialIndex) => (
                            <tr key={materialIndex}>
                              <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                {material.Name}
                              </td>
                              <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                {formatPrice(material.Price ?? 0)}
                              </td>
                              <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                {material.Unit}
                              </td>
                              <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                {material.SupplierName}
                              </td>
                              <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                <FaEye
                                  className="text-primaryGreenButton hover:text-secondaryGreenButton transition mr-6"
                                  title="Xem chi tiết"
                                  onClick={() =>
                                    handleViewDetail(material.Id.toString())
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        {dataMaterial.filter(
                          (material) =>
                            material.MaterialSectionId === item.Id,
                        ).length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-2 px-4 text-center text-gray-500"
                            >
                              Chưa có vật tư
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EditMaterialSection
          isOpen={isModalOpen}
          inputNameValue={inputNameValue}
          inputCodeValue={inputCodeValue}
          onInputNameChange={setInputNameValue}
          onInputCodeChange={setInputCodeValue}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {isCreateModalOpen && (
        <CreateMaterial
          id={currentSectionId ?? ''}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage(null)}
        />
      )}

      {selectedMaterialId && (
        <EditMaterial
          id={selectedMaterialId}
          onClose={() => setSelectedMaterialId(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

export default MaterialTable;
