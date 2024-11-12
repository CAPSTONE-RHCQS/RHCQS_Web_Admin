import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ConstructionSearchResponse,
  getConstructionByName,
} from '../../../../../api/Construction/ConstructionApi';
import { PackageTypeSearchResponse } from '../../../../../api/Package/PackageApi';
import DeleteButton from '../../../../../components/Buttonicons/DeleteButton';

interface HouseAreaComponentProps {
  searchPackageResults: PackageTypeSearchResponse[];
  selectedPackagePrice: number;
  formatCurrency: (value: number) => string;
  onAreaDataChange: (areas: AreaData[]) => void;
}

export interface AreaData {
  buildingArea: string;
  floorArea: string;
  size: string;
  totalRough: number;
  searchContruction: string;
  searchResults: ConstructionSearchResponse[];
  addedItems: {
    Id: string;
    SubConstructionId: string;
    Name: string;
    Coefficient: number;
    area: number;
  }[];
  selectedItems: {
    Id: string;
    SubConstructionId: string;
    Name: string;
    area: number;
  }[];
}

const CreateAreaHouse: React.FC<HouseAreaComponentProps> = ({
  selectedPackagePrice,
  formatCurrency,
  onAreaDataChange,
}) => {
  const [areas, setAreas] = useState<AreaData[]>([
    {
      buildingArea: '',
      floorArea: '',
      size: '',
      totalRough: 0,
      searchContruction: '',
      searchResults: [],
      addedItems: [],
      selectedItems: [],
    },
  ]);

  const previousAreasRef = useRef<AreaData[]>(areas);

  useEffect(() => {
    const previousAreas = previousAreasRef.current;
    if (JSON.stringify(previousAreas) !== JSON.stringify(areas)) {
      onAreaDataChange(areas);
      previousAreasRef.current = areas;
    }
  }, [areas, onAreaDataChange]);

  const [selectedItems, setSelectedItems] = useState<
    { Id: string; SubConstructionId: string; Name: string }[]
  >([]);
  console.log('selectedItems:', selectedItems);

  const handleAreaInputChange = (
    index: number,
    field: keyof AreaData,
    value: string,
  ) => {
    const newAreas = [...areas];
    newAreas[index][field] = value as never;
    setAreas(newAreas);
  };

  const handleSearchChangeForArea = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const searchValue = e.target.value;
    const newAreas = [...areas];
    newAreas[index].searchContruction = searchValue;
    setAreas(newAreas);

    if (searchValue) {
      try {
        const results = await getConstructionByName(searchValue);
        const filteredResults = results.filter(
          (result) =>
            !newAreas[index].addedItems.some(
              (item) => item.Name === result.Name,
            ),
        );
        newAreas[index].searchResults = filteredResults;
        setAreas(newAreas);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      newAreas[index].searchResults = [];
      setAreas(newAreas);
    }
  };

  const handleAddItemForArea = (index: number, item: any) => {
    const newAreas = [...areas];
    newAreas[index].addedItems.push({ ...item, area: 0 });
    newAreas[index].searchResults = [];
    setAreas(newAreas);

    const selectedItem = {
      Id: item.Id,
      SubConstructionId: item.SubConstructionId,
      Name: item.Name,
      area: 0,
    };
    newAreas[index].selectedItems.push(selectedItem);
    setAreas(newAreas);
    setSelectedItems(newAreas[index].selectedItems);

    console.log('Hạng mục được thêm:', selectedItem);
  };

  const handleItemAreaChange = (
    areaIndex: number,
    itemIndex: number,
    value: string,
  ) => {
    const newAreas = [...areas];
    const areaValue = parseFloat(value) || 0;
    newAreas[areaIndex].addedItems[itemIndex].area = areaValue;

    // Cập nhật giá trị area trong selectedItems
    newAreas[areaIndex].selectedItems[itemIndex].area = areaValue;

    setAreas(newAreas);
    updateTotalRoughForArea(areaIndex);
  };

  const calculateTotalCostForArea = (index: number) => {
    const areaData = areas[index];
    return areaData.addedItems.reduce((total, item) => {
      return total + item.area * (selectedPackagePrice || 0) * item.Coefficient;
    }, 0);
  };

  const addNewArea = () => {
    setAreas([
      ...areas,
      {
        buildingArea: '',
        floorArea: '',
        size: '',
        totalRough: 0,
        searchContruction: '',
        searchResults: [],
        addedItems: [],
        selectedItems: [],
      },
    ]);
  };

  const updateTotalRoughForArea = useCallback(
    (index: number) => {
      const newAreas = [...areas];
      const newTotalRough = calculateTotalCostForArea(index);
      if (newAreas[index].totalRough !== newTotalRough) {
        newAreas[index].totalRough = newTotalRough;
        setAreas(newAreas);
      }
    },
    [areas],
  );

  useEffect(() => {
    areas.forEach((_, index) => updateTotalRoughForArea(index));
  }, [areas, updateTotalRoughForArea]);

  const handleRemoveArea = (index: number) => {
    const newAreas = areas.filter((_, areaIndex) => areaIndex !== index);
    setAreas(newAreas);
  };

  const handleSizeInputChange = (
    index: number,
    width: string,
    length: string,
  ) => {
    const newAreas = [...areas];
    newAreas[index].size = `R${width}xD${length}`;
    setAreas(newAreas);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mt-8">
        <h3 className="text-2xl font-bold text-black">
          Bước 2 - Tạo diện tích nhà mẫu
        </h3>
        {areas.length < 3 && (
          <span
            onClick={addNewArea}
            className="text-primary cursor-pointer font-bold"
          >
            + Thêm diện tích
          </span>
        )}
      </div>
      {areas.map((areaData, index) => (
        <div
          key={index}
          className="relative rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6"
        >
          {areas.length > 1 && (
            <button
              onClick={() => handleRemoveArea(index)}
              className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full w-8 h-6 flex items-center justify-center"
            >
              -
            </button>
          )}
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold mb-4 mt-1 text-black">
              Diện tích mẫu {index + 1}
            </h3>
          </div>
          <div className="flex">
            <div className="w-1/3 pr-2">
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1 mt-8">
                  Diện tích:
                </label>
                <input
                  type="text"
                  value={areaData.buildingArea}
                  onChange={(e) =>
                    handleAreaInputChange(index, 'buildingArea', e.target.value)
                  }
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1">
                  Diện tích xây dựng:
                </label>
                <input
                  type="text"
                  value={areaData.floorArea}
                  onChange={(e) =>
                    handleAreaInputChange(index, 'floorArea', e.target.value)
                  }
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-3 flex space-x-2">
                <div className="flex-1">
                  <label className="block text-lg font-medium mb-1">
                    Chiều rộng (R):
                  </label>
                  <input
                    type="text"
                    onChange={(e) =>
                      handleSizeInputChange(
                        index,
                        e.target.value,
                        areaData.size.split('xD')[1] || '',
                      )
                    }
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-lg font-medium mb-1">
                    Chiều dài (D):
                  </label>
                  <input
                    type="text"
                    onChange={(e) =>
                      handleSizeInputChange(
                        index,
                        areaData.size.split('xD')[0].replace('R', '') || '',
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1">
                  Tổng tiền hạng mục:{' '}
                  {formatCurrency(calculateTotalCostForArea(index))}
                </label>
              </div>
            </div>
            <div className="w-2/3 pl-2">
              <div className="flex mb-4">
                <input
                  type="search"
                  value={areaData.searchContruction}
                  onChange={(e) => handleSearchChangeForArea(index, e)}
                  placeholder="Tìm kiếm hạng mục..."
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
              <div>
                {areaData.searchResults.length > 0 && (
                  <div className="absolute bg-white border border-primary w-full z-10 max-h-60 overflow-y-auto">
                    {areaData.searchResults.map((result) => (
                      <div
                        key={result.Id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAddItemForArea(index, result)}
                      >
                        <p>{result.Name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <table className="w-full border border-collapse border-primary">
                <thead>
                  <tr>
                    <th className="border border-primary py-2">Tên hạng mục</th>
                    <th className="border border-primary py-2">Hệ số</th>
                    <th className="border border-primary py-2">
                      Gói thi công thô
                    </th>
                    <th className="border border-primary py-2">ĐVT</th>
                    <th className="border border-primary py-2">Diện tích</th>
                    <th className="border border-primary py-2">Tổng tiền</th>
                    <th className="border border-primary py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {areaData.addedItems.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td className="border border-primary py-2 text-center">
                        {item.Name}
                      </td>
                      <td className="border border-primary py-2 text-center">
                        {item.Coefficient}
                      </td>
                      <td className="border border-primary py-2 text-center">
                        {selectedPackagePrice !== null
                          ? formatCurrency(selectedPackagePrice)
                          : ''}
                      </td>
                      <td className="border border-primary py-2 text-center">
                        m²
                      </td>
                      <td className="border border-primary py-2 text-center">
                        <input
                          type="text"
                          value={item.area}
                          onChange={(e) =>
                            handleItemAreaChange(
                              index,
                              itemIndex,
                              e.target.value,
                            )
                          }
                          className="w-full text-center"
                          placeholder="Nhập diện tích"
                        />
                      </td>
                      <td className="border border-primary py-2 text-center">
                        {formatCurrency(
                          item.area *
                            (selectedPackagePrice || 0) *
                            item.Coefficient,
                        )}
                      </td>
                      <td className="border border-primary py-2 text-center">
                        <button
                          className="text-red-500"
                          onClick={() => {
                            const newAreas = [...areas];
                            newAreas[index].addedItems = newAreas[
                              index
                            ].addedItems.filter((_, i) => i !== itemIndex);
                            newAreas[index].selectedItems = newAreas[
                              index
                            ].selectedItems.filter((_, i) => i !== itemIndex);
                            setAreas(newAreas);
                            setSelectedItems(newAreas[index].selectedItems);
                          }}
                        >
                          <DeleteButton onClick={() => {}} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreateAreaHouse;
