import React, { useState } from 'react';
import {
  Construction,
  GetConstructionByNameResponse,
} from '../../../../../types/SearchContainNameTypes';
import { getConstructionByName } from '../../../../../api/Construction/ConstructionApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { TableRow } from '../types';

interface ConstructionAreaTableProps {
  tableData: TableRow[];
  isEditing: boolean;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof TableRow,
  ) => void;
  area: number;
  totalArea: number;
  projectType: string;
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;
}

const ConstructionAreaTable: React.FC<ConstructionAreaTableProps> = ({
  tableData,
  isEditing,
  handleInputChange,
  area,
  totalArea,
  projectType,
  setTableData,
}) => {
  const [searchResults, setSearchResults] =
    useState<GetConstructionByNameResponse>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const handleSearch = async (name: string, index: number) => {
    try {
      const results = await getConstructionByName(name);
      setSearchResults(results);
      setSelectedRowIndex(index);
    } catch (error) {
      console.error('Error searching construction:', error);
    }
  };

  const handleSelectConstruction = (construction: Construction) => {
    if (selectedRowIndex !== null) {
      const newData = [...tableData];
      const selectedRow = newData[selectedRowIndex];
      if (selectedRow) {
        newData[selectedRowIndex] = {
          ...selectedRow,
          hangMuc: construction.Name,
          heSo: construction.Coefficient.toString(),
          dienTich: (
            parseFloat(selectedRow.dTich) * construction.Coefficient
          ).toString(),
          constructionItemId: construction.Id,
          subConstructionId: construction.SubConstructionId,
          price: construction.Price,
        };
        setTableData(newData);
      }
      setSearchResults([]);
      setSelectedRowIndex(null);
    }
  };

  const handleDeleteRow = (index: number) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  return (
    <div className="overflow-x-auto mb-4">
      {projectType === 'FINISHED' ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th colSpan={4} className="px-4 py-2 border text-left">
                <p className="text-primary">Phần hoàn thiện</p>
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 border text-center">STT</th>
              <th className="px-4 py-2 border text-center">Hạng mục</th>
              <th className="px-4 py-2 border text-center">Diện Tích</th>
              <th className="px-4 py-2 border text-center">Đơn vị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border text-center">1</td>
              <td className="px-4 py-2 border text-left">Phần hoàn thiện</td>
              <td className="px-4 py-2 border text-center font-bold">{area}</td>
              <td className="px-4 py-2 border text-center font-bold">m²</td>
            </tr>
          </tbody>
        </table>
      ) : projectType === 'ROUGH' ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th colSpan={7} className="px-4 py-2 border text-left">
                <p className="text-primary">Phần thô</p>
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 border text-center">STT</th>
              <th className="px-4 py-2 border text-center">Hạng mục</th>
              <th className="px-4 py-2 border text-center">D-Tích</th>
              <th className="px-4 py-2 border text-center">Hệ số</th>
              <th className="px-4 py-2 border text-center">Diện tích</th>
              <th className="px-4 py-2 border text-center">Đơn vị</th>
              {isEditing && <th className="px-4 py-2 border text-center"></th>}
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={item.uniqueId || index}>
                <td className="px-4 py-2 border text-center">{item.stt}</td>
                <td className="px-4 py-2 border text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.hangMuc}
                      onChange={(e) => {
                        handleInputChange(e, index, 'hangMuc');
                        handleSearch(e.target.value, index);
                      }}
                      className="w-full text-left border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        border: '1px solid #ccc',
                      }}
                    />
                  ) : (
                    <span>{item.hangMuc}</span>
                  )}
                  {isEditing &&
                    selectedRowIndex === index &&
                    searchResults.length > 0 && (
                      <ul className="bg-white border border-gray-300 mt-1">
                        {searchResults.map((result, index) => (
                          <li
                            key={`${result.Id}-${index}`}
                            onClick={() => handleSelectConstruction(result)}
                            className="cursor-pointer hover:bg-gray-200 p-2"
                          >
                            {result.Name}
                          </li>
                        ))}
                      </ul>
                    )}
                </td>
                <td className="px-4 py-2 border text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.dTich}
                      onChange={(e) => handleInputChange(e, index, 'dTich')}
                      className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        border: '1px solid #ccc',
                      }}
                    />
                  ) : (
                    <span>{item.dTich}</span>
                  )}
                </td>
                <td className="px-4 py-2 border text-center">{item.heSo}</td>
                <td className="px-4 py-2 border text-center">
                  {item.dienTich}
                </td>
                <td className="px-4 py-2 border text-center">{item.donVi}</td>
                {isEditing && (
                  <td className="px-4 py-2 border text-center">
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => handleDeleteRow(index)}
                        className="bg-red-500 text-white w-8 h-8 flex items-center justify-center shadow hover:bg-red-600 transition duration-300 rounded-full"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            <tr className="bg-gray-200">
              <td className="px-4 py-2 border text-center" colSpan={4}>
                <strong>
                  Tổng diện tích xây dựng theo phương án thiết kế:
                </strong>
              </td>
              <td className="px-4 py-2 border text-center">
                <strong>{isNaN(totalArea) ? '0' : totalArea.toString()}</strong>
              </td>
              <td className="px-4 py-2 border text-center">
                <strong>m²</strong>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th colSpan={7} className="px-4 py-2 border text-left">
                  <p className="text-primary">Phần thô</p>
                </th>
              </tr>
              <tr>
                <th className="px-4 py-2 border text-center">STT</th>
                <th className="px-4 py-2 border text-center">Hạng mục</th>
                <th className="px-4 py-2 border text-center">D-Tích</th>
                <th className="px-4 py-2 border text-center">Hệ số</th>
                <th className="px-4 py-2 border text-center">Diện tích</th>
                <th className="px-4 py-2 border text-center">Đơn vị</th>
                {isEditing && (
                  <th className="px-4 py-2 border text-center"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={item.uniqueId || index}>
                  <td className="px-4 py-2 border text-center">{item.stt}</td>
                  <td className="px-4 py-2 border text-left">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.hangMuc}
                        onChange={(e) => {
                          handleInputChange(e, index, 'hangMuc');
                          handleSearch(e.target.value, index);
                        }}
                        className="w-full text-left border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          border: '1px solid #ccc',
                        }}
                      />
                    ) : (
                      <span>{item.hangMuc}</span>
                    )}
                    {isEditing &&
                      selectedRowIndex === index &&
                      searchResults.length > 0 && (
                        <ul className="bg-white border border-gray-300 mt-1">
                          {searchResults.map((result, index) => (
                            <li
                              key={`${result.Id}-${index}`}
                              onClick={() => handleSelectConstruction(result)}
                              className="cursor-pointer hover:bg-gray-200 p-2"
                            >
                              {result.Name}
                            </li>
                          ))}
                        </ul>
                      )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.dTich}
                        onChange={(e) => handleInputChange(e, index, 'dTich')}
                        className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          border: '1px solid #ccc',
                        }}
                      />
                    ) : (
                      <span>{item.dTich}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">{item.heSo}</td>
                  <td className="px-4 py-2 border text-center">
                    {item.dienTich}
                  </td>
                  <td className="px-4 py-2 border text-center">{item.donVi}</td>
                  {isEditing && (
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => handleDeleteRow(index)}
                          className="bg-red-500 text-white w-8 h-8 flex items-center justify-center shadow hover:bg-red-600 transition duration-300 rounded-full"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              <tr className="bg-gray-200">
                <td className="px-4 py-2 border text-center" colSpan={4}>
                  <strong>
                    Tổng diện tích xây dựng theo phương án thiết kế:
                  </strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>
                    {isNaN(totalArea) ? '0' : totalArea.toString()}
                  </strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>m²</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="min-w-full bg-white border border-gray-200 mt-4">
            <thead>
              <tr>
                <th colSpan={4} className="px-4 py-2 border text-left">
                  <p className="text-primary">Phần hoàn thiện</p>
                </th>
              </tr>
              <tr>
                <th className="px-4 py-2 border text-center">STT</th>
                <th className="px-4 py-2 border text-center">Hạng mục</th>
                <th className="px-4 py-2 border text-center">Diện Tích</th>
                <th className="px-4 py-2 border text-center">Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-center">1</td>
                <td className="px-4 py-2 border text-left">Phần hoàn thiện</td>
                <td className="px-4 py-2 border text-center font-bold">
                  {totalArea}
                </td>
                <td className="px-4 py-2 border text-center font-bold">m²</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConstructionAreaTable;
