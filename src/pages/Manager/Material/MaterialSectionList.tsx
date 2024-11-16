import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/solid';
import EditConstructionModal from '../Construction/components/Modals/EditConstructionModal';
import { getMaterialList, getMaterialSectionList } from '../../../api/Material/Material';
import { MaterialItem, MaterialSectionItem } from '../../../types/Material';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const MaterialSectionList: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMaterialSection, setSelectedMaterialSection] =
    useState<MaterialSectionItem | null>(null);
  const [dataMaterialSection, setDataMaterialSection] = useState<
    MaterialSectionItem[]
  >([]);
  const [dataMaterial, setDataMaterial] = useState<MaterialItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMaterialSection, setTotalMaterialSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getMaterialList(page, 10).then((dataMaterial) => {
      setDataMaterial(dataMaterial.Items);
    });
    getMaterialSectionList(page, 10).then((data) => {
      setDataMaterialSection(data.Items);
      setTotalPages(data.TotalPages);
      setTotalMaterialSection(data.Total);
      console.log(data.Items);
      setIsLoading(false);
    });
  }, [page]);

  const toggleOpenItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const openEditModal = (id: string) => {
    const materialSection = dataMaterialSection.find((item) => item.Id === id);
    if (materialSection) {
      setSelectedMaterialSection(materialSection);
      setEditModalOpen(true);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      <div>
        <Breadcrumb pageName="Quản lý hạng mục" />
        <div className="bg-white p-4 rounded shadow ">
          <div className="flex items-center justify-between mb-8 ml-4 mt-4">
            <span className="text-lg text-black dark:text-white">
              Tổng số vật tư: {totalMaterialSection}
            </span>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Thêm vật tư
            </button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={50} color={'#5BABAC'} loading={isLoading} />
            </div>
          ) : (
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
                      <tr
                        onClick={() => toggleOpenItem(index)}
                        className="cursor-pointer"
                      >
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark flex items-center">
                          {item.Name}
                          <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {new Date(item.InsDate).toLocaleDateString()}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <PencilIcon
                            className="w-4 h-4 text-blue-500 cursor-pointer"
                            onClick={() => openEditModal(item.Id)}
                          />
                        </td>
                      </tr>
                      {openItems.has(index) && (
                        <tr>
                          <td colSpan={3} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <table className="w-full table-auto">
                              <thead>
                                <tr className="bg-gray-100 text-left dark:bg-meta-5">
                                  {['Tên', 'Giá', 'Đơn vị', 'Nhà cung cấp'].map((header) => (
                                    <th
                                      key={header}
                                      className="py-2 px-4 font-medium text-black dark:text-white"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {dataMaterial
                                  .filter((material) => material.MaterialSectionName === item.Name)
                                  .map((material, materialIndex) => (
                                    <tr key={materialIndex}>
                                      <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                        {material.Name}
                                      </td>
                                      <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                        {material.Price} {material.UnitPrice}
                                      </td>
                                      <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                        {material.Unit}
                                      </td>
                                      <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                        {material.SupplierName}
                                      </td>
                                    </tr>
                                  ))}
                                {dataMaterial.filter((material) => material.MaterialSectionName === item.Name).length === 0 && (
                                  <tr>
                                    <td colSpan={4} className="py-2 px-4 text-center text-gray-500">
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
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
                >
                  Trang trước
                </button>
                <span>
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
                >
                  Trang sau
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MaterialSectionList;
