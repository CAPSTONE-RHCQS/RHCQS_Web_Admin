import React, { useState, useEffect } from 'react';
import { ConstructionWorkItem, fetchDinhMuc } from '../api/GOVapi';
import {
  FaSearch,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaInfoCircle,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: ConstructionWorkItem) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ConstructionWorkItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [maCongViec, setMaCongViec] = useState('');
  const pageSize = 30;
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleSearch();
    }
  }, [pageIndex]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDinhMuc({
        pageIndex,
        tenCongViec: searchTerm,
        maCongViec,
      });
      setSearchResults(data.Items);
      setTotalRows(data.TotalRow);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (pageIndex * pageSize < totalRows) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    isOpen && (
      <motion.div
        className="fixed inset-0 bg-gray-900 ml-30 mt-17 bg-opacity-80 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOutsideClick}
      >
        {isLoading && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
            <ClipLoader size={50} color="#000" />
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-xl w-3/4">
          <div className="flex justify-between items-center">
            <div className="flex items-center mb-6">
              <h2 className="text-xl font-bold text-left text-white bg-[#007acc] px-4 py-2 rounded flex items-center">
                <img
                  src="https://cuckinhtexd.gov.vn/UploadedFiles/Hinh-Anh/250px-Emblem_of_Vietnam-svg.png"
                  alt="Logo"
                  className="mr-2"
                  style={{ width: '20px', height: 'auto' }}
                />
                Tra cứu định mức
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex items-center mb-4 space-x-2">
            <div className="flex flex-col w-1/3">
              <label className="text-gray-700">Mã hiệu</label>
              <input
                type="text"
                value={maCongViec}
                onChange={(e) => setMaCongViec(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                placeholder="Nhập mã hiệu"
              />
            </div>
            <div className="flex flex-col w-1/3">
              <label className="text-gray-700">Tên công việc </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                placeholder="Nhập tên công việc"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">
                <span className="relative group">
                  <FaInfoCircle className="cursor-pointer" onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} />
                  {showInfo && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-5 ml-50 w-150 bg-white text-black text-sm rounded shadow-lg p-2 transition-opacity duration-200">
                      <strong>
                        Định mức dự toán xây dựng công trình số 10/2019/TT-BXD
                      </strong>
                      <br />
                      <strong>HƯỚNG DẪN:</strong> Hãy nhập từ khóa vào ô “Mã hiệu”
                      hoặc “Tên công việc” liên quan tới công việc muốn tra cứu.
                      <br />
                      Ví dụ: - "AC.21": Tất cả các công việc có mã hiệu là AC.21
                      trong mã hiệu.
                      <br />- "bê tông": Tất cả các công việc có tên với từ khóa
                      "bê tông".
                    </div>
                  )}
                </span>
              </label>
              <button
                onClick={handleSearch}
                className="bg-primaryGreenButton text-white px-4 py-2 rounded flex items-center hover:bg-primaryDarkGreen transition duration-200 ease-in-out h-full"
                style={{ height: '100%' }}
              >
                <FaSearch />
              </button>
            </div>
          </div>

          <h3>Kết quả tra cứu {totalRows.toLocaleString()} kết quả</h3>
          <div className="mt-4 max-h-100 overflow-y-auto border-t border-b">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-b border-r border-gray-300 p-2 text-center">
                    Mã hiệu
                  </th>
                  <th className="border-b border-r border-gray-300 p-2 text-center">
                    Tên công việc
                  </th>
                  <th className="border-b border-r border-gray-300 p-2 text-center">
                    Đơn vị
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((item, index) => (
                  <tr
                    key={item.IDCongViecDinhMuc}
                    onClick={() => onSelect(item)}
                    className={`cursor-pointer transition-colors duration-200 hover:bg-[#d1d5db] ${
                      index % 2 === 0 ? 'bg-[#f0f0f0]' : 'bg-[#ffffff]'
                    }`}
                  >
                    <td className="border-b border-r border-gray-300 p-2">
                      {item.Ma}
                    </td>
                    <td className="border-b border-r border-gray-300 p-2">
                      {item.Ten}
                    </td>
                    <td className="border-b p-2">{item.DonViTinh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handlePreviousPage}
              disabled={pageIndex === 1}
              className={`px-4 py-2 rounded transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 ${
                pageIndex === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-secondaryGreenButton text-white hover:bg-primaryGreenButton focus:ring-secondaryGreenButton'
              }`}
            >
              <FaArrowLeft />
            </button>

            <div className="flex items-center">
              <input
                type="number"
                value={pageIndex}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue === '') {
                    setPageIndex(1);
                  } else {
                    const newPageIndex = Number(newValue);
                    if (
                      newPageIndex > 0 &&
                      newPageIndex <= Math.ceil(totalRows / pageSize)
                    ) {
                      setPageIndex(newPageIndex);
                    }
                  }
                }}
                onBlur={(e) => {
                  const newPageIndex = Number(e.target.value);
                  if (newPageIndex < 1) {
                    setPageIndex(1);
                  } else if (newPageIndex > Math.ceil(totalRows / pageSize)) {
                    setPageIndex(Math.ceil(totalRows / pageSize));
                  }
                }}
                className="border p-1 w-14 text-center rounded"
                min={1}
                max={Math.ceil(totalRows / pageSize)}
              />
              <span className="mx-1 text-lg">
                / {Math.ceil(totalRows / pageSize)}
              </span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={pageIndex * pageSize >= totalRows}
              className={`px-4 py-2 rounded transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 ${
                pageIndex * pageSize >= totalRows
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-secondaryGreenButton text-white hover:bg-primaryGreenButton focus:ring-secondaryGreenButton'
              }`}
            >
              <FaArrowRight />
            </button>
          </div>
          <div className="mt-4 text-center text-gray-600">
            Bản quyền thuộc về Cục Kinh tế xây dựng - Bộ Xây dựng
          </div>
        </div>
      </motion.div>
    )
  );
};

export default SearchModal;
