import React, { useState, useEffect } from 'react';
import { Radio } from '@material-tailwind/react';

interface DetailedQuoteRow {
  stt: number;
  noiDung: string;
  dvt: string;
  khoiLuong: number;
  donGiaNhanCong: number;
  donGiaVatTuTho: number;
  donGiaVatTuHT: number;
  thanhTienNhanCong: number;
  thanhTienVatTuTho: number;
  thanhTienVatTuHT: number;
  ghiChu: string;
  subItems?: string[];
}

const initialDetailedQuoteData: DetailedQuoteRow[] = [
  {
    stt: 1,
    noiDung: 'Móng',
    dvt: 'm²',
    khoiLuong: 90,
    donGiaNhanCong: 100000,
    donGiaVatTuTho: 200000,
    donGiaVatTuHT: 300000,
    thanhTienNhanCong: 9000000,
    thanhTienVatTuTho: 18000000,
    thanhTienVatTuHT: 27000000,
    ghiChu: '',
    subItems: ['Móng đơn', 'Móng cọc', 'Móng bè, móng 2 phương'],
  },
  {
    stt: 2,
    noiDung: 'Trệt',
    dvt: 'm²',
    khoiLuong: 90,
    donGiaNhanCong: 100000,
    donGiaVatTuTho: 200000,
    donGiaVatTuHT: 300000,
    thanhTienNhanCong: 9000000,
    thanhTienVatTuTho: 18000000,
    thanhTienVatTuHT: 27000000,
    ghiChu: '',
  },
  {
    stt: 3,
    noiDung: 'Sân',
    dvt: 'm²',
    khoiLuong: 10,
    donGiaNhanCong: 100000,
    donGiaVatTuTho: 200000,
    donGiaVatTuHT: 300000,
    thanhTienNhanCong: 1000000,
    thanhTienVatTuTho: 2000000,
    thanhTienVatTuHT: 3000000,
    ghiChu: '',
  },
  {
    stt: 4,
    noiDung: 'Sân thượng mái che',
    dvt: 'm²',
    khoiLuong: 45,
    donGiaNhanCong: 100000,
    donGiaVatTuTho: 200000,
    donGiaVatTuHT: 300000,
    thanhTienNhanCong: 4500000,
    thanhTienVatTuTho: 9000000,
    thanhTienVatTuHT: 13500000,
    ghiChu: '',
  },
  {
    stt: 5,
    noiDung: 'Mái',
    dvt: 'm²',
    khoiLuong: 45,
    donGiaNhanCong: 100000,
    donGiaVatTuTho: 200000,
    donGiaVatTuHT: 300000,
    thanhTienNhanCong: 4500000,
    thanhTienVatTuTho: 9000000,
    thanhTienVatTuHT: 13500000,
    ghiChu: '',
    subItems: [
      'Mái BTCT',
      'Mái ngói kèo thép (Nghiêng 30 độ)',
      'Mái ngói kèo thép (Nghiêng 45 độ)',
      'Mái ngói BTCT lợp ngói (Nghiêng 30 độ)',
      'Mái ngói BTCT lợp ngói (Nghiêng 45 độ)',
      'Mái BTCT Nghiêng',
    ],
  },
];

