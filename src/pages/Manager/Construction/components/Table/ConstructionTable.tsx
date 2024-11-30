import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/solid';
import EditConstructionModal from '../Modals/EditConstructionModal';

export interface SubConstructionItem {
  Id: string;
  Name: string;
  Coefficient: number;
  Unit: string;
  InsDate: string;
}

export interface ConstructionItem {
  Id: string;
  Name: string;
  Coefficient: number;
  Unit: string;
  InsDate: string;
  SubConstructionItems?: SubConstructionItem[];
}

export interface ConstructionTableProps {
  data: ConstructionItem[];
  isLoading: boolean;
  onEditSuccess: () => void;
}

const ConstructionTable: React.FC<ConstructionTableProps> = ({
  data,
  isLoading,
  onEditSuccess,
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedSubItems, setSelectedSubItems] = useState<{
    [key: number]: number;
  }>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedConstruction, setSelectedConstruction] =
    useState<ConstructionItem | null>(null);

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

  const handleSubItemSelect = (
    itemIndex: number,
    subIndex: number,
    coefficient: number,
  ) => {
    setSelectedSubItems((prev) => ({
      ...prev,
      [itemIndex]: subIndex,
    }));
    data[itemIndex].Coefficient = coefficient;
  };

  const openEditModal = (id: string) => {
    const construction = data.find((item) => item.Id === id);
    if (construction) {
      setSelectedConstruction(construction);
      setEditModalOpen(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={'#5BABAC'} loading={isLoading} />
        </div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-meta-4">
              {['Tên', 'Hệ số', 'Đơn vị', 'Ngày tạo', ''].map((header) => (
                <th
                  key={header}
                  className="py-4 px-4 text-black dark:text-white font-bold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <React.Fragment key={index}>
                <tr
                  onClick={() => toggleOpenItem(index)}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark flex items-center font-bold uppercase">
                    <div className="flex items-center font-bold text-red-500 dark:text-white uppercase">
                      {item.Name}
                      {item.SubConstructionItems &&
                        item.SubConstructionItems.length > 0 && (
                          <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                        )}
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark font-bold text-primaryGreenButton dark:text-white">
                    {item.Coefficient}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark font-bold text-black">
                    {item.Unit}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {new Date(item.InsDate).toLocaleDateString()}
                  </td>
                  <td className=" border-b border-[#eee] py-5 px-4 dark:border-strokedark ">
                    <PencilIcon
                      className="w-4 h-4 text-primaryGreenButton cursor-pointer hover:text-secondaryGreenButton transition"
                      onClick={() => openEditModal(item.Id)}
                    />
                  </td>
                </tr>
                {openItems.has(index) &&
                  item.SubConstructionItems &&
                  item.SubConstructionItems.length > 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-5 px-4 dark:border-strokedark"
                      >
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="bg-gray-200 text-left dark:bg-meta-4 text-sm">
                              {[
                                'Tên Mục Con',
                                'Hệ số',
                                'Đơn vị',
                                'Ngày tạo',
                              ].map((header) => (
                                <th
                                  key={header}
                                  className="border-b border-[#eee] py-2 px-20 font-bold text-gray-250 dark:text-white text-sm"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {item.SubConstructionItems.map(
                              (subItem, subIndex) => (
                                <tr
                                  key={subIndex}
                                  onClick={() =>
                                    handleSubItemSelect(
                                      index,
                                      subIndex,
                                      subItem.Coefficient,
                                    )
                                  }
                                  className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                    selectedSubItems[index] === subIndex
                                      ? 'bg-blue-100'
                                      : ''
                                  }`}
                                >
                                  <td className="border-b border-[#eee] py-2 px-20 font-bold text-black dark:text-white">
                                    {subItem.Name}
                                  </td>
                                  <td className="border-b border-[#eee] py-2 px-20 font-bold text-primaryGreenButton dark:text-white">
                                    {subItem.Coefficient}
                                  </td>
                                  <td className="border-b border-[#eee] py-2 px-20 font-bold text-black dark:text-white">
                                    {subItem.Unit}
                                  </td>
                                  <td className="border-b border-[#eee] py-2 px-20 font-regular text-black dark:text-white">
                                    {new Date(
                                      subItem.InsDate,
                                    ).toLocaleDateString()}
                                  </td>
                                </tr>
                              ),
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
      )}
      {editModalOpen && selectedConstruction && (
        <EditConstructionModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onEditSuccess={() => {
            setEditModalOpen(false);
            onEditSuccess();
          }}
          construction={selectedConstruction}
        />
      )}
    </>
  );
};

export default ConstructionTable;
