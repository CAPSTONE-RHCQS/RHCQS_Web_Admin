import React from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';

export interface HouseDesignTableProps {
  data: Array<{
    Id: string;
    Name: string;
    Step: number;
    Status: string;
    Type: string;
    InsDate: string;
    style: {
      backgroundColor: string;
      icon: JSX.Element;
    };
  }>;
  isLoading: boolean;
  onEditSuccess: () => void;
}

const stepIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 20V16H8V12H12V8H16V4H20V20H4Z" fill="white" />
  </svg>
);

const HouseDesignTable: React.FC<HouseDesignTableProps> = ({
  data,
  isLoading,
  onEditSuccess,
}) => {
  const navigate = useNavigate();

  const viewDetails = (id: string) => {
    navigate(`/house-design-detail-designstaff/${id}`);
    onEditSuccess();
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={'#5BABAC'} loading={isLoading} />
        </div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {['Tên', 'Bước', 'Ngày tạo', 'Trạng thái', ''].map(
                (header, index) => (
                  <th
                    key={header}
                    className={`py-4 px-4 font-medium text-black dark:text-white ${
                      index === 1 || index === 3 ? 'text-center' : 'text-left'
                    }`}
                    style={{
                      width:
                        index === 0 ? '150px' : index === 2 ? '120px' : 'auto',
                    }}
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="cursor-pointer">
                <td
                  className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-left"
                  style={{ width: '150px' }}
                >
                  {item.Name}
                </td>
                <td
                  className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center"
                  style={{ width: '100px' }}
                >
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-white whitespace-nowrap"
                    style={{
                      backgroundColor: '#3498DB',
                    }}
                  >
                    {stepIcon}
                    <span className="ml-2 text-white">Bước {item.Step}</span>
                  </span>
                </td>
                <td
                  className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-left"
                  style={{ width: '120px' }}
                >
                  {new Date(item.InsDate).toLocaleDateString()}
                </td>
                <td
                  className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center"
                  style={{ width: '100px' }}
                >
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-white whitespace-nowrap"
                    style={{
                      backgroundColor: item.style.backgroundColor,
                    }}
                  >
                    {item.style.icon}
                    <span className="ml-2">{item.Status}</span>
                  </span>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-left">
                  <button
                    onClick={() => viewDetails(item.Id)}
                    className="text-primaryGreenButton hover:text-secondaryGreenButton transition mr-2"
                  >
                    <FaEye className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default HouseDesignTable;
