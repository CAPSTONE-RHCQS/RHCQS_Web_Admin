import React, { useEffect } from 'react';

interface ContractValueSummaryTableProps {
  thanhTien: number;
  totalUtilityCost: number;
  promotionInfo: any;
  updateGiaTriHopDong: (value: number) => void;
}

const ContractValueSummaryTable: React.FC<ContractValueSummaryTableProps> = ({
  thanhTien,
  totalUtilityCost,
  promotionInfo,
  updateGiaTriHopDong,
}) => {
  const discount = promotionInfo ? (thanhTien + totalUtilityCost) * (promotionInfo.Value / 100) : 0;
  const giaTriHopDong = thanhTien + totalUtilityCost - discount;

  useEffect(() => {
    updateGiaTriHopDong(giaTriHopDong);
  }, [giaTriHopDong, updateGiaTriHopDong]);

  return (
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
            <td className="px-4 py-2 border text-left">Tùy chọn & Tiện ích</td>
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
                -{discount.toLocaleString()} VNĐ
              </td>
              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
          )}
          <tr>
            <td className="px-4 py-2 border text-left">Tổng giá trị hợp đồng</td>
            <td className="px-4 py-2 border text-center">
              {giaTriHopDong.toLocaleString()} VNĐ
            </td>
            <td className="px-4 py-2 border text-center">VNĐ</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContractValueSummaryTable; 