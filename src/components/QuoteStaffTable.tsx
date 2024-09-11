import React from 'react';
import CheckboxTwo from './Checkboxes/CheckboxTwo';
import EditButton from './Buttonicons/EditButton';
import DeleteButton from './Buttonicons/DeleteButton';
import DownloadButton from './Buttonicons/DownloadButton';
import SortIcon from './Buttonicons/SortIcon';
import { Link } from 'react-router-dom';

type DataItem = {
  [key: string]: any;
};

type SortKey = string;

interface QuoteStaffTableProps {
  data: DataItem[];
  columns: { key: string; label: string }[];
  isAllChecked: boolean;
  handleSelectAll: () => void;
  handleCheckboxChange: (index: number) => void;
  handleSort: (key: SortKey) => void;
  handleDelete: (id: string) => void;
}

const QuoteStaffTable: React.FC<QuoteStaffTableProps> = ({
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
              className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
            >
              {column.label}
              <SortIcon onClick={() => handleSort(column.key)} />
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
              >
                {column.key === 'status' ? (
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      item[column.key] === 'Hoàn thành'
                        ? 'bg-success text-success'
                        : item[column.key] === 'Chờ xác nhận'
                        ? 'bg-warning text-warning'
                        : item[column.key] === 'Đang xử lý'
                        ? 'bg-info text-info'
                        : 'bg-danger text-danger'
                    }`}
                  >
                    {item[column.key]}
                  </p>
                ) : column.key === 'contractValue' ? (
                  <p className="text-black dark:text-white">
                    {item[column.key].toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </p>
                ) : (
                  <p className="text-black dark:text-white">
                    {item[column.key]}
                  </p>
                )}
              </td>
            ))}
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <div className="flex items-center space-x-3.5">
                <Link to={`/quotedetail`}>
                  <EditButton />
                </Link>
                <DeleteButton onClick={() => handleDelete(item.id)} />
                <Link to={`/quotedetail`}>
                  <DownloadButton />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuoteStaffTable;
