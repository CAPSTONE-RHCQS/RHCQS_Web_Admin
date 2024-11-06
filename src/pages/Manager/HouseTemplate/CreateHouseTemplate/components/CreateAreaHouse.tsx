import React, { useState } from 'react';
import { ConstructionSearchResponse, getConstructionByName } from '../../../../../api/Construction/ConstructionApi';
import { PackageTypeSearchResponse } from '../../../../../api/Package/PackageApi';

interface HouseAreaComponentProps {
  searchPackageResults: PackageTypeSearchResponse[];
  selectedPackagePrice: number;
  formatCurrency: (value: number) => string;
}

export interface AreaData {
    
  area: string;
  constructionArea: string;
  floorArea: string;
  searchContruction: string;
  searchResults: ConstructionSearchResponse[];
  addedItems: { Id: string; SubConstructionId: string; Name: string; Coefficient: number; area: number }[];
}

const CreateAreaHouse: React.FC<HouseAreaComponentProps> = ({
  selectedPackagePrice,
  formatCurrency,
}) => {
  const [areas, setAreas] = useState<AreaData[]>([
    {
      area: '',
      constructionArea: '',
      floorArea: '',
      searchContruction: '',
      searchResults: [],
      addedItems: [],
    },
  ]);

  const handleAreaInputChange = (index: number, field: keyof AreaData, value: string) => {
    const newAreas = [...areas];
    newAreas[index][field] = value as any;
    setAreas(newAreas);
  };

  const handleSearchChangeForArea = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    const newAreas = [...areas];
    newAreas[index].searchContruction = searchValue;
    setAreas(newAreas);

    if (searchValue) {
      try {
        const results = await getConstructionByName(searchValue);
        const filteredResults = results.filter(result => 
          !newAreas[index].addedItems.some(item => item.Name === result.Name)
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
  };

  const handleItemAreaChange = (areaIndex: number, itemIndex: number, value: string) => {
    const newAreas = [...areas];
    newAreas[areaIndex].addedItems[itemIndex].area = parseFloat(value) || 0;
    setAreas(newAreas);
  };

  const calculateTotalCostForArea = (index: number) => {
    const areaData = areas[index];
    return areaData.addedItems.reduce((total, item) => {
      return total + (item.area * (selectedPackagePrice || 0) * item.Coefficient);
    }, 0);
  };

  const addNewArea = () => {
    setAreas([
      ...areas,
      {
        area: '',
        constructionArea: '',
        floorArea: '',
        searchContruction: '',
        searchResults: [],
        addedItems: [],
      },
    ]);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 mt-8 text-black">
        Bước 2 - Tạo diện tích nhà mẫu
      </h3>
      {areas.map((areaData, index) => (
        <div key={index} className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
          <h3 className="text-2xl font-bold mb-4 mt-1 text-black">Diện tích {index + 1}</h3>
          <div className="flex">
            <div className="w-1/3 pr-2">
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1 mt-8">
                  Diện tích:
                </label>
                <input
                  type="text"
                  value={areaData.area}
                  onChange={(e) => handleAreaInputChange(index, 'area', e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1">
                  Diện tích xây dựng:
                </label>
                <input
                  type="text"
                  value={areaData.constructionArea}
                  onChange={(e) => handleAreaInputChange(index, 'constructionArea', e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1">
                  Diện tích lầu:
                </label>
                <input
                  type="text"
                  value={areaData.floorArea}
                  onChange={(e) => handleAreaInputChange(index, 'floorArea', e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-lg font-medium mb-1">
                  Tổng tiền hạng mục: {formatCurrency(calculateTotalCostForArea(index))}
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
                            handleItemAreaChange(index, itemIndex, e.target.value)
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
                            newAreas[index].addedItems = newAreas[index].addedItems.filter((_, i) => i !== itemIndex);
                            setAreas(newAreas);
                          }}
                        >
                          Xóa
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
      <button onClick={addNewArea} className="mt-4 bg-primary text-white py-2 px-4 rounded">
        Thêm diện tích mới
      </button>
    </div>
  );
};

export default CreateAreaHouse;