const DetailedQuotation = () => {
  const [detailedQuoteData, setDetailedQuoteData] = useState<
    DetailedQuoteRow[]
  >(initialDetailedQuoteData);
  const [selectedSubItems, setSelectedSubItems] = useState<{
    [key: number]: string;
  }>({});
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    // Initialize selected sub-items with the first sub-item for each row that has sub-items
    const initialSelectedSubItems: { [key: number]: string } = {};
    detailedQuoteData.forEach((row) => {
      if (row.subItems && row.subItems.length > 0) {
        initialSelectedSubItems[row.stt] = row.subItems[0];
      }
    });
    setSelectedSubItems(initialSelectedSubItems);
  }, [detailedQuoteData]);

  const handleSubItemChange = (rowStt: number, subItem: string) => {
    setSelectedSubItems((prev) => ({
      ...prev,
      [rowStt]: subItem,
    }));
  };

  const toggleRow = (rowIndex: number) => {
    setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
  };

  const handleInputChange = (
    index: number,
    field: keyof DetailedQuoteRow,
    value: string,
  ) => {
    const updatedData = [...detailedQuoteData];
    updatedData[index] = {
      ...updatedData[index],
      [field]:
        field === 'khoiLuong' ||
        field === 'donGiaNhanCong' ||
        field === 'donGiaVatTuTho' ||
        field === 'donGiaVatTuHT'
          ? parseFloat(value)
          : value,
    };
    setDetailedQuoteData(updatedData);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo báo giá chi tiết</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-lg font-medium mb-2">
            Tên khách hàng:
          </label>
          <input
            type="text"
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Đơn giá thi công:
          </label>
          <input
            type="text"
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Địa chỉ thi công:
          </label>
          <input
            type="text"
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Diện tích đất (m²):
          </label>
          <input
            type="text"
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Version:</label>
          <input
            type="text"
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Diện tích xây dựng (m²):
          </label>
          <input
            type="text"
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Số tầng lầu:</label>
          <input
            type="text"
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Bản vẽ thiết kế</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700">Phối cảnh:</label>
              <input
                type="text"
                className="w-2/3 mt-1 p-2 border rounded"
                placeholder="PC 1.0"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700">Kiến trúc:</label>
              <input
                type="text"
                className="w-2/3 mt-1 p-2 border rounded"
                placeholder="KT 1.0"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700">Kết cấu:</label>
              <input
                type="text"
                className="w-2/3 mt-1 p-2 border rounded"
                placeholder="KC 1.0"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700">Điện & nước:</label>
              <input
                type="text"
                className="w-2/3 mt-1 p-2 border rounded"
                placeholder="ĐC 1.0"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isEditing ? 'Lưu' : 'Chỉnh sửa'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center" rowSpan={2}>
                STT
              </th>
              <th className="px-4 py-2 border text-center" rowSpan={2}>
                Nội dung công việc
              </th>
              <th className="px-4 py-2 border text-center" rowSpan={2}>
                ĐVT
              </th>
              <th className="px-4 py-2 border text-center" rowSpan={2}>
                Khối lượng
              </th>
              <th className="px-4 py-2 border text-center" colSpan={3}>
                Đơn giá
              </th>
              <th className="px-4 py-2 border text-center" colSpan={3}>
                Thành tiền
              </th>
              <th className="px-4 py-2 border text-center" rowSpan={2}>
                Ghi chú
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 border text-center">Nhân công</th>
              <th className="px-4 py-2 border text-center">Vật tư thô</th>
              <th className="px-4 py-2 border text-center">Vật tư H.T</th>
              <th className="px-4 py-2 border text-center">Nhân công</th>
              <th className="px-4 py-2 border text-center">Vật tư thô</th>
              <th className="px-4 py-2 border text-center">Vật tư H.T</th>
            </tr>
          </thead>
          <tbody>
            {detailedQuoteData.map((row, index) => (
              <React.Fragment key={row.stt}>
                <tr onClick={() => toggleRow(index)} className="cursor-pointer">
                  <td className="px-4 py-2 border text-center">{row.stt}</td>
                  <td className="px-4 py-2 border text-center">
                    {row.noiDung}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="text"
                      value={row.dvt}
                      onChange={(e) =>
                        handleInputChange(index, 'dvt', e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="number"
                      value={row.khoiLuong}
                      onChange={(e) =>
                        handleInputChange(index, 'khoiLuong', e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="number"
                      value={row.donGiaNhanCong}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          'donGiaNhanCong',
                          e.target.value,
                        )
                      }
                      className="w-full p-1 border rounded"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="number"
                      value={row.donGiaVatTuTho}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          'donGiaVatTuTho',
                          e.target.value,
                        )
                      }
                      className="w-full p-1 border rounded"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="number"
                      value={row.donGiaVatTuHT}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          'donGiaVatTuHT',
                          e.target.value,
                        )
                      }
                      className="w-full p-1 border rounded"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.thanhTienNhanCong.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.thanhTienVatTuTho.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.thanhTienVatTuHT.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="text"
                      value={row.ghiChu}
                      onChange={(e) =>
                        handleInputChange(index, 'ghiChu', e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      disabled={!isEditing}
                    />
                  </td>
                </tr>
                {row.subItems && expandedRow === index && (
                  <tr>
                    <td colSpan={12} className="px-4 py-2 border text-left">
                      {row.subItems.map((subItem) => (
                        <div key={subItem} className="my-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`subItem-${row.stt}`}
                              value={subItem}
                              checked={selectedSubItems[row.stt] === subItem}
                              onChange={() =>
                                handleSubItemChange(row.stt, subItem)
                              }
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span>{subItem}</span>
                          </label>
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedQuotation;
