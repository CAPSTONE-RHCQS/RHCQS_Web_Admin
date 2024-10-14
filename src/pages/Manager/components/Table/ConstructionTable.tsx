import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface SubConstructionItem {
  Name: string;
  Coefficient: number;
  Unit: string;
  InsDate: string;
}

interface ConstructionItem {
  Name: string;
  Coefficient: number;
  Unit: string;
  InsDate: string;
  SubConstructionItems?: SubConstructionItem[];
}

interface ConstructionTableProps {
  data: ConstructionItem[];
  isLoading: boolean;
}

const ConstructionTable: React.FC<ConstructionTableProps> = ({
  data,
  isLoading,
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedSubItems, setSelectedSubItems] = useState<{
    [key: number]: number;
  }>({});

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

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={'#123abc'} loading={isLoading} />
        </div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {['Tên', 'Hệ số', 'Đơn vị', 'Ngày tạo'].map((header) => (
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
            {data.map((item, index) => (
              <React.Fragment key={index}>
                <tr
                  onClick={() => toggleOpenItem(index)}
                  className="cursor-pointer"
                >
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark flex items-center">
                    {item.Name}
                    {item.SubConstructionItems &&
                      item.SubConstructionItems.length > 0 && (
                        <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
                      )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {item.Coefficient}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {item.Unit}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {new Date(item.InsDate).toLocaleDateString()}
                  </td>
                </tr>
                {openItems.has(index) &&
                  item.SubConstructionItems &&
                  item.SubConstructionItems.length > 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                      >
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="bg-gray-100 text-left dark:bg-meta-5">
                              {['Tên Mục Con', 'Hệ số', 'Đơn vị', 'Ngày tạo'].map(
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
                                  className={`cursor-pointer ${
                                    selectedSubItems[index] === subIndex
                                      ? 'bg-blue-100'
                                      : ''
                                  }`}
                                >
                                  <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                    {subItem.Name}
                                  </td>
                                  <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                    {subItem.Coefficient}
                                  </td>
                                  <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                    {subItem.Unit}
                                  </td>
                                  <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
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
    </>
  );
};

export default ConstructionTable;
