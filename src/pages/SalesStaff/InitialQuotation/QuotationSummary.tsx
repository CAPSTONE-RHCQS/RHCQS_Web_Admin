import React from 'react';
import ConstructionAreaTable from '../components/Table/ConstructionAreaTable';
import { InitialQuotationResponse } from '../../../types/InitialQuotationTypes';
import { TableRow } from './components/types';

interface QuotationSummaryProps {
  quotationData: InitialQuotationResponse;
  tableData: TableRow[];
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;
  isEditing: boolean;
  totalDienTich: number;
  donGia: number;
  thanhTien: number;
  utilityInfos: any[];
  totalUtilityCost: number;
  promotionInfo: any;
  giaTriHopDong: number;
  paymentSchedule: any[];
  totalPercentage: number;
  totalAmount: number;
}

const QuotationSummary: React.FC<QuotationSummaryProps> = ({
  quotationData,
  tableData,
  setTableData,
  isEditing,
  totalDienTich,
  donGia,
  thanhTien,
  utilityInfos,
  totalUtilityCost,
  promotionInfo,
  giaTriHopDong,
  paymentSchedule,
  totalPercentage,
  totalAmount,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Thông tin báo giá sơ bộ</h2>
        <div className="text-right">
          <span className="font-semibold">Phiên bản:</span>
          <span className="text-gray-700 ml-2">{quotationData.Version}</span>
          <div className="text-gray-500 text-sm">
            Tạo lúc {new Date(quotationData.InsDate).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="mt-4 mb-4 text-lg">
          <strong>Diện tích xây dựng theo phương án thiết kế:</strong>
        </p>
        <button
          onClick={() =>
            setTableData([
              ...tableData,
              {
                stt: tableData.length + 1,
                hangMuc: '',
                dTich: '',
                heSo: '',
                dienTich: '',
                donVi: 'm²',
              },
            ])
          }
          className="bg-blue-500 text-white px-2 py-1 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
        >
          +
        </button>
      </div>

      <ConstructionAreaTable
        tableData={tableData}
        isEditing={isEditing}
        handleInputChange={(e, index, field) => {
          const newData = [...tableData];
          newData[index] = { ...newData[index], [field]: e.target.value };
          setTableData(newData);
        }}
        totalDienTich={totalDienTich}
        setTableData={setTableData}
      />

      <p className="text-lg mb-4">
        <strong>Giá trị báo giá sơ bộ xây dựng trước thuế:</strong>
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">
                Tổng diện tch xây dựng
              </th>
              <th className="px-4 py-2 border text-center">x</th>
              <th className="px-4 py-2 border text-center">Đơn giá</th>
              <th className="px-4 py-2 border text-center">=</th>
              <th className="px-4 py-2 border text-center">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border text-center">
                {totalDienTich} m²
              </td>
              <td className="px-4 py-2 border text-center">x</td>
              <td className="px-4 py-2 border text-center">
                {donGia.toLocaleString()} đồng/m²
              </td>
              <td className="px-4 py-2 border text-center">=</td>
              <td className="px-4 py-2 border text-center">
                <strong> {thanhTien.toLocaleString()} đồng</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-lg mb-4">
        <strong>2. TÙY CHỌN & TIỆN ÍCH:</strong>
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">Mô tả</th>
              <th className="px-4 py-2 border text-center">Hệ số</th>
              <th className="px-4 py-2 border text-center">Giá</th>
            </tr>
          </thead>
          <tbody>
            {utilityInfos.map((utility) => (
              <tr key={utility.Id}>
                <td className="px-4 py-2 border text-left">
                  {utility.Description}
                </td>
                <td className="px-4 py-2 border text-center">
                  {utility.Coefficient}
                </td>
                <td className="px-4 py-2 border text-center">
                  {utility.Price.toLocaleString()} VNĐ
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-4 py-2 border text-center" colSpan={2}>
                <strong>Tổng chi phí tiện ích</strong>
              </td>
              <td className="px-4 py-2 border text-center">
                <strong>{totalUtilityCost.toLocaleString()} VNĐ</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-lg mb-4">
        <strong>3. KHUYẾN MÃI:</strong>
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">Tên khuyến mãi</th>
              <th className="px-4 py-2 border text-center">Giá trị (%)</th>
            </tr>
          </thead>
          <tbody>
            {promotionInfo ? (
              <tr>
                <td className="px-4 py-2 border text-left">
                  {promotionInfo.Name}
                </td>
                <td className="px-4 py-2 border text-center">
                  {promotionInfo.Value}%
                </td>
              </tr>
            ) : (
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={2}>
                  Không có khuyến mãi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <p className="text-lg">
          <strong>4. CÁC THỎA THUẬN KHÁC:</strong>
        </p>
        <p className="text-gray-700 whitespace-pre-line">
          {quotationData.OthersAgreement}
        </p>
      </div>

      <p className="text-lg mb-4">
        <strong>5. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:</strong>
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">Mô tả</th>
              <th className="px-4 py-2 border text-center">Giá trị</th>
              <th className="px-4 py-2 border text-center">Đơn vị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border text-left">Phần Thô Tiết Kiệm</td>
              <td className="px-4 py-2 border text-center">
                {thanhTien.toLocaleString()} VNĐ
              </td>
              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border text-left">
                Tùy chọn & Tiện ích
              </td>
              <td className="px-4 py-2 border text-center">
                {totalUtilityCost.toLocaleString()} VNĐ
              </td>
              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
            {promotionInfo && (
              <tr>
                <td className="px-4 py-2 border text-left">
                  Khuyến mãi ({promotionInfo.Name})
                </td>
                <td className="px-4 py-2 border text-center">
                  -
                  {(
                    giaTriHopDong *
                    (promotionInfo.Value / 100)
                  ).toLocaleString()}{' '}
                  VNĐ
                </td>
                <td className="px-4 py-2 border text-center">VNĐ</td>
              </tr>
            )}
            <tr>
              <td className="px-4 py-2 border text-center">
                <strong>GIÁ TRỊ HỢP ĐỒNG</strong>
              </td>
              <td className="px-4 py-2 border text-center">
                <strong>{giaTriHopDong.toLocaleString()} VNĐ</strong>
              </td>
              <td className="px-4 py-2 border text-center">
                <strong>VNĐ</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-lg mb-4">
        <strong>6. CÁC ĐT THANH TOÁN:</strong>
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th
                className="px-4 py-2 border text-center"
                style={{ width: '10%' }}
              >
                Đợt
              </th>
              <th className="px-4 py-2 border text-left">Nội dung</th>
              <th className="px-4 py-2 border text-center">T-Toán (%)</th>
              <th className="px-4 py-2 border text-center">Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {paymentSchedule.map((row, index) => (
              <tr key={row.Id}>
                <td
                  className="px-4 py-2 border text-center"
                  style={{ width: '10%' }}
                >
                  {index + 1}
                </td>
                <td className="px-4 py-2 border text-left">
                  {row.Description}
                </td>
                <td className="px-4 py-2 border text-center">
                  {row.Percents}%
                </td>
                <td className="px-4 py-2 border text-center">
                  {row.Price.toLocaleString()} {row.Unit}
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-4 py-2 border text-center" colSpan={2}>
                <strong>Tổng giá trị hợp đồng</strong>
              </td>
              <td className="px-4 py-2 border text-center">
                <strong>{totalPercentage}%</strong>
              </td>
              <td className="px-4 py-2 border text-center">
                <strong>{totalAmount.toLocaleString()} VNĐ</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationSummary;
