import React from 'react';
import CheckboxTwo from '../components/Checkboxes/CheckboxTwo';
import EditButton from '../components/Buttonicons/EditButton';
import DeleteButton from '../components/Buttonicons/DeleteButton';
import DownloadButton from '../components/Buttonicons/DownloadButton';
import SortIcon from '../components/Buttonicons/SortIcon';

type DataItem = {
  [key: string]: any;
};

type SortKey = string;

interface StaffTableProps {
  data: DataItem[];
  columns: { key: string; label: string; width?: string }[];
  isAllChecked: boolean;
  handleSelectAll: () => void;
  handleCheckboxChange: (index: number) => void;
  handleSort: (key: SortKey) => void;
  handleDelete: (id: string) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({
  data,
  columns,
  isAllChecked,
  handleSelectAll,
  handleCheckboxChange,
  handleSort,
  handleDelete,
}) => {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-2 text-left dark:bg-meta-4">
          <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
            <CheckboxTwo
              id="select-all"
              isChecked={isAllChecked}
              onChange={handleSelectAll}
            />
          </th>
          {columns.map((column) => (
            <th
              key={column.key}
              className="py-4 px-4 font-medium text-black dark:text-white"
              style={{ width: column.width, whiteSpace: 'nowrap' }}
            >
              <div className="flex items-center space-x-1">
                <span>{column.label}</span>
                <SortIcon onClick={() => handleSort(column.key)} />
              </div>
            </th>
          ))}
          <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <CheckboxTwo
                id={`checkbox-${index}`}
                isChecked={item.isChecked}
                onChange={() => handleCheckboxChange(index)}
              />
            </td>
            {columns.map((column) => (
              <td
                key={column.key}
                className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                style={{ width: column.width }}
              >
                {column.key === 'avatar' ? (
                  <img
                    src={item[column.key]}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-2 border-gray-300 shadow-lg"
                  />
                ) : (
                  <p className="text-black dark:text-white">
                    {item[column.key]}
                  </p>
                )}
              </td>
            ))}
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <div className="flex items-center space-x-3.5">
                <EditButton />
                <DeleteButton onClick={() => handleDelete(item.id)} />
                <DownloadButton />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StaffTable;
