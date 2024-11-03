import React, { useState } from 'react';
import {
  Construction,
  GetConstructionByNameResponse,
} from '../../../../types/InitialQuotationTypes';
import { getConstructionByName } from '../../../../api/InitialQuotation/InitialQuotationApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface TableRow {
  stt: number;
  hangMuc: string;
  dTich: string;
  heSo: string;
  dienTich: string;
  donVi: string;
  uniqueId?: string;
  constructionItemId?: string;
  subConstructionId?: string | null;
}

interface ConstructionAreaTableProps {
  tableData: TableRow[];
  isEditing: boolean;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof TableRow,
  ) => void;
  totalDienTich: number;
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;
}

const ConstructionAreaTable: React.FC<ConstructionAreaTableProps> = ({
  tableData,
  isEditing,
  handleInputChange,
  totalDienTich,
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
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
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
              <td className="px-4 py-2 border text-center border-2 border-green-300">
                <input
                  type="text"
                  value={item.hangMuc}
                  onChange={(e) => {
                    handleInputChange(e, index, 'hangMuc');
                    handleSearch(e.target.value, index);
                  }}
                  className="w-full text-left"
                  disabled={!isEditing}
                />
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
              <td className="px-4 py-2 border text-center border-2 border-green-300">
                <input
                  type="text"
                  value={item.dTich}
                  onChange={(e) => handleInputChange(e, index, 'dTich')}
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="text"
                  value={item.heSo}
                  onChange={(e) => handleInputChange(e, index, 'heSo')}
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="text"
                  value={item.dienTich}
                  onChange={(e) => handleInputChange(e, index, 'dienTich')}
                  className="w-full text-center"
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2 border text-center">{item.donVi}</td>
              {isEditing && (
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr>
            <td className="px-4 py-2 border text-center" colSpan={4}>
              <strong>Tổng diện tích xây dựng theo phương án thiết kế:</strong>
            </td>
            <td className="px-4 py-2 border text-center">
              <strong>
                {isNaN(totalDienTich) ? '0' : totalDienTich.toString()}
              </strong>
            </td>
            <td className="px-4 py-2 border text-center">
              <strong>m²</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ConstructionAreaTable;
